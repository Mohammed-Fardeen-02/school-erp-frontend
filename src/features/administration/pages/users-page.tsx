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
} from 'lucide-react';
import { PageWrapper } from '@/app/layouts/page-wrapper';
import { AdminPageHeader } from '../components/common/admin-page-header';
import { StatsCard } from '@/components/data-display/stats-card';
import { AdminStatusBadge } from '../components/common/admin-status-badge';
import { DataTable, type DataTableColumn } from '@/components/data-display/data-table';
import { InviteUserModal } from '../components/users/invite-user-modal';
import { UserFormModal } from '../components/users/user-form-modal';
import { UserViewDrawer } from '../components/users/user-view-drawer';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  useAdminUsers,
  useInviteUser,
  useSaveUser,
  useToggleUserStatus,
} from '../hooks/use-admin';
import type { AdminUserRecord, InviteUserPayload, SaveUserPayload } from '../types/admin.types';

export const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Modals & Drawers state
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminUserRecord | null>(null);
  const [viewTarget, setViewTarget] = useState<AdminUserRecord | null>(null);

  // Queries & Mutations
  const { data: usersData, isLoading } = useAdminUsers();
  const inviteMutation = useInviteUser();
  const saveUserMutation = useSaveUser();
  const toggleStatusMutation = useToggleUserStatus();

  const allUsers: AdminUserRecord[] = usersData?.users || [];

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
    await inviteMutation.mutateAsync(payload);
    setIsInviteOpen(false);
  };

  const handleSaveUserSubmit = async (payload: SaveUserPayload, id?: string) => {
    await saveUserMutation.mutateAsync({ payload, id });
    setIsAddOpen(false);
    setEditTarget(null);
  };

  const handleToggleStatus = async (user: AdminUserRecord) => {
    const nextStatus = user.status !== 'ACTIVE';
    await toggleStatusMutation.mutateAsync({ userId: user.id, active: nextStatus });
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
            <div className="font-semibold text-foreground text-xs sm:text-sm">
              {row.firstName} {row.lastName}
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
          {String(val || 'Staff Member')}
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
          {String(val || 'Main Campus')}
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
              onClick={() => alert('Exporting users directory...')}
            >
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<Upload className="w-4 h-4" />}
              onClick={() => alert('Import users flow...')}
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

      {/* KPI Stats Row (Matching Reference Image) */}
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

      {/* Reusable DataTable with Search, Dynamic Status Popover, Column Visibility, and Numbered Pagination */}
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
        actionConfig={{
          onView: (row) => setViewTarget(row),
          onEdit: (row) => setEditTarget(row),
          customActions: (row) => [
            {
              label: 'Role Allocations',
              icon: <KeyRound className="h-4 w-4 text-amber-600" />,
              onClick: () => navigate(`/users/${row.id}/allocations`),
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
              onClick: () => handleToggleStatus(row),
            },
          ],
        }}
      />

      {/* Modals & Drawers */}
      <InviteUserModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onSubmit={handleInviteSubmit}
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
        onToggleStatus={handleToggleStatus}
      />
    </PageWrapper>
  );
};
