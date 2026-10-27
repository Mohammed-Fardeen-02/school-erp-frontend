import * as React from 'react';

export interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * PageWrapper
 * Consistent inner padding and max-width for all page content areas.
 */
export const PageWrapper: React.FC<PageWrapperProps> = ({ children, className = '' }) => {
  return (
    <div className={`mx-auto max-w-screen-2xl px-6 pb-6 pt-4 ${className}`.trim()}>{children}</div>
  );
};
