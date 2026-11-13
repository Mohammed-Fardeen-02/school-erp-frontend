import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminRoutes } from './admin.routes';
import { useAuthStore } from '@/stores/auth-store';
import * as usePermissionModule from '@/features/roles-permissions/hooks/use-permission';

vi.mock('@/features/roles-permissions/hooks/use-permission');

function createWrapper(initialEntry = '/admin') {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/admin/*" element={children} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('AdminRoutes Feature Router', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      user: {
        id: 'super-admin-1',
        email: 'admin@erp.com',
        firstName: 'Eleanor',
        lastName: 'Vance',
        role: 'SUPER_ADMIN',
      },
      workspaces: [],
      activeWorkspaceId: 'org_main',
      isAuthenticated: true,
    });

    vi.spyOn(usePermissionModule, 'usePermission').mockReturnValue({
      hasPermission: true,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
      checkPermission: () => true,
    });
  });

  it('renders AdminOverviewPage on index route /admin', () => {
    render(<AdminRoutes />, { wrapper: createWrapper('/admin') });
    expect(screen.getByText('Administration & Access Management')).toBeInTheDocument();
    expect(screen.getByText('Organization Management')).toBeInTheDocument();
    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByText('Roles & Permissions')).toBeInTheDocument();
  });

  it('renders OrganizationsPage on /admin/organizations', () => {
    render(<AdminRoutes />, { wrapper: createWrapper('/admin/organizations') });
    expect(screen.getByRole('heading', { level: 1, name: 'Organization Management' })).toBeInTheDocument();
    expect(screen.getByText('Add Organization')).toBeInTheDocument();
  });

  it('renders UsersPage on /admin/users', () => {
    render(<AdminRoutes />, { wrapper: createWrapper('/admin/users') });
    expect(screen.getByRole('heading', { level: 1, name: 'User Management' })).toBeInTheDocument();
    expect(screen.getByText('Invite User')).toBeInTheDocument();
  });

  it('renders RolesPage on /admin/roles', () => {
    render(<AdminRoutes />, { wrapper: createWrapper('/admin/roles') });
    expect(screen.getByRole('heading', { level: 1, name: 'Roles & Permissions Management' })).toBeInTheDocument();
    expect(screen.getByText('Create Custom Role')).toBeInTheDocument();
  });

  it('renders RoleCreatePage on /admin/roles/new', () => {
    render(<AdminRoutes />, { wrapper: createWrapper('/admin/roles/new') });
    expect(screen.getByRole('heading', { level: 1, name: 'Author Custom Role' })).toBeInTheDocument();
    expect(screen.getByText('Granted Capabilities & Access Checkboxes')).toBeInTheDocument();
  });

  it('renders SecurityPage on /admin/security', () => {
    render(<AdminRoutes />, { wrapper: createWrapper('/admin/security') });
    expect(screen.getByRole('heading', { level: 1, name: 'Authentication & Security Management' })).toBeInTheDocument();
    expect(screen.getByText('Active Device Sessions')).toBeInTheDocument();
  });

  it('renders BillingPage on /admin/billing', () => {
    render(<AdminRoutes />, { wrapper: createWrapper('/admin/billing') });
    expect(screen.getByRole('heading', { level: 1, name: 'Subscriptions & Billing' })).toBeInTheDocument();
    expect(screen.getByText('Billing & Invoice History')).toBeInTheDocument();
  });

  it('renders PlansPage on /admin/plans', () => {
    render(<AdminRoutes />, { wrapper: createWrapper('/admin/plans') });
    expect(screen.getByRole('heading', { level: 1, name: 'Plans & Entitlements Management' })).toBeInTheDocument();
    expect(screen.getByText('Subscribed Domain Modules')).toBeInTheDocument();
  });

  it('renders AuditLogsPage on /admin/audit-logs', () => {
    render(<AdminRoutes />, { wrapper: createWrapper('/admin/audit-logs') });
    expect(screen.getByRole('heading', { level: 1, name: 'Audit & Activity Logs' })).toBeInTheDocument();
    expect(screen.getByText('Total Audit Trails')).toBeInTheDocument();
  });
});

