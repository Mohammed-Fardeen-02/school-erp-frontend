import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Breadcrumb } from './breadcrumb';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Breadcrumb Layout Component (Stage W1.4)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders breadcrumb items in an accessible semantic list', () => {
    render(
      <MemoryRouter>
        <Breadcrumb
          items={[
            { label: 'Workspace', href: '/workspace' },
            { label: 'Administration', href: '/admin' },
            { label: 'Users' },
          ]}
        />
      </MemoryRouter>
    );

    const nav = screen.getByRole('navigation', { name: /breadcrumb/i });
    expect(nav).toBeInTheDocument();

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);

    const activeItem = screen.getByRole('button', { name: 'Users' });
    expect(activeItem).toHaveAttribute('aria-current', 'page');
    expect(activeItem).toBeDisabled();
  });

  it('navigates to parent route on click', () => {
    render(
      <MemoryRouter>
        <Breadcrumb
          items={[
            { label: 'Workspace', href: '/workspace' },
            { label: 'Administration', href: '/admin' },
            { label: 'Users' },
          ]}
        />
      </MemoryRouter>
    );

    const adminBtn = screen.getByRole('button', { name: 'Administration' });
    fireEvent.click(adminBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/admin');
  });

  it('renders optional back button and triggers navigation', () => {
    render(
      <MemoryRouter>
        <Breadcrumb
          items={[{ label: 'Users', href: '/admin/users' }, { label: 'Edit User' }]}
          backTo="/admin/users"
        />
      </MemoryRouter>
    );

    const backBtn = screen.getByRole('button', { name: /go back/i });
    expect(backBtn).toBeInTheDocument();

    fireEvent.click(backBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/admin/users');
  });

  it('renders actions slot cleanly', () => {
    render(
      <MemoryRouter>
        <Breadcrumb
          items={[{ label: 'Users' }]}
          actions={<button type="button">Create User</button>}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: 'Create User' })).toBeInTheDocument();
  });
});

