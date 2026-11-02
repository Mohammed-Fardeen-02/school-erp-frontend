import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api.types';
import type {
  RoleSummary,
  RoleDetail,
  RolePermissionsMatrixDto,
  CreateRolePayload,
  UpdateRolePayload,
  CloneTemplatePayload,
  UpdateRolePermissionsPayload,
  RoleFilterOptions,
  DeleteRoleResponse,
} from '../types/roles.types';

export interface ListRolesResult {
  roles: RoleSummary[];
  total: number;
  page: number;
  limit: number;
}

interface ListRolesApiResponse extends ApiResponse<RoleSummary[]> {
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export class RolesApi {
  /**
   * Lists roles accessible within the current organization context.
   * GET /api/v1/roles
   */
  static async listRoles(filters: RoleFilterOptions = {}): Promise<ListRolesResult> {
    const params: Record<string, string | number | boolean | undefined> = {};

    if (filters.search) params.search = filters.search;
    if (filters.isActive !== undefined) params.isActive = filters.isActive;
    if (filters.roleType) params.roleType = filters.roleType;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;

    const response = await apiClient.get<ListRolesApiResponse>('/roles', { params });

    return {
      roles: response.data || [],
      total: response.meta?.total ?? response.data?.length ?? 0,
      page: response.meta?.page ?? filters.page ?? 1,
      limit: response.meta?.limit ?? filters.limit ?? 50,
    };
  }

  /**
   * Retrieves single role details including its directly assigned capabilities.
   * GET /api/v1/roles/:roleId
   */
  static async getRoleById(roleId: string): Promise<RoleDetail> {
    const response = await apiClient.get<ApiResponse<RoleDetail>>(`/roles/${roleId}`);
    return response.data;
  }

  /**
   * Creates a new custom tenant role.
   * POST /api/v1/roles
   */
  static async createRole(payload: CreateRolePayload): Promise<RoleDetail> {
    const response = await apiClient.post<ApiResponse<RoleDetail>, CreateRolePayload>(
      '/roles',
      payload
    );
    return response.data;
  }

  /**
   * Updates basic metadata of a custom tenant role.
   * PATCH /api/v1/roles/:roleId
   */
  static async updateRole(roleId: string, payload: UpdateRolePayload): Promise<RoleDetail> {
    const response = await apiClient.patch<ApiResponse<RoleDetail>, UpdateRolePayload>(
      `/roles/${roleId}`,
      payload
    );
    return response.data;
  }

  /**
   * Activates or deactivates a custom role.
   * PATCH /api/v1/roles/:roleId/status
   */
  static async toggleRoleStatus(roleId: string, isActive: boolean): Promise<RoleDetail> {
    const response = await apiClient.patch<ApiResponse<RoleDetail>, { isActive: boolean }>(
      `/roles/${roleId}/status`,
      { isActive }
    );
    return response.data;
  }

  /**
   * Clones a global SYSTEM_TEMPLATE into a tenant-owned CUSTOM role.
   * POST /api/v1/roles/templates/:templateId/clone
   */
  static async cloneTemplate(
    templateId: string,
    payload: CloneTemplatePayload
  ): Promise<RoleDetail> {
    const response = await apiClient.post<ApiResponse<RoleDetail>, CloneTemplatePayload>(
      `/roles/templates/${templateId}/clone`,
      payload
    );
    return response.data;
  }

  /**
   * Deletes custom role if zero assignments exist, otherwise safely archives it.
   * DELETE /api/v1/roles/:roleId
   */
  static async deleteRole(roleId: string): Promise<DeleteRoleResponse> {
    const response = await apiClient.delete<ApiResponse<DeleteRoleResponse>>(`/roles/${roleId}`);
    return response.data;
  }

  /**
   * Retrieves full permission matrix for a role against the active canonical catalog.
   * GET /api/v1/roles/:roleId/permissions
   */
  static async getPermissionsMatrix(roleId: string): Promise<RolePermissionsMatrixDto> {
    const response = await apiClient.get<ApiResponse<RolePermissionsMatrixDto>>(
      `/roles/${roleId}/permissions`
    );
    return response.data;
  }

  /**
   * Atomically updates a role's permission matrix.
   * PUT /api/v1/roles/:roleId/permissions
   */
  static async updatePermissionsMatrix(
    roleId: string,
    payload: UpdateRolePermissionsPayload
  ): Promise<void> {
    await apiClient.put<ApiResponse<null>, UpdateRolePermissionsPayload>(
      `/roles/${roleId}/permissions`,
      payload
    );
  }
}

