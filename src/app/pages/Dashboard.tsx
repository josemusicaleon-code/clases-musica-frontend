import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '@/context/AppContext';
import { Estudiante, Pago, Clase, EstadoPago } from '@/types';
import { DollarSign, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// ✅ AGREGADO: Import de API_URL
import { API_URL } from '@/config/api';

export function Dashboard() {
  const navigate = useNavigate();
  const { estudiantes, pagos, clases } = useApp();

  const stats = useMemo(() => {
    // Total ganado (suma de todos los pagos)
    const totalGanado = pagos.reduce((sum, p) => sum + p.montoPagado, 0);

    // Total pendiente de cobrar
    const estudiantesConPendiente = estudiantes.filter(
      e => e.estadoPago === 'pendiente' || e.estadoPago === 'parcial'
    );
    const totalPendiente = estudiantesConPendiente.reduce((sum, e) => {
      const pagosEstudiante = pagos.filter(p => p.estudianteId === e.id);
      const pagado = pagosEstudiante.reduce((total, p) => total + p.montoPagado, 0);
      const adeudado = e.montoMensual; // ✅ CORREGIDO: El monto adeudado es el monto mensual del estudiante
      return sum + (adeudado - pagado);
    }, 0);

    // Total de clases dadas este mes
    const mesActual = new Date().getMonth();
    const añoActual = new Date().getFullYear();
    const clasesEsteMes = clases.filter(c => {
      const fechaClase = new Date(c.fecha);
      return fechaClase.getMonth() === mesActual && fechaClase.getFullYear() === añoActual;
    }).length;

    // Ingreso potencial mensual
    const potencialMensual = estudiantes.reduce((sum, e) => sum + e.montoMensual, 0);

    return {
      totalGanado,
      totalPendiente,
      clasesEsteMes,
      potencialMensual,
      estudiantesConPendiente,
    };
  }, [estudiantes, pagos, clases]);

  const statusColors = {
    pagado: 'bg-green-500/10 text-green-400 border border-green-500/30',
    pendiente: 'bg-[#C10801]/20 text-[#C10801] border border-[#C10801]/40',
    parcial: 'bg-[#F16001]/20 text-[#F16001] border border-[#F16001]/40',
  };

  const statusLabels = {
    pagado: 'Pagado',
    pendiente: 'Pendiente',
    parcial: 'Parcial',
  };

  const pagosRecientes = useMemo(() => {
    return [...pagos]
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 5)
      .map(pago => {
        const estudiante = estudiantes.find(e => e.id === pago.estudianteId);
        return { ...pago, nombreEstudiante: estudiante?.nombre || 'Desconocido' };
      });
  }, [pagos, estudiantes]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-[#D9C3AB] mb-8">Dashboard Financiero</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg border border-[#F16001]/20">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg flex items-center justify-center border border-green-500/30">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-[#D9C3AB]/60">Total Ganado</p>
              <p className="text-2xl font-bold text-[#D9C3AB]">${stats.totalGanado.toLocaleString('es-CL')}</p>
            </div>
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg border border-[#F16001]/20">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-[#C10801]/20 to-[#C10801]/10 rounded-lg flex items-center justify-center border border-[#C10801]/30">
              <AlertCircle className="w-6 h-6 text-[#C10801]" />
            </div>
            <div>
              <p className="text-sm text-[#D9C3AB]/60">Pendiente Cobrar</p>
              <p className="text-2xl font-bold text-[#D9C3AB]">${stats.totalPendiente.toLocaleString('es-CL')}</p>
            </div>
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg border border-[#F16001]/20">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-[#F16001]/20 to-[#C10801]/20 rounded-lg flex items-center justify-center border border-[#F16001]/30">
              <Calendar className="w-6 h-6 text-[#F16001]" />
            </div>
            <div>
              <p className="text-sm text-[#D9C3AB]/60">Clases Este Mes</p>
              <p className="text-2xl font-bold text-[#D9C3AB]">{stats.clasesEsteMes}</p>
            </div>
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg border border-[#F16001]/20">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-[#D9C3AB]/20 to-[#D9C3AB]/10 rounded-lg flex items-center justify-center border border-[#D9C3AB]/30">
              <TrendingUp className="w-6 h-6 text-[#D9C3AB]" />
            </div>
            <div>
              <p className="text-sm text-[#D9C3AB]/60">Potencial Mensual</p>
              <p className="text-2xl font-bold text-[#D9C3AB]">${stats.potencialMensual.toLocaleString('es-CL')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Estudiantes con Pagos Pendientes */}
        <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg border border-[#F16001]/20">
          <h3 className="text-xl font-semibold text-[#D9C3AB] mb-4">Pagos Pendientes</h3>
          {stats.estudiantesConPendiente.length > 0 ? (
            <div className="space-y-3">
              {stats.estudiantesConPendiente.map(estudiante => {
                const pagosEstudiante = pagos.filter(p => p.estudianteId === estudiante.id);
                const pagado = pagosEstudiante.reduce((sum, p) => sum + p.montoPagado, 0);
                const balance = estudiante.montoMensual - pagado; // ✅ CORREGIDO

                return (
                  <div
                    key={estudiante.id}
                    onClick={() => navigate(`/estudiante/${estudiante.id}`)}
                    className="p-4 bg-black/30 rounded-lg border border-[#F16001]/10 cursor-pointer hover:bg-black/40 hover:border-[#F16001]/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-[#D9C3AB]">{estudiante.nombre}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[estudiante.estadoPago]}`}>
                        {statusLabels[estudiante.estadoPago]}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#D9C3AB]/70">Debe: ${balance.toLocaleString('es-CL')}</span>
                      <span className="text-[#D9C3AB]/70">Mensual: ${estudiante.montoMensual.toLocaleString('es-CL')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[#D9C3AB]/50 text-center py-8">No hay pagos pendientes</p>
          )}
        </div>

        {/* Pagos Recientes */}
        <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg border border-[#F16001]/20">
          <h3 className="text-xl font-semibold text-[#D9C3AB] mb-4">Pagos Recientes</h3>
          {pagosRecientes.length > 0 ? (
            <div className="space-y-3">
              {pagosRecientes.map(pago => (
                <div
                  key={pago.id}
                  className="p-4 bg-black/30 rounded-lg border border-[#F16001]/10"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-[#D9C3AB]">{pago.nombreEstudiante}</h4>
                    <span className="text-green-400 font-semibold">
                      ${pago.montoPagado.toLocaleString('es-CL')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-[#D9C3AB]/70">
                    <span>{format(new Date(pago.fecha), "d 'de' MMMM", { locale: es })}</span>
                    <span className="capitalize">{pago.metodo}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#D9C3AB]/50 text-center py-8">No hay pagos registrados</p>
          )}
        </div>
      </div>

      {/* Resumen por Estudiante */}
      <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg border border-[#F16001]/20 mt-8">
        <h3 className="text-xl font-semibold text-[#D9C3AB] mb-4">Resumen por Estudiante</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F16001]/20">
                <th className="text-left py-3 px-4 font-semibold text-[#D9C3AB]">Estudiante</th>
                <th className="text-left py-3 px-4 font-semibold text-[#D9C3AB]">Estado</th>
                <th className="text-right py-3 px-4 font-semibold text-[#D9C3AB]">Clases</th>
                <th className="text-right py-3 px-4 font-semibold text-[#D9C3AB]">Pagado</th>
                <th className="text-right py-3 px-4 font-semibold text-[#D9C3AB]">Mensual</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.map(estudiante => {
                const pagosEstudiante = pagos.filter(p => p.estudianteId === estudiante.id);
                const clasesEstudiante = clases.filter(c => c.estudianteId === estudiante.id);
                const totalPagado = pagosEstudiante.reduce((sum, p) => sum + p.montoPagado, 0);

                return (
                  <tr
                    key={estudiante.id}
                    onClick={() => navigate(`/estudiante/${estudiante.id}`)}
                    className="border-b border-[#F16001]/10 hover:bg-black/20 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 text-[#D9C3AB]">{estudiante.nombre}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[estudiante.estadoPago]}`}>
                        {statusLabels[estudiante.estadoPago]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-[#D9C3AB]">{clasesEstudiante.length}</td>
                    <td className="py-3 px-4 text-right text-[#D9C3AB]">${totalPagado.toLocaleString('es-CL')}</td>
                    <td className="py-3 px-4 text-right text-[#D9C3AB]">${estudiante.montoMensual.toLocaleString('es-CL')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}