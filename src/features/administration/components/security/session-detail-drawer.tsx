import React from 'react';
import { Laptop, Smartphone, Shield, LogOut, CheckCircle2, Clock, User, Terminal } from 'lucide-react';
import { AdminDrawer } from '../common/admin-drawer';
import { Button } from '@/components/ui/button';
import type { DeviceSession } from '../../types/admin.types';

export interface SessionDetailDrawerProps {
  session: DeviceSession | null;
  isOpen: boolean;
  onClose: () => void;
  onRevoke: (sessionId: string) => Promise<void>;
  isLoading?: boolean;
}

export const SessionDetailDrawer: React.FC<SessionDetailDrawerProps> = ({
  session,
  isOpen,
  onClose,
  onRevoke,
  isLoading,
}) => {
  if (!session) return null;

  const devInfo = (session.deviceInfo || '').toLowerCase();
  const isMobile = devInfo.includes('ios') || devInfo.includes('android');
  const DeviceIcon = isMobile ? Smartphone : Laptop;

  return (
    <AdminDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Session Telemetry & Security"
      subtitle={`Session ID: ${session.id}`}
      width="max-w-xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>
            Close
          </Button>
          {!session.isCurrentSession ? (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await onRevoke(session.id);
                onClose();
              }}
              disabled={isLoading}
              className="text-danger border-danger/30 hover:bg-danger/10"
              icon={<LogOut className="h-4 w-4" />}
            >
              Terminate Session
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="h-4 w-4 text-primary" /> Active Current Session
            </span>
          )}
        </div>
      }
    >
      <div className="space-y-6 text-sm">
        {/* Device Header Card */}
        <div className="rounded-xl border border-border bg-surface-muted/20 p-4 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <DeviceIcon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-foreground">{session.deviceInfo}</h3>
              {session.isCurrentSession && (
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  Current Session
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              IP: {session.ipAddress}
            </p>
          </div>
        </div>

        {/* User Identity Section */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" /> Authenticated Member
          </h4>
          <div className="grid grid-cols-2 gap-3 rounded-xl border border-border p-3.5 bg-surface">
            <div>
              <span className="text-[11px] text-muted-foreground">Full Name</span>
              <p className="font-medium text-foreground">{session.userName}</p>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground">Email Address</span>
              <p className="font-medium text-foreground">{session.userEmail}</p>
            </div>
            <div className="col-span-2">
              <span className="text-[11px] text-muted-foreground">User ID</span>
              <p className="font-mono text-xs text-muted-foreground">{session.userId}</p>
            </div>
          </div>
        </div>

        {/* Temporal Validity Section */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> Session Lifecycle & Timestamps
          </h4>
          <div className="grid grid-cols-2 gap-3 rounded-xl border border-border p-3.5 bg-surface">
            <div>
              <span className="text-[11px] text-muted-foreground">Signed In</span>
              <p className="font-medium text-foreground">{new Date(session.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground">Expires At</span>
              <p className="font-medium text-foreground">{new Date(session.expiresAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Full User-Agent String */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5" /> Full User Agent
          </h4>
          <div className="rounded-xl border border-border bg-surface-muted/30 p-3 font-mono text-xs text-foreground/80 break-all leading-relaxed">
            {session.userAgent || 'No user-agent string captured.'}
          </div>
        </div>

        {/* Revocation Impact Notice */}
        <div className="rounded-xl border border-warning/30 bg-warning/5 p-4 text-xs text-warning-foreground space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <Shield className="h-4 w-4" /> Revocation Safeguard
          </div>
          <p className="text-muted-foreground">
            Terminating this session will immediately invalidate its active refresh token and deny subsequent API calls with this token family.
          </p>
        </div>
      </div>
    </AdminDrawer>
  );
};
