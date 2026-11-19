import React from 'react';
import { KeyRound } from 'lucide-react';
import { AdminDrawer } from '../common/admin-drawer';
import { UserAssignmentsPanel } from '@/features/roles-permissions/components/assignments/user-assignments-panel';
import type { AdminUserRecord } from '../../types/admin.types';

export interface UserAllocationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUserRecord | null;
}

export const UserAllocationsDrawer: React.FC<UserAllocationsDrawerProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  if (!user) return null;

  const memberSummary = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone ?? null,
    isActive: user.status === 'ACTIVE',
  };

  return (
    <AdminDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Role Allocations & Scope"
      subtitle={`${user.firstName} ${user.lastName} (${user.email})`}
      width="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
            <KeyRound className="h-5 w-5" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-foreground">
              Dynamic RBAC Scope Assignment
            </p>
            <p className="text-muted-foreground">
              Assign roles at organization-wide or specific campus scopes. Only roles within your active delegation ceiling are assignable.
            </p>
          </div>
        </div>

        <UserAssignmentsPanel initialMember={memberSummary} />
      </div>
    </AdminDrawer>
  );
};
