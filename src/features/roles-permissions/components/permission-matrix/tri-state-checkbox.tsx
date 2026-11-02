import * as React from 'react';
import { Check, X, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MatrixDisplayState } from '../../types/matrix.types';

export interface TriStateCheckboxProps {
  displayState: MatrixDisplayState;
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
}

export const TriStateCheckbox: React.FC<TriStateCheckboxProps> = ({
  displayState,
  disabled = false,
  onClick,
  ariaLabel,
  className,
}) => {
  const getVisualStyles = () => {
    switch (displayState) {
      case 'EXPLICIT_GRANT':
        return 'bg-emerald-600 border-emerald-600 text-white shadow-xs';
      case 'EXPLICIT_DENY':
        return 'bg-rose-600 border-rose-600 text-white shadow-xs';
      case 'INHERITED_GRANT':
        return 'bg-emerald-50 border-emerald-400 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-600 dark:text-emerald-300';
      case 'INHERITED_DENY':
        return 'bg-rose-50 border-rose-400 text-rose-700 dark:bg-rose-950/40 dark:border-rose-600 dark:text-rose-300';
      case 'MIXED':
        return 'bg-amber-500 border-amber-500 text-white shadow-xs';
      case 'DEFAULT_DENY':
      default:
        return 'bg-surface border-border text-transparent hover:border-primary/50';
    }
  };

  const renderIcon = () => {
    switch (displayState) {
      case 'EXPLICIT_GRANT':
      case 'INHERITED_GRANT':
        return <Check className="w-3.5 h-3.5 stroke-[2.5]" />;
      case 'EXPLICIT_DENY':
      case 'INHERITED_DENY':
        return <X className="w-3.5 h-3.5 stroke-[2.5]" />;
      case 'MIXED':
        return <Minus className="w-3.5 h-3.5 stroke-[3]" />;
      case 'DEFAULT_DENY':
      default:
        return null;
    }
  };

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={
        displayState === 'EXPLICIT_GRANT' || displayState === 'INHERITED_GRANT'
          ? true
          : displayState === 'MIXED'
          ? 'mixed'
          : false
      }
      aria-label={ariaLabel || `Permission state: ${displayState}`}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled && onClick) {
          onClick();
        }
      }}
      className={cn(
        'w-5 h-5 rounded-md border flex items-center justify-center transition-all outline-none',
        'focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105 active:scale-95',
        getVisualStyles(),
        className
      )}
      data-testid="tri-state-checkbox"
    >
      {renderIcon()}
    </button>
  );
};
