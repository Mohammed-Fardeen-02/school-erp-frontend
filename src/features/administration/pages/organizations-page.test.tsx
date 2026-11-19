import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { OrganizationsPage } from './organizations-page';
import * as useAdminHooks from '../hooks/use-admin';

vi.mock('../hooks/use-admin', () => ({
  useAdminOrganizations: vi.fn(),
  useSaveOrganization: vi.fn(),
  useUpdateOrganizationStatus: vi.fn(),
  useAdminCampuses: vi.fn(),
  useSaveCampus: vi.fn(),
}));

const mockOrganizations = [
  {
    id: 'org-1',
    code: 'GREENWOOD',
    displayName: 'Greenwood International',
    legalName: 'Greenwood International Academy Trust',
    organizationType: 'K12_SCHOOL_CHAIN' as const,
    email: 'admin@greenwood.edu',
    phone: '+1-555-0199',
    status: 'ACTIVE' as const,
    subscriptionPlan: 'ENTERPRISE',
    maxLocations: 5,
    maxUsers: 500,
    maxStudents: 2000,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-11-12T00:00:00Z',
    locations: [
      { id: 'loc-1', name: 'Main Campus', code: 'MAIN', isMainCampus: true },
      { id: 'loc-2', name: 'North Branch', code: 'NORTH', isMainCampus: false },
    ],
    _count: {
      locations: 2,
      memberships: 15,
    },
  },
  {
    id: 'org-2',
    code: 'OAKRIDGE',
    displayName: 'Oakridge High School',
    legalName: 'Oakridge Educational Society',
    organizationType: 'INDEPENDENT_SCHOOL' as const,
    email: 'contact@oakridge.edu',
    phone: '+1-555-0288',
    status: 'SUSPENDED' as const,
    subscriptionPlan: 'STANDARD',
    maxLocations: 2,
    maxUsers: 100,
    maxStudents: 500,
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-11-10T00:00:00Z',
    locations: [
      { id: 'loc-3', name: 'Oakridge Main', code: 'OAK-MAIN', isMainCampus: true },
    ],
    _count: {
      locations: 1,
      memberships: 4,
    },
  },
];

const mockCampuses = [
  { id: 'loc-1', name: 'Main Campus', code: 'MAIN', isMainCampus: true },
];

describe('OrganizationsPage', () => {
  let queryClient: QueryClient;
  const mockSaveOrg = vi.fn();
  const mockUpdateStatus = vi.fn();
  const mockSaveCampus = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    vi.mocked(useAdminHooks.useAdminOrganizations).mockReturnValue({
      data: {
        items: mockOrganizations,
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
      isLoading: false,
    } as any);

    vi.mocked(useAdminHooks.useAdminCampuses).mockReturnValue({
      data: mockCampuses,
      isLoading: false,
    } as any);

    vi.mocked(useAdminHooks.useSaveOrganization).mockReturnValue({
      mutateAsync: mockSaveOrg,
      isPending: false,
    } as any);

    vi.mocked(useAdminHooks.useUpdateOrganizationStatus).mockReturnValue({
      mutateAsync: mockUpdateStatus,
      isPending: false,
    } as any);

    vi.mocked(useAdminHooks.useSaveCampus).mockReturnValue({
      mutateAsync: mockSaveCampus,
      isPending: false,
    } as any);
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <OrganizationsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('renders page header and stats cards correctly', () => {
    renderComponent();

    expect(screen.getByRole('heading', { level: 1, name: /organization management/i })).toBeInTheDocument();
    expect(screen.getByText('Active Schools')).toBeInTheDocument();
    expect(screen.getByText('Suspended / Inactive')).toBeInTheDocument();
    expect(screen.getByText('Total Campuses')).toBeInTheDocument();
  });

  it('renders table rows with organization name, code, primary campus, and counts', () => {
    renderComponent();

    expect(screen.getByText('Greenwood International')).toBeInTheDocument();
    expect(screen.getByText('Code: GREENWOOD')).toBeInTheDocument();
    expect(screen.getByText('2 Campuses')).toBeInTheDocument();

    expect(screen.getByText('Oakridge High School')).toBeInTheDocument();
    expect(screen.getByText('Code: OAKRIDGE')).toBeInTheDocument();
  });

  it('opens OrganizationFormModal when clicking "Add Organization"', async () => {
    renderComponent();

    const addBtn = screen.getByRole('button', { name: /add organization/i });
    fireEvent.click(addBtn);

    await waitFor(() => {
      expect(screen.getByText('Add New Institution')).toBeInTheDocument();
    });
  });

  it('opens CampusManagerModal when clicking campuses count button', async () => {
    renderComponent();

    const campusBtn = screen.getByText('2 Campuses');
    fireEvent.click(campusBtn);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Campuses & Locations/i })).toBeInTheDocument();
    });
  });

  it('renders Branches Master shortcut button', () => {
    renderComponent();

    expect(screen.getByRole('button', { name: /branches master/i })).toBeInTheDocument();
  });
});
