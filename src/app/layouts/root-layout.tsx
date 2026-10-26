import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { APP_CONFIG } from '@/app/config/constants';
import { Badge } from '@/components/data-display/badge';

export const RootLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-sm">
                ERP
              </span>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                {APP_CONFIG.name}
              </span>
            </Link>
            <Badge variant="primary">Architecture Shell v{APP_CONFIG.version}</Badge>
          </div>
          <nav className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              System Status
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-4 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} School ERP. Foundation Architecture Skeleton.
          </p>
          <p className="mt-2 text-xs text-slate-400 sm:mt-0">Modular Monolith Architecture</p>
        </div>
      </footer>
    </div>
  );
};
