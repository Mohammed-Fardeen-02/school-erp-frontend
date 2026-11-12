import React from 'react';
import { Breadcrumb } from '@/app/layouts/breadcrumb';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  badge?: React.ReactNode;
  breadcrumbs: { label: string; href?: string }[];
  actionLabel?: string;
  onActionClick?: () => void;
  actionIcon?: React.ReactNode;
  extraActions?: React.ReactNode;
}

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  badge,
  breadcrumbs,
  actionLabel,
  onActionClick,
  actionIcon = <Plus className="h-4 w-4" />,
  extraActions,
}) => {
  return (
    <div className="space-y-4">
      <Breadcrumb items={breadcrumbs} />

      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-6 w-6" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {title}
              </h1>
              {badge}
            </div>
            {subtitle && (
              <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {extraActions}
          {actionLabel && onActionClick && (
            <Button
              variant="primary"
              size="sm"
              onClick={onActionClick}
              icon={actionIcon}
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

