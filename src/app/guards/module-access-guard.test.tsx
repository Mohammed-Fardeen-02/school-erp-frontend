import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ModuleAccessGuard } from './module-access-guard';
import { useAuthStore } from '@/stores/auth-store';
import * as usePermissionModule from '@/features/roles-permissions/hooks/use-permission';
import * as useEffectivePermissionsModule from '@/features/roles-permissions/hooks/use-effective-permissions';

describe('ModuleAccessGuard (Stage W1.2)', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default setup: Authenticated user in active workspace with academics & settings subscribed
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        id: 'u-1',
        email: 'user@school.edu',
        role: 'TEACHER',
      },
      workspaces: [
        {
          id: 'ws-1',
          name: "St. Mary's High School",
          permittedModules: ['academics', 'settings'],
        },
      ],
      activeWorkspaceId: 'ws-1',
    });

    // Default permissions mock: academics granted
    vi.spyOn(usePermissionModule, 'usePermission').mockReturnValue({
      hasPermission: true,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
      checkPermission: (code: string) => code === 'academics' || code === 'settings',
    });

    vi.spyOn(useEffectivePermissionsModule, 'useEffectivePermissions').mockReturnValue({
      permissions: ['academics', 'settings'],
      permissionsSet: new Set(['academics', 'settings']),
      count: 2,
      computedAt: new Date().toISOString(),
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
      refetch: vi.fn(),
    });
  });

  // 1. Unauthenticated access redirects to /login
  it('1. redirects unauthenticated users to /login', () => {
    useAuthStore.setState({
      isAuthenticated: false,
      user: null,
      activeWorkspaceId: null,
    });

    render(
      <MemoryRouter initialEntries={['/app/academics']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/app/:moduleId"
            element={
              <ModuleAccessGuard>
                <div>Protected Module Content</div>
              </ModuleAccessGuard>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Module Content')).not.toBeInTheDocument();
  });

  // 2. Unsubscribed module shows "Module Not Subscribed" denial
  it('2. blocks access with distinct "Module Not Subscribed" denial when organization lacks module entitlement', () => {
    // ws-1 only subscribes to 'academics' and 'settings', NOT 'fees'
    render(
      <MemoryRouter initialEntries={['/app/fees']}>
        <Routes>
          <Route
            path="/app/:moduleId"
            element={
              <ModuleAccessGuard>
                <div>Protected Module Content</div>
              </ModuleAccessGuard>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('module-guard-unsubscribed')).toBeInTheDocument();
    expect(screen.getByText('Module Not Subscribed')).toBeInTheDocument();
    expect(
      screen.getByText(/is not included in the active subscription package/i)
    ).toBeInTheDocument();
    expect(screen.queryByText('Protected Module Content')).not.toBeInTheDocument();
  });

  // 3. Subscribed but unauthorized user shows "Access Restricted" denial
  it('3. blocks access with distinct "Access Restricted" denial when user lacks effective RBAC permission', () => {
    // Academics is subscribed by org, but user lacks 'academics' permission
    vi.spyOn(usePermissionModule, 'usePermission').mockReturnValue({
      hasPermission: false,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
      checkPermission: () => false,
    });

    vi.spyOn(useEffectivePermissionsModule, 'useEffectivePermissions').mockReturnValue({
      permissions: [],
      permissionsSet: new Set(),
      count: 0,
      computedAt: new Date().toISOString(),
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/app/academics']}>
        <Routes>
          <Route
            path="/app/:moduleId"
            element={
              <ModuleAccessGuard>
                <div>Protected Module Content</div>
              </ModuleAccessGuard>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('module-guard-unauthorized')).toBeInTheDocument();
    expect(screen.getByText('Access Restricted')).toBeInTheDocument();
    expect(
      screen.getByText(/does not possess the required RBAC capability/i)
    ).toBeInTheDocument();
    expect(screen.queryByText('Protected Module Content')).not.toBeInTheDocument();
  });

  // 4. Authorized user: Both subscribed and permitted allows route
  it('4. renders protected content when both organization subscription and user permission conditions are satisfied', () => {
    render(
      <MemoryRouter initialEntries={['/app/academics']}>
        <Routes>
          <Route
            path="/app/:moduleId"
            element={
              <ModuleAccessGuard>
                <div>Protected Module Content</div>
              </ModuleAccessGuard>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Module Content')).toBeInTheDocument();
  });

  // 5. Permissions loading shows loading state
  it('5. displays dedicated loading spinner and does not allow prematurely while permissions are loading', () => {
    vi.spyOn(useEffectivePermissionsModule, 'useEffectivePermissions').mockReturnValue({
      permissions: [],
      permissionsSet: new Set(),
      count: 0,
      computedAt: null,
      isLoading: true,
      isError: false,
      isSuccess: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/app/academics']}>
        <Routes>
          <Route
            path="/app/:moduleId"
            element={
              <ModuleAccessGuard>
                <div>Protected Module Content</div>
              </ModuleAccessGuard>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('module-guard-loading')).toBeInTheDocument();
    expect(screen.getByText('Verifying module authorization...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Module Content')).not.toBeInTheDocument();
  });

  // 6. Permission API failure fails closed
  it('6. fails closed with Authorization Error when permission request fails', () => {
    vi.spyOn(useEffectivePermissionsModule, 'useEffectivePermissions').mockReturnValue({
      permissions: [],
      permissionsSet: new Set(),
      count: 0,
      computedAt: null,
      isLoading: false,
      isError: true,
      isSuccess: false,
      error: new Error('Network timeout'),
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/app/academics']}>
        <Routes>
          <Route
            path="/app/:moduleId"
            element={
              <ModuleAccessGuard>
                <div>Protected Module Content</div>
              </ModuleAccessGuard>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('module-guard-error')).toBeInTheDocument();
    expect(screen.getByText('Authorization Error')).toBeInTheDocument();
    expect(screen.getByText(/Network timeout/i)).toBeInTheDocument();
    expect(screen.queryByText('Protected Module Content')).not.toBeInTheDocument();
  });

  // 7. Platform administrator universal bypass
  it('7. preserves platform administrator universal authorization boundary (SUPER_ADMIN / PLATFORM userType)', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        id: 'u-platform-super',
        email: 'super@gov.org',
        role: 'SUPER_ADMIN',
        userType: 'PLATFORM',
      },
      workspaces: [],
      activeWorkspaceId: null,
    });

    // Even if checkPermission returns false and no permissions are granted
    vi.spyOn(usePermissionModule, 'usePermission').mockReturnValue({
      hasPermission: true,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
      checkPermission: () => false,
    });

    render(
      <MemoryRouter initialEntries={['/app/fees']}>
        <Routes>
          <Route
            path="/app/:moduleId"
            element={
              <ModuleAccessGuard>
                <div>Protected Module Content</div>
              </ModuleAccessGuard>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Module Content')).toBeInTheDocument();
  });

  // 8. Invalid module ID renders Module Not Found
  it('8. renders distinct "Module Not Found" 404 state when moduleId does not exist in ERP catalog', () => {
    render(
      <MemoryRouter initialEntries={['/app/invalid-module-xyz']}>
        <Routes>
          <Route
            path="/app/:moduleId"
            element={
              <ModuleAccessGuard>
                <div>Protected Module Content</div>
              </ModuleAccessGuard>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('module-guard-not-found')).toBeInTheDocument();
    expect(screen.getByText('Module Not Found')).toBeInTheDocument();
    expect(screen.getByText(/"invalid-module-xyz"/)).toBeInTheDocument();
    expect(screen.queryByText('Protected Module Content')).not.toBeInTheDocument();
  });

  // 9. Explicit moduleId prop support (e.g. for /admin/* and /app/academics/branches)
  it('9. supports explicit moduleId prop for directly wrapped routes', () => {
    render(
      <MemoryRouter initialEntries={['/admin/users']}>
        <Routes>
          <Route
            path="/admin/*"
            element={
              <ModuleAccessGuard moduleId="settings">
                <div>Admin Feature Content</div>
              </ModuleAccessGuard>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Admin Feature Content')).toBeInTheDocument();
  });
});

