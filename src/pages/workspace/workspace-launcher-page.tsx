import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowRight, Lock, RefreshCw, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { ROUTES, buildModuleRoute } from '@/app/router/routes';
import { ERP_MODULES } from '@/app/config/modules.config';
import { PageWrapper } from '@/app/layouts/page-wrapper';
import { Breadcrumb } from '@/app/layouts/breadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/data-display/badge';
import { StatusBadge } from '@/components/data-display/status-badge';

export const WorkspaceLauncherPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, workspaces, getActiveWorkspace, hasModuleAccess } = useAuthStore();
  const activeWorkspace = getActiveWorkspace();

  const handleOpenModule = (moduleId: string) => {
    navigate(buildModuleRoute(moduleId));
  };

  return (
    <PageWrapper>
      {/* Breadcrumb Bar */}
      <Breadcrumb
        items={[{ label: 'Home', href: '/' }, { label: 'Workspace Launcher' }]}
        actions={
          workspaces.length > 1 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(ROUTES.SELECT_WORKSPACE)}
              icon={<RefreshCw className="h-3.5 w-3.5" />}
            >
              Switch School Workspace
            </Button>
          ) : undefined
        }
      />

      {/* Workspace Banner */}
      <div className="mb-8 rounded-2xl border border-border bg-gradient-to-r from-surface via-surface to-primary/5 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-hover text-white shadow-md shadow-primary/20">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-extrabold text-foreground sm:text-2xl">
                  {activeWorkspace?.name || 'School Workspace'}
                </h1>
                <Badge variant="primary">{activeWorkspace?.code || 'WORKSPACE'}</Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                Academic Session:{' '}
                <span className="font-semibold text-foreground">
                  {activeWorkspace?.academicYear || '2026-27'}
                </span>{' '}
                &bull; Plan:{' '}
                <span className="font-semibold text-foreground">
                  {activeWorkspace?.planName || 'Enterprise'}
                </span>{' '}
                &bull; Active Role:{' '}
                <span className="font-semibold text-primary">
                  {activeWorkspace?.roleInSchool || user?.roleName}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="inline-flex items-center gap-1.5 rounded-xl border border-success/20 bg-success/10 px-3 py-1.5 text-xs font-bold text-success">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{activeWorkspace?.enabledModules.length || 0} Modules Authorized</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Title */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Permitted Institutional Modules</h2>
          <p className="text-xs text-muted-foreground">
            Select a module to enter its dedicated operational workspace.
          </p>
        </div>
      </div>

      {/* Module Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ERP_MODULES.map(module => {
          const Icon = module.icon;
          const isPermitted = hasModuleAccess(module.id);

          return (
            <div
              key={module.id}
              className={`flex flex-col justify-between rounded-2xl border p-6 transition-all duration-200 ${
                isPermitted
                  ? 'border-border bg-surface hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5'
                  : 'border-border/60 bg-surface-muted/60 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      isPermitted
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted-foreground/10 text-muted-foreground'
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  {isPermitted ? (
                    <StatusBadge status="active" label="Authorized" size="sm" />
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md bg-surface-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground border border-border">
                      <Lock className="h-3 w-3" />
                      Restricted
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-base font-bold text-foreground">{module.name}</h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  {module.description}
                </p>
              </div>

              <div className="mt-6 pt-2">
                {isPermitted ? (
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => handleOpenModule(module.id)}
                    icon={<ArrowRight className="h-4 w-4" />}
                  >
                    Open Module
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    Module Not Enabled
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </PageWrapper>
  );
};
