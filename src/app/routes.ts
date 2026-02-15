import { createBrowserRouter } from 'react-router';
import { Layout } from '@/app/components/Layout';
import { AgendaSemanal } from '@/app/pages/AgendaSemanal';
import { DetalleEstudiante } from '@/app/pages/DetalleEstudiante';
import { Dashboard } from '@/app/pages/Dashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: AgendaSemanal },
      { path: 'estudiante/:id', Component: DetalleEstudiante },
      { path: 'dashboard', Component: Dashboard },
    ],
  },
]);
