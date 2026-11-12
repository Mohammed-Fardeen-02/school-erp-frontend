import React from 'react';
import { X, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AuditLogRecord } from '../../types/admin.types';

export interface AuditDiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: AuditLogRecord | null;
}

export const AuditDiffModal: React.FC<AuditDiffModalProps> = ({ isOpen, onClose, record }) => {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-surface-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Audit Record Inspection</h2>
              <p className="text-xs text-muted-foreground">
                Action: <span className="font-mono font-bold text-foreground">{record.action}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-surface-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Details & Diff Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Metadata bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-xl border border-border p-3 bg-surface-muted/30">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Actor</span>
              <p className="font-bold text-foreground mt-0.5">{record.actorName}</p>
              <p className="text-[11px] text-muted-foreground">{record.actorEmail}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Entity Target</span>
              <p className="font-bold text-foreground mt-0.5">
                {record.entity} {record.entityId ? `(#${record.entityId})` : ''}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Timestamp & IP</span>
              <p className="font-semibold text-foreground mt-0.5">
                {new Date(record.createdAt).toLocaleString()}
              </p>
              <p className="font-mono text-[11px] text-muted-foreground">{record.ipAddress || 'Internal'}</p>
            </div>
          </div>

          {/* State Diff */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-danger text-[11px] uppercase tracking-wider">
                  Previous State
                </span>
              </div>
              <pre className="rounded-xl border border-border bg-danger/5 p-3 text-[11px] font-mono text-foreground overflow-auto max-h-60 whitespace-pre-wrap">
                {record.previousState
                  ? JSON.stringify(record.previousState, null, 2)
                  : '// No previous record state'}
              </pre>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-success text-[11px] uppercase tracking-wider">
                  New State
                </span>
              </div>
              <pre className="rounded-xl border border-border bg-success/5 p-3 text-[11px] font-mono text-foreground overflow-auto max-h-60 whitespace-pre-wrap">
                {record.newState
                  ? JSON.stringify(record.newState, null, 2)
                  : '// No state mutation recorded'}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-3 bg-surface-muted/30 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
