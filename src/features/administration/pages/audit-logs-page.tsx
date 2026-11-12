import React, { useState, useMemo } from 'react';
import { History, Search, ShieldCheck, Activity, Sliders } from 'lucide-react';
import { PageWrapper } from '@/app/layouts/page-wrapper';
import { AdminPageHeader } from '../components/common/admin-page-header';
import { AdminStatsRow } from '../components/common/admin-stats-row';
import { AuditLogsTable } from '../components/audit/audit-logs-table';
import { AuditDiffModal } from '../components/audit/audit-diff-modal';
import { Input } from '@/components/forms/input';
import { useAuditLogs } from '../hooks/use-admin';
import type { AuditLogRecord } from '../types/admin.types';

export const AuditLogsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [entityFilter, setEntityFilter] = useState<'ALL' | 'Role' | 'User' | 'Session'>('ALL');
  const [inspectTarget, setInspectTarget] = useState<AuditLogRecord | null>(null);

  const { data: logsData, isLoading } = useAuditLogs({
    search: searchTerm || undefined,
    entity: entityFilter === 'ALL' ? undefined : entityFilter,
  });

  const allLogs = logsData?.logs || [];

  const stats = useMemo(() => {
    const total = allLogs.length;
    const roleChanges = allLogs.filter((l) => l.entity === 'Role' || l.entity === 'UserRole').length;
    const logins = allLogs.filter((l) => l.action.includes('LOGIN')).length;

    return [
      { title: 'Total Audit Trails', value: total, icon: History, subtitle: 'Recorded platform events' },
      { title: 'RBAC Mutations', value: roleChanges, icon: Sliders, subtitle: 'Permission & role updates' },
      { title: 'Authentication Events', value: logins, icon: ShieldCheck, subtitle: 'Sign-ins & session actions' },
      { title: 'Tamper Protection', value: 'Verified', icon: Activity, subtitle: 'Cryptographic log integrity' },
    ];
  }, [allLogs]);

  return (
    <PageWrapper className="space-y-6">
      <AdminPageHeader
        title="Audit & Activity Logs"
        subtitle="Immutable security trail of login events, user actions, and administrative permission changes."
        icon={History}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Administration', href: '/admin' },
          { label: 'Audit Logs' },
        ]}
      />

      {/* KPI Stats */}
      <AdminStatsRow stats={stats} />

      {/* Search & Entity Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Search audit events by action, actor, or entity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-border bg-surface-muted/50 p-1">
          {(['ALL', 'Role', 'User', 'Session'] as const).map((ent) => (
            <button
              key={ent}
              type="button"
              onClick={() => setEntityFilter(ent)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                entityFilter === ent
                  ? 'bg-surface text-primary shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {ent === 'ALL' ? 'All Events' : `${ent} Events`}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Table */}
      <AuditLogsTable
        logs={allLogs}
        onInspect={(record) => setInspectTarget(record)}
        isLoading={isLoading}
      />

      {/* Diff Inspection Modal */}
      <AuditDiffModal
        isOpen={Boolean(inspectTarget)}
        onClose={() => setInspectTarget(null)}
        record={inspectTarget}
      />
    </PageWrapper>
  );
};
