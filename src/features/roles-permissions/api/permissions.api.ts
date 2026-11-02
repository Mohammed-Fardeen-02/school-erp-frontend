import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api.types';
import type {
  CanonicalTreeNode,
  EffectivePermissionsResponse,
} from '../types/permissions.types';

export class PermissionsApi {
  /**
   * Retrieves the canonical 4-level permission tree catalog.
   * GET /api/v1/permissions/tree
   */
  static async getPermissionTree(): Promise<CanonicalTreeNode[]> {
    const response = await apiClient.get<ApiResponse<CanonicalTreeNode[]>>('/permissions/tree');
    return response.data || [];
  }

  /**
   * Retrieves the authenticated caller's effective flattened permissions
   * evaluated within the current tenant and campus context.
   * GET /api/v1/permissions/me
   */
  static async getMyPermissions(): Promise<EffectivePermissionsResponse> {
    const response = await apiClient.get<ApiResponse<EffectivePermissionsResponse>>(
      '/permissions/me'
    );
    return response.data;
  }
}

