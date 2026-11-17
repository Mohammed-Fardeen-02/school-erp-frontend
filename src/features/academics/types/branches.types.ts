export type BranchLocationType =
  | 'MAIN_CAMPUS'
  | 'BRANCH_CAMPUS'
  | 'ADMINISTRATIVE_HQ'
  | 'TRAINING_CENTER'
  | 'HOSTEL_FACILITY'
  | 'SPORTS_COMPLEX';

export interface BranchDto {
  id: string;
  organizationId: string;
  code: string;
  name: string;
  locationType: BranchLocationType;
  isMainCampus: boolean;
  isActive: boolean;
  email?: string | null;
  phone?: string | null;
  principalName?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: string;
  updatedAt: string;
  organization?: {
    id: string;
    code: string;
    displayName: string;
    status: string;
  };
}

export interface SaveBranchPayload {
  code?: string;
  name: string;
  locationType?: BranchLocationType;
  isMainCampus?: boolean;
  email?: string;
  phone?: string;
  principalName?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface BranchQueryFilters {
  search?: string;
  isActive?: boolean;
  locationType?: BranchLocationType;
  page?: number;
  limit?: number;
}
