export type OrganizationType =
  | 'K12_SCHOOL_CHAIN'
  | 'INDEPENDENT_SCHOOL'
  | 'COLLEGE_UNIVERSITY'
  | 'POLYTECHNIC_INSTITUTE'
  | 'VOCATIONAL_CENTER';

export type TenantStatus =
  | 'PROVISIONING'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'TRIAL'
  | 'ARCHIVED';

export interface TenantDto {
  id: string;
  code: string;
  legalName: string;
  displayName: string;
  organizationType: OrganizationType;
  email: string;
  phone: string;
  website?: string | null;
  taxId?: string | null;
  registrationNo?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  timezone?: string | null;
  currency?: string | null;
  status: TenantStatus;
  subscriptionPlan: string;
  maxLocations: number;
  maxUsers: number;
  maxStudents: number;
  trialEndsAt?: string | null;
  logoUrl?: string | null;
  brandColor?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    locations: number;
    memberships: number;
  };
}

export interface CreateTenantDto {
  code: string;
  legalName: string;
  displayName: string;
  organizationType?: OrganizationType;
  email: string;
  phone: string;
  website?: string;
  taxId?: string;
  registrationNo?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  timezone?: string;
  currency?: string;
  subscriptionPlan?: string;
  maxLocations?: number;
  maxUsers?: number;
  maxStudents?: number;
  trialDays?: number;
  logoUrl?: string;
  brandColor?: string;
  initialMainCampusName?: string;
  initialMainCampusCode?: string;
  ownerEmail?: string;
  ownerFirstName?: string;
  ownerLastName?: string;
}

export interface UpdateTenantDto {
  displayName?: string;
  legalName?: string;
  email?: string;
  phone?: string;
  website?: string;
  taxId?: string;
  registrationNo?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  timezone?: string;
  currency?: string;
  logoUrl?: string;
  brandColor?: string;
}

export interface UpdateTenantStatusDto {
  status: TenantStatus;
  reason?: string;
}

export interface UpdateTenantModulesDto {
  modules: string[];
}

export interface TenantQueryFilters {
  search?: string;
  status?: TenantStatus | 'ALL';
  page?: number;
  limit?: number;
}

export interface PaginatedTenantsResult {
  items: TenantDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

