import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from './App';
import { useAuthStore } from './stores/auth-store';

describe('Application Foundation & Landing Page', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({
      isAuthenticated: false,
      user: null,
      workspaces: [],
      activeWorkspaceId: null,
    });
  });

  it('renders the public landing page with header and architecture block', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /Unified Platform for Modern/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Frontend Architecture Foundation/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Architecture Status/i })).toBeInTheDocument();
    expect(screen.getByText(/0 \(Skeleton Only\)/i)).toBeInTheDocument();
  });

  it('renders product capabilities and sign in CTA', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /Modular Platform Capabilities/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In to School ERP/i })).toBeInTheDocument();
  });
});
