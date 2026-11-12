import React from 'react';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/data-display/badge';
import type { AuditLogRecord } from '../../types/admin.types';

export interface AuditLogsTableProps {
  logs: AuditLogRecord[];
  onInspect: (record: AuditLogRecord) => void;
  isLoading?: boolean;
}

export const AuditLogsTable: React.FC<AuditLogsTableProps> = ({ logs, onInspect, isLoading: _isLoading }) => {
  return (
    <div className="rounded-2xl border border-border bg-surface shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-muted/60 text-muted-foreground uppercase font-bold text-[10px] tracking-wider border-b border-border">
            <tr>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Actor</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Target Entity</th>
              <th className="py-3 px-4">IP Address</th>
              <th className="py-3 px-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-surface-muted/30 transition-colors">
                <td className="py-3 px-4 font-mono text-muted-foreground whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="py-3 px-4">
                  <div className="font-bold text-foreground">{log.actorName}</div>
                  <div className="text-[11px] text-muted-foreground">{log.actorEmail}</div>
                </td>
                <td className="py-3 px-4 font-mono">
                  <Badge variant="primary">{log.action}</Badge>
                </td>
                <td className="py-3 px-4 font-semibold text-foreground">
                  {log.entity} {log.entityId ? `#${log.entityId}` : ''}
                </td>
                <td className="py-3 px-4 font-mono text-muted-foreground">
                  {log.ipAddress || 'Internal'}
                </td>
                <td className="py-3 px-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onInspect(log)}
                    icon={<Eye className="h-3.5 w-3.5" />}
                  >
                    Inspect
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
