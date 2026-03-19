import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { cn } from '@/lib/utils';

type BiografSelectOption = {
  value: string;
  label?: string;
};

interface BiografSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  options: BiografSelectOption[];
  placeholder?: string;
  triggerClassName?: string;
  contentClassName?: string;
  className?: string;
}

export default function BiografSelect({
  value,
  onValueChange,
  options,
  placeholder,
  triggerClassName,
  contentClassName,
  className,
}: BiografSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn(
    'h-10 w-full !rounded-md border border-border bg-[var(--color-bg-primary)] px-3 text-sm text-[var(--color-text-primary)] shadow-sm focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-0 [&>svg]:text-[var(--border)]',
          triggerClassName,
          className,
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        className={cn(
    'bg-popover text-popover-foreground !rounded-md border border-border shadow-md',
          contentClassName,
        )}
      >
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="focus:bg-accent focus:text-accent-foreground"
          >
            {option.label ?? option.value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
