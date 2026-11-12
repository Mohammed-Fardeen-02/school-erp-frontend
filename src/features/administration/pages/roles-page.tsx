import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Sliders,
  Copy,
  Trash2,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { PageWrapper } from '@/app/layouts/page-wrapper';
import { AdminPageHeader } from '../components/common/admin-page-header';
import { AdminStatsRow } from '../components/common/admin-stats-row';
import { AdminStatusBadge } from '../components/common/admin-status-badge';
import { RoleTypeBadge } from '@/features/roles-permissions/components/role-list/role-type-badge';
import { CloneRoleModal } from '@/features/roles-permissions/components/role-list/clone-role-modal';
import { DeleteRoleModal } from '@/features/roles-permissions/components/role-list/delete-role-modal';
import { Button } from '@/components/ui/button';
import {
  useRolesList,
  useCloneTemplate,
  useDeleteRole,
} from '@/features/roles-permissions/hooks/use-roles';
import type { RoleSummary, CloneTemplatePayload } from '@/features/roles-permissions/types/roles.types';

export const RolesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'custom' | 'templates'>('all');
  const [cloneTarget, setCloneTarget] = useState<RoleSummary | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RoleSummary | null>(null);

  const { data: rolesData } = useRolesList();
  const cloneMutation = useCloneTemplate();
  const deleteMutation = useDeleteRole();

  const allRoles = useMemo(() => rolesData?.roles ?? [], [rolesData?.roles]);

  const filteredRoles = useMemo(() => {
    if (activeTab === 'custom') return allRoles.filter((r) => r.roleType === 'CUSTOM');
    if (activeTab === 'templates') return allRoles.filter((r) => r.roleType === 'SYSTEM_TEMPLATE');
    return allRoles;
  }, [allRoles, activeTab]);

  const stats = useMemo(() => {
    const total = allRoles.length;
    const custom = allRoles.filter((r) => r.roleType === 'CUSTOM').length;
    const templates = allRoles.filter((r) => r.roleType === 'SYSTEM_TEMPLATE').length;
    const active = allRoles.filter((r) => r.isActive).length;

    return [
      { title: 'Total Roles', value: total, icon: Shield, subtitle: 'Configured role identities' },
      { title: 'Custom Roles', value: custom, icon: Sliders, subtitle: 'Tenant-authored roles' },
      { title: 'System Templates', value: templates, icon: FileText, subtitle: 'Immutable platform baselines' },
      { title: 'Active Allocations', value: active, icon: CheckCircle2, subtitle: 'Enabled role definitions' },
    ];
  }, [allRoles]);

  const handleCloneSubmit = async (templateId: string, payload: CloneTemplatePayload) => {
    await cloneMutation.mutateAsync({ templateId, payload });
    setCloneTarget(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <PageWrapper className="space-y-6">
      <AdminPageHeader
        title="Roles & Permissions Management"
        subtitle="Manage custom role definitions, assign capabilities with checkboxes, and inspect 212-node TriState matrix."
        icon={Shield}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Administration', href: '/admin' },
          { label: 'Roles & Permissions' },
        ]}
        actionLabel="Create Custom Role"
        onActionClick={() => navigate('/admin/roles/new')}
      />

      {/* KPI Stats */}
      <AdminStatsRow stats={stats} />

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border pb-px">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'all'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          All Roles ({allRoles.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('custom')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'custom'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Custom Roles ({allRoles.filter((r) => r.roleType === 'CUSTOM').length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'templates'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          System Templates ({allRoles.filter((r) => r.roleType === 'SYSTEM_TEMPLATE').length})
        </button>
      </div>

      {/* Data Table */}
      <div className="rounded-2xl border border-border bg-surface shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-muted/60 text-muted-foreground uppercase font-bold text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-4">Role Identifier & Name</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Allocated Members</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRoles.map((role) => (
                <tr key={role.id} className="hover:bg-surface-muted/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-sm text-foreground">{role.roleName}</div>
                    <div className="font-mono text-[11px] text-muted-foreground">{role.roleCode}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <RoleTypeBadge type={role.roleType} />
                  </td>
                  <td className="py-3.5 px-4">
                    <AdminStatusBadge status={role.isActive ? 'ACTIVE' : 'INACTIVE'} />
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-foreground">
                    {role.assignmentCount ?? 0} Members
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/admin/roles/${role.id}/matrix`)}
                        title="Capability Matrix (TriState)"
                        icon={<Sliders className="h-4 w-4 text-primary" />}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCloneTarget(role)}
                        title="Clone Template into Custom Role"
                        icon={<Copy className="h-4 w-4 text-muted-foreground" />}
                      />
                      {role.roleType === 'CUSTOM' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTarget(role)}
                          title="Delete Custom Role"
                          icon={<Trash2 className="h-4 w-4 text-danger" />}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {cloneTarget && (
        <CloneRoleModal
          isOpen={Boolean(cloneTarget)}
          template={cloneTarget}
          onClose={() => setCloneTarget(null)}
          onSubmit={handleCloneSubmit}
          loading={cloneMutation.isPending}
        />
      )}

      {deleteTarget && (
        <DeleteRoleModal
          isOpen={Boolean(deleteTarget)}
          role={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          loading={deleteMutation.isPending}
        />
      )}
    </PageWrapper>
  );
};
