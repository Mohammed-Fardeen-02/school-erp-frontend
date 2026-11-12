import React from 'react';
import { Laptop, Smartphone, LogOut, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DeviceSession } from '../../types/admin.types';

export interface ActiveSessionsCardProps {
  sessions: DeviceSession[];
  onRevokeSession: (sessionId: string) => Promise<void>;
  onRevokeAllOther: () => Promise<void>;
  isLoading?: boolean;
}

export const ActiveSessionsCard: React.FC<ActiveSessionsCardProps> = ({
  sessions,
  onRevokeSession,
  onRevokeAllOther,
  isLoading,
}) => {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4">
        <div>
          <h2 className="text-base font-bold text-foreground">Active Device Sessions</h2>
          <p className="text-xs text-muted-foreground">
            Logged-in browsers and devices across your institutional account.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRevokeAllOther}
          disabled={isLoading || sessions.length <= 1}
          icon={<LogOut className="h-4 w-4 text-danger" />}
        >
          Revoke Other Sessions
        </Button>
      </div>

      <div className="space-y-3">
        {sessions.map((sess) => {
          const isMobile = sess.deviceInfo.toLowerCase().includes('ios') || sess.deviceInfo.toLowerCase().includes('android');
          const Icon = isMobile ? Smartphone : Laptop;

          return (
            <div
              key={sess.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all gap-4 ${
                sess.isCurrentSession
                  ? 'border-primary/30 bg-primary/5'
                  : 'border-border bg-surface hover:bg-surface-muted/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl mt-0.5 ${sess.isCurrentSession ? 'bg-primary/10 text-primary' : 'bg-surface-muted text-muted-foreground'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">{sess.deviceInfo}</span>
                    {sess.isCurrentSession && (
                      <span className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                        <CheckCircle2 className="h-3 w-3" /> Current Session
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    IP: <span className="font-mono text-foreground">{sess.ipAddress}</span> • User: {sess.userName} ({sess.userEmail})
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Signed in {new Date(sess.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {!sess.isCurrentSession && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRevokeSession(sess.id)}
                  disabled={isLoading}
                  className="text-danger border-danger/30 hover:bg-danger/10 text-xs self-end sm:self-center"
                >
                  Revoke
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
