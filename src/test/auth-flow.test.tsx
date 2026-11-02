import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from '@/features/auth';
import { SelectWorkspacePage, WorkspaceLauncherPage } from '@/features/workspace';
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

    expect(screen.getByRole('heading', { name: /Institutional Sign In/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Institutional Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();

    const submitBtn = screen.getByRole('button', { name: /Sign In to Workspace/i });
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
        firstName: 'Eleanor',
        lastName: 'Vance',
        email: 'admin@schoolerp.io',
        role: 'SCHOOL_ADMIN',
      },
      workspaces: [
        {
          id: 'ws-st-marys',
          name: "St. Mary's High School",
          code: 'SMHS-01',
          academicYear: '2026-2027',
          role: 'SCHOOL_ADMIN',
          permittedModules: ['academics', 'students', 'attendance'],
          campusName: 'Main Campus',
        },
        {
          id: 'ws-greenwood',
          name: 'Greenwood International Academy',
          code: 'GIA-02',
          academicYear: '2026-2027',
          role: 'PRINCIPAL',
          permittedModules: ['academics'],
          campusName: 'North Campus',
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
      screen.getByRole('heading', { name: /Select Institutional Workspace/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/St. Mary's High School/i)).toBeInTheDocument();
    expect(screen.getByText(/Greenwood International Academy/i)).toBeInTheDocument();
    expect(screen.getByText(/Current/i)).toBeInTheDocument();
  });

  it('renders empty state when user has no school workspaces assigned', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        id: 'usr-pending-03',
        firstName: 'Sarah',
        lastName: 'Jenkins',
        email: 'pending@schoolerp.io',
        role: 'STUDENT',
      },
      workspaces: [],
      activeWorkspaceId: null,
    });

    render(
      <MemoryRouter>
        <SelectWorkspacePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/No Accessible School Found/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Out of Account/i })).toBeInTheDocument();
  });

  it('renders workspace launcher desk with permitted modules and school info', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        id: 'usr-teacher-02',
        firstName: 'Marcus',
        lastName: 'Chen',
        email: 'teacher@schoolerp.io',
        role: 'TEACHER',
      },
      workspaces: [
        {
          id: 'ws-st-marys',
          name: "St. Mary's High School",
          code: 'SMHS-01',
          academicYear: '2026-2027',
          role: 'TEACHER',
          permittedModules: ['academics', 'attendance'],
          campusName: 'Main Campus',
        },
      ],
      activeWorkspaceId: 'ws-st-marys',
    });

    render(
      <MemoryRouter>
        <WorkspaceLauncherPage />
      </MemoryRouter>
    );

    expect(screen.getAllByText(/St. Mary's High School/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Accessible Modules & Workspaces/i)).toBeInTheDocument();

    // Check permitted modules display 'Permitted'
    const permittedBadges = screen.getAllByText(/Permitted/i);
    expect(permittedBadges.length).toBeGreaterThan(0);

    // Check non-permitted modules display 'Restricted'
    const restrictedBadges = screen.getAllByText(/Restricted/i);
    expect(restrictedBadges.length).toBeGreaterThan(0);
  });
});
