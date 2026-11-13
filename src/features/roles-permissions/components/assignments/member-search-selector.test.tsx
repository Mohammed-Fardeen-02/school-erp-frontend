import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemberSearchSelector } from './member-search-selector';
import { AssignmentsApi } from '../../api/assignments.api';
import { useAuthStore } from '@/stores/auth-store';
import type { WorkspaceMemberSummary } from '../../types/assignments.types';

vi.mock('../../api/assignments.api', () => ({
  AssignmentsApi: {
    listMembers: vi.fn(),
    getCampuses: vi.fn(),
    assignRole: vi.fn(),
    revokeRole: vi.fn(),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const mockMembers: WorkspaceMemberSummary[] = [
  {
    id: 'user-1',
    email: 'edna.krabappel@springfield.edu',
    firstName: 'Edna',
    lastName: 'Krabappel',
    phone: '+1-555-0101',
    isActive: true,
  },
  {
    id: 'user-2',
    email: 'seymour.skinner@springfield.edu',
    firstName: 'Seymour',
    lastName: 'Skinner',
    phone: null,
    isActive: true,
  },
];

describe('MemberSearchSelector Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      isAuthenticated: true,
      activeWorkspaceId: 'org-test-1',
    });
    vi.mocked(AssignmentsApi.listMembers).mockResolvedValue({
      members: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
    });
  });

  it('renders search input when no member is selected', () => {
    vi.mocked(AssignmentsApi.listMembers).mockResolvedValueOnce({
      members: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
    });

    render(
      <MemberSearchSelector
        selectedMember={null}
        onSelectMember={vi.fn()}
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByTestId('member-search-input')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Search active members by name, email, or phone/i)
    ).toBeInTheDocument();
  });

  it('fetches members on focus and displays results in dropdown', async () => {
    vi.mocked(AssignmentsApi.listMembers).mockResolvedValueOnce({
      members: mockMembers,
      meta: { total: 2, page: 1, limit: 10, totalPages: 1 },
    });

    render(
      <MemberSearchSelector
        selectedMember={null}
        onSelectMember={vi.fn()}
      />,
      { wrapper: createWrapper() }
    );

    const input = screen.getByTestId('member-search-input');
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByTestId('member-search-dropdown')).toBeInTheDocument();
      expect(screen.getByText('Edna Krabappel')).toBeInTheDocument();
      expect(screen.getByText('edna.krabappel@springfield.edu')).toBeInTheDocument();
      expect(screen.getByText('• +1-555-0101')).toBeInTheDocument();
      expect(screen.getByText('Seymour Skinner')).toBeInTheDocument();
    });
  });

  it('calls onSelectMember when a member row is clicked', async () => {
    vi.mocked(AssignmentsApi.listMembers).mockResolvedValueOnce({
      members: mockMembers,
      meta: { total: 2, page: 1, limit: 10, totalPages: 1 },
    });

    const handleSelect = vi.fn();
    render(
      <MemberSearchSelector
        selectedMember={null}
        onSelectMember={handleSelect}
      />,
      { wrapper: createWrapper() }
    );

    fireEvent.focus(screen.getByTestId('member-search-input'));

    await waitFor(() => {
      expect(screen.getByTestId('member-option-user-1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('member-option-user-1'));
    expect(handleSelect).toHaveBeenCalledWith(mockMembers[0]);
  });

  it('renders selected member card with initials, email, and clear action', () => {
    const handleSelect = vi.fn();
    render(
      <MemberSearchSelector
        selectedMember={mockMembers[0]!}
        onSelectMember={handleSelect}
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByTestId('selected-member-card')).toBeInTheDocument();
    expect(screen.getByText('Edna Krabappel')).toBeInTheDocument();
    expect(screen.getByText('edna.krabappel@springfield.edu')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();

    const clearBtn = screen.getByTestId('clear-selected-member');
    fireEvent.click(clearBtn);

    expect(handleSelect).toHaveBeenCalledWith(null);
  });

  it('renders empty state when search produces 0 results', async () => {
    vi.mocked(AssignmentsApi.listMembers).mockResolvedValueOnce({
      members: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
    });

    render(
      <MemberSearchSelector
        selectedMember={null}
        onSelectMember={vi.fn()}
      />,
      { wrapper: createWrapper() }
    );

    fireEvent.focus(screen.getByTestId('member-search-input'));

    await waitFor(() => {
      expect(screen.getByTestId('member-search-empty')).toBeInTheDocument();
      expect(screen.getByText(/No active members found/i)).toBeInTheDocument();
    });
  });

  it('renders error state and handles retry button', async () => {
    vi.mocked(AssignmentsApi.listMembers)
      .mockRejectedValueOnce(new Error('Network error on member search'))
      .mockResolvedValueOnce({
        members: mockMembers,
        meta: { total: 2, page: 1, limit: 10, totalPages: 1 },
      });

    render(
      <MemberSearchSelector
        selectedMember={null}
        onSelectMember={vi.fn()}
      />,
      { wrapper: createWrapper() }
    );

    fireEvent.focus(screen.getByTestId('member-search-input'));

    await waitFor(() => {
      expect(screen.getByTestId('member-search-error')).toBeInTheDocument();
      expect(screen.getByText('Network error on member search')).toBeInTheDocument();
    });

    const retryBtn = screen.getByRole('button', { name: /Retry search/i });
    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(screen.getByText('Edna Krabappel')).toBeInTheDocument();
    });
  });

  it('handles server-side pagination controls', async () => {
    vi.mocked(AssignmentsApi.listMembers).mockResolvedValueOnce({
      members: [mockMembers[0]!],
      meta: { total: 20, page: 1, limit: 10, totalPages: 2 },
    });

    render(
      <MemberSearchSelector
        selectedMember={null}
        onSelectMember={vi.fn()}
      />,
      { wrapper: createWrapper() }
    );

    fireEvent.focus(screen.getByTestId('member-search-input'));

    await waitFor(() => {
      expect(screen.getByTestId('member-pagination-prev')).toBeDisabled();
      expect(screen.getByTestId('member-pagination-next')).not.toBeDisabled();
      expect(screen.getByText('1 / 2')).toBeInTheDocument();
    });

    vi.mocked(AssignmentsApi.listMembers).mockResolvedValueOnce({
      members: [mockMembers[1]!],
      meta: { total: 20, page: 2, limit: 10, totalPages: 2 },
    });

    fireEvent.click(screen.getByTestId('member-pagination-next'));

    await waitFor(() => {
      expect(AssignmentsApi.listMembers).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2 })
      );
    });
  });
});

