import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from '@/app/components/Layout';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import { AgendaSemanal } from '@/app/pages/AgendaSemanal';
import { DetalleEstudiante } from '@/app/pages/DetalleEstudiante';
import { Dashboard } from '@/app/pages/Dashboard';
import { LoginPage } from '@/app/pages/LoginPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        Component: () => (
          <ProtectedRoute>
            <AgendaSemanal />
          </ProtectedRoute>
        ),
      },
      {
        path: 'estudiante/:id',
        Component: () => (
          <ProtectedRoute>
            <DetalleEstudiante />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard',
        Component: () => (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
