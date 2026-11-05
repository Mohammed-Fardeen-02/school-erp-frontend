import * as React from 'react';
import { Badge } from '@/components/data-display/badge';
import type { TenantStatus } from '../types/tenants.types';

export interface TenantStatusBadgeProps {
  status: TenantStatus;
  className?: string;
}

export const TenantStatusBadge: React.FC<TenantStatusBadgeProps> = ({ status, className }) => {
  switch (status) {
    case 'ACTIVE':
      return (
        <Badge variant="success" className={className}>
          Active
        </Badge>
      );
    case 'PROVISIONING':
      return (
        <Badge variant="warning" className={className}>
          Provisioning
        </Badge>
      );
    case 'TRIAL':
      return (
        <Badge variant="primary" className={className}>
          Trial
        </Badge>
      );
    case 'SUSPENDED':
      return (
        <Badge variant="danger" className={className}>
          Suspended
        </Badge>
      );
    case 'ARCHIVED':
      return (
        <Badge variant="secondary" className={className}>
          Archived
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className={className}>
          {status}
        </Badge>
      );
  }
};

