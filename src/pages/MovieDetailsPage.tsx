import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';

import { useScreenings } from '@/api/hooks/useScreenings';
import { Trailer } from '@/stories/ui/BiografButton.stories';
import { Link, useParams } from 'react-router-dom';

import BiografButton from '@/components/custom/BiografButton';
import BiografCarousel from '@/components/custom/BiografCarousel';
import MovieDetailsPagePoster from '@/components/custom/MovieDetailsPoster';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  DialogContent,
  DialogTrailer,
  DialogTrigger,
} from '@/components/ui/dialog-trailer';
import { Separator } from '@/components/ui/separator';

import { useMovieDetails } from '@/hooks/useMovieDetails';

type BiografButtonProps = ComponentProps<typeof BiografButton>;

export default function MovieDetailsPage() {
  const { id } = useParams();
  const movieId = Number(id);
  const { movie } = useMovieDetails(movieId);
  const { data: screeningsData, isLoading: screeningsLoading } =
    useScreenings(movieId);

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
  }, [selectedDate, uniqueDates, movie]);
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
      <div className="h-[91.5dvh] w-full">
        <MovieDetailsPagePoster
          title={movie?.title ?? 'Untitled'}
          poster={movie?.poster ?? undefined}
        />
      </div>
      <AspectRatio className="h-[91.5dvh] w-full rounded-lg bg-[#1E1E1E] p-4">
        <h3 className="flex justify-center p-6 text-2xl text-[#b69852]">
          Välj Datum & tid
        </h3>
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
        <div className="flex justify-center p-10">
          <BiografButton className="w-full max-w-xs md:max-w-sm">
            <Link to="/booking">Välj sittplats</Link>
          </BiografButton>
        </div>
      </AspectRatio>
      <div className="flex flex-col gap-4 lg:col-start-3 lg:row-span-3 lg:row-start-1">
        <AspectRatio className="self-top h-[62dvh] w-full max-w-md justify-self-center rounded-lg bg-[#1E1E1E] p-4">
          <h1 className="flex justify-center p-3 text-2xl text-[#b69852]">
            {movie?.title ?? 'No title'}
          </h1>
          <Separator className="flex justify-center" />
          <div className="flex justify-center pt-1.5 pb-2.5">
            <span>
              | {movie?.ageRating ? movie.ageRating + '+' : 'No age rating'} | |{' '}
              {movie?.language ?? 'No language'} | |{' '}
              {movie?.genres?.length ? movie.genres.join(', ') : 'No genres'} |
            </span>
          </div>
          <Separator className="flex justify-center" />
          <span className="flex justify-center p-5">
            {movie?.description ?? 'No description'}
          </span>
          <Separator className="flex justify-center" />
          <span className="flex justify-center pt-5 text-[#b69852]">
            Direktör:{' '}
          </span>
          <span className="flex justify-center pt-1">
            {movie?.director ?? 'No director'}
          </span>
          <span className="flex justify-center pt-5 text-[#b69852]">
            Skådespelare:
          </span>
          <span className="flex justify-center pt-1 pl-10">
            {' '}
            {movie?.actors?.some((a) => a.name)
              ? movie.actors
                  .map((a) => a.name)
                  .filter(Boolean)
                  .join(', ')
              : 'No actors'}
          </span>
        </AspectRatio>
        <AspectRatio className="relative h-40 max-h-full w-full overflow-hidden rounded-lg border">
          <div className="absolute inset-0 translate-x-300 scale-100 scale-x-550 blur-sm">
            <MovieDetailsPagePoster
              title={movie?.title ?? 'Untitled'}
              poster={movie?.poster ?? undefined}
            />
          </div>
          <div className="absolute right-5 bottom-5">
            {movie?.trailerUrl ? (
              <DialogTrailer>
                <DialogTrigger render={<BiografButton {...argsTrailer} />} />
                <DialogContent className="w-[90vw] max-w-3xl p-0">
                  <div className="aspect-video w-full">
                    <iframe
                      className="h-full w-full rounded-xl"
                      src={
                        movie.trailerUrl.replace('watch?v=', 'embed/') +
                        '?autoplay=0'
                      }
                      title="Trailer"
                      allowFullScreen
                    />
                  </div>
                </DialogContent>
              </DialogTrailer>
            ) : (
              <BiografButton {...argsTrailer} disabled />
            )}
          </div>
        </AspectRatio>
      </div>
    </div>
  );
}
