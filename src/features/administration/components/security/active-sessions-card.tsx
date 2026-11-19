import React, { useState } from 'react';
import {
  Laptop,
  Smartphone,
  LogOut,
  CheckCircle2,
  Search,
  Eye,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/forms/input';
import type { DeviceSession } from '../../types/admin.types';

export interface ActiveSessionsCardProps {
  sessions: DeviceSession[];
  onRevokeSession: (sessionId: string) => Promise<void>;
  onRevokeAllOther: () => Promise<void>;
  onViewDetails?: (session: DeviceSession) => void;
  isLoading?: boolean;
}

export const ActiveSessionsCard: React.FC<ActiveSessionsCardProps> = ({
  sessions,
  onRevokeSession,
  onRevokeAllOther,
  onViewDetails,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deviceFilter, setDeviceFilter] = useState<'all' | 'desktop' | 'mobile'>('all');
  const [pendingRevokeId, setPendingRevokeId] = useState<string | null>(null);
  const [confirmRevokeOther, setConfirmRevokeOther] = useState(false);

  const filteredSessions = sessions.filter((sess) => {
    const devInfo = (sess.deviceInfo || '').toLowerCase();
    const isMobile = devInfo.includes('ios') || devInfo.includes('android');

    if (deviceFilter === 'desktop' && isMobile) return false;
    if (deviceFilter === 'mobile' && !isMobile) return false;

    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();

    return (
      (sess.userName || '').toLowerCase().includes(term) ||
      (sess.userEmail || '').toLowerCase().includes(term) ||
      (sess.deviceInfo || '').toLowerCase().includes(term) ||
      (sess.ipAddress || '').toLowerCase().includes(term)
    );
  });

  const handleConfirmSingleRevoke = async () => {
    if (pendingRevokeId) {
      await onRevokeSession(pendingRevokeId);
      setPendingRevokeId(null);
    }
  };

  const handleConfirmRevokeOther = async () => {
    await onRevokeAllOther();
    setConfirmRevokeOther(false);
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4">
        <div>
          <h2 className="text-base font-bold text-foreground">Active Device Sessions</h2>
          <p className="text-xs text-muted-foreground">
            Monitored browser and mobile client sessions across your institution.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setConfirmRevokeOther(true)}
          disabled={isLoading || sessions.length <= 1}
          icon={<LogOut className="h-4 w-4 text-danger" />}
        >
          Revoke Other Sessions
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Input
            placeholder="Search sessions by member, device name, or IP address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 text-xs"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-border p-1 bg-surface-muted/30">
          <button
            type="button"
            onClick={() => setDeviceFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              deviceFilter === 'all'
                ? 'bg-surface text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All ({sessions.length})
          </button>
          <button
            type="button"
            onClick={() => setDeviceFilter('desktop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              deviceFilter === 'desktop'
                ? 'bg-surface text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Desktop
          </button>
          <button
            type="button"
            onClick={() => setDeviceFilter('mobile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              deviceFilter === 'mobile'
                ? 'bg-surface text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Mobile
          </button>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-3">
        {filteredSessions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
            No active sessions found matching your criteria.
          </div>
        ) : (
          filteredSessions.map((sess) => {
            const devInfo = (sess.deviceInfo || '').toLowerCase();
            const isMobile = devInfo.includes('ios') || devInfo.includes('android');
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
                  <div
                    className={`p-2 rounded-xl mt-0.5 ${
                      sess.isCurrentSession
                        ? 'bg-primary/10 text-primary'
                        : 'bg-surface-muted text-muted-foreground'
                    }`}
                  >
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

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {onViewDetails && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(sess)}
                      className="text-xs"
                      icon={<Eye className="h-3.5 w-3.5" />}
                    >
                      Details
                    </Button>
                  )}

                  {!sess.isCurrentSession && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPendingRevokeId(sess.id)}
                      disabled={isLoading}
                      className="text-danger border-danger/30 hover:bg-danger/10 text-xs"
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation Modal for Single Revoke */}
      {pendingRevokeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-2xl max-w-md w-full space-y-4">
            <div className="flex items-center gap-3 text-danger">
              <div className="p-2 rounded-xl bg-danger/10">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-foreground text-base">Terminate Active Session?</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to revoke this session? The device will be immediately signed out and its authentication refresh family invalidated.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPendingRevokeId(null)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmSingleRevoke}
                disabled={isLoading}
              >
                Confirm Revocation
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Revoke All Other */}
      {confirmRevokeOther && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-2xl max-w-md w-full space-y-4">
            <div className="flex items-center gap-3 text-warning">
              <div className="p-2 rounded-xl bg-warning/10">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-foreground text-base">Terminate All Other Sessions?</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This will log out all other active browser and mobile devices across this account, except your current active window.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmRevokeOther(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmRevokeOther}
                disabled={isLoading}
              >
                Revoke Other Sessions
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
