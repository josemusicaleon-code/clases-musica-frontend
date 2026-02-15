import { Outlet, Link, useLocation } from 'react-router';
import { LayoutDashboard, Calendar } from 'lucide-react';

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen">
      <header className="bg-black/40 backdrop-blur-md border-b border-[#F16001]/30 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold bg-gradient-to-r from-[#F16001] to-[#D9C3AB] bg-clip-text text-transparent">
              Gestión de Clases
            </h1>
            <nav className="flex gap-4">
              <Link
                to="/"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  location.pathname === '/'
                    ? 'bg-gradient-to-r from-[#F16001] to-[#C10801] text-white shadow-lg shadow-[#F16001]/20'
                    : 'text-[#D9C3AB] hover:bg-[#F16001]/10 border border-[#F16001]/20'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span>Agenda</span>
              </Link>
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  location.pathname === '/dashboard'
                    ? 'bg-gradient-to-r from-[#F16001] to-[#C10801] text-white shadow-lg shadow-[#F16001]/20'
                    : 'text-[#D9C3AB] hover:bg-[#F16001]/10 border border-[#F16001]/20'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}