import * as React from 'react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserAssignmentsTable } from '@/features/roles-permissions/components/assignments/user-assignments-table';
import { AssignRoleModal } from '@/features/roles-permissions/components/assignments/assign-role-modal';
import { RevokeAssignmentModal } from '@/features/roles-permissions/components/assignments/revoke-assignment-modal';
import { useUserAssignments } from '@/features/roles-permissions/hooks/use-assignments';
import { PermissionGate } from '@/features/roles-permissions/components/guards/permission-gate';
import type { AssignmentRecord } from '@/features/roles-permissions/types/assignments.types';

export const UserAllocationsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedRevokeAssignment, setSelectedRevokeAssignment] = useState<AssignmentRecord | null>(null);

  const { data: assignments = [], isLoading, refetch } = useUserAssignments(id);

  const activeCount = assignments.filter((a) => a.isActive).length;
  const revokedCount = assignments.filter((a) => !a.isActive).length;

  const firstUser = assignments[0]?.user;
  const userName = firstUser
    ? `${firstUser.firstName} ${firstUser.lastName}`
    : `User Allocations`;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/users')}
            icon={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Users
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-foreground">{userName}</h1>
            </div>
            {firstUser && (
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <span>{firstUser.email}</span>
                <span>•</span>
                <span className="font-mono">User ID: {id}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <PermissionGate permission="settings.user_assignments.allocations.assign">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAssignModalOpen(true)}
              icon={<UserPlus className="h-4 w-4" />}
            >
              Assign Role
            </Button>
          </PermissionGate>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-xs">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Active Allocations
          </span>
          <div className="mt-2 text-2xl font-black text-emerald-600">{activeCount}</div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 shadow-xs">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Revoked Roles
          </span>
          <div className="mt-2 text-2xl font-black text-muted-foreground">{revokedCount}</div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 shadow-xs">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Total History
          </span>
          <div className="mt-2 text-2xl font-black text-foreground">{assignments.length}</div>
        </div>
      </div>

      {/* User Assignments Table */}
      <div className="rounded-2xl border border-border bg-surface shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">Role Assignments & Campus Scopes</h2>
          </div>
        </div>

        <UserAssignmentsTable
          assignments={assignments}
          loading={isLoading}
          onRevokeAssignment={(a) => setSelectedRevokeAssignment(a)}
        />
      </div>

      {/* Assign Role Modal */}
      <AssignRoleModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        initialMember={
          firstUser
            ? {
                id: firstUser.id,
                email: firstUser.email,
                firstName: firstUser.firstName,
                lastName: firstUser.lastName,
                phone: null,
                isActive: true,
              }
            : null
        }
        onSuccess={() => {
          setIsAssignModalOpen(false);
          refetch();
        }}
      />

      {/* Revoke Assignment Modal */}
      <RevokeAssignmentModal
        isOpen={Boolean(selectedRevokeAssignment)}
        assignment={selectedRevokeAssignment}
        onClose={() => setSelectedRevokeAssignment(null)}
        onSuccess={() => {
          setSelectedRevokeAssignment(null);
          refetch();
        }}
      />
    </div>
  );
};

