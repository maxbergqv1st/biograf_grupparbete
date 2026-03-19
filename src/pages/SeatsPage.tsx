import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useLocation, useSearchParams } from 'react-router-dom';

import type { BookingSeat } from '@/api/hooks/useBookingForm';
import { seatsService } from '@/api/services/seats';
import { useScreening } from '../api/hooks/useScreenings';
import { useHallConfig, useSeatStatuses } from '../api/hooks/useSeats';
import { Seat } from '../components/Seat';

const PRICE_CATEGORIES = {
  Adult: { priceCategorySeatId: 1, discountModifier: 1.0, label: 'Vuxen' },
  Child: { priceCategorySeatId: 2, discountModifier: 0.7, label: 'Barn' },
  Senior: { priceCategorySeatId: 3, discountModifier: 0.8, label: 'Pensionär' },
} as const;

export default function SeatsPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const locationState = location.state as
    | { movieTitle?: string; posterUrl?: string }
    | null;
  const screeningId = parseInt(searchParams.get('screeningId') || '0');
  const { data: screeningData, isLoading: screeningLoading } =
    useScreening(screeningId);
  const screening = screeningData?.data;
  const hallId = screening?.hallId ?? 0;
  const movieTitle = locationState?.movieTitle ?? 'Vald film';
  const posterUrl = locationState?.posterUrl ?? '';

  const { data: hallConfig, isLoading: hallLoading } = useHallConfig(hallId);
  const { data: seatStatuses, isLoading: seatsLoading } =
    useSeatStatuses(screeningId);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [reservationSessionId] = useState(() => crypto.randomUUID());
  const [reservationError, setReservationError] = useState('');
  const [isReserving, setIsReserving] = useState(false);
  const [seatCategories, setSeatCategories] = useState<
    Record<number, keyof typeof PRICE_CATEGORIES | undefined>
  >({});
  const toggleSeat = (seatId: number) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        setSeatCategories((current) => {
          const next = { ...current };
          delete next[seatId];
          return next;
        });
        return prev.filter((id) => id !== seatId);
      }

      return [...prev, seatId];
    });
  };
  const seatStatusMap = new Map(
    (seatStatuses ?? []).map((seat) => [
      `${seat.rowName}-${seat.numberInRow}`,
      seat,
    ]),
  );
  const selectedSeatDetails: BookingSeat[] = selectedSeats.flatMap((seatId) => {
    const seat = (seatStatuses ?? []).find((item) => item.seatId === seatId);
    const category = seatCategories[seatId];

    if (!seat || !category) {
      return [];
    }

    const config = PRICE_CATEGORIES[category];
    const bookingSeat: BookingSeat = {
      seatId: seat.seatId,
      seatLabel: `${seat.rowName}${seat.numberInRow}`,
      priceCategorySeatId: config.priceCategorySeatId,
      category,
      discountModifier: config.discountModifier,
      finalPrice: 140 * config.discountModifier,
    };

    return [bookingSeat];
  });
  const totalPrice = selectedSeatDetails.reduce(
    (sum, seat) => sum + seat.finalPrice,
    0,
  );
  const allSelectedSeatsCategorized =
    selectedSeats.length > 0 && selectedSeatDetails.length === selectedSeats.length;

  if (!screeningId) return <div>Ingen screening vald.</div>;

  if (screeningLoading || hallLoading || seatsLoading) return <div>Loading...</div>;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center px-4 py-8 text-white md:px-6">
      <div className="mb-8 w-full max-w-4xl rounded-2xl bg-[#1E1E1E] p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-[#b69852]">Välj säten</h1>
        <div className="mt-4 grid gap-2 text-sm md:grid-cols-2">
          <p>Film: {movieTitle}</p>
          <p>Salong: {screening?.hallName ?? '-'}</p>
          <p>Datum: {screening?.screeningDate ?? '-'}</p>
          <p>Tid: {screening?.screeningTime?.slice(0, 5) ?? '-'}</p>
          <p>Screening ID: {screeningId}</p>
          <p>Totalpris: {totalPrice} kr</p>
        </div>
      </div>

      <div className="w-full max-w-5xl rounded-2xl bg-[#111] p-6 shadow-lg md:p-8">
        <div className="mb-6 text-center text-sm uppercase tracking-[0.35em] text-[#b69852]">
          Duk
        </div>

        <div className="space-y-3">
          {hallConfig?.map((row) => (
            <div key={row.name} className="flex justify-center gap-2">
              <span className="flex w-8 items-center justify-center font-semibold">
                {row.name}
              </span>
              {Array.from({ length: row.numberOfSeats }, (_, i) => {
                const numberInRow = i + 1;
                const seatStatus = seatStatusMap.get(`${row.name}-${numberInRow}`);

                if (!seatStatus) {
                  return (
                    <div
                      key={`${row.name}-${numberInRow}`}
                      className="h-10 w-10 rounded border border-dashed opacity-30"
                    />
                  );
                }

                return (
                  <Seat
                    key={seatStatus.seatId}
                    seatId={seatStatus.seatId}
                    label={seatStatus.numberInRow}
                    status={seatStatus.status}
                    selected={selectedSeats.includes(seatStatus.seatId)}
                    onToggle={toggleSeat}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-gray-200" />
          Ledig
        </div>
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-yellow-200" />
          Reserverad
        </div>
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-red-300" />
          Bokad
        </div>
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-blue-500" />
          Vald
        </div>
      </div>

      <div className="mt-8 w-full max-w-4xl rounded-2xl bg-[#1E1E1E] p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-[#b69852]">Valda biljetter</h2>
        {selectedSeats.length === 0 ? (
          <p className="mt-3 text-sm text-gray-300">
            Välj ett eller flera säten och ange biljettkategori innan du går vidare.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {selectedSeats.map((seatId) => {
              const seat = (seatStatuses ?? []).find((item) => item.seatId === seatId);
              if (!seat) return null;

              return (
                <div
                  key={seatId}
                  className="grid gap-3 rounded-xl border border-[#333] p-4 md:grid-cols-[1fr_220px]"
                >
                  <div>
                    <p className="font-medium">Plats {seat.rowName}{seat.numberInRow}</p>
                    <p className="text-sm text-gray-300">Säte ID: {seat.seatId}</p>
                  </div>
                  <select
                    value={seatCategories[seatId] ?? ''}
                    onChange={(e) =>
                      setSeatCategories((current) => ({
                        ...current,
                        [seatId]: e.target.value as keyof typeof PRICE_CATEGORIES,
                      }))
                    }
                    className="rounded border border-gray-600 bg-transparent p-2 text-sm text-white"
                  >
                    <option value="" className="text-black">
                      Välj biljettkategori
                    </option>
                    <option value="Adult" className="text-black">
                      Vuxen
                    </option>
                    <option value="Child" className="text-black">
                      Barn
                    </option>
                    <option value="Senior" className="text-black">
                      Pensionär
                    </option>
                  </select>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {reservationError ? (
        <p className="mt-4 text-sm text-red-400">{reservationError}</p>
      ) : null}

      <button
        onClick={async () => {
          if (!screening) return;
          setReservationError('');
          setIsReserving(true);

          try {
            await seatsService.reserveSeats({
              screeningId: screening.id,
              sessionId: reservationSessionId,
              seatIds: selectedSeatDetails.map((seat) => seat.seatId),
            });
            await queryClient.invalidateQueries({
              queryKey: ['seat-statuses', screening.id],
            });

            navigate('/booking', {
              state: {
                screening: {
                  id: screening.id,
                  movieName: movieTitle,
                  date: screening.screeningDate,
                  time: screening.screeningTime,
                  basePrice: 140,
                  posterUrl,
                },
                seats: selectedSeatDetails,
                reservationSessionId,
                reservationExpiresAt: new Date(Date.now() + 2 * 60 * 1000).toISOString(),
              },
            });
          } catch {
            setReservationError(
              'Det gick inte att reservera sätena. Någon annan kan ha hunnit före.',
            );
            await queryClient.invalidateQueries({
              queryKey: ['seat-statuses', screening.id],
            });
          } finally {
            setIsReserving(false);
          }
        }}
        className="mt-8 rounded-md bg-[#B69852] px-6 py-3 font-semibold text-black"
        disabled={!allSelectedSeatsCategorized || isReserving}
      >
        {isReserving ? 'Reserverar säten...' : 'Gå vidare till bokning'}
      </button>
    </div>
  );
}
