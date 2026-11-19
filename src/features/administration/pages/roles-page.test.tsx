import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { RolesPage } from './roles-page';
import * as useRolesHooks from '@/features/roles-permissions/hooks/use-roles';
import type { RoleSummary } from '@/features/roles-permissions/types/roles.types';

vi.mock('@/features/roles-permissions/hooks/use-roles', () => ({
  useRolesList: vi.fn(),
  useCloneTemplate: vi.fn(),
  useDeleteRole: vi.fn(),
  useToggleRoleStatus: vi.fn(),
  useUpdateRole: vi.fn(),
}));

vi.mock('@/features/roles-permissions/components/assignments/user-assignments-panel', () => ({
  UserAssignmentsPanel: () => <div data-testid="mock-user-assignments-panel">Mock User Assignments Panel</div>,
}));

const mockRoles: RoleSummary[] = [
  {
    id: 'role-1',
    organizationId: null,
    roleCode: 'ORG_ADMIN',
    roleName: 'Organization Administrator',
    description: 'Full institutional administrative access',
    roleType: 'SYSTEM_TEMPLATE',
    isActive: true,
    assignmentCount: 4,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-11-19T00:00:00Z',
  },
  {
    id: 'role-2',
    organizationId: 'org-test-1',
    roleCode: 'ROLE_EXAM_COORDINATOR',
    roleName: 'Exam Coordinator',
    description: 'Manages exams, schedules, and grade entries',
    roleType: 'CUSTOM',
    isActive: true,
    assignmentCount: 2,
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-11-19T00:00:00Z',
  },
  {
    id: 'role-3',
    organizationId: 'org-test-1',
    roleCode: 'ROLE_DEPUTY_PRINCIPAL',
    roleName: 'Deputy Principal',
    description: 'Campus level academic and disciplinary management',
    roleType: 'CUSTOM',
    isActive: false,
    assignmentCount: 0,
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-11-19T00:00:00Z',
  },
];

describe('RolesPage (Administration Workspace)', () => {
  let queryClient: QueryClient;
  const mockClone = vi.fn();
  const mockDelete = vi.fn();
  const mockToggleStatus = vi.fn();
  const mockUpdateRole = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    vi.mocked(useRolesHooks.useRolesList).mockReturnValue({
      data: {
        roles: mockRoles,
        total: 3,
        page: 1,
        limit: 50,
      },
      isLoading: false,
    } as any);

    vi.mocked(useRolesHooks.useCloneTemplate).mockReturnValue({
      mutateAsync: mockClone,
      isPending: false,
    } as any);

    vi.mocked(useRolesHooks.useDeleteRole).mockReturnValue({
      mutateAsync: mockDelete,
      isPending: false,
    } as any);

    vi.mocked(useRolesHooks.useToggleRoleStatus).mockReturnValue({
      mutateAsync: mockToggleStatus,
      isPending: false,
    } as any);

    vi.mocked(useRolesHooks.useUpdateRole).mockReturnValue({
      mutateAsync: mockUpdateRole,
      isPending: false,
    } as any);
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RolesPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('renders page header and stats cards correctly', () => {
    renderComponent();

    expect(screen.getByRole('heading', { level: 1, name: /Roles & Permissions Management/i })).toBeInTheDocument();
    expect(screen.getByText('Active Roles')).toBeInTheDocument();
    expect(screen.getByText('Custom Roles')).toBeInTheDocument();
    expect(screen.getByText('System Templates')).toBeInTheDocument();
    expect(screen.getByText('Total Configured')).toBeInTheDocument();
  });

  it('renders role table with names, codes, types, and counts', () => {
    renderComponent();

    expect(screen.getByText('Organization Administrator')).toBeInTheDocument();
    expect(screen.getByText('Code: ORG_ADMIN')).toBeInTheDocument();
    expect(screen.getByText('4 Members')).toBeInTheDocument();

    expect(screen.getByText('Exam Coordinator')).toBeInTheDocument();
    expect(screen.getByText('Code: ROLE_EXAM_COORDINATOR')).toBeInTheDocument();
    expect(screen.getByText('2 Members')).toBeInTheDocument();
  });

  it('filters by Custom Roles and System Templates tabs', () => {
    renderComponent();

    const customTab = screen.getByRole('button', { name: /Custom Roles/i });
    fireEvent.click(customTab);

    expect(screen.getByText('Exam Coordinator')).toBeInTheDocument();
    expect(screen.queryByText('Organization Administrator')).not.toBeInTheDocument();

    const templatesTab = screen.getByRole('button', { name: /System Templates/i });
    fireEvent.click(templatesTab);

    expect(screen.getByText('Organization Administrator')).toBeInTheDocument();
    expect(screen.queryByText('Exam Coordinator')).not.toBeInTheDocument();
  });

  it('toggles top level view mode between roles and member allocations', () => {
    renderComponent();

    const allocationsBtn = screen.getByRole('button', { name: /Member Role Allocations/i });
    fireEvent.click(allocationsBtn);

    expect(screen.getByTestId('mock-user-assignments-panel')).toBeInTheDocument();

    const rolesBtn = screen.getByRole('button', { name: /Roles & Capability Profiles/i });
    fireEvent.click(rolesBtn);

    expect(screen.queryByTestId('mock-user-assignments-panel')).not.toBeInTheDocument();
    expect(screen.getByText('Organization Administrator')).toBeInTheDocument();
  });

  it('opens RoleViewDrawer on row click', async () => {
    renderComponent();

    const roleRow = screen.getByText('Organization Administrator');
    fireEvent.click(roleRow);

    await waitFor(() => {
      expect(screen.getByText('Platform Immutable Baseline')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Inspect Capability Matrix/i })).toBeInTheDocument();
    });
  });
});

