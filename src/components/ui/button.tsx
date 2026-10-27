import * as React from 'react';
import { cn } from '@/lib/utils';

import type { ButtonVariant } from './button-variants';
export type { ButtonVariant };

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      disabled = false,
      isLoading = false,
      loading = false,
      icon,
      className,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isBusy = isLoading || loading;

    const baseStyles =
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:pointer-events-none disabled:opacity-50';

    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-primary text-white hover:bg-primary-hover shadow-sm',
      secondary: 'bg-surface-muted text-foreground hover:bg-surface-muted/80',
      outline: 'bg-surface hover:bg-background text-foreground border border-border',
      ghost: 'bg-transparent hover:bg-surface-muted text-foreground',
      danger: 'bg-danger text-white hover:bg-danger/90 shadow-sm',
      success: 'bg-success text-white hover:bg-success/90 shadow-sm',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-9 px-4 text-sm',
      lg: 'h-10 px-5 text-sm',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isBusy}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isBusy && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {icon && !isBusy && icon}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export interface ActionButtonProps {
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ExportButton: React.FC<ActionButtonProps> = ({
  onClick,
  loading = false,
  disabled = false,
  label = 'Export',
  size = 'md',
  className = '',
}) => {
  return (
    <Button
      variant="outline"
      size={size}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      className={className}
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
      }
    >
      {label}
    </Button>
  );
};

export const ImportButton: React.FC<ActionButtonProps> = ({
  onClick,
  loading = false,
  disabled = false,
  label = 'Import',
  size = 'md',
  className = '',
}) => {
  return (
    <Button
      variant="outline"
      size={size}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      className={className}
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
      }
    >
      {label}
    </Button>
  );
};

export interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  title?: string;
  variant?: 'ghost' | 'outline' | 'danger-ghost';
  size?: 'sm' | 'md';
  active?: boolean;
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  disabled = false,
  title,
  variant = 'ghost',
  size = 'md',
  active = false,
  className = '',
}) => {
  const base =
    'inline-flex items-center justify-center rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary/20';

  const variants = {
    ghost: 'text-muted-foreground hover:text-foreground hover:bg-surface-muted',
    outline: 'border border-border text-muted-foreground hover:bg-background hover:text-foreground',
    'danger-ghost': 'text-muted-foreground hover:text-danger hover:bg-danger/10',
  };

  const sizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
  };

  const activeClass = active ? 'bg-primary/10 text-primary border-primary/20' : '';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        base,
        variants[variant],
        sizes[size],
        activeClass,
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
        className
      )}
    >
      {icon}
    </button>
  );
};
