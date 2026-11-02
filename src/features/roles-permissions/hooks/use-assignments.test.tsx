import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useWorkspaceMembers,
  useOrganizationCampuses,
  useAssignRole,
  useRevokeRole,
} from './use-assignments';
import { AssignmentsApi } from '../api/assignments.api';
import { useAuthStore } from '@/stores/auth-store';
import { rbacQueryKeys } from '../utils/query-keys';
import type {
  WorkspaceMemberSummary,
  CampusLocation,
  AssignmentRecord,
} from '../types/assignments.types';

vi.mock('../api/assignments.api', () => ({
  AssignmentsApi: {
    listMembers: vi.fn(),
    getCampuses: vi.fn(),
    assignRole: vi.fn(),
    revokeRole: vi.fn(),
  },
}));

function createWrapper(queryClient: QueryClient) {
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const mockMember: WorkspaceMemberSummary = {
  id: 'member-1',
  email: 'edna@springfield.edu',
  firstName: 'Edna',
  lastName: 'Krabappel',
  phone: '+1-555-0101',
  isActive: true,
};

const mockCampus: CampusLocation = {
  id: 'loc-1',
  code: 'MAIN',
  name: 'Main Campus',
  isMainCampus: true,
  isActive: true,
};

const mockAssignment: AssignmentRecord = {
  id: 'assign-1',
  organizationId: 'org-1',
  userId: 'member-1',
  roleId: 'role-1',
  locationId: null,
  assignedAt: '2026-11-03T00:00:00Z',
  assignedBy: 'admin-1',
  isActive: true,
  revokedAt: null,
  revokedBy: null,
  revocationReason: null,
};

describe('use-assignments Hooks', () => {
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
      activeWorkspaceId: 'org-1',
      user: {
        id: 'admin-1',
        email: 'admin@springfield.edu',
        firstName: 'Principal',
        lastName: 'Skinner',
        role: 'SCHOOL_ADMIN',
      },
    });
  });

  describe('useWorkspaceMembers', () => {
    it('fetches and returns member list with pagination', async () => {
      vi.mocked(AssignmentsApi.listMembers).mockResolvedValueOnce({
        members: [mockMember],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      });

      const { result } = renderHook(
        () => useWorkspaceMembers({ search: 'Edna', page: 1, limit: 10 }),
        { wrapper: createWrapper(queryClient) }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.members).toEqual([mockMember]);
      expect(result.current.data?.meta.total).toBe(1);
      expect(AssignmentsApi.listMembers).toHaveBeenCalledWith({
        search: 'Edna',
        page: 1,
        limit: 10,
      });
    });

    it('does not run when unauthenticated or workspaceId is null', () => {
      useAuthStore.setState({
        isAuthenticated: false,
        activeWorkspaceId: null,
      });

      const { result } = renderHook(() => useWorkspaceMembers(), {
        wrapper: createWrapper(queryClient),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(AssignmentsApi.listMembers).not.toHaveBeenCalled();
    });
  });

  describe('useOrganizationCampuses', () => {
    it('fetches and returns active campuses', async () => {
      vi.mocked(AssignmentsApi.getCampuses).mockResolvedValueOnce([mockCampus]);

      const { result } = renderHook(() => useOrganizationCampuses(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([mockCampus]);
      expect(AssignmentsApi.getCampuses).toHaveBeenCalledTimes(1);
    });
  });

  describe('useAssignRole', () => {
    it('calls AssignmentsApi.assignRole and invalidates assignment queries', async () => {
      vi.mocked(AssignmentsApi.assignRole).mockResolvedValueOnce(mockAssignment);
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useAssignRole(), {
        wrapper: createWrapper(queryClient),
      });

      await result.current.mutateAsync({
        userId: 'member-1',
        roleId: 'role-1',
        locationId: null,
      });

      expect(AssignmentsApi.assignRole).toHaveBeenCalledWith({
        userId: 'member-1',
        roleId: 'role-1',
        locationId: null,
      });

      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: rbacQueryKeys.userAssignments('org-1', 'member-1', null),
      });
    });

    it('invalidates effective permissions when assigning to self', async () => {
      vi.mocked(AssignmentsApi.assignRole).mockResolvedValueOnce({
        ...mockAssignment,
        userId: 'admin-1', // caller himself
      });
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useAssignRole(), {
        wrapper: createWrapper(queryClient),
      });

      await result.current.mutateAsync({
        userId: 'admin-1',
        roleId: 'role-1',
        locationId: null,
      });

      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: rbacQueryKeys.effectivePermissions('org-1', null),
      });
    });
  });

  describe('useRevokeRole', () => {
    it('calls AssignmentsApi.revokeRole and invalidates cache', async () => {
      vi.mocked(AssignmentsApi.revokeRole).mockResolvedValueOnce({
        ...mockAssignment,
        isActive: false,
        revokedAt: '2026-11-03T01:00:00Z',
      });
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useRevokeRole(), {
        wrapper: createWrapper(queryClient),
      });

      await result.current.mutateAsync({
        assignmentId: 'assign-1',
        payload: { reason: 'No longer in position' },
        userId: 'member-1',
      });

      expect(AssignmentsApi.revokeRole).toHaveBeenCalledWith('assign-1', {
        reason: 'No longer in position',
      });

      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ['tenant', 'org-1', 'user-roles'],
      });
    });
  });
});

