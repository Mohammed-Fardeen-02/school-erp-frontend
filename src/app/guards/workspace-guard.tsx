import * as React from 'react';
import { Navigate } from 'react-router-dom';
import { Building2, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { ROUTES } from '@/app/router/routes';
import { EmptyState } from '@/components/data-display/empty-state';
import { Button } from '@/components/ui/button';

export interface WorkspaceGuardProps {
  children: React.ReactNode;
}

export const WorkspaceGuard: React.FC<WorkspaceGuardProps> = ({ children }) => {
  const { workspaces, activeWorkspaceId, setActiveWorkspace, logout } = useAuthStore();

  // If user has no workspaces assigned
  if (workspaces.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl">
          <EmptyState
            icon={<Building2 className="h-10 w-10 text-muted-foreground" />}
            title="No Accessible School Found"
            description="Your user account is authenticated, but has not yet been provisioned for an active school workspace. Please contact your school's system administrator."
          />
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              icon={<LogOut className="h-4 w-4" />}
            >
              Sign Out of Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If multiple workspaces exist and none is actively selected
  if (!activeWorkspaceId && workspaces.length > 1) {
    return <Navigate to={ROUTES.SELECT_WORKSPACE} replace />;
  }

  // Auto-select single workspace if not set
  if (!activeWorkspaceId && workspaces.length === 1 && workspaces[0]) {
    setActiveWorkspace(workspaces[0].id);
  }

  return <>{children}</>;
};
