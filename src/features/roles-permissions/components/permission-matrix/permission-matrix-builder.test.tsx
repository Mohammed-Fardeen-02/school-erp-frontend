import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PermissionMatrixBuilder } from './permission-matrix-builder';
import * as permissionsApi from '../../api/permissions.api';
import * as rolesApi from '../../api/roles.api';
import type { CanonicalTreeNode } from '../../types/permissions.types';
import type { RolePermissionsMatrixDto } from '../../types/roles.types';

// Mock AuthStore
vi.mock('@/stores/auth-store', () => ({
  useAuthStore: (selector?: (state: any) => any) => {
    const state = {
      isAuthenticated: true,
      activeWorkspaceId: 'org-test-1',
      getActiveWorkspace: () => ({
        organizationId: 'org-test-1',
        campusId: null,
        name: 'Springfield Academy',
      }),
    };
    return selector ? selector(state) : state;
  },
}));

const mockTree: CanonicalTreeNode[] = [
  {
    id: 'node-acad',
    nodeCode: 'academics',
    nodeName: 'Academics Management',
    nodeType: 'MODULE',
    nodeLevel: 1,
    displayOrder: 1,
    isActive: true,
    description: 'Academic modules and curriculum',
    parentId: null,
    children: [
      {
        id: 'node-acad-courses',
        nodeCode: 'academics.courses',
        nodeName: 'Courses & Curriculum',
        nodeType: 'SECTION',
        nodeLevel: 2,
        displayOrder: 1,
        isActive: true,
        description: 'Course catalog',
        parentId: 'node-acad',
        children: [
          {
            id: 'node-acad-courses-view',
            nodeCode: 'academics.courses.view',
            nodeName: 'View Courses',
            nodeType: 'ACTION',
            nodeLevel: 3,
            displayOrder: 1,
            isActive: true,
            description: 'Read course catalog',
            parentId: 'node-acad-courses',
            children: [],
          },
          {
            id: 'node-acad-courses-create',
            nodeCode: 'academics.courses.create',
            nodeName: 'Create Courses',
            nodeType: 'ACTION',
            nodeLevel: 3,
            displayOrder: 2,
            isActive: true,
            description: 'Create new course',
            parentId: 'node-acad-courses',
            children: [],
          },
        ],
      },
    ],
  },
];

const mockRoleMatrix: RolePermissionsMatrixDto = {
  roleId: 'role-123',
  roleCode: 'TEACHER',
  roleName: 'Teacher',
  roleType: 'CUSTOM',
  permissions: [
    {
      nodeId: 'node-acad-courses-view',
      nodeCode: 'academics.courses.view',
      nodeName: 'View Courses',
      nodeType: 'ACTION',
      nodeLevel: 3,
      displayOrder: 1,
      description: 'Read course catalog',
      isGranted: true,
      isDirect: true,
    },
  ],
};

const renderWithClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

describe('PermissionMatrixBuilder Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.spyOn(permissionsApi.PermissionsApi, 'getPermissionTree').mockResolvedValue(mockTree);
    vi.spyOn(rolesApi.RolesApi, 'getPermissionsMatrix').mockResolvedValue(mockRoleMatrix);
    vi.spyOn(permissionsApi.PermissionsApi, 'getMyPermissions').mockResolvedValue({
      permissions: ['academics', 'academics.courses', 'academics.courses.view', 'academics.courses.create'],
      count: 4,
      computedAt: '2026-11-01T00:00:00Z',
    });
    vi.spyOn(rolesApi.RolesApi, 'updatePermissionsMatrix').mockResolvedValue(undefined);
  });

  it('renders loading spinner while fetching permission tree and matrix', () => {
    renderWithClient(
      <PermissionMatrixBuilder
        roleId="role-123"
        roleName="Teacher"
        roleCode="TEACHER"
      />
    );

    expect(screen.getByText(/loading canonical permission tree catalog/i)).toBeInTheDocument();
  });

  it('renders error alert when tree fetch fails', async () => {
    vi.spyOn(permissionsApi.PermissionsApi, 'getPermissionTree').mockRejectedValue(
      new Error('Failed to load canonical tree')
    );

    renderWithClient(
      <PermissionMatrixBuilder
        roleId="role-123"
        roleName="Teacher"
        roleCode="TEACHER"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Capability Matrix Error')).toBeInTheDocument();
      expect(screen.getByText('Failed to load canonical tree')).toBeInTheDocument();
    });
  });

  it('renders hierarchical permission tree with nodes and baseline states', async () => {
    renderWithClient(
      <PermissionMatrixBuilder
        roleId="role-123"
        roleName="Teacher"
        roleCode="TEACHER"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Academics Management')).toBeInTheDocument();
      expect(screen.getByText('Courses & Curriculum')).toBeInTheDocument();
      expect(screen.getByText('View Courses')).toBeInTheDocument();
      expect(screen.getByText('Create Courses')).toBeInTheDocument();
    });

    // View Courses should have baseline explicit grant
    const viewRow = screen.getByTestId('matrix-node-academics.courses.view');
    expect(viewRow).toHaveTextContent('Explicit Grant');

    // Create Courses should be Default Deny
    const createRow = screen.getByTestId('matrix-node-academics.courses.create');
    expect(createRow).toHaveTextContent('Default Deny');
  });

  it('cycles leaf checkbox state: UNSET -> GRANT -> DENY -> UNSET', async () => {
    renderWithClient(
      <PermissionMatrixBuilder
        roleId="role-123"
        roleName="Teacher"
        roleCode="TEACHER"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Create Courses')).toBeInTheDocument();
    });

    const createRow = screen.getByTestId('matrix-node-academics.courses.create');
    const checkbox = createRow.querySelector('button[role="checkbox"]') as HTMLElement;
    expect(checkbox).toBeInTheDocument();

    // 1. Initially Default Deny
    expect(createRow).toHaveTextContent('Default Deny');

    // 2. Click -> transitions to Explicit Grant
    fireEvent.click(checkbox);
    expect(createRow).toHaveTextContent('Explicit Grant');
    expect(screen.getByTestId('matrix-sticky-bar')).toBeInTheDocument();
    expect(screen.getByText('+1 explicit grants')).toBeInTheDocument();

    // 3. Click again -> transitions to Explicit Deny
    fireEvent.click(checkbox);
    expect(createRow).toHaveTextContent('Explicit Deny');
    expect(screen.getByText('+1 explicit denies')).toBeInTheDocument();

    // 4. Click again -> transitions back to UNSET (Default Deny since no parent grant)
    fireEvent.click(checkbox);
    expect(createRow).toHaveTextContent('Default Deny');
    // Diff is 0, so sticky bar disappears
    expect(screen.queryByTestId('matrix-sticky-bar')).not.toBeInTheDocument();
  });

  it('cascades bulk Grant All and Reset All on containers', async () => {
    renderWithClient(
      <PermissionMatrixBuilder
        roleId="role-123"
        roleName="Teacher"
        roleCode="TEACHER"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Courses & Curriculum')).toBeInTheDocument();
    });

    const coursesRow = screen.getByTestId('matrix-node-academics.courses');
    const grantAllBtn = coursesRow.querySelector('button[title="Cascade Grant to all child permissions"]') as HTMLElement;
    expect(grantAllBtn).toBeInTheDocument();

    // Click Grant All
    fireEvent.click(grantAllBtn);

    // Both View and Create should now be granted
    const createRow = screen.getByTestId('matrix-node-academics.courses.create');
    expect(createRow).toHaveTextContent('Explicit Grant');

    // Sticky bar shows changes
    expect(screen.getByTestId('matrix-sticky-bar')).toBeInTheDocument();

    // Click Reset All
    const resetAllBtn = coursesRow.querySelector('button[title="Reset all children to inherit baseline"]') as HTMLElement;
    fireEvent.click(resetAllBtn);

    // Create Courses returns to Default Deny
    expect(createRow).toHaveTextContent('Default Deny');
  });

  it('submits diff payload with isGranted: null on override reset', async () => {
    const updateSpy = vi.spyOn(rolesApi.RolesApi, 'updatePermissionsMatrix').mockResolvedValue(undefined);

    renderWithClient(
      <PermissionMatrixBuilder
        roleId="role-123"
        roleName="Teacher"
        roleCode="TEACHER"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('View Courses')).toBeInTheDocument();
    });

    // View Courses starts with baseline EXPLICIT_GRANT
    const viewRow = screen.getByTestId('matrix-node-academics.courses.view');
    const resetBtn = viewRow.querySelector('button[title="Reset to Inherited State"]') as HTMLElement;
    expect(resetBtn).toBeInTheDocument();

    // Click reset button
    fireEvent.click(resetBtn);

    // Sticky bar shows 1 reset
    expect(screen.getByTestId('matrix-sticky-bar')).toBeInTheDocument();
    expect(screen.getByText('+1 resets')).toBeInTheDocument();

    // Click Save Matrix
    const saveBtn = screen.getByRole('button', { name: /save matrix/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith('role-123', {
        permissions: [
          {
            nodeId: 'node-acad-courses-view',
            isGranted: null,
          },
        ],
      });
    });

    expect(await screen.findByText(/successfully saved/i)).toBeInTheDocument();
  });

  it('disables modifications and hides save bar in read-only mode for templates', async () => {
    renderWithClient(
      <PermissionMatrixBuilder
        roleId="template-456"
        roleName="Auditor Template"
        roleCode="SYS_AUDITOR"
        isReadOnly={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Read-Only Template')).toBeInTheDocument();
    });

    const viewRow = screen.getByTestId('matrix-node-academics.courses.view');
    const checkbox = viewRow.querySelector('button[role="checkbox"]') as HTMLElement;
    expect(checkbox).toBeDisabled();

    // Quick action buttons should not be present
    expect(viewRow.querySelector('button[title="Explicitly Grant"]')).toBeNull();
    expect(screen.queryByTestId('matrix-sticky-bar')).not.toBeInTheDocument();
  });

  it('enforces delegation ceiling lock when actor lacks capability', async () => {
    // Actor only possesses 'academics.courses.view', NOT 'academics.courses.create'
    vi.spyOn(permissionsApi.PermissionsApi, 'getMyPermissions').mockResolvedValue({
      permissions: ['academics.courses.view'],
      count: 1,
      computedAt: '2026-11-01T00:00:00Z',
    });

    renderWithClient(
      <PermissionMatrixBuilder
        roleId="role-123"
        roleName="Teacher"
        roleCode="TEACHER"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Create Courses')).toBeInTheDocument();
    });

    const createRow = screen.getByTestId('matrix-node-academics.courses.create');
    expect(createRow).toHaveTextContent('Ceiling Lock');

    const checkbox = createRow.querySelector('button[role="checkbox"]') as HTMLElement;
    expect(checkbox).toBeDisabled();
  });
});
