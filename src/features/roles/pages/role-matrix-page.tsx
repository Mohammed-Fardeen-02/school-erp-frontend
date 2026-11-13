import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RoleStatusBadge } from '@/features/roles-permissions/components/role-list/role-status-badge';
import { RoleTypeBadge } from '@/features/roles-permissions/components/role-list/role-type-badge';
import { PermissionMatrixBuilder } from '@/features/roles-permissions/components/permission-matrix/permission-matrix-builder';
import { useRoleDetails } from '@/features/roles-permissions/hooks/use-roles';

export const RoleMatrixPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: role, isLoading, isError, error } = useRoleDetails(id);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Loading capability matrix...</span>
        </div>
      </div>
    );
  }

  if (isError || !role) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">Role Not Found</h2>
        <p className="text-xs text-muted-foreground">
          {error?.message || 'The requested role could not be located in this organization context.'}
        </p>
        <Button variant="outline" onClick={() => navigate('/roles')}>
          Return to Roles
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/roles')}
            icon={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Roles
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-foreground">{role.roleName}</h1>
              <RoleTypeBadge type={role.roleType} />
              <RoleStatusBadge isActive={role.isActive} />
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="font-mono font-semibold">{role.roleCode}</span>
              {role.description && ` — ${role.description}`}
            </p>
          </div>
        </div>
      </div>

      {/* Permission Matrix Builder Component */}
      <div className="rounded-2xl border border-border bg-surface shadow-xs p-6">
        <PermissionMatrixBuilder
          roleId={role.id}
          roleName={role.roleName}
          roleCode={role.roleCode}
          isReadOnly={role.roleType === 'SYSTEM_TEMPLATE'}
          onClose={() => navigate('/roles')}
        />
      </div>
    </div>
  );
};

