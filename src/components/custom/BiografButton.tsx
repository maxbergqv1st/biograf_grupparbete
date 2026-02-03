import type { ButtonProps } from '@/components/ui/button';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

type BiografButtonTone = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';

const toneToVariant = {
  primary: 'default',
  secondary: 'secondary',
  outline: 'outline',
  ghost: 'ghost',
  link: 'link',
} satisfies Record<BiografButtonTone, ButtonProps['variant']>;

const toneClasses: Record<BiografButtonTone, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline:
    'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
};

type BiografButtonProps = Omit<ButtonProps, 'variant'> & {
  tone?: BiografButtonTone;
};

export default function BiografButton({
  tone = 'primary',
  className,
  ...props
}: BiografButtonProps) {
  return (
    <Button
      variant={toneToVariant[tone]}
      className={cn(
        'cursor-pointer !rounded-md text-sm font-medium',
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
