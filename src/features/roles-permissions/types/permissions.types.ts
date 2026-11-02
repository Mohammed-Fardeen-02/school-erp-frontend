/**
 * Phase 3 Dynamic Multi-Tenant RBAC - Permissions Domain Types
 * Single Source of Truth: Specification v3.0.2
 */

export type PermissionNodeType = 'MODULE' | 'SECTION' | 'FEATURE' | 'ACTION';

export interface CanonicalTreeNode {
  id: string;
  nodeCode: string;
  nodeName: string;
  nodeType: PermissionNodeType;
  nodeLevel: number;
  displayOrder: number;
  description: string | null;
  isActive: boolean;
  parentId: string | null;
  children?: CanonicalTreeNode[];
}

export interface EffectivePermissionsResponse {
  permissions: string[];
  count: number;
  computedAt: string;
}

