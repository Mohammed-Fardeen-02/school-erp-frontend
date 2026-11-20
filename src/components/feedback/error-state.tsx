import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: Error | null;
  onRetry?: () => void;
  className?: string;
}

/**
 * Standard Error State Pattern
 * Enterprise screen when an API call or component crashes.
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to Load Content',
  message,
  error,
  onRetry,
  className = '',
}) => {
  const displayMessage =
    message || error?.message || 'An unexpected system error occurred. Please try again.';

  return (
    <div
      role="alert"
      aria-label="Error"
      className={`flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-danger/20 bg-danger/5 p-8 text-center ${className}`.trim()}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger shadow-inner">
        <AlertTriangle className="h-6 w-6" />
      </div>

      <h3 className="mt-4 text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-xs sm:text-sm text-danger/90 leading-relaxed font-mono">
        {displayMessage}
      </p>

      {onRetry && (
        <div className="mt-5">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            icon={<RefreshCw className="h-4 w-4" />}
          >
            Retry Request
          </Button>
        </div>
      )}
    </div>
  );
};

