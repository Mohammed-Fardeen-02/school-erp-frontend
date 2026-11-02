import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePermission } from './use-permission';
import { PermissionsApi } from '../api/permissions.api';
import { useAuthStore } from '@/stores/auth-store';

vi.mock('../api/permissions.api', () => ({
  PermissionsApi: {
    getMyPermissions: vi.fn(),
  },
}));

function createTestWrapper(queryClient: QueryClient) {
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('usePermission Hook', () => {
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

    // Reset Auth Store state
    useAuthStore.setState({
      isAuthenticated: true,
      activeWorkspaceId: 'org-test-1',
      activeLocationId: null,
    });
  });

  it('evaluates hasPermission as true when permission is in caller effective set', async () => {
    vi.mocked(PermissionsApi.getMyPermissions).mockResolvedValueOnce({
      permissions: [
        'settings.roles_permissions.rbac.view',
        'settings.roles_permissions.rbac.create',
      ],
      count: 2,
      computedAt: new Date().toISOString(),
    });

    const wrapper = createTestWrapper(queryClient);
    const { result } = renderHook(
      () => usePermission('settings.roles_permissions.rbac.view'),
      { wrapper }
    );

    // Initial loading state (fail-closed)
    expect(result.current.isLoading).toBe(true);
    expect(result.current.hasPermission).toBe(false);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasPermission).toBe(true);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.checkPermission('settings.roles_permissions.rbac.create')).toBe(true);
  });

  it('evaluates hasPermission as false when permission is missing from effective set', async () => {
    vi.mocked(PermissionsApi.getMyPermissions).mockResolvedValueOnce({
      permissions: ['settings.roles_permissions.rbac.view'],
      count: 1,
      computedAt: new Date().toISOString(),
    });

    const wrapper = createTestWrapper(queryClient);
    const { result } = renderHook(
      () => usePermission('settings.roles_permissions.rbac.delete'),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasPermission).toBe(false);
    expect(result.current.checkPermission('settings.roles_permissions.rbac.delete')).toBe(false);
  });

  it('fails closed when effective permissions array is empty', async () => {
    vi.mocked(PermissionsApi.getMyPermissions).mockResolvedValueOnce({
      permissions: [],
      count: 0,
      computedAt: new Date().toISOString(),
    });

    const wrapper = createTestWrapper(queryClient);
    const { result } = renderHook(
      () => usePermission('settings.roles_permissions.rbac.view'),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasPermission).toBe(false);
    expect(result.current.checkPermission('settings.roles_permissions.rbac.view')).toBe(false);
  });

  it('fails closed while query is in loading state', () => {
    // Return a pending promise that never resolves during this assertion
    vi.mocked(PermissionsApi.getMyPermissions).mockReturnValue(new Promise(() => {}));

    const wrapper = createTestWrapper(queryClient);
    const { result } = renderHook(
      () => usePermission('settings.roles_permissions.rbac.view'),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.hasPermission).toBe(false);
    expect(result.current.checkPermission('settings.roles_permissions.rbac.view')).toBe(false);
  });

  it('fails closed and exposes error when API call fails', async () => {
    const apiError = new Error('HTTP 403 Forbidden: Tenant inactive');
    vi.mocked(PermissionsApi.getMyPermissions).mockRejectedValueOnce(apiError);

    const wrapper = createTestWrapper(queryClient);
    const { result } = renderHook(
      () => usePermission('settings.roles_permissions.rbac.view'),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.hasPermission).toBe(false);
    expect(result.current.error).toBe(apiError);
    expect(result.current.checkPermission('settings.roles_permissions.rbac.view')).toBe(false);
  });

  it('dynamically adapts when campus or workspace context changes', async () => {
    // 1. Initial org-wide permissions
    vi.mocked(PermissionsApi.getMyPermissions).mockResolvedValueOnce({
      permissions: ['settings.roles_permissions.rbac.view'],
      count: 1,
      computedAt: new Date().toISOString(),
    });

    const wrapper = createTestWrapper(queryClient);
    const { result } = renderHook(
      () => usePermission('academics.classes.manage'),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.hasPermission).toBe(false);

    // 2. Switch campus context to Campus A where user has academics.classes.manage
    vi.mocked(PermissionsApi.getMyPermissions).mockResolvedValueOnce({
      permissions: [
        'settings.roles_permissions.rbac.view',
        'academics.classes.manage',
      ],
      count: 2,
      computedAt: new Date().toISOString(),
    });

    act(() => {
      useAuthStore.setState({
        activeWorkspaceId: 'org-test-1',
        activeLocationId: 'campus-a',
      });
    });

    await waitFor(() => {
      expect(result.current.hasPermission).toBe(true);
    });
    expect(result.current.checkPermission('academics.classes.manage')).toBe(true);
  });
});
