import React from 'react';
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
} from 'lucide-react';
import { PageWrapper } from '@/app/layouts/page-wrapper';
import { AdminPageHeader } from '../components/common/admin-page-header';
import { AdminStatsRow } from '../components/common/admin-stats-row';

export const AdminOverviewPage: React.FC = () => {
  const navigate = useNavigate();

  const adminSections = [
    {
      title: 'Organization Management',
      description: 'Institution legal identity, campus locations, and academic year configurations.',
      href: '/admin/organizations',
      icon: Building2,
      badge: 'Multi-Tenant',
    },
    {
      title: 'User Management',
      description: 'Directory, onboarding invitations, account activation, and user credential management.',
      href: '/admin/users',
      icon: Users,
      badge: 'Directory',
    },
    {
      title: 'Roles & Permissions',
      description: 'Author custom roles, assign capability checkboxes, and inspect 212-node TriState matrix.',
      href: '/admin/roles',
      icon: KeyRound,
      badge: 'RBAC v3.0.2',
    },
    {
      title: 'Authentication & Security',
      description: 'Active device sessions, password complexity rules, session timeout, and MFA policy.',
      href: '/admin/security',
      icon: Lock,
      badge: 'Zero Trust',
    },
    {
      title: 'Subscriptions & Billing',
      description: 'Plan tiers, invoice receipts, renewal cycles, and payment methods.',
      href: '/admin/billing',
      icon: CreditCard,
      badge: 'Invoices',
    },
    {
      title: 'Plans & Entitlements',
      description: 'Toggle 12 canonical domain modules and manage resource quota ceilings.',
      href: '/admin/plans',
      icon: Sliders,
      badge: 'Quota Limits',
    },
    {
      title: 'Audit & Activity Logs',
      description: 'Immutable security events, actor trails, and state mutation inspection.',
      href: '/admin/audit-logs',
      icon: History,
      badge: 'Compliance',
    },
  ];

  return (
    <PageWrapper className="space-y-6">
      <AdminPageHeader
        title="Administration & Access Management"
        subtitle="Centralized governance workspace for institutions, users, security policies, and subscriptions."
        icon={ShieldCheck}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Administration' }]}
      />

      {/* KPI Overview Metrics */}
      <AdminStatsRow
        stats={[
          { title: 'Registered Schools', value: '1', icon: Building2, subtitle: 'Active tenant workspaces' },
          { title: 'Provisioned Users', value: '4', icon: Users, subtitle: 'Active accounts & faculty' },
          { title: 'Configured Roles', value: '8', icon: KeyRound, subtitle: 'Custom & template roles' },
          { title: 'Active Sessions', value: '2', icon: Lock, subtitle: 'Monitored client devices' },
        ]}
      />

      {/* 7 Administration Features Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
        {adminSections.map((sec) => {
          const Icon = sec.icon;

          return (
            <div
              key={sec.href}
              onClick={() => navigate(sec.href)}
              className="group cursor-pointer rounded-2xl border border-border bg-surface p-6 shadow-xs hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground bg-surface-muted px-2 py-0.5 rounded-full">
                    {sec.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {sec.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  {sec.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-primary">
                <span>Manage Feature</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </PageWrapper>
  );
};
