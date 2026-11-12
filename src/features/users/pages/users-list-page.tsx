import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, ShieldCheck, ArrowRight, UserCheck, Phone, Mail } from 'lucide-react';
import { PageWrapper } from '@/app/layouts/page-wrapper';
import { AdminPageHeader } from '@/features/administration/components/common/admin-page-header';
import { StatsCard } from '@/components/data-display/stats-card';
import { Badge } from '@/components/data-display/badge';
import { DataTable, type DataTableColumn } from '@/components/data-display/data-table';
import { AssignRoleModal } from '@/features/roles-permissions/components/assignments/assign-role-modal';
import { useWorkspaceMembers } from '@/features/roles-permissions/hooks/use-assignments';
import { usePermission } from '@/features/roles-permissions/hooks/use-permission';
import type { WorkspaceMemberSummary } from '@/features/roles-permissions/types/assignments.types';

export const UsersListPage: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [preselectedMember, setPreselectedMember] = useState<WorkspaceMemberSummary | null>(null);

  const { data, isLoading } = useWorkspaceMembers({
    limit: 50,
  });

  const { hasPermission: canAssign } = usePermission(
    'settings.user_assignments.allocations.assign'
  );

  const members: WorkspaceMemberSummary[] = data?.members ?? [];
  const meta = data?.meta ?? { total: 0, page: 1, limit: 50, totalPages: 1 };

  const handleOpenAssign = (member?: WorkspaceMemberSummary) => {
    setPreselectedMember(member ?? null);
    setIsAssignModalOpen(true);
  };

  const columns: DataTableColumn<WorkspaceMemberSummary>[] = [
    {
      key: 'name',
      label: 'MEMBER INFO',
      sortable: true,
      align: 'left',
      render: (_, row) => {
        const initials = `${row.firstName?.[0] || ''}${row.lastName?.[0] || ''}`.toUpperCase() || 'U';
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary text-xs shadow-xs">
              {initials}
            </div>
            <div>
              <button
                type="button"
                onClick={() => navigate(`/users/${row.id}/allocations`)}
                className="font-bold text-foreground hover:text-primary transition-colors text-left text-xs sm:text-sm"
              >
                {row.firstName} {row.lastName}
              </button>
              <span className="block text-[11px] text-muted-foreground font-mono">
                ID: {row.id.slice(0, 8)}...
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: 'email',
      label: 'CONTACT EMAIL',
      sortable: true,
      align: 'left',
      render: (val) => (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Mail className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span>{String(val || '—')}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'PHONE',
      sortable: true,
      align: 'left',
      render: (val) =>
        val ? (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Phone className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span>{String(val)}</span>
          </div>
        ) : (
          <span className="text-muted-foreground/40">—</span>
        ),
    },
    {
      key: 'isActive',
      label: 'STATUS',
      sortable: true,
      align: 'center',
      render: (val) => (
        <Badge variant={val ? 'success' : 'danger'}>
          {val ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  return (
    <PageWrapper className="space-y-6">
      {/* Unified division: Breadcrumb on the left, action buttons on the right */}
      <AdminPageHeader
        title="Members & User Allocations"
        subtitle="Discover active institutional faculty, staff, and students and manage their campus-scoped role allocations."
        icon={Users}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Administration', href: '/admin' },
          { label: 'Members & Allocations' },
        ]}
        actionLabel={canAssign ? 'Allocate Role' : undefined}
        onActionClick={canAssign ? () => handleOpenAssign() : undefined}
        actionIcon={<UserPlus className="h-4 w-4" />}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard
          title="Total Active Members"
          value={meta.total}
          subtitle="Registered institutional accounts"
          color="purple"
          icon={<Users className="w-5 h-5 text-primary" />}
        />
        <StatsCard
          title="Verified Accounts"
          value={members.filter((m: WorkspaceMemberSummary) => m.isActive).length}
          subtitle="Active credentials"
          color="green"
          icon={<UserCheck className="w-5 h-5 text-emerald-600" />}
        />
        <StatsCard
          title="Current Page Records"
          value={members.length}
          subtitle="Displayed in table"
          color="blue"
          icon={<ShieldCheck className="w-5 h-5 text-blue-600" />}
        />
      </div>

      {/* DataTable with Grid Borders, Search, Status Popover, and Pagination */}
      <DataTable<WorkspaceMemberSummary>
        columns={columns}
        data={members}
        loading={isLoading}
        selectable
        selectedIds={selected}
        onSelectionChange={setSelected}
        onRowClick={(row) => navigate(`/users/${row.id}/allocations`)}
        rowIdKey="id"
        resultLabel="members"
        searchPlaceholder="Search member name, email, or phone..."
        actionConfig={{
          customActions: (row) => [
            {
              label: 'View Allocations',
              icon: <ArrowRight className="h-4 w-4" />,
              onClick: () => navigate(`/users/${row.id}/allocations`),
            },
            ...(canAssign
              ? [
                  {
                    label: 'Assign Role',
                    icon: <UserPlus className="h-4 w-4" />,
                    onClick: () => handleOpenAssign(row),
                  },
                ]
              : []),
          ],
        }}
      />

      {/* Assign Role Modal */}
      <AssignRoleModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setPreselectedMember(null);
        }}
        initialMember={preselectedMember}
      />
    </PageWrapper>
  );
};

