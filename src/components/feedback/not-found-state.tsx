import React from 'react';
import { FileQuestion, ArrowLeft, LayoutGrid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export interface NotFoundStateProps {
  title?: string;
  description?: string;
  resourceName?: string;
  onBack?: () => void;
  className?: string;
}

/**
 * Standard 404 Not Found State Pattern
 * Enterprise screen when an entity or record cannot be found.
 */
export const NotFoundState: React.FC<NotFoundStateProps> = ({
  title = 'Record Not Found',
  description = 'The requested institutional record could not be found or has been archived.',
  resourceName,
  onBack,
  className = '',
}) => {
  const navigate = useNavigate();

  return (
    <div
      role="region"
      aria-label="Record Not Found"
      className={`flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-border bg-surface p-8 text-center ${className}`.trim()}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-muted text-muted-foreground shadow-inner">
        <FileQuestion className="h-7 w-7" />
      </div>

      <h2 className="mt-4 text-xl font-bold tracking-tight text-foreground">{title}</h2>
      <p className="mt-2 max-w-md text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {resourceName && (
        <span className="mt-2 inline-block rounded-md bg-surface-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
          {resourceName}
        </span>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack ? onBack : () => navigate(-1)}
          icon={<ArrowLeft className="h-4 w-4" />}
        >
          Go Back
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/workspace')}
          icon={<LayoutGrid className="h-4 w-4" />}
        >
          Return to Workspaces
        </Button>
      </div>
    </div>
  );
};

