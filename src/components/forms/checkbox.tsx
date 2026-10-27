import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    label?: string;
  }
>(({ className, label, id, ...props }, ref) => {
  const checkboxId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const checkboxNode = (
    <CheckboxPrimitive.Root
      id={checkboxId}
      ref={ref}
      data-slot="checkbox"
      className={cn(
        'peer border border-border bg-surface data-[state=checked]:bg-primary data-[state=checked]:text-white data-[state=checked]:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 size-4 shrink-0 rounded-[4px] shadow-sm transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  if (label) {
    return (
      <div className="flex items-center gap-2">
        {checkboxNode}
        <label
          htmlFor={checkboxId}
          className="text-sm font-medium text-foreground cursor-pointer select-none"
        >
          {label}
        </label>
      </div>
    );
  }

  return checkboxNode;
});

Checkbox.displayName = 'Checkbox';
