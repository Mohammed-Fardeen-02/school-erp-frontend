import React from 'react';
import { ShieldCheck, UserCog } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RoleType } from '../../types/roles.types';

export interface RoleTypeBadgeProps {
  type: RoleType;
  className?: string;
}

export const RoleTypeBadge: React.FC<RoleTypeBadgeProps> = ({ type, className }) => {
  const isTemplate = type === 'SYSTEM_TEMPLATE';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border',
        isTemplate
          ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60'
          : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60',
        className
      )}
      data-testid="role-type-badge"
    >
      {isTemplate ? (
        <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
      ) : (
        <UserCog className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
      )}
      {isTemplate ? 'System Template' : 'Custom Role'}
    </span>
  );
};
