import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Header } from './header';
import { useAuthStore } from '@/stores/auth-store';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Header Layout Component (Stage W1.1 Criterion 9)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        id: 'u-1',
        email: 'user@test.edu',
        firstName: 'John',
        lastName: 'Doe',
        role: 'SCHOOL_ADMIN',
      },
      workspaces: [
        {
          id: 'ws-1',
          code: 'SMH',
          name: "St. Mary's High School",
          academicYear: '2026-2027',
          role: 'SCHOOL_ADMIN',
          permittedModules: ['settings'],
        },
      ],
      activeWorkspaceId: 'ws-1',
    });
  });

  it('removes fabricated unread notification badge and prevents navigation to /notifications', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    // Verify no fabricated unread count ('3' or similar badge) is displayed
    expect(screen.queryByText('3')).not.toBeInTheDocument();

    const bellBtn = screen.getByRole('button', { name: /view notifications/i });
    expect(bellBtn).toBeInTheDocument();

    // Clicking notification bell must NOT navigate to /notifications
    fireEvent.click(bellBtn);
    expect(mockNavigate).not.toHaveBeenCalledWith('/notifications');

    // Instead, verifies that the non-navigating informational dialog is toggled open
    expect(screen.getByRole('dialog', { name: /notifications/i })).toBeInTheDocument();
    expect(screen.getByText('No Active Notifications')).toBeInTheDocument();
    expect(
      screen.getByText(/Institutional alerts, system notices, and broadcast messages will be displayed here/i)
    ).toBeInTheDocument();

    // Clicking bell again toggles dialog closed
    fireEvent.click(bellBtn);
    expect(screen.queryByRole('dialog', { name: /notifications/i })).not.toBeInTheDocument();
  });
});

