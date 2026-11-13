import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UsersRoutes } from './routes';
import { useAuthStore } from '@/stores/auth-store';
import * as usePermissionModule from '@/features/roles-permissions/hooks/use-permission';

vi.mock('@/features/roles-permissions/hooks/use-permission');
vi.mock('@/features/roles-permissions/hooks/use-assignments', () => ({
  useWorkspaceMembers: vi.fn().mockReturnValue({
    data: { members: [], meta: { total: 0, page: 1, limit: 15, totalPages: 1 } },
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
  useUserAssignments: vi.fn().mockReturnValue({
    data: [],
    isLoading: false,
    refetch: vi.fn(),
  }),
  useAssignRole: vi.fn().mockReturnValue({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useRevokeRole: vi.fn().mockReturnValue({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useOrganizationCampuses: vi.fn().mockReturnValue({
    data: [],
    isLoading: false,
  }),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });

describe('UsersRoutes', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = createTestQueryClient();
    useAuthStore.setState({
      activeWorkspaceId: 'org-test-1',
      user: {
        id: 'u-admin',
        email: 'admin@school.edu',
        firstName: 'School',
        lastName: 'Admin',
        role: 'SCHOOL_ADMIN',
      },
    });
    vi.spyOn(usePermissionModule, 'usePermission').mockReturnValue({
      hasPermission: true,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
      checkPermission: () => true,
    });
  });

  it('renders UsersListPage on index route', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/users']}>
          <Routes>
            <Route path="/users/*" element={<UsersRoutes />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText('Members & User Allocations')).toBeInTheDocument();
    expect(screen.getByText('Allocate Role')).toBeInTheDocument();
  });
});
