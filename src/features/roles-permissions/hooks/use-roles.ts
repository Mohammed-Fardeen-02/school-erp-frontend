import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { RolesApi, type ListRolesResult } from '../api/roles.api';
import { rbacQueryKeys } from '../utils/query-keys';
import type {
  RoleDetail,
  CreateRolePayload,
  UpdateRolePayload,
  CloneTemplatePayload,
  RoleFilterOptions,
  DeleteRoleResponse,
} from '../types/roles.types';

/**
 * Hook to retrieve paginated and filtered roles for the active organization.
 */
export function useRolesList(filters: RoleFilterOptions = {}) {
  const activeWorkspaceId = useAuthStore((state) => state.activeWorkspaceId);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const queryKey = rbacQueryKeys.rolesList(
    activeWorkspaceId,
    filters as Record<string, unknown>
  );

  return useQuery<ListRolesResult, Error>({
    queryKey,
    queryFn: async () => {
      return RolesApi.listRoles(filters);
    },
    enabled: isAuthenticated && Boolean(activeWorkspaceId),
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to retrieve details for a single role.
 */
export function useRoleDetails(roleId: string | null | undefined) {
  const activeWorkspaceId = useAuthStore((state) => state.activeWorkspaceId);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const queryKey = rbacQueryKeys.roleDetail(activeWorkspaceId, roleId || 'none');

  return useQuery<RoleDetail, Error>({
    queryKey,
    queryFn: async () => {
      if (!roleId) throw new Error('Role ID is required');
      return RolesApi.getRoleById(roleId);
    },
    enabled: isAuthenticated && Boolean(activeWorkspaceId) && Boolean(roleId),
  });
}

/**
 * Hook to create a new custom tenant role.
 */
export function useCreateRole() {
  const queryClient = useQueryClient();
  const activeWorkspaceId = useAuthStore((state) => state.activeWorkspaceId);

  return useMutation<RoleDetail, Error, CreateRolePayload>({
    mutationFn: async (payload) => {
      return RolesApi.createRole(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: rbacQueryKeys.roles(activeWorkspaceId),
      });
    },
  });
}

/**
 * Hook to update an existing custom role's metadata.
 */
export function useUpdateRole() {
  const queryClient = useQueryClient();
  const activeWorkspaceId = useAuthStore((state) => state.activeWorkspaceId);

  return useMutation<RoleDetail, Error, { roleId: string; payload: UpdateRolePayload }>({
    mutationFn: async ({ roleId, payload }) => {
      return RolesApi.updateRole(roleId, payload);
    },
    onSuccess: (_, { roleId }) => {
      queryClient.invalidateQueries({
        queryKey: rbacQueryKeys.roles(activeWorkspaceId),
      });
      queryClient.invalidateQueries({
        queryKey: rbacQueryKeys.roleDetail(activeWorkspaceId, roleId),
      });
    },
  });
}

/**
 * Hook to activate or deactivate a custom role.
 */
export function useToggleRoleStatus() {
  const queryClient = useQueryClient();
  const activeWorkspaceId = useAuthStore((state) => state.activeWorkspaceId);

  return useMutation<RoleDetail, Error, { roleId: string; isActive: boolean }>({
    mutationFn: async ({ roleId, isActive }) => {
      return RolesApi.toggleRoleStatus(roleId, isActive);
    },
    onSuccess: (_, { roleId }) => {
      queryClient.invalidateQueries({
        queryKey: rbacQueryKeys.roles(activeWorkspaceId),
      });
      queryClient.invalidateQueries({
        queryKey: rbacQueryKeys.roleDetail(activeWorkspaceId, roleId),
      });
    },
  });
}

/**
 * Hook to clone an immutable system template into a custom tenant role.
 */
export function useCloneTemplate() {
  const queryClient = useQueryClient();
  const activeWorkspaceId = useAuthStore((state) => state.activeWorkspaceId);

  return useMutation<
    RoleDetail,
    Error,
    { templateId: string; payload: CloneTemplatePayload }
  >({
    mutationFn: async ({ templateId, payload }) => {
      return RolesApi.cloneTemplate(templateId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: rbacQueryKeys.roles(activeWorkspaceId),
      });
    },
  });
}

/**
 * Hook to delete or archive a custom role.
 */
export function useDeleteRole() {
  const queryClient = useQueryClient();
  const activeWorkspaceId = useAuthStore((state) => state.activeWorkspaceId);

  return useMutation<DeleteRoleResponse, Error, string>({
    mutationFn: async (roleId) => {
      return RolesApi.deleteRole(roleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: rbacQueryKeys.roles(activeWorkspaceId),
      });
    },
  });
}

/**
 * Hook to retrieve full capability matrix for a role against the active canonical catalog.
 */
export function useRolePermissionsMatrix(roleId: string | null | undefined) {
  const activeWorkspaceId = useAuthStore((state) => state.activeWorkspaceId);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const queryKey = rbacQueryKeys.rolePermissions(activeWorkspaceId, roleId || 'none');

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!roleId) throw new Error('Role ID is required');
      return RolesApi.getPermissionsMatrix(roleId);
    },
    enabled: isAuthenticated && Boolean(activeWorkspaceId) && Boolean(roleId),
  });
}

/**
 * Hook to atomically update a role's capability matrix.
 */
export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();
  const activeWorkspaceId = useAuthStore((state) => state.activeWorkspaceId);

  return useMutation<
    void,
    Error,
    { roleId: string; permissions: Array<{ nodeId?: string; nodeCode?: string; isGranted: boolean | null }> }
  >({
    mutationFn: async ({ roleId, permissions }) => {
      return RolesApi.updatePermissionsMatrix(roleId, { permissions });
    },
    onSuccess: (_, { roleId }) => {
      queryClient.invalidateQueries({
        queryKey: rbacQueryKeys.rolePermissions(activeWorkspaceId, roleId),
      });
      queryClient.invalidateQueries({
        queryKey: rbacQueryKeys.roleDetail(activeWorkspaceId, roleId),
      });
      queryClient.invalidateQueries({
        queryKey: rbacQueryKeys.effectivePermissions(activeWorkspaceId, null),
      });
    },
  });
}

