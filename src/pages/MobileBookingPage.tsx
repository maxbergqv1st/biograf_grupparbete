import { Separator } from '@/components/ui/separator';
import BiografButton from '@/components/custom/BiografButton';
import BiografCard from '@/components/custom/BiografCard';
import type { BookingSeat } from '@/api/hooks/useBookingForm';
import type { ScreeningInfo } from './BookingPage';

type MobileBookingPageProps = {
  screening: ScreeningInfo;
  seats: BookingSeat[];
  totalPrice: number;
  email: string;
  setEmail: (email: string) => void;
  error: string;
  submitting: boolean;
  handleBetala: () => void;
  handleCancel: () => void;
  formattedTimeLeft: string;
  bookingState: {
    reservationExpiresAt?: string;
  } | null;
};

function translateCategory(category: string): string {
  const translations: Record<string, string> = {
    Adult: 'Vuxen',
    Child: 'Barn',
    Senior: 'Pensionär',
    Student: 'Student',
    Handicap: 'Handikappad',
  };
  return translations[category] ?? category;
}

export default function MobileBookingPage({
  screening,
  seats,
  totalPrice,
  email,
  setEmail,
  error,
  submitting,
  handleBetala,
  handleCancel,
  formattedTimeLeft,
  bookingState,
}: MobileBookingPageProps) {
  return (
    <section className="flex flex-col items-center mt-4 px-4 gap-4">
      <BiografCard
        title='Bokning & Betalning'
        headerClassName="text-[#b69852] text-center text-xl"
        className="bg-[#1E1E1E] w-full border border-[#b69852]">
        <div className="flex flex-col text-white p-4 space-y-4">

          {/* Booking details */}
          <div>
            <p className="text-[#B69852] font-semibold">Plats & Tid:</p>
            <p>{screening.movieName}</p>
            <p>{screening.date}</p>
            <p>{screening.time}</p>
          </div>
          <Separator className="my-2" />
          <div>
            <p className="text-[#B69852] font-semibold">Biljetter:</p>
            {seats.map(seat => (
              <div key={seat.seatId} className="mb-2">
                <p>Plats {seat.seatLabel} — {translateCategory(seat.category)} — {seat.finalPrice} kr</p>
              </div>
            ))}
            <Separator className="my-2" />
            <p className="font-semibold">Totalt: {totalPrice} kr</p>
          </div>
          <Separator className="my-2" />

          {/* Payment */}
          <div>
            <p className="text-[#B69852] font-semibold">Betalmetod:</p>
            <p className="text-sm">Kontant i kassan</p>
          </div>
          <input
            type="email"
            placeholder="Skriv in din mail här..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-transparent border border-gray-600 text-white text-sm"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="space-y-2">
            <BiografButton
              className="w-full bg-green-600 hover:bg-green-700 border-none"
              onClick={handleBetala}
              disabled={submitting || !email || seats.length === 0}
            >
              {submitting ? 'Bearbetar...' : 'Bekräfta bokning'}
            </BiografButton>
            <BiografButton
              variant="destructive"
              className="w-full"
              onClick={handleCancel}
            >
              Avbryt
            </BiografButton>
          </div>

        </div>
      </BiografCard>

      {bookingState?.reservationExpiresAt ? (
        <div className="w-full rounded-xl border border-[#b69852] bg-[#141414] px-4 py-3 text-sm text-white text-center">
          Dina platser är reserverade i 2 minuter.
          <div className="font-semibold text-[#b69852]">
            Tid kvar: {formattedTimeLeft}
          </div>
        </div>
      ) : null}
    </section>
  );
}