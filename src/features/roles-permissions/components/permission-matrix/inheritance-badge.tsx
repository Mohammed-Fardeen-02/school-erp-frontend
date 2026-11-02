import * as React from 'react';
import { ArrowDownLeft, Shield, ShieldAlert, Sparkles, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MatrixDisplayState } from '../../types/matrix.types';

export interface InheritanceBadgeProps {
  displayState: MatrixDisplayState;
  inheritedFromName?: string | null;
  className?: string;
}

export const InheritanceBadge: React.FC<InheritanceBadgeProps> = ({
  displayState,
  inheritedFromName,
  className,
}) => {
  switch (displayState) {
    case 'EXPLICIT_GRANT':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800',
            className
          )}
          data-testid="badge-explicit-grant"
        >
          <Sparkles className="w-3 h-3 text-emerald-600" />
          Explicit Grant
        </span>
      );

    case 'EXPLICIT_DENY':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800',
            className
          )}
          data-testid="badge-explicit-deny"
        >
          <ShieldAlert className="w-3 h-3 text-rose-600" />
          Explicit Deny
        </span>
      );

    case 'INHERITED_GRANT':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60',
            className
          )}
          title={inheritedFromName ? `Inherited from ${inheritedFromName}` : 'Inherited from ancestor'}
          data-testid="badge-inherited-grant"
        >
          <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
          Inherited {inheritedFromName ? `(${inheritedFromName})` : ''}
        </span>
      );

    case 'INHERITED_DENY':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60',
            className
          )}
          title={inheritedFromName ? `Denied by ${inheritedFromName}` : 'Denied by ancestor'}
          data-testid="badge-inherited-deny"
        >
          <ArrowDownLeft className="w-3 h-3 text-rose-600" />
          Denied {inheritedFromName ? `(${inheritedFromName})` : ''}
        </span>
      );

    case 'MIXED':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60',
            className
          )}
          data-testid="badge-mixed"
        >
          <Minus className="w-3 h-3 text-amber-600" />
          Partial
        </span>
      );

    case 'DEFAULT_DENY':
    default:
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-normal bg-surface-muted text-muted-foreground border border-border',
            className
          )}
          data-testid="badge-default-deny"
        >
          <Shield className="w-3 h-3 opacity-60" />
          Default Deny
        </span>
      );
  }
};
