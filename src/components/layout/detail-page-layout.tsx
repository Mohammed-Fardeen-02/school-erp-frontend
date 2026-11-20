import React from 'react';
import { PageWrapper } from '@/app/layouts/page-wrapper';

export interface DetailPageLayoutProps {
  header: React.ReactNode;
  tabs?: React.ReactNode;
  main?: React.ReactNode;
  sidebar?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Standard Detail / Overview Page Layout Pattern
 * Consistent layout for viewing entity details, relations, and audit activity.
 */
export const DetailPageLayout: React.FC<DetailPageLayoutProps> = ({
  header,
  tabs,
  main,
  sidebar,
  children,
  className = '',
}) => {
  return (
    <PageWrapper className={`space-y-6 ${className}`.trim()}>
      {/* 1. Header with Breadcrumbs, Entity Status, and Actions */}
      {header}

      {/* 2. Optional Section Tabs */}
      {tabs && <div className="border-b border-border">{tabs}</div>}

      {/* 3. Main Grid (2/3 + 1/3 when sidebar is present, otherwise full width) */}
      {sidebar ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6 min-w-0">
            {main || children}
          </div>
          <div className="space-y-6">{sidebar}</div>
        </div>
      ) : (
        <div className="space-y-6 min-w-0">{main || children}</div>
      )}
    </PageWrapper>
  );
};

