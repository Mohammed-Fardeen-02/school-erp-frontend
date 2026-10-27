import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextAreaProps extends React.ComponentProps<'textarea'> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          data-slot="textarea"
          className={cn(
            'flex w-full min-w-0 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground',
            'transition-[color,box-shadow] outline-none resize-y',
            'focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20',
            'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-danger focus-visible:border-danger focus-visible:ring-danger/20',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
        {!error && helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
