import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, render, fireEvent, waitFor, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AssignRoleModal } from './assign-role-modal';
import { AssignmentsApi } from '../../api/assignments.api';
import { RolesApi } from '../../api/roles.api';
import { useAuthStore } from '@/stores/auth-store';
import type { RoleSummary } from '../../types/roles.types';
import type { CampusLocation, WorkspaceMemberSummary } from '../../types/assignments.types';

vi.mock('../../api/assignments.api', () => ({
  AssignmentsApi: {
    listMembers: vi.fn(),
    getCampuses: vi.fn(),
    assignRole: vi.fn(),
    revokeRole: vi.fn(),
  },
}));

vi.mock('../../api/roles.api', () => ({
  RolesApi: {
    listRoles: vi.fn(),
  },
}));

// Mock permission hook to allow assigning
vi.mock('../../hooks/use-permission', () => ({
  usePermission: (perm: string) => ({
    hasPermission: perm === 'settings.user_assignments.allocations.assign',
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
  id: 'user-101',
  email: 'edna@springfield.edu',
  firstName: 'Edna',
  lastName: 'Krabappel',
  phone: '+1-555-0101',
  isActive: true,
};

const mockRoles: RoleSummary[] = [
  {
    id: 'role-template-teacher',
    organizationId: null,
    roleCode: 'TEACHER',
    roleName: 'Standard Teacher',
    description: 'Faculty capability profile',
    roleType: 'SYSTEM_TEMPLATE',
    isActive: true,
    createdAt: '2026-11-01T00:00:00Z',
    updatedAt: '2026-11-01T00:00:00Z',
    assignmentCount: 5,
  },
  {
    id: 'role-custom-coordinator',
    organizationId: 'org-test-1',
    roleCode: 'ACADEMIC_COORDINATOR',
    roleName: 'Academic Coordinator',
    description: 'Departmental coordinator',
    roleType: 'CUSTOM',
    isActive: true,
    createdAt: '2026-11-01T00:00:00Z',
    updatedAt: '2026-11-01T00:00:00Z',
    assignmentCount: 2,
  },
];

const mockCampuses: CampusLocation[] = [
  {
    id: 'campus-north',
    code: 'NORTH',
    name: 'North Campus',
    isMainCampus: true,
    isActive: true,
  },
  {
    id: 'campus-south',
    code: 'SOUTH',
    name: 'South Campus',
    isMainCampus: false,
    isActive: true,
  },
];

describe('AssignRoleModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      isAuthenticated: true,
      activeWorkspaceId: 'org-test-1',
      user: {
        id: 'admin-caller',
        email: 'admin@springfield.edu',
        firstName: 'Principal',
        lastName: 'Skinner',
        role: 'SCHOOL_ADMIN',
      },
    });

    vi.mocked(RolesApi.listRoles).mockResolvedValue({
      roles: mockRoles,
      total: 2,
      page: 1,
      limit: 100,
      totalPages: 1,
    });

    vi.mocked(AssignmentsApi.getCampuses).mockResolvedValue(mockCampuses);
    vi.mocked(AssignmentsApi.listMembers).mockResolvedValue({
      members: [mockMember],
      meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
    });
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <AssignRoleModal isOpen={false} onClose={vi.fn()} />,
      { wrapper: createWrapper() }
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders modal elements and validates required fields on empty submit', async () => {
    render(<AssignRoleModal isOpen={true} onClose={vi.fn()} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId('assign-role-modal')).toBeInTheDocument();
    expect(screen.getByText('Assign Role to Member')).toBeInTheDocument();

    const submitBtn = screen.getByTestId('submit-assign-role-button');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByTestId('error-member-required')).toBeInTheDocument();
      expect(screen.getByTestId('error-role-required')).toBeInTheDocument();
    });

    expect(AssignmentsApi.assignRole).not.toHaveBeenCalled();
  });

  it('requires campus selection when Campus-Scoped scope is selected', async () => {
    render(
      <AssignRoleModal
        isOpen={true}
        initialMember={mockMember}
        initialRoleId="role-template-teacher"
        onClose={vi.fn()}
      />,
      { wrapper: createWrapper() }
    );

    // Wait for role to resolve
    await waitFor(() => {
      expect(screen.getByTestId('assignment-summary-preview')).toBeInTheDocument();
    });

    // Switch to campus-scoped
    const campusRadio = screen.getByTestId('scope-option-campus');
    fireEvent.click(campusRadio);

    expect(screen.getByTestId('campus-select-container')).toBeInTheDocument();

    // Click submit without selecting a campus
    const submitBtn = screen.getByTestId('submit-assign-role-button');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByTestId('error-location-required')).toBeInTheDocument();
    });

    expect(AssignmentsApi.assignRole).not.toHaveBeenCalled();
  });

  it('submits organization-wide assignment with locationId: null', async () => {
    const handleSuccess = vi.fn();
    const handleClose = vi.fn();

    vi.mocked(AssignmentsApi.assignRole).mockResolvedValueOnce({
      id: 'assign-1',
      organizationId: 'org-test-1',
      userId: mockMember.id,
      roleId: 'role-template-teacher',
      locationId: null,
      assignedAt: '2026-11-03T00:00:00Z',
      assignedBy: 'admin-caller',
      isActive: true,
      revokedAt: null,
      revokedBy: null,
      revocationReason: null,
    });

    render(
      <AssignRoleModal
        isOpen={true}
        initialMember={mockMember}
        initialRoleId="role-template-teacher"
        onClose={handleClose}
        onSuccess={handleSuccess}
      />,
      { wrapper: createWrapper() }
    );

    // Verify preview card shows Organization-Wide after roles query resolves
    await waitFor(() => {
      expect(screen.getByTestId('assignment-summary-preview')).toBeInTheDocument();
      expect(
        within(screen.getByTestId('assignment-summary-preview')).getByText('Organization-Wide')
      ).toBeInTheDocument();
    });

    const submitBtn = screen.getByTestId('submit-assign-role-button');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(AssignmentsApi.assignRole).toHaveBeenCalledWith({
        userId: mockMember.id,
        roleId: 'role-template-teacher',
        locationId: null,
      });
      expect(handleSuccess).toHaveBeenCalled();
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it('submits campus-scoped assignment with chosen locationId', async () => {
    const handleSuccess = vi.fn();
    const handleClose = vi.fn();

    vi.mocked(AssignmentsApi.assignRole).mockResolvedValueOnce({
      id: 'assign-2',
      organizationId: 'org-test-1',
      userId: mockMember.id,
      roleId: 'role-custom-coordinator',
      locationId: 'campus-north',
      assignedAt: '2026-11-03T00:00:00Z',
      assignedBy: 'admin-caller',
      isActive: true,
      revokedAt: null,
      revokedBy: null,
      revocationReason: null,
    });

    render(
      <AssignRoleModal
        isOpen={true}
        initialMember={mockMember}
        initialRoleId="role-custom-coordinator"
        onClose={handleClose}
        onSuccess={handleSuccess}
      />,
      { wrapper: createWrapper() }
    );

    // Wait for roles to resolve
    await waitFor(() => {
      expect(screen.getByTestId('assignment-summary-preview')).toBeInTheDocument();
    });

    // Switch to campus-scoped
    fireEvent.click(screen.getByTestId('scope-option-campus'));

    // Select North Campus
    await waitFor(() => {
      expect(screen.getByTestId('campus-select')).toBeInTheDocument();
    });
    fireEvent.change(screen.getByTestId('campus-select'), {
      target: { value: 'campus-north' },
    });

    const submitBtn = screen.getByTestId('submit-assign-role-button');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(AssignmentsApi.assignRole).toHaveBeenCalledWith({
        userId: mockMember.id,
        roleId: 'role-custom-coordinator',
        locationId: 'campus-north',
      });
      expect(handleSuccess).toHaveBeenCalled();
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it('displays backend error banner when assignment fails', async () => {
    vi.mocked(AssignmentsApi.assignRole).mockRejectedValueOnce(
      new Error('Delegation ceiling exceeded: You do not possess the required permissions.')
    );

    render(
      <AssignRoleModal
        isOpen={true}
        initialMember={mockMember}
        initialRoleId="role-template-teacher"
        onClose={vi.fn()}
      />,
      { wrapper: createWrapper() }
    );

    // Wait for roles to resolve
    await waitFor(() => {
      expect(screen.getByTestId('assignment-summary-preview')).toBeInTheDocument();
    });

    const submitBtn = screen.getByTestId('submit-assign-role-button');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByTestId('assign-role-error')).toBeInTheDocument();
      expect(
        screen.getByText(/Delegation ceiling exceeded/i)
      ).toBeInTheDocument();
    });
  });

  it('invokes onClose when close or Cancel button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <AssignRoleModal
        isOpen={true}
        onClose={handleClose}
      />,
      { wrapper: createWrapper() }
    );

    const cancelBtn = screen.getByTestId('cancel-assign-role-button');
    fireEvent.click(cancelBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);

    const closeBtn = screen.getByTestId('close-assign-role-modal');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(2);
  });
});
