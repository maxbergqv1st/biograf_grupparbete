import type { ButtonProps } from '@/components/ui/button';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

import { Play } from 'lucide-react';

// TODO: Update the interface based on requirements, and cut unnecessary props
export type BiografPlayButtonProps = ButtonProps;

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  default: 'bg-[#141414] text-[#F3EEE4] border border-[#B69852] hover:bg-[#000000]',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline:
    'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
  destructive:
    'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  trailer: 'bg-[#141414] text-[#F3EEE4] border border-[#B69852] hover:bg-[#000000]',
  playIcon: '',
};

export default function BiografPlayButton({
  variant = 'playIcon',
  className,
  children = 'playIcon',
  size = 'icon',
  ...props
}: BiografPlayButtonProps) {
  return (
    <Button
      // children={children}raderas?????
      size={size}
      variant={variant}
      className={cn(
        'cursor-pointer text-sm font-medium',

        className,
      )}
      {...props}
    >
      {children}
      <Play className="h-4 w-4 text-[#F3EEE4]" />
    </Button>
  );
}
