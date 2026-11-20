import * as React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { ROUTES } from '@/app/router/routes';
import { Button } from '@/components/ui/button';
import { ERP_MODULES, checkModulePermission } from '@/app/config/modules.config';
import { usePermission } from '@/features/roles-permissions/hooks/use-permission';
import { useEffectivePermissions } from '@/features/roles-permissions/hooks/use-effective-permissions';

export interface ModuleAccessGuardProps {
  children: React.ReactNode;
  moduleId?: string;
}

/**
 * Enterprise Module-Level Authorization Guard.
 *
 * Enforces dual-condition access control:
 * 1. Organization-level module subscription entitlement (hasModuleAccess)
 * 2. User-level effective RBAC permission capability (checkModulePermission)
 *
 * Implements strict fail-closed evaluation:
 * - Unauthenticated -> Redirect to /login
 * - Unknown module -> 404 "Module Not Found"
 * - Platform administrator -> Universal bypass
 * - Unsubscribed -> "Module Not Subscribed" denial
 * - Permissions loading -> Dedicated loading spinner
 * - Permission error -> Fail closed with "Authorization Error"
 * - Unauthorized -> "Access Restricted" denial
 */
export const ModuleAccessGuard: React.FC<ModuleAccessGuardProps> = ({
  children,
  moduleId: explicitModuleId,
}) => {
  const { moduleId: routeModuleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();

  const targetModuleId = explicitModuleId || routeModuleId;

  const { isAuthenticated, user, hasModuleAccess, getActiveWorkspace } = useAuthStore();
  const activeWorkspace = getActiveWorkspace();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN' || user?.userType === 'PLATFORM';

  const { checkPermission } = usePermission();
  const { permissionsSet, isLoading, isError, error } = useEffectivePermissions();

  // 1. Unauthenticated: Redirect to login
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // 2. Validate module exists in ERP_MODULES catalog
  const moduleConfig = ERP_MODULES.find((m) => m.id === targetModuleId);
  if (!targetModuleId || !moduleConfig) {
    return (
      <div
        data-testid="module-guard-not-found"
        className="flex min-h-[60vh] items-center justify-center p-6"
      >
        <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-muted text-muted-foreground">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Module Not Found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The requested module{' '}
            <span className="font-mono font-semibold text-foreground">
              "{targetModuleId || 'unknown'}"
            </span>{' '}
            does not exist in the School ERP system.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              variant="primary"
              onClick={() => navigate(ROUTES.WORKSPACE)}
              icon={<ArrowLeft className="h-4 w-4" />}
            >
              Back to Workspace Launcher
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Platform Administrator Universal Bypass
  if (isSuperAdmin) {
    return <>{children}</>;
  }

  // 4. Condition 1: Organization Module Entitlement (hasModuleAccess)
  const isSubscribed = hasModuleAccess(moduleConfig.id);
  if (!isSubscribed) {
    return (
      <div
        data-testid="module-guard-unsubscribed"
        className="flex min-h-[60vh] items-center justify-center p-6"
      >
        <div className="w-full max-w-lg rounded-2xl border border-amber-500/20 bg-surface p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Module Not Subscribed</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The module{' '}
            <span className="font-semibold text-foreground">"{moduleConfig.name}"</span> is not
            included in the active subscription package for{' '}
            <span className="font-semibold text-foreground">
              {activeWorkspace?.name || 'this school'}
            </span>
            . Please contact your institutional administrator or platform billing to enable this
            module.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              variant="primary"
              onClick={() => navigate(ROUTES.WORKSPACE)}
              icon={<ArrowLeft className="h-4 w-4" />}
            >
              Back to Workspace Launcher
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 5. Permissions loading state: do not allow prematurely
  if (isLoading) {
    return (
      <div
        data-testid="module-guard-loading"
        className="flex min-h-[60vh] flex-col items-center justify-center p-6"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-3 text-sm text-muted-foreground">Verifying module authorization...</p>
      </div>
    );
  }

  // 6. Permission API query failure: fail closed
  if (isError) {
    return (
      <div
        data-testid="module-guard-error"
        className="flex min-h-[60vh] items-center justify-center p-6"
      >
        <div className="w-full max-w-lg rounded-2xl border border-danger/20 bg-surface p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Authorization Error</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Unable to verify your effective permissions due to an authorization service error:{' '}
            {error?.message || 'Access evaluation failed'}. Access is denied under fail-closed
            security policy.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.WORKSPACE)}
              icon={<ArrowLeft className="h-4 w-4" />}
            >
              Back to Workspace Launcher
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 7. Condition 2: Effective User RBAC Permission
  const hasPermission = checkModulePermission(
    moduleConfig,
    permissionsSet,
    checkPermission,
    isSuperAdmin
  );

  if (!hasPermission) {
    return (
      <div
        data-testid="module-guard-unauthorized"
        className="flex min-h-[60vh] items-center justify-center p-6"
      >
        <div className="w-full max-w-lg rounded-2xl border border-danger/20 bg-surface p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Access Restricted</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your user account does not possess the required RBAC capability (
            <span className="font-mono font-semibold text-foreground">
              {moduleConfig.requiredPermission}
            </span>
            ) to access{' '}
            <span className="font-semibold text-foreground">"{moduleConfig.name}"</span>. Contact
            your school administrator to adjust your role assignments.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              variant="primary"
              onClick={() => navigate(ROUTES.WORKSPACE)}
              icon={<ArrowLeft className="h-4 w-4" />}
            >
              Back to Workspace Launcher
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 8. Both conditions satisfied: Allow route
  return <>{children}</>;
};
