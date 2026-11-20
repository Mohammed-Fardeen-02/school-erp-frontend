import { useState, useCallback, useMemo, useContext } from 'react';
import { useQuery, QueryClientContext } from '@tanstack/react-query';
import { queryClient as defaultQueryClient } from '@/lib/query-client';
import { useAuthStore } from '@/stores/auth-store';
import { WorkspaceApi } from '../api/workspace.api';
import { apiClient } from '@/lib/api-client';
import { rbacQueryKeys } from '@/features/roles-permissions/utils/query-keys';
import { useToast } from '@/components/feedback/toast';
import type { WorkspaceLocationSummary } from '../types/workspace.types';

export interface UseCampusContextResult {
  campuses: WorkspaceLocationSummary[];
  activeCampus: WorkspaceLocationSummary | null;
  activeLocationId: string | null;
  isSingleCampus: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isSwitching: boolean;
  switchCampus: (targetLocationId: string) => Promise<boolean>;
  refetch: () => void;
}

export const WORKSPACE_QUERY_KEYS = {
  myOrganizations: ['workspace', 'my-organizations'] as const,
};

/**
 * Enterprise hook to discover authorized campuses and orchestrate
 * transactional campus context switching with strict isolation.
 */
export function useCampusContext(): UseCampusContextResult {
  const toast = useToast();
  const contextClient = useContext(QueryClientContext);
  const clientToUse = contextClient ?? defaultQueryClient;

  const {
    activeWorkspaceId,
    activeLocationId,
    getActiveWorkspace,
    setActiveLocation,
    isAuthenticated,
  } = useAuthStore();

  const [isSwitching, setIsSwitching] = useState(false);
  const activeWorkspace = getActiveWorkspace();

  // Query authorized organizations and campuses from backend
  const {
    data: organizations,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(
    {
      queryKey: WORKSPACE_QUERY_KEYS.myOrganizations,
      queryFn: async () => {
        return WorkspaceApi.getMyOrganizations();
      },
      enabled: isAuthenticated && Boolean(activeWorkspaceId),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
    clientToUse
  );

  // Extract authorized active campuses for the current organization
  const campuses = useMemo<WorkspaceLocationSummary[]>(() => {
    const activeOrg = organizations?.find((o) => o.id === activeWorkspaceId);
    const apiCampuses = activeOrg?.campuses?.filter((c) => c.isActive) || [];

    if (apiCampuses.length > 0) {
      return apiCampuses;
    }

    // Graceful fallback when API data is not yet cached or running in mock/test
    if (activeWorkspace) {
      return [
        {
          id: activeLocationId || 'main-campus',
          code: 'MAIN',
          name: activeWorkspace.campusName || 'Main Campus',
          locationType: 'MAIN_CAMPUS',
          isMainCampus: true,
          isActive: true,
        },
      ];
    }

    return [];
  }, [organizations, activeWorkspaceId, activeWorkspace, activeLocationId]);

  // Resolve currently active campus
  const activeCampus = useMemo<WorkspaceLocationSummary | null>(() => {
    if (campuses.length === 0) return null;

    if (activeLocationId) {
      const match = campuses.find((c) => c.id === activeLocationId);
      if (match) return match;
    }

    const mainCampus = campuses.find((c) => c.isMainCampus);
    return mainCampus || campuses[0] || null;
  }, [campuses, activeLocationId]);

  // Context switching orchestrator
  const switchCampus = useCallback(
    async (targetLocationId: string): Promise<boolean> => {
      // 1. Guard against duplicate or in-flight requests
      if (isSwitching) {
        return false;
      }

      if (!activeWorkspaceId) {
        return false;
      }

      // 2. Same-campus selection: no-op, do not trigger API or cache invalidation
      if (targetLocationId === activeLocationId) {
        return true;
      }

      const targetCampus = campuses.find((c) => c.id === targetLocationId);
      const targetName = targetCampus?.name || 'Selected Campus';

      setIsSwitching(true);

      try {
        // 3. Submit selected organization and campus through the existing context API
        const response = await WorkspaceApi.selectContext({
          organizationId: activeWorkspaceId,
          locationId: targetLocationId,
        });

        const confirmedLocationId = response?.location?.id || targetLocationId;
        const confirmedLocationName = response?.location?.name || targetName;

        // 4. Update authentication store with authoritative response
        setActiveLocation(confirmedLocationId, confirmedLocationName);

        // 5. Ensure subsequent API requests carry the newly selected X-Location-Id
        apiClient.setTenantContext(activeWorkspaceId, confirmedLocationId);

        // 6. Abort inflight queries and purge sensitive previous-campus cache
        clientToUse.cancelQueries();

        // Remove old campus effective-permissions query bucket to prevent reuse
        if (activeLocationId) {
          clientToUse.removeQueries({
            queryKey: rbacQueryKeys.effectivePermissions(activeWorkspaceId, activeLocationId),
            exact: true,
          });
        }

        // 7. Invalidate campus-dependent queries
        clientToUse.invalidateQueries({ queryKey: ['tenant'] });
        clientToUse.invalidateQueries({ queryKey: ['branches'] });
        clientToUse.invalidateQueries({ queryKey: ['locations'] });
        clientToUse.invalidateQueries({ queryKey: ['workspace'] });

        // 8. Refetch effective permissions for the new campus
        await clientToUse.refetchQueries({
          queryKey: rbacQueryKeys.effectivePermissions(activeWorkspaceId, confirmedLocationId),
        });

        // 9. Display success toast notification
        toast.success(
          'Campus Switched',
          `Active campus context switched to ${confirmedLocationName}.`
        );

        return true;
      } catch (err: unknown) {
        // Failure handling: preserve previous active campus, allow retry
        const message =
          err instanceof Error
            ? err.message
            : 'Unable to switch campus context. Please try again.';
        toast.error('Campus Switch Failed', message);
        return false;
      } finally {
        setIsSwitching(false);
      }
    },
    [
      isSwitching,
      activeWorkspaceId,
      activeLocationId,
      campuses,
      setActiveLocation,
      clientToUse,
      toast,
    ]
  );

  return {
    campuses,
    activeCampus,
    activeLocationId,
    isSingleCampus: campuses.length <= 1,
    isLoading,
    isError,
    error: (error as Error) || null,
    isSwitching,
    switchCampus,
    refetch,
  };
}

