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
          'border-input bg-background text-foreground ring-offset-background focus:ring-ring h-10 w-full !rounded-md border px-3 text-sm shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none',
          triggerClassName,
          className,
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        className={cn(
          'bg-popover text-popover-foreground !rounded-md border shadow-md',
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
