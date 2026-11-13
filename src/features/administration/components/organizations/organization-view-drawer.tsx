import React from 'react';
import { Building2, MapPin, Mail, Phone, Calendar, ExternalLink } from 'lucide-react';
import { AdminDrawer } from '../common/admin-drawer';
import { AdminStatusBadge } from '../common/admin-status-badge';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';
import { useNavigate } from 'react-router-dom';
import type { TenantDto } from '@/features/tenants/types/tenants.types';
import type { OrganizationCampus } from '../../types/admin.types';

export interface OrganizationViewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  organization: TenantDto | null;
  campuses?: OrganizationCampus[];
  onEdit?: (org: TenantDto) => void;
}

export const OrganizationViewDrawer: React.FC<OrganizationViewDrawerProps> = ({
  isOpen,
  onClose,
  organization,
  campuses = [],
  onEdit,
}) => {
  const navigate = useNavigate();
  const setTenantContext = useAuthStore((state) => state.setTenantContext);

  if (!organization) return null;

  const handleEnterWorkspace = () => {
    setTenantContext(organization.id, null);
    onClose();
    navigate('/workspace');
  };

  return (
    <AdminDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={organization.displayName}
      subtitle={`Code: ${organization.code} • ${organization.organizationType.replace(/_/g, ' ')}`}
      footer={
        <div className="flex items-center justify-between w-full">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onEdit(organization);
              }}
            >
              Edit Organization
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handleEnterWorkspace}
            icon={<ExternalLink className="h-4 w-4" />}
          >
            Enter Workspace
          </Button>
        </div>
      }
    >
      {/* Status Banner */}
      <div className="rounded-xl border border-border bg-surface-muted/40 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">Current Status</span>
          <AdminStatusBadge status={organization.status} />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Subscription Tier</span>
          <span className="font-semibold text-primary">{organization.subscriptionPlan}</span>
        </div>
      </div>

      {/* Institutional Details */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Contact & Legal Identity
        </h3>
        <dl className="divide-y divide-border rounded-xl border border-border bg-surface text-xs">
          <div className="flex items-center justify-between p-3">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4 text-primary" />
              Official Email
            </dt>
            <dd className="font-medium text-foreground">{organization.email}</dd>
          </div>
          <div className="flex items-center justify-between p-3">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4 text-primary" />
              Phone Number
            </dt>
            <dd className="font-medium text-foreground">{organization.phone}</dd>
          </div>
          <div className="flex items-center justify-between p-3">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              Location
            </dt>
            <dd className="font-medium text-foreground">
              {[organization.city, organization.state, organization.country]
                .filter(Boolean)
                .join(', ') || 'Not specified'}
            </dd>
          </div>
          <div className="flex items-center justify-between p-3">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 text-primary" />
              Registered Date
            </dt>
            <dd className="font-medium text-foreground">
              {new Date(organization.createdAt).toLocaleDateString()}
            </dd>
          </div>
        </dl>
      </div>

      {/* Campuses Overview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Registered Campuses ({campuses.length})
          </h3>
        </div>
        <div className="space-y-2">
          {campuses.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-xl border border-border bg-surface p-3 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">Code: {c.code}</p>
                </div>
              </div>
              {c.isMainCampus && (
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  Main Campus
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quotas & Capacity */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Entitlement Quotas
        </h3>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl border border-border bg-surface-muted/30 p-2.5">
            <p className="text-base font-bold text-foreground">{organization.maxStudents}</p>
            <p className="text-[10px] text-muted-foreground">Max Students</p>
          </div>
          <div className="rounded-xl border border-border bg-surface-muted/30 p-2.5">
            <p className="text-base font-bold text-foreground">{organization.maxUsers}</p>
            <p className="text-[10px] text-muted-foreground">Max Staff</p>
          </div>
          <div className="rounded-xl border border-border bg-surface-muted/30 p-2.5">
            <p className="text-base font-bold text-foreground">{organization.maxLocations}</p>
            <p className="text-[10px] text-muted-foreground">Max Campuses</p>
          </div>
        </div>
      </div>
    </AdminDrawer>
  );
};
