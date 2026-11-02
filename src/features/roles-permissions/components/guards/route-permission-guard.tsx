import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { usePermission } from '../../hooks/use-permission';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/feedback/spinner';
import { ROUTES } from '@/app/router/routes';

export interface RoutePermissionGuardProps {
  /**
   * Canonical permission nodeCode required to access this route.
   */
  permission: string;
  /**
   * Protected route content to render when authorized.
   */
  children: React.ReactNode;
  /**
   * Optional custom forbidden fallback screen.
   * If omitted, renders a standardized Institutional Access Restricted view.
   */
  forbiddenFallback?: React.ReactNode;
  /**
   * Optional custom path to navigate back to when access is denied.
   * Defaults to ROUTES.WORKSPACE.
   */
  redirectTo?: string;
}

/**
 * Route-level dynamic RBAC access guard.
 *
 * Enforces authoritative permission checks before mounting child route views.
 * Displays an accessible loading state while permissions resolve and fails closed
 * with an institutional restricted access view if permission is absent.
 */
export const RoutePermissionGuard: React.FC<RoutePermissionGuardProps> = ({
  permission,
  children,
  forbiddenFallback,
  redirectTo = ROUTES.WORKSPACE,
}) => {
  const navigate = useNavigate();
  const { hasPermission, isLoading } = usePermission(permission);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-8" data-testid="route-guard-loading">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!hasPermission) {
    if (forbiddenFallback) {
      return <>{forbiddenFallback}</>;
    }

    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6" data-testid="route-guard-forbidden">
        <div className="w-full max-w-lg rounded-2xl border border-danger/20 bg-surface p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Access Restricted</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account does not possess the required permission{' '}
            <span className="font-mono font-semibold text-foreground">"{permission}"</span> to
            access this area in the active workspace.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              variant="primary"
              onClick={() => navigate(redirectTo)}
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

