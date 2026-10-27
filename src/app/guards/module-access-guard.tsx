import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { ROUTES } from '@/app/router/routes';
import { Button } from '@/components/ui/button';

export interface ModuleAccessGuardProps {
  children: React.ReactNode;
}

export const ModuleAccessGuard: React.FC<ModuleAccessGuardProps> = ({ children }) => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { hasModuleAccess, getActiveWorkspace } = useAuthStore();

  const activeWorkspace = getActiveWorkspace();

  if (moduleId && !hasModuleAccess(moduleId)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-2xl border border-danger/20 bg-surface p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Module Access Restricted</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The requested module{' '}
            <span className="font-mono font-semibold text-foreground">"{moduleId}"</span> is not
            enabled for{' '}
            <span className="font-semibold text-foreground">
              {activeWorkspace?.name || 'this school'}
            </span>{' '}
            or your account role does not have authorization to access it.
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

  return <>{children}</>;
};
