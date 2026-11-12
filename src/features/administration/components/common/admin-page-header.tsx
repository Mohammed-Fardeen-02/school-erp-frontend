import React, { useEffect } from 'react';
import { Breadcrumb } from '@/app/layouts/breadcrumb';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useUiStore } from '@/stores/ui-store';

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
  icon: _Icon,
  badge: _badge,
  breadcrumbs,
  actionLabel,
  onActionClick,
  actionIcon = <Plus className="h-4 w-4" />,
  extraActions,
}) => {
  const setHeaderTitle = useUiStore((s) => s.setHeaderTitle);

  useEffect(() => {
    setHeaderTitle(title, subtitle || '');
  }, [setHeaderTitle, title, subtitle]);

  const hasActions = Boolean(extraActions || (actionLabel && onActionClick));

  return (
    <div className="relative">
      {/* Screen-reader and accessible heading for semantic accessibility and test suites */}
      <h1 className="sr-only">{title}</h1>

      {/* Unified division: Breadcrumb on the left, action buttons on the right */}
      <Breadcrumb
        items={breadcrumbs}
        actions={
          hasActions ? (
            <div className="flex items-center gap-2">
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
          ) : undefined
        }
      />
    </div>
  );
};

