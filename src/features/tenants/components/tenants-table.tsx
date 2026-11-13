import * as React from 'react';
import { Building2, Settings, ShieldAlert, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/data-display/badge';
import { TenantStatusBadge } from './tenant-status-badge';
import type { TenantDto } from '../types/tenants.types';
import { useAuthStore } from '@/stores/auth-store';

export interface TenantsTableProps {
  tenants: TenantDto[];
  isLoading: boolean;
  onOpenStatusModal: (tenant: TenantDto) => void;
}

export const TenantsTable: React.FC<TenantsTableProps> = ({
  tenants,
  isLoading,
  onOpenStatusModal,
}) => {
  const navigate = useNavigate();
  const { setActiveWorkspace, setTenantContext } = useAuthStore();

  const handleEnterWorkspace = (tenant: TenantDto) => {
    setActiveWorkspace(tenant.id);
    setTenantContext(tenant.id, null);
    navigate('/workspace');
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-border bg-surface">
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Loading institutions...</span>
        </div>
      </div>
    );
  }

  if (tenants.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-muted text-muted-foreground mb-3">
          <Building2 className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-foreground">No Institutions Found</h3>
        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
          No schools or educational organizations match your query. Try resetting your search filters
          or provision a new school institution.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th scope="col" className="px-6 py-3.5">
                School Institution
              </th>
              <th scope="col" className="px-4 py-3.5">
                Type
              </th>
              <th scope="col" className="px-4 py-3.5">
                Plan
              </th>
              <th scope="col" className="px-4 py-3.5">
                Status
              </th>
              <th scope="col" className="px-4 py-3.5">
                Campuses
              </th>
              <th scope="col" className="px-4 py-3.5">
                Created
              </th>
              <th scope="col" className="px-6 py-3.5 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tenants.map((tenant) => {
              const initials = (tenant.code || tenant.displayName).slice(0, 2).toUpperCase();

              return (
                <tr
                  key={tenant.id}
                  className="group transition-colors hover:bg-surface-muted/30"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl font-bold text-white text-xs shadow-xs"
                        style={{ backgroundColor: tenant.brandColor || '#4f46e5' }}
                      >
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => navigate(`/tenants/${tenant.id}`)}
                          className="font-bold text-foreground hover:text-primary transition-colors text-left truncate block max-w-xs"
                        >
                          {tenant.displayName}
                        </button>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-mono">{tenant.code}</span>
                          <span>•</span>
                          <span className="truncate max-w-[150px]">{tenant.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-xs text-muted-foreground">
                    {tenant.organizationType ? tenant.organizationType.replace(/_/g, ' ') : 'INDEPENDENT'}
                  </td>

                  <td className="px-4 py-4">
                    <Badge variant="outline" className="font-mono text-[11px]">
                      {tenant.subscriptionPlan || 'STANDARD'}
                    </Badge>
                  </td>

                  <td className="px-4 py-4">
                    <TenantStatusBadge status={tenant.status} />
                  </td>

                  <td className="px-4 py-4 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {tenant._count?.locations ?? 1}
                    </span>{' '}
                    / {tenant.maxLocations}
                  </td>

                  <td className="px-4 py-4 text-xs text-muted-foreground">
                    {new Date(tenant.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEnterWorkspace(tenant)}
                        title="Enter School Workspace"
                        className="text-xs"
                      >
                        Enter <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/tenants/${tenant.id}`)}
                        title="Manage Settings & Modules"
                      >
                        <Settings className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenStatusModal(tenant)}
                        title="Change Status"
                      >
                        <ShieldAlert className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

