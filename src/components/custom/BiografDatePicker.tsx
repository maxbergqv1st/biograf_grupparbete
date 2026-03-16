import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { cn } from '@/lib/utils';

interface BiografDatePickerProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function BiografDatePicker({
  value,
  onValueChange,
  placeholder = 'Välj datum',
  className,
}: BiografDatePickerProps) {
  const selectedDate = value ? new Date(value + 'T00:00:00') : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            'border-gold bg-bg-primary text-text-primary hover:bg-bg-dark hover:text-text-primary',
            !value && 'text-text-primary/50',
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? (
            format(selectedDate, 'PPP')
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto"
        style={
          {
            '--background': 'var(--color-bg-elevated)',
            '--foreground': 'var(--color-text-primary)',
            '--popover': 'var(--color-bg-elevated)',
            '--popover-foreground': 'var(--color-text-primary)',
            '--primary': 'var(--color-gold)',
            '--primary-foreground': 'var(--color-bg-primary)',
            '--accent': 'oklch(0.65 0.12 55 / 0.2)',
            '--accent-foreground': 'var(--color-text-primary)',
            '--muted-foreground': 'oklch(0.65 0.12 55 / 0.5)',
          } as React.CSSProperties
        }
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) =>
            onValueChange?.(date ? format(date, 'yyyy-MM-dd') : '')
          }
          buttonVariant="outline"
          className="[--cell-size:2.25rem]"
          classNames={{
            months: 'relative flex flex-col gap-2 sm:flex-row',
            table: 'w-full',
            weekdays: 'flex gap-1 mb-1',
            week: 'mt-1 flex w-full gap-1',
            day: 'group/day relative aspect-square h-full w-full select-none p-0.5 text-center',
            button_previous: 'size-7',
            button_next: 'size-7',
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
