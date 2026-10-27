import * as React from 'react';
import { EmptyStateIllustration } from './empty-state-illustration';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  illustration?: boolean;
}

export function EmptyState({
  title = 'No data found',
  description = 'There are no items to display.',
  action,
  icon,
  illustration = true,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      {icon ? (
        <div className="w-14 h-14 rounded-2xl bg-surface-muted flex items-center justify-center mb-4 text-primary">
          {icon}
        </div>
      ) : illustration ? (
        <EmptyStateIllustration className="w-full max-w-sm h-auto mb-4 opacity-90" />
      ) : null}
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
