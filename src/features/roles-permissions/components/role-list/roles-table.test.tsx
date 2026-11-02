import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, render } from '@testing-library/react';
import { RolesTable } from './roles-table';
import type { RoleSummary } from '../../types/roles.types';

const mockRoles: RoleSummary[] = [
  {
    id: 'role-1',
    organizationId: null,
    roleCode: 'SYSTEM_ADMIN_TEMPLATE',
    roleName: 'System Administrator',
    description: 'Full institutional admin template',
    roleType: 'SYSTEM_TEMPLATE',
    isActive: true,
    createdAt: '2026-11-01T00:00:00Z',
    updatedAt: '2026-11-01T00:00:00Z',
    assignmentCount: 0,
  },
  {
    id: 'role-2',
    organizationId: 'org-1',
    roleCode: 'HEAD_OF_DEPARTMENT',
    roleName: 'Head of Department',
    description: 'Manages departmental academic curriculum',
    roleType: 'CUSTOM',
    isActive: true,
    createdAt: '2026-11-01T00:00:00Z',
    updatedAt: '2026-11-01T00:00:00Z',
    assignmentCount: 5,
  },
];

describe('RolesTable Component', () => {
  it('renders role codes and names in the table', () => {
    render(<RolesTable roles={mockRoles} />);

    expect(screen.getByText('SYSTEM_ADMIN_TEMPLATE')).toBeInTheDocument();
    expect(screen.getByText('System Administrator')).toBeInTheDocument();
    expect(screen.getByText('HEAD_OF_DEPARTMENT')).toBeInTheDocument();
    expect(screen.getByText('Head of Department')).toBeInTheDocument();
  });

  it('renders badges indicating System Template vs Custom Role', () => {
    render(<RolesTable roles={mockRoles} />);

    expect(screen.getByText('System Template')).toBeInTheDocument();
    expect(screen.getByText('Custom Role')).toBeInTheDocument();
  });

  it('displays user assignment counts', () => {
    render(<RolesTable roles={mockRoles} />);

    expect(screen.getByText('5')).toBeInTheDocument();
  });
});

