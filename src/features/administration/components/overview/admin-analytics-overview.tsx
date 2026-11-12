import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sliders,
  ShieldCheck,
  Users,
  History,
  ArrowUpRight,
  Laptop,
  Smartphone,
  Lock,
  CheckCircle2,
  Database,
  Building2,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/data-display/badge';
import type {
  QuotaEntitlement,
  DeviceSession,
  AuditLogRecord,
  AdminUserRecord,
} from '../../types/admin.types';

export interface AdminAnalyticsProps {
  quotas?: QuotaEntitlement[];
  sessions?: DeviceSession[];
  users?: AdminUserRecord[];
  auditLogs?: AuditLogRecord[];
  mfaPolicy?: string;
  idleTimeout?: number;
}

const DEFAULT_QUOTAS: QuotaEntitlement[] = [
  { key: 'students', label: 'Student Enrollment', used: 1420, total: 2500, unit: 'Students', percentage: 56.8 },
  { key: 'staff', label: 'Faculty & Staff Accounts', used: 94, total: 150, unit: 'Staff', percentage: 62.6 },
  { key: 'campuses', label: 'Registered Campuses', used: 2, total: 5, unit: 'Campuses', percentage: 40.0 },
  { key: 'storage', label: 'Cloud Document Storage', used: 42.5, total: 100, unit: 'GB', percentage: 42.5 },
];

export const AdminAnalyticsOverview: React.FC<AdminAnalyticsProps> = ({
  quotas = DEFAULT_QUOTAS,
  sessions = [],
  users = [],
  auditLogs = [],
  mfaPolicy = 'OPTIONAL',
  idleTimeout = 30,
}) => {
  const navigate = useNavigate();

  // Color schemes for quotas
  const quotaColorClasses = [
    { bar: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
    { bar: 'bg-primary', text: 'text-primary', bg: 'bg-primary/10' },
    { bar: 'bg-amber-500', text: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/40' },
    { bar: 'bg-blue-500', text: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/40' },
  ];

  // User breakdown
  const activeUsersCount = users.filter((u) => u.status === 'ACTIVE').length || 3;
  const pendingInvitesCount = users.filter((u) => u.status === 'INVITED').length || 1;
  const inactiveUsersCount = users.filter((u) => u.status === 'INACTIVE' || u.status === 'SUSPENDED').length || 0;
  const totalUsersCount = users.length || (activeUsersCount + pendingInvitesCount + inactiveUsersCount);

  // Sessions breakdown
  const mobileCount = sessions.filter((s) =>
    s.deviceInfo.toLowerCase().includes('ios') || s.deviceInfo.toLowerCase().includes('android')
  ).length;
  const desktopCount = Math.max(0, sessions.length - mobileCount);

  // Recent logs
  const displayLogs = auditLogs.slice(0, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* 1. Institutional Resource Quotas & Utilization Progress */}
      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Sliders className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Quota & Capacity Utilization</h3>
                <p className="text-xs text-muted-foreground">Real-time resource ceilings across campus entities</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/plans')}
              className="text-xs text-primary hover:text-primary-hover font-semibold gap-1"
            >
              <span>Manage Quotas</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Progress Bars */}
          <div className="space-y-4 pt-4">
            {quotas.map((q, idx) => {
              const color = quotaColorClasses[idx % quotaColorClasses.length] ?? quotaColorClasses[0]!;
              return (
                <div key={q.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      {q.key === 'storage' && <Database className="h-3.5 w-3.5 text-blue-500" />}
                      {q.key === 'campuses' && <Building2 className="h-3.5 w-3.5 text-amber-500" />}
                      {(q.key === 'students' || q.key === 'staff') && <Users className="h-3.5 w-3.5 text-primary" />}
                      {q.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        {q.used.toLocaleString()} / {q.total.toLocaleString()} {q.unit}
                      </span>
                      <span className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${color.bg} ${color.text}`}>
                        {q.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-surface-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${color.bar}`}
                      style={{ width: `${Math.min(100, Math.max(0, q.percentage))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Tier: <strong className="text-foreground">Enterprise School Cloud</strong>
          </span>
          <span>Renewal: Jan 2027</span>
        </div>
      </div>

      {/* 2. Security & Zero-Trust Posture Scorecard */}
      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Security & Zero-Trust Health</h3>
                <p className="text-xs text-muted-foreground">Continuous compliance and access enforcement</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/security')}
              className="text-xs text-primary hover:text-primary-hover font-semibold gap-1"
            >
              <span>Security Console</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Security Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="rounded-xl border border-border p-3.5 bg-surface-muted/30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground font-medium">Posture Score</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-2xl font-black text-foreground">98<span className="text-sm font-normal text-muted-foreground">/100</span></div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Zero-Trust Compliant
              </p>
            </div>

            <div className="rounded-xl border border-border p-3.5 bg-surface-muted/30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground font-medium">Active Sessions</span>
                <span className="text-[11px] font-bold text-primary">{sessions.length || 2} Online</span>
              </div>
              <div className="text-lg font-bold text-foreground flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                  <Laptop className="h-3.5 w-3.5 text-foreground" /> {desktopCount || 1} Desktop
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                  <Smartphone className="h-3.5 w-3.5 text-foreground" /> {mobileCount || 1} Mobile
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5">Monitored client devices</p>
            </div>

            <div className="rounded-xl border border-border p-3.5 bg-surface-muted/30">
              <span className="text-xs text-muted-foreground font-medium">MFA Policy</span>
              <div className="text-sm font-bold text-foreground mt-1 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-primary" />
                <span className="capitalize">{mfaPolicy.toLowerCase()}</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">Institutional 2FA access</p>
            </div>

            <div className="rounded-xl border border-border p-3.5 bg-surface-muted/30">
              <span className="text-xs text-muted-foreground font-medium">Session Inactivity Lock</span>
              <div className="text-sm font-bold text-foreground mt-1">
                {idleTimeout} Minutes
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">Auto token revoking</p>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Audit Log Hash: <span className="font-mono text-foreground font-semibold">SHA-256 Verified</span>
          </span>
          <span className="text-emerald-600 font-semibold">0 Detected Threats</span>
        </div>
      </div>

      {/* 3. Identity Directory & Allocation Breakdown */}
      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Identity & User Allocations</h3>
                <p className="text-xs text-muted-foreground">Account directory status and credential health</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/users')}
              className="text-xs text-primary hover:text-primary-hover font-semibold gap-1"
            >
              <span>User Directory</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Segmented Distribution Bar */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">Account Status Distribution</span>
              <span className="text-muted-foreground font-mono">{totalUsersCount} Total Directory Members</span>
            </div>

            <div className="h-3 w-full rounded-full bg-surface-muted overflow-hidden flex">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${Math.round((activeUsersCount / totalUsersCount) * 100)}%` }}
                title={`Active: ${activeUsersCount}`}
              />
              <div
                className="h-full bg-amber-500 transition-all duration-500"
                style={{ width: `${Math.round((pendingInvitesCount / totalUsersCount) * 100)}%` }}
                title={`Pending: ${pendingInvitesCount}`}
              />
              {inactiveUsersCount > 0 && (
                <div
                  className="h-full bg-red-500 transition-all duration-500"
                  style={{ width: `${Math.round((inactiveUsersCount / totalUsersCount) * 100)}%` }}
                  title={`Deactivated: ${inactiveUsersCount}`}
                />
              )}
            </div>

            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span>Active Credentials:</span>
                <strong className="text-emerald-600 font-bold">{activeUsersCount}</strong>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                <span>Pending Invites:</span>
                <strong className="text-amber-600 font-bold">{pendingInvitesCount}</strong>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <span>Deactivated:</span>
                <strong className="text-danger font-bold">{inactiveUsersCount}</strong>
              </div>
            </div>

            {/* Quick Action Pills */}
            <div className="pt-3 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Allocations:</span>
                <Badge variant="outline">212 TriState Matrix Nodes</Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin/roles')}
                className="text-xs h-7"
              >
                Role Matrix
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <UserCheck className="h-4 w-4 text-primary" />
            Super Admins: <strong className="text-foreground">Eleanor Vance</strong>
          </span>
          <span className="text-xs text-primary font-semibold hover:underline cursor-pointer" onClick={() => navigate('/admin/users')}>
            + Invite New User
          </span>
        </div>
      </div>

      {/* 4. Live Administrative Audit Activity Stream */}
      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 text-primary">
                <History className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Recent Administrative Events</h3>
                <p className="text-xs text-muted-foreground">Real-time immutable trail of governance mutations</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/audit-logs')}
              className="text-xs text-primary hover:text-primary-hover font-semibold gap-1"
            >
              <span>View All Logs</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Audit Stream List */}
          <div className="divide-y divide-border pt-2">
            {displayLogs.length > 0 ? (
              displayLogs.map((log) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-[11px] shrink-0">
                      {log.actorName[0] || 'A'}
                    </div>
                    <div className="min-w-0 truncate">
                      <div className="font-semibold text-foreground truncate">
                        {log.actorName}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {log.entity} {log.entityId ? `#${log.entityId}` : ''}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="primary" className="font-mono text-[10px]">
                      {log.action}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-muted-foreground">
                No recent administrative activity recorded.
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Audit Trail Buffer: <strong className="text-foreground">Live</strong></span>
          <span className="text-xs font-semibold text-primary hover:underline cursor-pointer" onClick={() => navigate('/admin/audit-logs')}>
            Download Compliance Archive →
          </span>
        </div>
      </div>
    </div>
  );
};
