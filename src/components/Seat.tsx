interface SeatProps {
  seatId: number;
  status: string;
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
  const isDisabled = status === 'booked' || status === 'reserved';
  const baseClass =
    status === 'booked'
      ? 'bg-red-300 text-red-900'
      : status === 'reserved'
        ? 'bg-yellow-200 text-yellow-900'
        : selected
          ? 'bg-blue-500 text-white'
          : 'bg-gray-200 text-black';

  return (
    <button
      disabled={isDisabled}
      onClick={() => onToggle(seatId)}
      className={`h-10 w-10 rounded border text-sm ${baseClass} ${isDisabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
    >
      {label ?? seatId}
    </button>
  );
}
