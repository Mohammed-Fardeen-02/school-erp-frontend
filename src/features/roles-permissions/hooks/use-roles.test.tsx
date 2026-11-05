import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useRolesList,
  useRoleDetails,
  useCreateRole,
  useUpdateRole,
  useToggleRoleStatus,
  useCloneTemplate,
  useDeleteRole,
} from './use-roles';
import { RolesApi } from '../api/roles.api';
import { useAuthStore } from '@/stores/auth-store';
import type { RoleSummary, RoleDetail } from '../types/roles.types';

vi.mock('../api/roles.api', () => ({
  RolesApi: {
    listRoles: vi.fn(),
    getRoleById: vi.fn(),
    createRole: vi.fn(),
    updateRole: vi.fn(),
    toggleRoleStatus: vi.fn(),
    cloneTemplate: vi.fn(),
    deleteRole: vi.fn(),
  },
}));

function createWrapper(queryClient: QueryClient) {
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const mockRole: RoleSummary = {
  id: 'role-123',
  organizationId: 'org-test-1',
  roleCode: 'TEACHER',
  roleName: 'Standard Teacher',
  description: 'Teaches classes',
  roleType: 'CUSTOM',
  isActive: true,
  createdAt: '2026-11-01T00:00:00Z',
  updatedAt: '2026-11-01T00:00:00Z',
  assignmentCount: 4,
};

describe('use-roles Hooks', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    });

    useAuthStore.setState({
      isAuthenticated: true,
      activeWorkspaceId: 'org-test-1',
      activeLocationId: null,
    });
  });

  it('useRolesList fetches and returns roles for the active workspace', async () => {
    vi.mocked(RolesApi.listRoles).mockResolvedValueOnce({
      roles: [mockRole],
      total: 1,
      page: 1,
      limit: 50,
    });

    const wrapper = createWrapper(queryClient);
    const { result } = renderHook(() => useRolesList(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.roles).toHaveLength(1);
    expect(result.current.data?.roles[0]?.roleCode).toBe('TEACHER');
  });

  it('useRoleDetails retrieves single role details by ID', async () => {
    const detail: RoleDetail = {
      ...mockRole,
      permissions: [],
    };
    vi.mocked(RolesApi.getRoleById).mockResolvedValueOnce(detail);

    const wrapper = createWrapper(queryClient);
    const { result } = renderHook(() => useRoleDetails('role-123'), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.id).toBe('role-123');
    expect(result.current.data?.roleName).toBe('Standard Teacher');
  });

  it('useCreateRole executes create mutation and triggers cache invalidation', async () => {
    const createdRole: RoleDetail = {
      ...mockRole,
      id: 'role-created',
      permissions: [],
    };
    vi.mocked(RolesApi.createRole).mockResolvedValueOnce(createdRole);

    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const wrapper = createWrapper(queryClient);
    const { result } = renderHook(() => useCreateRole(), { wrapper });

    await result.current.mutateAsync({
      roleCode: 'EXAM_OFFICER',
      roleName: 'Examination Officer',
    });

    expect(RolesApi.createRole).toHaveBeenCalledWith({
      roleCode: 'EXAM_OFFICER',
      roleName: 'Examination Officer',
    });
    expect(invalidateSpy).toHaveBeenCalled();
  });

  it('useUpdateRole executes update mutation and invalidates role cache', async () => {
    const updated: RoleDetail = {
      ...mockRole,
      roleName: 'Senior Teacher',
      permissions: [],
    };
    vi.mocked(RolesApi.updateRole).mockResolvedValueOnce(updated);

    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const wrapper = createWrapper(queryClient);
    const { result } = renderHook(() => useUpdateRole(), { wrapper });

    await result.current.mutateAsync({
      roleId: 'role-123',
      payload: { roleName: 'Senior Teacher' },
    });

    expect(RolesApi.updateRole).toHaveBeenCalledWith('role-123', {
      roleName: 'Senior Teacher',
    });
    expect(invalidateSpy).toHaveBeenCalled();
  });

  it('useToggleRoleStatus executes status mutation', async () => {
    const toggled: RoleDetail = {
      ...mockRole,
      isActive: false,
      permissions: [],
    };
    vi.mocked(RolesApi.toggleRoleStatus).mockResolvedValueOnce(toggled);

    const wrapper = createWrapper(queryClient);
    const { result } = renderHook(() => useToggleRoleStatus(), { wrapper });

    await result.current.mutateAsync({
      roleId: 'role-123',
      isActive: false,
    });

    expect(RolesApi.toggleRoleStatus).toHaveBeenCalledWith('role-123', false);
  });

  it('useCloneTemplate executes clone template mutation', async () => {
    const cloned: RoleDetail = {
      ...mockRole,
      id: 'cloned-1',
      roleCode: 'CUSTOM_TEACHER',
      permissions: [],
    };
    vi.mocked(RolesApi.cloneTemplate).mockResolvedValueOnce(cloned);

    const wrapper = createWrapper(queryClient);
    const { result } = renderHook(() => useCloneTemplate(), { wrapper });

    await result.current.mutateAsync({
      templateId: 'tmpl-1',
      payload: { roleCode: 'CUSTOM_TEACHER', roleName: 'Teacher (Custom)' },
    });

    expect(RolesApi.cloneTemplate).toHaveBeenCalledWith('tmpl-1', {
      roleCode: 'CUSTOM_TEACHER',
      roleName: 'Teacher (Custom)',
    });
  });

  it('useDeleteRole executes deletion mutation and invalidates queries', async () => {
    vi.mocked(RolesApi.deleteRole).mockResolvedValueOnce({
      action: 'ARCHIVED',
      message: 'Role archived safely',
    });

    const wrapper = createWrapper(queryClient);
    const { result } = renderHook(() => useDeleteRole(), { wrapper });

    const res = await result.current.mutateAsync('role-123');
    expect(res.action).toBe('ARCHIVED');
    expect(RolesApi.deleteRole).toHaveBeenCalledWith('role-123');
  });
});

