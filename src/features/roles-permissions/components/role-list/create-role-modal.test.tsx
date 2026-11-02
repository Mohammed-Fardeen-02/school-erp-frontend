import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, render, fireEvent } from '@testing-library/react';
import { CreateRoleModal } from './create-role-modal';

describe('CreateRoleModal Component', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <CreateRoleModal isOpen={false} onClose={vi.fn()} onSubmit={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders modal inputs and validates required fields', () => {
    const handleSubmit = vi.fn();
    render(<CreateRoleModal isOpen={true} onClose={vi.fn()} onSubmit={handleSubmit} />);

    expect(screen.getByText('Create Custom Role')).toBeInTheDocument();

    const submitBtn = screen.getByRole('button', { name: /Create Role/i });
    fireEvent.click(submitBtn);

    // Should show validation error and not call onSubmit
    expect(screen.getByText(/Role code must be at least 2 characters/i)).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('submits valid uppercase roleCode and roleName', () => {
    const handleSubmit = vi.fn();
    render(<CreateRoleModal isOpen={true} onClose={vi.fn()} onSubmit={handleSubmit} />);

    const codeInput = screen.getByPlaceholderText('e.g. CAMPUS_BURSAR');
    const nameInput = screen.getByPlaceholderText('e.g. Campus Bursar');

    fireEvent.change(codeInput, { target: { value: 'CAMPUS_ACCOUNTANT' } });
    fireEvent.change(nameInput, { target: { value: 'Campus Accountant' } });

    const submitBtn = screen.getByRole('button', { name: /Create Role/i });
    fireEvent.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledWith({
      roleCode: 'CAMPUS_ACCOUNTANT',
      roleName: 'Campus Accountant',
      description: undefined,
    });
  });
});

