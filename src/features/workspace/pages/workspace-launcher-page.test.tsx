import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { WorkspaceLauncherPage } from './workspace-launcher-page';
import * as usePermissionModule from '@/features/roles-permissions/hooks/use-permission';
import * as useEffectivePermissionsModule from '@/features/roles-permissions/hooks/use-effective-permissions';
import { useAuthStore } from '@/stores/auth-store';
import { ERP_MODULES } from '@/app/config/modules.config';

// Mock react-router-dom useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock toast feedback
const mockToastInfo = vi.fn();
const mockToastWarning = vi.fn();
vi.mock('@/components/feedback/toast', () => ({
  useToast: () => ({
    info: mockToastInfo,
    warning: mockToastWarning,
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

describe('WorkspaceLauncherPage & Permissions Alignment (Stage W1.1)', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock setup: all 12 modules permitted in active workspace
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        id: 'u-admin-1',
        email: 'admin@school.edu',
        firstName: 'School',
        lastName: 'Admin',
        role: 'SCHOOL_ADMIN',
      },
      workspaces: [
        {
          id: 'ws-1',
          code: 'SMH',
          name: "St. Mary's High School",
          academicYear: '2026-2027',
          role: 'SCHOOL_ADMIN',
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

    // Default permissions mock: universal permissions granted
    vi.spyOn(usePermissionModule, 'usePermission').mockReturnValue({
      hasPermission: true,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
      checkPermission: (_code: string) => true,
    });

    vi.spyOn(useEffectivePermissionsModule, 'useEffectivePermissions').mockReturnValue({
      permissions: [
        'academics',
        'students',
        'attendance',
        'fees',
        'staff',
        'exams',
        'front_office',
        'timetable',
        'transport',
        'library',
        'hostel',
        'settings',
      ],
      permissionsSet: new Set([
        'academics',
        'students',
        'attendance',
        'fees',
        'staff',
        'exams',
        'front_office',
        'timetable',
        'transport',
        'library',
        'hostel',
        'settings',
      ]),
      count: 12,
      computedAt: new Date().toISOString(),
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
      refetch: vi.fn(),
    });
  });

  // --------------------------------------------------------------------------
  // Criterion 1: Correct Category Grouping & System Category Removal
  // --------------------------------------------------------------------------
  it('1. correctly groups modules into the 4 canonical categories and removes the redundant System category', () => {
    render(
      <MemoryRouter>
        <WorkspaceLauncherPage />
      </MemoryRouter>
    );

    // Verify exactly 5 category tabs exist (All + 4 canonical)
    expect(screen.getByRole('button', { name: 'All Modules' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Academic Core' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Administration' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Finance' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Campus Life' })).toBeInTheDocument();

    // Verify obsolete 'System' tab is completely removed
    expect(screen.queryByRole('button', { name: 'System' })).not.toBeInTheDocument();

    // Filter to Academic Core (5 modules: Academics, Students, Attendance, Timetable, Exams)
    fireEvent.click(screen.getByRole('button', { name: 'Academic Core' }));
    expect(screen.getByRole('button', { name: /Academics & Curriculum -/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Students & Admissions -/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Attendance & Registers -/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Timetable & Schedules -/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Examinations & Marks -/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Administration -/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Fees & Finance -/i })).not.toBeInTheDocument();

    // Filter to Administration (3 modules: Staff & HR, Administration, Front Desk)
    fireEvent.click(screen.getByRole('button', { name: 'Administration' }));
    expect(screen.getByRole('button', { name: /Staff & Faculty -/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Administration -/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Front Desk & Reception -/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Academics & Curriculum -/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Transport & Fleet -/i })).not.toBeInTheDocument();

    // Filter to Finance (1 module: Fees & Finance)
    fireEvent.click(screen.getByRole('button', { name: 'Finance' }));
    expect(screen.getByRole('button', { name: /Fees & Finance -/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Staff & Faculty -/i })).not.toBeInTheDocument();

    // Filter to Campus Life (3 modules: Transport, Library, Hostel)
    fireEvent.click(screen.getByRole('button', { name: 'Campus Life' }));
    expect(screen.getByRole('button', { name: /Transport & Fleet -/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Library & Catalog -/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Hostel & Housing -/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Academics & Curriculum -/i })).not.toBeInTheDocument();
  });

  // --------------------------------------------------------------------------
  // Criterion 2: All Modules Filtering
  // --------------------------------------------------------------------------
  it('2. filters correctly and renders all 12 modules on the All Modules tab', () => {
    render(
      <MemoryRouter>
        <WorkspaceLauncherPage />
      </MemoryRouter>
    );

    // Initial state is 'all'
    for (const mod of ERP_MODULES) {
      expect(
        screen.getByRole('button', { name: new RegExp(`^${mod.name} -`, 'i') })
      ).toBeInTheDocument();
    }
  });

  // --------------------------------------------------------------------------
  // Criterion 3: Search Across Module Names, Descriptions, and Shortcuts
  // --------------------------------------------------------------------------
  it('3. filters modules dynamically using search query across names, descriptions, and shortcuts', () => {
    render(
      <MemoryRouter>
        <WorkspaceLauncherPage />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/search modules/i);

    // Search by shortcut 'Branches Master' -> should match Academics
    fireEvent.change(searchInput, { target: { value: 'Branches Master' } });
    expect(screen.getByRole('button', { name: /Academics & Curriculum -/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Hostel & Housing -/i })).not.toBeInTheDocument();

    // Search by description keyword 'biometric' -> should match Attendance
    fireEvent.change(searchInput, { target: { value: 'biometric' } });
    expect(screen.getByRole('button', { name: /Attendance & Registers -/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Academics & Curriculum -/i })).not.toBeInTheDocument();

    // Non-existent search query -> shows empty state
    fireEvent.change(searchInput, { target: { value: 'nonexistentmodulequery123' } });
    expect(screen.getByText('No matching modules found')).toBeInTheDocument();

    // Reset button clears query and restores modules
    fireEvent.click(screen.getByText('Reset Search & Filters'));
    expect(screen.getByRole('button', { name: /Academics & Curriculum -/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Administration -/i })).toBeInTheDocument();
  });

  // --------------------------------------------------------------------------
  // Criterion 4: Entitlement Without Permission Does Not Grant Access
  // --------------------------------------------------------------------------
  it('4. ensures entitlement without permission does not grant access (subscribed but unauthorized)', () => {
    // User only has permission for 'academics', but lacks 'settings' and 'fees'
    const allowed = new Set(['academics']);
    vi.spyOn(usePermissionModule, 'usePermission').mockReturnValue({
      hasPermission: false,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
      checkPermission: (code: string) => allowed.has(code),
    });
    vi.spyOn(useEffectivePermissionsModule, 'useEffectivePermissions').mockReturnValue({
      permissions: ['academics'],
      permissionsSet: allowed,
      count: 1,
      computedAt: new Date().toISOString(),
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <WorkspaceLauncherPage />
      </MemoryRouter>
    );

    // Administration is subscribed in workspace, but user lacks permission
    const adminTile = screen.getByLabelText(/Administration - Restricted/i);
    expect(adminTile).toBeInTheDocument();
    expect(adminTile).toHaveAttribute('aria-label', expect.stringContaining('Restricted'));

    // Clicking does not navigate
    fireEvent.click(adminTile);
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockToastWarning).toHaveBeenCalledWith(
      'Access Restricted',
      expect.stringContaining('required permission (settings)')
    );
  });

  // --------------------------------------------------------------------------
  // Criterion 5: Permission Without Entitlement Does Not Grant Access
  // --------------------------------------------------------------------------
  it('5. ensures permission without entitlement does not grant access (unsubscribed module)', () => {
    // Workspace has only 'academics' and 'settings' enabled, NOT 'hostel'
    useAuthStore.setState({
      workspaces: [
        {
          id: 'ws-1',
          code: 'SMH',
          name: "St. Mary's High School",
          academicYear: '2026-2027',
          role: 'TEACHER',
          permittedModules: ['academics', 'settings'],
        },
      ],
      user: {
        id: 'u-teacher-1',
        email: 'teacher@school.edu',
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'TEACHER',
      },
    });

    // User has permission for 'hostel' in their RBAC grants
    const allowed = new Set(['academics', 'settings', 'hostel']);
    vi.spyOn(usePermissionModule, 'usePermission').mockReturnValue({
      hasPermission: true,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
      checkPermission: (code: string) => allowed.has(code),
    });
    vi.spyOn(useEffectivePermissionsModule, 'useEffectivePermissions').mockReturnValue({
      permissions: ['academics', 'settings', 'hostel'],
      permissionsSet: allowed,
      count: 3,
      computedAt: new Date().toISOString(),
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <WorkspaceLauncherPage />
      </MemoryRouter>
    );

    // Hostel is unsubscribed by the organization
    const hostelTile = screen.getByLabelText(/Hostel.*Not Subscribed/i);
    expect(hostelTile).toBeInTheDocument();

    // Clicking does not navigate
    fireEvent.click(hostelTile);
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockToastInfo).toHaveBeenCalledWith(
      'Module Not Subscribed',
      expect.stringContaining('not included in your institution')
    );
  });

  // --------------------------------------------------------------------------
  // Criterion 6: Missing Permission Mapping Fails Closed
  // --------------------------------------------------------------------------
  it('6. fails closed when a module has no verified permission mapping', () => {
    // If permissions cannot be fetched or fail
    vi.spyOn(usePermissionModule, 'usePermission').mockReturnValue({
      hasPermission: false,
      isLoading: false,
      isError: false,
      isSuccess: false,
      error: null,
      checkPermission: () => false,
    });
    vi.spyOn(useEffectivePermissionsModule, 'useEffectivePermissions').mockReturnValue({
      permissions: [],
      permissionsSet: new Set(),
      count: 0,
      computedAt: null,
      isLoading: false,
      isError: false,
      isSuccess: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <WorkspaceLauncherPage />
      </MemoryRouter>
    );

    // All modules should be locked/restricted
    const restrictedTiles = screen.getAllByText('Restricted');
    expect(restrictedTiles.length).toBe(12);
  });

  // --------------------------------------------------------------------------
  // Criterion 7: Platform Administrator Authorization Boundary
  // --------------------------------------------------------------------------
  it('7. preserves platform administrator authorization boundary (SUPER_ADMIN / PLATFORM userType)', () => {
    // Set user as platform SUPER_ADMIN
    useAuthStore.setState({
      user: {
        id: 'u-super-1',
        email: 'super@platform.gov',
        firstName: 'Platform',
        lastName: 'Admin',
        role: 'SUPER_ADMIN',
        userType: 'PLATFORM',
      },
      workspaces: [],
    });

    // Even if checkPermission returns false, super-admin bypass applies
    vi.spyOn(usePermissionModule, 'usePermission').mockReturnValue({
      hasPermission: true,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
      checkPermission: () => false,
    });

    render(
      <MemoryRouter>
        <WorkspaceLauncherPage />
      </MemoryRouter>
    );

    // Implemented module (Administration) should be directly clickable and navigate
    const adminTile = screen.getByLabelText(/Administration - Available/i);
    expect(adminTile).toBeInTheDocument();
    fireEvent.click(adminTile);
    expect(mockNavigate).toHaveBeenCalledWith('/admin');

    // Planned modules (Academics) show Planned status even for super-admin
    const academicsTile = screen.getByLabelText(/Academics & Curriculum - Planned/i);
    expect(academicsTile).toBeInTheDocument();
  });

  // --------------------------------------------------------------------------
  // Criterion 8: Unimplemented Modules Do Not Navigate to Dead Routes
  // --------------------------------------------------------------------------
  it('8. prevents navigation to dead feature routes for unimplemented modules while allowing operational ones', () => {
    render(
      <MemoryRouter>
        <WorkspaceLauncherPage />
      </MemoryRouter>
    );

    // 1. Unimplemented module: Students (authorized & subscribed, but not yet implemented)
    const studentsTile = screen.getByLabelText(/Students & Admissions - Planned/i);
    expect(studentsTile).toBeInTheDocument();

    fireEvent.click(studentsTile);
    // MUST NOT navigate to /app/students!
    expect(mockNavigate).not.toHaveBeenCalledWith('/app/students');
    expect(mockToastInfo).toHaveBeenCalledWith(
      'Module in Development',
      expect.stringContaining('is scheduled in the School ERP roadmap and is not yet operational')
    );

    // 2. Unimplemented module: Fees (authorized & subscribed, but not yet implemented)
    const feesTile = screen.getByLabelText(/Fees & Finance - Planned/i);
    fireEvent.click(feesTile);
    expect(mockNavigate).not.toHaveBeenCalledWith('/app/fees');

    // 3. Unimplemented module: Academics (under development, accurately presented as Planned)
    const academicsTile = screen.getByLabelText(/Academics & Curriculum - Planned/i);
    fireEvent.click(academicsTile);
    expect(mockNavigate).not.toHaveBeenCalledWith('/app/academics/branches');

    // 4. Implemented module: Administration navigates to operational route
    const adminTile = screen.getByLabelText(/Administration - Available/i);
    fireEvent.click(adminTile);
    expect(mockNavigate).toHaveBeenCalledWith('/admin');
  });

  // --------------------------------------------------------------------------
  // Criterion 10: Existing Workspace Launcher Keyboard Navigation & Accessibility
  // --------------------------------------------------------------------------
  it('10. preserves keyboard navigation and accessibility attributes on module tiles', () => {
    render(
      <MemoryRouter>
        <WorkspaceLauncherPage />
      </MemoryRouter>
    );

    const adminTile = screen.getByLabelText(/Administration - Available/i);
    expect(adminTile).toHaveAttribute('tabIndex', '0');
    expect(adminTile).toHaveAttribute('role', 'button');

    // Enter key activates tile
    fireEvent.keyDown(adminTile, { key: 'Enter' });
    expect(mockNavigate).toHaveBeenCalledWith('/admin');

    // Space key activates tile
    fireEvent.keyDown(adminTile, { key: ' ' });
    expect(mockNavigate).toHaveBeenCalledTimes(2);
  });
});
