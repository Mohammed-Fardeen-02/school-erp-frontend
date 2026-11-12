import React, { useState, useMemo } from 'react';
import { Building2, Search, Eye, Edit2, MapPin, Power, ShieldAlert } from 'lucide-react';
import { PageWrapper } from '@/app/layouts/page-wrapper';
import { AdminPageHeader } from '../components/common/admin-page-header';
import { AdminStatsRow } from '../components/common/admin-stats-row';
import { AdminStatusBadge } from '../components/common/admin-status-badge';
import { OrganizationFormModal } from '../components/organizations/organization-form-modal';
import { OrganizationViewDrawer } from '../components/organizations/organization-view-drawer';
import { CampusManagerModal } from '../components/organizations/campus-manager-modal';
import { TenantStatusModal } from '@/features/tenants/components/tenant-status-modal';
import { Input } from '@/components/forms/input';
import { Button } from '@/components/ui/button';
import {
  useAdminOrganizations,
  useSaveOrganization,
  useUpdateOrganizationStatus,
  useAdminCampuses,
  useSaveCampus,
} from '../hooks/use-admin';
import type { TenantDto, TenantStatus } from '@/features/tenants/types/tenants.types';
import type { SaveOrganizationPayload, OrganizationCampus } from '../types/admin.types';

export const OrganizationsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | TenantStatus>('ALL');

  // Modals & Drawers state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<TenantDto | null>(null);
  const [viewTarget, setViewTarget] = useState<TenantDto | null>(null);
  const [campusTarget, setCampusTarget] = useState<TenantDto | null>(null);
  const [statusTarget, setStatusTarget] = useState<TenantDto | null>(null);

  // Queries & Mutations
  const { data: orgsData } = useAdminOrganizations({
    search: searchTerm || undefined,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
  });

  const { data: campusesData = [] } = useAdminCampuses();
  const saveOrgMutation = useSaveOrganization();
  const updateStatusMutation = useUpdateOrganizationStatus();
  const saveCampusMutation = useSaveCampus();

  const organizations: TenantDto[] = orgsData?.items || [];

  // Metrics
  const stats = useMemo(() => {
    const total = organizations.length;
    const active = organizations.filter((o) => o.status === 'ACTIVE').length;
    const suspended = organizations.filter((o) => o.status === 'SUSPENDED').length;
    const campusesCount = campusesData.length;

    return [
      { title: 'Total Institutions', value: total, icon: Building2, subtitle: 'Registered organizations' },
      { title: 'Active Schools', value: active, icon: Building2, subtitle: 'Operational workspaces' },
      { title: 'Suspended / Inactive', value: suspended, icon: ShieldAlert, subtitle: 'Requires attention' },
      { title: 'Total Campuses', value: campusesCount, icon: MapPin, subtitle: 'Multi-campus branches' },
    ];
  }, [organizations, campusesData]);

  const handleSaveOrganization = async (payload: SaveOrganizationPayload, id?: string) => {
    await saveOrgMutation.mutateAsync({ payload, id });
    setIsAddOpen(false);
    setEditTarget(null);
  };

  const handleSaveCampus = async (campus: Partial<OrganizationCampus>) => {
    await saveCampusMutation.mutateAsync({ campus });
  };

  const handleStatusChange = async (newStatus: TenantStatus, reason?: string) => {
    if (!statusTarget) return;
    await updateStatusMutation.mutateAsync({ id: statusTarget.id, status: newStatus, reason });
    setStatusTarget(null);
  };

  return (
    <PageWrapper className="space-y-6">
      <AdminPageHeader
        title="Organization Management"
        subtitle="Manage registered school institutions, campuses, legal identity, and tenant status."
        icon={Building2}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Administration', href: '/admin' },
          { label: 'Organizations' },
        ]}
        actionLabel="Add Organization"
        onActionClick={() => setIsAddOpen(true)}
      />

      {/* KPI Stats */}
      <AdminStatsRow stats={stats} />

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Search organizations by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-border bg-surface-muted/50 p-1">
          {(['ALL', 'ACTIVE', 'SUSPENDED', 'TRIAL'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-surface text-primary shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {st === 'ALL' ? 'All Institutions' : st.charAt(0) + st.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-2xl border border-border bg-surface shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-muted/60 text-muted-foreground uppercase font-bold text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-4">Institution Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Campuses</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Official Contact</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {organizations.map((org) => (
                <tr key={org.id} className="hover:bg-surface-muted/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-sm text-foreground">{org.displayName}</div>
                    <div className="font-mono text-[11px] text-muted-foreground">{org.code}</div>
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">
                    {org.organizationType.replace(/_/g, ' ')}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => setCampusTarget(org)}
                      className="font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      {campusesData.length} Campuses
                    </button>
                  </td>
                  <td className="py-3.5 px-4">
                    <AdminStatusBadge status={org.status} />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-foreground">{org.email}</div>
                    <div className="text-muted-foreground">{org.phone}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewTarget(org)}
                        title="View Organization Details"
                        icon={<Eye className="h-4 w-4" />}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditTarget(org)}
                        title="Edit Organization"
                        icon={<Edit2 className="h-4 w-4 text-primary" />}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setStatusTarget(org)}
                        title={org.status === 'ACTIVE' ? 'Suspend Organization' : 'Activate Organization'}
                        icon={<Power className={`h-4 w-4 ${org.status === 'ACTIVE' ? 'text-danger' : 'text-success'}`} />}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Form Modal */}
      {(isAddOpen || editTarget) && (
        <OrganizationFormModal
          isOpen={isAddOpen || Boolean(editTarget)}
          onClose={() => {
            setIsAddOpen(false);
            setEditTarget(null);
          }}
          initialData={editTarget}
          onSubmit={handleSaveOrganization}
          isLoading={saveOrgMutation.isPending}
        />
      )}

      {/* View Drawer */}
      <OrganizationViewDrawer
        isOpen={Boolean(viewTarget)}
        onClose={() => setViewTarget(null)}
        organization={viewTarget}
        campuses={campusesData}
        onEdit={(org) => setEditTarget(org)}
      />

      {/* Campus Manager Modal */}
      <CampusManagerModal
        isOpen={Boolean(campusTarget)}
        onClose={() => setCampusTarget(null)}
        organizationName={campusTarget?.displayName || ''}
        campuses={campusesData}
        onAddCampus={handleSaveCampus}
      />

      {/* Status Modal */}
      {statusTarget && (
        <TenantStatusModal
          isOpen={Boolean(statusTarget)}
          tenant={statusTarget}
          onClose={() => setStatusTarget(null)}
          onSubmit={handleStatusChange}
          loading={updateStatusMutation.isPending}
        />
      )}
    </PageWrapper>
  );
};
