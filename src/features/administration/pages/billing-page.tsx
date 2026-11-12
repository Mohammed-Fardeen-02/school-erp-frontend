import React from 'react';
import { CreditCard, FileText, CheckCircle2, Calendar } from 'lucide-react';
import { PageWrapper } from '@/app/layouts/page-wrapper';
import { AdminPageHeader } from '../components/common/admin-page-header';
import { AdminStatsRow } from '../components/common/admin-stats-row';
import { CurrentPlanCard } from '../components/billing/current-plan-card';
import { InvoicesTable } from '../components/billing/invoices-table';
import { useSubscriptionOverview, useBillingInvoices } from '../hooks/use-admin';
import type { SubscriptionOverview } from '../types/admin.types';

const DEFAULT_BILLING: SubscriptionOverview = {
  currentPlan: {
    id: 'plan_ent_01',
    name: 'Enterprise School Cloud',
    code: 'ENTERPRISE',
    description: 'Full institutional suite for multi-campus school chains.',
    priceMonthly: 499,
    priceAnnual: 4990,
    maxStudents: 5000,
    maxStaff: 500,
    maxCampuses: 10,
    storageGb: 500,
    features: [
      'All 12 Canonical Modules',
      'Dynamic RBAC & 212-Node Matrix',
      'Multi-Campus Scoping',
      'Custom Domain & Whitelabel',
      'Automated Backups & 24/7 SLA',
    ],
    isCurrentPlan: true,
  },
  billingCycle: 'ANNUAL',
  status: 'ACTIVE',
  currentPeriodEnd: '2027-01-15T00:00:00Z',
  nextRenewalAmount: 4990,
  paymentMethod: {
    brand: 'Visa',
    last4: '4242',
    expiry: '08/28',
  },
};

export const BillingPage: React.FC = () => {
  const { data: overview } = useSubscriptionOverview();
  const { data: invoices = [] } = useBillingInvoices();

  const currentOverview = overview || DEFAULT_BILLING;

  return (
    <PageWrapper className="space-y-6">
      <AdminPageHeader
        title="Subscriptions & Billing"
        subtitle="Manage your institutional cloud subscription tier, payment methods, and invoice receipts."
        icon={CreditCard}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Administration', href: '/admin' },
          { label: 'Billing' },
        ]}
      />

      {/* KPI Stats */}
      <AdminStatsRow
        stats={[
          { title: 'Active Plan', value: currentOverview.currentPlan.name, icon: CreditCard, subtitle: 'Institutional tier' },
          { title: 'Billing Frequency', value: currentOverview.billingCycle, icon: Calendar, subtitle: 'Annual renewal' },
          { title: 'Next Invoice', value: `$${currentOverview.nextRenewalAmount}`, icon: FileText, subtitle: `Due ${new Date(currentOverview.currentPeriodEnd).toLocaleDateString()}` },
          { title: 'Account Standing', value: 'Good Standing', icon: CheckCircle2, subtitle: 'Card ending in ' + currentOverview.paymentMethod.last4 },
        ]}
      />

      {/* Current Plan Card */}
      <CurrentPlanCard
        overview={currentOverview}
        onUpgradeClick={() => alert('Plan upgrade flow requested.')}
      />

      {/* Invoices History Table */}
      <InvoicesTable invoices={invoices} />
    </PageWrapper>
  );
};
