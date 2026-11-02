import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { PermissionGate } from './permission-gate';
import { PermissionsApi } from '../../api/permissions.api';
import { useAuthStore } from '@/stores/auth-store';

vi.mock('../../api/permissions.api', () => ({
  PermissionsApi: {
    getMyPermissions: vi.fn(),
  },
}));

function renderWithClient(ui: React.ReactElement, client: QueryClient) {
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe('PermissionGate Component', () => {
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

  it('renders children when the required permission is granted', async () => {
    vi.mocked(PermissionsApi.getMyPermissions).mockResolvedValueOnce({
      permissions: ['settings.roles_permissions.rbac.edit'],
      count: 1,
      computedAt: new Date().toISOString(),
    });

    renderWithClient(
      <PermissionGate permission="settings.roles_permissions.rbac.edit">
        <button data-testid="edit-button">Edit Role</button>
      </PermissionGate>,
      queryClient
    );

    // Should not render children during initial loading
    expect(screen.queryByTestId('edit-button')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('edit-button')).toBeInTheDocument();
    });
  });

  it('renders fallback when permission is not granted', async () => {
    vi.mocked(PermissionsApi.getMyPermissions).mockResolvedValueOnce({
      permissions: ['settings.roles_permissions.rbac.view'],
      count: 1,
      computedAt: new Date().toISOString(),
    });

    renderWithClient(
      <PermissionGate
        permission="settings.roles_permissions.rbac.delete"
        fallback={<span data-testid="fallback-text">Read Only</span>}
      >
        <button data-testid="delete-button">Delete Role</button>
      </PermissionGate>,
      queryClient
    );

    await waitFor(() => {
      expect(screen.getByTestId('fallback-text')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('delete-button')).not.toBeInTheDocument();
  });

  it('renders null fallback by default when permission is denied', async () => {
    vi.mocked(PermissionsApi.getMyPermissions).mockResolvedValueOnce({
      permissions: ['academics.view'],
      count: 1,
      computedAt: new Date().toISOString(),
    });

    const { container } = renderWithClient(
      <PermissionGate permission="settings.roles_permissions.rbac.delete">
        <button data-testid="delete-button">Delete Role</button>
      </PermissionGate>,
      queryClient
    );

    await waitFor(() => {
      expect(screen.queryByTestId('delete-button')).not.toBeInTheDocument();
    });

    expect(container).toBeEmptyDOMElement();
  });

  it('renders loadingFallback while effective permissions are loading and never flashes children', () => {
    vi.mocked(PermissionsApi.getMyPermissions).mockReturnValue(new Promise(() => {}));

    renderWithClient(
      <PermissionGate
        permission="settings.roles_permissions.rbac.edit"
        loadingFallback={<div data-testid="skeleton-loader">Loading...</div>}
      >
        <button data-testid="edit-button">Edit Role</button>
      </PermissionGate>,
      queryClient
    );

    expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument();
    expect(screen.queryByTestId('edit-button')).not.toBeInTheDocument();
  });

  it('fails closed on API error and renders fallback instead of children', async () => {
    vi.mocked(PermissionsApi.getMyPermissions).mockRejectedValueOnce(
      new Error('Network error')
    );

    renderWithClient(
      <PermissionGate
        permission="settings.roles_permissions.rbac.edit"
        fallback={<span data-testid="error-fallback">Access Unavailable</span>}
      >
        <button data-testid="edit-button">Edit Role</button>
      </PermissionGate>,
      queryClient
    );

    await waitFor(() => {
      expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('edit-button')).not.toBeInTheDocument();
  });
});

