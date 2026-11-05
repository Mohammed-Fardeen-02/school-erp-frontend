import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserAssignmentsPanel } from './user-assignments-panel';
import { AssignmentsApi } from '../../api/assignments.api';
import { RolesApi } from '../../api/roles.api';
import { useAuthStore } from '@/stores/auth-store';
import type { WorkspaceMemberSummary, AssignmentRecord } from '../../types/assignments.types';

vi.mock('../../api/assignments.api', () => ({
  AssignmentsApi: {
    listMembers: vi.fn(),
    getCampuses: vi.fn(),
    assignRole: vi.fn(),
    revokeRole: vi.fn(),
    getUserAssignments: vi.fn(),
  },
}));

vi.mock('../../api/roles.api', () => ({
  RolesApi: {
    listRoles: vi.fn(),
  },
}));

vi.mock('../../hooks/use-permission', () => ({
  usePermission: () => ({
    hasPermission: true,
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

const mockMember: WorkspaceMemberSummary = {
  id: 'member-101',
  email: 'edna.krabappel@springfield.edu',
  firstName: 'Edna',
  lastName: 'Krabappel',
  phone: '+1-555-0101',
  isActive: true,
};

const mockAssignments: AssignmentRecord[] = [
  {
    id: 'assign-101',
    organizationId: 'org-1',
    userId: 'member-101',
    roleId: 'role-teacher',
    locationId: null,
    assignedAt: '2026-11-01T00:00:00Z',
    assignedBy: 'admin-caller',
    isActive: true,
    revokedAt: null,
    revokedBy: null,
    revocationReason: null,
    role: {
      id: 'role-teacher',
      roleCode: 'TEACHER',
      roleName: 'Standard Teacher',
      roleType: 'SYSTEM_TEMPLATE',
    },
    location: null,
  },
];

describe('UserAssignmentsPanel Component', () => {
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

    vi.mocked(AssignmentsApi.listMembers).mockResolvedValue({
      members: [mockMember],
      meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
    });

    vi.mocked(AssignmentsApi.getUserAssignments).mockResolvedValue(mockAssignments);
    vi.mocked(AssignmentsApi.getCampuses).mockResolvedValue([]);
    vi.mocked(RolesApi.listRoles).mockResolvedValue({
      roles: [],
      total: 0,
      page: 1,
      limit: 100,
    });
  });

  it('renders panel header and initial empty prompt when no member is selected', () => {
    render(<UserAssignmentsPanel />, { wrapper: createWrapper() });

    expect(screen.getByTestId('user-assignments-panel')).toBeInTheDocument();
    expect(
      screen.getByText('Institutional Member Role Allocations')
    ).toBeInTheDocument();
    expect(screen.getByTestId('no-member-selected-banner')).toBeInTheDocument();
    expect(screen.getByText('No Member Selected')).toBeInTheDocument();
  });

  it('selects a member and renders their assignments view and active count', async () => {
    render(<UserAssignmentsPanel />, { wrapper: createWrapper() });

    // Open search dropdown and select Edna
    const input = screen.getByTestId('member-search-input');
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByTestId('member-option-member-101')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('member-option-member-101'));

    await waitFor(() => {
      expect(screen.getByTestId('member-assignments-view')).toBeInTheDocument();
      expect(screen.getByText('Standard Teacher')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument(); // Active count
    });

    expect(AssignmentsApi.getUserAssignments).toHaveBeenCalledWith('member-101', {});
  });

  it('opens AssignRoleModal with pre-selected member when allocate button clicked', async () => {
    render(<UserAssignmentsPanel />, { wrapper: createWrapper() });

    // Select member
    const input = screen.getByTestId('member-search-input');
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByTestId('member-option-member-101')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('member-option-member-101'));

    await waitFor(() => {
      expect(screen.getByTestId('add-role-to-member-btn')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('add-role-to-member-btn'));

    expect(screen.getByTestId('assign-role-modal')).toBeInTheDocument();
    expect(screen.getByText('Assign Role to Member')).toBeInTheDocument();
  });

  it('opens RevokeAssignmentModal when revoke button is clicked on an assignment', async () => {
    render(<UserAssignmentsPanel />, { wrapper: createWrapper() });

    // Select member
    const input = screen.getByTestId('member-search-input');
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByTestId('member-option-member-101')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('member-option-member-101'));

    await waitFor(() => {
      expect(screen.getByTestId('revoke-btn-assign-101')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('revoke-btn-assign-101'));

    expect(screen.getByTestId('revoke-assignment-modal')).toBeInTheDocument();
    expect(screen.getByText('Revoke Role Assignment')).toBeInTheDocument();
  });
});

