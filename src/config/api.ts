// src/config/api.ts
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Opcional: tipos para las respuestas de la API
export type ApiResponse<T> = {
  data: T;
  status: number;
  message?: string;
};

// Opcional: configuración base para fetch
export const defaultHeaders = {
  'Content-Type': 'application/json',
};