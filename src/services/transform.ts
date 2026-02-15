import { Estudiante, Pago, Clase, EstadoPago } from '@/types'; // Cambiar importaciones

interface DjangoEstudiante {
  id: number;
  nombre: string;
  telefono: string;
  activo: boolean;
}

interface DjangoPago {
  id: number;
  estudiante: number;
  monto_total: number;
  monto_pagado: number;
  estado: string;
  fecha_pago: string | null;
}

interface DjangoClase {
  id: number;
  estudiante: number;
  fecha: string;
  tema: string;
}

export const transformDjangoToApp = (
  djangoEstudiantes: DjangoEstudiante[],
  djangoPagos: DjangoPago[],
  djangoClases: DjangoClase[]
) => {
  // Mapeo simple para desarrollo
  const diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'] as const;
  const horasClase = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  const estudiantes: Estudiante[] = djangoEstudiantes.map((est, index) => {
    const pagosEstudiante = djangoPagos.filter(p => p.estudiante === est.id);
    
    // Determinar estado de pago
    let estadoPago: EstadoPago = 'pagado'; // Cambiar paymentStatus
    if (pagosEstudiante.some(p => p.estado === 'pendiente')) estadoPago = 'pendiente';
    else if (pagosEstudiante.some(p => p.estado === 'parcial')) estadoPago = 'parcial';

    // Calcular monto mensual (promedio de pagos)
    const totalPagado = pagosEstudiante.reduce((sum, p) => sum + p.monto_pagado, 0);
    const montoMensual = pagosEstudiante.length > 0  // Cambiar monthlyAmount
      ? Math.round(totalPagado / pagosEstudiante.length)
      : 50000;

    return {
      id: est.id.toString(),
      nombre: est.nombre, // Cambiar name
      montoMensual, // Cambiar monthlyAmount
      diaSemana: diasSemana[index % diasSemana.length], // Cambiar dayOfWeek
      horaClase: horasClase[index % horasClase.length], // Cambiar classTime
      estadoPago, // Cambiar paymentStatus
    };
  });

  const pagos: Pago[] = djangoPagos.map(pago => ({ // Cambiar payments
    id: pago.id.toString(),
    estudianteId: pago.estudiante.toString(), // Cambiar studentId
    monto: pago.monto_total, // Cambiar amount
    montoPagado: pago.monto_pagado, // Cambiar amountPaid
    fecha: pago.fecha_pago || new Date().toISOString().split('T')[0], // Cambiar date
    metodo: 'efectivo' as const, // Cambiar method
  }));

  const clases: Clase[] = djangoClases.map(clase => ({ // Cambiar classes
    id: clase.id.toString(),
    estudianteId: clase.estudiante.toString(), // Cambiar studentId
    fecha: clase.fecha, // Cambiar date
    observaciones: clase.tema, // Cambiar observations
  }));

  return { estudiantes, pagos, clases }; // Cambiar nombres del objeto retornado
};