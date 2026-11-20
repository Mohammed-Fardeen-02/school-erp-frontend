import React from 'react';
import {
  Eye,
  CheckCircle2,
  XCircle,
  LogOut,
  KeyRound,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Building2,
  Globe,
} from 'lucide-react';
import { Badge } from '@/components/data-display/badge';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/navigation/pagination';
import type { AuditLogRecord } from '../../types/admin.types';

export interface AuditLogsTableProps {
  logs: AuditLogRecord[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange?: (newLimit: number) => void;
  onInspect: (record: AuditLogRecord) => void;
  isLoading?: boolean;
}

export const AuditLogsTable: React.FC<AuditLogsTableProps> = ({
  logs,
  total,
  page,
  limit,
  onPageChange,
  onPageSizeChange,
  onInspect,
  isLoading,
}) => {
  const totalPages = Math.ceil(total / limit) || 1;

  const renderActionBadge = (action: string) => {
    switch (action) {
      case 'LOGIN_SUCCESS':
        return (
          <Badge variant="success" className="inline-flex items-center gap-1 font-mono text-[11px]">
            <CheckCircle2 className="h-3 w-3" /> Sign In
          </Badge>
        );
      case 'LOGIN_FAILED':
        return (
          <Badge variant="danger" className="inline-flex items-center gap-1 font-mono text-[11px]">
            <XCircle className="h-3 w-3" /> Failed Login
          </Badge>
        );
      case 'LOGOUT':
        return (
          <Badge variant="secondary" className="inline-flex items-center gap-1 font-mono text-[11px]">
            <LogOut className="h-3 w-3" /> Signed Out
          </Badge>
        );
      case 'PASSWORD_CHANGED':
      case 'PASSWORD_RESET_COMPLETED':
        return (
          <Badge variant="primary" className="inline-flex items-center gap-1 font-mono text-[11px]">
            <KeyRound className="h-3 w-3" /> Password Updated
          </Badge>
        );
      case 'PASSWORD_RESET_REQUESTED':
        return (
          <Badge variant="warning" className="inline-flex items-center gap-1 font-mono text-[11px]">
            <Lock className="h-3 w-3" /> Reset Requested
          </Badge>
        );
      case 'ADMIN_REVOKED_SESSION':
      case 'ADMIN_REVOKED_ALL_USER_SESSIONS':
        return (
          <Badge variant="danger" className="inline-flex items-center gap-1 font-mono text-[11px]">
            <ShieldAlert className="h-3 w-3" /> Session Terminated
          </Badge>
        );
      default:
        return (
          <Badge variant="primary" className="inline-flex items-center gap-1 font-mono text-[11px]">
            <ShieldCheck className="h-3 w-3" /> {action}
          </Badge>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface shadow-xs overflow-hidden">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-surface-muted/50 font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-4 py-3.5">Timestamp</th>
              <th className="px-4 py-3.5">Actor / Member</th>
              <th className="px-4 py-3.5 text-center">Event Action</th>
              <th className="px-4 py-3.5">Target Entity</th>
              <th className="px-4 py-3.5">Campus Scope</th>
              <th className="px-4 py-3.5">Client & IP</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && logs.length === 0 ? (
              // Loading Skeleton Rows
              Array.from({ length: Math.min(limit, 5) }).map((_, idx) => (
                <tr key={`skeleton-${idx}`} className="animate-pulse">
                  <td className="px-4 py-3.5">
                    <div className="h-4 w-28 bg-surface-muted rounded" />
                    <div className="h-3 w-16 bg-surface-muted rounded mt-1.5" />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="h-4 w-32 bg-surface-muted rounded" />
                    <div className="h-3 w-40 bg-surface-muted rounded mt-1.5" />
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <div className="h-5 w-24 bg-surface-muted rounded mx-auto" />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="h-4 w-24 bg-surface-muted rounded" />
                    <div className="h-3 w-20 bg-surface-muted rounded mt-1.5" />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="h-4 w-24 bg-surface-muted rounded" />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="h-4 w-20 bg-surface-muted rounded" />
                    <div className="h-3 w-32 bg-surface-muted rounded mt-1.5" />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="h-7 w-20 bg-surface-muted rounded ml-auto" />
                  </td>
                </tr>
              ))
            ) : logs.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                  <ShieldCheck className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
                  <p className="font-medium text-foreground text-sm">No audit records found</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    No log events match your current filter criteria or time range.
                  </p>
                </td>
              </tr>
            ) : (
              // Real Data Rows
              logs.map((log) => {
                const date = new Date(log.createdAt);
                return (
                  <tr
                    key={log.id}
                    className="hover:bg-surface-muted/20 transition-colors group cursor-pointer"
                    onClick={() => onInspect(log)}
                  >
                    {/* Timestamp */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-medium text-foreground text-xs">
                        {date.toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="text-[11px] font-mono text-muted-foreground">
                        {date.toLocaleTimeString()}
                      </div>
                    </td>

                    {/* Actor */}
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-foreground text-xs">
                        {log.actorName || 'System'}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        {log.actorEmail || 'system@internal'}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      {renderActionBadge(log.action)}
                    </td>

                    {/* Target Entity */}
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-foreground text-xs">
                        {log.entity}
                      </div>
                      {log.entityId && (
                        <div className="text-[10px] font-mono text-muted-foreground truncate max-w-[140px]" title={log.entityId}>
                          #{log.entityId}
                        </div>
                      )}
                    </td>

                    {/* Campus Scope */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {log.campusName ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-foreground border border-border">
                          <Building2 className="h-3 w-3 text-muted-foreground" />
                          {log.campusName}
                        </span>
                      ) : log.locationId ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-surface-muted px-2 py-0.5 text-[11px] font-mono text-muted-foreground border border-border">
                          Campus #{log.locationId.substring(0, 8)}
                        </span>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">
                          Universal / Org
                        </span>
                      )}
                    </td>

                    {/* Network & Client */}
                    <td className="px-4 py-3.5">
                      <div className="font-mono text-foreground text-[11px] flex items-center gap-1">
                        <Globe className="h-3 w-3 text-muted-foreground" />
                        {log.ipAddress || 'Internal'}
                      </div>
                      {log.userAgent && (
                        <div
                          className="text-[10px] text-muted-foreground truncate max-w-[160px]"
                          title={log.userAgent}
                        >
                          {log.userAgent}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onInspect(log)}
                        className="h-7 px-2.5 text-xs text-primary hover:text-primary hover:bg-primary/10"
                        icon={<Eye className="h-3.5 w-3.5" />}
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Server-Side Pagination Bar */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        pageSize={limit}
        totalItems={total}
        onPageSizeChange={onPageSizeChange}
        pageSizeOptions={[10, 25, 50, 100]}
        resultLabel="audit logs"
      />
    </div>
  );
};
