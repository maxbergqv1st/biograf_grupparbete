import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useMovie } from '@/api/hooks/useMovies';
import { useScreenings } from '@/api/hooks/useScreenings';
import { Trailer } from '@/stories/ui/BiografButton.stories';
import { useParams } from 'react-router-dom';

import BiografButton from '@/components/custom/BiografButton';
import BiografCarousel from '@/components/custom/BiografCarousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Separator } from '@/components/ui/separator';

import Image from '../parts/Image';

type BiografButtonProps = ComponentProps<typeof BiografButton>;

MovieDetailsPage.route = {
  path: '/movies/:id',
  parent: '/',
  menuLabel: 'MovieDetail',
  index: 4,
};

export default function MovieDetailsPage() {
  const { id } = useParams();
  const movieId = Number(id);
  const { data, isLoading } = useMovie(movieId);
  const { data: screeningsData, isLoading: screeningsLoading } = useScreenings(
    movieId,
  );
  console.log(data);
  console.log(isLoading);
  console.log(id);

  const argsTrailer = (Trailer.args ?? {}) as BiografButtonProps;
  const screenings = screeningsData?.data ?? [];
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const uniqueDates = Array.from(
    new Set(
      screenings
        .map((screening) => screening.screeningDate)
        .filter((date): date is string => Boolean(date)),
    ),
  );
  useEffect(() => {
    if (!selectedDate && uniqueDates.length > 0) {
      setSelectedDate(uniqueDates[0]);
    }
  }, [selectedDate, uniqueDates]);
  useEffect(() => {
    setSelectedTime(null);
  }, [selectedDate]);
  const dateItems = screeningsLoading
    ? [<span key="loading">Hämtar datum...</span>]
    : uniqueDates.length === 0
      ? [<span key="empty">Inga datum</span>]
      : uniqueDates.map((date) => (
          <button
            key={date}
            type="button"
            onClick={() => setSelectedDate(date)}
            className="flex flex-col justify-center items-center h-full w-full rounded-xl"
          >
            <span>
              {new Intl.DateTimeFormat('sv-SE', { day: 'numeric' }).format(
                new Date(`${date}T00:00:00`),
              )}
              :e
            </span>
            <span>
              {new Intl.DateTimeFormat('sv-SE', { month: 'long' })
                .format(new Date(`${date}T00:00:00`))
                .replace(/^\w/, (c) => c.toUpperCase())}
            </span>
          </button>
        ));
  const timeItems = screeningsLoading
    ? [<span key="loading">Hämtar tider...</span>]
    : screenings.length === 0
      ? [<span key="empty">Inga tider</span>]
      : selectedDate
        ? screenings
            .filter((screening) => screening.screeningDate === selectedDate)
            .map((screening) => (
              <button
                key={
                  screening.id ??
                  `${screening.screeningDate}-${screening.screeningTime}`
                }
                type="button"
                onClick={() => setSelectedTime(screening.screeningTime ?? null)}
                className="flex flex-col justify-center items-center h-full w-full rounded-xl"
              >
                <span>{screening.screeningTime?.slice(0, 5) ?? '-'}</span>
                <span className="text-xs">{screening.hallName ?? ''}</span>
              </button>
            ))
        : [<span key="select-date">Välj ett datum</span>];
  return (
    <div className="relative left-1/2 grid h-dvh w-screen -translate-x-1/2 grid-cols-1 gap-4 px-4 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-3 lg:gap-6 lg:px-8">

      <div className="h-full w-full">
        <Image
          className="overflow-hidden h-full w-full object-cover"
          src="/images/movies/grimsby.jpg"
        />
      </div>
      <AspectRatio className="max-h-full overflow-hidden h-4/3 w-full rounded-lg bg-[#1E1E1E] p-4">
        <h3 className="flex justify-center p-10 text-xl">Välj Datum & tid</h3>
        <Separator />
        <div className="flex justify-center p-5">
          <BiografCarousel
            selectable
            desktopTwoRows
            className="p-5"
            items={dateItems}
          />
        </div>
        <Separator className="flex justify-center" />
        <div className="flex justify-center p-5">
          <BiografCarousel
            selectable
            desktopTwoRows
            className="p-5"
            items={timeItems}
            resetSelectionKey={selectedDate}
          />
        </div>
        <Separator className="flex justify-center" />
        <div className="flex justify-center p-20">
        <BiografButton>
          <Link to="/booking">- Välj säten -</Link>
        </BiografButton>
        </div>
      </AspectRatio>

      <AspectRatio className="max-h-full overflow-hidden self-top w-full max-w-md justify-self-center rounded-lg bg-[#1E1E1E] p-4">
        <h1 className="flex justify-center p-5 text-2xl text-[#b69852]">
          {data?.data.title ? data?.data.title : 'No title'}
        </h1>
        <Separator className="flex justify-center" />
        <div className='pt-0.5 pb-1.5'>
        <span>
          | {data?.data.ageRating + '+' ? data?.data.ageRating + '+': 'No age rating'} |
          | {data?.data.language?.code ? data?.data.language.code : 'No language'} | 
          | {Array.isArray(data?.data.genres) ? data?.data.genres.join(', ') : data?.data.genres ? data?.data.genres : 'No genres'} |
        </span>
        </div>
        <Separator className="flex justify-center" />
        <span className="flex justify-center p-5">
          {data?.data.description ? data?.data.description : 'No description'}
        </span>
        <Separator className="flex justify-center" />
        <span className="flex justify-center p-5">
          Director: {data?.data.director ? data?.data.director : 'No director'}
        </span>
      </AspectRatio>
      <AspectRatio className="max-h-full overflow-hidden h-40 w-full rounded-lg border bg-[url(/images/movies/grimsby.jpg)] bg-center">
        <div className="absolute right-5 bottom-5">
          <a href="https://www.youtube.com/watch?v=_YtclB_02wA" target="_blank">
            <BiografButton {...argsTrailer} />
          </a>
        </div>
      </AspectRatio>
    </div>
  );
}
