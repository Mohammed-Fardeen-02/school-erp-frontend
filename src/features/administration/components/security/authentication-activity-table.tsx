import React from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  LogOut,
  KeyRound,
  Lock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Input } from '@/components/forms/input';
import { Button } from '@/components/ui/button';
import type { AuditLogRecord } from '../../types/admin.types';

export interface AuthenticationActivityTableProps {
  logs: AuditLogRecord[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  search: string;
  onSearchChange: (search: string) => void;
  actionFilter: string;
  onActionFilterChange: (action: string) => void;
  isLoading?: boolean;
}

export const AuthenticationActivityTable: React.FC<AuthenticationActivityTableProps> = ({
  logs,
  total,
  page,
  limit,
  onPageChange,
  search,
  onSearchChange,
  actionFilter,
  onActionFilterChange,
  isLoading,
}) => {
  const totalPages = Math.ceil(total / limit) || 1;

  const renderActionBadge = (action: string) => {
    switch (action) {
      case 'LOGIN_SUCCESS':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
            <CheckCircle2 className="h-3.5 w-3.5" /> Sign In Success
          </span>
        );
      case 'LOGIN_FAILED':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-danger/10 px-2 py-0.5 text-xs font-semibold text-danger">
            <XCircle className="h-3.5 w-3.5" /> Failed Login
          </span>
        );
      case 'LOGOUT':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-surface-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
            <LogOut className="h-3.5 w-3.5" /> Signed Out
          </span>
        );
      case 'PASSWORD_CHANGED':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
            <KeyRound className="h-3.5 w-3.5" /> Password Changed
          </span>
        );
      case 'PASSWORD_RESET_REQUESTED':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-warning/10 px-2 py-0.5 text-xs font-semibold text-warning">
            <Lock className="h-3.5 w-3.5" /> Reset Requested
          </span>
        );
      case 'PASSWORD_RESET_COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-info/10 px-2 py-0.5 text-xs font-semibold text-info">
            <CheckCircle2 className="h-3.5 w-3.5" /> Reset Completed
          </span>
        );
      case 'ADMIN_REVOKED_SESSION':
      case 'ADMIN_REVOKED_ALL_USER_SESSIONS':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-danger/10 px-2 py-0.5 text-xs font-semibold text-danger">
            <ShieldAlert className="h-3.5 w-3.5" /> Admin Revoked
          </span>
        );
      case 'SECURITY_POLICIES_UPDATED':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <ShieldAlert className="h-3.5 w-3.5" /> Policies Updated
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-surface-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
            {action}
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h2 className="text-base font-bold text-foreground">Authentication & Security Forensics</h2>
          <p className="text-xs text-muted-foreground">
            Immutable audit record of institutional sign-ins, credential changes, lockouts, and session terminations.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Input
            placeholder="Search by member name, email, IP, or event..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 text-xs"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={actionFilter}
            onChange={(e) => onActionFilterChange(e.target.value)}
            aria-label="Filter by Event Action"
            className="rounded-xl border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL">All Security Events</option>
            <option value="LOGIN_SUCCESS">Successful Sign-Ins</option>
            <option value="LOGIN_FAILED">Failed Login Attempts</option>
            <option value="LOGOUT">Sign-Outs</option>
            <option value="PASSWORD_CHANGED">Password Changes</option>
            <option value="PASSWORD_RESET_COMPLETED">Password Resets</option>
            <option value="ADMIN_REVOKED_SESSION">Admin Session Revocations</option>
            <option value="SECURITY_POLICIES_UPDATED">Policy Updates</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-surface-muted/40 font-semibold text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Actor / Member</th>
              <th className="px-4 py-3">Event Action</th>
              <th className="px-4 py-3">Network & Client</th>
              <th className="px-4 py-3">Event Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  {isLoading ? 'Loading authentication events...' : 'No authentication activity records found matching your filters.'}
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const date = new Date(log.createdAt);
                return (
                  <tr key={log.id} className="hover:bg-surface-muted/20 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium text-foreground">{date.toLocaleDateString()}</div>
                      <div className="text-[11px] text-muted-foreground">{date.toLocaleTimeString()}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-foreground">{log.actorName}</div>
                      <div className="text-[11px] text-muted-foreground">{log.actorEmail}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {renderActionBadge(log.action)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-mono text-foreground text-[11px]">{log.ipAddress || '—'}</div>
                      <div className="text-[10px] text-muted-foreground line-clamp-1 max-w-xs" title={log.userAgent || ''}>
                        {log.userAgent || '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {log.newState ? (
                        <div className="text-[11px] text-muted-foreground max-w-xs truncate font-mono">
                          {JSON.stringify(log.newState)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
        <div>
          Showing {logs.length > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, total)} of {total} records
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || isLoading}
            className="h-8 px-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-2 font-medium text-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || isLoading}
            className="h-8 px-2"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
