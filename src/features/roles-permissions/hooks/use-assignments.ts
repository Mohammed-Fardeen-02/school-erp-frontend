import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { AssignmentsApi } from '../api/assignments.api';
import { rbacQueryKeys } from '../utils/query-keys';
import type {
  AssignmentRecord,
  AssignRolePayload,
  RevokeAssignmentPayload,
  ListMembersFilters,
  ListMembersResult,
  CampusLocation,
} from '../types/assignments.types';

/**
 * Hook to discover active organization members with server-side search and pagination.
 */
export function useWorkspaceMembers(
  filters: ListMembersFilters = {},
  options?: { enabled?: boolean }
) {
  const activeWorkspaceId = useAuthStore((state) => state.activeWorkspaceId);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const queryKey = rbacQueryKeys.members(
    activeWorkspaceId,
    filters as Record<string, unknown>
  );

  return useQuery<ListMembersResult, Error>({
    queryKey,
    queryFn: async () => {
      return AssignmentsApi.listMembers(filters);
    },
    enabled:
      isAuthenticated &&
      Boolean(activeWorkspaceId) &&
      (options?.enabled !== undefined ? options.enabled : true),
    staleTime: 30 * 1000,
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook to retrieve active campuses/locations for the active organization.
 */
export function useOrganizationCampuses(options?: { enabled?: boolean }) {
  const activeWorkspaceId = useAuthStore((state) => state.activeWorkspaceId);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const queryKey = rbacQueryKeys.locations(activeWorkspaceId);

  return useQuery<CampusLocation[], Error>({
    queryKey,
    queryFn: async () => {
      return AssignmentsApi.getCampuses();
    },
    enabled:
      isAuthenticated &&
      Boolean(activeWorkspaceId) &&
      (options?.enabled !== undefined ? options.enabled : true),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to assign an active role to a user at organization or campus scope.
 */
export function useAssignRole() {
  const queryClient = useQueryClient();
  const activeWorkspaceId = useAuthStore((state) => state.activeWorkspaceId);
  const currentUser = useAuthStore((state) => state.user);

  return useMutation<AssignmentRecord, Error, AssignRolePayload>({
    mutationFn: async (payload) => {
      return AssignmentsApi.assignRole(payload);
    },
    onSuccess: (assignedRecord, variables) => {
      // Invalidate target user's assignments
      queryClient.invalidateQueries({
        queryKey: rbacQueryKeys.userAssignments(
          activeWorkspaceId,
          variables.userId,
          variables.locationId ?? null
        ),
      });

      // Invalidate general assignments list queries
      queryClient.invalidateQueries({
        queryKey: ['tenant', activeWorkspaceId ?? 'no-org', 'user-roles'],
      });

      // If assigning to self, refresh effective permissions immediately
      if (currentUser?.id === variables.userId) {
        queryClient.invalidateQueries({
          queryKey: rbacQueryKeys.effectivePermissions(
            activeWorkspaceId,
            variables.locationId ?? null
          ),
        });
      }
    },
  });
}

/**
 * Hook to revoke an active role assignment.
 */
export function useRevokeRole() {
  const queryClient = useQueryClient();
  const activeWorkspaceId = useAuthStore((state) => state.activeWorkspaceId);

  return useMutation<
    AssignmentRecord,
    Error,
    { assignmentId: string; payload: RevokeAssignmentPayload; userId?: string }
  >({
    mutationFn: async ({ assignmentId, payload }) => {
      return AssignmentsApi.revokeRole(assignmentId, payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['tenant', activeWorkspaceId ?? 'no-org', 'user-roles'],
      });

      if (variables.userId) {
        queryClient.invalidateQueries({
          queryKey: ['tenant', activeWorkspaceId ?? 'no-org', 'user-roles', variables.userId],
        });
      }
    },
  });
}

