import * as React from 'react';
import { useMemo } from 'react';
import {
  Users,
  Sliders,
  Copy,
  Power,
  Trash2,
  Lock,
} from 'lucide-react';
import { DataTable, type DataTableColumn } from '@/components/data-display/data-table';
import { RoleTypeBadge } from './role-type-badge';
import { RoleStatusBadge } from './role-status-badge';
import type { RoleSummary } from '../../types/roles.types';
import type { CustomAction } from '@/components/ui/action-menu';

export interface RolesTableProps {
  roles: RoleSummary[];
  loading?: boolean;
  onConfigureMatrix?: (role: RoleSummary) => void;
  onCloneTemplate?: (role: RoleSummary) => void;
  onToggleStatus?: (role: RoleSummary) => void;
  onDeleteRole?: (role: RoleSummary) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const RolesTable: React.FC<RolesTableProps> = ({
  roles,
  loading = false,
  onConfigureMatrix,
  onCloneTemplate,
  onToggleStatus,
  onDeleteRole,
  canEdit = true,
  canDelete = true,
}) => {
  const columns: DataTableColumn<RoleSummary>[] = useMemo(
    () => [
      {
        key: 'roleCode',
        label: 'Role Code',
        sortable: true,
        width: '220px',
        render: (_, row) => (
          <div className="flex flex-col">
            <span className="font-mono text-xs font-bold text-foreground">
              {row.roleCode}
            </span>
          </div>
        ),
      },
      {
        key: 'roleName',
        label: 'Role Name & Description',
        sortable: true,
        render: (_, row) => (
          <div className="flex flex-col max-w-sm">
            <span className="text-xs font-semibold text-foreground">{row.roleName}</span>
            {row.description && (
              <span className="text-[11px] text-muted-foreground truncate" title={row.description}>
                {row.description}
              </span>
            )}
          </div>
        ),
      },
      {
        key: 'roleType',
        label: 'Type',
        sortable: true,
        width: '160px',
        render: (_, row) => <RoleTypeBadge type={row.roleType} />,
      },
      {
        key: 'isActive',
        label: 'Status',
        sortable: true,
        width: '120px',
        render: (_, row) => <RoleStatusBadge isActive={row.isActive} />,
      },
      {
        key: 'assignmentCount',
        label: 'Assigned Users',
        sortable: true,
        width: '140px',
        align: 'center',
        render: (_, row) => (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-medium">
            <Users className="h-3.5 w-3.5 text-muted-foreground/70" />
            {row.assignmentCount ?? 0}
          </span>
        ),
      },
    ],
    []
  );

  const getCustomActions = (row: RoleSummary): CustomAction[] => {
    const isTemplate = row.roleType === 'SYSTEM_TEMPLATE';
    const actions: CustomAction[] = [];

    // 1. Matrix capability editor
    if (onConfigureMatrix) {
      actions.push({
        label: isTemplate ? 'View Capabilities' : 'Configure Matrix',
        icon: isTemplate ? <Lock className="h-3.5 w-3.5 text-muted-foreground" /> : <Sliders className="h-3.5 w-3.5 text-primary" />,
        onClick: () => onConfigureMatrix(row),
      });
    }

    // 2. Clone action
    if (onCloneTemplate) {
      actions.push({
        label: 'Clone as Custom Role',
        icon: <Copy className="h-3.5 w-3.5 text-purple-600" />,
        onClick: () => onCloneTemplate(row),
      });
    }

    // 3. Status toggle (only custom roles)
    if (canEdit && !isTemplate && onToggleStatus) {
      actions.push({
        label: row.isActive ? 'Deactivate Role' : 'Activate Role',
        icon: <Power className="h-3.5 w-3.5 text-amber-600" />,
        onClick: () => onToggleStatus(row),
      });
    }

    // 4. Delete/Archive action (only custom roles)
    if (canDelete && !isTemplate && onDeleteRole) {
      actions.push({
        label: 'Delete / Archive Role',
        icon: <Trash2 className="h-3.5 w-3.5 text-danger" />,
        onClick: () => onDeleteRole(row),
        variant: 'danger',
      });
    }

    return actions;
  };

  return (
    <div className="w-full" data-testid="roles-table-container">
      <DataTable
        columns={columns as DataTableColumn<Record<string, unknown>>[]}
        data={roles as unknown as Record<string, unknown>[]}
        loading={loading}
        searchPlaceholder="Search roles by code or name..."
        actionConfig={{
          customActions: (row) => getCustomActions(row as unknown as RoleSummary),
        }}
        rowIdKey="id"
      />
    </div>
  );
};

