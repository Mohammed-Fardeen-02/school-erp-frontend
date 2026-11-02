import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { PermissionsApi } from '../api/permissions.api';
import { rbacQueryKeys } from '../utils/query-keys';
import type { EffectivePermissionsResponse } from '../types/permissions.types';

export interface UseEffectivePermissionsResult {
  permissions: string[];
  permissionsSet: Set<string>;
  count: number;
  computedAt: string | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: Error | null;
  refetch: () => Promise<unknown>;
}

const EMPTY_PERMISSIONS: string[] = [];
const EMPTY_SET = new Set<string>();

/**
 * Hook to retrieve and cache the authenticated caller's effective permissions.
 *
 * Scoped strictly by active organization and active campus context.
 * Automatically switches cache buckets and refetches when campus or workspace changes.
 */
export function useEffectivePermissions(): UseEffectivePermissionsResult {
  const activeWorkspaceId = useAuthStore((state) => state.activeWorkspaceId);
  const activeLocationId = useAuthStore((state) => state.activeLocationId);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const queryKey = rbacQueryKeys.effectivePermissions(activeWorkspaceId, activeLocationId);

  const query = useQuery<EffectivePermissionsResponse, Error>({
    queryKey,
    queryFn: async () => {
      return PermissionsApi.getMyPermissions();
    },
    enabled: isAuthenticated && Boolean(activeWorkspaceId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes cache retention
  });

  const permissions = query.data?.permissions ?? EMPTY_PERMISSIONS;

  const permissionsSet = useMemo(() => {
    if (!query.data?.permissions || query.data.permissions.length === 0) {
      return EMPTY_SET;
    }
    return new Set(query.data.permissions);
  }, [query.data?.permissions]);

  return {
    permissions,
    permissionsSet,
    count: query.data?.count ?? 0,
    computedAt: query.data?.computedAt ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    isSuccess: query.isSuccess,
    error: query.error ?? null,
    refetch: query.refetch,
  };
}
