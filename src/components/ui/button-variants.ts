export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';

export function buttonVariants({
  variant = 'primary',
}: {
  variant?: ButtonVariant;
} = {}): string {
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-primary text-white hover:bg-primary-hover shadow-sm',
    secondary: 'bg-surface-muted text-foreground hover:bg-surface-muted/80',
    outline: 'bg-surface hover:bg-background text-foreground border border-border',
    ghost: 'bg-transparent hover:bg-surface-muted text-foreground',
    danger: 'bg-danger text-white hover:bg-danger/90 shadow-sm',
    success: 'bg-success text-white hover:bg-success/90 shadow-sm',
  };

  return variants[variant];
}
