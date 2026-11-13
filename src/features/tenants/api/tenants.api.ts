import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api.types';
import type {
  TenantDto,
  CreateTenantDto,
  UpdateTenantDto,
  UpdateTenantStatusDto,
  UpdateTenantModulesDto,
  TenantQueryFilters,
  PaginatedTenantsResult,
} from '../types/tenants.types';

interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class TenantsApi {
  /**
   * Retrieves paginated list of institutions/tenants with search & status filters.
   * GET /api/v1/organizations
   */
  static async listTenants(filters: TenantQueryFilters = {}): Promise<PaginatedTenantsResult> {
    const params: Record<string, string | number | undefined> = {};

    if (filters.search) params.search = filters.search;
    if (filters.status && filters.status !== 'ALL') params.status = filters.status;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;

    const response = await apiClient.get<PaginatedApiResponse<TenantDto>>('/organizations', { params });

    return {
      items: response.data || [],
      total: response.meta?.total ?? response.data?.length ?? 0,
      page: response.meta?.page ?? filters.page ?? 1,
      limit: response.meta?.limit ?? filters.limit ?? 20,
      totalPages: response.meta?.totalPages ?? 1,
    };
  }

  /**
   * Retrieves single organization profile and statistics.
   * GET /api/v1/organizations/:id
   */
  static async getTenantById(id: string): Promise<TenantDto> {
    const response = await apiClient.get<ApiResponse<TenantDto>>(`/organizations/${id}`);
    return response.data;
  }

  /**
   * Provisions a brand new school institution along with initial admin and main campus.
   * POST /api/v1/organizations
   */
  static async createTenant(payload: CreateTenantDto): Promise<TenantDto> {
    const response = await apiClient.post<ApiResponse<TenantDto>>('/organizations', payload);
    return response.data;
  }

  /**
   * Updates organization legal and display information.
   * PUT /api/v1/organizations/:id
   */
  static async updateTenant(id: string, payload: UpdateTenantDto): Promise<TenantDto> {
    const response = await apiClient.put<ApiResponse<TenantDto>>(`/organizations/${id}`, payload);
    return response.data;
  }

  /**
   * Updates tenant lifecycle status (ACTIVE, SUSPENDED, ARCHIVED) with an audit reason.
   * PATCH /api/v1/organizations/:id/status
   */
  static async updateTenantStatus(id: string, payload: UpdateTenantStatusDto): Promise<TenantDto> {
    const response = await apiClient.patch<ApiResponse<TenantDto>>(`/organizations/${id}/status`, payload);
    return response.data;
  }

  /**
   * Retrieves list of subscribed module IDs for an organization.
   * GET /api/v1/organizations/:id/modules
   */
  static async getTenantModules(id: string): Promise<string[]> {
    const response = await apiClient.get<ApiResponse<string[]>>(`/organizations/${id}/modules`);
    return response.data;
  }

  /**
   * Updates the subscribed module package for an organization.
   * PUT /api/v1/organizations/:id/modules
   */
  static async updateTenantModules(id: string, payload: UpdateTenantModulesDto): Promise<string[]> {
    const response = await apiClient.put<ApiResponse<string[]>>(`/organizations/${id}/modules`, payload);
    return response.data;
  }
}

