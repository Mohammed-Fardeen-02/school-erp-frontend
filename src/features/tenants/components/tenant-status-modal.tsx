import * as React from 'react';
import { useState, useEffect } from 'react';
import { X, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextArea } from '@/components/forms/textarea';
import type { TenantDto, TenantStatus } from '../types/tenants.types';

export interface TenantStatusModalProps {
  isOpen: boolean;
  tenant: TenantDto | null;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (status: TenantStatus, reason?: string) => void;
}

export const TenantStatusModal: React.FC<TenantStatusModalProps> = ({
  isOpen,
  tenant,
  loading = false,
  error = null,
  onClose,
  onSubmit,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<TenantStatus>('ACTIVE');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (tenant) {
      setSelectedStatus(tenant.status);
      setReason('');
    }
  }, [tenant]);

  if (!isOpen || !tenant) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedStatus, reason.trim() || undefined);
  };

  const isDestructive = selectedStatus === 'SUSPENDED' || selectedStatus === 'ARCHIVED';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tenant-status-modal-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                isDestructive ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'
              }`}
            >
              {isDestructive ? <AlertTriangle className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
            </div>
            <div>
              <h2 id="tenant-status-modal-title" className="text-base font-bold text-foreground">
                Update Institution Status
              </h2>
              <p className="text-xs text-muted-foreground">{tenant.displayName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-1 text-muted-foreground hover:bg-surface-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="rounded-lg border border-danger/20 bg-danger/5 p-3 text-xs text-danger">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Lifecycle Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as TenantStatus)}
              disabled={loading}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <option value="ACTIVE">ACTIVE — Normal Operations</option>
              <option value="TRIAL">TRIAL — Evaluation Period</option>
              <option value="SUSPENDED">SUSPENDED — Access Locked</option>
              <option value="ARCHIVED">ARCHIVED — Read-Only Preserved</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Audit Justification / Reason (Optional)
            </label>
            <TextArea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide a mandatory reason when suspending or archiving this tenant..."
              rows={3}
              disabled={loading}
            />
          </div>

          {selectedStatus === 'SUSPENDED' && (
            <div className="rounded-xl border border-danger/20 bg-danger/5 p-3 text-xs text-danger space-y-1">
              <strong>Warning:</strong> Suspending this institution will immediately prevent all faculty,
              staff, and students from accessing their school portal.
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant={isDestructive ? 'danger' : 'primary'}
              size="sm"
              loading={loading}
            >
              Confirm Status Change
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

