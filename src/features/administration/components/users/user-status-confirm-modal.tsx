import React, { useState } from 'react';
import { AlertTriangle, Power, CheckCircle, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/forms/input';
import type { AdminUserRecord } from '../../types/admin.types';

export interface UserStatusConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUserRecord | null;
  onConfirm: (userId: string, nextActive: boolean, reason?: string) => Promise<void>;
  isLoading?: boolean;
}

export const UserStatusConfirmModal: React.FC<UserStatusConfirmModalProps> = ({
  isOpen,
  onClose,
  user,
  onConfirm,
  isLoading = false,
}) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !user) return null;

  const isCurrentlyActive = user.status === 'ACTIVE';
  const nextActive = !isCurrentlyActive;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirm(user.id, nextActive, reason.trim() || undefined);
      setReason('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border px-6 py-4 bg-surface-muted/30">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              isCurrentlyActive
                ? 'bg-danger/10 text-danger'
                : 'bg-emerald-500/10 text-emerald-600'
            }`}
          >
            {isCurrentlyActive ? (
              <ShieldAlert className="h-5 w-5" />
            ) : (
              <CheckCircle className="h-5 w-5" />
            )}
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">
              {isCurrentlyActive ? 'Deactivate User Account' : 'Reactivate User Account'}
            </h2>
            <p className="text-xs text-muted-foreground">
              {user.firstName} {user.lastName} ({user.email})
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isCurrentlyActive ? (
            <div className="rounded-xl border border-danger/20 bg-danger/5 p-3.5 space-y-2">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 text-danger shrink-0 mt-0.5" />
                <div className="text-xs text-foreground space-y-1">
                  <p className="font-semibold text-danger">
                    Immediate Session Invalidation Warning
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Deactivating this account will <strong>instantly revoke all active sessions</strong> and
                    invalidate all active refresh tokens for this user. The user will be immediately logged out
                    of all web and mobile apps.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Reactivating this account will restore institutional access. The user will be able to log in with their existing credentials.
            </p>
          )}

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Reason for Status Change {isCurrentlyActive ? '(Recommended for Audit)' : '(Optional)'}
            </label>
            <Input
              placeholder={
                isCurrentlyActive
                  ? 'e.g., Extended leave of absence, contract termination'
                  : 'e.g., Return from sabbatical, reinstatement'
              }
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              This reason will be recorded immutably in the institutional compliance audit log.
            </p>
          </div>

          <div className="border-t border-border pt-4 flex justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={onClose} disabled={isSubmitting || isLoading}>
              Cancel
            </Button>
            <Button
              variant={isCurrentlyActive ? 'danger' : 'primary'}
              size="sm"
              type="submit"
              disabled={isSubmitting || isLoading}
              icon={<Power className="h-4 w-4" />}
            >
              {isCurrentlyActive ? 'Deactivate & Invalidate Sessions' : 'Confirm Reactivation'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

