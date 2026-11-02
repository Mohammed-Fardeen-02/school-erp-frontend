import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  X,
  ShieldAlert,
  Loader2,
  AlertCircle,
  Building2,
  Globe,
  UserX,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/feedback/alert';
import { TextArea } from '@/components/forms/textarea';
import { useAuthStore } from '@/stores/auth-store';
import { useRevokeRole } from '../../hooks/use-assignments';
import { usePermission } from '../../hooks/use-permission';
import type { AssignmentRecord } from '../../types/assignments.types';

export interface RevokeAssignmentModalProps {
  isOpen: boolean;
  assignment: AssignmentRecord | null;
  onClose: () => void;
  onSuccess?: (revokedAssignment: AssignmentRecord) => void;
}

export const RevokeAssignmentModal: React.FC<RevokeAssignmentModalProps> = ({
  isOpen,
  assignment,
  onClose,
  onSuccess,
}) => {
  const currentUser = useAuthStore((state) => state.user);

  // Authorization check for revocation
  const { hasPermission: canRevoke, isLoading: checkingPermission } = usePermission(
    'settings.user_assignments.allocations.revoke'
  );

  const [reason, setReason] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const revokeMutation = useRevokeRole();

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setReason('');
      setValidationError(null);
      setSubmitError(null);
    }
  }, [isOpen]);

  if (!isOpen || !assignment) return null;

  // Anti-self-revocation protection
  const isSelfRevocation = currentUser?.id === assignment.userId;

  const validate = (): boolean => {
    const trimmed = reason.trim();
    if (!trimmed || trimmed.length < 5) {
      setValidationError('Revocation reason must be at least 5 characters');
      return false;
    }
    if (trimmed.length > 255) {
      setValidationError('Revocation reason cannot exceed 255 characters');
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleRevoke = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (isSelfRevocation) return;
    if (!validate()) return;

    try {
      const revoked = await revokeMutation.mutateAsync({
        assignmentId: assignment.id,
        payload: { reason: reason.trim() },
        userId: assignment.userId,
      });

      onSuccess?.(revoked);
      onClose();
    } catch (err: unknown) {
      let message = 'Failed to revoke role assignment. Please try again.';
      if (err instanceof Error) {
        message = err.message;
      }
      setSubmitError(message);
    }
  };

  return (
    <div
      data-testid="revoke-assignment-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-rose-50/40 dark:bg-rose-950/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/10 text-danger">
              <UserX className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Revoke Role Assignment</h3>
              <p className="text-xs text-muted-foreground">
                Revoke assigned permissions from the target member
              </p>
            </div>
          </div>
          <button
            type="button"
            data-testid="close-revoke-modal"
            disabled={revokeMutation.isPending}
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface-muted hover:text-foreground transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleRevoke} className="p-6 space-y-4">
          {/* Permission Warning */}
          {!checkingPermission && !canRevoke && (
            <Alert variant="error" className="flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                You do not possess permission (<code>settings.user_assignments.allocations.revoke</code>)
                to revoke role allocations.
              </span>
            </Alert>
          )}

          {/* Anti-Self-Revocation Warning Banner */}
          {isSelfRevocation && (
            <Alert
              variant="error"
              data-testid="self-revocation-warning"
              className="flex items-start gap-2.5 text-xs"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-danger" />
              <div>
                <span className="font-bold block text-danger">Self-Revocation Prohibited</span>
                <span>
                  You cannot revoke your own role assignment. Self-revocation is restricted to
                  prevent accidental institutional lockout.
                </span>
              </div>
            </Alert>
          )}

          {/* Submission Error Banner */}
          {(submitError || revokeMutation.error?.message) && (
            <Alert
              variant="error"
              data-testid="revoke-error-banner"
              className="flex items-start justify-between gap-2 text-xs"
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Revocation Failed</span>
                  <span>{submitError || revokeMutation.error?.message}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSubmitError(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </Alert>
          )}

          {/* Assignment Information Card */}
          <div
            data-testid="target-assignment-card"
            className="p-3.5 rounded-xl border border-border bg-surface-muted/40 text-xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Target Member:</span>
              <span className="font-semibold text-foreground">
                {assignment.user?.firstName} {assignment.user?.lastName} ({assignment.user?.email})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Assigned Role:</span>
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-primary" />
                {assignment.role?.roleName || 'Assigned Role'} ({assignment.role?.roleCode})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Scope:</span>
              {assignment.location ? (
                <span className="inline-flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-300">
                  <Building2 className="w-3.5 h-3.5" />
                  Campus: {assignment.location.name} ({assignment.location.code})
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-semibold text-primary">
                  <Globe className="w-3.5 h-3.5" />
                  Organization-Wide
                </span>
              )}
            </div>
          </div>

          {/* Mandatory Reason Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="revocation-reason"
                className="block text-xs font-semibold text-foreground"
              >
                Revocation Reason <span className="text-danger">*</span>
              </label>
              <span className="text-[11px] font-mono text-muted-foreground">
                {reason.length}/255
              </span>
            </div>

            <TextArea
              id="revocation-reason"
              data-testid="revocation-reason-input"
              value={reason}
              disabled={isSelfRevocation || revokeMutation.isPending || !canRevoke}
              onChange={(e) => {
                setReason(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="Provide a mandatory reason for revoking this role allocation (e.g. Role change, departure, transfer)..."
              rows={3}
              maxLength={255}
              className="text-xs"
            />

            {validationError && (
              <p
                data-testid="error-reason-required"
                className="text-xs text-danger font-medium flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                {validationError}
              </p>
            )}
          </div>
        </form>

        {/* Footer Controls */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-surface-muted/30">
          <Button
            type="button"
            variant="outline"
            data-testid="cancel-revoke-button"
            disabled={revokeMutation.isPending}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            data-testid="submit-revoke-button"
            disabled={
              isSelfRevocation ||
              revokeMutation.isPending ||
              (checkingPermission ? false : !canRevoke)
            }
            onClick={handleRevoke}
            className="min-w-36"
          >
            {revokeMutation.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Revoking...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <UserX className="w-4 h-4" />
                Confirm Revocation
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

