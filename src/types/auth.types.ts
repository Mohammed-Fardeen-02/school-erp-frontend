import type { LucideIcon } from 'lucide-react';

export type UserRole =
  | 'super_admin'
  | 'school_admin'
  | 'principal'
  | 'teacher'
  | 'accountant'
  | 'staff'
  | 'parent'
  | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleName: string;
  avatarUrl?: string;
}

export interface SchoolWorkspace {
  id: string;
  name: string;
  code: string;
  academicYear: string;
  roleInSchool: string;
  planName: string;
  enabledModules: string[];
  isDefault?: boolean;
}

export interface AuthSession {
  user: User;
  workspaces: SchoolWorkspace[];
  activeWorkspaceId: string | null;
  token?: string;
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
  newPassword: string;
  confirmPassword: string;
}

export interface ModuleDefinition {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  route: string;
  category: 'core' | 'academic' | 'finance' | 'admin';
  requiredPermission: string;
}
