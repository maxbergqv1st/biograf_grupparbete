import { useIsMobile } from "@/hooks/common/useIsMobile";
import { Toggle } from "./ui/toggle";
import { cn } from "@/lib/utils";

export type SeatVariants = 'booked' | 'reserved' | 'available';

const seatStatusClasses: Record<SeatVariants, string> = {
  booked: 'bg-red-300 text-red-900',
  reserved: 'bg-yellow-200 text-yellow-900',
  available: 'bg-gray-200 text-black',
};

interface SeatProps {
  seatId: number;
  status: SeatVariants;
  selected: boolean;
  onToggle: (seatId: number) => void;
  label?: string | number;
  className?: string;
}

export function Seat({
  seatId,
  status,
  selected,
  onToggle,
  label,
  className,
}: SeatProps) {
  const isMobile = useIsMobile();
  const isDisabled = status !== 'available';
  const visualClass =
    selected && !isDisabled
      ? 'bg-blue-500 text-white data-[state=on]:bg-blue-500 data-[state=on]:text-white'
      : seatStatusClasses[status];

  return (
    <Toggle
      pressed={selected}
      disabled={isDisabled}
      onClick={() => onToggle(seatId)}
      size={isMobile ? 'sm' : 'lg'}
      className={cn('text-sm', visualClass, className)}
    >
      {label ?? seatId}
    </Toggle>
  );
}
