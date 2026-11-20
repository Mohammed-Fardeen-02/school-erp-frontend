import React, { useState } from 'react';
import {
  Clock,
  User,
  Globe,
  Building2,
  MapPin,
  Copy,
  Check,
  Code2,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  LogOut,
  KeyRound,
  Lock,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import { AdminDrawer } from '../common/admin-drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/data-display/badge';
import { useAuditLogDetail } from '../../hooks/use-admin';
import type { AuditLogRecord } from '../../types/admin.types';

export interface AuditDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  record: AuditLogRecord | null;
}

export const AuditDetailDrawer: React.FC<AuditDetailDrawerProps> = ({
  isOpen,
  onClose,
  record: initialRecord,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Fetch full detail if id is present
  const recordId = initialRecord?.id ?? null;
  const { data: fetchedRecord, isLoading } = useAuditLogDetail(recordId);

  const activeRecord = fetchedRecord || initialRecord;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!isOpen || !activeRecord) return null;

  const renderActionBadge = (action: string) => {
    switch (action) {
      case 'LOGIN_SUCCESS':
        return (
          <Badge variant="success" className="inline-flex items-center gap-1 font-mono text-xs">
            <CheckCircle2 className="h-3 w-3" /> {action}
          </Badge>
        );
      case 'LOGIN_FAILED':
        return (
          <Badge variant="danger" className="inline-flex items-center gap-1 font-mono text-xs">
            <XCircle className="h-3 w-3" /> {action}
          </Badge>
        );
      case 'LOGOUT':
        return (
          <Badge variant="secondary" className="inline-flex items-center gap-1 font-mono text-xs">
            <LogOut className="h-3 w-3" /> {action}
          </Badge>
        );
      case 'PASSWORD_CHANGED':
      case 'PASSWORD_RESET_COMPLETED':
        return (
          <Badge variant="primary" className="inline-flex items-center gap-1 font-mono text-xs">
            <KeyRound className="h-3 w-3" /> {action}
          </Badge>
        );
      case 'PASSWORD_RESET_REQUESTED':
        return (
          <Badge variant="warning" className="inline-flex items-center gap-1 font-mono text-xs">
            <Lock className="h-3 w-3" /> {action}
          </Badge>
        );
      case 'ADMIN_REVOKED_SESSION':
      case 'ADMIN_REVOKED_ALL_USER_SESSIONS':
        return (
          <Badge variant="danger" className="inline-flex items-center gap-1 font-mono text-xs">
            <ShieldAlert className="h-3 w-3" /> {action}
          </Badge>
        );
      default:
        return (
          <Badge variant="primary" className="inline-flex items-center gap-1 font-mono text-xs">
            <ShieldCheck className="h-3 w-3" /> {action}
          </Badge>
        );
    }
  };

  const hasPrevious = Boolean(
    activeRecord.previousState && Object.keys(activeRecord.previousState).length > 0
  );
  const hasNew = Boolean(
    activeRecord.newState && Object.keys(activeRecord.newState).length > 0
  );

  return (
    <AdminDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Audit Trail Forensics"
      subtitle={`Event ID: ${activeRecord.id}`}
      width="max-w-2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleCopy(
                JSON.stringify(activeRecord, null, 2),
                'full-payload'
              )
            }
            icon={
              copiedKey === 'full-payload' ? (
                <Check className="h-4 w-4 text-success" />
              ) : (
                <Copy className="h-4 w-4" />
              )
            }
          >
            {copiedKey === 'full-payload' ? 'Copied Full Event' : 'Copy JSON'}
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-6 text-sm">
        {/* Loading Indicator when refreshing record */}
        {isLoading && !fetchedRecord && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-primary/5 p-2 rounded-lg border border-primary/20">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            <span>Fetching real-time event telemetry...</span>
          </div>
        )}

        {/* Section A: Event Information */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Event Information
            </h4>
            {renderActionBadge(activeRecord.action)}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-border p-3.5 bg-surface">
            <div>
              <span className="text-[11px] text-muted-foreground">Timestamp</span>
              <p className="font-semibold text-foreground text-xs mt-0.5">
                {new Date(activeRecord.createdAt).toLocaleString(undefined, {
                  dateStyle: 'medium',
                  timeStyle: 'medium',
                })}
              </p>
              <p className="text-[10px] font-mono text-muted-foreground">
                {activeRecord.createdAt}
              </p>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground">Target Entity</span>
              <p className="font-semibold text-foreground text-xs mt-0.5">
                {activeRecord.entity}
              </p>
              <p className="text-[11px] font-mono text-muted-foreground truncate" title={activeRecord.entityId || 'N/A'}>
                ID: {activeRecord.entityId || 'None'}
              </p>
            </div>

            <div className="col-span-1 sm:col-span-2 pt-2 border-t border-border/50">
              <span className="text-[11px] text-muted-foreground">Origin Network & Client</span>
              <div className="mt-1 flex items-center justify-between text-xs font-mono bg-surface-muted/50 px-2.5 py-1.5 rounded-lg border border-border">
                <span className="text-foreground flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                  {activeRecord.ipAddress || 'Internal / Network Host'}
                </span>
                {activeRecord.ipAddress && (
                  <button
                    type="button"
                    onClick={() => handleCopy(activeRecord.ipAddress!, 'ip')}
                    className="text-muted-foreground hover:text-foreground text-[11px] transition-colors"
                    title="Copy IP"
                  >
                    {copiedKey === 'ip' ? (
                      <Check className="h-3.5 w-3.5 text-success" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                )}
              </div>
              {activeRecord.userAgent && (
                <p className="mt-1 text-[11px] font-mono text-muted-foreground break-all bg-surface-muted/30 p-2 rounded-lg border border-border/50">
                  {activeRecord.userAgent}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section B: Actor Information */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" /> Actor / Operator
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-border p-3.5 bg-surface">
            <div>
              <span className="text-[11px] text-muted-foreground">Name</span>
              <p className="font-semibold text-foreground text-xs mt-0.5">
                {activeRecord.actorName || 'System Automation'}
              </p>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground">Email</span>
              <p className="font-semibold text-foreground text-xs mt-0.5">
                {activeRecord.actorEmail || 'system@internal.erp'}
              </p>
            </div>
            <div className="col-span-1 sm:col-span-2 pt-1 border-t border-border/50">
              <span className="text-[11px] text-muted-foreground">User ID</span>
              <p className="text-[11px] font-mono text-muted-foreground">
                {activeRecord.userId || 'N/A (Automated Task or Anonymous Gateway)'}
              </p>
            </div>
          </div>
        </div>

        {/* Section C: Institutional Scope */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5" /> Institutional Scope & Tenancy
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-border p-3.5 bg-surface">
            <div>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Campus / Location
              </span>
              <p className="font-semibold text-foreground text-xs mt-0.5">
                {activeRecord.campusName || (activeRecord.locationId ? `Campus (${activeRecord.locationId})` : 'Institution-wide / Universal')}
              </p>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Building2 className="h-3 w-3" /> Organization ID
              </span>
              <p className="text-[11px] font-mono text-muted-foreground mt-0.5 truncate" title={activeRecord.organizationId || 'N/A'}>
                {activeRecord.organizationId || 'Platform-wide'}
              </p>
            </div>
          </div>
        </div>

        {/* Section D: Change Details (Diff & State Inspector) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Code2 className="h-3.5 w-3.5" /> State Mutation Telemetry
            </h4>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
              <ShieldCheck className="h-3 w-3 text-success" />
              <span>Sanitized (Passwords & Secrets Redacted)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Previous State */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-danger uppercase tracking-wider flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-danger inline-block" />
                  Previous State
                </span>
                {hasPrevious && (
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        JSON.stringify(activeRecord.previousState, null, 2),
                        'previous'
                      )
                    }
                    className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    {copiedKey === 'previous' ? (
                      <Check className="h-3 w-3 text-success" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    Copy
                  </button>
                )}
              </div>
              <pre className="rounded-xl border border-danger/30 bg-danger/5 p-3 text-[11px] font-mono text-foreground overflow-auto max-h-64 whitespace-pre-wrap leading-relaxed">
                {hasPrevious
                  ? JSON.stringify(activeRecord.previousState, null, 2)
                  : '// No previous record state (Create/Initiate event)'}
              </pre>
            </div>

            {/* New State */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-success uppercase tracking-wider flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-success inline-block" />
                  New State
                </span>
                {hasNew && (
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        JSON.stringify(activeRecord.newState, null, 2),
                        'new'
                      )
                    }
                    className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    {copiedKey === 'new' ? (
                      <Check className="h-3 w-3 text-success" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    Copy
                  </button>
                )}
              </div>
              <pre className="rounded-xl border border-success/30 bg-success/5 p-3 text-[11px] font-mono text-foreground overflow-auto max-h-64 whitespace-pre-wrap leading-relaxed">
                {hasNew
                  ? JSON.stringify(activeRecord.newState, null, 2)
                  : '// No subsequent state recorded (Delete event)'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </AdminDrawer>
  );
};

