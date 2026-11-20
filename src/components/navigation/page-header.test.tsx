import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { WorkspacePageHeader } from './page-header';
import { useUiStore } from '@/stores/ui-store';
import { Users } from 'lucide-react';

describe('WorkspacePageHeader Component (Stage W1.4)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders semantic accessible heading and synchronizes title with ui-store', () => {
    render(
      <MemoryRouter>
        <WorkspacePageHeader
          title="Classes & Sections"
          subtitle="Manage institutional class structures"
          breadcrumbs={[{ label: 'Workspace', href: '/workspace' }, { label: 'Classes' }]}
        />
      </MemoryRouter>
    );

    // Semantic h1 for accessibility
    const h1 = screen.getByRole('heading', { level: 1, name: 'Classes & Sections' });
    expect(h1).toBeInTheDocument();
    expect(h1).toHaveClass('sr-only');

    // UI store synchronized
    expect(useUiStore.getState().pageTitle).toBe('Classes & Sections');
    expect(useUiStore.getState().pageSubtitle).toBe('Manage institutional class structures');
  });

  it('renders primary and secondary action buttons and handles clicks', () => {
    const handlePrimaryClick = vi.fn();
    const handleSecondaryClick = vi.fn();

    render(
      <MemoryRouter>
        <WorkspacePageHeader
          title="Users"
          breadcrumbs={[{ label: 'Users' }]}
          primaryAction={{
            label: 'Add User',
            onClick: handlePrimaryClick,
          }}
          secondaryActions={
            <button type="button" onClick={handleSecondaryClick}>
              Export CSV
            </button>
          }
        />
      </MemoryRouter>
    );

    const primaryBtn = screen.getByRole('button', { name: /add user/i });
    expect(primaryBtn).toBeInTheDocument();
    fireEvent.click(primaryBtn);
    expect(handlePrimaryClick).toHaveBeenCalledTimes(1);

    const secondaryBtn = screen.getByRole('button', { name: /export csv/i });
    expect(secondaryBtn).toBeInTheDocument();
    fireEvent.click(secondaryBtn);
    expect(handleSecondaryClick).toHaveBeenCalledTimes(1);
  });

  it('supports legacy AdminPageHeader props (actionLabel, onActionClick, extraActions)', () => {
    const handleLegacyClick = vi.fn();

    render(
      <MemoryRouter>
        <WorkspacePageHeader
          title="Roles & Permissions"
          breadcrumbs={[{ label: 'Roles' }]}
          actionLabel="Create Custom Role"
          onActionClick={handleLegacyClick}
          extraActions={<span>Custom Extra Action</span>}
        />
      </MemoryRouter>
    );

    const actionBtn = screen.getByRole('button', { name: /create custom role/i });
    expect(actionBtn).toBeInTheDocument();
    fireEvent.click(actionBtn);
    expect(handleLegacyClick).toHaveBeenCalledTimes(1);

    expect(screen.getByText('Custom Extra Action')).toBeInTheDocument();
  });

  it('renders visual banner with icon, title, and status badge when provided', () => {
    render(
      <MemoryRouter>
        <WorkspacePageHeader
          title="Branches Master"
          subtitle="All active school campuses"
          icon={Users}
          badge={<span data-testid="status-badge">Active Session</span>}
        />
      </MemoryRouter>
    );

    expect(screen.getByTestId('status-badge')).toHaveTextContent('Active Session');
    expect(screen.getAllByText('Branches Master').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('All active school campuses')).toBeInTheDocument();
  });
});
