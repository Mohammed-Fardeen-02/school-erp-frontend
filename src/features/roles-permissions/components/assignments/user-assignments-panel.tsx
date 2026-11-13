import * as React from 'react';
import { useState } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Phone,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/feedback/alert';
import { MemberSearchSelector } from './member-search-selector';
import { UserAssignmentsTable } from './user-assignments-table';
import { AssignRoleModal } from './assign-role-modal';
import { RevokeAssignmentModal } from './revoke-assignment-modal';
import { useUserAssignments } from '../../hooks/use-assignments';
import { PermissionGate } from '../guards/permission-gate';
import type {
  WorkspaceMemberSummary,
  AssignmentRecord,
} from '../../types/assignments.types';

export interface UserAssignmentsPanelProps {
  className?: string;
}

export const UserAssignmentsPanel: React.FC<UserAssignmentsPanelProps> = ({
  className,
}) => {
  const [selectedMember, setSelectedMember] = useState<WorkspaceMemberSummary | null>(null);

  // Modals state
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<AssignmentRecord | null>(null);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Load assignments for selected member
  const {
    data: assignments = [],
    isLoading: loadingAssignments,
    error: assignmentsError,
  } = useUserAssignments(selectedMember?.id, {}, { enabled: Boolean(selectedMember) });

  const activeCount = assignments.filter((a) => a.isActive).length;

  const handleAssignSuccess = (assignment: AssignmentRecord) => {
    setIsAssignOpen(false);
    setFeedback({
      type: 'success',
      text: `Role "${assignment.role?.roleName || 'Role'}" successfully assigned to ${selectedMember?.firstName} ${selectedMember?.lastName}.`,
    });
  };

  const handleRevokeSuccess = (revoked: AssignmentRecord) => {
    setRevokeTarget(null);
    setFeedback({
      type: 'success',
      text: `Role "${revoked.role?.roleName || 'Role'}" revoked successfully.`,
    });
  };

  return (
    <div
      data-testid="user-assignments-panel"
      className={className ? className : 'space-y-6'}
    >
      {/* Feedback Banner */}
      {feedback && (
        <Alert
          variant={feedback.type === 'success' ? 'success' : 'error'}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2 text-xs">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-danger" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs font-semibold underline hover:opacity-80 ml-4 cursor-pointer"
          >
            Dismiss
          </button>
        </Alert>
      )}

      {/* Header & Member Lookup Section */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                Institutional Member Role Allocations
              </h2>
              <p className="text-xs text-muted-foreground">
                Select an active member to audit, allocate, or revoke operational roles
              </p>
            </div>
          </div>

          <PermissionGate permission="settings.user_assignments.allocations.assign">
            <Button
              variant="primary"
              size="sm"
              data-testid="panel-assign-role-btn"
              onClick={() => setIsAssignOpen(true)}
              icon={<UserPlus className="w-4 h-4" />}
            >
              Assign Role
            </Button>
          </PermissionGate>
        </div>

        {/* Member Search Bar */}
        <div className="max-w-xl">
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Select Member to Manage:
          </label>
          <MemberSearchSelector
            selectedMember={selectedMember}
            onSelectMember={(member) => {
              setSelectedMember(member);
              setFeedback(null);
            }}
          />
        </div>
      </div>

      {/* Selected Member Profile Card & Assignments Table */}
      {selectedMember ? (
        <div
          data-testid="member-assignments-view"
          className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-5"
        >
          {/* Member Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-surface-muted/30">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                {selectedMember.firstName?.[0]?.toUpperCase() || ''}
                {selectedMember.lastName?.[0]?.toUpperCase() || ''}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-foreground">
                    {selectedMember.firstName} {selectedMember.lastName}
                  </h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    Active Member
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {selectedMember.email}
                  </span>
                  {selectedMember.phone && (
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3" />
                      {selectedMember.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[11px] text-muted-foreground block">Active Roles</span>
                <span className="font-bold text-base text-foreground">{activeCount}</span>
              </div>
              <PermissionGate permission="settings.user_assignments.allocations.assign">
                <Button
                  variant="outline"
                  size="sm"
                  data-testid="add-role-to-member-btn"
                  onClick={() => setIsAssignOpen(true)}
                  icon={<ShieldCheck className="w-4 h-4 text-primary" />}
                >
                  Allocate Another Role
                </Button>
              </PermissionGate>
            </div>
          </div>

          {/* Assignments Table Error */}
          {assignmentsError && (
            <Alert variant="error" className="flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Failed to load member assignments: {assignmentsError.message}</span>
            </Alert>
          )}

          {/* User Assignments Table */}
          <UserAssignmentsTable
            assignments={assignments}
            loading={loadingAssignments}
            onRevokeAssignment={(assignment) => setRevokeTarget(assignment)}
          />
        </div>
      ) : (
        <div
          data-testid="no-member-selected-banner"
          className="p-12 text-center rounded-2xl border border-dashed border-border bg-surface text-muted-foreground"
        >
          <Users className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2.5" />
          <h3 className="font-semibold text-sm text-foreground">No Member Selected</h3>
          <p className="text-xs max-w-sm mx-auto mt-1 text-muted-foreground">
            Search and select an active institutional member above to inspect their assigned roles,
            grant new capabilities, or revoke permissions.
          </p>
        </div>
      )}

      {/* Modals */}
      <AssignRoleModal
        isOpen={isAssignOpen}
        initialMember={selectedMember}
        onClose={() => setIsAssignOpen(false)}
        onSuccess={handleAssignSuccess}
      />

      <RevokeAssignmentModal
        isOpen={Boolean(revokeTarget)}
        assignment={revokeTarget}
        onClose={() => setRevokeTarget(null)}
        onSuccess={handleRevokeSuccess}
      />
    </div>
  );
};

