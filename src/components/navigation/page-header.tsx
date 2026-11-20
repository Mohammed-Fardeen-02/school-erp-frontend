import React, { useEffect } from 'react';
import { Breadcrumb, type BreadcrumbItem } from '@/app/layouts/breadcrumb';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { useUiStore } from '@/stores/ui-store';

export interface PrimaryActionConfig {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}

export interface WorkspacePageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: React.ElementType;
  badge?: React.ReactNode;
  status?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  showBanner?: boolean;
  primaryAction?: PrimaryActionConfig;
  secondaryActions?: React.ReactNode;
  tabs?: React.ReactNode;
  backTo?: string;
  onBack?: () => void;
  className?: string;

  // Compatibility props with existing AdminPageHeader
  actionLabel?: string;
  onActionClick?: () => void;
  actionIcon?: React.ReactNode;
  extraActions?: React.ReactNode;
}

/**
 * Enterprise Workspace Page Header
 * Standardizes page titles, breadcrumbs, status indicators, and responsive action layouts
 * across all School ERP business modules. Synchronizes with global header state.
 */
export const WorkspacePageHeader: React.FC<WorkspacePageHeaderProps> = ({
  title,
  subtitle,
  description,
  icon: Icon,
  badge,
  status,
  breadcrumbs,
  showBanner = false,
  primaryAction,
  secondaryActions,
  tabs,
  backTo,
  onBack,
  className = '',
  actionLabel,
  onActionClick,
  actionIcon,
  extraActions,
}) => {
  const setHeaderTitle = useUiStore((s) => s.setHeaderTitle);
  const effectiveSubtitle = subtitle || description || '';
  const effectiveStatusBadge = badge || status;

  // Sync title and subtitle to the top application header bar
  useEffect(() => {
    setHeaderTitle(title, effectiveSubtitle);
  }, [setHeaderTitle, title, effectiveSubtitle]);

  // Resolve actions: support both structured primaryAction & legacy AdminPageHeader props
  const resolvedPrimaryAction = primaryAction || (
    actionLabel && onActionClick
      ? {
          label: actionLabel,
          onClick: onActionClick,
          icon: actionIcon || <Plus className="h-4 w-4" />,
          variant: 'primary' as const,
        }
      : undefined
  );

  const resolvedSecondaryActions = secondaryActions || extraActions;
  const hasActions = Boolean(resolvedPrimaryAction || resolvedSecondaryActions);

  const actionElements = hasActions ? (
    <div className="flex flex-wrap items-center gap-2">
      {resolvedSecondaryActions}
      {resolvedPrimaryAction && (
        <Button
          variant={resolvedPrimaryAction.variant || 'primary'}
          size="sm"
          onClick={resolvedPrimaryAction.onClick}
          disabled={resolvedPrimaryAction.disabled || resolvedPrimaryAction.loading}
          icon={
            resolvedPrimaryAction.loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              resolvedPrimaryAction.icon
            )
          }
        >
          {resolvedPrimaryAction.label}
        </Button>
      )}
    </div>
  ) : undefined;

  return (
    <header className={`relative space-y-3 ${className}`.trim()}>
      {/* Accessible semantic heading for assistive technology and test suites */}
      <h1 className="sr-only">{title}</h1>

      {/* Breadcrumb Navigation with contextual actions */}
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <Breadcrumb
          items={breadcrumbs}
          actions={actionElements}
          backTo={backTo}
          onBack={onBack}
        />
      ) : actionElements ? (
        <div className="flex w-full items-center justify-end pb-2.5 border-b border-border">
          {actionElements}
        </div>
      ) : null}

      {/* Visual Title Banner (Optional on-page banner when showBanner is true or when without breadcrumbs) */}
      {(showBanner || (!breadcrumbs && (Icon || effectiveStatusBadge || effectiveSubtitle))) && (
        <div className="flex flex-col gap-2 pb-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                <Icon className="h-5 w-5" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {title}
                </span>
                {effectiveStatusBadge}
              </div>
              {effectiveSubtitle && (
                <p className="text-xs text-muted-foreground">{effectiveSubtitle}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tabs navigation row */}
      {tabs && <div className="border-b border-border">{tabs}</div>}
    </header>
  );
};

// Aliases for broad developer ergonomics
export const PageHeader = WorkspacePageHeader;
