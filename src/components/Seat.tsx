// import { Toggle } from '../ui/toggle';

interface SeatProps {
  seatId: number;
  status: string;
  selected: boolean;
  onToggle: (seatId: number) => void;
}

// export function Seat({ seatId, status, selected, onToggle }: SeatProps) {
/*const isDisabled = status === 'booked';
  return (
    <Toggle
      pressed={selected}
      disabled={isDisabled}
      onPressedChange={() => onToggle(seatId)}
      className="h-10 w-10"
    >
      {seatId}
    </Toggle>
  ); */

export function Seat({ seatId, status, selected, onToggle }: SeatProps) {
  const isDisabled = status === 'booked';
  return (
    <button
      disabled={isDisabled}
      onClick={() => onToggle(seatId)}
      className={`h-10 w-10 border ${selected ? 'bg-blue-500' : 'bg-gray-200'} ${isDisabled ? 'opacity-50' : ''}`}
    >
      {seatId}
    </button>
  );
}
