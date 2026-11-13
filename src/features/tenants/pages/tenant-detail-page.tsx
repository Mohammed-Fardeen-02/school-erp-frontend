import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Layers,
  ShieldAlert,
  ArrowRight,
  Check,
  Save,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/forms/input';
import { Badge } from '@/components/data-display/badge';
import { TenantStatusBadge } from '../components/tenant-status-badge';
import { TenantStatusModal } from '../components/tenant-status-modal';
import {
  useTenant,
  useUpdateTenant,
  useUpdateTenantStatus,
  useTenantModules,
  useUpdateTenantModules,
} from '../hooks/use-tenants';
import { useAuthStore } from '@/stores/auth-store';
import type { TenantStatus } from '../types/tenants.types';

const CANONICAL_MODULES = [
  { id: 'academics', label: 'Academics & Curriculum', desc: 'Classes, sections, subjects, syllabus management' },
  { id: 'students', label: 'Students & Admissions', desc: 'Student directory, enrollments, guardian details' },
  { id: 'attendance', label: 'Attendance Management', desc: 'Daily attendance logs, leaves, automated registers' },
  { id: 'fees', label: 'Fees & Invoicing', desc: 'Fee structures, invoices, payment receipts, reconciliations' },
  { id: 'staff', label: 'Staff & Faculty HR', desc: 'Teacher profiles, subject allocations, leave tracking' },
  { id: 'exams', label: 'Examinations & Grades', desc: 'Exam schedules, mark entries, automated report cards' },
  { id: 'timetable', label: 'Timetable Scheduling', desc: 'Period allocations, class timetables, teacher substitutions' },
  { id: 'transport', label: 'Campus Transport', desc: 'Bus routes, pickup points, vehicle tracking' },
  { id: 'hostel', label: 'Hostel & Residence', desc: 'Room allocations, warden management, boarding fees' },
  { id: 'library', label: 'Library Management', desc: 'Book catalog, lending, returns, fine tracking' },
  { id: 'inventory', label: 'Assets & Inventory', desc: 'School assets, supplies, stock tracking' },
  { id: 'reports', label: 'Analytics & Reporting', desc: 'Comprehensive academic, financial, and operational reports' },
];

export const TenantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setActiveWorkspace, setTenantContext } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'modules' | 'quotas'>('profile');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const { data: tenant, isLoading: isTenantLoading, refetch: refetchTenant } = useTenant(id);
  const { data: modules = [] } = useTenantModules(id);

  const updateTenantMutation = useUpdateTenant(id || '');
  const updateStatusMutation = useUpdateTenantStatus();
  const updateModulesMutation = useUpdateTenantModules(id || '');

  // Profile Form State
  const [profileData, setProfileData] = useState({
    displayName: '',
    legalName: '',
    email: '',
    phone: '',
    website: '',
    addressLine1: '',
    city: '',
    state: '',
    country: '',
  });

  // Modules Checkbox State
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [moduleSaveSuccess, setModuleSaveSuccess] = useState(false);

  useEffect(() => {
    if (tenant) {
      setProfileData({
        displayName: tenant.displayName || '',
        legalName: tenant.legalName || '',
        email: tenant.email || '',
        phone: tenant.phone || '',
        website: tenant.website || '',
        addressLine1: tenant.addressLine1 || '',
        city: tenant.city || '',
        state: tenant.state || '',
        country: tenant.country || '',
      });
    }
  }, [tenant]);

  useEffect(() => {
    if (modules) {
      setSelectedModules(modules);
    }
  }, [modules]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      await updateTenantMutation.mutateAsync(profileData);
    } catch {
      // Handled by mutation error
    }
  };

  const handleModuleToggle = (modId: string) => {
    setSelectedModules((prev) =>
      prev.includes(modId) ? prev.filter((m) => m !== modId) : [...prev, modId]
    );
    setModuleSaveSuccess(false);
  };

  const handleModulesSave = async () => {
    if (!id) return;
    try {
      await updateModulesMutation.mutateAsync({ modules: selectedModules });
      setModuleSaveSuccess(true);
      setTimeout(() => setModuleSaveSuccess(false), 3000);
    } catch {
      // Handled by mutation error
    }
  };

  const handleEnterWorkspace = () => {
    if (!tenant) return;
    setActiveWorkspace(tenant.id);
    setTenantContext(tenant.id, null);
    navigate('/workspace');
  };

  const handleStatusSubmit = async (status: TenantStatus, reason?: string) => {
    if (!id) return;
    try {
      await updateStatusMutation.mutateAsync({ id, payload: { status, reason } });
      setIsStatusModalOpen(false);
      refetchTenant();
    } catch {
      // Handled by mutation error
    }
  };

  if (isTenantLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Loading institution details...</span>
        </div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">Institution Not Found</h2>
        <Button variant="outline" onClick={() => navigate('/tenants')}>
          Return to Institutions List
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/tenants')}
            icon={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Institutions
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-foreground">{tenant.displayName}</h1>
              <TenantStatusBadge status={tenant.status} />
              <Badge variant="outline" className="font-mono text-xs">
                {tenant.code}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{tenant.legalName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsStatusModalOpen(true)}
            icon={<ShieldAlert className="h-4 w-4" />}
          >
            Lifecycle Status
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleEnterWorkspace}
            icon={<ArrowRight className="h-4 w-4" />}
          >
            Enter Workspace
          </Button>
        </div>
      </div>

      {/* Detail Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'profile'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Building2 className="h-4 w-4" />
          General Profile
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('modules')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'modules'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Layers className="h-4 w-4" />
          Subscribed Modules ({selectedModules.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('quotas')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'quotas'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="h-4 w-4" />
          Campuses & Quotas
        </button>
      </div>

      {/* Tab 1: Profile Information Form */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          {updateTenantMutation.isSuccess && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-600 flex items-center gap-2">
              <Check className="h-4 w-4" /> Profile updated successfully!
            </div>
          )}

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Institution Legal & Brand Settings
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Display Name
                </label>
                <Input
                  value={profileData.displayName}
                  onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Legal Registered Name
                </label>
                <Input
                  value={profileData.legalName}
                  onChange={(e) => setProfileData({ ...profileData, legalName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Official Email
                </label>
                <Input
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Official Phone
                </label>
                <Input
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Website URL
                </label>
                <Input
                  value={profileData.website}
                  onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                  placeholder="https://www.school.edu"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Street Address
                </label>
                <Input
                  value={profileData.addressLine1}
                  onChange={(e) => setProfileData({ ...profileData, addressLine1: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  City
                </label>
                <Input
                  value={profileData.city}
                  onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  State / Country
                </label>
                <Input
                  value={profileData.state}
                  onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={updateTenantMutation.isPending}
                icon={<Save className="h-4 w-4" />}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Subscribed Module Packages */}
      {activeTab === 'modules' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">Subscribed Modules & Features</h2>
              <p className="text-xs text-muted-foreground">
                Toggle the functional business modules active for this institution. Users in this school
                will only be able to view and access enabled modules.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleModulesSave}
              loading={updateModulesMutation.isPending}
              icon={<Save className="h-4 w-4" />}
            >
              Save Subscribed Modules
            </Button>
          </div>

          {moduleSaveSuccess && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-600 flex items-center gap-2">
              <Check className="h-4 w-4" /> Subscribed modules successfully updated!
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CANONICAL_MODULES.map((mod) => {
              const isChecked = selectedModules.includes(mod.id);

              return (
                <div
                  key={mod.id}
                  onClick={() => handleModuleToggle(mod.id)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                    isChecked
                      ? 'border-primary bg-primary/5 shadow-xs'
                      : 'border-border bg-surface hover:bg-surface-muted/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}} // Controlled by wrapper div
                      className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <div>
                      <div className="text-sm font-bold text-foreground">{mod.label}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{mod.desc}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Campuses & Quotas */}
      {activeTab === 'quotas' && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Campus Locations
            </span>
            <div className="mt-2 text-3xl font-black text-foreground">
              {tenant._count?.locations ?? 1}{' '}
              <span className="text-sm font-normal text-muted-foreground">/ {tenant.maxLocations}</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Maximum physical campus branches allowed on plan {tenant.subscriptionPlan}.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Staff & Faculty Quota
            </span>
            <div className="mt-2 text-3xl font-black text-foreground">
              {tenant._count?.memberships ?? 1}{' '}
              <span className="text-sm font-normal text-muted-foreground">/ {tenant.maxUsers}</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Active staff, teacher, and administrator accounts allocated.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Student Enrollment Limit
            </span>
            <div className="mt-2 text-3xl font-black text-foreground">
              {tenant.maxStudents}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Total active student admissions capacity across all campus branches.
            </p>
          </div>
        </div>
      )}

      {/* Lifecycle Status Modal */}
      <TenantStatusModal
        isOpen={isStatusModalOpen}
        tenant={tenant}
        loading={updateStatusMutation.isPending}
        error={updateStatusMutation.error?.message}
        onClose={() => setIsStatusModalOpen(false)}
        onSubmit={handleStatusSubmit}
      />
    </div>
  );
};

