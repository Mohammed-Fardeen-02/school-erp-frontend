import React from 'react';
import { Badge } from '@/components/data-display/badge';

export interface AdminStatusBadgeProps {
  status: string;
}

export const AdminStatusBadge: React.FC<AdminStatusBadgeProps> = ({ status }) => {
  const normalized = status.toUpperCase();

  switch (normalized) {
    case 'ACTIVE':
    case 'PAID':
    case 'SUCCESS':
      return <Badge variant="success">Active</Badge>;
    case 'INACTIVE':
    case 'SUSPENDED':
    case 'FAILED':
      return <Badge variant="danger">{normalized === 'SUSPENDED' ? 'Suspended' : 'Inactive'}</Badge>;
    case 'DRAFT':
    case 'PENDING':
    case 'TRIAL':
    case 'TRIALING':
    case 'INVITED':
      return <Badge variant="warning">{normalized === 'INVITED' ? 'Invited' : normalized === 'DRAFT' ? 'Draft' : 'Pending'}</Badge>;
    case 'ARCHIVED':
    case 'CANCELLED':
      return <Badge variant="outline">{normalized}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

