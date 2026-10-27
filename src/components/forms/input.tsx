import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.ComponentProps<'input'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightAction?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type = 'text', label, error, helperText, id, leftIcon, rightAction, ...props },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 flex items-center text-muted-foreground">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            data-slot="input"
            className={cn(
              'flex h-9 w-full min-w-0 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground',
              'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
              'selection:bg-primary selection:text-white',
              'outline-none transition-[color,box-shadow]',
              'focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20',
              'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
              leftIcon && 'pl-9',
              rightAction && 'pr-10',
              error && 'border-danger focus-visible:border-danger focus-visible:ring-danger/20',
              className
            )}
            {...props}
          />
          {rightAction && <div className="absolute right-2 flex items-center">{rightAction}</div>}
        </div>
        {error && <p className="text-xs text-danger">{error}</p>}
        {!error && helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
