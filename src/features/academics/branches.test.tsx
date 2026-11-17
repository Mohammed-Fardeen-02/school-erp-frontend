import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { BranchesPage } from './pages/branches-page';
import { BranchFormModal } from './components/branches/branch-form-modal';
import { BranchesApi } from './api/branches.api';
import type { BranchDto } from './types/branches.types';

// Mock Branches API
vi.mock('./api/branches.api', () => ({
  BranchesApi: {
    list: vi.fn(),
    getById: vi.fn(),
    save: vi.fn(),
    setMainBranch: vi.fn(),
    toggleStatus: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock Toast provider
vi.mock('@/components/feedback/toast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  }),
}));

const mockBranches: BranchDto[] = [
  {
    id: 'branch-1',
    organizationId: 'org-123',
    code: 'GREENWOOD-MAIN',
    name: 'Main City Campus',
    locationType: 'MAIN_CAMPUS',
    isMainCampus: true,
    isActive: true,
    email: 'main@greenwood.edu',
    phone: '+91 80 2345 6701',
    principalName: 'Dr. Alistair Finch',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'IN',
    createdAt: '2026-11-01T10:00:00.000Z',
    updatedAt: '2026-11-01T10:00:00.000Z',
  },
  {
    id: 'branch-2',
    organizationId: 'org-123',
    code: 'GREENWOOD-NORTH',
    name: 'North Academic Branch',
    locationType: 'BRANCH_CAMPUS',
    isMainCampus: false,
    isActive: true,
    email: 'north@greenwood.edu',
    phone: '+91 80 2345 6702',
    principalName: 'Mrs. Sarah Henderson',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'IN',
    createdAt: '2026-11-02T10:00:00.000Z',
    updatedAt: '2026-11-02T10:00:00.000Z',
  },
  {
    id: 'branch-3',
    organizationId: 'org-123',
    code: 'GREENWOOD-EAST',
    name: 'East Sports Complex',
    locationType: 'SPORTS_COMPLEX',
    isMainCampus: false,
    isActive: false,
    email: 'sports@greenwood.edu',
    phone: '+91 80 2345 6703',
    principalName: 'Coach Davies',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'IN',
    createdAt: '2026-11-03T10:00:00.000Z',
    updatedAt: '2026-11-03T10:00:00.000Z',
  },
];

describe('Branches Master Feature Suite (Academics Module)', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.mocked(BranchesApi.list).mockResolvedValue(mockBranches);
  });

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{ui}</MemoryRouter>
      </QueryClientProvider>
    );
  };

  it('renders Branches Master page header, KPIs, and data table', async () => {
    renderWithProviders(<BranchesPage />);

    // Header & Subtitle
    expect(await screen.findByRole('heading', { name: 'Branches Master' })).toBeInTheDocument();
    expect(screen.getByText(/Manage academic campuses, satellite branches/i)).toBeInTheDocument();

    // Action button
    expect(screen.getByRole('button', { name: /Add Branch/i })).toBeInTheDocument();

    // Wait for async query data to render
    expect(await screen.findByText('North Academic Branch')).toBeInTheDocument();

    // KPIs
    expect(screen.getByText('Total Branches')).toBeInTheDocument();
    expect(screen.getByText('Active Campuses')).toBeInTheDocument();

    // Table rows (Main City Campus appears in KPI and table, so getAllByText)
    expect(screen.getAllByText('Main City Campus').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('East Sports Complex')).toBeInTheDocument();
  });

  it('filters branches dynamically based on search query', async () => {
    renderWithProviders(<BranchesPage />);

    await screen.findByText('North Academic Branch');

    const searchInput = screen.getByPlaceholderText(/Search branches by name, code/i);
    fireEvent.change(searchInput, { target: { value: 'North' } });

    expect(screen.getByText('North Academic Branch')).toBeInTheDocument();
    expect(screen.queryByText('East Sports Complex')).not.toBeInTheDocument();
  });

  it('filters branches by status (Active Only)', async () => {
    renderWithProviders(<BranchesPage />);

    await screen.findByText('East Sports Complex');

    const statusDropdown = screen.getByDisplayValue('All Statuses');
    fireEvent.change(statusDropdown, { target: { value: 'ACTIVE' } });

    expect(screen.getAllByText('Main City Campus').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('North Academic Branch')).toBeInTheDocument();
    expect(screen.queryByText('East Sports Complex')).not.toBeInTheDocument();
  });

  it('opens BranchFormModal when Add Branch button is clicked', async () => {
    renderWithProviders(<BranchesPage />);

    const addButton = await screen.findByRole('button', { name: /Add Branch/i });
    fireEvent.click(addButton);

    expect(await screen.findByText('Add New Academic Branch')).toBeInTheDocument();
    expect(screen.getByLabelText(/Branch Name \*/i)).toBeInTheDocument();
  });

  it('validates required fields on BranchFormModal submit', async () => {
    const handleSubmit = vi.fn();
    const handleClose = vi.fn();

    render(
      <BranchFormModal
        isOpen={true}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    );

    const submitBtn = screen.getByRole('button', { name: /Create Branch/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleSubmit).not.toHaveBeenCalled();
    });
  });

  it('submits valid branch data via BranchFormModal', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    const handleClose = vi.fn();

    render(
      <BranchFormModal
        isOpen={true}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    );

    const nameInput = screen.getByLabelText(/Branch Name \*/i);
    fireEvent.change(nameInput, { target: { value: 'New Science Faculty Branch' } });

    const submitBtn = screen.getByRole('button', { name: /Create Branch/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New Science Faculty Branch',
          locationType: 'BRANCH_CAMPUS',
        }),
        undefined
      );
    });
  });
});
