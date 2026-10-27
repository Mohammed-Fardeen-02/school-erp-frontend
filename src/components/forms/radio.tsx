import * as React from 'react';
import { cn } from '@/lib/utils';

export interface RadioGroupProps {
  className?: string;
  children: React.ReactNode;
}

export function RadioGroup({ className, children }: RadioGroupProps) {
  return <div className={cn('flex items-center gap-6', className)}>{children}</div>;
}

export interface RadioProps extends React.ComponentProps<'input'> {
  label?: string;
  labelClassName?: string;
}

export function Radio({ label, labelClassName, className, ...props }: RadioProps) {
  return (
    <label
      className={cn(
        'flex items-center gap-2 cursor-pointer select-none',
        props.disabled && 'opacity-50 cursor-not-allowed',
        labelClassName
      )}
    >
      <input
        type="radio"
        className={cn(
          'size-4 accent-primary cursor-pointer border border-border text-primary focus:ring-2 focus:ring-primary/20',
          className
        )}
        {...props}
      />
      {label && <span className="text-sm font-medium text-foreground">{label}</span>}
    </label>
  );
}
