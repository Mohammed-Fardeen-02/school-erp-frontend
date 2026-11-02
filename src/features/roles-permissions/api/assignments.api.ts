import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api.types';
import type {
  AssignmentRecord,
  AssignRolePayload,
  RevokeAssignmentPayload,
  ListAssignmentsOptions,
  WorkspaceMemberSummary,
  WorkspaceMemberPaginationMeta,
  ListMembersFilters,
  ListMembersResult,
  CampusLocation,
} from '../types/assignments.types';

export class AssignmentsApi {
  /**
   * Lists active organization members for role assignment discovery.
   * GET /api/v1/workspace/members
   */
  static async listMembers(filters: ListMembersFilters = {}): Promise<ListMembersResult> {
    const params: Record<string, string | number | undefined> = {};

    if (filters.search !== undefined && filters.search.trim() !== '') {
      params.search = filters.search.trim();
    }
    if (filters.page !== undefined && filters.page > 0) {
      params.page = filters.page;
    }
    if (filters.limit !== undefined && filters.limit > 0) {
      params.limit = filters.limit;
    }

    const response = await apiClient.get<{
      success: boolean;
      message?: string;
      data: WorkspaceMemberSummary[];
      meta: WorkspaceMemberPaginationMeta;
    }>('/workspace/members', { params });

    return {
      members: response.data || [],
      meta: response.meta || { total: 0, page: 1, limit: 20, totalPages: 0 },
    };
  }

  /**
   * Lists active campuses/locations for the current organization.
   * GET /api/v1/locations
   */
  static async getCampuses(): Promise<CampusLocation[]> {
    const response = await apiClient.get<ApiResponse<CampusLocation[]>>('/locations', {
      params: { isActive: true },
    });
    return response.data || [];
  }

  /**
   * Assigns an active role to a user at organization or campus scope.
   * POST /api/v1/user-roles/assign
   */
  static async assignRole(payload: AssignRolePayload): Promise<AssignmentRecord> {
    const response = await apiClient.post<ApiResponse<AssignmentRecord>, AssignRolePayload>(
      '/user-roles/assign',
      payload
    );
    return response.data;
  }

  /**
   * Revokes an existing active role assignment with a mandatory reason.
   * POST /api/v1/user-roles/:assignmentId/revoke
   */
  static async revokeRole(
    assignmentId: string,
    payload: RevokeAssignmentPayload
  ): Promise<AssignmentRecord> {
    const response = await apiClient.post<
      ApiResponse<AssignmentRecord>,
      RevokeAssignmentPayload
    >(`/user-roles/${assignmentId}/revoke`, payload);
    return response.data;
  }

  /**
   * Lists active and historical role assignments for a specific user.
   * GET /api/v1/user-roles/users/:userId
   */
  static async getUserAssignments(
    userId: string,
    filters: ListAssignmentsOptions = {}
  ): Promise<AssignmentRecord[]> {
    const params: Record<string, string | boolean | undefined> = {};

    if (filters.isActive !== undefined) params.isActive = filters.isActive;
    if (filters.locationId) params.locationId = filters.locationId;

    const response = await apiClient.get<ApiResponse<AssignmentRecord[]>>(
      `/user-roles/users/${userId}`,
      { params }
    );
    return response.data || [];
  }
}
