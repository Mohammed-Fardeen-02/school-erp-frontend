import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RevokeAssignmentModal } from './revoke-assignment-modal';
import { AssignmentsApi } from '../../api/assignments.api';
import { useAuthStore } from '@/stores/auth-store';
import type { AssignmentRecord } from '../../types/assignments.types';

vi.mock('../../api/assignments.api', () => ({
  AssignmentsApi: {
    listMembers: vi.fn(),
    getCampuses: vi.fn(),
    assignRole: vi.fn(),
    revokeRole: vi.fn(),
  },
}));

vi.mock('../../hooks/use-permission', () => ({
  usePermission: (perm: string) => ({
    hasPermission: perm === 'settings.user_assignments.allocations.revoke',
    isLoading: false,
  }),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const mockAssignment: AssignmentRecord = {
  id: 'assignment-1',
  organizationId: 'org-1',
  userId: 'user-teacher-1',
  roleId: 'role-teacher',
  locationId: null,
  assignedAt: '2026-11-01T00:00:00Z',
  assignedBy: 'admin-caller',
  isActive: true,
  revokedAt: null,
  revokedBy: null,
  revocationReason: null,
  user: {
    id: 'user-teacher-1',
    email: 'teacher@springfield.edu',
    firstName: 'Edna',
    lastName: 'Krabappel',
  },
  role: {
    id: 'role-teacher',
    roleCode: 'TEACHER',
    roleName: 'Standard Teacher',
    roleType: 'SYSTEM_TEMPLATE',
  },
  location: null,
};

describe('RevokeAssignmentModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      isAuthenticated: true,
      activeWorkspaceId: 'org-1',
      user: {
        id: 'admin-caller',
        email: 'admin@springfield.edu',
        firstName: 'Principal',
        lastName: 'Skinner',
        role: 'SCHOOL_ADMIN',
      },
    });
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <RevokeAssignmentModal
        isOpen={false}
        assignment={mockAssignment}
        onClose={vi.fn()}
      />,
      { wrapper: createWrapper() }
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders target assignment info and validates required reason (min 5 chars)', async () => {
    render(
      <RevokeAssignmentModal
        isOpen={true}
        assignment={mockAssignment}
        onClose={vi.fn()}
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByTestId('revoke-assignment-modal')).toBeInTheDocument();
    expect(screen.getByText('Revoke Role Assignment')).toBeInTheDocument();
    expect(screen.getByText(/Edna Krabappel/i)).toBeInTheDocument();
    expect(screen.getByText(/Standard Teacher/i)).toBeInTheDocument();
    expect(screen.getByText(/Organization-Wide/i)).toBeInTheDocument();

    const submitBtn = screen.getByTestId('submit-revoke-button');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByTestId('error-reason-required')).toBeInTheDocument();
      expect(screen.getByText(/must be at least 5 characters/i)).toBeInTheDocument();
    });

    expect(AssignmentsApi.revokeRole).not.toHaveBeenCalled();
  });

  it('enforces anti-self-revocation UX and disables action for self', () => {
    const selfAssignment: AssignmentRecord = {
      ...mockAssignment,
      userId: 'admin-caller', // Caller himself
    };

    render(
      <RevokeAssignmentModal
        isOpen={true}
        assignment={selfAssignment}
        onClose={vi.fn()}
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByTestId('self-revocation-warning')).toBeInTheDocument();
    expect(screen.getByText(/Self-Revocation Prohibited/i)).toBeInTheDocument();

    const submitBtn = screen.getByTestId('submit-revoke-button');
    expect(submitBtn).toBeDisabled();

    const input = screen.getByTestId('revocation-reason-input');
    expect(input).toBeDisabled();
  });

  it('submits valid revocation with reason', async () => {
    const handleSuccess = vi.fn();
    const handleClose = vi.fn();

    vi.mocked(AssignmentsApi.revokeRole).mockResolvedValueOnce({
      ...mockAssignment,
      isActive: false,
      revokedAt: '2026-11-03T00:00:00Z',
      revokedBy: 'admin-caller',
      revocationReason: 'Department re-assignment',
    });

    render(
      <RevokeAssignmentModal
        isOpen={true}
        assignment={mockAssignment}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />,
      { wrapper: createWrapper() }
    );

    const input = screen.getByTestId('revocation-reason-input');
    fireEvent.change(input, { target: { value: 'Department re-assignment' } });

    const submitBtn = screen.getByTestId('submit-revoke-button');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(AssignmentsApi.revokeRole).toHaveBeenCalledWith('assignment-1', {
        reason: 'Department re-assignment',
      });
      expect(handleSuccess).toHaveBeenCalled();
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it('displays error banner when backend rejects revocation', async () => {
    vi.mocked(AssignmentsApi.revokeRole).mockRejectedValueOnce(
      new Error('Target assignment is already revoked or caller lacks authority.')
    );

    render(
      <RevokeAssignmentModal
        isOpen={true}
        assignment={mockAssignment}
        onClose={vi.fn()}
      />,
      { wrapper: createWrapper() }
    );

    const input = screen.getByTestId('revocation-reason-input');
    fireEvent.change(input, { target: { value: 'Department re-assignment' } });

    const submitBtn = screen.getByTestId('submit-revoke-button');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByTestId('revoke-error-banner')).toBeInTheDocument();
      expect(
        screen.getByText(/Target assignment is already revoked or caller lacks authority/i)
      ).toBeInTheDocument();
    });
  });

  it('invokes onClose when Cancel or Close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <RevokeAssignmentModal
        isOpen={true}
        assignment={mockAssignment}
        onClose={handleClose}
      />,
      { wrapper: createWrapper() }
    );

    const cancelBtn = screen.getByTestId('cancel-revoke-button');
    fireEvent.click(cancelBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);

    const closeBtn = screen.getByTestId('close-revoke-modal');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(2);
  });
});

