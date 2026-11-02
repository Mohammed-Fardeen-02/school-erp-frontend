import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { RoutePermissionGuard } from './route-permission-guard';
import { PermissionsApi } from '../../api/permissions.api';
import { useAuthStore } from '@/stores/auth-store';

vi.mock('../../api/permissions.api', () => ({
  PermissionsApi: {
    getMyPermissions: vi.fn(),
  },
}));

function renderGuard(ui: React.ReactElement, client: QueryClient) {
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={['/test']}>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
}

describe('RoutePermissionGuard Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });

    useAuthStore.setState({
      isAuthenticated: true,
      activeWorkspaceId: 'org-test-1',
      activeLocationId: null,
    });
  });

  it('renders children when the user possesses the route permission', async () => {
    vi.mocked(PermissionsApi.getMyPermissions).mockResolvedValueOnce({
      permissions: ['settings.roles_permissions.rbac.view'],
      count: 1,
      computedAt: new Date().toISOString(),
    });

    renderGuard(
      <RoutePermissionGuard permission="settings.roles_permissions.rbac.view">
        <div data-testid="protected-route-content">Protected Roles Dashboard</div>
      </RoutePermissionGuard>,
      queryClient
    );

    await waitFor(() => {
      expect(screen.getByTestId('protected-route-content')).toBeInTheDocument();
    });
  });

  it('renders institutional access restricted fallback when permission is denied', async () => {
    vi.mocked(PermissionsApi.getMyPermissions).mockResolvedValueOnce({
      permissions: ['academics.view'],
      count: 1,
      computedAt: new Date().toISOString(),
    });

    renderGuard(
      <RoutePermissionGuard permission="settings.roles_permissions.rbac.view">
        <div data-testid="protected-route-content">Protected Roles Dashboard</div>
      </RoutePermissionGuard>,
      queryClient
    );

    await waitFor(() => {
      expect(screen.getByTestId('route-guard-forbidden')).toBeInTheDocument();
    });

    expect(screen.getByText('Access Restricted')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-route-content')).not.toBeInTheDocument();
  });

  it('renders custom forbiddenFallback if provided', async () => {
    vi.mocked(PermissionsApi.getMyPermissions).mockResolvedValueOnce({
      permissions: [],
      count: 0,
      computedAt: new Date().toISOString(),
    });

    renderGuard(
      <RoutePermissionGuard
        permission="settings.roles_permissions.rbac.view"
        forbiddenFallback={<div data-testid="custom-denied">Access Denied Custom View</div>}
      >
        <div data-testid="protected-route-content">Protected Dashboard</div>
      </RoutePermissionGuard>,
      queryClient
    );

    await waitFor(() => {
      expect(screen.getByTestId('custom-denied')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('protected-route-content')).not.toBeInTheDocument();
  });

  it('displays loading spinner while permissions are resolving', () => {
    vi.mocked(PermissionsApi.getMyPermissions).mockReturnValue(new Promise(() => {}));

    renderGuard(
      <RoutePermissionGuard permission="settings.roles_permissions.rbac.view">
        <div data-testid="protected-route-content">Protected Dashboard</div>
      </RoutePermissionGuard>,
      queryClient
    );

    expect(screen.getByTestId('route-guard-loading')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-route-content')).not.toBeInTheDocument();
  });
});

