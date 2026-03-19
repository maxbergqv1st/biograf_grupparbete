import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import BiografButton from '@/components/custom/BiografButton';
import BiografCard from '@/components/custom/BiografCard';
import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { AdvancedImage } from '@cloudinary/react';
import { useBookingForm } from "@/api/hooks/useBookingForm";
import type { BookingSeat } from "@/api/hooks/useBookingForm";
import { seatsService } from '@/api/services/seats';

const cld = new Cloudinary({ cloud: { cloudName: 'dveubqvv8' } });
//import { start } from 'repl';


BookingPage.route = {
  path: '/booking',
  parent: '/',
  menuLabel: 'Bookings',
  index: 2,
};

//export default function BookingPage() {
  // Here is where you maniupulate data ALt-shift-f
  // const { data } = useBookingData() ;
  //After card {/* <h1 className="text-2xl font-semibold">Bookings</h1> */}
  //<BiografCard title='Title' description='Description'> Before map

type ScreeningInfo = {
  id: number;
  movieName: string;
  date: string;
  time: string;
  basePrice: number;
  posterUrl: string;
};

function translateCategory(category: string): string {
  const translations: Record<string, string> = {
    Adult: 'Vuxen',
    Child: 'Barn',
    Senior: 'Pensionär'
  };
  return translations[category] ?? category;
}

export default function BookingPage() {
  const [cancelled, setCancelled] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [email, setEmail] = useState('');
  const [timeLeftMs, setTimeLeftMs] = useState(0);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const { submit, submitting, error } = useBookingForm();
  const bookingState = location.state as
    | {
        screening?: ScreeningInfo;
        seats?: BookingSeat[];
        reservationSessionId?: string;
        reservationExpiresAt?: string;
      }
    | null;

  const screening: ScreeningInfo = bookingState?.screening ?? {
    id: 13,
    movieName: "The Brothers Grimsby",
    date: "2026-04-16",
    time: "21:00:00",
    basePrice: 100,
    posterUrl: 'filmer/4/poster_f3f4ca53c3a643afa98f9c556f26cf29',
  };

  const [seats] = useState<BookingSeat[]>(bookingState?.seats ?? [
    {
      seatId: 32,
      seatLabel: "D5",
      priceCategorySeatId: 1,
      category: "Adult",
      discountModifier: 1.0,
      finalPrice: screening.basePrice * 1.0
    },
    {
      seatId: 33,
      seatLabel: "D6",
      priceCategorySeatId: 2,
      category: "Senior",
      discountModifier: 0.7,
      finalPrice: screening.basePrice * 0.7
    }
  ]);

  //Calculates the total price of the booking by summing up the final price of each seat. This is done using the reduce method on the seats array, which iterates through each seat and adds its finalPrice to a running total (sum). The initial value of sum is set to 0.
  const totalPrice = seats.reduce((sum, seat) => sum + seat.finalPrice, 0);

async function handleBetala() {
    const result = await submit({
      email,
      screeningId: screening.id,
      totalPrice,
      reservationSessionId: bookingState?.reservationSessionId,
      seats,
      // userId left out until user context is implemented
    });
    if (result) {
      await queryClient.invalidateQueries({
        queryKey: ['seat-statuses', screening.id],
      });
      setConfirmed(true);
    }
  }

  async function handleCancel() {
    if (bookingState?.reservationSessionId) {
      await seatsService.releaseSeats({
        screeningId: screening.id,
        sessionId: bookingState.reservationSessionId,
      });
      await queryClient.invalidateQueries({
        queryKey: ['seat-statuses', screening.id],
      });
    }

    setCancelled(true);
  }

  useEffect(() => {
    if (!bookingState?.reservationExpiresAt || confirmed || cancelled) {
      return;
    }

    const expiresAt = new Date(bookingState.reservationExpiresAt).getTime();
    const timeoutMs = expiresAt - Date.now();
    setTimeLeftMs(Math.max(timeoutMs, 0));

    if (timeoutMs <= 0) {
      void handleCancel();
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void handleCancel();
    }, timeoutMs);

    const intervalId = window.setInterval(() => {
      setTimeLeftMs(Math.max(expiresAt - Date.now(), 0));
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [bookingState?.reservationExpiresAt, cancelled, confirmed]);

  const minutesLeft = Math.floor(timeLeftMs / 60000);
  const secondsLeft = Math.floor((timeLeftMs % 60000) / 1000);
  const formattedTimeLeft = `${minutesLeft}:${secondsLeft
    .toString()
    .padStart(2, '0')}`;

  if (cancelled) {
    return (
      <section className="flex justify-center mt-8">
        <BiografCard title='Bokning Avbruten' headerClassName="text-red-500 text-center text-xl"
          className="bg-[#1E1E1E] border border-[#b69852] w-[400px]">
          <p className="text-white text-center p-4">Din bokning har avbrutits.</p>
          <BiografButton className="w-full" onClick={() => navigate('/')}>
            Tillbaka
          </BiografButton>
        </BiografCard>
      </section>
    );
  }

  if (confirmed) {
    return (
      <section className="flex justify-center mt-8">
        <BiografCard title='Bokning Bekräftad!'
          headerClassName="text-green-500 text-center text-xl"
          className="bg-[#1E1E1E] w-[400px] border border-[#b69852]">
          <div className="text-white text-center space-y-2 p-4">
            <p className="text-[#b69852] font-semibold">{screening.movieName}</p>
            <p>{screening.date} kl. {screening.time}</p>
            <div className="text-sm space-y-1">
              {seats.map(seat => (
                <p key={seat.seatId}>
                  {seat.seatLabel} — {translateCategory(seat.category)} — {seat.finalPrice} kr
                </p>
              ))}

            </div>
            <Separator className="my-2" />
            <p className="font-semibold">Totalt: {totalPrice} kr</p>
            <p className="text-sm text-gray-400">Bekräftelse skickas till {email}</p>
            <p className="text-sm text-gray-400">Betalning sker i kassan på biografen.</p>
            <BiografButton className="w-full mt-4" onClick={() => navigate('/')}>
              Tillbaka till startsidan
            </BiografButton>
          </div>
        </BiografCard>
      </section>
    );
  }

  return (
    <section className="flex justify-center items-start mt-8 gap-6">

      {/* Poster for the movie selected for the screening for this booking */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-[180px] h-[270px] overflow-hidden rounded-xl border border-[#b69852] shadow-md">
          {screening.posterUrl ? (
            <AdvancedImage
              cldImg={cld.image(screening.posterUrl).resize(fill().width(180).height(270))}
              alt={`Poster för ${screening.movieName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#2A2A2A] text-sm text-gray-400">
              Ingen poster
            </div>
          )}
        </div>
        <p className="text-[#b69852] text-lg font-semibold text-center w-[180px]">
          {screening.movieName}
        </p>
      </div>

      {/* Booking card with booking details for this booking */}
      <BiografCard title='Bokning & Betalning'
        headerClassName="text-[#b69852] text-center text-xl"
        className="bg-[#1E1E1E] w-[500px] border border-[#b69852]">
        <div className="grid grid-cols-2 gap-8 text-white p-4">

          {/* Left column */}
          <div className="space-y-4">
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
                <div key={seat.seatId} className="mb-3">
                  <p>
                    Plats {seat.seatLabel} — {translateCategory(seat.category)} — {seat.finalPrice} kr
                  </p>
                </div>
              ))}
              <Separator className="my-2" />
              <p className="font-semibold">Totalt: {totalPrice} kr</p>
            </div>
          </div>

          {/* Right column with payment type, email and confirm/cancel*/}
          <div className="space-y-4">
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

        </div>
      </BiografCard>
      {bookingState?.reservationExpiresAt ? (
        <div className="fixed right-4 bottom-4 rounded-xl border border-[#b69852] bg-[#141414] px-4 py-3 text-sm text-white shadow-lg">
          Dina platser är reserverade i 2 minuter.
          <div className="font-semibold text-[#b69852]">
            Tid kvar: {formattedTimeLeft}
          </div>
        </div>
      ) : null}
    </section>
  );
}
