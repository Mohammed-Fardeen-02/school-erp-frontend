import * as React from 'react';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  actions?: React.ReactNode;
  backTo?: string;
  onBack?: () => void;
  className?: string;
}

/**
 * Enterprise Breadcrumb Navigation Component
 * Provides accessible, semantic trail with optional back button and page actions.
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  actions,
  backTo,
  onBack,
  className = '',
}) => {
  const navigate = useNavigate();

  const handleClick = (item: BreadcrumbItem, isLast: boolean) => {
    if (isLast) return;
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      navigate(item.href);
    } else if (
      item.label &&
      (item.label.toLowerCase() === 'home' ||
        item.label.toLowerCase() === 'workspace' ||
        item.label.toLowerCase() === 'dashboard')
    ) {
      navigate('/workspace');
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <div
      className={`mb-4 flex w-full min-w-0 flex-col gap-3 border-b border-border pb-2.5 sm:flex-row sm:items-center sm:justify-between ${className}`.trim()}
    >
      {/* Left: Back button (optional) + breadcrumb trail */}
      <div className="flex min-w-0 max-w-full items-center gap-3 overflow-x-auto whitespace-nowrap py-0.5 scrollbar-none">
        {(backTo !== undefined || onBack !== undefined) && (
          <button
            type="button"
            onClick={handleBack}
            className="flex-shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <nav className="flex min-w-0 max-w-full items-center gap-1" aria-label="Breadcrumb">
          <ol className="flex min-w-0 max-w-full items-center gap-1 list-none p-0 m-0">
            {items.map((item, index) => {
              const isLast = index === items.length - 1;
              return (
                <li key={index} className="flex flex-shrink-0 items-center gap-1">
                  {index === 0 && (
                    <Home className="mr-0.5 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                  )}
                  {index > 0 && (
                    <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-subtle-foreground" />
                  )}
                  <button
                    type="button"
                    onClick={() => handleClick(item, isLast)}
                    disabled={isLast}
                    aria-current={isLast ? 'page' : undefined}
                    className={
                      isLast
                        ? 'cursor-default select-none whitespace-nowrap text-sm font-semibold text-foreground'
                        : 'cursor-pointer whitespace-nowrap text-sm text-muted-foreground transition-colors duration-150 hover:text-primary'
                    }
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* Right: Page actions */}
      {actions && (
        <div className="flex w-full flex-wrap items-center justify-start gap-2 sm:w-auto sm:flex-nowrap sm:justify-end">
          {actions}
        </div>
      )}
    </div>
  );
};
