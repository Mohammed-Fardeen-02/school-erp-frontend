import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Sliders,
  Users,
  Copy,
  Edit2,
  Lock,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { AdminDrawer } from '../common/admin-drawer';
import { AdminStatusBadge } from '../common/admin-status-badge';
import { RoleTypeBadge } from '@/features/roles-permissions/components/role-list/role-type-badge';
import { Button } from '@/components/ui/button';
import type { RoleSummary } from '@/features/roles-permissions/types/roles.types';

export interface RoleViewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  role: RoleSummary | null;
  onEdit?: (role: RoleSummary) => void;
  onClone?: (role: RoleSummary) => void;
  onManageAssignments?: (role: RoleSummary) => void;
}

export const RoleViewDrawer: React.FC<RoleViewDrawerProps> = ({
  isOpen,
  onClose,
  role,
  onEdit,
  onClone,
  onManageAssignments,
}) => {
  const navigate = useNavigate();

  if (!role) return null;

  const isTemplate = role.roleType === 'SYSTEM_TEMPLATE';

  return (
    <AdminDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={role.roleName}
      subtitle={`Code: ${role.roleCode}`}
      width="max-w-xl"
    >
      <div className="space-y-6">
        {/* Classification & Status Card */}
        <div className="rounded-2xl border border-border bg-surface-muted/20 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RoleTypeBadge type={role.roleType} />
              <AdminStatusBadge status={role.isActive ? 'ACTIVE' : 'INACTIVE'} />
            </div>
            <code className="text-xs font-mono font-bold text-muted-foreground bg-surface px-2 py-0.5 rounded border border-border">
              {role.roleCode}
            </code>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Description
            </span>
            <p className="text-xs text-foreground leading-relaxed">
              {role.description || 'No description provided for this role.'}
            </p>
          </div>

          {isTemplate ? (
            <div className="rounded-xl border border-purple-200 bg-purple-50/60 p-3 text-xs text-purple-900 flex items-start gap-2.5">
              <Lock className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Platform Immutable Baseline</span>
                <span>
                  This system role template is platform-managed. It cannot be altered, renamed, or deleted by tenants. You can clone this template to create an editable custom role.
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-foreground flex items-start gap-2.5">
              <Layers className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Tenant Custom Role</span>
                <span>
                  This operational role is managed directly within your organization context. You can configure granular capabilities via the matrix or reallocate staff members.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Operational Statistics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-surface p-4">
            <span className="text-xs font-medium text-muted-foreground block">Allocated Members</span>
            <div className="text-2xl font-black text-foreground mt-1">
              {Number(role.assignmentCount || 0)}
            </div>
            <span className="text-[11px] text-muted-foreground mt-0.5 block">
              Active staff & teachers
            </span>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4">
            <span className="text-xs font-medium text-muted-foreground block">Capability Scope</span>
            <div className="text-2xl font-black text-foreground mt-1">
              {isTemplate ? 'Global' : 'Tenant'}
            </div>
            <span className="text-[11px] text-muted-foreground mt-0.5 block">
              {isTemplate ? 'Standardized archetype' : 'Custom institutional profile'}
            </span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-3 pt-2">
          <Button
            variant="primary"
            className="w-full justify-between"
            onClick={() => {
              onClose();
              navigate(`/admin/roles/${role.id}/matrix`);
            }}
            icon={<Sliders className="h-4 w-4" />}
          >
            <span>{isTemplate ? 'Inspect Capability Matrix' : 'Configure Permission Matrix'}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>

          {onManageAssignments && (
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => {
                onClose();
                onManageAssignments(role);
              }}
              icon={<Users className="h-4 w-4 text-primary" />}
            >
              <span>Manage Member Allocations</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}

          {!isTemplate && onEdit && (
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                onClose();
                onEdit(role);
              }}
              icon={<Edit2 className="h-4 w-4" />}
            >
              Edit Role Metadata
            </Button>
          )}

          {onClone && (
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                onClose();
                onClone(role);
              }}
              icon={<Copy className="h-4 w-4 text-purple-600" />}
            >
              Clone as New Custom Role
            </Button>
          )}
        </div>
      </div>
    </AdminDrawer>
  );
};

