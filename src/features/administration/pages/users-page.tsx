import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  KeyRound,
  Power,
  Mail,
  ShieldCheck,
  Download,
  Upload,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { PageWrapper } from '@/app/layouts/page-wrapper';
import { AdminPageHeader } from '../components/common/admin-page-header';
import { StatsCard } from '@/components/data-display/stats-card';
import { AdminStatusBadge } from '../components/common/admin-status-badge';
import { DataTable, type DataTableColumn } from '@/components/data-display/data-table';
import { InviteUserModal } from '../components/users/invite-user-modal';
import { UserFormModal } from '../components/users/user-form-modal';
import { UserViewDrawer } from '../components/users/user-view-drawer';
import { UserStatusConfirmModal } from '../components/users/user-status-confirm-modal';
import { UserAllocationsDrawer } from '../components/users/user-allocations-drawer';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/forms/select';
import { Alert } from '@/components/feedback/alert';
import { useToast } from '@/components/feedback/toast';
import {
  useAdminUsers,
  useInviteUser,
  useSaveUser,
  useToggleUserStatus,
  useAdminCampuses,
} from '../hooks/use-admin';
import { useRolesList } from '@/features/roles-permissions/hooks/use-roles';
import type { AdminUserRecord, InviteUserPayload, SaveUserPayload } from '../types/admin.types';

export const UsersPage: React.FC = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Filters State
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [campusFilter, setCampusFilter] = useState<string>('ALL');

  // Modals & Drawers state
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminUserRecord | null>(null);
  const [viewTarget, setViewTarget] = useState<AdminUserRecord | null>(null);
  const [statusConfirmTarget, setStatusConfirmTarget] = useState<AdminUserRecord | null>(null);
  const [allocationsTarget, setAllocationsTarget] = useState<AdminUserRecord | null>(null);
  const toast = useToast();

  // Queries & Mutations
  const { data: usersData, isLoading, error: queryError } = useAdminUsers({
    roleId: roleFilter !== 'ALL' ? roleFilter : undefined,
    locationId: campusFilter !== 'ALL' ? campusFilter : undefined,
  });

  const { data: rolesData } = useRolesList();
  const { data: campuses = [] } = useAdminCampuses();

  const inviteMutation = useInviteUser();
  const saveUserMutation = useSaveUser();
  const toggleStatusMutation = useToggleUserStatus();

  const allUsers: AdminUserRecord[] = usersData?.users || [];

  // Format real roles for Invite modal and filter dropdown
  const formattedRoles = useMemo(() => {
    return (rolesData?.roles || []).map((r) => ({
      id: r.id,
      name: r.roleName,
      code: r.roleCode,
    }));
  }, [rolesData]);

  // Format real campuses for Invite modal and filter dropdown
  const formattedCampuses = useMemo(() => {
    return campuses.map((c) => ({
      id: c.id,
      name: c.name,
      code: c.code,
    }));
  }, [campuses]);

  // Metrics for KPI Cards
  const stats = useMemo(() => {
    const total = allUsers.length;
    const active = allUsers.filter((u) => u.status === 'ACTIVE').length;
    const invited = allUsers.filter((u) => u.status === 'INVITED').length;
    const inactive = allUsers.filter(
      (u) => u.status === 'INACTIVE' || u.status === 'SUSPENDED'
    ).length;

    return { total, active, invited, inactive };
  }, [allUsers]);

  const handleInviteSubmit = async (payload: InviteUserPayload) => {
    try {
      await inviteMutation.mutateAsync(payload);
      setIsInviteOpen(false);
      toast.success(
        `Onboarding invitation sent successfully to ${payload.email}`,
        'User Invited'
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send invitation';
      toast.error(msg, 'Invite Error');
      throw err;
    }
  };

  const handleSaveUserSubmit = async (payload: SaveUserPayload, id?: string) => {
    try {
      await saveUserMutation.mutateAsync({ payload, id });
      setIsAddOpen(false);
      setEditTarget(null);
      toast.success(
        id ? 'User profile updated successfully' : 'New user account provisioned successfully',
        'User Saved'
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save user account';
      toast.error(msg, 'Save Error');
      throw err;
    }
  };

  const handleConfirmStatusToggle = async (userId: string, nextActive: boolean, reason?: string) => {
    try {
      await toggleStatusMutation.mutateAsync({ userId, active: nextActive, reason });
      toast.success(
        `User account is now ${nextActive ? 'ACTIVE' : 'DEACTIVATED'}`,
        'Status Changed'
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to toggle user status';
      toast.error(msg, 'Status Error');
      throw err;
    }
  };

  // Table Columns
  const columns: DataTableColumn<AdminUserRecord>[] = [
    {
      key: 'name',
      label: 'USER INFO',
      sortable: true,
      align: 'left',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs shrink-0">
            {row.firstName?.[0] || 'U'}
            {row.lastName?.[0] || ''}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground text-xs sm:text-sm">
                {row.firstName} {row.lastName}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-muted text-muted-foreground border border-border">
                {row.userCode || `USR-${row.id.slice(0, 6).toUpperCase()}`}
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'primaryRole',
      label: 'PRIMARY ROLE',
      sortable: true,
      align: 'left',
      render: (val) => (
        <span className="font-semibold text-xs text-primary">
          {String(val || 'Member')}
        </span>
      ),
    },
    {
      key: 'assignedCampus',
      label: 'CAMPUS SCOPE',
      sortable: true,
      align: 'left',
      render: (val) => (
        <span className="text-xs text-muted-foreground">
          {String(val || 'All-Campus Scope')}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'STATUS',
      sortable: true,
      align: 'center',
      render: (val) => <AdminStatusBadge status={val} />,
    },
    {
      key: 'lastLoginAt',
      label: 'LAST LOGIN',
      sortable: true,
      align: 'left',
      render: (val) => (
        <span className="text-xs text-muted-foreground">
          {val ? new Date(val as string).toLocaleDateString() : 'Never'}
        </span>
      ),
    },
  ];

  return (
    <PageWrapper className="space-y-6">
      <AdminPageHeader
        title="User Management"
        subtitle="Manage directory profiles, onboarding invitations, account credentials, and allocations."
        icon={Users}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Administration', href: '/admin' },
          { label: 'Users' },
        ]}
        actionLabel="Invite User"
        onActionClick={() => setIsInviteOpen(true)}
        extraActions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={() => toast.info('Exporting users roster to CSV...', 'Export')}
            >
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<Upload className="w-4 h-4" />}
              onClick={() => toast.info('User batch provisioning wizard is opening...', 'Import')}
            >
              Import
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddOpen(true)}
              icon={<Plus className="h-4 w-4" />}
            >
              Direct Add
            </Button>
          </div>
        }
      />

      {/* Query Error Display */}
      {queryError && (
        <Alert variant="error">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-danger" />
            <span>
              {queryError instanceof Error ? queryError.message : 'Failed to load user directory'}
            </span>
          </div>
        </Alert>
      )}

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Accounts"
          value={stats.active}
          subtitle="Currently active credentials"
          color="green"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
        />
        <StatsCard
          title="Pending Invites"
          value={stats.invited}
          subtitle="Awaiting onboarding completion"
          color="orange"
          icon={<Mail className="w-5 h-5 text-amber-600" />}
        />
        <StatsCard
          title="Deactivated"
          value={stats.inactive}
          subtitle="Suspended login access"
          color="red"
          icon={<Power className="w-5 h-5 text-danger" />}
        />
        <StatsCard
          title="Total Registered"
          value={stats.total}
          subtitle="Institutional members"
          color="purple"
          icon={<Users className="w-5 h-5 text-primary" />}
        />
      </div>

      {/* Filter Toolbar & Reusable DataTable */}
      <DataTable<AdminUserRecord>
        columns={columns}
        data={allUsers}
        loading={isLoading}
        selectable
        selectedIds={selected}
        onSelectionChange={setSelected}
        onRowClick={(row) => setViewTarget(row)}
        rowIdKey="id"
        resultLabel="users"
        statusKey="status"
        toolbarLeft={
          <div className="flex items-center gap-3">
            <div className="w-44">
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="text-xs h-9"
              >
                <option value="ALL">All Roles</option>
                {formattedRoles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="w-48">
              <Select
                value={campusFilter}
                onChange={(e) => setCampusFilter(e.target.value)}
                className="text-xs h-9"
              >
                <option value="ALL">All Campus Scopes</option>
                {formattedCampuses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        }
        actionConfig={{
          onView: (row) => setViewTarget(row),
          onEdit: (row) => setEditTarget(row),
          customActions: (row) => [
            {
              label: 'Role Allocations',
              icon: <KeyRound className="h-4 w-4 text-amber-600" />,
              onClick: () => setAllocationsTarget(row),
            },
            {
              label: row.status === 'ACTIVE' ? 'Deactivate Account' : 'Activate Account',
              icon: (
                <Power
                  className={`h-4 w-4 ${
                    row.status === 'ACTIVE' ? 'text-danger' : 'text-success'
                  }`}
                />
              ),
              onClick: () => setStatusConfirmTarget(row),
            },
          ],
        }}
      />

      {/* Modals & Drawers */}
      <InviteUserModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onSubmit={handleInviteSubmit}
        roles={formattedRoles}
        campuses={formattedCampuses}
        isLoading={inviteMutation.isPending}
      />

      {(isAddOpen || editTarget) && (
        <UserFormModal
          isOpen={isAddOpen || Boolean(editTarget)}
          onClose={() => {
            setIsAddOpen(false);
            setEditTarget(null);
          }}
          initialData={editTarget}
          onSubmit={handleSaveUserSubmit}
          isLoading={saveUserMutation.isPending}
        />
      )}

      <UserViewDrawer
        isOpen={Boolean(viewTarget)}
        onClose={() => setViewTarget(null)}
        user={viewTarget}
        onEdit={(u) => setEditTarget(u)}
        onToggleStatus={(u) => setStatusConfirmTarget(u)}
        onOpenAllocations={(u) => setAllocationsTarget(u)}
      />

      <UserStatusConfirmModal
        isOpen={Boolean(statusConfirmTarget)}
        onClose={() => setStatusConfirmTarget(null)}
        user={statusConfirmTarget}
        onConfirm={handleConfirmStatusToggle}
        isLoading={toggleStatusMutation.isPending}
      />

      <UserAllocationsDrawer
        isOpen={Boolean(allocationsTarget)}
        onClose={() => setAllocationsTarget(null)}
        user={allocationsTarget}
      />
    </PageWrapper>
  );
};
