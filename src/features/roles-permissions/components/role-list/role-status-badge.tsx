import React from 'react';
import { StatusBadge } from '@/components/data-display/status-badge';

export interface RoleStatusBadgeProps {
  isActive: boolean;
  className?: string;
}

export const RoleStatusBadge: React.FC<RoleStatusBadgeProps> = ({ isActive, className }) => {
  return (
    <StatusBadge
      status={isActive ? 'active' : 'inactive'}
      label={isActive ? 'Active' : 'Inactive'}
      size="sm"
      className={className}
    />
  );
};
