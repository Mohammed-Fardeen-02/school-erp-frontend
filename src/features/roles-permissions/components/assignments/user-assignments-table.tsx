import * as React from 'react';
import { useState, useMemo } from 'react';
import {
  Shield,
  Building2,
  Globe,
  Clock,
  UserX,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';
import { usePermission } from '../../hooks/use-permission';
import type { AssignmentRecord } from '../../types/assignments.types';

export interface UserAssignmentsTableProps {
  assignments: AssignmentRecord[];
  loading?: boolean;
  onRevokeAssignment?: (assignment: AssignmentRecord) => void;
  className?: string;
}

export type AssignmentStatusFilter = 'ALL' | 'ACTIVE' | 'REVOKED';

export const UserAssignmentsTable: React.FC<UserAssignmentsTableProps> = ({
  assignments,
  loading = false,
  onRevokeAssignment,
  className,
}) => {
  const currentUser = useAuthStore((state) => state.user);

  // Authorization check
  const { hasPermission: canRevoke } = usePermission(
    'settings.user_assignments.allocations.revoke'
  );

  const [statusFilter, setStatusFilter] = useState<AssignmentStatusFilter>('ACTIVE');
  const [campusFilter, setCampusFilter] = useState<string>('ALL');

  // Discover distinct campuses present in the assignment records
  const availableCampuses = useMemo(() => {
    const map = new Map<string, string>();
    for (const a of assignments) {
      if (a.location) {
        map.set(a.location.id, `${a.location.name} (${a.location.code})`);
      }
    }
    return Array.from(map.entries()).map(([id, label]) => ({ id, label }));
  }, [assignments]);

  // Filtered assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      // Status filter
      if (statusFilter === 'ACTIVE' && !a.isActive) return false;
      if (statusFilter === 'REVOKED' && a.isActive) return false;

      // Campus filter
      if (campusFilter === 'ORG_WIDE' && a.locationId !== null) return false;
      if (campusFilter !== 'ALL' && campusFilter !== 'ORG_WIDE' && a.locationId !== campusFilter) {
        return false;
      }

      return true;
    });
  }, [assignments, statusFilter, campusFilter]);

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return '—';
    try {
      return new Date(isoString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div
      data-testid="user-assignments-table-container"
      className={cn('w-full space-y-3.5', className)}
    >
      {/* Table Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-surface-muted/60 p-1 rounded-xl border border-border/60">
          <button
            type="button"
            data-testid="filter-status-active"
            onClick={() => setStatusFilter('ACTIVE')}
            className={cn(
              'px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer',
              statusFilter === 'ACTIVE'
                ? 'bg-surface text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Active ({assignments.filter((a) => a.isActive).length})
          </button>
          <button
            type="button"
            data-testid="filter-status-revoked"
            onClick={() => setStatusFilter('REVOKED')}
            className={cn(
              'px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer',
              statusFilter === 'REVOKED'
                ? 'bg-surface text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Revoked ({assignments.filter((a) => !a.isActive).length})
          </button>
          <button
            type="button"
            data-testid="filter-status-all"
            onClick={() => setStatusFilter('ALL')}
            className={cn(
              'px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer',
              statusFilter === 'ALL'
                ? 'bg-surface text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            All History ({assignments.length})
          </button>
        </div>

        {/* Campus Scope Filter Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="campus-filter-select" className="text-xs text-muted-foreground font-medium">
            Scope:
          </label>
          <select
            id="campus-filter-select"
            data-testid="campus-filter-select"
            value={campusFilter}
            onChange={(e) => setCampusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-border bg-surface text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Scopes</option>
            <option value="ORG_WIDE">Organization-Wide Only</option>
            {availableCampuses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Canvas */}
      {loading ? (
        <div className="flex items-center justify-center p-8 gap-2 text-xs text-muted-foreground">
          <Clock className="w-4 h-4 animate-spin text-primary" />
          <span>Loading user role assignments...</span>
        </div>
      ) : filteredAssignments.length === 0 ? (
        <div
          data-testid="empty-assignments-state"
          className="p-8 text-center rounded-xl border border-dashed border-border bg-surface-muted/20"
        >
          <Shield className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm font-semibold text-foreground">No role assignments found</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {statusFilter === 'ACTIVE'
              ? 'This member does not have any active roles at this scope.'
              : 'No historical or matching records match the selected filters.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-xs">
          <table className="w-full text-left text-xs divide-y divide-border">
            <thead className="bg-surface-muted/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Role Profile</th>
                <th className="py-3 px-4">Scope</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned</th>
                <th className="py-3 px-4">Revocation Details</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredAssignments.map((assignment) => {
                const isSelf = currentUser?.id === assignment.userId;
                const isTemplate = assignment.role?.roleType === 'SYSTEM_TEMPLATE';

                return (
                  <tr
                    key={assignment.id}
                    data-testid={`assignment-row-${assignment.id}`}
                    className="hover:bg-surface-muted/30 transition-colors"
                  >
                    {/* Role Info */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-foreground text-xs">
                            {assignment.role?.roleName || 'Assigned Role'}
                          </span>
                          {isTemplate ? (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200">
                              <Sparkles className="w-2.5 h-2.5 text-blue-600" />
                              Template
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200">
                              Custom
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[10px] text-muted-foreground/80">
                          {assignment.role?.roleCode}
                        </span>
                      </div>
                    </td>

                    {/* Scope Info */}
                    <td className="py-3 px-4">
                      {assignment.location ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200">
                          <Building2 className="w-3 h-3 text-amber-600" />
                          {assignment.location.name}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary border border-primary/20">
                          <Globe className="w-3 h-3" />
                          Organization-Wide
                        </span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      {assignment.isActive ? (
                        <span
                          data-testid="badge-assignment-active"
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300"
                        >
                          Active
                        </span>
                      ) : (
                        <span
                          data-testid="badge-assignment-revoked"
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-surface-muted text-muted-foreground border border-border"
                        >
                          Revoked
                        </span>
                      )}
                    </td>

                    {/* Assigned Date */}
                    <td className="py-3 px-4 text-muted-foreground">
                      <span className="font-mono">{formatDate(assignment.assignedAt)}</span>
                    </td>

                    {/* Revocation Details */}
                    <td className="py-3 px-4">
                      {!assignment.isActive && assignment.revokedAt ? (
                        <div className="flex flex-col text-[11px] max-w-xs">
                          <span className="text-muted-foreground font-mono">
                            {formatDate(assignment.revokedAt)}
                          </span>
                          {assignment.revocationReason && (
                            <span
                              className="text-foreground/80 italic truncate"
                              title={assignment.revocationReason}
                            >
                              "{assignment.revocationReason}"
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      {assignment.isActive && onRevokeAssignment && (
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          data-testid={`revoke-btn-${assignment.id}`}
                          disabled={isSelf || !canRevoke}
                          title={
                            isSelf
                              ? 'You cannot revoke your own role assignment'
                              : !canRevoke
                              ? 'Missing revocation authority'
                              : 'Revoke this role assignment'
                          }
                          onClick={() => onRevokeAssignment(assignment)}
                          icon={<UserX className="w-3.5 h-3.5" />}
                        >
                          Revoke
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

