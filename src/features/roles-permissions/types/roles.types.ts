/**
 * Phase 3 Dynamic Multi-Tenant RBAC - Role Domain Types
 * Single Source of Truth: Specification v3.0.2
 */

export type RoleType = 'SYSTEM_TEMPLATE' | 'CUSTOM';

export interface RoleSummary {
  id: string;
  organizationId: string | null;
  roleCode: string;
  roleName: string;
  description: string | null;
  roleType: RoleType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  assignmentCount?: number;
}

export interface RoleDetail {
  id: string;
  organizationId: string | null;
  roleCode: string;
  roleName: string;
  description: string | null;
  roleType: RoleType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  permissions: Array<{
    id?: string;
    nodeId: string;
    isGranted: boolean;
    node?: {
      id: string;
      nodeCode: string;
      nodeName: string;
      nodeType: string;
      nodeLevel: number;
    };
  }>;
}

export interface RolePermissionMatrixItem {
  nodeId: string;
  nodeCode: string;
  nodeName: string;
  nodeType: string;
  nodeLevel: number;
  displayOrder: number;
  description: string | null;
  isGranted: boolean;
  isDirect: boolean;
}

export interface RolePermissionsMatrixDto {
  roleId: string;
  roleCode: string;
  roleName: string;
  roleType: RoleType;
  permissions: RolePermissionMatrixItem[];
}

export interface PermissionGrantItem {
  nodeId?: string;
  nodeCode?: string;
  isGranted: boolean | null;
}

export interface CreateRolePayload {
  roleCode: string;
  roleName: string;
  description?: string;
  permissions?: PermissionGrantItem[];
}

export interface UpdateRolePayload {
  roleName?: string;
  description?: string | null;
}

export interface UpdateRoleStatusPayload {
  isActive: boolean;
}

export interface CloneTemplatePayload {
  roleCode: string;
  roleName: string;
  description?: string;
}

export interface UpdateRolePermissionsPayload {
  permissions: PermissionGrantItem[];
}

export interface RoleFilterOptions {
  search?: string;
  isActive?: boolean;
  roleType?: RoleType;
  page?: number;
  limit?: number;
}

export interface DeleteRoleResponse {
  action: 'DELETED' | 'ARCHIVED';
  message: string;
}

