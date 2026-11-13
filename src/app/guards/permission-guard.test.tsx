import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PermissionGuard } from './permission-guard';
import * as usePermissionModule from '@/features/roles-permissions/hooks/use-permission';
import { useAuthStore } from '@/stores/auth-store';

vi.mock('@/features/roles-permissions/hooks/use-permission');

describe('PermissionGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      user: {
        id: 'u-1',
        email: 'user@test.edu',
        firstName: 'Test',
        lastName: 'User',
        role: 'TEACHER',
      },
    });
  });

  it('renders loading spinner when permission resolution is in progress', () => {
    vi.spyOn(usePermissionModule, 'usePermission').mockReturnValue({
      hasPermission: false,
      isLoading: true,
      isError: false,
      isSuccess: false,
      error: null,
      checkPermission: () => false,
    });

    render(
      <MemoryRouter>
        <PermissionGuard permission="organizations.manage">
          <div>Protected Content</div>
        </PermissionGuard>
      </MemoryRouter>
    );

    expect(screen.getByTestId('permission-guard-loading')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children when explicit permission is granted', () => {
    vi.spyOn(usePermissionModule, 'usePermission').mockReturnValue({
      hasPermission: true,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
      checkPermission: () => true,
    });

    render(
      <MemoryRouter>
        <PermissionGuard permission="settings.roles.manage">
          <div>Protected Content</div>
        </PermissionGuard>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('renders children automatically if user is SUPER_ADMIN even if hasPermission is false', () => {
    useAuthStore.setState({
      user: {
        id: 'sa-1',
        email: 'super@system.local',
        firstName: 'Super',
        lastName: 'Admin',
        role: 'SUPER_ADMIN',
      },
    });

    vi.spyOn(usePermissionModule, 'usePermission').mockReturnValue({
      hasPermission: false,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
      checkPermission: () => false,
    });

    render(
      <MemoryRouter>
        <PermissionGuard permission="organizations.manage">
          <div>Super Admin Allowed Content</div>
        </PermissionGuard>
      </MemoryRouter>
    );

    expect(screen.getByText('Super Admin Allowed Content')).toBeInTheDocument();
  });

  it('renders access restricted card when permission is denied and no custom fallback', () => {
    vi.spyOn(usePermissionModule, 'usePermission').mockReturnValue({
      hasPermission: false,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
      checkPermission: () => false,
    });

    render(
      <MemoryRouter>
        <PermissionGuard permission="organizations.manage">
          <div>Should Not Show</div>
        </PermissionGuard>
      </MemoryRouter>
    );

    expect(screen.getByTestId('permission-guard-forbidden')).toBeInTheDocument();
    expect(screen.getByText('Access Restricted')).toBeInTheDocument();
    expect(screen.queryByText('Should Not Show')).not.toBeInTheDocument();
  });

  it('renders custom fallback when provided and permission is denied', () => {
    vi.spyOn(usePermissionModule, 'usePermission').mockReturnValue({
      hasPermission: false,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
      checkPermission: () => false,
    });

    render(
      <MemoryRouter>
        <PermissionGuard
          module="roles"
          action="view"
          fallback={<div>Custom Forbidden Notice</div>}
        >
          <div>Should Not Show</div>
        </PermissionGuard>
      </MemoryRouter>
    );

    expect(screen.getByText('Custom Forbidden Notice')).toBeInTheDocument();
    expect(screen.queryByText('Should Not Show')).not.toBeInTheDocument();
  });
});

