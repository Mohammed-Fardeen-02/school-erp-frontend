import * as React from 'react';
import { useState, useDeferredValue } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, Search, ShieldCheck, ArrowRight, UserCheck, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/data-display/badge';
import { AssignRoleModal } from '@/features/roles-permissions/components/assignments/assign-role-modal';
import { useWorkspaceMembers } from '@/features/roles-permissions/hooks/use-assignments';
import { usePermission } from '@/features/roles-permissions/hooks/use-permission';
import { PermissionGate } from '@/features/roles-permissions/components/guards/permission-gate';
import type { WorkspaceMemberSummary } from '@/features/roles-permissions/types/assignments.types';

export const UsersListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearch = useDeferredValue(searchTerm);
  const [page, setPage] = useState(1);
  const limit = 15;

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [preselectedMember, setPreselectedMember] = useState<WorkspaceMemberSummary | null>(null);

  const { data, isLoading, isError, error, refetch } = useWorkspaceMembers({
    search: deferredSearch.trim() || undefined,
    page,
    limit,
  });

  const { hasPermission: canAssign } = usePermission(
    'settings.user_assignments.allocations.assign'
  );

  const members = data?.members ?? [];
  const meta = data?.meta ?? { total: 0, page: 1, limit: 15, totalPages: 1 };

  const handleOpenAssign = (member?: WorkspaceMemberSummary) => {
    setPreselectedMember(member ?? null);
    setIsAssignModalOpen(true);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Members & User Allocations
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Discover active institutional faculty, staff, and students and manage their campus-scoped role allocations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <PermissionGate permission="settings.user_assignments.allocations.assign">
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleOpenAssign()}
              icon={<UserPlus className="h-4 w-4" />}
            >
              Allocate Role
            </Button>
          </PermissionGate>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Active Members
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-foreground">{meta.total}</div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Verified Accounts
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-foreground">
            {members.filter((m: WorkspaceMemberSummary) => m.isActive).length}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Current Page Results
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-foreground">{members.length}</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search member name, email, or phone..."
            className="w-full rounded-xl border border-border bg-surface py-2 pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
          />
        </div>
      </div>

      {/* Error Notice */}
      {isError && (
        <div className="rounded-2xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger flex items-center justify-between">
          <span>Failed to load organization members: {error?.message || 'Network error'}</span>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-border bg-surface">
          <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>Discovering organization members...</span>
          </div>
        </div>
      ) : members.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-muted text-muted-foreground mb-3">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">No Members Found</h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            No active members matched your search query in this organization workspace.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-surface-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th scope="col" className="px-6 py-3.5">
                    Member Name
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Contact Email
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Phone
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {members.map((member: WorkspaceMemberSummary) => {
                  const initials = `${member.firstName?.[0] || ''}${member.lastName?.[0] || ''}`.toUpperCase();

                  return (
                    <tr
                      key={member.id}
                      className="group transition-colors hover:bg-surface-muted/30"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary text-xs shadow-xs">
                            {initials || 'U'}
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => navigate(`/users/${member.id}/allocations`)}
                              className="font-bold text-foreground hover:text-primary transition-colors text-left"
                            >
                              {member.firstName} {member.lastName}
                            </button>
                            <span className="block text-[11px] text-muted-foreground font-mono">
                              ID: {member.id.slice(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground/60" />
                          <span>{member.email}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-xs text-muted-foreground">
                        {member.phone ? (
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground/60" />
                            <span>{member.phone}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <Badge variant={member.isActive ? 'success' : 'danger'}>
                          {member.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/users/${member.id}/allocations`)}
                            title="View Allocations"
                            className="text-xs"
                          >
                            Allocations <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                          {canAssign && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenAssign(member)}
                              title="Assign Role"
                              className="text-xs"
                            >
                              + Assign Role
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="text-xs text-muted-foreground">
            Page <span className="font-semibold text-foreground">{meta.page}</span> of{' '}
            <span className="font-semibold text-foreground">{meta.totalPages}</span> ({meta.total} total members)
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, meta.totalPages))}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Assign Role Modal */}
      <AssignRoleModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setPreselectedMember(null);
        }}
        initialMember={preselectedMember}
      />
    </div>
  );
};

