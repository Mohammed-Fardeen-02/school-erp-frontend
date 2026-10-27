import type {
  User,
  SchoolWorkspace,
  LoginCredentials,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from '@/types/auth.types';

export interface AuthService {
  login(credentials: LoginCredentials): Promise<{ user: User; workspaces: SchoolWorkspace[] }>;
  logout(): Promise<void>;
  requestPasswordReset(
    payload: ForgotPasswordPayload
  ): Promise<{ success: boolean; message: string }>;
  resetPassword(payload: ResetPasswordPayload): Promise<{ success: boolean; message: string }>;
  getWorkspaces(): Promise<SchoolWorkspace[]>;
}

// Development Mock Personas for Frontend Testing
const MOCK_WORKSPACES: Record<string, SchoolWorkspace[]> = {
  'admin@schoolerp.io': [
    {
      id: 'ws-st-marys',
      name: "St. Mary's High School",
      code: 'SMHS-01',
      academicYear: '2026-2027',
      roleInSchool: 'Executive Director',
      planName: 'Enterprise Edition',
      enabledModules: ['academics', 'students', 'attendance', 'fees', 'staff', 'exams', 'settings'],
      isDefault: true,
    },
    {
      id: 'ws-greenwood',
      name: 'Greenwood International Academy',
      code: 'GIA-02',
      academicYear: '2026-2027',
      roleInSchool: 'Board Advisor',
      planName: 'Standard Academic',
      enabledModules: ['academics', 'students', 'attendance'],
      isDefault: false,
    },
  ],
  'teacher@schoolerp.io': [
    {
      id: 'ws-st-marys',
      name: "St. Mary's High School",
      code: 'SMHS-01',
      academicYear: '2026-2027',
      roleInSchool: 'Senior Faculty',
      planName: 'Enterprise Edition',
      enabledModules: ['academics', 'attendance', 'exams'],
      isDefault: true,
    },
  ],
  'pending@schoolerp.io': [],
};

const MOCK_USERS: Record<string, User> = {
  'admin@schoolerp.io': {
    id: 'usr-admin-01',
    name: 'Dr. Catherine Vance',
    email: 'admin@schoolerp.io',
    role: 'super_admin',
    roleName: 'Executive Director',
  },
  'teacher@schoolerp.io': {
    id: 'usr-teacher-02',
    name: 'Marcus Bell',
    email: 'teacher@schoolerp.io',
    role: 'teacher',
    roleName: 'Senior Faculty',
  },
  'pending@schoolerp.io': {
    id: 'usr-pending-03',
    name: 'Jordan Hayes',
    email: 'pending@schoolerp.io',
    role: 'staff',
    roleName: 'Pending Provisioning',
  },
};

/**
 * Isolated Mock Authentication Service for frontend development.
 * Note: Once backend API auth contracts are deployed, this adapter will be
 * swapped with the real REST API endpoints.
 */
class MockAuthService implements AuthService {
  private simulateDelay = (ms = 350) => {
    if (import.meta.env.MODE === 'test') return Promise.resolve();
    return new Promise(res => setTimeout(res, ms));
  };

  async login(
    credentials: LoginCredentials
  ): Promise<{ user: User; workspaces: SchoolWorkspace[] }> {
    await this.simulateDelay();

    const normalizedEmail = credentials.email.trim().toLowerCase();
    const user = MOCK_USERS[normalizedEmail];

    // Standard test credentials check
    if (!user || credentials.password !== 'Password123!') {
      throw new Error(
        'Invalid email or password. Use demo credentials (e.g. admin@schoolerp.io / Password123!)'
      );
    }

    const workspaces = MOCK_WORKSPACES[normalizedEmail] || [];
    return { user, workspaces };
  }

  async logout(): Promise<void> {
    await this.simulateDelay(150);
  }

  async requestPasswordReset(
    payload: ForgotPasswordPayload
  ): Promise<{ success: boolean; message: string }> {
    await this.simulateDelay();

    const normalizedEmail = payload.email.trim().toLowerCase();
    if (!normalizedEmail.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }

    return {
      success: true,
      message: `If an account exists for ${normalizedEmail}, a password reset link has been dispatched.`,
    };
  }

  async resetPassword(
    payload: ResetPasswordPayload
  ): Promise<{ success: boolean; message: string }> {
    await this.simulateDelay();

    if (!payload.token || payload.token === 'invalid') {
      throw new Error('The password reset token is invalid or has expired.');
    }

    if (payload.newPassword !== payload.confirmPassword) {
      throw new Error('Passwords do not match.');
    }

    if (payload.newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }

    return {
      success: true,
      message: 'Your password has been successfully updated.',
    };
  }

  async getWorkspaces(): Promise<SchoolWorkspace[]> {
    await this.simulateDelay(150);
    return MOCK_WORKSPACES['admin@schoolerp.io'] ?? [];
  }
}

export const authService: AuthService = new MockAuthService();
