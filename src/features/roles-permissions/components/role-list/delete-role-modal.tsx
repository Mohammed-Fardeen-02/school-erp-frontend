import React from 'react';
import { ConfirmationModal } from '@/components/feedback/confirmation-modal';
import type { RoleSummary } from '../../types/roles.types';

export interface DeleteRoleModalProps {
  isOpen: boolean;
  role: RoleSummary | null;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteRoleModal: React.FC<DeleteRoleModalProps> = ({
  isOpen,
  role,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!role) return null;

  const hasAssignments = (role.assignmentCount ?? 0) > 0;

  const description = hasAssignments ? (
    <span className="block space-y-2 text-sm text-muted-foreground">
      <span className="block">
        This role currently has{' '}
        <span className="font-semibold text-foreground">
          {role.assignmentCount} historical assignment(s)
        </span>
        .
      </span>
      <span className="block rounded-lg bg-surface-muted p-2.5 text-xs text-muted-foreground border border-border">
        <strong className="text-foreground">Audit Preservation Notice:</strong> To ensure compliance
        and satisfy database foreign-key integrity constraints, this role cannot be physically
        deleted. Confirming will{' '}
        <strong className="text-foreground">safely archive and deactivate</strong> it.
      </span>
    </span>
  ) : (
    <span className="block text-sm text-muted-foreground">
      This role has zero assignments and will be{' '}
      <strong className="text-danger">permanently deleted</strong> along with its configured
      capability records. This action cannot be undone.
    </span>
  );

  return (
    <ConfirmationModal
      isOpen={isOpen}
      title={hasAssignments ? 'Archive Custom Role' : 'Delete Custom Role'}
      description={description}
      itemName={`${role.roleName} (${role.roleCode})`}
      confirmText={hasAssignments ? 'Archive Role' : 'Permanently Delete'}
      cancelText="Cancel"
      variant="danger"
      loading={loading}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};
