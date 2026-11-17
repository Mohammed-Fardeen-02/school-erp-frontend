import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api.types';
import type { BranchDto, SaveBranchPayload, BranchQueryFilters } from '../types/branches.types';

export class BranchesApi {
  /**
   * Retrieves branches for the active tenant organization.
   */
  static async list(filters: BranchQueryFilters = {}): Promise<BranchDto[]> {
    const params = new URLSearchParams();
    if (filters.organizationId && filters.organizationId !== 'ALL') {
      params.append('organizationId', filters.organizationId);
    }
    if (filters.search) params.append('search', filters.search);
    if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive));
    if (filters.locationType) params.append('locationType', filters.locationType);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    const headers =
      filters.organizationId && filters.organizationId !== 'ALL'
        ? { 'X-Organization-Id': filters.organizationId }
        : undefined;

    try {
      const res = await apiClient.get<ApiResponse<BranchDto[]>>(`/academics/branches${queryStr}`, { headers });
      return res.data || [];
    } catch {
      // Fallback to /branches
      const res = await apiClient.get<ApiResponse<BranchDto[]>>(`/branches${queryStr}`, { headers });
      return res.data || [];
    }
  }

  /**
   * Retrieves branch details by ID.
   */
  static async getById(id: string): Promise<BranchDto> {
    try {
      const res = await apiClient.get<ApiResponse<BranchDto>>(`/academics/branches/${id}`);
      return res.data;
    } catch {
      const res = await apiClient.get<ApiResponse<BranchDto>>(`/branches/${id}`);
      return res.data;
    }
  }

  /**
   * Creates or updates a branch.
   */
  static async save(payload: SaveBranchPayload, id?: string): Promise<BranchDto> {
    const headers = payload.organizationId
      ? { 'X-Organization-Id': payload.organizationId }
      : undefined;

    if (id) {
      try {
        const res = await apiClient.put<ApiResponse<BranchDto>>(`/academics/branches/${id}`, payload, { headers });
        return res.data;
      } catch {
        const res = await apiClient.put<ApiResponse<BranchDto>>(`/branches/${id}`, payload, { headers });
        return res.data;
      }
    }

    try {
      const res = await apiClient.post<ApiResponse<BranchDto>>('/academics/branches', payload, { headers });
      return res.data;
    } catch {
      const res = await apiClient.post<ApiResponse<BranchDto>>('/branches', payload, { headers });
      return res.data;
    }
  }

  /**
   * Designates a branch as the main campus.
   */
  static async setMainBranch(id: string): Promise<BranchDto> {
    try {
      const res = await apiClient.patch<ApiResponse<BranchDto>>(`/academics/branches/${id}/main`);
      return res.data;
    } catch {
      const res = await apiClient.patch<ApiResponse<BranchDto>>(`/branches/${id}/main`);
      return res.data;
    }
  }

  /**
   * Toggles branch operational status.
   */
  static async toggleStatus(id: string, isActive: boolean): Promise<BranchDto> {
    try {
      const res = await apiClient.patch<ApiResponse<BranchDto>>(`/academics/branches/${id}/status`, { isActive });
      return res.data;
    } catch {
      const res = await apiClient.patch<ApiResponse<BranchDto>>(`/branches/${id}/status`, { isActive });
      return res.data;
    }
  }

  /**
   * Deletes a branch.
   */
  static async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/academics/branches/${id}`);
    } catch {
      await apiClient.delete(`/branches/${id}`);
    }
  }
}

