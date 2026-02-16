import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Estudiante, Pago, Clase, EstadoPago } from '@/types';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface AppContextType {
  estudiantes: Estudiante[];
  agregarEstudiante: (estudianteData: Omit<Estudiante, 'id'>) => Promise<void>;
  agregarPago: (pagoData: Omit<Pago, 'id'>) => Promise<void>;
  agregarClase: (claseData: Omit<Clase, 'id'>) => Promise<void>;
  editarEstudiante: (estudianteId: string, updates: Partial<Estudiante>) => Promise<void>;
  eliminarEstudiante: (estudianteId: string) => Promise<void>;
  actualizarHorarioEstudiante: (estudianteId: string, nuevoDia: Estudiante['diaSemana'], nuevaHora: string) => Promise<void>;
  eliminarClase: (claseId: string) => Promise<void>;
  editarClase: (claseId: string, updates: Partial<Clase>) => Promise<void>;
  cargando: boolean;
  pagos: Pago[];
  clases: Clase[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('auth_token');
  return token ? { 'Authorization': `Token ${token}` } : {};
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [clases, setClases] = useState<Clase[]>([]);
  const [cargando, setCargando] = useState(true);
  
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const isAuthenticated = !!token;

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('auth_token'));
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setCargando(false);
      return;
    }

    const fetchData = async () => {
      try {
        setCargando(true);
        const currentToken = localStorage.getItem('auth_token');
        const headers = currentToken ? { 'Authorization': `Token ${currentToken}` } : {};
        
        const estudiantesResponse = await fetch(`${API_URL}/estudiantes/`, { headers });
        
        if (!estudiantesResponse.ok) {
          if (estudiantesResponse.status === 403 || estudiantesResponse.status === 401) {
            setCargando(false);
            return;
          }
          throw new Error('Error al cargar estudiantes');
        }
        
        const estudiantesData = await estudiantesResponse.json();
        
        const transformedEstudiantes = estudiantesData.map((estudiante: any) => ({
          id: estudiante.id.toString(),
          nombre: estudiante.nombre,
          telefono: estudiante.telefono || '',
          fechaInscripcion: estudiante.fecha_inscripcion,
          activo: estudiante.activo || true,
          montoMensual: parseFloat(estudiante.monto_mensual) || 0,
          diaSemana: estudiante.dia_semana || 'lunes',
          horaClase: estudiante.hora_clase || '18:00',
          estadoPago: (estudiante.estado_pago as EstadoPago) || 'pendiente'
        }));
        
        setEstudiantes(transformedEstudiantes);

        const pagosResponse = await fetch(`${API_URL}/pagos/`, { headers });
        if (pagosResponse.ok) {
          const pagosData = await pagosResponse.json();
          const transformedPagos = pagosData.map((pago: any) => ({
            id: pago.id.toString(),
            estudianteId: pago.estudiante?.toString() || pago.estudiante_id?.toString(),
            monto: parseFloat(pago.monto) || 0,
            montoPagado: parseFloat(pago.monto_pagado) || 0,
            fecha: pago.fecha,
            metodo: pago.metodo as 'efectivo' | 'transferencia' | 'tarjeta'
          }));
          setPagos(transformedPagos.filter((p: Pago) => p.estudianteId));
        }

        const clasesResponse = await fetch(`${API_URL}/clases/`, { headers });
        if (clasesResponse.ok) {
          const clasesData = await clasesResponse.json();
          const transformedClases = clasesData.map((claseItem: any) => ({
            id: claseItem.id.toString(),
            estudianteId: claseItem.estudiante?.toString() || claseItem.estudiante_id?.toString(),
            fecha: claseItem.fecha,
            duracion: claseItem.duracion || 60,
            observaciones: claseItem.observaciones || '',
            completada: claseItem.completada || true,
            tema: claseItem.tema || ''
          }));
          setClases(transformedClases.filter((c: Clase) => c.estudianteId));
        }

      } catch (error) {
        console.error('Error cargando datos:', error);
        if (isAuthenticated) {
          toast.error('Error al cargar los datos');
        }
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, [token]);

  const getHeaders = (): HeadersInit => {
    const t = localStorage.getItem('auth_token');
    return t ? { 'Authorization': `Token ${t}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
  };

  const getHeadersNoContent = (): HeadersInit => {
    const t = localStorage.getItem('auth_token');
    return t ? { 'Authorization': `Token ${t}` } : {};
  };

  const agregarEstudiante = async (estudianteData: Omit<Estudiante, 'id'>) => {
    try {
      const response = await fetch(`${API_URL}/estudiantes/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          nombre: estudianteData.nombre,
          telefono: estudianteData.telefono || '',
          monto_mensual: estudianteData.montoMensual || 0,
          dia_semana: estudianteData.diaSemana || 'lunes',
          hora_clase: estudianteData.horaClase || '18:00',
          estado_pago: estudianteData.estadoPago || 'pendiente'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al agregar estudiante');
      }

      const data = await response.json();
      
      const nuevoEstudiante: Estudiante = {
        id: data.id.toString(),
        nombre: data.nombre,
        telefono: data.telefono,
        fechaInscripcion: data.fecha_inscripcion,
        activo: data.activo,
        montoMensual: parseFloat(data.monto_mensual) || 0,
        diaSemana: data.dia_semana,
        horaClase: data.hora_clase,
        estadoPago: data.estado_pago
      };
      
      setEstudiantes(prev => [...prev, nuevoEstudiante]);
      toast.success('Estudiante agregado correctamente');
      
    } catch (error: any) {
      console.error('Error agregando estudiante:', error);
      toast.error(error.message || 'Error al agregar estudiante');
      throw error;
    }
  };

  const agregarPago = async (pagoData: Omit<Pago, 'id'>) => {
    try {
      const headers = { 'Content-Type': 'application/json', ...getHeaders() };
      
      const response = await fetch(`${API_URL}/pagos/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          estudiante: parseInt(pagoData.estudianteId),
          monto: pagoData.monto,
          monto_pagado: pagoData.montoPagado,
          fecha: pagoData.fecha,
          metodo: pagoData.metodo
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al registrar el pago');
      }

      const data = await response.json();
      
      const nuevoPago: Pago = {
        id: data.id.toString(),
        estudianteId: pagoData.estudianteId,
        monto: parseFloat(data.monto) || 0,
        montoPagado: parseFloat(data.monto_pagado) || 0,
        fecha: data.fecha,
        metodo: data.metodo
      };

      setPagos(prev => [...prev, nuevoPago]);

      const totalPagado = [...pagos, nuevoPago]
        .filter(p => p.estudianteId === pagoData.estudianteId)
        .reduce((sum, p) => sum + p.montoPagado, 0);
      
      const estudiante = estudiantes.find(e => e.id === pagoData.estudianteId);
      if (estudiante) {
        let nuevoEstado: EstadoPago = 'pendiente';
        if (totalPagado >= estudiante.montoMensual) {
          nuevoEstado = 'pagado';
        } else if (totalPagado > 0) {
          nuevoEstado = 'parcial';
        }
        
        await fetch(`${API_URL}/estudiantes/${pagoData.estudianteId}/`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ estado_pago: nuevoEstado }),
        });
        
        setEstudiantes(prev => prev.map(e => 
          e.id === pagoData.estudianteId 
            ? { ...e, estadoPago: nuevoEstado }
            : e
        ));
      }

      toast.success('Pago registrado correctamente');
      
    } catch (error: any) {
      console.error('Error registrando pago:', error);
      toast.error(error.message || 'Error al registrar el pago');
      throw error;
    }
  };

  const agregarClase = async (claseData: Omit<Clase, 'id'>) => {
    try {
      const headers = { 'Content-Type': 'application/json', ...getHeaders() };
      
      const response = await fetch(`${API_URL}/clases/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          estudiante: parseInt(claseData.estudianteId),
          fecha: claseData.fecha,
          duracion: claseData.duracion || 60,
          observaciones: claseData.observaciones || '',
          completada: claseData.completada || true,
          tema: claseData.tema || ''
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al registrar la clase');
      }

      const data = await response.json();
      
      const nuevaClase: Clase = {
        id: data.id.toString(),
        estudianteId: claseData.estudianteId,
        fecha: data.fecha,
        duracion: data.duracion,
        observaciones: data.observaciones,
        completada: data.completada,
        tema: data.tema
      };

      setClases(prev => [...prev, nuevaClase]);
      toast.success('Clase registrada correctamente');
      
    } catch (error: any) {
      console.error('Error registrando clase:', error);
      toast.error(error.message || 'Error al registrar la clase');
      throw error;
    }
  };

  const editarEstudiante = async (estudianteId: string, updates: Partial<Estudiante>) => {
    try {
      const headers = { 'Content-Type': 'application/json', ...getHeaders() };
      
      const response = await fetch(`${API_URL}/estudiantes/${estudianteId}/`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          ...(updates.nombre && { nombre: updates.nombre }),
          ...(updates.telefono && { telefono: updates.telefono }),
          ...(updates.montoMensual !== undefined && { monto_mensual: updates.montoMensual }),
          ...(updates.diaSemana && { dia_semana: updates.diaSemana }),
          ...(updates.horaClase && { hora_clase: updates.horaClase }),
          ...(updates.estadoPago && { estado_pago: updates.estadoPago }),
          ...(updates.activo !== undefined && { activo: updates.activo }),
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar estudiante');
      }

      setEstudiantes(prev =>
        prev.map(estudiante =>
          estudiante.id === estudianteId ? { ...estudiante, ...updates } : estudiante
        )
      );
      toast.success('Estudiante actualizado');
    } catch (error: any) {
      console.error('Error actualizando estudiante:', error);
      toast.error(error.message || 'Error al actualizar estudiante');
      throw error;
    }
  };

  const eliminarEstudiante = async (estudianteId: string) => {
    try {
      const headers = getHeadersNoContent();
      
      const response = await fetch(`${API_URL}/estudiantes/${estudianteId}/`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        throw new Error('Error al eliminar estudiante');
      }

      setEstudiantes(prev => prev.filter(estudiante => estudiante.id !== estudianteId));
      setPagos(prev => prev.filter(pago => pago.estudianteId !== estudianteId));
      setClases(prev => prev.filter(clase => clase.estudianteId !== estudianteId));
      toast.success('Estudiante eliminado correctamente');
    } catch (error: any) {
      console.error('Error eliminando estudiante:', error);
      toast.error(error.message || 'Error al eliminar estudiante');
      throw error;
    }
  };

  const actualizarHorarioEstudiante = async (estudianteId: string, nuevoDia: Estudiante['diaSemana'], nuevaHora: string) => {
    try {
      await editarEstudiante(estudianteId, { 
        diaSemana: nuevoDia, 
        horaClase: nuevaHora 
      });
      toast.success('Horario actualizado correctamente');
    } catch (error: any) {
      console.error('Error actualizando horario:', error);
      toast.error(error.message || 'Error al actualizar horario');
      throw error;
    }
  };

  const eliminarClase = async (claseId: string) => {
    try {
      const headers = getHeadersNoContent();
      
      const response = await fetch(`${API_URL}/clases/${claseId}/`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        throw new Error('Error al eliminar clase');
      }

      setClases(prev => prev.filter(clase => clase.id !== claseId));
      toast.success('Clase eliminada correctamente');
    } catch (error: any) {
      console.error('Error eliminando clase:', error);
      toast.error(error.message || 'Error al eliminar clase');
      throw error;
    }
  };

  const editarClase = async (claseId: string, updates: Partial<Clase>) => {
    try {
      const headers = { 'Content-Type': 'application/json', ...getHeaders() };
      
      const response = await fetch(`${API_URL}/clases/${claseId}/`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          ...(updates.fecha && { fecha: updates.fecha }),
          ...(updates.duracion && { duracion: updates.duracion }),
          ...(updates.observaciones !== undefined && { observaciones: updates.observaciones }),
          ...(updates.completada !== undefined && { completada: updates.completada }),
          ...(updates.tema && { tema: updates.tema }),
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar clase');
      }

      setClases(prev =>
        prev.map(clase =>
          clase.id === claseId ? { ...clase, ...updates } : clase
        )
      );
      toast.success('Clase actualizada correctamente');
    } catch (error: any) {
      console.error('Error actualizando clase:', error);
      toast.error(error.message || 'Error al actualizar clase');
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        estudiantes,
        pagos: pagos.filter(p => estudiantes.some(e => e.id === p.estudianteId)),
        clases: clases.filter(c => estudiantes.some(e => e.id === c.estudianteId)),
        agregarEstudiante,
        agregarPago,
        agregarClase,
        editarEstudiante,
        eliminarEstudiante,
        actualizarHorarioEstudiante,
        eliminarClase,
        editarClase,
        cargando,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp debe ser usado dentro de AppProvider');
  }
  return context;
}
