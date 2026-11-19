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
  Eye,
  Edit2,
  Power,
  UserCheck,
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
import { EditRoleModal } from '@/features/roles-permissions/components/role-list/edit-role-modal';
import { RoleViewDrawer } from '../components/roles/role-view-drawer';
import { UserAssignmentsPanel } from '@/features/roles-permissions/components/assignments/user-assignments-panel';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/feedback/toast';
import {
  useRolesList,
  useCloneTemplate,
  useDeleteRole,
  useToggleRoleStatus,
} from '@/features/roles-permissions/hooks/use-roles';
import type { RoleSummary, CloneTemplatePayload } from '@/features/roles-permissions/types/roles.types';

export type RoleFilterTab = 'ALL' | 'CUSTOM' | 'TEMPLATES';
export type RoleViewMode = 'ROLES' | 'ASSIGNMENTS';

export const RolesPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [viewMode, setViewMode] = useState<RoleViewMode>('ROLES');
  const [filterTab, setFilterTab] = useState<RoleFilterTab>('ALL');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Modal / Drawer state
  const [viewingRole, setViewingRole] = useState<RoleSummary | null>(null);
  const [editingRole, setEditingRole] = useState<RoleSummary | null>(null);
  const [cloneTarget, setCloneTarget] = useState<RoleSummary | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RoleSummary | null>(null);

  const { data: rolesData, isLoading } = useRolesList();
  const cloneMutation = useCloneTemplate();
  const deleteMutation = useDeleteRole();
  const toggleStatusMutation = useToggleRoleStatus();

  const allRoles: RoleSummary[] = useMemo(() => rolesData?.roles ?? [], [rolesData?.roles]);

  const filteredRoles = useMemo(() => {
    if (filterTab === 'CUSTOM') {
      return allRoles.filter((r) => r.roleType === 'CUSTOM');
    }
    if (filterTab === 'TEMPLATES') {
      return allRoles.filter((r) => r.roleType === 'SYSTEM_TEMPLATE');
    }
    return allRoles;
  }, [allRoles, filterTab]);

  const stats = useMemo(() => {
    const total = allRoles.length;
    const custom = allRoles.filter((r) => r.roleType === 'CUSTOM').length;
    const templates = allRoles.filter((r) => r.roleType === 'SYSTEM_TEMPLATE').length;
    const active = allRoles.filter((r) => r.isActive).length;

    return { total, custom, templates, active };
  }, [allRoles]);

  const handleCloneSubmit = async (templateId: string, payload: CloneTemplatePayload) => {
    try {
      await cloneMutation.mutateAsync({ templateId, payload });
      setCloneTarget(null);
      toast.success(
        `Role "${payload.roleName}" created from template successfully`,
        'Role Cloned'
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to clone role template';
      toast.error(msg, 'Clone Error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(
        res.message || `Role "${deleteTarget.roleName}" was processed successfully`,
        'Role Processed'
      );
      setDeleteTarget(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete role';
      toast.error(msg, 'Delete Error');
    }
  };

  const handleToggleStatus = async (role: RoleSummary) => {
    try {
      await toggleStatusMutation.mutateAsync({
        roleId: role.id,
        isActive: !role.isActive,
      });
      toast.success(
        `Role "${role.roleName}" ${role.isActive ? 'deactivated' : 'activated'} successfully`,
        'Status Updated'
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to change role status';
      toast.error(msg, 'Status Error');
    }
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
        subtitle="Manage custom role definitions, inspect platform templates, and allocate operational roles to members."
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
              icon={<UserCheck className="w-4 h-4 text-primary" />}
              onClick={() => setViewMode(viewMode === 'ROLES' ? 'ASSIGNMENTS' : 'ROLES')}
            >
              {viewMode === 'ROLES' ? 'Member Allocations' : 'Role Directory'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={() => toast.info('Exporting role definitions and capability catalog...', 'Export')}
            >
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<Upload className="w-4 h-4" />}
              onClick={() => toast.info('Role template import wizard is opening...', 'Import')}
            >
              Import
            </Button>
          </div>
        }
      />

      {/* Top Level View Mode Switcher */}
      <div className="flex items-center gap-2 border-b border-border">
        <button
          type="button"
          onClick={() => setViewMode('ROLES')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold transition-all border-b-2 -mb-px cursor-pointer ${
            viewMode === 'ROLES'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Shield className="w-4 h-4" />
          Roles & Capability Profiles
        </button>
        <button
          type="button"
          onClick={() => setViewMode('ASSIGNMENTS')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold transition-all border-b-2 -mb-px cursor-pointer ${
            viewMode === 'ASSIGNMENTS'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="w-4 h-4" />
          Member Role Allocations
        </button>
      </div>

      {viewMode === 'ROLES' ? (
        <div className="space-y-6">
          {/* KPI Stats Row */}
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

          {/* Sub-filter tabs */}
          <div className="flex items-center gap-2 border-b border-border/60 pb-1">
            <button
              type="button"
              onClick={() => setFilterTab('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterTab === 'ALL'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-muted-foreground hover:bg-surface-muted hover:text-foreground'
              }`}
            >
              All Roles ({stats.total})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('CUSTOM')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterTab === 'CUSTOM'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-muted-foreground hover:bg-surface-muted hover:text-foreground'
              }`}
            >
              Custom Roles ({stats.custom})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('TEMPLATES')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterTab === 'TEMPLATES'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-muted-foreground hover:bg-surface-muted hover:text-foreground'
              }`}
            >
              System Templates ({stats.templates})
            </button>
          </div>

          {/* DataTable */}
          <DataTable<RoleSummary>
            columns={columns}
            data={filteredRoles}
            loading={isLoading}
            selectable
            selectedIds={selected}
            onSelectionChange={setSelected}
            onRowClick={(row) => setViewingRole(row)}
            rowIdKey="id"
            resultLabel="roles"
            actionConfig={{
              onView: (row) => setViewingRole(row),
              customActions: (row) => [
                {
                  label: 'View Details',
                  icon: <Eye className="h-4 w-4 text-muted-foreground" />,
                  onClick: () => setViewingRole(row),
                },
                {
                  label: row.roleType === 'SYSTEM_TEMPLATE' ? 'View Capabilities' : 'Configure Matrix',
                  icon: <Sliders className="h-4 w-4 text-primary" />,
                  onClick: () => navigate(`/admin/roles/${row.id}/matrix`),
                },
                ...(row.roleType === 'CUSTOM'
                  ? [
                      {
                        label: 'Edit Role Metadata',
                        icon: <Edit2 className="h-4 w-4 text-foreground" />,
                        onClick: () => setEditingRole(row),
                      },
                      {
                        label: row.isActive ? 'Deactivate Role' : 'Activate Role',
                        icon: <Power className="h-4 w-4 text-amber-600" />,
                        onClick: () => handleToggleStatus(row),
                      },
                    ]
                  : []),
                {
                  label: 'Clone Template',
                  icon: <Copy className="h-4 w-4 text-purple-600" />,
                  onClick: () => setCloneTarget(row),
                },
                ...(row.roleType === 'CUSTOM'
                  ? [
                      {
                        label: 'Delete / Archive Role',
                        icon: <Trash2 className="h-4 w-4 text-danger" />,
                        onClick: () => setDeleteTarget(row),
                        className: 'text-danger hover:bg-danger/10',
                      },
                    ]
                  : []),
              ],
            }}
          />
        </div>
      ) : (
        <UserAssignmentsPanel />
      )}

      {/* Role Details Drawer */}
      <RoleViewDrawer
        isOpen={Boolean(viewingRole)}
        role={viewingRole}
        onClose={() => setViewingRole(null)}
        onEdit={(r) => setEditingRole(r)}
        onClone={(r) => setCloneTarget(r)}
        onManageAssignments={() => {
          setViewMode('ASSIGNMENTS');
          setViewingRole(null);
        }}
      />

      {/* Edit Custom Role Modal */}
      <EditRoleModal
        isOpen={Boolean(editingRole)}
        role={editingRole}
        onClose={() => setEditingRole(null)}
      />

      {/* Clone Template Modal */}
      {cloneTarget && (
        <CloneRoleModal
          isOpen={Boolean(cloneTarget)}
          template={cloneTarget}
          onClose={() => setCloneTarget(null)}
          onSubmit={handleCloneSubmit}
          loading={cloneMutation.isPending}
        />
      )}

      {/* Delete / Archive Confirmation Modal */}
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
