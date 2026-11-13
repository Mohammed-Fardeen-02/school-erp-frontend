import React, { useState } from 'react';
import { Lock, ShieldAlert, Laptop, KeyRound } from 'lucide-react';
import { PageWrapper } from '@/app/layouts/page-wrapper';
import { AdminPageHeader } from '../components/common/admin-page-header';
import { AdminStatsRow } from '../components/common/admin-stats-row';
import { ActiveSessionsCard } from '../components/security/active-sessions-card';
import { SecurityPoliciesCard } from '../components/security/security-policies-card';
import {
  useActiveSessions,
  useRevokeSession,
  useRevokeAllOtherSessions,
  useSecurityPolicies,
  useUpdateSecurityPolicies,
} from '../hooks/use-admin';
import type { SecurityPolicyConfig } from '../types/admin.types';

export const SecurityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'policies'>('sessions');

  const { data: sessions = [] } = useActiveSessions();
  const { data: policies } = useSecurityPolicies();

  const revokeSessionMutation = useRevokeSession();
  const revokeAllOtherMutation = useRevokeAllOtherSessions();
  const updatePoliciesMutation = useUpdateSecurityPolicies();

  const handleRevokeSession = async (sessionId: string) => {
    await revokeSessionMutation.mutateAsync(sessionId);
  };

  const handleRevokeAllOther = async () => {
    await revokeAllOtherMutation.mutateAsync();
  };

  const handleSavePolicies = async (updated: SecurityPolicyConfig) => {
    await updatePoliciesMutation.mutateAsync(updated);
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
          { title: 'Monitored Sessions', value: sessions.length, icon: Laptop, subtitle: 'Active browser & mobile sessions' },
          { title: 'Idle Timeout', value: `${policies?.sessionTimeoutMinutes || 30}m`, icon: Lock, subtitle: 'Automatic inactivity lock' },
          { title: 'Lockout Threshold', value: `${policies?.maxFailedLoginsBeforeLockout || 5} tries`, icon: ShieldAlert, subtitle: 'Account protection threshold' },
          { title: 'MFA Enforcement', value: policies?.twoFactorPolicy || 'OPTIONAL', icon: KeyRound, subtitle: 'Two-factor authentication' },
        ]}
      />

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 border-b border-border pb-px">
        <button
          type="button"
          onClick={() => setActiveTab('sessions')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'sessions'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Active Sessions ({sessions.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('policies')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'policies'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Password & Access Policies
        </button>
      </div>

      {activeTab === 'sessions' && (
        <ActiveSessionsCard
          sessions={sessions}
          onRevokeSession={handleRevokeSession}
          onRevokeAllOther={handleRevokeAllOther}
          isLoading={revokeSessionMutation.isPending || revokeAllOtherMutation.isPending}
        />
      )}

      {activeTab === 'policies' && policies && (
        <SecurityPoliciesCard
          initialPolicies={policies}
          onSave={handleSavePolicies}
          isLoading={updatePoliciesMutation.isPending}
        />
      )}
    </PageWrapper>
  );
};
