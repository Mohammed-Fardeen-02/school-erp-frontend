import * as React from 'react';
import { cn } from '@/lib/utils';

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon?: React.ReactNode | React.ComponentType<{ className?: string }>;
  color?: 'purple' | 'green' | 'blue' | 'slate' | 'indigo' | 'red' | 'orange' | 'rose';
  className?: string;
}

const COLOR_MAP = {
  purple: {
    border: 'border-primary/20',
    iconText: 'text-primary',
    bgGradient: 'bg-primary/5',
  },
  green: {
    border: 'border-emerald-200',
    iconText: 'text-emerald-600',
    bgGradient: 'bg-emerald-50/50',
  },
  blue: {
    border: 'border-blue-200',
    iconText: 'text-blue-600',
    bgGradient: 'bg-blue-50/50',
  },
  slate: {
    border: 'border-border',
    iconText: 'text-muted-foreground',
    bgGradient: 'bg-surface-muted/60',
  },
  indigo: {
    border: 'border-indigo-200',
    iconText: 'text-indigo-600',
    bgGradient: 'bg-indigo-50/50',
  },
  red: {
    border: 'border-red-200',
    iconText: 'text-danger',
    bgGradient: 'bg-red-50/50',
  },
  orange: {
    border: 'border-amber-200',
    iconText: 'text-amber-600',
    bgGradient: 'bg-amber-50/50',
  },
  rose: {
    border: 'border-rose-200',
    iconText: 'text-rose-600',
    bgGradient: 'bg-rose-50/50',
  },
};

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  color = 'purple',
  className = '',
}: StatsCardProps) {
  const c = COLOR_MAP[color] ?? COLOR_MAP.purple;

  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null)) {
      return React.createElement(icon as React.ComponentType<{ className?: string }>, {
        className: 'h-4 w-4',
      });
    }
    return icon;
  };

  return (
    <div
      className={cn(
        'stats-card flex h-[115px] flex-col justify-between rounded-xl border bg-surface px-4 py-3 transition-all duration-200 hover:shadow-sm',
        c.bgGradient,
        c.border,
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="stats-card-title text-sm font-medium leading-none text-muted-foreground">
          {title}
        </span>
        {icon && <span className={cn('shrink-0', c.iconText)}>{renderIcon()}</span>}
      </div>

      {/* Value */}
      <div className="stats-card-value text-2xl font-bold leading-none tracking-tight text-foreground">
        {value}
      </div>

      {/* Subtitle */}
      <div className="stats-card-subtitle text-xs leading-none text-muted-foreground">
        {subtitle}
      </div>
    </div>
  );
}
