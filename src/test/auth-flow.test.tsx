import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from '@/pages/auth/login-page';
import { SelectWorkspacePage } from '@/pages/workspace/select-workspace-page';
import { WorkspaceLauncherPage } from '@/pages/workspace/workspace-launcher-page';
import { useAuthStore } from '@/stores/auth-store';

describe('Authentication Flow & Workspace Launcher', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({
      isAuthenticated: false,
      user: null,
      workspaces: [],
      activeWorkspaceId: null,
    });
  });

  it('renders login form and validates required fields', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Sign In to Your Account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Institutional Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();

    const submitBtn = screen.getByRole('button', { name: /^Sign In$/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });
  });

  it('toggles password visibility when show/hide button is clicked', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const passwordInput = screen.getByLabelText(/^Password$/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    const toggleBtn = screen.getByRole('button', { name: /Show password/i });
    fireEvent.click(toggleBtn);

    expect(passwordInput).toHaveAttribute('type', 'text');

    const hideBtn = screen.getByRole('button', { name: /Hide password/i });
    fireEvent.click(hideBtn);

    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('populates fields when demo persona buttons are clicked', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const adminChip = screen.getByRole('button', { name: /Multi-School Admin/i });
    fireEvent.click(adminChip);

    const emailInput = screen.getByLabelText(/Institutional Email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/^Password$/i) as HTMLInputElement;

    expect(emailInput.value).toBe('admin@schoolerp.io');
    expect(passwordInput.value).toBe('Password123!');
  });

  it('rejects invalid credentials and throws authentication error', async () => {
    const { login } = useAuthStore.getState();
    await expect(
      login({ email: 'unknown@schoolerp.io', password: 'WrongPassword!' })
    ).rejects.toThrow(/Invalid email or password/i);
  });

  it('renders workspace selector with multi-school cards', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        id: 'usr-admin-01',
        name: 'Dr. Catherine Vance',
        email: 'admin@schoolerp.io',
        role: 'super_admin',
        roleName: 'Executive Director',
      },
      workspaces: [
        {
          id: 'ws-st-marys',
          name: "St. Mary's High School",
          code: 'SMHS-01',
          academicYear: '2026-2027',
          roleInSchool: 'Executive Director',
          planName: 'Enterprise Edition',
          enabledModules: ['academics', 'students', 'attendance'],
        },
        {
          id: 'ws-greenwood',
          name: 'Greenwood International Academy',
          code: 'GIA-02',
          academicYear: '2026-2027',
          roleInSchool: 'Board Advisor',
          planName: 'Standard Academic',
          enabledModules: ['academics'],
        },
      ],
      activeWorkspaceId: 'ws-st-marys',
    });

    render(
      <MemoryRouter>
        <SelectWorkspacePage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /Select Your School Workspace/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/St. Mary's High School/i)).toBeInTheDocument();
    expect(screen.getByText(/Greenwood International Academy/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Workspace/i)).toBeInTheDocument();
  });

  it('renders empty state when user has no school workspaces assigned', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        id: 'usr-pending-03',
        name: 'Jordan Hayes',
        email: 'pending@schoolerp.io',
        role: 'staff',
        roleName: 'Pending Provisioning',
      },
      workspaces: [],
      activeWorkspaceId: null,
    });

    render(
      <MemoryRouter>
        <SelectWorkspacePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/No School Workspaces Available/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Out/i })).toBeInTheDocument();
  });

  it('renders workspace launcher with permitted modules and school info', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        id: 'usr-teacher-02',
        name: 'Marcus Bell',
        email: 'teacher@schoolerp.io',
        role: 'teacher',
        roleName: 'Senior Faculty',
      },
      workspaces: [
        {
          id: 'ws-st-marys',
          name: "St. Mary's High School",
          code: 'SMHS-01',
          academicYear: '2026-2027',
          roleInSchool: 'Senior Faculty',
          planName: 'Enterprise Edition',
          enabledModules: ['academics', 'attendance'],
        },
      ],
      activeWorkspaceId: 'ws-st-marys',
    });

    render(
      <MemoryRouter>
        <WorkspaceLauncherPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/St. Mary's High School/i)).toBeInTheDocument();
    expect(screen.getByText(/2 Modules Authorized/i)).toBeInTheDocument();

    // Check authorized modules have 'Open Module' button
    const openButtons = screen.getAllByRole('button', { name: /Open Module/i });
    expect(openButtons.length).toBe(2);

    // Check non-enabled modules have disabled button
    const disabledButtons = screen.getAllByRole('button', { name: /Module Not Enabled/i });
    expect(disabledButtons.length).toBeGreaterThan(0);
  });
});
