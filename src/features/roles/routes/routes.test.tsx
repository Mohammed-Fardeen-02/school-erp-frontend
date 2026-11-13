import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RolesRoutes } from './routes';
import { useAuthStore } from '@/stores/auth-store';
import * as usePermissionModule from '@/features/roles-permissions/hooks/use-permission';

vi.mock('@/features/roles-permissions/hooks/use-permission');
vi.mock('@/features/roles-permissions/hooks/use-roles', () => ({
  useRolesList: vi.fn().mockReturnValue({
    data: { roles: [] },
    isLoading: false,
    error: null,
  }),
  useCreateRole: vi.fn().mockReturnValue({
    mutateAsync: vi.fn(),
    isPending: false,
    error: null,
  }),
  useCloneTemplate: vi.fn().mockReturnValue({
    mutateAsync: vi.fn(),
    isPending: false,
    error: null,
  }),
  useDeleteRole: vi.fn().mockReturnValue({
    mutateAsync: vi.fn(),
    isPending: false,
    error: null,
  }),
  useToggleRoleStatus: vi.fn().mockReturnValue({
    mutateAsync: vi.fn(),
    isPending: false,
    error: null,
  }),
  useRoleDetails: vi.fn().mockReturnValue({
    data: null,
    isLoading: false,
    isError: false,
    error: null,
  }),
}));

describe('RolesRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      activeWorkspaceId: 'org-test-1',
      user: {
        id: 'u-admin',
        email: 'admin@school.edu',
        firstName: 'School',
        lastName: 'Admin',
        role: 'SCHOOL_ADMIN',
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

  it('renders RolesListPage on index route', () => {
    render(
      <MemoryRouter initialEntries={['/roles']}>
        <Routes>
          <Route path="/roles/*" element={<RolesRoutes />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Roles & Capability Matrix')).toBeInTheDocument();
  });

  it('renders NewRolePage on /new route', () => {
    render(
      <MemoryRouter initialEntries={['/roles/new']}>
        <Routes>
          <Route path="/roles/*" element={<RolesRoutes />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Create Custom Role')).toBeInTheDocument();
    expect(screen.getByText('Role Specifications')).toBeInTheDocument();
  });
});
