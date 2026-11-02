export type UserRole =
  | 'SUPER_ADMIN'
  | 'SCHOOL_ADMIN'
  | 'PRINCIPAL'
  | 'TEACHER'
  | 'ACCOUNTANT'
  | 'LIBRARIAN'
  | 'STUDENT'
  | 'PARENT';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
}

export interface SchoolWorkspace {
  id: string;
  code: string;
  name: string;
  academicYear: string;
  role: UserRole;
  permittedModules: string[];
  logoUrl?: string;
  campusName?: string;
}

export interface AuthSession {
  user: User;
  workspaces: SchoolWorkspace[];
  activeWorkspaceId: string | null;
  token?: string;
  expiresAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
  confirmPassword?: string;
}

export interface ModuleDefinition {
  id: string;
  name: string;
  description: string;
  category: 'academic' | 'administrative' | 'financial' | 'system';
  icon: string;
  route: string;
  permissionKey: string;
  shortcuts?: Array<{ label: string; href: string }>;
}
