import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuditDetailDrawer } from './audit-detail-drawer';
import type { AuditLogRecord } from '../../types/admin.types';

const mockRecord: AuditLogRecord = {
  id: 'aud_test_001',
  organizationId: 'org_test_100',
  locationId: 'loc_campus_a',
  campusName: 'Main Campus',
  userId: 'usr_admin_42',
  actorName: 'Eleanor Vance',
  actorEmail: 'admin@school.edu',
  action: 'ROLE_CAPABILITIES_UPDATED',
  entity: 'Role',
  entityId: 'role-exam-officer',
  previousState: {
    roleCode: 'EXAM_OFFICER',
    permissionsCount: 5,
  },
  newState: {
    roleCode: 'EXAM_OFFICER',
    permissionsCount: 8,
    addedPermissions: ['exams.grades.publish'],
  },
  ipAddress: '192.168.1.55',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0.0.0',
  createdAt: '2026-11-20T10:30:00Z',
};

function renderDrawer(
  props: Partial<React.ComponentProps<typeof AuditDetailDrawer>> = {}
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });

  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    record: mockRecord,
    ...props,
  };

  return {
    ...render(
      <QueryClientProvider client={queryClient}>
        <AuditDetailDrawer {...defaultProps} />
      </QueryClientProvider>
    ),
    props: defaultProps,
  };
}

describe('AuditDetailDrawer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('does not render when isOpen is false', () => {
    renderDrawer({ isOpen: false });
    expect(screen.queryByText('Audit Trail Forensics')).not.toBeInTheDocument();
  });

  it('does not render when record is null', () => {
    renderDrawer({ record: null });
    expect(screen.queryByText('Audit Trail Forensics')).not.toBeInTheDocument();
  });

  it('renders event header and metadata correctly', () => {
    renderDrawer();
    expect(screen.getByText('Audit Trail Forensics')).toBeInTheDocument();
    expect(screen.getByText('Event ID: aud_test_001')).toBeInTheDocument();
    expect(screen.getByText('ROLE_CAPABILITIES_UPDATED')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('ID: role-exam-officer')).toBeInTheDocument();
    expect(screen.getByText('192.168.1.55')).toBeInTheDocument();
  });

  it('renders actor details accurately', () => {
    renderDrawer();
    expect(screen.getByText('Eleanor Vance')).toBeInTheDocument();
    expect(screen.getByText('admin@school.edu')).toBeInTheDocument();
    expect(screen.getByText('usr_admin_42')).toBeInTheDocument();
  });

  it('renders campus and organization scope accurately', () => {
    renderDrawer();
    expect(screen.getByText('Main Campus')).toBeInTheDocument();
    expect(screen.getByText('org_test_100')).toBeInTheDocument();
  });

  it('renders previous and new state diff json blocks', () => {
    renderDrawer();
    const matches = screen.getAllByText(/permissionsCount/);
    expect(matches.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/exams\.grades\.publish/)).toBeInTheDocument();
  });

  it('renders clean fallback messages when previous or new state is null', () => {
    const createRecord: AuditLogRecord = {
      ...mockRecord,
      id: 'aud_create_001',
      action: 'LOGIN_SUCCESS',
      previousState: null,
      newState: { ip: '10.0.0.1' },
    };

    renderDrawer({ record: createRecord });
    expect(
      screen.getByText('// No previous record state (Create/Initiate event)')
    ).toBeInTheDocument();
  });

  it('copies JSON payload when Copy JSON button is clicked', () => {
    renderDrawer();
    const copyBtn = screen.getByRole('button', { name: /Copy JSON/i });
    fireEvent.click(copyBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining('aud_test_001')
    );
  });

  it('calls onClose when Close button is clicked', () => {
    const { props } = renderDrawer();
    const closeBtns = screen.getAllByRole('button', { name: /Close/i });
    fireEvent.click(closeBtns[0]!);
    expect(props.onClose).toHaveBeenCalled();
  });
});
