import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, render, fireEvent } from '@testing-library/react';
import { DeleteRoleModal } from './delete-role-modal';
import type { RoleSummary } from '../../types/roles.types';

const customRoleWithAssignments: RoleSummary = {
  id: 'role-1',
  organizationId: 'org-1',
  roleCode: 'BURSAR',
  roleName: 'Campus Bursar',
  description: 'Handles fees',
  roleType: 'CUSTOM',
  isActive: true,
  createdAt: '2026-11-01T00:00:00Z',
  updatedAt: '2026-11-01T00:00:00Z',
  assignmentCount: 3,
};

const customRoleWithoutAssignments: RoleSummary = {
  ...customRoleWithAssignments,
  id: 'role-2',
  roleCode: 'UNUSED_ROLE',
  roleName: 'Unused Role',
  assignmentCount: 0,
};

describe('DeleteRoleModal Component', () => {
  it('displays archival messaging when the role has historical assignments', () => {
    const handleConfirm = vi.fn();
    render(
      <DeleteRoleModal
        isOpen={true}
        role={customRoleWithAssignments}
        onConfirm={handleConfirm}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByText('Archive Custom Role')).toBeInTheDocument();
    expect(screen.getByText(/3 historical assignment\(s\)/i)).toBeInTheDocument();
    expect(screen.getByText(/safely archive and deactivate/i)).toBeInTheDocument();

    const confirmBtn = screen.getByRole('button', { name: /Archive Role/i });
    fireEvent.click(confirmBtn);
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it('displays permanent deletion messaging when assignmentCount is 0', () => {
    const handleConfirm = vi.fn();
    render(
      <DeleteRoleModal
        isOpen={true}
        role={customRoleWithoutAssignments}
        onConfirm={handleConfirm}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByText('Delete Custom Role')).toBeInTheDocument();
    expect(screen.getByText(/zero assignments and will be/i)).toBeInTheDocument();
    expect(screen.getByText(/permanently deleted/i)).toBeInTheDocument();

    const confirmBtn = screen.getByRole('button', { name: /Permanently Delete/i });
    fireEvent.click(confirmBtn);
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });
});
