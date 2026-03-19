import { useEffect, useRef, useState } from 'react';

import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import type { MovieSummaryDto } from '@/api/generated/models/movieSummaryDto';
import BiografButton from '@/components/custom/BiografButton';
import { BiografContainer } from '@/components/custom/BiografContainer';
import {
  DialogContent,
  DialogTrailer,
  DialogTrigger,
} from '@/components/ui/dialog-trailer';

const cld = new Cloudinary({ cloud: { cloudName: 'dveubqvv8' } });

function FeaturedPoster({ poster, title }: { poster?: string; title: string }) {
  if (!poster) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-zinc-800">
        <p className="text-sm text-zinc-400">{title}</p>
      </div>
    );
  }

  return (
    <AdvancedImage
      cldImg={cld.image(poster).resize(fill().width(600).height(600))}
      alt={`Poster för ${title}`}
      className="aspect-square! w-full rounded-2xl object-cover"
    />
  );
}

function WatchTrailerButton({
  trailerUrl,
  label,
}: {
  trailerUrl?: string;
  label: string;
}) {
  if (!trailerUrl) return null;

  return (
    <DialogTrailer>
      <DialogTrigger
        render={
          <BiografButton
            variant="trailer"
            size="sm"
            className="gap-2 rounded-full px-4 py-2 text-xs"
          >
            {label} <Play className="h-3.5 w-3.5 fill-current" />
          </BiografButton>
        }
      />
      <DialogContent className="w-[90vw] max-w-3xl p-0">
        <BiografContainer className="aspect-video w-full">
          <iframe
            className="h-full w-full rounded-xl"
            src={trailerUrl.replace('watch?v=', 'embed/') + '?autoplay=0'}
            title="Trailer"
            allowFullScreen
          />
        </BiografContainer>
      </DialogContent>
    </DialogTrailer>
  );
}

function FeaturedMovieInfoPanel({
  movie,
  onBook,
  bookLabel,
  trendingLabel,
}: {
  movie: MovieSummaryDto;
  onBook: () => void;
  bookLabel: string;
  trendingLabel: string;
}) {
  return (
    <div className="rounded-[64px] bg-[#1a1a1a] px-5 py-4">
      <span className="text-[11px] font-semibold tracking-[0.15em] text-[#F3EEE4]/70 uppercase">
        {trendingLabel}
      </span>

      <div className="mt-1.5 flex items-center justify-between gap-4">
        <h2 className="text-xl leading-tight font-bold tracking-wide text-[#B69852]">
          {movie.title.toUpperCase()}
        </h2>
        <div className="flex shrink-0 flex-col items-center gap-1.5">
          <BiografButton
            variant="ghost"
            size="sm"
            className="rounded-xl px-6 py-2 text-sm font-medium text-[#B69852]"
            style={{
              background:
                'linear-gradient(270deg, #767676 0%, #363535 50%, #323232 100%)',
            }}
            onClick={onBook}
          >
            {bookLabel}
          </BiografButton>
          <div className="w-20 border-t border-dashed border-[#B69852]/60" />
        </div>
      </div>

      <div className="mt-1.5 flex items-center gap-1.5 text-sm tracking-wide text-[#F3EEE4]/80 uppercase">
        {movie.ageRating && (
          <>
            <span className="font-bold text-[#F3EEE4]">{movie.ageRating}</span>
            <span className="text-[#F3EEE4]/50">.</span>
          </>
        )}
        {movie.language && <span>{movie.language.code}</span>}
      </div>

      {movie.genres && movie.genres.length > 0 && (
        <div className="mt-0.5 text-sm tracking-wide text-[#F3EEE4]/80 uppercase">
          {[...new Set(movie.genres)].join(', ')}
        </div>
      )}
    </div>
  );
}

export default function MobileFeaturedMovieCard({
  movie,
}: {
  movie: MovieSummaryDto;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation('main');
  const [displayedMovie, setDisplayedMovie] = useState(movie);
  const [fading, setFading] = useState(false);
  const pendingRef = useRef(movie);

  useEffect(() => {
    if (movie.id === displayedMovie.id) return;

    pendingRef.current = movie;

    if (!movie.posterUrl) {
      setFading(true);
      setTimeout(() => {
        setDisplayedMovie(movie);
        setFading(false);
      }, 300);
      return;
    }

    const img = new Image();
    img.src = cld
      .image(movie.posterUrl)
      .resize(fill().width(600).height(600))
      .toURL();

    const swap = () => {
      if (pendingRef.current.id !== movie.id) return;
      setFading(true);
      setTimeout(() => {
        setDisplayedMovie(movie);
        setFading(false);
      }, 300);
    };

    img.onload = swap;
    img.onerror = swap;
  }, [movie, displayedMovie.id]);

  const handleBook = () => {
    navigate(`/mmovies/${displayedMovie.id}`);
  };

  return (
    <div
      className="relative pb-20 transition-opacity duration-300"
      style={{ opacity: fading ? 0 : 1 }}
    >
      <div className="relative overflow-hidden rounded-2xl border border-[#B69852]/40 shadow-[0px_0px_8px_1px_rgba(182,152,82,0.3)]">
        <FeaturedPoster
          poster={displayedMovie.posterUrl ?? undefined}
          title={displayedMovie.title}
        />

        <div className="absolute right-4 bottom-20 z-10">
          <WatchTrailerButton
            trailerUrl={displayedMovie.trailerUrl ?? undefined}
            label={t('featuredMovie.watchTrailer')}
          />
        </div>
      </div>

      <div className="absolute right-1 bottom-0 left-1 z-20">
        <FeaturedMovieInfoPanel
          movie={displayedMovie}
          onBook={handleBook}
          bookLabel={t('featuredMovie.book')}
          trendingLabel={t('featuredMovie.trending')}
        />
      </div>
    </div>
  );
}
