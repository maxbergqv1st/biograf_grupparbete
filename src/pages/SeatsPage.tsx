import { useState } from 'react';

import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { useHallConfig, useSeatStatuses } from '../api/hooks/useSeats';
import { Seat } from '../components/Seat';

export default function SeatsPage() {
  const [searchParams] = useSearchParams();
  const screeningId = parseInt(searchParams.get('screeningId') || '0');
  const hallId = 1; // hårdkodat för test

  const { data: hallConfig, isLoading: hallLoading } = useHallConfig(hallId);
  const { data: seatStatuses, isLoading: seatsLoading } =
    useSeatStatuses(screeningId);
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const toggleSeat = (seatId: number) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId],
    );
  };
  const totalPrice = selectedSeats.length * 140;

  if (hallLoading || seatsLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Seats for Screening {screeningId}</h1>
      <div>Total Price: {totalPrice} kr</div>
      <button onClick={() => navigate('/confirmation')}>Book Seats</button>
      {hallConfig?.map((row) => (
        <div key={row.name} className="flex">
          {Array.from({ length: row.numberOfSeats }, (_, i) => {
            const seatId = parseInt(row.name) * 100 + i + 1; // Enkel ID-generering
            const seatStatus = seatStatuses?.find((s) => s.seatId === seatId);
            return (
              <Seat
                key={seatId}
                seatId={seatId}
                status={seatStatus?.status || 'available'}
                selected={selectedSeats.includes(seatId)}
                onToggle={toggleSeat}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
