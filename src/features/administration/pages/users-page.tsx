import React, { useState, useMemo } from 'react';
import { Users, Plus, Search, Eye, Edit2, KeyRound, Power, Mail, ShieldCheck } from 'lucide-react';
import { PageWrapper } from '@/app/layouts/page-wrapper';
import { AdminPageHeader } from '../components/common/admin-page-header';
import { AdminStatsRow } from '../components/common/admin-stats-row';
import { AdminStatusBadge } from '../components/common/admin-status-badge';
import { InviteUserModal } from '../components/users/invite-user-modal';
import { UserFormModal } from '../components/users/user-form-modal';
import { UserViewDrawer } from '../components/users/user-view-drawer';
import { Input } from '@/components/forms/input';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INVITED' | 'INACTIVE'>('ALL');

  // Modals & Drawers state
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminUserRecord | null>(null);
  const [viewTarget, setViewTarget] = useState<AdminUserRecord | null>(null);

  // Queries & Mutations
  const { data: usersData } = useAdminUsers(searchTerm);
  const inviteMutation = useInviteUser();
  const saveUserMutation = useSaveUser();
  const toggleStatusMutation = useToggleUserStatus();

  const allUsers = usersData?.users || [];

  const filteredUsers = useMemo(() => {
    if (statusFilter === 'ALL') return allUsers;
    return allUsers.filter((u) => u.status === statusFilter);
  }, [allUsers, statusFilter]);

  // Metrics
  const stats = useMemo(() => {
    const total = allUsers.length;
    const active = allUsers.filter((u) => u.status === 'ACTIVE').length;
    const invited = allUsers.filter((u) => u.status === 'INVITED').length;
    const inactive = allUsers.filter((u) => u.status === 'INACTIVE' || u.status === 'SUSPENDED').length;

    return [
      { title: 'Registered Users', value: total, icon: Users, subtitle: 'Total institutional members' },
      { title: 'Active Accounts', value: active, icon: ShieldCheck, subtitle: 'Currently active credentials' },
      { title: 'Pending Invites', value: invited, icon: Mail, subtitle: 'Awaiting onboarding completion' },
      { title: 'Deactivated Accounts', value: inactive, icon: Power, subtitle: 'Suspended login access' },
    ];
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddOpen(true)}
            icon={<Plus className="h-4 w-4" />}
          >
            Direct Add
          </Button>
        }
      />

      {/* KPI Stats */}
      <AdminStatsRow stats={stats} />

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-border bg-surface-muted/50 p-1">
          {(['ALL', 'ACTIVE', 'INVITED', 'INACTIVE'] as const).map((st) => (
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
              {st === 'ALL' ? 'All Users' : st.charAt(0) + st.slice(1).toLowerCase()}
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
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Primary Role</th>
                <th className="py-3 px-4">Campus Scope</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Login</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-surface-muted/30 transition-colors">
                  <td className="py-3.5 px-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs">
                      {u.firstName[0]}
                      {u.lastName[0]}
                    </div>
                    <div>
                      <div className="font-bold text-foreground">
                        {u.firstName} {u.lastName}
                      </div>
                      <div className="text-muted-foreground text-[11px]">{u.email}</div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-primary">{u.primaryRole || 'Staff Member'}</span>
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">{u.assignedCampus || 'Main Campus'}</td>
                  <td className="py-3.5 px-4">
                    <AdminStatusBadge status={u.status} />
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">
                    {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewTarget(u)}
                        title="View Profile"
                        icon={<Eye className="h-4 w-4" />}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditTarget(u)}
                        title="Edit User"
                        icon={<Edit2 className="h-4 w-4 text-primary" />}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/users/${u.id}/allocations`)}
                        title="Role Allocations"
                        icon={<KeyRound className="h-4 w-4 text-amber-600" />}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(u)}
                        title={u.status === 'ACTIVE' ? 'Deactivate Account' : 'Activate Account'}
                        icon={<Power className={`h-4 w-4 ${u.status === 'ACTIVE' ? 'text-danger' : 'text-success'}`} />}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
