import * as React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import { ROUTES } from '@/app/router/routes';

export interface GuestGuardProps {
  children: React.ReactNode;
}

export const GuestGuard: React.FC<GuestGuardProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, workspaces, activeWorkspaceId } = useAuthStore();

  if (isAuthenticated) {
    // Check if user was trying to go somewhere before login
    const fromPath = (location.state as { from?: { pathname?: string } })?.from?.pathname;
    if (fromPath && fromPath !== ROUTES.LOGIN && fromPath !== ROUTES.LANDING) {
      return <Navigate to={fromPath} replace />;
    }

    // Direct to workspace or workspace selector
    if (!activeWorkspaceId && workspaces.length > 1) {
      return <Navigate to={ROUTES.SELECT_WORKSPACE} replace />;
    }

    return <Navigate to={ROUTES.WORKSPACE} replace />;
  }

  return <>{children}</>;
};
