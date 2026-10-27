import { cn } from '@/lib/utils';

export type BadgeVariant =
  | 'active'
  | 'draft'
  | 'inactive'
  | 'disabled'
  | 'published'
  | 'pending'
  | 'archived'
  | 'error'
  | 'incomplete'
  | 'info'
  | 'success'
  | 'warning'
  | 'neutral'
  | 'review'
  | 'approval';

const BADGE_STYLES: Record<BadgeVariant, string> = {
  active: 'bg-success/10 text-success border border-success/20',
  draft: 'bg-surface-muted text-muted-foreground border border-border',
  inactive: 'bg-surface-muted text-muted-foreground/60 border border-border opacity-70',
  disabled: 'bg-surface-muted text-muted-foreground border border-border',
  published: 'bg-primary-light/20 text-primary-dark border border-primary/20',
  pending: 'bg-warning/10 text-warning border border-warning/20',
  archived: 'bg-surface-muted text-muted-foreground/80 border border-border',
  error: 'bg-danger/10 text-danger border border-danger/20',
  incomplete: 'bg-danger/10 text-danger border border-danger/20',
  info: 'bg-info/10 text-info border border-info/20',
  success: 'bg-success/10 text-success border border-success/20',
  warning: 'bg-warning/10 text-warning border border-warning/20',
  neutral: 'bg-background text-muted-foreground border border-border',
  review: 'bg-info/10 text-info border border-info/20',
  approval: 'bg-warning/10 text-warning border border-warning/20',
};

const DOT_COLORS: Record<BadgeVariant, string> = {
  active: 'bg-success',
  draft: 'bg-muted-foreground',
  inactive: 'bg-muted-foreground/60',
  disabled: 'bg-muted-foreground',
  published: 'bg-primary',
  pending: 'bg-warning',
  archived: 'bg-muted-foreground/80',
  error: 'bg-danger',
  incomplete: 'bg-danger',
  info: 'bg-info',
  success: 'bg-success',
  warning: 'bg-warning',
  neutral: 'bg-muted-foreground',
  review: 'bg-info',
  approval: 'bg-warning',
};

export interface StatusBadgeProps {
  status: BadgeVariant;
  label?: string;
  showDot?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function StatusBadge({
  status,
  label,
  showDot = true,
  size = 'md',
  className = '',
}: StatusBadgeProps) {
  const displayLabel = label ?? status.charAt(0).toUpperCase() + status.slice(1);

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const dotSizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full shrink-0',
        BADGE_STYLES[status] ?? BADGE_STYLES.neutral,
        sizeClasses[size],
        className
      )}
    >
      {showDot && (
        <span
          className={cn(
            'rounded-full shrink-0',
            DOT_COLORS[status] ?? DOT_COLORS.neutral,
            dotSizeClasses[size]
          )}
        />
      )}
      {displayLabel}
    </span>
  );
}
