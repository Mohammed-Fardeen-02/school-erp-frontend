import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api.types';
import type {
  AssignmentRecord,
  AssignRolePayload,
  RevokeAssignmentPayload,
  ListAssignmentsOptions,
} from '../types/assignments.types';

export class AssignmentsApi {
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

