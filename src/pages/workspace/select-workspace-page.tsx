import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowRight, Shield, Check, LogOut, GraduationCap } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { ROUTES } from '@/app/router/routes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/data-display/badge';
import { EmptyState } from '@/components/data-display/empty-state';

export const SelectWorkspacePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, workspaces, activeWorkspaceId, setActiveWorkspace, logout } = useAuthStore();

  const handleSelectWorkspace = (workspaceId: string) => {
    setActiveWorkspace(workspaceId);
    navigate(ROUTES.WORKSPACE);
  };

  // If user has 0 accessible workspaces
  if (workspaces.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl sm:p-8">
          <EmptyState
            icon={<Building2 className="h-12 w-12 text-muted-foreground" />}
            title="No School Workspaces Available"
            description={`Account "${user?.email || 'User'}" is authenticated, but has not yet been assigned access to any school workspace. Please request an invitation from your school administrator.`}
            action={
              <Button variant="outline" onClick={logout} icon={<LogOut className="h-4 w-4" />}>
                Sign Out
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background px-4 py-12 sm:px-6 lg:px-8">
      {/* Header bar with Sign Out */}
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-hover text-white shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <span className="text-base font-bold text-foreground">School ERP</span>
            <span className="ml-2 text-xs text-muted-foreground">Workspace Selector</span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          icon={<LogOut className="h-3.5 w-3.5" />}
        >
          Sign Out ({user?.name?.split(' ')[0] || 'User'})
        </Button>
      </div>

      <div className="mx-auto mt-8 w-full max-w-4xl">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Select Your School Workspace
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            You have authorization for {workspaces.length} educational{' '}
            {workspaces.length === 1 ? 'institution' : 'institutions'}. Choose a workspace to
            continue.
          </p>
        </div>

        {/* Workspaces List */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {workspaces.map(workspace => {
            const isActive = workspace.id === activeWorkspaceId;

            return (
              <div
                key={workspace.id}
                className={`relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-200 hover:shadow-lg ${
                  isActive
                    ? 'border-primary bg-primary/5 shadow-md shadow-primary/5'
                    : 'border-border bg-surface hover:border-primary/40'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Building2 className="h-6 w-6" />
                    </div>
                    {isActive ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                        <Check className="h-3 w-3" />
                        Active Workspace
                      </span>
                    ) : (
                      <Badge variant="secondary">{workspace.code}</Badge>
                    )}
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-foreground">{workspace.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {workspace.planName} &bull; Academic Year {workspace.academicYear}
                  </p>

                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-surface-muted p-2.5 text-xs">
                    <Shield className="h-3.5 w-3.5 text-primary" />
                    <span className="text-muted-foreground">Role:</span>
                    <span className="font-semibold text-foreground">{workspace.roleInSchool}</span>
                    <span className="ml-auto rounded-md bg-surface px-2 py-0.5 font-mono text-[11px] text-muted-foreground border border-border">
                      {workspace.enabledModules.length} Modules
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    variant={isActive ? 'primary' : 'outline'}
                    className="w-full"
                    onClick={() => handleSelectWorkspace(workspace.id)}
                    icon={<ArrowRight className="h-4 w-4" />}
                  >
                    {isActive ? 'Enter Current Workspace' : 'Select Workspace'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
