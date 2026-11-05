import * as React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { usePermission } from '@/features/roles-permissions/hooks/use-permission';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/feedback/spinner';
import { ROUTES } from '@/app/router/routes';

export interface PermissionGuardProps {
  /**
   * Protected child elements to render if permission is granted.
   */
  children: React.ReactNode;

  /**
   * Granular dot-notation permission code (e.g. 'organizations.manage', 'settings.roles.manage').
   */
  permission?: string;

  /**
   * High-level domain module identifier (e.g. 'roles', 'users', 'organizations').
   */
  module?: string;

  /**
   * Action name when using module-action syntax (e.g. 'view', 'create', 'edit', 'delete').
   * Defaults to 'view'.
   */
  action?: string;

  /**
   * Custom fallback node to display when permission is denied.
   * If not provided, an institutional 'Access Restricted' card is shown.
   */
  fallback?: React.ReactNode;

  /**
   * Optional route path to redirect to instead of displaying the fallback card.
   */
  redirectTo?: string;
}

/**
 * Universal PermissionGuard component mirroring legacy_inv ProtectedRoute.
 * Supports:
 * 1. Direct permission code matching (`permission="settings.roles.manage"`)
 * 2. Module & action syntax (`module="roles" action="view"`)
 * 3. SuperAdmin bypass
 * 4. Fail-closed security with loading and denial UI
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permission,
  module,
  action = 'view',
  fallback,
  redirectTo,
}) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // If explicit permission code is provided, evaluate that directly;
  // otherwise, construct canonical code from module + action.
  const requiredPermission = permission || (module ? `${module}.${action}` : undefined);

  const { hasPermission, isLoading } = usePermission(requiredPermission);

  // Platform super-admins possess universal administrative authority
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  if (!isSuperAdmin && isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-8" data-testid="permission-guard-loading">
        <Spinner size="lg" />
      </div>
    );
  }

  const isGranted = isSuperAdmin || !requiredPermission || hasPermission;

  if (!isGranted) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6" data-testid="permission-guard-forbidden">
        <div className="w-full max-w-lg rounded-2xl border border-danger/20 bg-surface p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Access Restricted</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account does not possess the required permission{' '}
            {requiredPermission && (
              <span className="font-mono font-semibold text-foreground">"{requiredPermission}"</span>
            )}{' '}
            to view this section.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              variant="primary"
              onClick={() => navigate(ROUTES.WORKSPACE)}
              icon={<ArrowLeft className="h-4 w-4" />}
            >
              Return to Workspace
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

