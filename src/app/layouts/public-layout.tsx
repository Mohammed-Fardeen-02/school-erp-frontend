import * as React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { GraduationCap, LayoutDashboard, LogIn } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { ROUTES } from '@/app/router/routes';
import { Button } from '@/components/ui/button';

export const PublicLayout: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, activeWorkspaceId } = useAuthStore();

  const handleLaunchApp = () => {
    if (activeWorkspaceId) {
      navigate(ROUTES.WORKSPACE);
    } else {
      navigate(ROUTES.SELECT_WORKSPACE);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Public Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-hover text-white shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-foreground sm:text-lg">
                School ERP
              </span>
              <span className="ml-1.5 hidden rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary sm:inline-block">
                Enterprise
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden items-center space-x-6 md:flex">
            <a
              href="#capabilities"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Platform Capabilities
            </a>
            <a
              href="#architecture"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Architecture & Security
            </a>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleLaunchApp}
                icon={<LayoutDashboard className="h-4 w-4" />}
              >
                Go to Workspace
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(ROUTES.LOGIN)}
                icon={<LogIn className="h-4 w-4" />}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Public Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer className="border-t border-border bg-surface py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold text-foreground">School ERP Platform</span>
              <span className="text-xs text-muted-foreground">| Modular Monolith Architecture</span>
            </div>

            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} School ERP. Foundation Architecture & Design System.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
