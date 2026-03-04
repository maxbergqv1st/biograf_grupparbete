import * as React from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type BiografInputProps = React.ComponentProps<typeof Input>;

const BiografInput = React.forwardRef<HTMLInputElement, BiografInputProps>(
  ({ className, ...props }, ref) => (
    <Input
      ref={ref}
      className={cn(
        'bg-[var(--card-foreground)] text-[var(--color-gold)] border-[var(--border)] placeholder:text-[var(--muted)] focus-visible:ring-[var(--shadow-gold)]',
        className,
      )}
      {...props}
    />
  ),
);

BiografInput.displayName = 'BiografInput';

export default BiografInput;
