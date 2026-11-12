import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Sliders,
  Copy,
  Trash2,
  CheckCircle2,
  FileText,
  Users,
  Download,
  Upload,
} from 'lucide-react';
import { PageWrapper } from '@/app/layouts/page-wrapper';
import { AdminPageHeader } from '../components/common/admin-page-header';
import { StatsCard } from '@/components/data-display/stats-card';
import { AdminStatusBadge } from '../components/common/admin-status-badge';
import { DataTable, type DataTableColumn } from '@/components/data-display/data-table';
import { RoleTypeBadge } from '@/features/roles-permissions/components/role-list/role-type-badge';
import { CloneRoleModal } from '@/features/roles-permissions/components/role-list/clone-role-modal';
import { DeleteRoleModal } from '@/features/roles-permissions/components/role-list/delete-role-modal';
import { Button } from '@/components/ui/button';
import {
  useRolesList,
  useCloneTemplate,
  useDeleteRole,
} from '@/features/roles-permissions/hooks/use-roles';
import type { RoleSummary, CloneTemplatePayload } from '@/features/roles-permissions/types/roles.types';

export const RolesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [cloneTarget, setCloneTarget] = useState<RoleSummary | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RoleSummary | null>(null);

  const { data: rolesData, isLoading } = useRolesList();
  const cloneMutation = useCloneTemplate();
  const deleteMutation = useDeleteRole();

  const allRoles: RoleSummary[] = useMemo(() => rolesData?.roles ?? [], [rolesData?.roles]);

  const stats = useMemo(() => {
    const total = allRoles.length;
    const custom = allRoles.filter((r) => r.roleType === 'CUSTOM').length;
    const templates = allRoles.filter((r) => r.roleType === 'SYSTEM_TEMPLATE').length;
    const active = allRoles.filter((r) => r.isActive).length;

    return { total, custom, templates, active };
  }, [allRoles]);

  const handleCloneSubmit = async (templateId: string, payload: CloneTemplatePayload) => {
    await cloneMutation.mutateAsync({ templateId, payload });
    setCloneTarget(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  // Table Columns
  const columns: DataTableColumn<RoleSummary>[] = [
    {
      key: 'roleName',
      label: 'ROLE IDENTIFIER & NAME',
      sortable: true,
      align: 'left',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold shrink-0">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <div className="font-semibold text-foreground text-xs sm:text-sm">
              {row.roleName}
            </div>
            <div className="font-mono text-[11px] text-muted-foreground mt-0.5">
              Code: {row.roleCode}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'roleType',
      label: 'CLASSIFICATION',
      sortable: true,
      align: 'left',
      render: (val) => <RoleTypeBadge type={val} />,
    },
    {
      key: 'status',
      label: 'STATUS',
      sortable: true,
      align: 'center',
      render: (_, row) => (
        <AdminStatusBadge status={row.isActive ? 'ACTIVE' : 'INACTIVE'} />
      ),
    },
    {
      key: 'assignmentCount',
      label: 'ALLOCATED MEMBERS',
      sortable: true,
      align: 'center',
      render: (val) => (
        <span className="font-semibold text-xs text-foreground">
          {Number(val || 0)} Members
        </span>
      ),
    },
  ];

  return (
    <PageWrapper className="space-y-6">
      <AdminPageHeader
        title="Roles & Permissions Management"
        subtitle="Manage custom role definitions, assign capabilities with checkboxes, and inspect 212-node TriState matrix."
        icon={Shield}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Administration', href: '/admin' },
          { label: 'Roles' },
        ]}
        actionLabel="Create Custom Role"
        onActionClick={() => navigate('/admin/roles/new')}
        extraActions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={() => alert('Exporting roles and capabilities...')}
            >
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<Upload className="w-4 h-4" />}
              onClick={() => alert('Import role templates...')}
            >
              Import
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<Sliders className="w-4 h-4 text-primary" />}
              onClick={() => navigate('/admin/roles')}
            >
              Matrix
            </Button>
          </div>
        }
      />

      {/* KPI Stats Row (Matching Reference Image) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Roles"
          value={stats.active}
          subtitle="Enabled role definitions"
          color="green"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
        />
        <StatsCard
          title="Custom Roles"
          value={stats.custom}
          subtitle="Tenant-authored roles"
          color="orange"
          icon={<Sliders className="w-5 h-5 text-amber-600" />}
        />
        <StatsCard
          title="System Templates"
          value={stats.templates}
          subtitle="Immutable platform baselines"
          color="purple"
          icon={<FileText className="w-5 h-5 text-primary" />}
        />
        <StatsCard
          title="Total Configured"
          value={stats.total}
          subtitle="Total role identities"
          color="red"
          icon={<Users className="w-5 h-5 text-danger" />}
        />
      </div>

      {/* Reusable DataTable with Search, Dynamic Status Popover, Column Visibility, and Numbered Pagination */}
      <DataTable<RoleSummary>
        columns={columns}
        data={allRoles}
        loading={isLoading}
        selectable
        selectedIds={selected}
        onSelectionChange={setSelected}
        onRowClick={(row) => navigate(`/admin/roles/${row.id}/matrix`)}
        rowIdKey="id"
        resultLabel="roles"
        actionConfig={{
          onView: (row) => navigate(`/admin/roles/${row.id}/matrix`),
          onEdit: (row) => navigate(`/admin/roles/${row.id}/matrix`),
          customActions: (row) => [
            {
              label: 'Capability Matrix',
              icon: <Sliders className="h-4 w-4 text-primary" />,
              onClick: () => navigate(`/admin/roles/${row.id}/matrix`),
            },
            {
              label: 'Clone Template',
              icon: <Copy className="h-4 w-4 text-muted-foreground" />,
              onClick: () => setCloneTarget(row),
            },
            ...(row.roleType === 'CUSTOM'
              ? [
                  {
                    label: 'Delete Custom Role',
                    icon: <Trash2 className="h-4 w-4 text-danger" />,
                    onClick: () => setDeleteTarget(row),
                    className: 'text-danger hover:bg-danger/10',
                  },
                ]
              : []),
          ],
        }}
      />

      {/* Modals */}
      {cloneTarget && (
        <CloneRoleModal
          isOpen={Boolean(cloneTarget)}
          template={cloneTarget}
          onClose={() => setCloneTarget(null)}
          onSubmit={handleCloneSubmit}
          loading={cloneMutation.isPending}
        />
      )}

      {deleteTarget && (
        <DeleteRoleModal
          isOpen={Boolean(deleteTarget)}
          role={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          loading={deleteMutation.isPending}
        />
      )}
    </PageWrapper>
  );
};
