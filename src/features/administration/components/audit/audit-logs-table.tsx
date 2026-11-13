import React from 'react';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/data-display/badge';
import { DataTable, type DataTableColumn } from '@/components/data-display/data-table';
import type { AuditLogRecord } from '../../types/admin.types';

export interface AuditLogsTableProps {
  logs: AuditLogRecord[];
  onInspect: (record: AuditLogRecord) => void;
  isLoading?: boolean;
}

export const AuditLogsTable: React.FC<AuditLogsTableProps> = ({
  logs,
  onInspect,
  isLoading,
}) => {
  const columns: DataTableColumn<AuditLogRecord>[] = [
    {
      key: 'createdAt',
      label: 'TIMESTAMP',
      sortable: true,
      align: 'left',
      render: (val) => (
        <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">
          {new Date(val as string).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'actorName',
      label: 'ACTOR',
      sortable: true,
      align: 'left',
      render: (_, row) => (
        <div>
          <div className="font-bold text-xs text-foreground">{row.actorName}</div>
          <div className="text-[11px] text-muted-foreground">{row.actorEmail}</div>
        </div>
      ),
    },
    {
      key: 'action',
      label: 'ACTION',
      sortable: true,
      align: 'center',
      render: (val) => (
        <span className="font-mono text-xs">
          <Badge variant="primary">{String(val)}</Badge>
        </span>
      ),
    },
    {
      key: 'entity',
      label: 'TARGET ENTITY',
      sortable: true,
      align: 'left',
      render: (_, row) => (
        <span className="font-semibold text-xs text-foreground">
          {row.entity} {row.entityId ? `#${row.entityId}` : ''}
        </span>
      ),
    },
    {
      key: 'ipAddress',
      label: 'IP ADDRESS',
      sortable: true,
      align: 'left',
      render: (val) => (
        <span className="font-mono text-xs text-muted-foreground">
          {String(val || 'Internal')}
        </span>
      ),
    },
  ];

  return (
    <DataTable<AuditLogRecord>
      columns={columns}
      data={logs}
      loading={isLoading}
      rowIdKey="id"
      resultLabel="audit logs"
      actionConfig={{
        onView: (row) => onInspect(row),
        customActions: (row) => [
          {
            label: 'Inspect Diff',
            icon: <Eye className="h-4 w-4 text-primary" />,
            onClick: () => onInspect(row),
          },
        ],
      }}
    />
  );
};
