import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { SelectWorkspacePage } from './select-workspace-page';
import { useAuthStore } from '@/stores/auth-store';
import { WorkspaceApi } from '../api/workspace.api';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../api/workspace.api', () => ({
  WorkspaceApi: {
    getMyOrganizations: vi.fn(),
    selectContext: vi.fn(),
    setPrimaryOrganization: vi.fn(),
  },
}));

describe('SelectWorkspacePage (Stage W1.3)', () => {
  const mockApiOrgs = [
    {
      id: 'org-1',
      code: 'SMH',
      displayName: "St. Mary's High School",
      legalName: "St. Mary's High School Inc.",
      organizationType: 'INDEPENDENT_SCHOOL',
      accessLevel: 'OWNER',
      isPrimary: true,
      campuses: [
        {
          id: 'camp-1',
          code: 'MAIN',
          name: 'Main Campus',
          locationType: 'MAIN_CAMPUS',
          isMainCampus: true,
          isActive: true,
        },
        {
          id: 'camp-2',
          code: 'NORTH',
          name: 'North Campus',
          locationType: 'BRANCH_CAMPUS',
          isMainCampus: false,
          isActive: true,
        },
      ],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      isAuthenticated: true,
      activeWorkspaceId: 'org-1',
      activeLocationId: 'camp-1',
      workspaces: [
        {
          id: 'org-1',
          code: 'SMH',
          name: "St. Mary's High School",
          campusName: 'Main Campus',
          academicYear: '2026-2027',
          role: 'ADMIN',
          permittedModules: ['academics'],
        },
      ],
    });
  });

  it('renders organizations and authorized campuses with active campus highlighted', async () => {
    vi.mocked(WorkspaceApi.getMyOrganizations).mockResolvedValue(mockApiOrgs);

    render(
      <MemoryRouter>
        <SelectWorkspacePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("St. Mary's High School")).toBeInTheDocument();
    });

    expect(screen.getByText('Campuses:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /main campus/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /north campus/i })).toBeInTheDocument();
  });

  it('selects target campus and updates context in auth store and navigation', async () => {
    vi.mocked(WorkspaceApi.getMyOrganizations).mockResolvedValue(mockApiOrgs);
    vi.mocked(WorkspaceApi.selectContext).mockResolvedValue({
      organization: {
        id: 'org-1',
        code: 'SMH',
        displayName: "St. Mary's High School",
        legalName: "St. Mary's High School Inc.",
        organizationType: 'INDEPENDENT_SCHOOL',
        status: 'ACTIVE',
      },
      location: {
        id: 'camp-2',
        code: 'NORTH',
        name: 'North Campus',
        locationType: 'BRANCH_CAMPUS',
        isMainCampus: false,
      },
      membership: {
        id: 'mem-1',
        accessLevel: 'OWNER',
        membershipType: 'REGULAR',
        isPrimary: true,
      },
      enabledModules: ['academics'],
    });

    render(
      <MemoryRouter>
        <SelectWorkspacePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("St. Mary's High School")).toBeInTheDocument();
    });

    const northCampusBtn = screen.getByRole('button', { name: /north campus/i });
    fireEvent.click(northCampusBtn);

    await waitFor(() => {
      expect(WorkspaceApi.selectContext).toHaveBeenCalledWith({
        organizationId: 'org-1',
        locationId: 'camp-2',
      });
      expect(useAuthStore.getState().activeLocationId).toBe('camp-2');
      expect(mockNavigate).toHaveBeenCalledWith('/workspace');
    });
  });
});

