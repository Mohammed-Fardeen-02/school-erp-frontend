import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Architectural Note:
 * Frontend route guards provide UX redirection only (e.g. redirecting to /login).
 * They DO NOT secure data or endpoints; actual security and authorization
 * are strictly enforced by the backend API on every request.
 *
 * This foundation component passes through children until the Authentication
 * module is explicitly implemented in a subsequent phase.
 */
export interface AuthGuardProps {
  children: React.ReactNode;
  fallbackPath?: string;
  isAuthenticated?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallbackPath = '/login',
  isAuthenticated = true, // Default to true in foundation stage
}) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
