import * as React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import { ROUTES } from '@/app/router/routes';

export interface AuthGuardProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallbackPath = ROUTES.LOGIN }) => {
  const location = useLocation();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
