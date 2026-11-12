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
        <table className="w-full border-collapse border border-border text-left text-sm">
          <thead className="sticky top-0 z-10">
            <tr style={{ backgroundColor: 'var(--color-table-header-bg, #ede9fe)', borderBottom: '2px solid var(--color-table-header-border, #c4b5fd)' }}>
              <th
                scope="col"
                className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: 'var(--color-table-header-bg, #ede9fe)',
                  color: 'var(--color-table-header-text, #4c1d95)',
                  borderRight: '1px solid var(--color-table-header-border, #c4b5fd)',
                  borderBottom: '2px solid var(--color-table-header-border, #c4b5fd)',
                }}
              >
                School Institution
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: 'var(--color-table-header-bg, #ede9fe)',
                  color: 'var(--color-table-header-text, #4c1d95)',
                  borderRight: '1px solid var(--color-table-header-border, #c4b5fd)',
                  borderBottom: '2px solid var(--color-table-header-border, #c4b5fd)',
                }}
              >
                Type
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-center"
                style={{
                  backgroundColor: 'var(--color-table-header-bg, #ede9fe)',
                  color: 'var(--color-table-header-text, #4c1d95)',
                  borderRight: '1px solid var(--color-table-header-border, #c4b5fd)',
                  borderBottom: '2px solid var(--color-table-header-border, #c4b5fd)',
                }}
              >
                Plan
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-center"
                style={{
                  backgroundColor: 'var(--color-table-header-bg, #ede9fe)',
                  color: 'var(--color-table-header-text, #4c1d95)',
                  borderRight: '1px solid var(--color-table-header-border, #c4b5fd)',
                  borderBottom: '2px solid var(--color-table-header-border, #c4b5fd)',
                }}
              >
                Status
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-center"
                style={{
                  backgroundColor: 'var(--color-table-header-bg, #ede9fe)',
                  color: 'var(--color-table-header-text, #4c1d95)',
                  borderRight: '1px solid var(--color-table-header-border, #c4b5fd)',
                  borderBottom: '2px solid var(--color-table-header-border, #c4b5fd)',
                }}
              >
                Campuses
              </th>
              <th
                scope="col"
                className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: 'var(--color-table-header-bg, #ede9fe)',
                  color: 'var(--color-table-header-text, #4c1d95)',
                  borderRight: '1px solid var(--color-table-header-border, #c4b5fd)',
                  borderBottom: '2px solid var(--color-table-header-border, #c4b5fd)',
                }}
              >
                Created
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-center"
                style={{
                  backgroundColor: 'var(--color-table-header-bg, #ede9fe)',
                  color: 'var(--color-table-header-text, #4c1d95)',
                  borderBottom: '2px solid var(--color-table-header-border, #c4b5fd)',
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-surface">
            {tenants.map((tenant) => {
              const initials = (tenant.code || tenant.displayName).slice(0, 2).toUpperCase();

              return (
                <tr
                  key={tenant.id}
                  className="group transition-colors hover:bg-primary/5"
                  style={{ borderBottom: '1px solid var(--color-table-grid, #e5e7eb)' }}
                >
                  <td
                    className="px-6 py-4"
                    style={{
                      borderRight: '1px solid var(--color-table-grid, #e5e7eb)',
                      borderBottom: '1px solid var(--color-table-grid, #e5e7eb)',
                    }}
                  >
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

                  <td
                    className="px-4 py-4 text-xs text-muted-foreground"
                    style={{
                      borderRight: '1px solid var(--color-table-grid, #e5e7eb)',
                      borderBottom: '1px solid var(--color-table-grid, #e5e7eb)',
                    }}
                  >
                    {tenant.organizationType ? tenant.organizationType.replace(/_/g, ' ') : 'INDEPENDENT'}
                  </td>

                  <td
                    className="px-4 py-4 text-center"
                    style={{
                      borderRight: '1px solid var(--color-table-grid, #e5e7eb)',
                      borderBottom: '1px solid var(--color-table-grid, #e5e7eb)',
                    }}
                  >
                    <Badge variant="outline" className="font-mono text-[11px]">
                      {tenant.subscriptionPlan || 'STANDARD'}
                    </Badge>
                  </td>

                  <td
                    className="px-4 py-4 text-center"
                    style={{
                      borderRight: '1px solid var(--color-table-grid, #e5e7eb)',
                      borderBottom: '1px solid var(--color-table-grid, #e5e7eb)',
                    }}
                  >
                    <TenantStatusBadge status={tenant.status} />
                  </td>

                  <td
                    className="px-4 py-4 text-xs text-muted-foreground text-center"
                    style={{
                      borderRight: '1px solid var(--color-table-grid, #e5e7eb)',
                      borderBottom: '1px solid var(--color-table-grid, #e5e7eb)',
                    }}
                  >
                    <span className="font-semibold text-foreground">
                      {tenant._count?.locations ?? 1}
                    </span>{' '}
                    / {tenant.maxLocations}
                  </td>

                  <td
                    className="px-4 py-4 text-xs text-muted-foreground"
                    style={{
                      borderRight: '1px solid var(--color-table-grid, #e5e7eb)',
                      borderBottom: '1px solid var(--color-table-grid, #e5e7eb)',
                    }}
                  >
                    {new Date(tenant.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>

                  <td
                    className="px-6 py-4 text-right"
                    style={{ borderBottom: '1px solid var(--color-table-grid, #e5e7eb)' }}
                  >
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

