import { RouterProvider } from 'react-router';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
import { router } from '@/app/routes';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </AppProvider>
    </AuthProvider>
  );
}
