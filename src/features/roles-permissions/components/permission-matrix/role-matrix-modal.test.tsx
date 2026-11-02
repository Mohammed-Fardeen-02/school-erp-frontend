import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RoleMatrixModal } from './role-matrix-modal';
import type { RoleSummary } from '../../types/roles.types';

// Mock PermissionMatrixBuilder
vi.mock('./permission-matrix-builder', () => ({
  PermissionMatrixBuilder: ({
    roleId,
    roleName,
    roleCode,
    isReadOnly,
  }: {
    roleId: string;
    roleName: string;
    roleCode: string;
    isReadOnly?: boolean;
  }) => (
    <div data-testid="mock-matrix-builder">
      <span>Builder: {roleName} ({roleCode})</span>
      <span>ReadOnly: {String(isReadOnly)}</span>
      <span>RoleId: {roleId}</span>
    </div>
  ),
}));

const mockCustomRole: RoleSummary = {
  id: 'role-123',
  organizationId: 'org-1',
  roleCode: 'CAMPUS_BURSAR',
  roleName: 'Campus Bursar',
  description: 'Handles campus financial fee records',
  roleType: 'CUSTOM',
  isActive: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  assignmentCount: 2,
};

const mockTemplateRole: RoleSummary = {
  id: 'template-456',
  organizationId: null,
  roleCode: 'SYSTEM_VIEWER',
  roleName: 'System Viewer Template',
  description: 'Read-only audit profile',
  roleType: 'SYSTEM_TEMPLATE',
  isActive: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  assignmentCount: 0,
};

describe('RoleMatrixModal Component', () => {
  it('does not render when isOpen is false', () => {
    const handleClose = vi.fn();
    render(<RoleMatrixModal isOpen={false} role={mockCustomRole} onClose={handleClose} />);
    expect(screen.queryByTestId('role-matrix-modal')).not.toBeInTheDocument();
  });

  it('does not render when role is null', () => {
    const handleClose = vi.fn();
    render(<RoleMatrixModal isOpen={true} role={null} onClose={handleClose} />);
    expect(screen.queryByTestId('role-matrix-modal')).not.toBeInTheDocument();
  });

  it('renders modal with custom role details and passes isReadOnly=false', () => {
    const handleClose = vi.fn();
    render(<RoleMatrixModal isOpen={true} role={mockCustomRole} onClose={handleClose} />);

    expect(screen.getByTestId('role-matrix-modal')).toBeInTheDocument();
    expect(screen.getByText(/Capability Matrix: Campus Bursar/i)).toBeInTheDocument();
    expect(screen.getByText('CAMPUS_BURSAR')).toBeInTheDocument();
    expect(screen.getByText('Custom Role')).toBeInTheDocument();

    const builder = screen.getByTestId('mock-matrix-builder');
    expect(builder).toBeInTheDocument();
    expect(builder).toHaveTextContent('ReadOnly: false');
    expect(builder).toHaveTextContent('RoleId: role-123');
  });

  it('renders modal with system template details and passes isReadOnly=true', () => {
    const handleClose = vi.fn();
    render(<RoleMatrixModal isOpen={true} role={mockTemplateRole} onClose={handleClose} />);

    expect(screen.getByTestId('role-matrix-modal')).toBeInTheDocument();
    expect(screen.getByText(/Capability Matrix: System Viewer Template/i)).toBeInTheDocument();
    expect(screen.getByText('SYSTEM_VIEWER')).toBeInTheDocument();
    expect(screen.getByText('System Template (Read-Only)')).toBeInTheDocument();

    const builder = screen.getByTestId('mock-matrix-builder');
    expect(builder).toBeInTheDocument();
    expect(builder).toHaveTextContent('ReadOnly: true');
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(<RoleMatrixModal isOpen={true} role={mockCustomRole} onClose={handleClose} />);

    const closeBtn = screen.getByLabelText(/close capability matrix/i);
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    const handleClose = vi.fn();
    render(<RoleMatrixModal isOpen={true} role={mockCustomRole} onClose={handleClose} />);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
