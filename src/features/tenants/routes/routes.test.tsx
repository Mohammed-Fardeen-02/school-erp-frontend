import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { TenantsRoutes } from './routes';
import { useAuthStore } from '@/stores/auth-store';
import * as usePermissionModule from '@/features/roles-permissions/hooks/use-permission';

vi.mock('@/features/roles-permissions/hooks/use-permission');
vi.mock('../hooks/use-tenants', () => ({
  useTenants: vi.fn().mockReturnValue({
    data: { items: [], total: 0, page: 1, limit: 10, totalPages: 1 },
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
  useUpdateTenantStatus: vi.fn().mockReturnValue({
    mutateAsync: vi.fn(),
    isPending: false,
    error: null,
  }),
  useCreateTenant: vi.fn().mockReturnValue({
    mutateAsync: vi.fn(),
    isPending: false,
    error: null,
  }),
  useTenant: vi.fn().mockReturnValue({
    data: null,
    isLoading: false,
  }),
  useTenantModules: vi.fn().mockReturnValue({
    data: [],
    isLoading: false,
  }),
  useUpdateTenant: vi.fn().mockReturnValue({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useUpdateTenantModules: vi.fn().mockReturnValue({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}));

describe('TenantsRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      user: {
        id: 'super-admin-1',
        email: 'super@system.local',
        firstName: 'Super',
        lastName: 'Admin',
        role: 'SUPER_ADMIN',
      },
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

  it('renders TenantsListPage on index route for authorized super admin', () => {
    render(
      <MemoryRouter initialEntries={['/tenants']}>
        <Routes>
          <Route path="/tenants/*" element={<TenantsRoutes />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Educational Institutions')).toBeInTheDocument();
    expect(screen.getByText('Provision School')).toBeInTheDocument();
  });

  it('renders NewTenantPage on /new route', () => {
    render(
      <MemoryRouter initialEntries={['/tenants/new']}>
        <Routes>
          <Route path="/tenants/*" element={<TenantsRoutes />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Provision School Institution')).toBeInTheDocument();
    expect(screen.getByText('Institution Identity & Branding')).toBeInTheDocument();
  });
});
