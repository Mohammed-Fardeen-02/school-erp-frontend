import React from 'react';
import { PageWrapper } from '@/app/layouts/page-wrapper';

export interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className = '',
}) => {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface p-6 space-y-4 ${className}`.trim()}
    >
      <div className="border-b border-border/80 pb-3">
        <h3 className="text-base font-bold text-foreground">{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <div className="space-y-4 pt-1">{children}</div>
    </div>
  );
};

export interface FormPageLayoutProps {
  header: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

/**
 * Standard Form / Create-Edit Page Layout Pattern
 * Consistent layout for creating or modifying ERP records with clear sections and action areas.
 */
export const FormPageLayout: React.FC<FormPageLayoutProps> = ({
  header,
  children,
  footer,
  className = '',
}) => {
  return (
    <PageWrapper className={`space-y-6 ${className}`.trim()}>
      {header}
      <div className="space-y-6 max-w-4xl mx-auto">{children}</div>
      {footer && (
        <div className="sticky bottom-0 z-20 -mx-4 -mb-6 sm:-mx-6 border-t border-border bg-surface/95 px-6 py-4 backdrop-blur-md flex items-center justify-end gap-3 shadow-lg">
          {footer}
        </div>
      )}
    </PageWrapper>
  );
};

