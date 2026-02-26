import type { ButtonProps } from '@/components/ui/button';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

// TODO: Update the interface based on requirements, and cut unnecessary props
type BiografButtonVariants = ButtonProps['variant'] | 'trailer' | 'playIcon';
export type BiografButtonProps = Omit<ButtonProps, 'variant'> & {
  variant?: BiografButtonVariants;
};

const variantClasses: Record<NonNullable<BiografButtonVariants>, string> = {
  default:
    'bg-[#141414] text-[#F3EEE4] border border-[#B69852] hover:bg-[#000000]',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline:
    'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
  destructive:
    'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  trailer:
    'bg-[#141414] text-[#F3EEE4]  shadow-[0px_0px_5px_1px_#b69852] hover:shadow-[0px_0px_15px_1px_#b69852]',
  playIcon:
    'bg-[#141414] text-[#F3EEE4] border-2 border-[#B69852] hover:bg-[#000000] !rounded-full',
};

export default function BiografButton({
  variant = 'trailer',
  className,
  children = 'Se Trailer',
  size = 'lg',
  ...props
}: BiografButtonProps) {
  return (
    <Button
      children={children}
      size={size}
      className={cn(
        'cursor-pointer text-sm font-medium',
        variantClasses[variant!],
        className,
      )}
      {...props}
    />
  );
}
