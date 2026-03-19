import { useEffect, useState } from 'react';

import type { BookingSeat } from '@/api/hooks/useBookingForm';
import { seatsService } from '@/api/services/seats';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useLocation, useSearchParams } from 'react-router-dom';

import BiografSelect from '@/components/custom/BiografSelect';

import { useScreening } from '../api/hooks/useScreenings';
import { useHallConfig, useSeatStatuses } from '../api/hooks/useSeats';
import { Seat, type SeatVariants } from '../components/Seat';

const BASE_TICKET_PRICE = 140;

const PRICE_CATEGORIES = {
  Adult: { priceCategorySeatId: 1, discountModifier: 1.0, label: 'Vuxen' },
  Child: { priceCategorySeatId: 2, discountModifier: 0.7, label: 'Barn' },
  Senior: { priceCategorySeatId: 3, discountModifier: 0.8, label: 'Pensionär' },
} as const;

// Generated to serve if crypto.randomUUID is not available. fallback, funkar att komma åt seatpage från min mobil. 
function createReservationSessionId() {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  return `reservation-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export default function SeatsPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const locationState = location.state as {
    movieTitle?: string;
    posterUrl?: string;
    ageRating?: number;
  } | null;
  const screeningId = parseInt(searchParams.get('screeningId') || '0');
  const { data: screeningData, isLoading: screeningLoading } =
    useScreening(screeningId);
  const screening = screeningData?.data;
  const hallId = screening?.hallId ?? 0;
  const movieTitle = locationState?.movieTitle ?? 'Vald film';
  const posterUrl = locationState?.posterUrl ?? '';
  const ageRating = locationState?.ageRating ?? 0;
  const childTicketsAllowed = ageRating < 15;

  const { data: hallConfig, isLoading: hallLoading } = useHallConfig(hallId);
  const { data: seatStatuses, isLoading: seatsLoading } =
    useSeatStatuses(screeningId);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [reservationSessionId] = useState(createReservationSessionId);
  const [reservationError, setReservationError] = useState('');
  const [isReserving, setIsReserving] = useState(false);
  const [seatCategories, setSeatCategories] = useState<
    Record<number, keyof typeof PRICE_CATEGORIES | undefined>
  >({});
  useEffect(() => {
    if (childTicketsAllowed) {
      return;
    }

    setSeatCategories((current) => {
      const next = { ...current };
      let changed = false;

      Object.entries(next).forEach(([seatId, category]) => {
        if (category === 'Child') {
          next[Number(seatId)] = undefined;
          changed = true;
        }
      });

      return changed ? next : current;
    });
  }, [childTicketsAllowed]);
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

      setSeatCategories((current) => ({
        ...current,
        [seatId]: current[seatId] ?? 'Adult',
      }));

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
      finalPrice: BASE_TICKET_PRICE * config.discountModifier,
    };

    return [bookingSeat];
  });
  const totalPrice = selectedSeatDetails.reduce(
    (sum, seat) => sum + seat.finalPrice,
    0,
  );
  const getCategoryPrice = (category: keyof typeof PRICE_CATEGORIES) =>
    BASE_TICKET_PRICE * PRICE_CATEGORIES[category].discountModifier;
  const allSelectedSeatsCategorized =
    selectedSeats.length > 0 &&
    selectedSeatDetails.length === selectedSeats.length;
  const maxSeatsInRow = Math.max(
    ...(hallConfig?.map((row) => row.numberOfSeats) ?? [1]),
  );

  if (!screeningId) return <div>Ingen screening vald.</div>;

  if (screeningLoading || hallLoading || seatsLoading)
    return <div>Loading...</div>;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center px-2 py-6 text-white sm:px-4 md:px-6 md:py-8">
      <div className="mb-8 w-full rounded-2xl bg-[#1E1E1E] p-4 shadow-lg sm:max-w-4xl sm:p-6">
        <h1 className="text-2xl font-bold text-[#b69852]">Välj säten</h1>
        <div className="mt-4 grid gap-2 text-sm md:grid-cols-2">
          <p>Film: {movieTitle}</p>
          <p>Salong: {screening?.hallName ?? '-'}</p>
          <p>Datum: {screening?.screeningDate ?? '-'}</p>
          <p>Tid: {screening?.screeningTime?.slice(0, 5) ?? '-'}</p>
          <p>Totalpris: {totalPrice} kr</p>
          <p>
            Åldersgräns:{' '}
            {ageRating > 0 ? `${ageRating}+ år` : 'Barntillåten'}
          </p>
        </div>
      </div>

      <div className="w-full rounded-2xl bg-[#111] p-3 shadow-lg sm:max-w-5xl sm:p-4 md:p-8">
        <div className="mb-6 text-center text-sm tracking-[0.35em] text-[#b69852] uppercase">
          Duk
        </div>

        <div className="px-1 sm:px-2">
          <div className="space-y-2 sm:space-y-3">
            {hallConfig?.map((row) => (
              <div
                key={row.name}
                className="grid grid-cols-[1fr_auto] items-center gap-2 sm:gap-3"
              >
                <div
                  className="mx-auto grid items-center justify-center gap-1 sm:gap-2"
                  style={{
                    width: `${((row.numberOfSeats + 1) / (maxSeatsInRow + 1)) * 100}%`,
                    gridTemplateColumns: `repeat(${row.numberOfSeats}, minmax(0, 1fr))`,
                  }}
                >
                  {Array.from({ length: row.numberOfSeats }, (_, i) => {
                    const numberInRow = i + 1;
                    const seatStatus = seatStatusMap.get(
                      `${row.name}-${numberInRow}`,
                    );

                    if (!seatStatus) {
                      return (
                        <div
                          key={`${row.name}-${numberInRow}`}
                          className="h-7 min-w-0 rounded border border-dashed opacity-30 sm:h-8 lg:h-10"
                        />
                      );
                    }

                    return (
                      <Seat
                        key={seatStatus.seatId}
                        seatId={seatStatus.seatId}
                        label={seatStatus.numberInRow}
                        status={seatStatus.status as SeatVariants}
                        selected={selectedSeats.includes(seatStatus.seatId)}
                        onToggle={toggleSeat}
                        className="h-7 min-w-0 w-full px-0 text-[11px] sm:h-8 sm:text-xs lg:h-10 lg:text-sm"
                      />
                    );
                  })}
                </div>
                <span className="flex w-5 items-center justify-center text-xs font-semibold sm:w-8 sm:text-sm">
                  {row.name}
                </span>
              </div>
            ))}
          </div>
        </div>
        {!childTicketsAllowed ? (
          <p className="mt-4 text-center text-sm text-[#b69852]">
            Barnbiljett är inte tillgänglig för filmer med åldersgräns 15+.
          </p>
        ) : null}
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

      <div className="mt-8 w-full rounded-2xl bg-[#1E1E1E] p-4 shadow-lg sm:max-w-4xl sm:p-6">
        <h2 className="text-lg font-semibold text-[#b69852]">
          Valda biljetter
        </h2>
        {selectedSeats.length === 0 ? (
          <p className="mt-3 text-sm text-gray-300">
            Välj ett eller flera säten och ange biljettkategori innan du går
            vidare.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {selectedSeats.map((seatId) => {
              const seat = (seatStatuses ?? []).find(
                (item) => item.seatId === seatId,
              );
              if (!seat) return null;

              return (
                <div
                  key={seatId}
                  className="grid gap-3 rounded-xl border border-[#333] p-4 md:grid-cols-[1fr_220px]"
                >
                  <div>
                    <p className="font-medium">
                      Plats {seat.rowName}
                      {seat.numberInRow}
                    </p>
                    <p className="text-sm text-gray-300">
                      Säte ID: {seat.seatId}
                    </p>
                    <p className="text-sm text-gray-300">
                      Pris:{' '}
                      {seatCategories[seatId]
                        ? `${getCategoryPrice(seatCategories[seatId] as keyof typeof PRICE_CATEGORIES)} kr`
                        : 'Välj biljettyp'}
                    </p>
                  </div>
                  <BiografSelect
                    value={seatCategories[seatId] ?? ''}
                    onValueChange={(value) =>
                      setSeatCategories((current) => ({
                        ...current,
                        [seatId]: value as keyof typeof PRICE_CATEGORIES,
                      }))
                    }
                    options={[
                      { value: 'Adult', label: `Vuxen - ${getCategoryPrice('Adult')} kr` },
                      ...(childTicketsAllowed
                        ? [
                            {
                              value: 'Child',
                              label: `Barn - ${getCategoryPrice('Child')} kr`,
                            },
                          ]
                        : []),
                      {
                        value: 'Senior',
                        label: `Pensionär - ${getCategoryPrice('Senior')} kr`,
                      },
                    ]}
                    placeholder="Välj biljettkategori"
                  />
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
                  basePrice: BASE_TICKET_PRICE,
                  posterUrl,
                },
                seats: selectedSeatDetails,
                reservationSessionId,
                reservationExpiresAt: new Date(
                  Date.now() + 2 * 60 * 1000,
                ).toISOString(),
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
