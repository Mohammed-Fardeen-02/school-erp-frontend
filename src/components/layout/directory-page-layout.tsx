import React from 'react';
import { PageWrapper } from '@/app/layouts/page-wrapper';
import { Alert } from '@/components/feedback/alert';
import { AlertCircle } from 'lucide-react';

export interface DirectoryPageLayoutProps {
  header: React.ReactNode;
  statsRow?: React.ReactNode;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
  loading?: boolean;
  empty?: boolean;
  emptyState?: React.ReactNode;
  error?: React.ReactNode | Error | null;
  className?: string;
}

/**
 * Standard Directory / List Page Layout Pattern
 * Consistent layout for all ERP entity lists (Users, Branches, Organizations, and future Classes/Sections).
 */
export const DirectoryPageLayout: React.FC<DirectoryPageLayoutProps> = ({
  header,
  statsRow,
  toolbar,
  children,
  empty,
  emptyState,
  error,
  className = '',
}) => {
  return (
    <PageWrapper className={`space-y-6 ${className}`.trim()}>
      {/* 1. Standard Page Header & Breadcrumbs */}
      {header}

      {/* 2. Error Display (if any) */}
      {error && (
        <Alert variant="error">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-danger" />
            <span>
              {error instanceof Error
                ? error.message
                : typeof error === 'string'
                ? error
                : 'An unexpected error occurred while loading this directory.'}
            </span>
          </div>
        </Alert>
      )}

      {/* 3. Optional KPI Metric Cards Row */}
      {statsRow && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsRow}
        </div>
      )}

      {/* 4. Filter & Action Toolbar */}
      {toolbar && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface border border-border p-3.5 rounded-2xl">
          {toolbar}
        </div>
      )}

      {/* 5. Main Content Area / Empty State / Table */}
      {empty && emptyState ? (
        <div className="rounded-2xl border border-border bg-surface p-8">
          {emptyState}
        </div>
      ) : (
        <div className="relative min-w-0">{children}</div>
      )}
    </PageWrapper>
  );
};

