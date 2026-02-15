// En @/types/index.ts
export type EstadoPago = 'pagado' | 'pendiente' | 'parcial';

export interface Estudiante {
  id: string;
  nombre: string;
  telefono?: string;
  fechaInscripcion?: string;
  activo?: boolean;
  montoMensual: number;
  diaSemana: 'lunes' | 'martes' | 'miércoles' | 'jueves' | 'viernes' | 'sábado';
  horaClase: string; // formato HH:MM
  estadoPago: EstadoPago;
}

export interface Pago {
  id: string;
  estudianteId: string;
  monto: number;
  montoPagado: number;
  fecha: string;
  metodo: 'efectivo' | 'transferencia' | 'tarjeta';
}

export interface Clase {
  id: string;
  estudianteId: string;
  fecha: string;
  duracion?: number;
  observaciones?: string;
  completada?: boolean;
  tema?: string;
}