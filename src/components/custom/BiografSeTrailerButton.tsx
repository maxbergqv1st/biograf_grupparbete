import type { ButtonProps } from '@/components/ui/button';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

import { Play } from 'lucide-react';

// TODO: Update the interface based on requirements, and cut unnecessary props
type BiografPlayButtonVariants = ButtonProps['variant'] | "trailer" | "playIcon"
// type BiografPlayButtonVariants = ButtonProps['variant'] | "playButton"
export type BiografSeTrailerButtonProps = Omit<ButtonProps, 'variant'> & { variant: BiografPlayButtonVariants };

const variantClasses: Record<NonNullable<BiografPlayButtonVariants>, string> = {
  default: 'bg-[#141414] text-[#F3EEE4] border border-[#B69852] hover:bg-[#000000]',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline:
    'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
  destructive:
    'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  trailer: 'bg-[#141414] text-[#F3EEE4]  shadow-[0px_0px_5px_1px_#b69852] hover:shadow-[0px_0px_15px_1px_#b69852]',
  playIcon: 'bg-[#141414] text-[#F3EEE4] border-2 border-[#B69852] hover:bg-[#000000] !rounded-full',
};

export default function BiografSeTrailerButton({
  variant = 'trailer',
  className,
  children = 'Se Trailer',
  size = 'lg',
  ...props
}: BiografSeTrailerButtonProps) {
  return (
    <Button
      children={children}
      size={size}
      // variant={variant}
      className={cn(
        'cursor-pointer text-sm font-medium',
        variantClasses[variant!],
        className,
      )}
      {...props}
    >

    </Button>

  );

}
