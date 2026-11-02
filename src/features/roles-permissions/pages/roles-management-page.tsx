import * as React from 'react';
import { useState, useMemo } from 'react';
import {
  Shield,
  ShieldPlus,
  Layers,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  UserCheck,
} from 'lucide-react';
import { useRolesList, useCreateRole, useCloneTemplate, useDeleteRole, useToggleRoleStatus } from '../hooks/use-roles';
import { usePermission } from '../hooks/use-permission';
import { PermissionGate } from '../components/guards/permission-gate';
import { RolesTable } from '../components/role-list/roles-table';
import { CreateRoleModal } from '../components/role-list/create-role-modal';
import { CloneRoleModal } from '../components/role-list/clone-role-modal';
import { DeleteRoleModal } from '../components/role-list/delete-role-modal';
import { RoleMatrixModal } from '../components/permission-matrix/role-matrix-modal';
import { AssignRoleModal } from '../components/assignments/assign-role-modal';
import { StatsCard } from '@/components/data-display/stats-card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/feedback/alert';
import { PageWrapper } from '@/app/layouts/page-wrapper';
import { Breadcrumb } from '@/app/layouts/breadcrumb';
import { ROUTES } from '@/app/router/routes';
import { useAuthStore } from '@/stores/auth-store';
import type { RoleSummary, CreateRolePayload, CloneTemplatePayload } from '../types/roles.types';
import type { AssignmentRecord } from '../types/assignments.types';

export type RoleTab = 'all' | 'custom' | 'templates';

export const RolesManagementPage: React.FC = () => {
  const { getActiveWorkspace } = useAuthStore();
  const activeWorkspace = getActiveWorkspace();

  const [activeTab, setActiveTab] = useState<RoleTab>('all');
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [cloneTarget, setCloneTarget] = useState<RoleSummary | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RoleSummary | null>(null);
  const [matrixTarget, setMatrixTarget] = useState<RoleSummary | null>(null);

  // Permissions
  const { hasPermission: canEdit } = usePermission('settings.roles_permissions.rbac.edit');
  const { hasPermission: canDelete } = usePermission('settings.roles_permissions.rbac.delete');

  // Queries & Mutations
  const { data: rolesData, isLoading, error: queryError } = useRolesList();
  const createMutation = useCreateRole();
  const cloneMutation = useCloneTemplate();
  const deleteMutation = useDeleteRole();
  const toggleStatusMutation = useToggleRoleStatus();

  const allRoles = useMemo(() => rolesData?.roles ?? [], [rolesData?.roles]);

  // Derived filtered roles
  const filteredRoles = useMemo(() => {
    if (activeTab === 'custom') {
      return allRoles.filter((r) => r.roleType === 'CUSTOM');
    }
    if (activeTab === 'templates') {
      return allRoles.filter((r) => r.roleType === 'SYSTEM_TEMPLATE');
    }
    return allRoles;
  }, [allRoles, activeTab]);

  // Derived metrics
  const stats = useMemo(() => {
    const total = allRoles.length;
    const custom = allRoles.filter((r) => r.roleType === 'CUSTOM').length;
    const templates = allRoles.filter((r) => r.roleType === 'SYSTEM_TEMPLATE').length;
    const active = allRoles.filter((r) => r.isActive).length;

    return { total, custom, templates, active };
  }, [allRoles]);

  // Handlers
  const handleCreateSubmit = async (payload: CreateRolePayload) => {
    try {
      await createMutation.mutateAsync(payload);
      setIsCreateOpen(false);
      setFeedbackMessage({
        type: 'success',
        text: `Custom role "${payload.roleName}" created successfully`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create role';
      setFeedbackMessage({ type: 'error', text: msg });
    }
  };

  const handleCloneSubmit = async (templateId: string, payload: CloneTemplatePayload) => {
    try {
      await cloneMutation.mutateAsync({ templateId, payload });
      setCloneTarget(null);
      setFeedbackMessage({
        type: 'success',
        text: `Template cloned successfully into custom role "${payload.roleName}"`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to clone template';
      setFeedbackMessage({ type: 'error', text: msg });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
      setFeedbackMessage({
        type: 'success',
        text: res.message || 'Role action completed successfully',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete or archive role';
      setFeedbackMessage({ type: 'error', text: msg });
    }
  };

  const handleToggleStatus = async (role: RoleSummary) => {
    try {
      const nextStatus = !role.isActive;
      await toggleStatusMutation.mutateAsync({ roleId: role.id, isActive: nextStatus });
      setFeedbackMessage({
        type: 'success',
        text: `Role "${role.roleName}" is now ${nextStatus ? 'active' : 'inactive'}`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update role status';
      setFeedbackMessage({ type: 'error', text: msg });
    }
  };

  const handleAssignSuccess = (assignment: AssignmentRecord) => {
    setIsAssignOpen(false);
    setFeedbackMessage({
      type: 'success',
      text: `Role assigned successfully${assignment.role?.roleName ? ` (${assignment.role.roleName})` : ''}`,
    });
  };

  return (
    <PageWrapper className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Workspace', href: ROUTES.WORKSPACE },
          { label: 'Institutional Settings', href: '/app/settings' },
          { label: 'Roles & Security' },
        ]}
      />

      {/* Page Title & CTAs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-hover text-white shadow-md shadow-primary/20">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-foreground tracking-tight sm:text-2xl">
                Roles & Permission Profiles
              </h1>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Manage tenant-isolated roles, review immutable templates, and configure capability profiles for{' '}
                <span className="font-semibold text-foreground">
                  {activeWorkspace?.name || 'Active Institution'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Action CTAs guarded by canonical permission */}
        <div className="flex items-center gap-2.5">
          <PermissionGate permission="settings.user_assignments.allocations.assign">
            <Button
              variant="outline"
              size="sm"
              data-testid="open-assign-role-button"
              onClick={() => setIsAssignOpen(true)}
              icon={<UserCheck className="h-4 w-4" />}
            >
              Assign Role
            </Button>
          </PermissionGate>

          <PermissionGate permission="settings.roles_permissions.rbac.create">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              icon={<ShieldPlus className="h-4 w-4" />}
            >
              Create Custom Role
            </Button>
          </PermissionGate>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedbackMessage && (
        <Alert
          variant={feedbackMessage.type === 'success' ? 'success' : 'error'}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-danger" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-xs font-semibold underline hover:opacity-80 ml-4 cursor-pointer"
          >
            Dismiss
          </button>
        </Alert>
      )}

      {/* Query Error Alert */}
      {queryError && (
        <Alert variant="error" className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Failed to load roles: {queryError.message}</span>
        </Alert>
      )}

      {/* Stats Summary Overview Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard
          title="Total Profiles"
          value={stats.total}
          subtitle="System & Custom roles"
          icon={<Layers className="h-5 w-5 text-primary" />}
        />
        <StatsCard
          title="Active Roles"
          value={stats.active}
          subtitle="Operational in tenant"
          icon={<Shield className="h-5 w-5 text-emerald-600" />}
        />
        <StatsCard
          title="Custom Roles"
          value={stats.custom}
          subtitle="Tenant defined"
          icon={<ShieldPlus className="h-5 w-5 text-purple-600" />}
        />
        <StatsCard
          title="System Templates"
          value={stats.templates}
          subtitle="Pre-seeded baselines"
          icon={<Sparkles className="h-5 w-5 text-blue-600" />}
        />
      </div>

      {/* Tab Navigation & Search Toolbar */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-px">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`cursor-pointer px-4 py-2 text-xs font-bold transition-colors border-b-2 -mb-px ${
              activeTab === 'all'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            All Roles ({stats.total})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`cursor-pointer px-4 py-2 text-xs font-bold transition-colors border-b-2 -mb-px ${
              activeTab === 'custom'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Custom Roles ({stats.custom})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('templates')}
            className={`cursor-pointer px-4 py-2 text-xs font-bold transition-colors border-b-2 -mb-px ${
              activeTab === 'templates'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            System Templates ({stats.templates})
          </button>
        </div>

        {/* Roles Data Table */}
        <RolesTable
          roles={filteredRoles}
          loading={isLoading}
          onConfigureMatrix={(role) => setMatrixTarget(role)}
          onCloneTemplate={(role) => setCloneTarget(role)}
          onToggleStatus={handleToggleStatus}
          onDeleteRole={(role) => setDeleteTarget(role)}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      </div>

      {/* Modals */}
      <RoleMatrixModal
        isOpen={Boolean(matrixTarget)}
        role={matrixTarget}
        onClose={() => setMatrixTarget(null)}
      />

      <CreateRoleModal
        isOpen={isCreateOpen}
        loading={createMutation.isPending}
        error={createMutation.error?.message ?? null}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      <CloneRoleModal
        isOpen={Boolean(cloneTarget)}
        template={cloneTarget}
        loading={cloneMutation.isPending}
        error={cloneMutation.error?.message ?? null}
        onClose={() => setCloneTarget(null)}
        onSubmit={handleCloneSubmit}
      />

      <DeleteRoleModal
        isOpen={Boolean(deleteTarget)}
        role={deleteTarget}
        loading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      <AssignRoleModal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        onSuccess={handleAssignSuccess}
      />
    </PageWrapper>
  );
};
