import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import BiografButton from '@/components/custom/BiografButton';
import BiografCard from '@/components/custom/BiografCard';
import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { AdvancedImage } from '@cloudinary/react';

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



export default function BookingPage() {
  const [cancelled, setCancelled] = useState(false);
  const navigate = useNavigate();

const MOCKED_BOOKING = {
    id: 1,
    screeningID: "13",
    movie: "The Brothers Grimsby",
    date: "2026-04-16",
    time: "21:00:00",
    seats_id: ["32", "33"],
    seats: ["D5", "D6"],
    price_category: ["1", "2"],
    posterUrl: 'filmer/4/poster_f3f4ca53c3a643afa98f9c556f26cf29',
    totalPrice: 300
  };

if (cancelled) {
    return (
      <section className="flex justify-center mt-8">
        <BiografCard title='Bokning Avbruten' headerClassName="text-red-500 text-center text-xl">
          <p className="text-white text-center p-4">Din bokning har avbrutits.</p>
          <BiografButton className="w-full" onClick={() => navigate('/')}>
            Tillbaka
          </BiografButton>
        </BiografCard>
      </section>
    );
  }

  return (
  <section className="flex justify-center items-start mt-8 gap-6">

    
    <div className="flex flex-col items-center gap-2">
      <div className="w-[180px] h-[270px] overflow-hidden rounded-xl border border-[#b69852] shadow-md">
        <AdvancedImage
          cldImg={cld.image(MOCKED_BOOKING.posterUrl).resize(fill().width(180).height(270))}
          alt={`Poster för ${MOCKED_BOOKING.movie}`}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-[#b69852] text-lg font-semibold text-center w-[180px]">
        {MOCKED_BOOKING.movie}
      </p>
    </div>

    
    <BiografCard title='Bokning & Betalning' 
      headerClassName="text-[#b69852] text-center text-xl"
      className="bg-[#1E1E1E] w-[500px] border border-[#b69852]">

      <div className="grid grid-cols-2 gap-8 text-white p-4">

        <div className="space-y-4">
            <div>
              <p className="text-[#B69852] font-semibold">Plats & Tid:</p>
              <p>{MOCKED_BOOKING.movie}</p>
              <p>{MOCKED_BOOKING.date}</p>
              <p>{MOCKED_BOOKING.time}</p>
            </div>
            <Separator className="my-2" />
            <div>
              <p className="text-[#B69852] font-semibold">Biljetter:</p>
              <p>{MOCKED_BOOKING.seats.join(", ")}</p>
              <p>Totalt: {MOCKED_BOOKING.totalPrice} kr</p>
            </div>
          </div>

         <div className="space-y-4">
            <div>
              <p className="text-[#B69852] font-semibold">Betalmetod:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Kontant</li>
              </ul>
            </div>
            <input
              type="email"
              placeholder="Skriv in din mail här..."
              className="w-full p-2 rounded bg-transparent border border-gray-600 text-white text-sm"
            />
            <div className="space-y-2">
              <BiografButton
                className="w-full bg-green-600 hover:bg-green-700 border-none"
                onClick={() => console.log("pay")}
              >
                Betala
              </BiografButton>
              <BiografButton
                variant="destructive"
                className="w-full"
                onClick={() => setCancelled(true)}
              >
                Avbryt
              </BiografButton>
            </div>
          </div>

        </div>
      </BiografCard>

    </section>
  );
}

