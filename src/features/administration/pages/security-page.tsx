import React, { useState } from 'react';
import { Lock, ShieldAlert, Laptop, KeyRound, Activity } from 'lucide-react';
import { PageWrapper } from '@/app/layouts/page-wrapper';
import { AdminPageHeader } from '../components/common/admin-page-header';
import { AdminStatsRow } from '../components/common/admin-stats-row';
import { ActiveSessionsCard } from '../components/security/active-sessions-card';
import { SecurityPoliciesCard } from '../components/security/security-policies-card';
import { SessionDetailDrawer } from '../components/security/session-detail-drawer';
import { AuthenticationActivityTable } from '../components/security/authentication-activity-table';
import {
  useActiveSessions,
  useRevokeSession,
  useRevokeAllOtherSessions,
  useSecurityPolicies,
  useUpdateSecurityPolicies,
  useAuthenticationActivity,
} from '../hooks/use-admin';
import type { SecurityPolicyConfig, DeviceSession } from '../types/admin.types';

export const SecurityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'policies' | 'activity'>('sessions');

  // Session drawer state
  const [selectedSession, setSelectedSession] = useState<DeviceSession | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Activity filter state
  const [activitySearch, setActivitySearch] = useState('');
  const [activityAction, setActivityAction] = useState('ALL');
  const [activityPage, setActivityPage] = useState(1);

  const { data: sessions = [], isLoading: isSessionsLoading } = useActiveSessions();
  const { data: policies } = useSecurityPolicies();
  const {
    data: activityData,
    isLoading: isActivityLoading,
  } = useAuthenticationActivity({
    search: activitySearch,
    action: activityAction,
    page: activityPage,
    limit: 10,
  });

  const revokeSessionMutation = useRevokeSession();
  const revokeAllOtherMutation = useRevokeAllOtherSessions();
  const updatePoliciesMutation = useUpdateSecurityPolicies();

  const handleRevokeSession = async (sessionId: string) => {
    await revokeSessionMutation.mutateAsync(sessionId);
    if (selectedSession?.id === sessionId) {
      setIsDrawerOpen(false);
      setSelectedSession(null);
    }
  };

  const handleRevokeAllOther = async () => {
    await revokeAllOtherMutation.mutateAsync();
  };

  const handleSavePolicies = async (updated: SecurityPolicyConfig) => {
    await updatePoliciesMutation.mutateAsync(updated);
  };

  const handleViewSessionDetails = (session: DeviceSession) => {
    setSelectedSession(session);
    setIsDrawerOpen(true);
  };

  return (
    <PageWrapper className="space-y-6">
      <AdminPageHeader
        title="Authentication & Security Management"
        subtitle="Active device sessions, password complexity rules, session timeout, and MFA security enforcement."
        icon={Lock}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Administration', href: '/admin' },
          { label: 'Security' },
        ]}
      />

      {/* KPI Stats */}
      <AdminStatsRow
        stats={[
          {
            title: 'Monitored Sessions',
            value: sessions.length,
            icon: Laptop,
            subtitle: 'Active browser & mobile sessions',
          },
          {
            title: 'Idle Timeout',
            value: `${policies?.sessionTimeoutMinutes || 30}m`,
            icon: Lock,
            subtitle: 'Automatic inactivity lock',
          },
          {
            title: 'Lockout Threshold',
            value: `${policies?.maxFailedLoginsBeforeLockout || 5} tries`,
            icon: ShieldAlert,
            subtitle: 'Account protection threshold',
          },
          {
            title: 'MFA Enforcement',
            value: policies?.twoFactorPolicy || 'OPTIONAL',
            icon: KeyRound,
            subtitle: 'Two-factor authentication',
          },
        ]}
      />

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 border-b border-border pb-px">
        <button
          type="button"
          onClick={() => setActiveTab('sessions')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'sessions'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Laptop className="h-3.5 w-3.5" />
          Active Sessions ({sessions.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('policies')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'policies'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Lock className="h-3.5 w-3.5" />
          Password & Access Policies
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('activity')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'activity'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Activity className="h-3.5 w-3.5" />
          Authentication Activity {activityData?.total ? `(${activityData.total})` : ''}
        </button>
      </div>

      {/* Tab 1: Active Sessions */}
      {activeTab === 'sessions' && (
        <ActiveSessionsCard
          sessions={sessions}
          onRevokeSession={handleRevokeSession}
          onRevokeAllOther={handleRevokeAllOther}
          onViewDetails={handleViewSessionDetails}
          isLoading={revokeSessionMutation.isPending || revokeAllOtherMutation.isPending || isSessionsLoading}
        />
      )}

      {/* Tab 2: Password & Access Policies */}
      {activeTab === 'policies' && policies && (
        <SecurityPoliciesCard
          initialPolicies={policies}
          onSave={handleSavePolicies}
          isLoading={updatePoliciesMutation.isPending}
        />
      )}

      {/* Tab 3: Authentication Activity Forensics */}
      {activeTab === 'activity' && (
        <AuthenticationActivityTable
          logs={activityData?.logs || []}
          total={activityData?.total || 0}
          page={activityPage}
          limit={10}
          onPageChange={setActivityPage}
          search={activitySearch}
          onSearchChange={(s) => {
            setActivitySearch(s);
            setActivityPage(1);
          }}
          actionFilter={activityAction}
          onActionFilterChange={(a) => {
            setActivityAction(a);
            setActivityPage(1);
          }}
          isLoading={isActivityLoading}
        />
      )}

      {/* Session Detail Slide-over Drawer */}
      <SessionDetailDrawer
        session={selectedSession}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedSession(null);
        }}
        onRevoke={handleRevokeSession}
        isLoading={revokeSessionMutation.isPending}
      />
    </PageWrapper>
  );
};
