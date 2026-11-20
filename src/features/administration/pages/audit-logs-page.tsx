import React, { useState, useMemo } from 'react';
import {
  History,
  ShieldCheck,
  Search,
  Filter,
  Download,
  RotateCcw,
  AlertCircle,
  RefreshCw,
  Layers,
} from 'lucide-react';
import { PageWrapper } from '@/app/layouts/page-wrapper';
import { AdminPageHeader } from '../components/common/admin-page-header';
import { AdminStatsRow, type AdminStatItem } from '../components/common/admin-stats-row';
import { AuditLogsTable } from '../components/audit/audit-logs-table';
import { AuditDetailDrawer } from '../components/audit/audit-detail-drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/data-display/badge';
import { useToast } from '@/components/feedback/toast';
import { useAuditLogs, useAdminCampuses, useExportAuditLogs } from '../hooks/use-admin';
import { usePermission } from '@/features/roles-permissions/hooks/use-permission';
import { useDebounce } from '@/hooks/use-debounce';
import type { AuditLogRecord, AuditLogFilters } from '../types/admin.types';

export const AuditLogsPage: React.FC = () => {
  // Filter States
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);
  const [actionFilter, setActionFilter] = useState('ALL');
  const [entityFilter, setEntityFilter] = useState('ALL');
  const [campusFilter, setCampusFilter] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Detail Drawer State
  const [inspectTarget, setInspectTarget] = useState<AuditLogRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toast = useToast();
  const { hasPermission: canExport } = usePermission('settings.audit_logs.trail.export');
  const exportMutation = useExportAuditLogs();

  // Campuses for dropdown
  const { data: campuses = [] } = useAdminCampuses();

  // Construct query filters
  const activeFilters = useMemo<AuditLogFilters>(() => {
    const f: AuditLogFilters = {
      page,
      limit,
    };
    if (debouncedSearch.trim()) f.search = debouncedSearch.trim();
    if (actionFilter !== 'ALL') f.action = actionFilter;
    if (entityFilter !== 'ALL') f.entity = entityFilter;
    if (campusFilter !== 'ALL') f.locationId = campusFilter;
    if (startDate) f.startDate = new Date(startDate).toISOString();
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      f.endDate = end.toISOString();
    }
    return f;
  }, [debouncedSearch, actionFilter, entityFilter, campusFilter, startDate, endDate, page, limit]);

  // Query audit logs
  const {
    data: logsResult,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAuditLogs(activeFilters);

  const allLogs = logsResult?.logs || [];
  const totalCount = logsResult?.total || 0;

  // Filter change handlers that reset page to 1
  const handleSearchChange = (val: string) => {
    setSearchInput(val);
    setPage(1);
  };

  const handleActionChange = (val: string) => {
    setActionFilter(val);
    setPage(1);
  };

  const handleEntityChange = (val: string) => {
    setEntityFilter(val);
    setPage(1);
  };

  const handleCampusChange = (val: string) => {
    setCampusFilter(val);
    setPage(1);
  };

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    setPage(1);
  };

  const handleEndDateChange = (val: string) => {
    setEndDate(val);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setActionFilter('ALL');
    setEntityFilter('ALL');
    setCampusFilter('ALL');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  const handleInspect = (record: AuditLogRecord) => {
    setInspectTarget(record);
    setIsDrawerOpen(true);
  };

  // CSV Export handler
  const handleExport = async () => {
    if (exportMutation.isPending) return;
    try {
      const { blob, filename } = await exportMutation.mutateAsync(activeFilters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success(
        `Audit trail exported successfully (${filename})`,
        'Export Complete'
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to export audit logs';
      toast.error(message, 'Export Failed');
    }
  };

  // KPI Metrics (Calculated from real data and server totals)
  const stats: AdminStatItem[] = useMemo(() => {
    const authCount = allLogs.filter((l) =>
      l.action.includes('LOGIN') || l.action.includes('LOGOUT') || l.action.includes('PASSWORD') || l.action.includes('SESSION')
    ).length;
    const rbacCount = allLogs.filter((l) =>
      l.entity === 'Role' || l.entity === 'UserRole' || l.action.includes('ROLE') || l.action.includes('PERMISSION')
    ).length;
    const uniqueEntities = new Set(allLogs.map((l) => l.entity)).size;

    return [
      {
        title: 'Total Audit Trails',
        value: totalCount,
        icon: History,
        subtitle: 'Recorded institutional events',
        color: 'purple',
      },
      {
        title: 'RBAC & Access Mutations',
        value: rbacCount,
        icon: ShieldCheck,
        subtitle: 'Role & permission changes (page)',
        color: 'orange',
      },
      {
        title: 'Authentication & Session Events',
        value: authCount,
        icon: History,
        subtitle: 'Sign-in & credential events (page)',
        color: 'green',
      },
      {
        title: 'Monitored Target Entities',
        value: uniqueEntities,
        icon: Layers,
        subtitle: 'Distinct resources modified (page)',
        color: 'blue',
      },
    ];
  }, [allLogs, totalCount]);

  const hasActiveFilters = Boolean(
    searchInput.trim() ||
      actionFilter !== 'ALL' ||
      entityFilter !== 'ALL' ||
      campusFilter !== 'ALL' ||
      startDate ||
      endDate
  );

  return (
    <PageWrapper className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        title="Audit & Compliance Logs"
        subtitle="Immutable security audit trail of authentication events, user actions, and administrative configuration changes."
        icon={History}
        badge={
          <Badge variant="primary" className="ml-2 font-mono text-xs">
            {totalCount} Total Events
          </Badge>
        }
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Administration', href: '/admin' },
          { label: 'Audit & Compliance Logs' },
        ]}
        extraActions={
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary font-mono">
              {totalCount} Total Events
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              icon={<RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />}
              title="Refresh Audit Trail"
            >
              Refresh
            </Button>
            {canExport && (
              <Button
                variant="outline"
                size="sm"
                icon={<Download className="h-4 w-4" />}
                onClick={handleExport}
                disabled={exportMutation.isPending || isLoading}
              >
                {exportMutation.isPending ? 'Generating CSV...' : 'Export CSV'}
              </Button>
            )}
          </div>
        }
      />

      {/* KPI Stats */}
      <AdminStatsRow stats={stats} />

      {/* Server-Side Filter Controls */}
      <div className="rounded-2xl border border-border bg-surface p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Filter Audit Records
            </h3>
            {hasActiveFilters && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                Active Filter
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="h-7 text-xs text-muted-foreground hover:text-foreground"
              icon={<RotateCcw className="h-3 w-3" />}
            >
              Clear Filters
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Debounced Search */}
          <div className="relative col-span-1 sm:col-span-2">
            <input
              type="text"
              placeholder="Search by actor name, email, IP, action, or entity ID..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface pl-9 pr-4 py-2 text-xs font-medium text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>

          {/* Action Filter */}
          <div>
            <select
              value={actionFilter}
              onChange={(e) => handleActionChange(e.target.value)}
              aria-label="Filter by Event Action"
              className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
            >
              <option value="ALL">All Event Actions</option>
              <option value="LOGIN_SUCCESS">LOGIN_SUCCESS (Sign In)</option>
              <option value="LOGIN_FAILED">LOGIN_FAILED (Failed Sign In)</option>
              <option value="LOGOUT">LOGOUT (Signed Out)</option>
              <option value="PASSWORD_CHANGED">PASSWORD_CHANGED</option>
              <option value="PASSWORD_RESET_COMPLETED">PASSWORD_RESET_COMPLETED</option>
              <option value="ADMIN_REVOKED_SESSION">ADMIN_REVOKED_SESSION</option>
              <option value="ROLE_CAPABILITIES_UPDATED">ROLE_CAPABILITIES_UPDATED</option>
              <option value="USER_ROLE_ASSIGNED">USER_ROLE_ASSIGNED</option>
              <option value="USER_ROLE_REVOKED">USER_ROLE_REVOKED</option>
              <option value="TENANT_CONFIG_UPDATED">TENANT_CONFIG_UPDATED</option>
              <option value="ORGANIZATION_UPDATED">ORGANIZATION_UPDATED</option>
            </select>
          </div>

          {/* Entity Filter */}
          <div>
            <select
              value={entityFilter}
              onChange={(e) => handleEntityChange(e.target.value)}
              aria-label="Filter by Target Entity"
              className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
            >
              <option value="ALL">All Target Entities</option>
              <option value="Session">Session</option>
              <option value="User">User</option>
              <option value="Role">Role</option>
              <option value="UserRole">UserRole</option>
              <option value="Organization">Organization</option>
              <option value="Location">Campus / Location</option>
              <option value="Settings">Tenant Settings</option>
            </select>
          </div>

          {/* Campus Filter */}
          <div>
            <select
              value={campusFilter}
              onChange={(e) => handleCampusChange(e.target.value)}
              aria-label="Filter by Campus Location"
              className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
            >
              <option value="ALL">All Campus Scopes</option>
              {campuses.map((campus) => (
                <option key={campus.id} value={campus.id}>
                  {campus.name}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground whitespace-nowrap">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              aria-label="Filter From Date"
              className="w-full rounded-xl border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* End Date */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground whitespace-nowrap">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              aria-label="Filter To Date"
              className="w-full rounded-xl border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      {/* Query Error State with Retry */}
      {isError && (
        <div className="rounded-xl border border-danger/30 bg-danger/10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-danger shrink-0" />
            <div>
              <p className="text-sm font-semibold text-danger">Failed to retrieve audit log telemetry</p>
              <p className="text-xs text-muted-foreground">
                {error instanceof Error ? error.message : 'A network error occurred while querying audit records.'}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="border-danger/30 text-danger hover:bg-danger/10"
            icon={<RefreshCw className="h-4 w-4" />}
          >
            Retry Query
          </Button>
        </div>
      )}

      {/* Real Audit Logs Table with Server-Side Pagination */}
      <AuditLogsTable
        logs={allLogs}
        total={totalCount}
        page={page}
        limit={limit}
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
        onInspect={handleInspect}
        isLoading={isLoading}
      />

      {/* Audit Detail Drawer */}
      <AuditDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        record={inspectTarget}
      />
    </PageWrapper>
  );
};
