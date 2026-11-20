import React from 'react';
import { ShieldAlert, ArrowLeft, LayoutGrid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export interface AccessDeniedStateProps {
  title?: string;
  description?: string;
  requiredPermission?: string;
  showHomeButton?: boolean;
  className?: string;
}

/**
 * Standard 403 Forbidden / Access Denied State Pattern
 * Enterprise screen when user lacks the required RBAC permission or module subscription.
 */
export const AccessDeniedState: React.FC<AccessDeniedStateProps> = ({
  title = 'Access Restricted',
  description = 'You do not have the required permissions or module subscription to access this institutional workspace area.',
  requiredPermission,
  showHomeButton = true,
  className = '',
}) => {
  const navigate = useNavigate();

  return (
    <div
      role="alert"
      aria-label="Access Denied"
      className={`flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-danger/20 bg-danger/5 p-8 text-center ${className}`.trim()}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger shadow-inner">
        <ShieldAlert className="h-7 w-7" />
      </div>

      <h2 className="mt-4 text-xl font-bold tracking-tight text-foreground">{title}</h2>
      <p className="mt-2 max-w-md text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {requiredPermission && (
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-danger/30 bg-surface px-2.5 py-1 text-xs font-mono text-danger">
          <span>Required Privilege:</span>
          <strong>{requiredPermission}</strong>
        </div>
      )}

      {showHomeButton && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
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
      )}
    </div>
  );
};

