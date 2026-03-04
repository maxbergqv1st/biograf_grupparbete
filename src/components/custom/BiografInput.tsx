import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type BiografInputProps = React.ComponentProps<typeof Input>;

export default function BiografInput({ className, ...props}: BiografInputProps) {
    return (
        <Input
      className={cn(
        'bg-[var(--card-foreground)] text-[var(--color-gold)] border-[var(--border)] placeholder:text-[var(--muted)] focus-visible:ring-[var(--gold)]',
        className,
      )}
      {...props}
    />
    )
}