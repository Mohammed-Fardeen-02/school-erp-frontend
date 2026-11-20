import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCampusContext, WORKSPACE_QUERY_KEYS } from './use-campus-context';
import { useAuthStore } from '@/stores/auth-store';
import { WorkspaceApi } from '../api/workspace.api';
import { apiClient } from '@/lib/api-client';
import { rbacQueryKeys } from '@/features/roles-permissions/utils/query-keys';
import * as toastModule from '@/components/feedback/toast';

vi.mock('../api/workspace.api', () => ({
  WorkspaceApi: {
    getMyOrganizations: vi.fn(),
    selectContext: vi.fn(),
    setPrimaryOrganization: vi.fn(),
  },
}));

const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();
vi.spyOn(toastModule, 'useToast').mockReturnValue({
  showToast: vi.fn(),
  success: mockToastSuccess,
  error: mockToastError,
  info: vi.fn(),
  warning: vi.fn(),
  dismissToast: vi.fn(),
  toasts: [],
});

describe('useCampusContext Hook (Stage W1.3)', () => {
  let queryClient: QueryClient;

  const mockOrganizations = [
    {
      id: 'org-1',
      code: 'SMH',
      displayName: "St. Mary's High School",
      legalName: "St. Mary's High School Inc.",
      organizationType: 'INDEPENDENT_SCHOOL',
      accessLevel: 'OWNER',
      isPrimary: true,
      campuses: [
        {
          id: 'loc-1',
          code: 'MAIN',
          name: 'Main Campus',
          locationType: 'MAIN_CAMPUS',
          isMainCampus: true,
          isActive: true,
        },
        {
          id: 'loc-2',
          code: 'NORTH',
          name: 'North Campus',
          locationType: 'BRANCH_CAMPUS',
          isMainCampus: false,
          isActive: true,
        },
      ],
    },
  ];

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
      activeWorkspaceId: 'org-1',
      activeLocationId: 'loc-1',
      workspaces: [
        {
          id: 'org-1',
          code: 'SMH',
          name: "St. Mary's High School",
          campusName: 'Main Campus',
          academicYear: '2026-2027',
          role: 'ADMIN',
          permittedModules: ['academics', 'settings'],
        },
      ],
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('correctly discovers campuses and sets active campus and single-campus flag', async () => {
    vi.mocked(WorkspaceApi.getMyOrganizations).mockResolvedValue(mockOrganizations);
    queryClient.setQueryData(WORKSPACE_QUERY_KEYS.myOrganizations, mockOrganizations);

    const { result } = renderHook(() => useCampusContext(), { wrapper });

    expect(result.current.campuses).toHaveLength(2);
    expect(result.current.activeLocationId).toBe('loc-1');
    expect(result.current.activeCampus?.name).toBe('Main Campus');
    expect(result.current.isSingleCampus).toBe(false);
  });

  it('marks isSingleCampus as true when organization has only one campus', async () => {
    const singleOrg = [
      {
        ...mockOrganizations[0],
        campuses: [mockOrganizations[0].campuses[0]],
      },
    ];
    vi.mocked(WorkspaceApi.getMyOrganizations).mockResolvedValue(singleOrg);
    queryClient.setQueryData(WORKSPACE_QUERY_KEYS.myOrganizations, singleOrg);

    const { result } = renderHook(() => useCampusContext(), { wrapper });

    expect(result.current.campuses).toHaveLength(1);
    expect(result.current.isSingleCampus).toBe(true);
  });

  it('orchestrates successful campus switch with cache invalidation and permission refetch', async () => {
    vi.mocked(WorkspaceApi.getMyOrganizations).mockResolvedValue(mockOrganizations);
    queryClient.setQueryData(WORKSPACE_QUERY_KEYS.myOrganizations, mockOrganizations);

    vi.mocked(WorkspaceApi.selectContext).mockResolvedValue({
      organization: {
        id: 'org-1',
        code: 'SMH',
        displayName: "St. Mary's High School",
        legalName: "St. Mary's High School Inc.",
        organizationType: 'INDEPENDENT_SCHOOL',
        status: 'ACTIVE',
      },
      location: {
        id: 'loc-2',
        code: 'NORTH',
        name: 'North Campus',
        locationType: 'BRANCH_CAMPUS',
        isMainCampus: false,
      },
      membership: {
        id: 'mem-1',
        accessLevel: 'OWNER',
        membershipType: 'REGULAR',
        isPrimary: true,
      },
      enabledModules: ['academics', 'settings'],
    });

    const setTenantContextSpy = vi.spyOn(apiClient, 'setTenantContext');
    const cancelQueriesSpy = vi.spyOn(queryClient, 'cancelQueries');
    const removeQueriesSpy = vi.spyOn(queryClient, 'removeQueries');
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const refetchQueriesSpy = vi.spyOn(queryClient, 'refetchQueries');

    const { result } = renderHook(() => useCampusContext(), { wrapper });

    let success = false;
    await act(async () => {
      success = await result.current.switchCampus('loc-2');
    });

    expect(success).toBe(true);

    // 1. Backend context selection was called
    expect(WorkspaceApi.selectContext).toHaveBeenCalledWith({
      organizationId: 'org-1',
      locationId: 'loc-2',
    });

    // 2. Auth store activeLocationId was updated
    expect(useAuthStore.getState().activeLocationId).toBe('loc-2');

    // 3. ApiClient tenant context was updated
    expect(setTenantContextSpy).toHaveBeenCalledWith('org-1', 'loc-2');

    // 4. Inflight queries were cancelled
    expect(cancelQueriesSpy).toHaveBeenCalled();

    // 5. Stale campus permissions were purged from cache with exact: true
    expect(removeQueriesSpy).toHaveBeenCalledWith({
      queryKey: rbacQueryKeys.effectivePermissions('org-1', 'loc-1'),
      exact: true,
    });

    // 6. Tenant and domain query caches were invalidated
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['tenant'] });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['branches'] });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['locations'] });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['workspace'] });

    // 7. New campus permissions were refetched
    expect(refetchQueriesSpy).toHaveBeenCalledWith({
      queryKey: rbacQueryKeys.effectivePermissions('org-1', 'loc-2'),
    });

    // 8. Success toast displayed
    expect(mockToastSuccess).toHaveBeenCalledWith(
      'Campus Switched',
      expect.stringContaining('North Campus')
    );
  });

  it('handles same-campus switch as a no-op without triggering API or cache invalidation', async () => {
    vi.mocked(WorkspaceApi.getMyOrganizations).mockResolvedValue(mockOrganizations);
    queryClient.setQueryData(WORKSPACE_QUERY_KEYS.myOrganizations, mockOrganizations);

    const { result } = renderHook(() => useCampusContext(), { wrapper });

    let res = false;
    await act(async () => {
      // Current activeLocationId is 'loc-1'
      res = await result.current.switchCampus('loc-1');
    });

    expect(res).toBe(true);
    expect(WorkspaceApi.selectContext).not.toHaveBeenCalled();
    expect(mockToastSuccess).not.toHaveBeenCalled();
  });

  it('handles failed campus switch by rolling back, preserving previous campus, and showing error toast', async () => {
    vi.mocked(WorkspaceApi.getMyOrganizations).mockResolvedValue(mockOrganizations);
    queryClient.setQueryData(WORKSPACE_QUERY_KEYS.myOrganizations, mockOrganizations);

    vi.mocked(WorkspaceApi.selectContext).mockRejectedValue(
      new Error('Network error or forbidden campus')
    );

    const { result } = renderHook(() => useCampusContext(), { wrapper });

    let success = true;
    await act(async () => {
      success = await result.current.switchCampus('loc-2');
    });

    expect(success).toBe(false);

    // Active location remains loc-1
    expect(useAuthStore.getState().activeLocationId).toBe('loc-1');

    // Error toast was displayed
    expect(mockToastError).toHaveBeenCalledWith(
      'Campus Switch Failed',
      'Network error or forbidden campus'
    );

    // isSwitching is reset to false
    expect(result.current.isSwitching).toBe(false);
  });
});
