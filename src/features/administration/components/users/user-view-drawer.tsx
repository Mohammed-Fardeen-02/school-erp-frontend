import React from 'react';
import { Phone, Shield, ShieldCheck, KeyRound, Calendar, Lock } from 'lucide-react';
import { AdminDrawer } from '../common/admin-drawer';
import { AdminStatusBadge } from '../common/admin-status-badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import type { AdminUserRecord } from '../../types/admin.types';

export interface UserViewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUserRecord | null;
  onEdit?: (user: AdminUserRecord) => void;
  onToggleStatus?: (user: AdminUserRecord) => void;
}

export const UserViewDrawer: React.FC<UserViewDrawerProps> = ({
  isOpen,
  onClose,
  user,
  onEdit,
  onToggleStatus,
}) => {
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <AdminDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={`${user.firstName} ${user.lastName}`}
      subtitle={user.email}
      footer={
        <div className="flex items-center justify-between w-full">
          {onToggleStatus && (
            <Button
              variant={user.status === 'ACTIVE' ? 'danger' : 'outline'}
              size="sm"
              onClick={() => {
                onClose();
                onToggleStatus(user);
              }}
            >
              {user.status === 'ACTIVE' ? 'Deactivate Account' : 'Activate Account'}
            </Button>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                navigate(`/users/${user.id}/allocations`);
              }}
              icon={<KeyRound className="h-4 w-4" />}
            >
              Role Allocations
            </Button>
            {onEdit && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onClose();
                  onEdit(user);
                }}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      }
    >
      {/* Identity Card */}
      <div className="flex items-center gap-4 rounded-xl border border-border bg-surface-muted/30 p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white font-bold text-lg">
          {user.firstName[0]}
          {user.lastName[0]}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-foreground text-base">
              {user.firstName} {user.lastName}
            </h3>
            <AdminStatusBadge status={user.status} />
          </div>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {/* Account Info */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Account & Role Configuration
        </h4>
        <dl className="divide-y divide-border rounded-xl border border-border bg-surface text-xs">
          <div className="flex items-center justify-between p-3">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" />
              Primary Role
            </dt>
            <dd className="font-semibold text-primary">{user.primaryRole || 'Staff Member'}</dd>
          </div>
          <div className="flex items-center justify-between p-3">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4 text-primary" />
              Contact Phone
            </dt>
            <dd className="font-medium text-foreground">{user.phone || 'Not provided'}</dd>
          </div>
          <div className="flex items-center justify-between p-3">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <Lock className="h-4 w-4 text-primary" />
              MFA Security
            </dt>
            <dd>
              {user.twoFactorEnabled ? (
                <span className="text-success font-semibold flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> Enforced
                </span>
              ) : (
                <span className="text-muted-foreground">Disabled</span>
              )}
            </dd>
          </div>
          <div className="flex items-center justify-between p-3">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 text-primary" />
              Last Active Login
            </dt>
            <dd className="font-medium text-foreground">
              {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never logged in'}
            </dd>
          </div>
        </dl>
      </div>
    </AdminDrawer>
  );
};
