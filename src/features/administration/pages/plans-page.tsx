import React, { useState, useEffect } from 'react';
import { Sliders, Layers, Users, Building2 } from 'lucide-react';
import { PageWrapper } from '@/app/layouts/page-wrapper';
import { AdminPageHeader } from '../components/common/admin-page-header';
import { AdminStatsRow } from '../components/common/admin-stats-row';
import { ModuleSubscriptionGrid } from '../components/plans/module-subscription-grid';
import { QuotaUtilizationCard } from '../components/plans/quota-utilization-card';
import { usePlansAndEntitlements, useUpdateSubscribedModules } from '../hooks/use-admin';
import type { CanonicalModuleEntitlement, PlansAndEntitlementsDto } from '../types/admin.types';

const DEFAULT_PLANS: PlansAndEntitlementsDto = {
  planName: 'Enterprise School Cloud',
  modules: [
    { id: 'academics', name: 'Academics & Curriculum', category: 'Academic', description: 'Classes, sections, syllabi', isEnabled: true, isLockedByPlan: false },
    { id: 'students', name: 'Students & Admissions', category: 'Academic', description: 'Master student profiles and guardians', isEnabled: true, isLockedByPlan: false },
    { id: 'attendance', name: 'Attendance & Registers', category: 'Core', description: 'Daily classroom registers & analytics', isEnabled: true, isLockedByPlan: false },
    { id: 'fees', name: 'Fees & Billing', category: 'Finance', description: 'Invoices, fees schedules, receipts', isEnabled: true, isLockedByPlan: false },
    { id: 'staff', name: 'Staff & Human Resources', category: 'Administration', description: 'Faculty directories, leaves, payroll', isEnabled: true, isLockedByPlan: false },
    { id: 'exams', name: 'Examinations & Grading', category: 'Academic', description: 'Hall tickets, exams, report cards', isEnabled: true, isLockedByPlan: false },
    { id: 'front-office', name: 'Front Desk Operations', category: 'Core', description: 'Visitor logs, postal dispatch, inquiries', isEnabled: true, isLockedByPlan: false },
    { id: 'timetable', name: 'Classroom Timetable', category: 'Academic', description: 'Class scheduling & substitutions', isEnabled: true, isLockedByPlan: false },
    { id: 'transport', name: 'Fleet & Transportation', category: 'Campus Life', description: 'Routes, vehicles, bus passes', isEnabled: true, isLockedByPlan: false },
    { id: 'library', name: 'Library Catalog', category: 'Campus Life', description: 'Books catalog, issues, returns', isEnabled: true, isLockedByPlan: false },
    { id: 'hostel', name: 'Hostel & Dormitories', category: 'Campus Life', description: 'Rooms, beds, mess billing', isEnabled: false, isLockedByPlan: false },
    { id: 'settings', name: 'Institutional Settings', category: 'System', description: 'RBAC, security, audit policies', isEnabled: true, isLockedByPlan: false },
  ],
  quotas: [
    { key: 'students', label: 'Student Enrollment', used: 1420, total: 2500, unit: 'Students', percentage: 56.8 },
    { key: 'staff', label: 'Faculty & Staff Accounts', used: 94, total: 150, unit: 'Staff', percentage: 62.6 },
    { key: 'campuses', label: 'Registered Campuses', used: 2, total: 5, unit: 'Campuses', percentage: 40.0 },
    { key: 'storage', label: 'Cloud Document Storage', used: 42.5, total: 100, unit: 'GB', percentage: 42.5 },
  ],
};

export const PlansPage: React.FC = () => {
  const { data: plansData } = usePlansAndEntitlements();
  const updateModulesMutation = useUpdateSubscribedModules();

  const currentPlans = plansData || DEFAULT_PLANS;
  const [modules, setModules] = useState<CanonicalModuleEntitlement[]>(currentPlans.modules);

  useEffect(() => {
    if (plansData?.modules) {
      setModules(plansData.modules);
    }
  }, [plansData?.modules]);

  const handleToggleModule = (moduleId: string, enabled: boolean) => {
    setModules((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, isEnabled: enabled } : m))
    );
  };

  const handleSaveModules = async () => {
    const enabledIds = modules.filter((m) => m.isEnabled).map((m) => m.id);
    await updateModulesMutation.mutateAsync({ moduleIds: enabledIds });
  };

  return (
    <PageWrapper className="space-y-6">
      <AdminPageHeader
        title="Plans & Entitlements Management"
        subtitle="Configure provisioned domain module subscriptions and monitor student, staff, and campus limits."
        icon={Sliders}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Administration', href: '/admin' },
          { label: 'Plans & Entitlements' },
        ]}
      />

      {/* KPI Stats */}
      <AdminStatsRow
        stats={[
          { title: 'Subscribed Modules', value: `${modules.filter((m) => m.isEnabled).length} / 12`, icon: Layers, subtitle: 'Active domain suites' },
          { title: 'Max Student Ceiling', value: '2,500', icon: Users, subtitle: 'Enrolled student limit' },
          { title: 'Max Staff Ceiling', value: '150', icon: Users, subtitle: 'Faculty accounts limit' },
          { title: 'Campus Quota', value: '5 Campuses', icon: Building2, subtitle: 'Branch locations limit' },
        ]}
      />

      {/* Quotas Utilization */}
      <QuotaUtilizationCard quotas={currentPlans.quotas} />

      {/* 12 Modules Grid */}
      <ModuleSubscriptionGrid
        modules={modules}
        onToggleModule={handleToggleModule}
        onSave={handleSaveModules}
        isSaving={updateModulesMutation.isPending}
      />
    </PageWrapper>
  );
};
