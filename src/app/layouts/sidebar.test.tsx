import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { useAuthStore } from '@/stores/auth-store';
import { useUiStore } from '@/stores/ui-store';
import * as usePermissionModule from '@/features/roles-permissions/hooks/use-permission';
import * as useEffectivePermissionsModule from '@/features/roles-permissions/hooks/use-effective-permissions';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Sidebar Component (Stage W1.2)', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        id: 'u-1',
        email: 'user@school.edu',
        role: 'SCHOOL_ADMIN',
      },
      workspaces: [
        {
          id: 'ws-1',
          code: 'SMH',
          name: "St. Mary's High School",
          academicYear: '2026-2027',
          permittedModules: [
            'academics',
            'students',
            'attendance',
            'fees',
            'staff',
            'exams',
            'front-office',
            'timetable',
            'transport',
            'library',
            'hostel',
            'settings',
          ],
        },
      ],
      activeWorkspaceId: 'ws-1',
    });

    useUiStore.setState({
      sidebarCollapsed: false,
      mobileSidebarOpen: false,
    });

    vi.spyOn(usePermissionModule, 'usePermission').mockReturnValue({
      hasPermission: true,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
      checkPermission: () => true,
    });

    vi.spyOn(useEffectivePermissionsModule, 'useEffectivePermissions').mockReturnValue({
      permissions: ['settings.roles_permissions.rbac.view', 'organizations.manage'],
      permissionsSet: new Set(['settings.roles_permissions.rbac.view', 'organizations.manage']),
      count: 2,
      computedAt: new Date().toISOString(),
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
      refetch: vi.fn(),
    });
  });

  // 1. Scoped Module Sidebar for /admin: renders 10 operational items
  it('1. renders operational administrative items for /admin routes', () => {
    render(
      <MemoryRouter initialEntries={['/admin/organizations']}>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByText('Administration')).toBeInTheDocument();
    expect(screen.getByText('Organization Management')).toBeInTheDocument();
    expect(screen.getByText('Branches & Campuses')).toBeInTheDocument();
    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByText('Roles & Permissions')).toBeInTheDocument();
    expect(screen.getByText('Audit & Compliance Logs')).toBeInTheDocument();
  });

  // 2. Unauthorized links are hidden
  it('2. hides links that require permissions the user does not possess', () => {
    // User only has permission to view organizations, not audit logs or user management
    const allowed = new Set(['organizations.manage']);
    vi.spyOn(usePermissionModule, 'usePermission').mockReturnValue({
      hasPermission: false,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
      checkPermission: (code: string) => allowed.has(code),
    });

    render(
      <MemoryRouter initialEntries={['/admin/organizations']}>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByText('Organization Management')).toBeInTheDocument();
    expect(screen.getByText('Branches & Campuses')).toBeInTheDocument();
    // Audit logs & User management should be hidden
    expect(screen.queryByText('Audit & Compliance Logs')).not.toBeInTheDocument();
    expect(screen.queryByText('User Management')).not.toBeInTheDocument();
  });

  // 3. Unsubscribed modules are hidden in sidebar
  it('3. filters out items for modules not subscribed by the organization', () => {
    useAuthStore.setState({
      workspaces: [
        {
          id: 'ws-1',
          code: 'SMH',
          name: "St. Mary's High School",
          permittedModules: ['academics', 'settings'],
        },
      ],
      activeWorkspaceId: 'ws-1',
    });

    render(
      <MemoryRouter initialEntries={['/workspace']}>
        <Sidebar />
      </MemoryRouter>
    );

    // Subscribed modules should be visible in overview
    expect(screen.getByText('Administration')).toBeInTheDocument();
    expect(screen.getByText('Academics')).toBeInTheDocument();
    // Unsubscribed modules (e.g. Hostel, Transport) should be filtered out
    expect(screen.queryByText('Hostel')).not.toBeInTheDocument();
    expect(screen.queryByText('Transport')).not.toBeInTheDocument();
  });

  // 4. Dead routes are not exposed for Academics
  it('4. exposes only operational features (Branches Master) for Academics, without dead links', () => {
    render(
      <MemoryRouter initialEntries={['/app/academics/branches']}>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByText('Academics & Curriculum')).toBeInTheDocument();
    expect(screen.getByText('Branches Master')).toBeInTheDocument();
    // Dead routes must not exist
    expect(screen.queryByText('Classes & Sections')).not.toBeInTheDocument();
    expect(screen.queryByText('Curriculum & Subjects')).not.toBeInTheDocument();
    expect(screen.queryByText('Class Timetable')).not.toBeInTheDocument();
  });

  // 5. Active route highlighting
  it('5. highlights the currently active route', () => {
    render(
      <MemoryRouter initialEntries={['/admin/organizations']}>
        <Sidebar />
      </MemoryRouter>
    );

    const orgButton = screen.getByRole('button', { name: /Organization Management/i });
    expect(orgButton.className).toContain('text-primary');
  });

  // 6. Navigation click triggers navigate
  it('6. navigates to route when item is clicked', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Sidebar />
      </MemoryRouter>
    );

    const branchesButton = screen.getByRole('button', { name: /Branches & Campuses/i });
    fireEvent.click(branchesButton);
    expect(mockNavigate).toHaveBeenCalledWith('/admin/branches');
  });

  // 7. Mobile sidebar drawer closes on Escape key
  it('7. closes mobile sidebar on Escape key', () => {
    useUiStore.setState({ mobileSidebarOpen: true });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Sidebar />
      </MemoryRouter>
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(useUiStore.getState().mobileSidebarOpen).toBe(false);
  });
});

