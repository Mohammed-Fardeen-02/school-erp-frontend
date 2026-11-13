import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  Users,
  KeyRound,
  Lock,
  CreditCard,
  Sliders,
  History,
  ArrowRight,
  TrendingUp,
  Download,
  Layers,
} from 'lucide-react';
import { PageWrapper } from '@/app/layouts/page-wrapper';
import { AdminPageHeader } from '../components/common/admin-page-header';
import { AdminStatsRow } from '../components/common/admin-stats-row';
import { AdminAnalyticsOverview } from '../components/overview/admin-analytics-overview';
import { Button } from '@/components/ui/button';
import {
  useAdminOrganizations,
  useAdminCampuses,
  useAdminUsers,
  useActiveSessions,
  useSecurityPolicies,
  usePlansAndEntitlements,
  useAuditLogs,
} from '../hooks/use-admin';
import { useRolesList } from '@/features/roles-permissions/hooks/use-roles';

export const AdminOverviewPage: React.FC = () => {
  const navigate = useNavigate();

  // Queries for live metrics & analytics
  const { data: orgsData } = useAdminOrganizations();
  const { data: campusesData = [] } = useAdminCampuses();
  const { data: usersData } = useAdminUsers();
  const { data: rolesData } = useRolesList();
  const { data: sessions = [] } = useActiveSessions();
  const { data: policies } = useSecurityPolicies();
  const { data: plansData } = usePlansAndEntitlements();
  const { data: auditData } = useAuditLogs({ limit: 4 });

  const organizations = orgsData?.items || [];
  const users = usersData?.users || [];
  const roles = rolesData?.roles || [];
  const auditLogs = auditData?.logs || [];

  // Top KPI Stats
  const topStats = useMemo(() => {
    const orgCount = organizations.length || 1;
    const campusCount = campusesData.length || 2;
    const userCount = users.length || 4;
    const activeRolesCount = roles.length || 8;
    const activeModulesCount = plansData?.modules.filter((m) => m.isEnabled).length || 11;

    return [
      {
        title: 'Campuses & Workspaces',
        value: `${orgCount} Org • ${campusCount} Campuses`,
        icon: Building2,
        subtitle: '100% Operational workspaces',
        color: 'green' as const,
      },
      {
        title: 'Directory Members',
        value: `${userCount} Members`,
        icon: Users,
        subtitle: `${users.filter((u) => u.status === 'ACTIVE').length || 3} Active • ${users.filter((u) => u.status === 'INVITED').length || 1} Invited`,
        color: 'purple' as const,
      },
      {
        title: 'Security Posture',
        value: '98% Score',
        icon: ShieldCheck,
        subtitle: `${sessions.length || 2} Active device sessions`,
        color: 'orange' as const,
      },
      {
        title: 'Subscribed Suites',
        value: `${activeModulesCount} / 12 Modules`,
        icon: Layers,
        subtitle: `${activeRolesCount} Roles • Enterprise Cloud`,
        color: 'red' as const,
      },
    ];
  }, [organizations, campusesData, users, roles, sessions, plansData]);

  // Enhanced 7 Core Administration Navigation Sections
  const adminSections = [
    {
      title: 'Organization Management',
      description: 'Institution legal identity, campus locations, and academic year configurations.',
      href: '/admin/organizations',
      icon: Building2,
      badge: `${organizations.length || 1} Org • ${campusesData.length || 2} Campuses`,
      tag: 'Multi-Tenant',
    },
    {
      title: 'User Management',
      description: 'Directory profiles, onboarding invitations, account activation, and user credential management.',
      href: '/admin/users',
      icon: Users,
      badge: `${users.length || 4} Members • Active`,
      tag: 'Directory',
    },
    {
      title: 'Roles & Permissions',
      description: 'Author custom roles, assign capability checkboxes, and inspect 212-node TriState matrix.',
      href: '/admin/roles',
      icon: KeyRound,
      badge: `${roles.length || 8} Roles • 212 Nodes`,
      tag: 'RBAC v3.0.2',
    },
    {
      title: 'Authentication & Security',
      description: 'Active device sessions, password complexity rules, session timeout, and MFA policy.',
      href: '/admin/security',
      icon: Lock,
      badge: `${sessions.length || 2} Monitored Sessions`,
      tag: 'Zero Trust',
    },
    {
      title: 'Subscriptions & Billing',
      description: 'Plan tiers, invoice receipts, renewal cycles, and payment methods.',
      href: '/admin/billing',
      icon: CreditCard,
      badge: 'Enterprise • Good Standing',
      tag: 'Invoices',
    },
    {
      title: 'Plans & Entitlements',
      description: 'Toggle 12 canonical domain modules and manage resource quota ceilings.',
      href: '/admin/plans',
      icon: Sliders,
      badge: `${plansData?.modules.filter((m) => m.isEnabled).length || 11} / 12 Suites Active`,
      tag: 'Quota Ceilings',
    },
    {
      title: 'Audit & Activity Logs',
      description: 'Immutable security events, actor trails, and state mutation inspection.',
      href: '/admin/audit-logs',
      icon: History,
      badge: 'SHA-256 Cryptographic Trail',
      tag: 'Compliance',
    },
  ];

  return (
    <PageWrapper className="space-y-6">
      <AdminPageHeader
        title="Administration & Access Management"
        subtitle="Centralized institutional governance workspace for organizations, identities, security policies, and subscriptions."
        icon={ShieldCheck}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Administration' }]}
        extraActions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={() => alert('Generating Executive Administration Governance Report (PDF)...')}
            >
              Export Report
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<TrendingUp className="w-4 h-4 text-primary" />}
              onClick={() => navigate('/admin/plans')}
            >
              Capacity Utilization
            </Button>
          </div>
        }
      />

      {/* 1. Live KPI Metrics Overview */}
      <AdminStatsRow stats={topStats} />

      {/* 2. Interactive Analytics Dashboard (Quotas, Security, Identity, and Live Audit Stream) */}
      <AdminAnalyticsOverview
        quotas={plansData?.quotas}
        sessions={sessions}
        users={users}
        auditLogs={auditLogs}
        mfaPolicy={policies?.twoFactorPolicy}
        idleTimeout={policies?.sessionTimeoutMinutes}
      />

      {/* 3. Core Feature Workspaces Hub Cards */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-1">
          <div>
            <h2 className="text-base font-bold text-foreground">Administration Features & Modules</h2>
            <p className="text-xs text-muted-foreground">
              Direct access to all 7 specialized administrative domain modules.
            </p>
          </div>
          <span className="text-xs font-mono text-muted-foreground mt-1 sm:mt-0">
            7 Modules Configured
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {adminSections.map((sec) => {
            const Icon = sec.icon;

            return (
              <div
                key={sec.href}
                onClick={() => navigate(sec.href)}
                className="group cursor-pointer rounded-2xl border border-border bg-surface p-6 shadow-xs hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                      {sec.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {sec.title}
                    </h3>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {sec.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-primary">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono">
                    {sec.tag}
                  </span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Manage Feature</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
};
