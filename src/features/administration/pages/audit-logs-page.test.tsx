import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { AuditLogsPage } from './audit-logs-page';
import { AdminApi } from '../api/admin.api';
import * as usePermissionModule from '@/features/roles-permissions/hooks/use-permission';
import type { PaginatedAuditLogsResult, AuditLogRecord } from '../types/admin.types';

vi.mock('../api/admin.api');
vi.mock('@/features/roles-permissions/hooks/use-permission');

const mockAuditLogs: AuditLogRecord[] = [
  {
    id: 'aud_1',
    organizationId: 'org_main',
    locationId: 'loc_north',
    campusName: 'North Campus',
    userId: 'usr_1',
    actorName: 'Eleanor Vance',
    actorEmail: 'admin@school.edu',
    action: 'ROLE_CAPABILITIES_UPDATED',
    entity: 'Role',
    entityId: 'role_principal',
    previousState: { permissions: ['settings.view'] },
    newState: { permissions: ['settings.view', 'settings.edit'] },
    ipAddress: '192.168.1.10',
    userAgent: 'Chrome on macOS',
    createdAt: '2026-11-20T08:00:00Z',
  },
  {
    id: 'aud_2',
    organizationId: 'org_main',
    locationId: null,
    campusName: null,
    userId: 'usr_2',
    actorName: 'Arthur Pendelton',
    actorEmail: 'staff@school.edu',
    action: 'LOGIN_SUCCESS',
    entity: 'Session',
    entityId: 'sess_99',
    previousState: null,
    newState: { ipAddress: '10.0.0.5' },
    ipAddress: '10.0.0.5',
    userAgent: 'Firefox on Windows',
    createdAt: '2026-11-20T09:00:00Z',
  },
];

const mockPaginatedResult: PaginatedAuditLogsResult = {
  logs: mockAuditLogs,
  total: 2,
  page: 1,
  limit: 10,
  totalPages: 1,
};

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AuditLogsPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('AuditLogsPage Directory Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(AdminApi.listAuditLogs).mockResolvedValue(mockPaginatedResult);
    vi.mocked(AdminApi.getAuditLogById).mockImplementation(async (id: string) => {
      const found = mockAuditLogs.find((l) => l.id === id);
      return (found || mockAuditLogs[0]) as AuditLogRecord;
    });
    vi.mocked(AdminApi.listCampuses).mockResolvedValue([
      {
        id: 'loc_north',
        organizationId: 'org_main',
        code: 'CAMPUS_NORTH',
        name: 'North Campus',
        isMainCampus: true,
        isActive: true,
        createdAt: '2026-11-20T00:00:00Z',
      },
      {
        id: 'loc_south',
        organizationId: 'org_main',
        code: 'CAMPUS_SOUTH',
        name: 'South Campus',
        isMainCampus: false,
        isActive: true,
        createdAt: '2026-11-20T00:00:00Z',
      },
    ]);
    vi.mocked(AdminApi.exportAuditLogs).mockResolvedValue({
      blob: new Blob(['id,action\naud_1,ROLE_CAPABILITIES_UPDATED'], { type: 'text/csv' }),
      filename: 'audit_logs_2026-11-20.csv',
    });

    vi.spyOn(usePermissionModule, 'usePermission').mockReturnValue({
      hasPermission: true,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
      checkPermission: () => true,
    });

    window.URL.createObjectURL = vi.fn().mockReturnValue('blob:http://localhost/mock-blob');
    window.URL.revokeObjectURL = vi.fn();
  });

  it('renders page header, KPI metrics, and total record count', async () => {
    renderPage();

    expect(
      screen.getByRole('heading', { level: 1, name: 'Audit & Compliance Logs' })
    ).toBeInTheDocument();
    expect(await screen.findByText('Total Audit Trails')).toBeInTheDocument();
    expect(await screen.findByText('2 Total Events')).toBeInTheDocument();
  });

  it('renders table columns and rows from backend response', async () => {
    renderPage();

    expect(await screen.findByText('Eleanor Vance')).toBeInTheDocument();
    expect(screen.getByText('Arthur Pendelton')).toBeInTheDocument();
    expect(screen.getAllByText('ROLE_CAPABILITIES_UPDATED').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('North Campus').length).toBeGreaterThanOrEqual(1);
  });

  it('filters audit records and resets page to 1 on input', async () => {
    renderPage();

    const searchInput = screen.getByPlaceholderText(/search by actor name/i);
    fireEvent.change(searchInput, { target: { value: 'Eleanor' } });

    await waitFor(() => {
      expect(AdminApi.listAuditLogs).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'Eleanor',
          page: 1,
        })
      );
    });
  });

  it('filters by action dropdown', async () => {
    renderPage();

    const actionSelect = screen.getByRole('combobox', { name: /filter by event action/i });
    fireEvent.change(actionSelect, { target: { value: 'LOGIN_SUCCESS' } });

    await waitFor(() => {
      expect(AdminApi.listAuditLogs).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'LOGIN_SUCCESS',
          page: 1,
        })
      );
    });
  });

  it('opens detail drawer when inspecting a record', async () => {
    renderPage();

    expect(await screen.findByText('Eleanor Vance')).toBeInTheDocument();
    const inspectBtns = screen.getAllByRole('button', { name: /Inspect/i });
    fireEvent.click(inspectBtns[0]!);

    expect(await screen.findByText('Audit Trail Forensics')).toBeInTheDocument();
    expect(screen.getByText('Event ID: aud_1')).toBeInTheDocument();
  });

  it('exports CSV archive when Export button is clicked and user has export permission', async () => {
    renderPage();

    expect(await screen.findByText('Eleanor Vance')).toBeInTheDocument();
    const exportBtn = screen.getByRole('button', { name: /Export CSV/i });
    expect(exportBtn).not.toBeDisabled();
    fireEvent.click(exportBtn);

    await waitFor(() => {
      expect(AdminApi.exportAuditLogs).toHaveBeenCalled();
      expect(window.URL.createObjectURL).toHaveBeenCalled();
    });
  });

  it('hides export button when user lacks export permission', async () => {
    vi.spyOn(usePermissionModule, 'usePermission').mockReturnValue({
      hasPermission: false,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
      checkPermission: () => false,
    });

    renderPage();

    expect(await screen.findByText('Total Audit Trails')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Export CSV/i })).not.toBeInTheDocument();
  });

  it('renders error state and retries on failure', async () => {
    vi.mocked(AdminApi.listAuditLogs).mockRejectedValueOnce(
      new Error('Failed to query database')
    );

    renderPage();

    expect(
      await screen.findByText(/Failed to retrieve audit log telemetry/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Failed to query database')).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /Retry Query/i });
    vi.mocked(AdminApi.listAuditLogs).mockResolvedValue(mockPaginatedResult);
    fireEvent.click(retryBtn);

    expect(await screen.findByText('Eleanor Vance')).toBeInTheDocument();
  });

  it('restricts campus selector and locks query when user is campus-scoped', async () => {
    const { useAuthStore } = await import('@/stores/auth-store');
    useAuthStore.setState({
      activeLocationId: 'loc_north',
      user: {
        id: 'usr_campus_lead',
        email: 'lead@school.edu',
        firstName: 'Campus',
        lastName: 'Lead',
        role: 'STAFF',
      },
    });

    renderPage();

    const campusSelect = screen.getByRole('combobox', { name: /filter by campus location/i });
    expect(campusSelect).toBeDisabled();
    expect(await screen.findByText('North Campus (Assigned Scope)')).toBeInTheDocument();
    expect(screen.queryByText('All Campus Scopes')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(AdminApi.listAuditLogs).toHaveBeenCalledWith(
        expect.objectContaining({
          locationId: 'loc_north',
        })
      );
    });

    // Reset store
    useAuthStore.setState({ activeLocationId: null, user: null });
  });

  it('displays explicitly labelled current-page metrics alongside server total', async () => {
    renderPage();

    expect(await screen.findByText('Total Audit Trails')).toBeInTheDocument();
    expect(screen.getByText('Page RBAC Mutations')).toBeInTheDocument();
    expect(screen.getByText('Page Auth Events')).toBeInTheDocument();
    expect(screen.getByText('Page Target Entities')).toBeInTheDocument();
  });
});

