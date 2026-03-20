import type { BookingDto } from '@/api/generated/models/bookingDto';
import { useGetMe } from '@/api/hooks/useAuth';
import {
  bookingKeys,
  useCancelBooking,
  useMyBookings,
} from '@/api/hooks/useBookings';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import BiografButton from '@/components/custom/BiografButton';
import BiografCard from '@/components/custom/BiografCard';
import {
  BiografCol,
  BiografContainer,
  BiografRow,
} from '@/components/custom/BiografContainer';
import { Separator } from '@/components/ui/separator';

function BookingCard({
  booking,
  showCancel,
  onCancel,
  cancelling,
}: {
  booking: BookingDto;
  showCancel?: boolean;
  onCancel?: (ref: string) => void;
  cancelling?: boolean;
}) {
  return (
    <BiografCard
      className="border-none bg-[#1a1a1a] shadow-none"
      contentClassName="p-4"
    >
      <BiografRow className="items-start justify-between">
        <BiografCol className="space-y-1">
          <h3 className="text-lg font-bold text-[#F3EEE4]">
            {booking.movieTitle}
          </h3>
          {booking.screeningDate && (
            <p className="text-sm text-[#7b6738]">
              {new Date(booking.screeningDate).toLocaleDateString('sv-SE')} kl.{' '}
              {new Date(booking.screeningDate).toLocaleTimeString('sv-SE', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          )}
          {booking.hallName && (
            <p className="text-sm text-[#7b6738]">{booking.hallName}</p>
          )}
          <p className="text-sm text-[#7b6738]">
            Bokningsnr: {booking.bookingReference}
          </p>
          <p className="text-sm text-[#F3EEE4]">{booking.total_price} kr</p>
          {booking.status === 'cancelled' && (
            <span className="mt-1 inline-block rounded bg-red-900/40 px-2 py-0.5 text-xs text-red-400">
              Avbokad
            </span>
          )}
        </BiografCol>
        {showCancel && (
          <BiografCol xs="auto" className="flex-none">
            <BiografButton
              variant="destructive"
              size="sm"
              onClick={() => onCancel?.(booking.bookingReference)}
              disabled={cancelling}
            >
              {cancelling ? 'Avbokar...' : 'Avboka'}
            </BiografButton>
          </BiografCol>
        )}
      </BiografRow>
    </BiografCard>
  );
}

export default function MyBookingsPage() {
  const { data: meData, isLoading: meLoading } = useGetMe();
  const { data: bookings, isLoading: bookingsLoading } = useMyBookings();
  const { mutate: cancel, isPending: cancelling } = useCancelBooking();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const user = meData?.data;

  const isLoading = meLoading || bookingsLoading;

  if (isLoading) {
    return (
      <BiografContainer className="flex justify-center py-20 text-[#7b6738]">
        Laddar...
      </BiografContainer>
    );
  }

  if (!user) {
    navigate('/login?redirect=/my-bookings');
    return null;
  }

  const now = new Date();
  const bookingsData = bookings?.data || [];
  const activeBookings = bookingsData.filter(
    (b) =>
      b.status === 'accepted' &&
      b.screeningDate &&
      new Date(b.screeningDate) > now,
  );
  const historyBookings = bookingsData.filter(
    (b) =>
      b.status === 'cancelled' ||
      (b.screeningDate && new Date(b.screeningDate) <= now),
  );

  const handleCancel = (bookingReference: string) => {
    cancel(bookingReference, {
      onSuccess: () => {
        toast.success('Bokningen har avbokats');
        queryClient.invalidateQueries({ queryKey: bookingKeys.myBookings() });
      },
      onError: () => {
        toast.error('Kunde inte avboka. Försök igen.');
      },
    });
  };

  return (
    <BiografContainer variant="fluid" className="py-8">
      <BiografCol
        xs={12}
        sm={10}
        md={8}
        lg={6}
        className="mx-auto mt-12 flex max-w-3xl flex-col gap-6"
      >
          <h1 className="text-2xl font-bold text-[#F3EEE4]">Mina bokningar</h1>

          <Separator className="bg-[#B69852]/30" />

          <BiografCard
            title="Aktiva biljetter"
            headerClassName="text-[#B69852]"
            className="border-none bg-[#1a1a1a] shadow-none"
            contentClassName="p-4"
          >
            {activeBookings.length === 0 ? (
              <p className="text-sm text-[#7b6738]">
                Du har inga aktiva bokningar.
              </p>
            ) : (
              <BiografRow className="flex-col gap-4">
                {activeBookings.map((b) => (
                  <BookingCard
                    key={b.id}
                    booking={b}
                    showCancel
                    onCancel={handleCancel}
                    cancelling={cancelling}
                  />
                ))}
              </BiografRow>
            )}
          </BiografCard>

          <BiografCard
            title="Historik"
            headerClassName="text-[#B69852]"
            className="border-none bg-[#1a1a1a] shadow-none"
            contentClassName="p-4"
          >
            {historyBookings.length === 0 ? (
              <p className="text-sm text-[#7b6738]">Ingen historik ännu.</p>
            ) : (
              <BiografRow className="flex-col gap-4">
                {historyBookings.map((b) => (
                  <BookingCard key={b.id} booking={b} />
                ))}
              </BiografRow>
            )}
          </BiografCard>
      </BiografCol>
    </BiografContainer>
  );
}
