import * as React from 'react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Plus,
  Layers,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import {
  useRolesList,
  useCreateRole,
  useCloneTemplate,
  useDeleteRole,
  useToggleRoleStatus,
} from '@/features/roles-permissions/hooks/use-roles';
import { usePermission } from '@/features/roles-permissions/hooks/use-permission';
import { PermissionGate } from '@/features/roles-permissions/components/guards/permission-gate';
import { RolesTable } from '@/features/roles-permissions/components/role-list/roles-table';
import { CreateRoleModal } from '@/features/roles-permissions/components/role-list/create-role-modal';
import { CloneRoleModal } from '@/features/roles-permissions/components/role-list/clone-role-modal';
import { DeleteRoleModal } from '@/features/roles-permissions/components/role-list/delete-role-modal';
import { RoleMatrixModal } from '@/features/roles-permissions/components/permission-matrix/role-matrix-modal';
import { StatsCard } from '@/components/data-display/stats-card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/feedback/alert';
import type {
  RoleSummary,
  CreateRolePayload,
  CloneTemplatePayload,
} from '@/features/roles-permissions/types/roles.types';

export type RoleTab = 'all' | 'custom' | 'templates';

export const RolesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<RoleTab>('all');
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [cloneTarget, setCloneTarget] = useState<RoleSummary | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RoleSummary | null>(null);
  const [matrixTarget, setMatrixTarget] = useState<RoleSummary | null>(null);

  // Dynamic RBAC capability permissions
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
        text: `Role template cloned as "${payload.roleName}"`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to clone role';
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
        text: res.message || `Role "${deleteTarget.roleName}" removed successfully`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete role';
      setFeedbackMessage({ type: 'error', text: msg });
    }
  };

  const handleToggleStatus = async (role: RoleSummary) => {
    try {
      await toggleStatusMutation.mutateAsync({
        roleId: role.id,
        isActive: !role.isActive,
      });
      setFeedbackMessage({
        type: 'success',
        text: `Role "${role.roleName}" is now ${!role.isActive ? 'Active' : 'Inactive'}`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update role status';
      setFeedbackMessage({ type: 'error', text: msg });
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Roles & Capability Matrix
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure system role templates and tenant-specific custom roles across the canonical 212-node capability tree.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <PermissionGate permission="settings.roles_permissions.rbac.edit">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/roles/new')}
              icon={<Plus className="h-4 w-4" />}
            >
              New Role Page
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              icon={<Plus className="h-4 w-4" />}
            >
              Quick Create Role
            </Button>
          </PermissionGate>
        </div>
      </div>

      {/* Feedback Messages */}
      {feedbackMessage && (
        <Alert
          variant={feedbackMessage.type === 'success' ? 'success' : 'error'}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-xs font-semibold hover:underline"
          >
            Dismiss
          </button>
        </Alert>
      )}

      {queryError && (
        <Alert variant="error" className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Failed to load roles: {queryError.message}</span>
        </Alert>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard
          title="Total Configured"
          value={stats.total}
          icon={Shield}
          subtitle="Total active & template roles"
        />
        <StatsCard
          title="Custom Roles"
          value={stats.custom}
          icon={Layers}
          subtitle="Tenant-specific customizations"
        />
        <StatsCard
          title="System Templates"
          value={stats.templates}
          icon={Sparkles}
          subtitle="Institutional base templates"
        />
        <StatsCard
          title="Active Roles"
          value={stats.active}
          icon={Shield}
          subtitle="Available for member assignment"
        />
      </div>

      {/* Tab Filter Controls */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-1 rounded-xl border border-border bg-surface p-1 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted-foreground hover:bg-surface-muted hover:text-foreground'
            }`}
          >
            All Roles ({stats.total})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'custom'
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted-foreground hover:bg-surface-muted hover:text-foreground'
            }`}
          >
            Custom Roles ({stats.custom})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('templates')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'templates'
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted-foreground hover:bg-surface-muted hover:text-foreground'
            }`}
          >
            System Templates ({stats.templates})
          </button>
        </div>
      </div>

      {/* Roles Table */}
      <RolesTable
        roles={filteredRoles}
        loading={isLoading}
        canEdit={canEdit}
        canDelete={canDelete}
        onCloneTemplate={(role: RoleSummary) => setCloneTarget(role)}
        onDeleteRole={(role: RoleSummary) => setDeleteTarget(role)}
        onToggleStatus={handleToggleStatus}
        onConfigureMatrix={(role: RoleSummary) => setMatrixTarget(role)}
      />

      {/* Modals */}
      <CreateRoleModal
        isOpen={isCreateOpen}
        loading={createMutation.isPending}
        error={createMutation.error?.message}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      <CloneRoleModal
        isOpen={Boolean(cloneTarget)}
        template={cloneTarget}
        loading={cloneMutation.isPending}
        error={cloneMutation.error?.message}
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

      <RoleMatrixModal
        isOpen={Boolean(matrixTarget)}
        role={matrixTarget}
        onClose={() => setMatrixTarget(null)}
      />
    </div>
  );
};

