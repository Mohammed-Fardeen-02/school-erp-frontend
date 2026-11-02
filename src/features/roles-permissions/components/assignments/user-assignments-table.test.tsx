import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, render, fireEvent } from '@testing-library/react';
import { UserAssignmentsTable } from './user-assignments-table';
import { useAuthStore } from '@/stores/auth-store';
import type { AssignmentRecord } from '../../types/assignments.types';

vi.mock('../../hooks/use-permission', () => ({
  usePermission: (perm: string) => ({
    hasPermission: perm === 'settings.user_assignments.allocations.revoke',
    isLoading: false,
  }),
}));

const mockAssignments: AssignmentRecord[] = [
  {
    id: 'assign-1',
    organizationId: 'org-1',
    userId: 'user-teacher-1',
    roleId: 'role-1',
    locationId: null,
    assignedAt: '2026-11-01T00:00:00Z',
    assignedBy: 'admin-caller',
    isActive: true,
    revokedAt: null,
    revokedBy: null,
    revocationReason: null,
    role: {
      id: 'role-1',
      roleCode: 'TEACHER',
      roleName: 'Standard Teacher',
      roleType: 'SYSTEM_TEMPLATE',
    },
    location: null,
  },
  {
    id: 'assign-2',
    organizationId: 'org-1',
    userId: 'user-teacher-1',
    roleId: 'role-2',
    locationId: 'campus-north',
    assignedAt: '2026-11-01T00:00:00Z',
    assignedBy: 'admin-caller',
    isActive: false,
    revokedAt: '2026-11-02T10:00:00Z',
    revokedBy: 'admin-caller',
    revocationReason: 'Transferred out',
    role: {
      id: 'role-2',
      roleCode: 'COORDINATOR',
      roleName: 'Campus Coordinator',
      roleType: 'CUSTOM',
    },
    location: {
      id: 'campus-north',
      code: 'NORTH',
      name: 'North Campus',
    },
  },
];

describe('UserAssignmentsTable Component', () => {
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

  it('renders active assignments by default and displays columns accurately', () => {
    render(<UserAssignmentsTable assignments={mockAssignments} />);

    expect(screen.getByTestId('user-assignments-table-container')).toBeInTheDocument();

    // Active assignment should be visible
    expect(screen.getByText('Standard Teacher')).toBeInTheDocument();
    expect(screen.getByText('TEACHER')).toBeInTheDocument();
    expect(screen.getByText('Organization-Wide')).toBeInTheDocument();
    expect(screen.getByTestId('badge-assignment-active')).toBeInTheDocument();

    // Revoked assignment should be hidden in ACTIVE view
    expect(screen.queryByText('Campus Coordinator')).not.toBeInTheDocument();
  });

  it('switches between status filters (Active, Revoked, All History)', () => {
    render(<UserAssignmentsTable assignments={mockAssignments} />);

    // Switch to Revoked
    const revokedTab = screen.getByTestId('filter-status-revoked');
    fireEvent.click(revokedTab);

    expect(screen.getByText('Campus Coordinator')).toBeInTheDocument();
    expect(screen.getByText('North Campus')).toBeInTheDocument();
    expect(screen.getByText(/"Transferred out"/i)).toBeInTheDocument();
    expect(screen.queryByText('Standard Teacher')).not.toBeInTheDocument();

    // Switch to All History
    const allTab = screen.getByTestId('filter-status-all');
    fireEvent.click(allTab);

    expect(screen.getByText('Standard Teacher')).toBeInTheDocument();
    expect(screen.getByText('Campus Coordinator')).toBeInTheDocument();
  });

  it('triggers onRevokeAssignment when Revoke button is clicked', () => {
    const handleRevoke = vi.fn();
    render(
      <UserAssignmentsTable
        assignments={mockAssignments}
        onRevokeAssignment={handleRevoke}
      />
    );

    const revokeBtn = screen.getByTestId('revoke-btn-assign-1');
    fireEvent.click(revokeBtn);

    expect(handleRevoke).toHaveBeenCalledWith(mockAssignments[0]);
  });

  it('disables Revoke button when assignment belongs to current logged-in user', () => {
    const selfAssignments: AssignmentRecord[] = [
      {
        ...mockAssignments[0],
        userId: 'admin-caller', // Same as currentUser.id
      },
    ];

    render(
      <UserAssignmentsTable
        assignments={selfAssignments}
        onRevokeAssignment={vi.fn()}
      />
    );

    const revokeBtn = screen.getByTestId('revoke-btn-assign-1');
    expect(revokeBtn).toBeDisabled();
    expect(revokeBtn).toHaveAttribute('title', 'You cannot revoke your own role assignment');
  });

  it('renders empty state when no assignments match filter', () => {
    render(<UserAssignmentsTable assignments={[]} />);

    expect(screen.getByTestId('empty-assignments-state')).toBeInTheDocument();
    expect(screen.getByText(/No role assignments found/i)).toBeInTheDocument();
  });
});

