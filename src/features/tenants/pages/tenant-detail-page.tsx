import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  GitBranch,
  Users,
  Settings,
  History,
  ShieldAlert,
  ArrowRight,
  Check,
  Save,
  Plus,
  Star,
  MapPin,
  Mail,
  Phone,
  Power,
  Activity,
  Calendar,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/forms/input';
import { Badge } from '@/components/data-display/badge';
import { TenantStatusBadge } from '../components/tenant-status-badge';
import { TenantStatusModal } from '../components/tenant-status-modal';
import { BranchFormModal } from '@/features/academics/components/branches/branch-form-modal';
import {
  useTenant,
  useUpdateTenant,
  useUpdateTenantStatus,
  useTenantModules,
  useUpdateTenantModules,
} from '../hooks/use-tenants';
import {
  useBranches,
  useSetMainBranch,
  useToggleBranchStatus,
  useSaveBranch,
} from '@/features/academics/hooks/use-branches';
import { useOrganizationActivity, useAdminUsers } from '@/features/administration/hooks/use-admin';
import { useAuthStore } from '@/stores/auth-store';
import { useToast } from '@/components/feedback/toast';
import type { TenantStatus } from '../types/tenants.types';
import type { BranchDto, SaveBranchPayload } from '@/features/academics/types/branches.types';

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
  const toast = useToast();
  const { setActiveWorkspace, setTenantContext } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'campuses' | 'members' | 'configuration' | 'activity'>('overview');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
  const [editBranchTarget, setEditBranchTarget] = useState<BranchDto | null>(null);

  // Queries
  const { data: tenant, isLoading: isTenantLoading, refetch: refetchTenant } = useTenant(id);
  const { data: modules = [] } = useTenantModules(id);
  const { data: campuses = [], refetch: refetchCampuses } = useBranches({ organizationId: id });
  const { data: activityLogs = [] } = useOrganizationActivity(id || '');
  const { data: usersData } = useAdminUsers({ limit: 50 });

  // Mutations
  const updateTenantMutation = useUpdateTenant(id || '');
  const updateStatusMutation = useUpdateTenantStatus();
  const updateModulesMutation = useUpdateTenantModules(id || '');
  const setMainBranchMutation = useSetMainBranch();
  const toggleBranchStatusMutation = useToggleBranchStatus();
  const saveBranchMutation = useSaveBranch();

  // Profile Form State
  const [profileData, setProfileData] = useState({
    displayName: '',
    legalName: '',
    email: '',
    phone: '',
    website: '',
    taxId: '',
    registrationNo: '',
    addressLine1: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    timezone: '',
    currency: '',
  });

  // Modules State
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
        taxId: tenant.taxId || '',
        registrationNo: tenant.registrationNo || '',
        addressLine1: tenant.addressLine1 || '',
        city: tenant.city || '',
        state: tenant.state || '',
        country: tenant.country || '',
        postalCode: tenant.postalCode || '',
        timezone: tenant.timezone || 'Asia/Kolkata',
        currency: tenant.currency || 'INR',
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
      toast.success('Organization profile updated successfully', 'Profile Saved');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile';
      toast.error(msg, 'Update Error');
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
      toast.success('Module subscriptions updated', 'Modules Saved');
      setTimeout(() => setModuleSaveSuccess(false), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update modules';
      toast.error(msg, 'Save Error');
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
      toast.success(`Organization status changed to ${status}`, 'Status Updated');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to change status';
      toast.error(msg, 'Status Error');
    }
  };

  const handleSetMainBranch = async (branchId: string) => {
    try {
      await setMainBranchMutation.mutateAsync(branchId);
      refetchCampuses();
      refetchTenant();
      toast.success('Primary Main Campus reassigned successfully', 'Main Campus Updated');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to set main campus';
      toast.error(msg, 'Update Error');
    }
  };

  const handleToggleBranchStatus = async (branch: BranchDto) => {
    try {
      await toggleBranchStatusMutation.mutateAsync({ id: branch.id, isActive: !branch.isActive });
      refetchCampuses();
      toast.success(`Branch '${branch.name}' is now ${!branch.isActive ? 'Active' : 'Inactive'}`, 'Status Updated');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to toggle status';
      toast.error(msg, 'Update Error');
    }
  };

  const handleSaveBranch = async (payload: SaveBranchPayload, branchId?: string) => {
    try {
      await saveBranchMutation.mutateAsync({
        payload: { ...payload, organizationId: id },
        id: branchId,
      });
      setIsAddBranchOpen(false);
      setEditBranchTarget(null);
      refetchCampuses();
      toast.success(branchId ? 'Campus updated successfully' : 'New campus created successfully', 'Campus Saved');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save campus';
      toast.error(msg, 'Save Error');
    }
  };

  if (isTenantLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Loading organization workspace...</span>
        </div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">Organization Not Found</h2>
        <Button variant="outline" onClick={() => navigate('/admin/organizations')}>
          Return to Organizations
        </Button>
      </div>
    );
  }

  const primaryCampus = campuses.find((c) => c.isMainCampus);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/organizations')}
            icon={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Organizations
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

      {/* 5-Tab Workspace Navigation */}
      <div className="flex items-center gap-2 border-b border-border overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'overview'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Building2 className="h-4 w-4" />
          Overview
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('campuses')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'campuses'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <GitBranch className="h-4 w-4" />
          Campuses ({campuses.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('members')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'members'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="h-4 w-4" />
          Members ({tenant._count?.memberships ?? 1})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('configuration')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'configuration'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Settings className="h-4 w-4" />
          Configuration ({selectedModules.length} Modules)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('activity')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'activity'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <History className="h-4 w-4" />
          Activity History
        </button>
      </div>

      {/* Tab 1: Overview & Profile Form */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* High-Level KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Registered Campuses
              </span>
              <div className="mt-2 text-2xl font-black text-foreground">
                {campuses.length}{' '}
                <span className="text-sm font-normal text-muted-foreground">/ {tenant.maxLocations}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Primary: <strong className="text-primary">{primaryCampus?.name || 'Not Designated'}</strong>
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Staff & Administrators
              </span>
              <div className="mt-2 text-2xl font-black text-foreground">
                {tenant._count?.memberships ?? 1}{' '}
                <span className="text-sm font-normal text-muted-foreground">/ {tenant.maxUsers}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Active directory identity allocations</p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Student Capacity
              </span>
              <div className="mt-2 text-2xl font-black text-foreground">
                {tenant.maxStudents}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Institutional enrollment limit</p>
            </div>
          </div>

          {/* Institutional Legal Profile Form */}
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Institution Legal & Contact Details
                </h2>
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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Display Name
                  </label>
                  <Input
                    value={profileData.displayName}
                    onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Legal Registered Name
                  </label>
                  <Input
                    value={profileData.legalName}
                    onChange={(e) => setProfileData({ ...profileData, legalName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Official Email
                  </label>
                  <Input
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Official Phone
                  </label>
                  <Input
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Website URL
                  </label>
                  <Input
                    value={profileData.website}
                    onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Tax ID / GSTIN
                  </label>
                  <Input
                    value={profileData.taxId}
                    onChange={(e) => setProfileData({ ...profileData, taxId: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Headquarters Address
                  </label>
                  <Input
                    value={profileData.addressLine1}
                    onChange={(e) => setProfileData({ ...profileData, addressLine1: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">City</label>
                    <Input
                      value={profileData.city}
                      onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">State</label>
                    <Input
                      value={profileData.state}
                      onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Postal Code</label>
                    <Input
                      value={profileData.postalCode}
                      onChange={(e) => setProfileData({ ...profileData, postalCode: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Campuses Directory */}
      {activeTab === 'campuses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">Registered Physical Campuses</h2>
              <p className="text-xs text-muted-foreground">
                Manage branch sites, designate primary main campus, and allocate location scopes.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setEditBranchTarget(null);
                setIsAddBranchOpen(true);
              }}
              icon={<Plus className="h-4 w-4" />}
            >
              Add Campus
            </Button>
          </div>

          <div className="divide-y divide-border rounded-2xl border border-border bg-surface shadow-xs overflow-hidden">
            {campuses.map((campus) => (
              <div key={campus.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <GitBranch className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{campus.name}</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-muted text-muted-foreground border border-border">
                        {campus.code}
                      </span>
                      {campus.isMainCampus && (
                        <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-500/20">
                          <Star className="h-3 w-3 fill-current" />
                          Main Campus
                        </span>
                      )}
                      <Badge variant={campus.isActive ? 'success' : 'neutral'}>
                        {campus.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {[campus.city, campus.state].filter(Boolean).join(', ') || 'No city'}
                      </span>
                      {campus.principalName && <span>Head: {campus.principalName}</span>}
                      <span>Type: {campus.locationType ? campus.locationType.replace(/_/g, ' ') : 'CAMPUS'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!campus.isMainCampus && campus.isActive && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetMainBranch(campus.id)}
                      icon={<Star className="h-3.5 w-3.5 text-amber-600" />}
                    >
                      Set Main
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditBranchTarget(campus);
                      setIsAddBranchOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant={campus.isActive ? 'danger' : 'outline'}
                    size="sm"
                    onClick={() => handleToggleBranchStatus(campus)}
                    icon={<Power className="h-3.5 w-3.5" />}
                  >
                    {campus.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Organization Members */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">Directory Members</h2>
              <p className="text-xs text-muted-foreground">
                Staff, teachers, and administrators provisioned in this institutional organization.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/users')}
              icon={<Users className="h-4 w-4" />}
            >
              Open Full User Directory
            </Button>
          </div>

          <div className="divide-y divide-border rounded-2xl border border-border bg-surface shadow-xs overflow-hidden">
            {(usersData?.users || []).map((u) => (
              <div key={u.id} className="p-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                    {u.firstName?.[0] || 'U'}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">
                      {u.firstName} {u.lastName}
                    </div>
                    <div className="text-muted-foreground font-mono">{u.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Role</span>
                    <span className="font-semibold text-primary">{u.primaryRole || 'Member'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Scope</span>
                    <span className="font-medium text-foreground">{u.assignedCampus || 'All-Campus Scope'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Status</span>
                    <Badge variant={u.status === 'ACTIVE' ? 'success' : 'neutral'}>{u.status}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Subscribed Modules Configuration */}
      {activeTab === 'configuration' && (
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Canonical Business Modules
              </h2>
              <p className="text-xs text-muted-foreground">
                Select active modules enabled for institutional staff and faculty.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleModulesSave}
              loading={updateModulesMutation.isPending}
              icon={<Save className="h-4 w-4" />}
            >
              Save Modules
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CANONICAL_MODULES.map((mod) => {
              const isChecked = selectedModules.includes(mod.id.toUpperCase());
              return (
                <div
                  key={mod.id}
                  onClick={() => handleModuleToggle(mod.id.toUpperCase())}
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
                      onChange={() => {}}
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

      {/* Tab 5: Activity History */}
      {activeTab === 'activity' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-foreground">Institutional Activity History</h2>
            <p className="text-xs text-muted-foreground">
              Immutable compliance audit logs recorded for this organization.
            </p>
          </div>

          <div className="divide-y divide-border rounded-2xl border border-border bg-surface shadow-xs overflow-hidden">
            {activityLogs.length > 0 ? (
              activityLogs.map((log: any) => (
                <div key={log.id} className="p-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{(log.action || 'ACTIVITY').replace(/_/g, ' ')}</div>
                      <div className="text-[11px] text-muted-foreground">
                        Actor: {log.user?.firstName} {log.user?.lastName} ({log.user?.email || 'System'})
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-foreground">{new Date(log.createdAt).toLocaleString()}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">Entity: {log.entity}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No compliance activity logs recorded yet.
              </div>
            )}
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

      {/* Add / Edit Campus Modal */}
      {(isAddBranchOpen || editBranchTarget) && (
        <BranchFormModal
          isOpen={isAddBranchOpen || Boolean(editBranchTarget)}
          onClose={() => {
            setIsAddBranchOpen(false);
            setEditBranchTarget(null);
          }}
          initialData={editBranchTarget}
          selectedOrgId={tenant.id}
          onSubmit={handleSaveBranch}
          isLoading={saveBranchMutation.isPending}
        />
      )}
    </div>
  );
};
