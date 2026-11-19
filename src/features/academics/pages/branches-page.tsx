import React, { useState, useMemo } from 'react';
import {
  GitBranch,
  Building2,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  MapPin,
  Star,
  Eye,
  Edit2,
  Trash2,
  Power,
  RefreshCw,
  Building,
} from 'lucide-react';
import { PageWrapper } from '@/app/layouts/page-wrapper';
import { Breadcrumb } from '@/app/layouts/breadcrumb';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/data-display/stats-card';
import { DataTable, type DataTableColumn } from '@/components/data-display/data-table';
import { Badge } from '@/components/data-display/badge';
import { useToast } from '@/components/feedback/toast';
import { BranchFormModal } from '../components/branches/branch-form-modal';
import { BranchViewDrawer } from '../components/branches/branch-view-drawer';
import {
  useBranches,
  useSaveBranch,
  useToggleBranchStatus,
  useSetMainBranch,
  useDeleteBranch,
} from '../hooks/use-branches';
import { useAuthStore } from '@/stores/auth-store';
import { useAdminOrganizations } from '@/features/administration/hooks/use-admin';
import type { BranchDto, SaveBranchPayload, BranchLocationType } from '../types/branches.types';

export const BranchesPage: React.FC = () => {
  const toast = useToast();
  const { user, workspaces, activeWorkspaceId, setActiveWorkspace } = useAuthStore();
  const { data: orgsData } = useAdminOrganizations();

  // Unified available organizations
  const organizations = useMemo(() => {
    if (orgsData?.items?.length) return orgsData.items;
    return workspaces || [];
  }, [orgsData, workspaces]);

  // Selected Organization state
  const [selectedOrgId, setSelectedOrgId] = useState<string>(
    activeWorkspaceId || organizations[0]?.id || 'ALL'
  );

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Modals & Drawers state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<BranchDto | null>(null);
  const [viewTarget, setViewTarget] = useState<BranchDto | null>(null);

  // Queries & Mutations
  const { data: branches = [], isLoading, refetch } = useBranches({
    organizationId: selectedOrgId !== 'ALL' ? selectedOrgId : undefined,
  });
  const saveMutation = useSaveBranch();
  const toggleStatusMutation = useToggleBranchStatus();
  const setMainMutation = useSetMainBranch();
  const deleteMutation = useDeleteBranch();

  // Filtered branches
  const filteredBranches = useMemo(() => {
    return branches.filter((branch) => {
      // Organization filter
      if (selectedOrgId && selectedOrgId !== 'ALL' && branch.organizationId !== selectedOrgId) {
        return false;
      }

      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = (branch.name || '').toLowerCase().includes(q);
        const matchesCode = (branch.code || '').toLowerCase().includes(q);
        const matchesCity = (branch.city || '').toLowerCase().includes(q);
        const matchesPrincipal = (branch.principalName || '').toLowerCase().includes(q);
        const matchesOrg =
          (branch.organization?.displayName || '').toLowerCase().includes(q) ||
          (branch.organization?.code || '').toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesCity && !matchesPrincipal && !matchesOrg) {
          return false;
        }
      }

      // Status filter
      if (statusFilter === 'ACTIVE' && !branch.isActive) return false;
      if (statusFilter === 'INACTIVE' && branch.isActive) return false;

      // Type filter
      if (typeFilter !== 'ALL' && branch.locationType !== typeFilter) return false;

      return true;
    });
  }, [branches, selectedOrgId, search, statusFilter, typeFilter]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = branches.length;
    const active = branches.filter((b) => b.isActive).length;
    const mainCampus = branches.find((b) => b.isMainCampus);
    const branchCampuses = branches.filter((b) => b.locationType === 'BRANCH_CAMPUS').length;

    return {
      total,
      active,
      mainCampusName: mainCampus ? mainCampus.name : 'Not Designated',
      branchCampuses,
    };
  }, [branches]);

  // Handlers
  const handleSave = async (payload: SaveBranchPayload, id?: string) => {
    try {
      await saveMutation.mutateAsync({ payload, id });
      setIsAddOpen(false);
      setEditTarget(null);
      toast.success(
        id ? 'Branch updated successfully' : 'New academic branch created successfully',
        'Branch Saved'
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save branch';
      toast.error(msg, 'Save Error');
    }
  };

  const handleToggleStatus = async (branch: BranchDto) => {
    try {
      await toggleStatusMutation.mutateAsync({ id: branch.id, isActive: !branch.isActive });
      toast.success(
        `Branch '${branch.name}' is now ${!branch.isActive ? 'Active' : 'Inactive'}`,
        'Status Updated'
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to toggle branch status';
      toast.error(msg, 'Status Update Error');
    }
  };

  const handleSetMain = async (branch: BranchDto) => {
    if (branch.isMainCampus) return;
    try {
      await setMainMutation.mutateAsync(branch.id);
      toast.success(`'${branch.name}' is now designated as the Main Campus`, 'Main Campus Updated');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to set main campus';
      toast.error(msg, 'Update Error');
    }
  };

  const handleDelete = async (branch: BranchDto) => {
    if (branch.isMainCampus) {
      toast.error('The designated Main Campus cannot be deleted.', 'Action Blocked');
      return;
    }

    if (!window.confirm(`Are you sure you want to remove branch '${branch.name}'?`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(branch.id);
      toast.success(`Branch '${branch.name}' removed successfully`, 'Branch Deleted');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete branch';
      toast.error(msg, 'Delete Error');
    }
  };

  // Table Columns
  const columns: DataTableColumn<BranchDto>[] = [
    {
      key: 'name',
      label: 'BRANCH INFO',
      sortable: true,
      align: 'left',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground text-xs sm:text-sm">{row.name}</span>
              {row.isMainCampus && (
                <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.2 text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <Star className="h-2.5 w-2.5 fill-current" />
                  Main
                </span>
              )}
            </div>
            <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
              Code: <span className="font-bold text-foreground">{row.code}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'organization',
      label: 'ORGANIZATION',
      sortable: true,
      align: 'left',
      render: (_, row) =>
        row.organization ? (
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
            <div className="min-w-0">
              <span
                className="text-xs font-semibold text-foreground block truncate max-w-[130px]"
                title={row.organization.displayName}
              >
                {row.organization.displayName}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground block">
                {row.organization.code}
              </span>
            </div>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
    },
    {
      key: 'locationType',
      label: 'CATEGORY / TYPE',
      sortable: true,
      align: 'left',
      render: (val) => (
        <span className="text-xs text-foreground font-medium">
          {String(val || '—').replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'principalName',
      label: 'ACADEMIC HEAD',
      align: 'left',
      render: (val) => (
        <span className="text-xs text-foreground">
          {val ? String(val) : <span className="text-muted-foreground">—</span>}
        </span>
      ),
    },
    {
      key: 'city',
      label: 'LOCATION / CITY',
      align: 'left',
      render: (_, row) => (
        <div className="text-xs text-foreground flex items-center gap-1">
          <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
          <span>{[row.city, row.state].filter(Boolean).join(', ') || '—'}</span>
        </div>
      ),
    },
    {
      key: 'userRoles',
      label: 'ACTIVE USERS',
      align: 'center',
      render: (_, row) => (
        <span className="text-xs font-semibold text-primary">
          {row._count?.userRoles ?? row.userRoles?.length ?? 0}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'CREATED',
      sortable: true,
      align: 'left',
      render: (val) => (
        <span className="text-xs text-muted-foreground">
          {val ? new Date(val as string).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      key: 'isActive',
      label: 'STATUS',
      sortable: true,
      align: 'center',
      render: (val, row) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleToggleStatus(row);
          }}
          disabled={toggleStatusMutation.isPending}
          className="inline-flex items-center gap-1 cursor-pointer transition-opacity hover:opacity-80"
          title={`Click to ${val ? 'deactivate' : 'activate'}`}
        >
          <Badge variant={val ? 'success' : 'neutral'}>
            {val ? 'Active' : 'Inactive'}
          </Badge>
        </button>
      ),
    },
    {
      key: 'id',
      label: 'ACTIONS',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setViewTarget(row)}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-surface-muted hover:text-foreground transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setEditTarget(row);
              setIsAddOpen(true);
            }}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-surface-muted hover:text-primary transition-colors"
            title="Edit Branch"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          {!row.isMainCampus && (
            <button
              type="button"
              onClick={() => handleSetMain(row)}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-amber-500/10 hover:text-amber-600 transition-colors"
              title="Designate as Main Campus"
            >
              <Star className="h-4 w-4" />
            </button>
          )}
          {!row.isMainCampus && (
            <button
              type="button"
              onClick={() => handleDelete(row)}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-danger/10 hover:text-danger transition-colors"
              title="Delete Branch"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <PageWrapper className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Academics', href: '/app/academics' },
          { label: 'Branches Master' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
              icon={<RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setEditTarget(null);
                setIsAddOpen(true);
              }}
              icon={<Plus className="h-4 w-4" />}
            >
              Add Branch
            </Button>
          </div>
        }
      />

      {/* Header Banner */}
      <div className="flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <GitBranch className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-foreground sm:text-2xl">Branches Master</h1>
              <p className="text-xs text-muted-foreground">
                Manage academic campuses, satellite branches, and regional institutional faculties.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Branches"
          value={stats.total}
          icon={<GitBranch className="w-5 h-5 text-primary" />}
        />
        <StatsCard
          title="Active Campuses"
          value={stats.active}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
        />
        <StatsCard
          title="Branch Campuses"
          value={stats.branchCampuses}
          icon={<Building className="w-5 h-5 text-indigo-500" />}
        />
        <StatsCard
          title="Main Campus"
          value={stats.mainCampusName}
          icon={<Star className="w-5 h-5 text-amber-500" />}
        />
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface border border-border p-3.5 rounded-2xl">
        <div className="flex items-center gap-3 flex-1 flex-wrap">
          {/* Organization Switcher Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 whitespace-nowrap">
              <Building2 className="w-3.5 h-3.5 text-primary" />
              Organization:
            </span>
            <select
              value={selectedOrgId}
              onChange={(e) => {
                const newId = e.target.value;
                setSelectedOrgId(newId);
                if (newId !== 'ALL') {
                  setActiveWorkspace(newId);
                }
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-primary/30 bg-primary/5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer max-w-[220px] truncate"
            >
              <option value="ALL">All Organizations</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.displayName || org.name} ({org.code})
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search branches by name, code, city, or principal..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL">All Categories</option>
            <option value="MAIN_CAMPUS">Main Campus</option>
            <option value="BRANCH_CAMPUS">Branch Campus</option>
            <option value="TRAINING_CENTER">Training Center</option>
            <option value="ADMINISTRATIVE_HQ">Administrative HQ</option>
            <option value="HOSTEL_FACILITY">Hostel Facility</option>
            <option value="SPORTS_COMPLEX">Sports Complex</option>
          </select>
        </div>
      </div>

      {/* Branches DataTable */}
      <div className="bg-surface border border-border rounded-2xl shadow-xs overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredBranches}
          isLoading={isLoading}
          emptyMessage="No branches found. Click 'Add Branch' to initialize an academic branch."
          onRowClick={(row) => setViewTarget(row)}
        />
      </div>

      {/* Add / Edit Branch Modal */}
      <BranchFormModal
        isOpen={isAddOpen}
        onClose={() => {
          setIsAddOpen(false);
          setEditTarget(null);
        }}
        onSubmit={handleSave}
        initialData={editTarget}
        isLoading={saveMutation.isPending}
        organizations={organizations}
        defaultOrganizationId={selectedOrgId !== 'ALL' ? selectedOrgId : activeWorkspaceId || organizations[0]?.id}
      />

      {/* View Drawer */}
      <BranchViewDrawer
        isOpen={Boolean(viewTarget)}
        onClose={() => setViewTarget(null)}
        branch={viewTarget}
        onEdit={(branch) => {
          setViewTarget(null);
          setEditTarget(branch);
          setIsAddOpen(true);
        }}
      />
    </PageWrapper>
  );
};

