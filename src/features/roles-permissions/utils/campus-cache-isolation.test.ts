import { describe, it, expect, beforeEach, vi } from 'vitest';
import { QueryClient } from '@tanstack/react-query';
import { rbacQueryKeys } from './query-keys';

describe('Campus and Tenant Cache Isolation', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
  });

  it('generates distinct cache keys for organization-wide vs campus-specific scopes', () => {
    const orgA = 'org-alpha-123';
    const campus1 = 'campus-north-456';
    const campus2 = 'campus-south-789';

    const orgWideKey = rbacQueryKeys.effectivePermissions(orgA, null);
    const campus1Key = rbacQueryKeys.effectivePermissions(orgA, campus1);
    const campus2Key = rbacQueryKeys.effectivePermissions(orgA, campus2);

    expect(orgWideKey).toEqual(['tenant', orgA, 'org-wide', 'permissions', 'me']);
    expect(campus1Key).toEqual(['tenant', orgA, campus1, 'permissions', 'me']);
    expect(campus2Key).toEqual(['tenant', orgA, campus2, 'permissions', 'me']);

    // Ensure strictly unique serialized query keys
    expect(JSON.stringify(orgWideKey)).not.toEqual(JSON.stringify(campus1Key));
    expect(JSON.stringify(campus1Key)).not.toEqual(JSON.stringify(campus2Key));
  });

  it('generates distinct cache keys for different organizations', () => {
    const orgA = 'org-alpha';
    const orgB = 'org-beta';

    const orgAKey = rbacQueryKeys.effectivePermissions(orgA, null);
    const orgBKey = rbacQueryKeys.effectivePermissions(orgB, null);

    expect(orgAKey).toEqual(['tenant', orgA, 'org-wide', 'permissions', 'me']);
    expect(orgBKey).toEqual(['tenant', orgB, 'org-wide', 'permissions', 'me']);
    expect(JSON.stringify(orgAKey)).not.toEqual(JSON.stringify(orgBKey));
  });

  it('preserves campus-isolated cache entries independently in query cache', () => {
    const orgId = 'school-district-1';
    const campusA = 'campus-elem';
    const campusB = 'campus-high';

    const orgWideKey = rbacQueryKeys.effectivePermissions(orgId, null);
    const campusAKey = rbacQueryKeys.effectivePermissions(orgId, campusA);
    const campusBKey = rbacQueryKeys.effectivePermissions(orgId, campusB);

    // Populate separate permissions per context
    queryClient.setQueryData(orgWideKey, {
      permissions: ['settings.roles_permissions.rbac.view'],
      count: 1,
    });

    queryClient.setQueryData(campusAKey, {
      permissions: ['academics.primary.manage'],
      count: 1,
    });

    queryClient.setQueryData(campusBKey, {
      permissions: ['academics.secondary.manage', 'exams.manage'],
      count: 2,
    });

    // Verify reading from one campus context never returns another campus context's permissions
    const cachedOrgWide: any = queryClient.getQueryData(orgWideKey);
    const cachedCampusA: any = queryClient.getQueryData(campusAKey);
    const cachedCampusB: any = queryClient.getQueryData(campusBKey);

    expect(cachedOrgWide.permissions).toEqual(['settings.roles_permissions.rbac.view']);
    expect(cachedCampusA.permissions).toEqual(['academics.primary.manage']);
    expect(cachedCampusB.permissions).toEqual([
      'academics.secondary.manage',
      'exams.manage',
    ]);
  });

  it('guarantees tenant cache purge clears all tenant keys on organization switch', () => {
    const orgA = 'org-alpha';
    const orgB = 'org-beta';

    queryClient.setQueryData(rbacQueryKeys.effectivePermissions(orgA, null), {
      permissions: ['perm-a'],
    });
    queryClient.setQueryData(rbacQueryKeys.roles(orgA), ['role-1']);
    queryClient.setQueryData(rbacQueryKeys.permissionTree(orgA), ['node-1']);

    // Simulate workspace purge behavior (queryClient.removeQueries({ queryKey: ['tenant'] }))
    queryClient.removeQueries({ queryKey: rbacQueryKeys.all });

    expect(queryClient.getQueryData(rbacQueryKeys.effectivePermissions(orgA, null))).toBeUndefined();
    expect(queryClient.getQueryData(rbacQueryKeys.roles(orgA))).toBeUndefined();
    expect(queryClient.getQueryData(rbacQueryKeys.permissionTree(orgA))).toBeUndefined();

    // Query cache for new org remains clean
    expect(queryClient.getQueryData(rbacQueryKeys.effectivePermissions(orgB, null))).toBeUndefined();
  });
});

