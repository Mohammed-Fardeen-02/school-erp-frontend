/**
 * Phase 3 Dynamic Multi-Tenant RBAC - User-Role Assignments Domain Types
 * Single Source of Truth: Specification v3.0.2
 */

export interface AssignmentRecord {
  id: string;
  organizationId: string;
  userId: string;
  roleId: string;
  locationId: string | null;
  assignedAt: string;
  assignedBy: string;
  isActive: boolean;
  revokedAt: string | null;
  revokedBy: string | null;
  revocationReason: string | null;
  role?: {
    id: string;
    roleCode: string;
    roleName: string;
    roleType: 'SYSTEM_TEMPLATE' | 'CUSTOM';
  };
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  location?: {
    id: string;
    name: string;
    code: string;
  } | null;
}

export interface AssignRolePayload {
  userId: string;
  roleId: string;
  locationId?: string | null;
}

export interface RevokeAssignmentPayload {
  reason: string;
}

export interface ListAssignmentsOptions {
  isActive?: boolean;
  locationId?: string;
}

export interface WorkspaceMemberSummary {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  isActive: boolean;
}

export interface WorkspaceMemberPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListMembersFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export interface ListMembersResult {
  members: WorkspaceMemberSummary[];
  meta: WorkspaceMemberPaginationMeta;
}

export interface CampusLocation {
  id: string;
  code: string;
  name: string;
  locationType?: string;
  isMainCampus?: boolean;
  isActive?: boolean;
}
