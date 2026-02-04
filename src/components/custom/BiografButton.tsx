import type { ButtonProps } from '@/components/ui/button';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

// TODO: Update the interface based on requirements, and cut unnecessary props
export type BiografButtonProps = ButtonProps;

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline:
    'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
  destructive:
    'bg-destructive text-destructive-foreground hover:bg-destructive/90',
};

export default function BiografButton({
  variant = 'default',
  className,
  ...props
}: BiografButtonProps) {
  return (
    <Button
      variant={variant}
      className={cn(
        'cursor-pointer text-sm font-medium',
        variantClasses[variant!],
        className,
      )}
      {...props}
    />
  );
}
