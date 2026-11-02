import type {
  User,
  SchoolWorkspace,
  LoginCredentials,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from '@/features/auth/types';
import { AuthApi } from '@/features/auth/api';

export interface AuthService {
  login(credentials: LoginCredentials): Promise<{ user: User; workspaces: SchoolWorkspace[] }>;
  logout(): Promise<void>;
  requestPasswordReset(
    payload: ForgotPasswordPayload
  ): Promise<{ success: boolean; message: string }>;
  resetPassword(payload: ResetPasswordPayload): Promise<{ success: boolean; message: string }>;
  getWorkspaces(): Promise<SchoolWorkspace[]>;
}

class AuthServiceAdapter implements AuthService {
  async login(credentials: LoginCredentials) {
    const res = await AuthApi.login(credentials);
    return { user: res.user, workspaces: res.workspaces };
  }

  async logout(): Promise<void> {
    return Promise.resolve();
  }

  async requestPasswordReset(payload: ForgotPasswordPayload) {
    return AuthApi.forgotPassword(payload);
  }

  async resetPassword(payload: ResetPasswordPayload) {
    return AuthApi.resetPassword(payload);
  }

  async getWorkspaces() {
    return AuthApi.getWorkspaces('admin@schoolerp.io');
  }
}

export const authService: AuthService = new AuthServiceAdapter();
