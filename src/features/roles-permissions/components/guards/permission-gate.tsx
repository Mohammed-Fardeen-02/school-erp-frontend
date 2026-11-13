import * as React from 'react';
import { usePermission } from '../../hooks/use-permission';
import { useAuthStore } from '@/stores/auth-store';

export interface PermissionGateProps {
  /**
   * The canonical permission nodeCode required to render children.
   * E.g. 'settings.roles_permissions.rbac.create'
   */
  permission: string;
  /**
   * Content to render when permission is granted
   */
  children: React.ReactNode;
  /**
   * Optional fallback content to render when permission is denied or loading fails.
   * Defaults to null (silent suppression).
   */
  fallback?: React.ReactNode;
  /**
   * Optional placeholder to render while effective permissions are loading.
   * Defaults to null to prevent flashing protected content before authorization resolves.
   */
  loadingFallback?: React.ReactNode;
}

/**
 * Component-level conditional renderer based on dynamic RBAC permissions.
 *
 * Enforces fail-closed evaluation:
 * - While loading, renders loadingFallback (never children).
 * - On error or missing permission, renders fallback (defaults to null).
 * - Only renders children when permission is explicitly verified.
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({
  permission,
  children,
  fallback = null,
  loadingFallback = null,
}) => {
  const isSuperAdmin = useAuthStore(state => state.user?.role === 'SUPER_ADMIN');
  const { hasPermission, isLoading } = usePermission(permission);

  if (isSuperAdmin) {
    return <>{children}</>;
  }

  if (isLoading) {
    return <>{loadingFallback}</>;
  }

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

