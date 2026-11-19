import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TenantDetailPage } from './tenant-detail-page';
import * as tenantHooks from '../hooks/use-tenants';
import * as branchHooks from '@/features/academics/hooks/use-branches';
import * as adminHooks from '@/features/administration/hooks/use-admin';
import { useAuthStore } from '@/stores/auth-store';

vi.mock('../hooks/use-tenants', () => ({
  useTenant: vi.fn(),
  useUpdateTenant: vi.fn(),
  useUpdateTenantStatus: vi.fn(),
  useTenantModules: vi.fn(),
  useUpdateTenantModules: vi.fn(),
}));

vi.mock('@/features/academics/hooks/use-branches', () => ({
  useBranches: vi.fn(),
  useSetMainBranch: vi.fn(),
  useToggleBranchStatus: vi.fn(),
  useSaveBranch: vi.fn(),
}));

vi.mock('@/features/administration/hooks/use-admin', () => ({
  useOrganizationActivity: vi.fn(),
  useAdminUsers: vi.fn(),
}));

const mockTenant = {
  id: 'org-test-123',
  code: 'STANFORD',
  displayName: 'Stanford International Academy',
  legalName: 'Stanford Academy Education Trust',
  organizationType: 'K12_SCHOOL_CHAIN',
  email: 'admin@stanford.edu',
  phone: '+1-555-0100',
  website: 'https://stanford.edu',
  taxId: 'TAX-998877',
  registrationNo: 'REG-12345',
  addressLine1: '450 Serra Mall',
  city: 'Stanford',
  state: 'CA',
  country: 'USA',
  postalCode: '94305',
  timezone: 'America/Los_Angeles',
  currency: 'USD',
  status: 'ACTIVE' as const,
  subscriptionPlan: 'ENTERPRISE',
  maxLocations: 5,
  maxUsers: 500,
  maxStudents: 2500,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-11-19T00:00:00Z',
};

const mockCampuses = [
  {
    id: 'loc-1',
    organizationId: 'org-test-123',
    name: 'Palo Alto Main Campus',
    code: 'MAIN',
    city: 'Palo Alto',
    isMainCampus: true,
    isActive: true,
    _count: { userRoles: 12 },
  },
  {
    id: 'loc-2',
    organizationId: 'org-test-123',
    name: 'San Jose Tech Branch',
    code: 'SJ',
    city: 'San Jose',
    isMainCampus: false,
    isActive: true,
    _count: { userRoles: 5 },
  },
];

const mockActivityLogs = [
  {
    id: 'act-1',
    action: 'ORGANIZATION_STATUS_UPDATED',
    entity: 'Organization',
    entityType: 'Organization',
    createdAt: '2026-11-19T08:00:00Z',
    user: {
      firstName: 'Sarah',
      lastName: 'Connor',
      email: 'sconnor@erp.local',
    },
    metadata: {
      oldStatus: 'PROVISIONING',
      newStatus: 'ACTIVE',
    },
  },
];

const mockUsersData = {
  users: [
    {
      id: 'usr-1',
      firstName: 'Sarah',
      lastName: 'Connor',
      email: 'sconnor@erp.local',
      status: 'ACTIVE',
      primaryRole: 'Organization Admin',
      assignedCampus: 'Palo Alto Main Campus',
    },
  ],
  total: 1,
};

describe('TenantDetailPage', () => {
  let queryClient: QueryClient;
  const mockUpdateTenant = vi.fn();
  const mockUpdateStatus = vi.fn();
  const mockUpdateModules = vi.fn();
  const mockSetMainBranch = vi.fn();
  const mockToggleBranchStatus = vi.fn();
  const mockSaveBranch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    useAuthStore.setState({
      user: {
        id: 'super-admin-1',
        email: 'super@system.local',
        firstName: 'Super',
        lastName: 'Admin',
        role: 'SUPER_ADMIN',
      },
    });

    vi.mocked(tenantHooks.useTenant).mockReturnValue({
      data: mockTenant,
      isLoading: false,
      refetch: vi.fn(),
    } as any);

    vi.mocked(tenantHooks.useTenantModules).mockReturnValue({
      data: ['academics', 'students', 'fees'],
      isLoading: false,
    } as any);

    vi.mocked(tenantHooks.useUpdateTenant).mockReturnValue({
      mutateAsync: mockUpdateTenant,
      isPending: false,
    } as any);

    vi.mocked(tenantHooks.useUpdateTenantStatus).mockReturnValue({
      mutateAsync: mockUpdateStatus,
      isPending: false,
    } as any);

    vi.mocked(tenantHooks.useUpdateTenantModules).mockReturnValue({
      mutateAsync: mockUpdateModules,
      isPending: false,
    } as any);

    vi.mocked(branchHooks.useBranches).mockReturnValue({
      data: mockCampuses,
      isLoading: false,
      refetch: vi.fn(),
    } as any);

    vi.mocked(branchHooks.useSetMainBranch).mockReturnValue({
      mutateAsync: mockSetMainBranch,
      isPending: false,
    } as any);

    vi.mocked(branchHooks.useToggleBranchStatus).mockReturnValue({
      mutateAsync: mockToggleBranchStatus,
      isPending: false,
    } as any);

    vi.mocked(branchHooks.useSaveBranch).mockReturnValue({
      mutateAsync: mockSaveBranch,
      isPending: false,
    } as any);

    vi.mocked(adminHooks.useOrganizationActivity).mockReturnValue({
      data: mockActivityLogs,
      isLoading: false,
    } as any);

    vi.mocked(adminHooks.useAdminUsers).mockReturnValue({
      data: mockUsersData,
      isLoading: false,
    } as any);
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin/organizations/org-test-123']}>
          <Routes>
            <Route path="/admin/organizations/:id" element={<TenantDetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('renders organization header and actions correctly', () => {
    renderComponent();

    expect(screen.getByRole('heading', { level: 1, name: 'Stanford International Academy' })).toBeInTheDocument();
    expect(screen.getByText('STANFORD')).toBeInTheDocument();
    expect(screen.getByText('Stanford Academy Education Trust')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Lifecycle Status/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Enter Workspace/i })).toBeInTheDocument();
  });

  it('renders all 5 workspace tabs', () => {
    renderComponent();

    expect(screen.getByRole('button', { name: /^Overview$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Campuses/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Members/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Configuration/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Activity History/i })).toBeInTheDocument();
  });

  it('displays overview tab profile information by default', () => {
    renderComponent();

    expect(screen.getByDisplayValue('Stanford International Academy')).toBeInTheDocument();
    expect(screen.getByDisplayValue('admin@stanford.edu')).toBeInTheDocument();
    expect(screen.getByText('Palo Alto Main Campus')).toBeInTheDocument();
    expect(screen.getByText('Registered Campuses')).toBeInTheDocument();
    expect(screen.getByText('Staff & Administrators')).toBeInTheDocument();
    expect(screen.getByText('Student Capacity')).toBeInTheDocument();
  });

  it('switches to Campuses tab and displays campus list and actions', () => {
    renderComponent();

    fireEvent.click(screen.getByRole('button', { name: /Campuses/i }));

    expect(screen.getByText('Palo Alto Main Campus')).toBeInTheDocument();
    expect(screen.getByText('San Jose Tech Branch')).toBeInTheDocument();
    expect(screen.getByText('Main Campus')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Campus/i })).toBeInTheDocument();
  });

  it('switches to Members tab and renders organization members', () => {
    renderComponent();

    fireEvent.click(screen.getByRole('button', { name: /Members/i }));

    expect(screen.getByText('Sarah Connor')).toBeInTheDocument();
    expect(screen.getByText('sconnor@erp.local')).toBeInTheDocument();
    expect(screen.getByText('Organization Admin')).toBeInTheDocument();
  });

  it('switches to Module Configuration tab and displays canonical modules', () => {
    renderComponent();

    fireEvent.click(screen.getByRole('button', { name: /Configuration/i }));

    expect(screen.getByText('Academics & Curriculum')).toBeInTheDocument();
    expect(screen.getByText('Students & Admissions')).toBeInTheDocument();
    expect(screen.getByText('Attendance Management')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Modules/i })).toBeInTheDocument();
  });

  it('switches to Activity History tab and renders audit timeline', () => {
    renderComponent();

    fireEvent.click(screen.getByRole('button', { name: /Activity History/i }));

    expect(screen.getByText('ORGANIZATION STATUS UPDATED')).toBeInTheDocument();
    expect(screen.getByText(/Sarah Connor/i)).toBeInTheDocument();
  });
});

