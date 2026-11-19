import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Upload,
  MapPin,
  Power,
  GitBranch,
} from 'lucide-react';
import { PageWrapper } from '@/app/layouts/page-wrapper';
import { AdminPageHeader } from '../components/common/admin-page-header';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/data-display/stats-card';
import { DataTable, type DataTableColumn } from '@/components/data-display/data-table';
import { AdminStatusBadge } from '../components/common/admin-status-badge';
import { OrganizationFormModal } from '../components/organizations/organization-form-modal';
import { OrganizationViewDrawer } from '../components/organizations/organization-view-drawer';
import { CampusManagerModal } from '../components/organizations/campus-manager-modal';
import { TenantStatusModal } from '@/features/tenants/components/tenant-status-modal';
import { useToast } from '@/components/feedback/toast';
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
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Modals & Drawers state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<TenantDto | null>(null);
  const [viewTarget, setViewTarget] = useState<TenantDto | null>(null);
  const [campusTarget, setCampusTarget] = useState<TenantDto | null>(null);
  const [statusTarget, setStatusTarget] = useState<TenantDto | null>(null);
  const toast = useToast();

  // Queries & Mutations
  const { data: orgsData, isLoading } = useAdminOrganizations();
  const { data: campusesData = [] } = useAdminCampuses();
  const saveOrgMutation = useSaveOrganization();
  const updateStatusMutation = useUpdateOrganizationStatus();
  const saveCampusMutation = useSaveCampus();

  const organizations: TenantDto[] = orgsData?.items || [];

  // Metrics for KPI Cards
  const stats = useMemo(() => {
    const total = organizations.length;
    const active = organizations.filter(o => o.status === 'ACTIVE').length;
    const provisioning = organizations.filter(o => o.status === 'PROVISIONING' || o.status === 'TRIAL').length;
    const suspended = organizations.filter(o => o.status === 'SUSPENDED' || o.status === 'ARCHIVED').length;
    const campusesCount = campusesData.length;

    return { total, active, provisioning, suspended, campuses: campusesCount };
  }, [organizations, campusesData]);

  const handleSaveOrganization = async (payload: SaveOrganizationPayload, id?: string) => {
    try {
      await saveOrgMutation.mutateAsync({ payload, id });
      setIsAddOpen(false);
      setEditTarget(null);
      toast.success(
        id ? 'Organization details updated successfully' : 'New organization provisioned successfully',
        'Organization Saved'
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save organization';
      toast.error(msg, 'Save Error');
    }
  };

  const handleSaveCampus = async (campus: Partial<OrganizationCampus>) => {
    try {
      await saveCampusMutation.mutateAsync({ campus });
      toast.success('Campus location saved successfully', 'Campus Saved');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save campus';
      toast.error(msg, 'Save Error');
    }
  };

  const handleStatusChange = async (newStatus: TenantStatus, reason?: string) => {
    if (!statusTarget) return;
    try {
      await updateStatusMutation.mutateAsync({ id: statusTarget.id, status: newStatus, reason });
      toast.success(
        `Organization status changed to ${newStatus}`,
        'Status Updated'
      );
      setStatusTarget(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update organization status';
      toast.error(msg, 'Status Update Error');
    }
  };

  // Table Columns
  const columns: DataTableColumn<TenantDto>[] = [
    {
      key: 'displayName',
      label: 'ORGANIZATION NAME & CODE',
      sortable: true,
      align: 'left',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-foreground text-xs sm:text-sm">{row.displayName}</div>
            <div className="text-[11px] text-muted-foreground font-mono mt-0.5">Code: {row.code}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'primaryCampus',
      label: 'PRIMARY CAMPUS',
      align: 'left',
      render: (_, row) => {
        const primary = (row as any).locations?.find((l: any) => l.isMainCampus)?.name;
        return (
          <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
            <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>{primary || 'Main Campus'}</span>
          </div>
        );
      },
    },
    {
      key: 'campuses',
      label: 'CAMPUSES',
      align: 'center',
      render: (_, row) => {
        const count = row._count?.locations ?? (row as any).locations?.length ?? 1;
        return (
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              setCampusTarget(row);
            }}
            className="font-semibold text-xs text-primary hover:underline inline-flex items-center gap-1.5 cursor-pointer bg-primary/5 hover:bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20 transition-colors"
            title="Manage Physical Campuses"
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>{count} Campuses</span>
          </button>
        );
      },
    },
    {
      key: 'activeUsers',
      label: 'ACTIVE USERS',
      align: 'center',
      render: (_, row) => (
        <span className="text-xs font-semibold text-foreground">
          {row._count?.memberships ?? 1}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'STATUS',
      sortable: true,
      align: 'center',
      render: val => <AdminStatusBadge status={val as TenantStatus} />,
    },
    {
      key: 'createdAt',
      label: 'CREATED DATE',
      sortable: true,
      align: 'left',
      render: (val) => (
        <div className="text-xs text-muted-foreground">
          {val ? new Date(val as string).toLocaleDateString() : '—'}
        </div>
      ),
    },
  ];

  return (
    <PageWrapper className="space-y-6">
      {/* Top Header with Breadcrumbs, Title, and Actions */}
      <AdminPageHeader
        title="Organization Management"
        subtitle="Manage registered school institutions, campuses, legal identity, and operational statuses."
        icon={Building2}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Administration', href: '/admin' },
          { label: 'Organizations' },
        ]}
        actionLabel="Add Organization"
        onActionClick={() => setIsAddOpen(true)}
        extraActions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<GitBranch className="w-4 h-4 text-primary" />}
              onClick={() => navigate('/admin/branches')}
            >
              Branches Master
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={() => toast.info('Exporting organizations directory to CSV/PDF...', 'Export')}
            >
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<Upload className="w-4 h-4" />}
              onClick={() => toast.info('Organization bulk import wizard is opening...', 'Import')}
            >
              Import
            </Button>
          </div>
        }
      />

      {/* KPI Cards Row (Matching Reference Image) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Schools"
          value={stats.active}
          subtitle="Operational workspaces"
          color="green"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
        />
        <StatsCard
          title="Provisioning"
          value={stats.provisioning}
          subtitle="Pending deployment"
          color="orange"
          icon={<Clock className="w-5 h-5 text-amber-600" />}
        />
        <StatsCard
          title="Suspended / Inactive"
          value={stats.suspended}
          subtitle="Requires attention"
          color="red"
          icon={<AlertCircle className="w-5 h-5 text-danger" />}
        />
        <StatsCard
          title="Total Campuses"
          value={stats.campuses}
          subtitle="Physical locations"
          color="purple"
          icon={<Building2 className="w-5 h-5 text-primary" />}
        />
      </div>

      {/* Reusable DataTable with Search, Dynamic Status Popover, Column Visibility, and Numbered Pagination */}
      <DataTable<TenantDto>
        columns={columns}
        data={organizations}
        loading={isLoading}
        selectable
        selectedIds={selected}
        onSelectionChange={setSelected}
        onRowClick={row => setViewTarget(row)}
        rowIdKey="id"
        resultLabel="organizations"
        searchPlaceholder="Search organizations by name, code, category, or contact..."
        statusKey="status"
        pageSizeOptions={[5, 10, 25, 50]}
        actionConfig={{
          onView: org => navigate(`/admin/organizations/${org.id}`),
          onEdit: org => setEditTarget(org),
          customActions: org => [
            {
              label: 'Organization Details',
              icon: <Building2 className="w-4 h-4 text-primary" />,
              onClick: () => navigate(`/admin/organizations/${org.id}`),
            },
            {
              label: 'Manage Campuses',
              icon: <MapPin className="w-4 h-4 text-primary" />,
              onClick: () => setCampusTarget(org),
            },
            {
              label: org.status === 'ACTIVE' ? 'Suspend Organization' : 'Activate Organization',
              icon: <Power className={`w-4 h-4 ${org.status === 'ACTIVE' ? 'text-danger' : 'text-success'}`} />,
              onClick: () => setStatusTarget(org),
            },
          ],
          onDelete: org => setStatusTarget(org),
        }}
      />

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
        campuses={(viewTarget as any)?.locations || campusesData}
        onEdit={org => setEditTarget(org)}
      />

      {/* Campus Manager Modal */}
      <CampusManagerModal
        isOpen={Boolean(campusTarget)}
        onClose={() => setCampusTarget(null)}
        organizationName={campusTarget?.displayName || ''}
        campuses={(campusTarget as any)?.locations || campusesData}
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
