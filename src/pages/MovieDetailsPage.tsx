import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';

import { useMovie } from '@/api/hooks/useMovies';
import { useScreenings } from '@/api/hooks/useScreenings';
import { Trailer } from '@/stories/ui/BiografButton.stories';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import BiografButton from '@/components/custom/BiografButton';
import BiografCarousel from '@/components/custom/BiografCarousel';
import MovieDetailsPagePoster from '@/components/custom/MovieDetailsPoster';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

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
  const { data: screeningsData, isLoading: screeningsLoading } =
    useScreenings(movieId);
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
            className="flex h-full w-full flex-col items-center justify-center rounded-xl"
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
                className="flex h-full w-full flex-col items-center justify-center rounded-xl"
              >
                <span>{screening.screeningTime?.slice(0, 5) ?? '-'}</span>
                <span className="text-xs">{screening.hallName ?? ''}</span>
              </button>
            ))
        : [<span key="select-date">Välj ett datum</span>];
  return (
    <div className="relative left-1/2 grid h-dvh w-screen -translate-x-1/2 grid-cols-1 gap-4 px-4 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-3 lg:gap-6 lg:px-8">
      <div className="h-dvh w-full">
        <MovieDetailsPagePoster
          title={data?.data.title ?? 'Untitled'}
          poster={data?.data.posterUrl ?? undefined}
        />
      </div>
      <AspectRatio className="h-[97.5dvh] w-full rounded-lg bg-[#1E1E1E] p-4">
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
        <div className="flex justify-center p-8">
          <BiografButton>
            <Link to="/booking">- Välj säten -</Link>
          </BiografButton>
        </div>
      </AspectRatio>
      <div className="flex flex-col gap-4 lg:col-start-3 lg:row-span-3 lg:row-start-1">
        <AspectRatio className="self-top max-h-full w-full max-w-md justify-self-center rounded-lg bg-[#1E1E1E] p-4">
          <h1 className="flex justify-center p-5 text-2xl text-[#b69852]">
            {data?.data.title ? data?.data.title : 'No title'}
          </h1>
          <Separator className="flex justify-center" />
          <div className="pt-0.5 pb-1.5">
            <span>
              |{' '}
              {data?.data.ageRating + '+'
                ? data?.data.ageRating + '+'
                : 'No age rating'}{' '}
              | |{' '}
              {data?.data.language?.code
                ? data?.data.language.code
                : 'No language'}{' '}
              | |{' '}
              {Array.isArray(data?.data.genres)
                ? data?.data.genres.join(', ')
                : data?.data.genres
                  ? data?.data.genres
                  : 'No genres'}{' '}
              |
            </span>
          </div>
          <Separator className="flex justify-center" />
          <span className="flex justify-center p-5">
            {data?.data.description ? data?.data.description : 'No description'}
          </span>
          <Separator className="flex justify-center" />
          <span className="flex justify-center p-5">
            Director:{' '}
            {data?.data.director ? data?.data.director : 'No director'}
          </span>
        </AspectRatio>
<AspectRatio className="relative h-40 max-h-full w-full overflow-hidden rounded-lg border">
 <div className="absolute inset-0 blur-sm scale-x-500 scale-100 translate-x-300">
    <MovieDetailsPagePoster
      title={data?.data.title ?? 'Untitled'}
      poster={data?.data.posterUrl ?? undefined}
    />
  </div>
  <div className="absolute right-5 bottom-5">
    {data?.data.trailerUrl ? (
      <Dialog>
        <DialogTrigger render={ <BiografButton {...argsTrailer} />} />
          <DialogContent className="p-0 max-w-3xl w-[90vw]">
          <div className="aspect-video w-full">
            <iframe
              className="h-full w-full rounded-xl"
              src={data.data.trailerUrl.replace("watch?v=", "embed/") + "?autoplay=0"}
              title="Trailer"
              allowFullScreen
            />
            </div>
        </DialogContent>
      </Dialog>
    ) : (
      <BiografButton {...argsTrailer} disabled />
    )
    }    
  </div>
</AspectRatio>
      </div>
    </div>
  );
}
