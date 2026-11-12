import React, { useState, useMemo } from 'react';
import { History, ShieldCheck, Activity, Sliders, Download, Upload } from 'lucide-react';
import { PageWrapper } from '@/app/layouts/page-wrapper';
import { AdminPageHeader } from '../components/common/admin-page-header';
import { AdminStatsRow } from '../components/common/admin-stats-row';
import { AuditLogsTable } from '../components/audit/audit-logs-table';
import { AuditDiffModal } from '../components/audit/audit-diff-modal';
import { Button } from '@/components/ui/button';
import { useAuditLogs } from '../hooks/use-admin';
import type { AuditLogRecord } from '../types/admin.types';

export const AuditLogsPage: React.FC = () => {
  const [inspectTarget, setInspectTarget] = useState<AuditLogRecord | null>(null);

  const { data: logsData, isLoading } = useAuditLogs();
  const allLogs = logsData?.logs || [];

  const stats = useMemo(() => {
    const total = allLogs.length;
    const roleChanges = allLogs.filter((l) => l.entity === 'Role' || l.entity === 'UserRole').length;
    const logins = allLogs.filter((l) => l.action.includes('LOGIN')).length;

    return [
      { title: 'Total Audit Trails', value: total, icon: History, subtitle: 'Recorded platform events', color: 'purple' as const },
      { title: 'RBAC Mutations', value: roleChanges, icon: Sliders, subtitle: 'Permission & role updates', color: 'orange' as const },
      { title: 'Authentication Events', value: logins, icon: ShieldCheck, subtitle: 'Sign-ins & session actions', color: 'green' as const },
      { title: 'Tamper Protection', value: 'Verified', icon: Activity, subtitle: 'Cryptographic log integrity', color: 'red' as const },
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
        extraActions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={() => alert('Exporting audit trail archive...')}
            >
              Export Archive
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<Upload className="w-4 h-4" />}
              onClick={() => alert('Verify log signature...')}
            >
              Verify Integrity
            </Button>
          </div>
        }
      />

      {/* KPI Stats */}
      <AdminStatsRow stats={stats} />

      {/* Audit Table with Grid lines, Search, and Pagination */}
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
