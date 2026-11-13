import * as React from 'react';
import { useState, useDeferredValue } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, Search, ShieldCheck, Activity, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TenantsTable } from '../components/tenants-table';
import { TenantStatusModal } from '../components/tenant-status-modal';
import { useTenants, useUpdateTenantStatus } from '../hooks/use-tenants';
import type { TenantDto, TenantStatus } from '../types/tenants.types';

export const TenantsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearch = useDeferredValue(searchTerm);
  const [selectedStatusTab, setSelectedStatusTab] = useState<TenantStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(1);
  const limit = 10;

  const [selectedTenantForStatus, setSelectedTenantForStatus] = useState<TenantDto | null>(null);

  const { data, isLoading, isError, error, refetch } = useTenants({
    search: deferredSearch.trim() || undefined,
    status: selectedStatusTab,
    page,
    limit,
  });

  const updateStatusMutation = useUpdateTenantStatus();

  const handleStatusSubmit = async (status: TenantStatus, reason?: string) => {
    if (!selectedTenantForStatus) return;
    try {
      await updateStatusMutation.mutateAsync({
        id: selectedTenantForStatus.id,
        payload: { status, reason },
      });
      setSelectedTenantForStatus(null);
    } catch {
      // Handled by mutation error state
    }
  };

  const tenants = data?.items || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6 p-6">
      {/* Top Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Educational Institutions
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage, provision, and configure school tenant organizations and their subscription packages.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            onClick={() => navigate('/tenants/new')}
            icon={<Plus className="h-4 w-4" />}
          >
            Provision School
          </Button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Institutions
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-foreground">{total}</div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Schools
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-foreground">
            {tenants.filter((t) => t.status === 'ACTIVE').length}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Trial In Progress
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-foreground">
            {tenants.filter((t) => t.status === 'TRIAL').length}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Suspended / Locked
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-foreground">
            {tenants.filter((t) => t.status === 'SUSPENDED').length}
          </div>
        </div>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 rounded-xl border border-border bg-surface p-1 shadow-xs">
          {(['ALL', 'ACTIVE', 'TRIAL', 'SUSPENDED', 'ARCHIVED'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setSelectedStatusTab(tab);
                setPage(1);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedStatusTab === tab
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-muted-foreground hover:bg-surface-muted hover:text-foreground'
              }`}
            >
              {tab === 'ALL' ? 'All Institutions' : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search school name or code..."
            className="w-full rounded-xl border border-border bg-surface py-2 pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
          />
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="rounded-2xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger flex items-center justify-between">
          <span>Failed to load institutions: {error?.message || 'Network error'}</span>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {/* Tenants Table */}
      <TenantsTable
        tenants={tenants}
        isLoading={isLoading}
        onOpenStatusModal={(tenant) => setSelectedTenantForStatus(tenant)}
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="text-xs text-muted-foreground">
            Showing Page <span className="font-semibold text-foreground">{page}</span> of{' '}
            <span className="font-semibold text-foreground">{totalPages}</span> ({total} institutions)
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
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Lifecycle Status Modal */}
      <TenantStatusModal
        isOpen={Boolean(selectedTenantForStatus)}
        tenant={selectedTenantForStatus}
        loading={updateStatusMutation.isPending}
        error={updateStatusMutation.error?.message}
        onClose={() => setSelectedTenantForStatus(null)}
        onSubmit={handleStatusSubmit}
      />
    </div>
  );
};

