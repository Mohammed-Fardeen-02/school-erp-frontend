import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { PermissionsApi } from '../api/permissions.api';
import { rbacQueryKeys } from '../utils/query-keys';
import type { CanonicalTreeNode } from '../types/permissions.types';

/**
 * Hook to retrieve the canonical 4-level permission tree catalog.
 * Cached for 5 minutes since platform canonical permissions are static.
 */
export function usePermissionTree() {
  const activeWorkspaceId = useAuthStore((state) => state.activeWorkspaceId);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const queryKey = rbacQueryKeys.permissionTree(activeWorkspaceId);

  return useQuery<CanonicalTreeNode[], Error>({
    queryKey,
    queryFn: async () => {
      return PermissionsApi.getPermissionTree();
    },
    enabled: isAuthenticated && Boolean(activeWorkspaceId),
    staleTime: 5 * 60 * 1000,
  });
}
