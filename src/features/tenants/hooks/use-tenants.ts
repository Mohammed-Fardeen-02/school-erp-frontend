import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TenantsApi } from '../api/tenants.api';
import type {
  CreateTenantDto,
  UpdateTenantDto,
  UpdateTenantStatusDto,
  UpdateTenantModulesDto,
  TenantQueryFilters,
  PaginatedTenantsResult,
  TenantDto,
} from '../types/tenants.types';

export const tenantQueryKeys = {
  all: ['tenants'] as const,
  lists: () => [...tenantQueryKeys.all, 'list'] as const,
  list: (filters: TenantQueryFilters) => [...tenantQueryKeys.lists(), filters] as const,
  details: () => [...tenantQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...tenantQueryKeys.details(), id] as const,
  modules: (id: string) => [...tenantQueryKeys.detail(id), 'modules'] as const,
};

/**
 * Hook to fetch paginated institutions/tenants
 */
export function useTenants(filters: TenantQueryFilters = {}) {
  return useQuery<PaginatedTenantsResult, Error>({
    queryKey: tenantQueryKeys.list(filters),
    queryFn: () => TenantsApi.listTenants(filters),
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to fetch single tenant details
 */
export function useTenant(id: string | null | undefined) {
  return useQuery<TenantDto, Error>({
    queryKey: tenantQueryKeys.detail(id || ''),
    queryFn: () => {
      if (!id) throw new Error('Tenant ID required');
      return TenantsApi.getTenantById(id);
    },
    enabled: Boolean(id),
  });
}

/**
 * Hook to provision a new school institution
 */
export function useCreateTenant() {
  const queryClient = useQueryClient();

  return useMutation<TenantDto, Error, CreateTenantDto>({
    mutationFn: (payload) => TenantsApi.createTenant(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantQueryKeys.lists() });
    },
  });
}

/**
 * Hook to update tenant legal/display profile
 */
export function useUpdateTenant(id: string) {
  const queryClient = useQueryClient();

  return useMutation<TenantDto, Error, UpdateTenantDto>({
    mutationFn: (payload) => TenantsApi.updateTenant(id, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(tenantQueryKeys.detail(id), updated);
      queryClient.invalidateQueries({ queryKey: tenantQueryKeys.lists() });
    },
  });
}

/**
 * Hook to update tenant lifecycle status
 */
export function useUpdateTenantStatus() {
  const queryClient = useQueryClient();

  return useMutation<TenantDto, Error, { id: string; payload: UpdateTenantStatusDto }>({
    mutationFn: ({ id, payload }) => TenantsApi.updateTenantStatus(id, payload),
    onSuccess: (updated, variables) => {
      queryClient.setQueryData(tenantQueryKeys.detail(variables.id), updated);
      queryClient.invalidateQueries({ queryKey: tenantQueryKeys.lists() });
    },
  });
}

/**
 * Hook to fetch subscribed modules for an institution
 */
export function useTenantModules(id: string | null | undefined) {
  return useQuery<string[], Error>({
    queryKey: tenantQueryKeys.modules(id || ''),
    queryFn: () => {
      if (!id) throw new Error('Tenant ID required');
      return TenantsApi.getTenantModules(id);
    },
    enabled: Boolean(id),
  });
}

/**
 * Hook to update subscribed modules for an institution
 */
export function useUpdateTenantModules(id: string) {
  const queryClient = useQueryClient();

  return useMutation<string[], Error, UpdateTenantModulesDto>({
    mutationFn: (payload) => TenantsApi.updateTenantModules(id, payload),
    onSuccess: (modules) => {
      queryClient.setQueryData(tenantQueryKeys.modules(id), modules);
      queryClient.invalidateQueries({ queryKey: tenantQueryKeys.detail(id) });
    },
  });
}

