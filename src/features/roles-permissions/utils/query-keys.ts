/**
 * Phase 3 Dynamic Multi-Tenant RBAC - Query Key Topology
 *
 * Guarantees mathematical cache isolation across organizations and campuses.
 * When switching organizations or campuses, distinct cache buckets prevent
 * cross-tenant or cross-campus authorization leaks.
 */

export const rbacQueryKeys = {
  all: ['tenant'] as const,

  tenant: (orgId: string | null) => ['tenant', orgId ?? 'no-org'] as const,

  // Role management queries (tenant-scoped)
  roles: (orgId: string | null) => ['tenant', orgId ?? 'no-org', 'roles'] as const,
  rolesList: (orgId: string | null, filters?: Record<string, unknown>) =>
    ['tenant', orgId ?? 'no-org', 'roles', 'list', filters ?? {}] as const,
  roleDetail: (orgId: string | null, roleId: string) =>
    ['tenant', orgId ?? 'no-org', 'roles', 'detail', roleId] as const,
  rolePermissions: (orgId: string | null, roleId: string) =>
    ['tenant', orgId ?? 'no-org', 'roles', 'permissions', roleId] as const,

  // Canonical permission catalog (tenant-scoped)
  permissionTree: (orgId: string | null) =>
    ['tenant', orgId ?? 'no-org', 'permissions', 'tree'] as const,

  // Effective permissions of current caller (campus-scoped & tenant-scoped)
  effectivePermissions: (orgId: string | null, locationId: string | null) =>
    [
      'tenant',
      orgId ?? 'no-org',
      locationId ?? 'org-wide',
      'permissions',
      'me',
    ] as const,

  // User-Role assignment queries (tenant-scoped, optional campus filter)
  userAssignments: (
    orgId: string | null,
    userId: string,
    locationId?: string | null
  ) =>
    [
      'tenant',
      orgId ?? 'no-org',
      locationId ?? 'all-campuses',
      'user-roles',
      userId,
    ] as const,
};

