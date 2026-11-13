import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { AdminApi } from '../api/admin.api';
import type { TenantQueryFilters } from '@/features/tenants/types/tenants.types';
import type {
  SaveOrganizationPayload,
  OrganizationCampus,
  InviteUserPayload,
  SaveUserPayload,
  SaveRoleWithCapabilitiesPayload,
  SecurityPolicyConfig,
  AuditLogFilters,
} from '../types/admin.types';

export const adminQueryKeys = {
  all: ['admin'] as const,
  organizations: (filters?: TenantQueryFilters) => ['admin', 'organizations', filters] as const,
  organizationDetail: (id: string) => ['admin', 'organizations', id] as const,
  campuses: (orgId?: string) => ['admin', 'campuses', orgId] as const,
  users: (search?: string, page?: number, limit?: number) => ['admin', 'users', { search, page, limit }] as const,
  sessions: () => ['admin', 'security', 'sessions'] as const,
  policies: () => ['admin', 'security', 'policies'] as const,
  subscription: () => ['admin', 'billing', 'subscription'] as const,
  invoices: () => ['admin', 'billing', 'invoices'] as const,
  plans: (orgId?: string) => ['admin', 'plans', orgId] as const,
  auditLogs: (filters?: AuditLogFilters) => ['admin', 'audit-logs', filters] as const,
};

// ------------------------------------------
// 1. Organization Management Hooks
// ------------------------------------------
export function useAdminOrganizations(filters: TenantQueryFilters = {}) {
  return useQuery({
    queryKey: adminQueryKeys.organizations(filters),
    queryFn: () => AdminApi.listOrganizations(filters),
    staleTime: 60 * 1000,
  });
}

export function useAdminOrganization(id: string) {
  return useQuery({
    queryKey: adminQueryKeys.organizationDetail(id),
    queryFn: () => AdminApi.getOrganizationById(id),
    enabled: Boolean(id),
  });
}

export function useSaveOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payload, id }: { payload: SaveOrganizationPayload; id?: string }) =>
      AdminApi.saveOrganization(payload, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'organizations'] });
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
}

export function useUpdateOrganizationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: string; reason?: string }) =>
      AdminApi.updateOrganizationStatus(id, status, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'organizations'] });
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
}

export function useAdminCampuses(organizationId?: string) {
  return useQuery({
    queryKey: adminQueryKeys.campuses(organizationId),
    queryFn: () => AdminApi.listCampuses(organizationId),
  });
}

export function useSaveCampus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ campus, id }: { campus: Partial<OrganizationCampus>; id?: string }) =>
      AdminApi.saveCampus(campus, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'campuses'] });
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });
}

// ------------------------------------------
// 2. User Management Hooks
// ------------------------------------------
export function useAdminUsers(search = '', page = 1, limit = 10) {
  return useQuery({
    queryKey: adminQueryKeys.users(search, page, limit),
    queryFn: () => AdminApi.listUsers(search, page, limit),
    staleTime: 30 * 1000,
  });
}

export function useInviteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: InviteUserPayload) => AdminApi.inviteUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['workspace', 'members'] });
    },
  });
}

export function useSaveUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payload, id }: { payload: SaveUserPayload; id?: string }) =>
      AdminApi.saveUser(payload, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, active, reason }: { userId: string; active: boolean; reason?: string }) =>
      AdminApi.toggleUserStatus(userId, active, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

// ------------------------------------------
// 3. Roles & Permissions Hooks
// ------------------------------------------
export function useSaveRoleWithCapabilities() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payload, id }: { payload: SaveRoleWithCapabilitiesPayload; id?: string }) =>
      AdminApi.saveRoleWithCapabilities(payload, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] });
    },
  });
}

// ------------------------------------------
// 4. Authentication & Security Hooks
// ------------------------------------------
export function useActiveSessions() {
  return useQuery({
    queryKey: adminQueryKeys.sessions(),
    queryFn: () => AdminApi.listActiveSessions(),
  });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => AdminApi.revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.sessions() });
    },
  });
}

export function useRevokeAllOtherSessions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => AdminApi.revokeAllOtherSessions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.sessions() });
    },
  });
}

export function useSecurityPolicies() {
  return useQuery({
    queryKey: adminQueryKeys.policies(),
    queryFn: () => AdminApi.getSecurityPolicies(),
  });
}

export function useUpdateSecurityPolicies() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (policies: SecurityPolicyConfig) => AdminApi.updateSecurityPolicies(policies),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.policies() });
    },
  });
}

// ------------------------------------------
// 5. Subscriptions & Billing Hooks
// ------------------------------------------
export function useSubscriptionOverview() {
  return useQuery({
    queryKey: adminQueryKeys.subscription(),
    queryFn: () => AdminApi.getSubscriptionOverview(),
  });
}

export function useBillingInvoices() {
  return useQuery({
    queryKey: adminQueryKeys.invoices(),
    queryFn: () => AdminApi.listInvoices(),
  });
}

// ------------------------------------------
// 6. Plans & Entitlements Hooks
// ------------------------------------------
export function usePlansAndEntitlements(organizationId?: string) {
  const activeWorkspaceId = useAuthStore((state) => state.activeWorkspaceId);
  const targetId = organizationId || activeWorkspaceId || undefined;
  return useQuery({
    queryKey: adminQueryKeys.plans(targetId),
    queryFn: () => AdminApi.getPlansAndEntitlements(targetId),
  });
}

export function useUpdateSubscribedModules() {
  const queryClient = useQueryClient();
  const activeWorkspaceId = useAuthStore((state) => state.activeWorkspaceId);
  return useMutation({
    mutationFn: ({ organizationId, moduleIds }: { organizationId?: string; moduleIds: string[] }) =>
      AdminApi.updateSubscribedModules(organizationId || activeWorkspaceId || '', moduleIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'plans'] });
      queryClient.invalidateQueries({ queryKey: ['tenant', 'modules'] });
    },
  });
}

// ------------------------------------------
// 7. Audit & Activity Logs Hooks
// ------------------------------------------
export function useAuditLogs(filters: AuditLogFilters = {}) {
  return useQuery({
    queryKey: adminQueryKeys.auditLogs(filters),
    queryFn: () => AdminApi.listAuditLogs(filters),
    staleTime: 15 * 1000,
  });
}

