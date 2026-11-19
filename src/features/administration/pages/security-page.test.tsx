import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { SecurityPage } from './security-page';
import * as useAdminHooks from '../hooks/use-admin';
import type { DeviceSession, SecurityPolicyConfig, AuditLogRecord } from '../types/admin.types';

vi.mock('../hooks/use-admin', () => ({
  useActiveSessions: vi.fn(),
  useRevokeSession: vi.fn(),
  useRevokeAllOtherSessions: vi.fn(),
  useSecurityPolicies: vi.fn(),
  useUpdateSecurityPolicies: vi.fn(),
  useAuthenticationActivity: vi.fn(),
}));

const mockSessions: DeviceSession[] = [
  {
    id: 'sess-1',
    userId: 'usr-1',
    userName: 'Eleanor Vance',
    userEmail: 'admin@school.edu',
    deviceInfo: 'Chrome 131 on Windows 11',
    ipAddress: '192.168.1.50',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131',
    isCurrentSession: true,
    createdAt: '2026-11-19T08:00:00Z',
    expiresAt: '2026-11-26T08:00:00Z',
  },
  {
    id: 'sess-2',
    userId: 'usr-2',
    userName: 'Arthur Pendelton',
    userEmail: 'arthur@school.edu',
    deviceInfo: 'Safari 18 on iPhone 16',
    ipAddress: '10.0.0.12',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0) Safari',
    isCurrentSession: false,
    createdAt: '2026-11-18T10:00:00Z',
    expiresAt: '2026-11-25T10:00:00Z',
  },
];

const mockPolicies: SecurityPolicyConfig = {
  minPasswordLength: 10,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  passwordExpiryDays: 90,
  sessionTimeoutMinutes: 30,
  maxFailedLoginsBeforeLockout: 5,
  lockoutDurationMinutes: 15,
  twoFactorPolicy: 'OPTIONAL',
};

const mockActivity: { logs: AuditLogRecord[]; total: number; page: number; limit: number; totalPages: number } = {
  logs: [
    {
      id: 'aud-001',
      actorName: 'Eleanor Vance',
      actorEmail: 'admin@school.edu',
      action: 'LOGIN_SUCCESS',
      entity: 'User',
      entityId: 'usr-1',
      previousState: null,
      newState: { sessionId: 'sess-1' },
      ipAddress: '192.168.1.50',
      userAgent: 'Chrome 131',
      createdAt: '2026-11-19T08:00:00Z',
    },
    {
      id: 'aud-002',
      actorName: 'Eleanor Vance',
      actorEmail: 'admin@school.edu',
      action: 'ADMIN_REVOKED_SESSION',
      entity: 'Session',
      entityId: 'sess-old-99',
      previousState: null,
      newState: { reason: 'ADMIN_TERMINATED_SESSION' },
      ipAddress: '192.168.1.50',
      userAgent: 'Chrome 131',
      createdAt: '2026-11-19T08:15:00Z',
    },
  ],
  total: 2,
  page: 1,
  limit: 10,
  totalPages: 1,
};

describe('SecurityPage (Administration Workspace)', () => {
  let queryClient: QueryClient;
  const mockRevokeSession = vi.fn();
  const mockRevokeAllOther = vi.fn();
  const mockUpdatePolicies = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    vi.mocked(useAdminHooks.useActiveSessions).mockReturnValue({
      data: mockSessions,
      isLoading: false,
    } as any);

    vi.mocked(useAdminHooks.useSecurityPolicies).mockReturnValue({
      data: mockPolicies,
      isLoading: false,
    } as any);

    vi.mocked(useAdminHooks.useAuthenticationActivity).mockReturnValue({
      data: mockActivity,
      isLoading: false,
    } as any);

    vi.mocked(useAdminHooks.useRevokeSession).mockReturnValue({
      mutateAsync: mockRevokeSession,
      isPending: false,
    } as any);

    vi.mocked(useAdminHooks.useRevokeAllOtherSessions).mockReturnValue({
      mutateAsync: mockRevokeAllOther,
      isPending: false,
    } as any);

    vi.mocked(useAdminHooks.useUpdateSecurityPolicies).mockReturnValue({
      mutateAsync: mockUpdatePolicies,
      isPending: false,
    } as any);
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SecurityPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('renders page header, KPI stats cards, and active sessions list', () => {
    renderComponent();

    expect(screen.getByText('Authentication & Security Management')).toBeInTheDocument();
    expect(screen.getByText('Monitored Sessions')).toBeInTheDocument();
    expect(screen.getByText('Idle Timeout')).toBeInTheDocument();
    expect(screen.getByText('30m')).toBeInTheDocument();

    // Check sessions rendered
    expect(screen.getByText('Chrome 131 on Windows 11')).toBeInTheDocument();
    expect(screen.getByText('Current Session')).toBeInTheDocument();
    expect(screen.getByText('Safari 18 on iPhone 16')).toBeInTheDocument();
  });

  it('opens session detail drawer when Details button is clicked', async () => {
    renderComponent();

    const detailButtons = screen.getAllByRole('button', { name: /details/i });
    expect(detailButtons.length).toBeGreaterThan(0);

    fireEvent.click(detailButtons[0]!);

    await waitFor(() => {
      expect(screen.getByText('Session Telemetry & Security')).toBeInTheDocument();
      expect(screen.getByText(/Session ID: sess-1/i)).toBeInTheDocument();
      expect(screen.getByText('Full User Agent')).toBeInTheDocument();
    });
  });

  it('opens confirmation modal and revokes a non-current session', async () => {
    renderComponent();

    // Click "Revoke" on the second session (non-current)
    const revokeButton = screen.getByRole('button', { name: /^revoke$/i });
    fireEvent.click(revokeButton);

    // Confirmation modal should appear
    expect(screen.getByText('Terminate Active Session?')).toBeInTheDocument();

    // Confirm revocation
    const confirmButton = screen.getByRole('button', { name: /confirm revocation/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockRevokeSession).toHaveBeenCalledWith('sess-2');
    });
  });

  it('switches to Password & Access Policies tab and saves updated policies', async () => {
    renderComponent();

    // Switch to policies tab
    const policiesTab = screen.getByRole('button', { name: /password & access policies/i });
    fireEvent.click(policiesTab);

    // Form inputs should be visible
    expect(screen.getByText('Password Complexity Rules')).toBeInTheDocument();
    expect(screen.getByLabelText(/minimum password length/i)).toBeInTheDocument();

    // Change minimum password length
    const minLengthInput = screen.getByLabelText(/minimum password length/i);
    fireEvent.change(minLengthInput, { target: { value: '14' } });

    // Submit form
    const saveButton = screen.getByRole('button', { name: /save security policies/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdatePolicies).toHaveBeenCalledWith(
        expect.objectContaining({
          minPasswordLength: 14,
        })
      );
    });
  });

  it('switches to Authentication Activity tab and displays audit events', async () => {
    renderComponent();

    // Switch to activity tab
    const activityTab = screen.getByRole('button', { name: /authentication activity/i });
    fireEvent.click(activityTab);

    // Activity table should be visible
    expect(screen.getByText('Authentication & Security Forensics')).toBeInTheDocument();
    expect(screen.getByText('Sign In Success')).toBeInTheDocument();
    expect(screen.getByText('Admin Revoked')).toBeInTheDocument();
    expect(screen.getAllByText('192.168.1.50').length).toBeGreaterThan(0);
  });
});
