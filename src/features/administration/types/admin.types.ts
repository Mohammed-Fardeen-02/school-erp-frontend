import type { OrganizationType, TenantStatus, TenantDto } from '@/features/tenants/types/tenants.types';

// ==========================================
// 1. Organization Management Types
// ==========================================
export interface OrganizationCampus {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  isMainCampus: boolean;
  addressLine1?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  phone?: string | null;
  email?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface OrganizationDetail extends TenantDto {
  campuses: OrganizationCampus[];
  academicYear?: string;
  timezone?: string | null;
  currency?: string | null;
}

export interface SaveOrganizationPayload {
  code: string;
  legalName: string;
  displayName: string;
  organizationType: OrganizationType;
  email: string;
  phone: string;
  status: TenantStatus;
  website?: string;
  taxId?: string;
  registrationNo?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  isDraft?: boolean;
}

// ==========================================
// 2. User Management Types
// ==========================================
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'INVITED' | 'SUSPENDED';

export interface AdminUserRecord {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  status: UserStatus;
  userType: 'PLATFORM' | 'TENANT';
  primaryRole?: string;
  assignedCampus?: string;
  twoFactorEnabled: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
}

export interface InviteUserPayload {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  roleId: string;
  locationId?: string | null;
  sendEmailNotification?: boolean;
}

export interface SaveUserPayload {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  password?: string;
  roleId?: string;
  locationId?: string | null;
  status?: UserStatus;
  isDraft?: boolean;
}

// ==========================================
// 3. Roles & Permissions Types
// ==========================================
export interface DomainCapabilityGroup {
  moduleId: string;
  moduleName: string;
  description: string;
  actions: {
    code: string;
    name: string;
    description: string;
  }[];
}

export interface SaveRoleWithCapabilitiesPayload {
  roleCode: string;
  roleName: string;
  description?: string;
  baseTemplateCode?: string;
  permissionCodes: string[];
  isDraft?: boolean;
}

// ==========================================
// 4. Authentication & Security Types
// ==========================================
export interface DeviceSession {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  deviceInfo: string;
  ipAddress: string;
  userAgent: string;
  isCurrentSession: boolean;
  createdAt: string;
  expiresAt: string;
}

export interface SecurityPolicyConfig {
  minPasswordLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  passwordExpiryDays: number;
  sessionTimeoutMinutes: number;
  maxFailedLoginsBeforeLockout: number;
  lockoutDurationMinutes: number;
  twoFactorPolicy: 'OPTIONAL' | 'ADMIN_ONLY' | 'MANDATORY';
}

// ==========================================
// 5. Subscriptions & Billing Types
// ==========================================
export type BillingCycle = 'MONTHLY' | 'ANNUAL';
export type InvoiceStatus = 'PAID' | 'PENDING' | 'OVERDUE' | 'FAILED';

export interface SubscriptionPlanTier {
  id: string;
  name: string;
  code: string;
  description: string;
  priceMonthly: number;
  priceAnnual: number;
  maxStudents: number;
  maxStaff: number;
  maxCampuses: number;
  storageGb: number;
  features: string[];
  isCurrentPlan: boolean;
}

export interface BillingInvoice {
  id: string;
  invoiceNumber: string;
  periodStart: string;
  periodEnd: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  paymentMethod: string;
  paidAt?: string | null;
  downloadUrl?: string;
}

export interface SubscriptionOverview {
  currentPlan: SubscriptionPlanTier;
  billingCycle: BillingCycle;
  status: 'ACTIVE' | 'PAST_DUE' | 'TRIALING' | 'CANCELLED';
  currentPeriodEnd: string;
  nextRenewalAmount: number;
  paymentMethod: {
    brand: string;
    last4: string;
    expiry: string;
  };
}

// ==========================================
// 6. Plans & Entitlements Types
// ==========================================
export interface CanonicalModuleEntitlement {
  id: string;
  name: string;
  category: string;
  description: string;
  isEnabled: boolean;
  isLockedByPlan: boolean;
}

export interface QuotaEntitlement {
  key: string;
  label: string;
  used: number;
  total: number;
  unit: string;
  percentage: number;
}

export interface PlansAndEntitlementsDto {
  planName: string;
  modules: CanonicalModuleEntitlement[];
  quotas: QuotaEntitlement[];
}

// ==========================================
// 7. Audit & Activity Logs Types
// ==========================================
export interface AuditLogRecord {
  id: string;
  organizationId?: string | null;
  userId?: string | null;
  actorName: string;
  actorEmail: string;
  action: string;
  entity: string;
  entityId?: string | null;
  previousState?: Record<string, unknown> | null;
  newState?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
}

export interface AuditLogFilters {
  search?: string;
  action?: string;
  entity?: string;
  userId?: string;
  page?: number;
  limit?: number;
}
