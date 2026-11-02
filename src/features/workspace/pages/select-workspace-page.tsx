import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowRight, Shield, LogOut, Star, MapPin } from 'lucide-react';
import { ROUTES } from '@/app/router/routes';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/data-display/badge';
import { EmptyState } from '@/components/data-display/empty-state';
import { WorkspaceApi } from '../api/workspace.api';
import type { UserOrganizationSummary } from '../types/workspace.types';

export const SelectWorkspacePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, workspaces, activeWorkspaceId, setActiveWorkspace, setTenantContext, logout } =
    useAuthStore();

  const [apiOrgs, setApiOrgs] = React.useState<UserOrganizationSummary[]>([]);

  // Fetch dynamic multi-tenant organizations with fallback to auth-store
  React.useEffect(() => {
    let isMounted = true;
    WorkspaceApi.getMyOrganizations()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setApiOrgs(data);
        }
      })
      .catch(() => {
        // Fallback gracefully to auth-store workspaces
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSetPrimary = async (orgId: string) => {
    try {
      await WorkspaceApi.setPrimaryOrganization(orgId);
      setApiOrgs((prev) =>
        prev.map((org) => ({
          ...org,
          isPrimary: org.id === orgId,
        }))
      );
    } catch {
      // Silent error fallback
    }
  };

  const handleSelectWorkspace = async (organizationId: string, locationId?: string) => {
    try {
      await WorkspaceApi.selectContext({ organizationId, locationId });
    } catch {
      // Fallback silently if offline/mock
    }
    setActiveWorkspace(organizationId, locationId);
    setTenantContext(organizationId, locationId);
    navigate(ROUTES.WORKSPACE);
  };

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  // If dynamic organizations are present, render them; otherwise fallback to auth store workspaces
  const hasApiData = apiOrgs.length > 0;
  const totalCount = hasApiData ? apiOrgs.length : workspaces.length;

  if (totalCount === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl">
          <EmptyState
            icon={<Building2 className="h-10 w-10 text-muted-foreground" />}
            title="No Accessible School Found"
            description="Your user account is authenticated, but has not yet been provisioned for an active school workspace. Please contact your institutional system administrator."
          />
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              icon={<LogOut className="h-4 w-4" />}
            >
              Sign Out of Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        {/* Brand */}
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-hover text-white shadow-md shadow-primary/20">
            <Building2 className="h-7 w-7" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Select Institutional Workspace
        </h2>
        <p className="mt-1 text-center text-xs text-muted-foreground sm:text-sm">
          Welcome back, <span className="font-semibold text-foreground">{user?.firstName}</span>. You have access to {totalCount} institutional {totalCount === 1 ? 'organization' : 'organizations'}. Choose a workspace to proceed.
        </p>

        {/* Dynamic Organization Cards */}
        <div className="mt-8 space-y-4">
          {hasApiData
            ? apiOrgs.map((org) => {
                const isActive = org.id === activeWorkspaceId;
                const mainCampus = org.campuses.find((c) => c.isMainCampus) || org.campuses[0];

                return (
                  <div
                    key={org.id}
                    className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 ${
                      isActive
                        ? 'border-primary bg-primary/5 shadow-md shadow-primary/5'
                        : 'border-border bg-surface hover:border-primary/40 hover:bg-surface-hover hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold ${
                            isActive
                              ? 'bg-primary text-white shadow-sm'
                              : 'bg-surface-muted text-foreground group-hover:bg-primary-ghost group-hover:text-primary'
                          }`}
                        >
                          {org.code.slice(0, 3)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-foreground transition-colors group-hover:text-primary">
                              {org.displayName}
                            </h3>
                            {org.isPrimary && (
                              <Badge variant="warning" className="gap-1 text-[10px]">
                                <Star className="h-2.5 w-2.5 fill-current" />
                                Primary
                              </Badge>
                            )}
                            {isActive && (
                              <Badge variant="primary" className="text-[10px]">
                                Current
                              </Badge>
                            )}
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span>Code: {org.code}</span>
                            <span>•</span>
                            <span className="capitalize">{org.organizationType.replace('_', ' ').toLowerCase()}</span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1 font-medium text-foreground">
                              <Shield className="h-3 w-3 text-primary" />
                              {org.accessLevel}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!org.isPrimary && (
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Set as default primary organization"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetPrimary(org.id);
                            }}
                            className="text-muted-foreground hover:text-amber-500"
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant={isActive ? 'primary' : 'outline'}
                          size="sm"
                          className="gap-1.5"
                          onClick={() => handleSelectWorkspace(org.id, mainCampus?.id)}
                        >
                          <span>Launch</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Campus quick selector if multiple campuses exist */}
                    {org.campuses.length > 1 && (
                      <div className="mt-3.5 border-t border-border/50 pt-3 flex flex-wrap items-center gap-2">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> Campuses:
                        </span>
                        {org.campuses.map((campus) => (
                          <button
                            key={campus.id}
                            type="button"
                            onClick={() => handleSelectWorkspace(org.id, campus.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
                          >
                            <span>{campus.name}</span>
                            {campus.isMainCampus && (
                              <span className="text-[10px] text-muted-foreground">(Main)</span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            : workspaces.map((ws) => {
                const isActive = ws.id === activeWorkspaceId;
                return (
                  <div
                    key={ws.id}
                    onClick={() => handleSelectWorkspace(ws.id)}
                    className={`group relative flex cursor-pointer items-center justify-between rounded-2xl border p-5 transition-all duration-200 ${
                      isActive
                        ? 'border-primary bg-primary/5 shadow-md shadow-primary/5'
                        : 'border-border bg-surface hover:border-primary/40 hover:bg-surface-hover hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold ${
                          isActive
                            ? 'bg-primary text-white shadow-sm'
                            : 'bg-surface-muted text-foreground group-hover:bg-primary-ghost group-hover:text-primary'
                        }`}
                      >
                        {ws.code.slice(0, 3)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-foreground transition-colors group-hover:text-primary">
                            {ws.name}
                          </h3>
                          {isActive && (
                            <Badge variant="primary" className="text-[10px]">
                              Current
                            </Badge>
                          )}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>{ws.campusName || 'Main Campus'}</span>
                          <span>•</span>
                          <span>Code: {ws.code}</span>
                          <span>•</span>
                          <span>Term: {ws.academicYear}</span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1 font-medium text-foreground">
                            <Shield className="h-3 w-3 text-primary" />
                            {ws.role.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="hidden text-right sm:block">
                        <span className="text-xs font-semibold text-muted-foreground">
                          {ws.permittedModules.length} Modules Permitted
                        </span>
                      </div>
                      <Button
                        variant={isActive ? 'primary' : 'outline'}
                        size="sm"
                        className="gap-1.5"
                      >
                        <span>Launch</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
        </div>

        {/* Footer actions */}
        <div className="mt-8 flex items-center justify-center border-t border-border pt-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-xs text-muted-foreground hover:text-foreground"
            icon={<LogOut className="h-4 w-4" />}
          >
            Sign out of account
          </Button>
        </div>
      </div>
    </div>
  );
};
