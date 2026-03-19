import { useIsMobile } from "@/hooks/common/useIsMobile";
import { Toggle, toggleVariants } from "./ui/toggle";
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
}

export function Seat({
  seatId,
  status,
  selected,
  onToggle,
  label,
}: SeatProps) {
  const isMoble = useIsMobile();
  const isDisabled = status === 'booked' || status === 'reserved';
  // const baseClass =
  //   status === 'booked'
  //     ? 'bg-red-300 text-red-900'
  //     : status === 'reserved'
  //       ? 'bg-yellow-200 text-yellow-900'
  //       : selected
  //         ? 'bg-blue-500 text-white'
  //         : 'bg-gray-200 text-black';

  return (
    <Toggle
      disabled={isDisabled}
      onClick={() => onToggle(seatId)}
      size={isMoble ? 'sm' : 'lg'}
      className={cn(`text-sm`, seatStatusClasses[status]) }
      // className={` rounded border text-sm ${baseClass} ${isDisabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
    >
      {label ?? seatId}
    </Toggle>
  );
}
