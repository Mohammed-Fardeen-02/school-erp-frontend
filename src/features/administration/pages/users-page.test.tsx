import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { UsersPage } from './users-page';
import * as useAdminHooks from '../hooks/use-admin';
import * as useRolesHooks from '@/features/roles-permissions/hooks/use-roles';

vi.mock('../hooks/use-admin', () => ({
  useAdminUsers: vi.fn(),
  useInviteUser: vi.fn(),
  useSaveUser: vi.fn(),
  useToggleUserStatus: vi.fn(),
  useAdminCampuses: vi.fn(),
}));

vi.mock('@/features/roles-permissions/hooks/use-roles', () => ({
  useRolesList: vi.fn(),
}));

const mockUsers = [
  {
    id: 'usr-1',
    userCode: 'USR-001',
    email: 'alice.smith@school.edu',
    firstName: 'Alice',
    lastName: 'Smith',
    phone: '+1-555-0101',
    status: 'ACTIVE' as const,
    userType: 'TENANT' as const,
    primaryRole: 'Teacher',
    assignedCampus: 'Main Campus',
    twoFactorEnabled: false,
    lastLoginAt: '2026-11-15T10:00:00Z',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'usr-2',
    userCode: 'USR-002',
    email: 'bob.jones@school.edu',
    firstName: 'Bob',
    lastName: 'Jones',
    phone: null,
    status: 'INVITED' as const,
    userType: 'TENANT' as const,
    primaryRole: 'Finance Officer',
    assignedCampus: 'All-Campus Scope',
    twoFactorEnabled: false,
    lastLoginAt: null,
    createdAt: '2026-11-18T10:00:00Z',
  },
];

const mockRoles = [
  { id: 'role-1', roleName: 'Teacher', roleCode: 'TEACHER' },
  { id: 'role-2', roleName: 'Finance Officer', roleCode: 'BURSAR' },
];

const mockCampuses = [
  { id: 'loc-1', name: 'Main Campus', code: 'MAIN', isMainCampus: true },
  { id: 'loc-2', name: 'North Branch', code: 'NORTH', isMainCampus: false },
];

describe('UsersPage', () => {
  let queryClient: QueryClient;
  const mockMutateInvite = vi.fn();
  const mockMutateSave = vi.fn();
  const mockMutateToggle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    vi.mocked(useAdminHooks.useAdminUsers).mockReturnValue({
      data: {
        users: mockUsers,
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
      isLoading: false,
      error: null,
    } as any);

    vi.mocked(useRolesHooks.useRolesList).mockReturnValue({
      data: { roles: mockRoles },
      isLoading: false,
    } as any);

    vi.mocked(useAdminHooks.useAdminCampuses).mockReturnValue({
      data: mockCampuses,
      isLoading: false,
    } as any);

    vi.mocked(useAdminHooks.useInviteUser).mockReturnValue({
      mutateAsync: mockMutateInvite,
      isPending: false,
    } as any);

    vi.mocked(useAdminHooks.useSaveUser).mockReturnValue({
      mutateAsync: mockMutateSave,
      isPending: false,
    } as any);

    vi.mocked(useAdminHooks.useToggleUserStatus).mockReturnValue({
      mutateAsync: mockMutateToggle,
      isPending: false,
    } as any);
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UsersPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('renders page header and stats cards correctly', () => {
    renderComponent();

    expect(screen.getByRole('heading', { level: 1, name: /user management/i })).toBeInTheDocument();
    expect(screen.getByText('Active Accounts')).toBeInTheDocument();
    expect(screen.getByText('Pending Invites')).toBeInTheDocument();
    expect(screen.getByText('Total Registered')).toBeInTheDocument();
  });

  it('renders users table rows with names, roles, and status', () => {
    renderComponent();

    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('alice.smith@school.edu')).toBeInTheDocument();
    expect(screen.getByText('Teacher')).toBeInTheDocument();

    expect(screen.getByText('Bob Jones')).toBeInTheDocument();
    expect(screen.getByText('bob.jones@school.edu')).toBeInTheDocument();
    expect(screen.getByText('Finance Officer')).toBeInTheDocument();
  });

  it('renders role and campus filter dropdowns', () => {
    renderComponent();

    expect(screen.getByText('All Roles')).toBeInTheDocument();
    expect(screen.getByText('All Campus Scopes')).toBeInTheDocument();
  });

  it('opens InviteUserModal when clicking "Invite User" button', async () => {
    renderComponent();

    const inviteBtn = screen.getByRole('button', { name: /invite user/i });
    fireEvent.click(inviteBtn);

    await waitFor(() => {
      expect(screen.getByText('Invite Institutional User')).toBeInTheDocument();
    });
  });

  it('opens UserViewDrawer when a row is clicked', async () => {
    renderComponent();

    const aliceRow = screen.getByText('Alice Smith');
    fireEvent.click(aliceRow);

    await waitFor(() => {
      expect(screen.getByText('User Identifier Code')).toBeInTheDocument();
    });
  });

  it('displays query error banner if loading users fails', () => {
    vi.mocked(useAdminHooks.useAdminUsers).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Network error: Tenant context missing'),
    } as any);

    renderComponent();

    expect(screen.getByText(/Network error: Tenant context missing/i)).toBeInTheDocument();
  });
});

