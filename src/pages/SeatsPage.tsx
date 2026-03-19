import { useEffect, useState } from 'react';

import type { BookingSeat } from '@/api/hooks/useBookingForm';
import { seatsService } from '@/api/services/seats';
import SeatStatusInfo from '@/components/seats/SeatStatusInfo';
import SeatMap from '@/components/seats/SeatMap';
import SeatSelectionPanel from '@/components/seats/SeatSelectionPanel';
import SeatScreeningInfo from '@/components/seats/SeatScreeningInfo';
import {
  BASE_TICKET_PRICE,
  generateReservationSessionId,
  PRICE_CATEGORIES,
  type PriceCategory,
} from '@/components/seats/seatPricing';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { useScreening } from '../api/hooks/useScreenings';
import { useHallConfig, useSeatStatuses } from '../api/hooks/useSeats';

export default function SeatsPage() {
  const { t } = useTranslation('seats');
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
  const { data: seatStatuses, isLoading: seatsLoading } = useSeatStatuses(screeningId);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [reservationSessionId] = useState(generateReservationSessionId);
  const [reservationErrorKey, setReservationErrorKey] = useState('');
  const [isReserving, setIsReserving] = useState(false);
  const [seatCategories, setSeatCategories] = useState<
    Record<number, PriceCategory | undefined>
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
      priceCategorySeatId: config.id,
      category,
      discountModifier: config.discount,
      finalPrice: BASE_TICKET_PRICE * config.discount,
    };

    return [bookingSeat];
  });

  const totalPrice = selectedSeatDetails.reduce(
    (sum, seat) => sum + seat.finalPrice,
    0,
  );
  const allSelectedSeatsCategorized =
    selectedSeats.length > 0 &&
    selectedSeatDetails.length === selectedSeats.length;
  const maxSeatsInRow = Math.max(
    ...(hallConfig?.map((row) => row.numberOfSeats) ?? [1]),
  );

  if (!screeningId) {
    return <div>{t('missingScreening')}</div>;
  }

  if (screeningLoading || hallLoading || seatsLoading) {
    return <div>{t('loading')}</div>;
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center px-2 py-6 text-white sm:px-4 md:px-6 md:py-8">
      <SeatScreeningInfo
        movieTitle={movieTitle}
        hallName={screening?.hallName}
        screeningDate={screening?.screeningDate}
        screeningTime={screening?.screeningTime}
        totalPrice={totalPrice}
        ageRating={ageRating}
      />

      <SeatMap
        hallConfig={hallConfig ?? []}
        maxSeatsInRow={maxSeatsInRow}
        seatStatusMap={seatStatusMap}
        selectedSeats={selectedSeats}
        onToggleSeat={toggleSeat}
        childTicketsAllowed={childTicketsAllowed}
      />

      <SeatStatusInfo />

      <SeatSelectionPanel
        selectedSeats={selectedSeats}
        seatStatuses={seatStatuses ?? []}
        seatCategories={seatCategories}
        childTicketsAllowed={childTicketsAllowed}
        onCategoryChange={(seatId, category) =>
          setSeatCategories((current) => ({
            ...current,
            [seatId]: category,
          }))
        }
      />

      {reservationErrorKey ? (
        <p className="mt-4 text-sm text-red-400">{t(reservationErrorKey)}</p>
      ) : null}

      <button
        onClick={async () => {
          if (!screening) return;
          setReservationErrorKey('');
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
            setReservationErrorKey('reservationFailed');
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
        {isReserving ? t('reserveSeats') : t('continueToBooking')}
      </button>
    </div>
  );
}
