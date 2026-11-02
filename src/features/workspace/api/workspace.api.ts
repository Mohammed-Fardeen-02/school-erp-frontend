import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api.types';
import type {
  UserOrganizationSummary,
  WorkspaceContextResponse,
} from '../types/workspace.types';

export class WorkspaceApi {
  /**
   * Fetches all accessible organizations and active campuses for the authenticated user
   */
  static async getMyOrganizations(): Promise<UserOrganizationSummary[]> {
    const response = await apiClient.get<ApiResponse<UserOrganizationSummary[]>>(
      '/workspace/my-organizations'
    );
    return response.data;
  }

  /**
   * Selects an active organization and campus context
   */
  static async selectContext(payload: {
    organizationId: string;
    locationId?: string;
  }): Promise<WorkspaceContextResponse> {
    const response = await apiClient.post<ApiResponse<WorkspaceContextResponse>>(
      '/workspace/select-context',
      payload
    );
    return response.data;
  }

  /**
   * Retrieves profile and module entitlements of currently active workspace context
   */
  static async getCurrentWorkspace(): Promise<WorkspaceContextResponse> {
    const response = await apiClient.get<ApiResponse<WorkspaceContextResponse>>(
      '/workspace/current'
    );
    return response.data;
  }

  /**
   * Explicitly sets the user's default/primary organization preference
   */
  static async setPrimaryOrganization(organizationId: string): Promise<any> {
    const response = await apiClient.put<ApiResponse<any>>(
      '/workspace/primary-organization',
      { organizationId }
    );
    return response.data;
  }
}

