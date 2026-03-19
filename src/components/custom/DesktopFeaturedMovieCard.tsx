import { useEffect, useRef, useState } from 'react';

import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import type { MovieSummaryDto } from '@/api/generated/models/movieSummaryDto';
import BiografButton from '@/components/custom/BiografButton';
import BiografCard from '@/components/custom/BiografCard';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DialogContent,
  DialogTrailer,
  DialogTrigger,
} from '@/components/ui/dialog-trailer';

const cld = new Cloudinary({ cloud: { cloudName: 'dveubqvv8' } });

function DesktopPoster({ poster, title }: { poster?: string; title: string }) {
  if (!poster) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-zinc-800">
        <p className="text-sm text-zinc-400">{title}</p>
      </div>
    );
  }

  return (
    <AdvancedImage
      cldImg={cld.image(poster).resize(fill().width(600).height(900))}
      alt={`Poster för ${title}`}
      className="h-full w-full object-cover"
    />
  );
}

function TrailerPreview({
  trailerUrl,
  poster,
}: {
  trailerUrl?: string;
  poster?: string;
}) {
  if (!trailerUrl) return null;

  return (
    <DialogTrailer>
      <DialogTrigger
        render={
          <button
            type="button"
            className="relative w-full cursor-pointer overflow-hidden rounded-lg"
          >
            {poster ? (
              <AdvancedImage
                cldImg={cld.image(poster).resize(fill().width(400).height(225))}
                alt="Trailer preview"
                className="aspect-video w-full object-cover blur-[2px] brightness-50"
              />
            ) : (
              <div className="aspect-video w-full bg-zinc-800" />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <BiografButton variant="playIcon" size="icon">
                <Play className="ml-0.5 h-5 w-5 fill-current text-[#F3EEE4]" />
              </BiografButton>
            </div>
          </button>
        }
      />
      <DialogContent className="w-[90vw] max-w-4xl p-0">
        <div className="aspect-video w-full">
          <iframe
            className="h-full w-full rounded-xl"
            src={trailerUrl.replace('watch?v=', 'embed/') + '?autoplay=0'}
            title="Trailer"
            allowFullScreen
          />
        </div>
      </DialogContent>
    </DialogTrailer>
  );
}

function DesktopInfoPanel({
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
    <div className="flex h-full flex-col justify-center gap-4 px-10 py-8">
      <Badge
        variant="outline"
        className="w-fit border-none px-0 text-xs tracking-[0.2em] text-[#F3EEE4]/60 uppercase"
      >
        {trendingLabel}
      </Badge>

      <h2 className="text-4xl leading-tight font-bold tracking-wide text-[#B69852]">
        {movie.title.toUpperCase()}
      </h2>

      {movie.tagline && (
        <p className="text-base leading-relaxed text-[#F3EEE4]/50 italic">
          &ldquo;{movie.tagline}&rdquo;
        </p>
      )}

      <div className="flex items-center gap-2 text-sm tracking-wide text-[#F3EEE4]/80 uppercase">
        {movie.ageRating && (
          <>
            <Badge
              variant="outline"
              className="border-none px-0 text-sm font-bold text-[#F3EEE4]"
            >
              {movie.ageRating}
            </Badge>
            <Separator orientation="vertical" className="h-4 bg-[#F3EEE4]/50" />
          </>
        )}
        {movie.language && <span>{movie.language.code}</span>}
      </div>

      {movie.genres && movie.genres.length > 0 && (
        <div className="text-sm tracking-wide text-[#F3EEE4]/80 uppercase">
          {[...new Set(movie.genres)].join(', ')}
        </div>
      )}

      <div className="mt-4 flex w-full flex-col items-center gap-1.5">
        <BiografButton
          variant="ghost"
          className="w-full rounded-xl py-2.5 text-sm font-medium text-[#B69852]"
          style={{
            background:
              'linear-gradient(270deg, #767676 0%, #363535 50%, #323232 100%)',
          }}
          onClick={onBook}
        >
          {bookLabel}
        </BiografButton>
      </div>

      <TrailerPreview
        trailerUrl={movie.trailerUrl ?? undefined}
        poster={movie.posterUrl ?? undefined}
      />
    </div>
  );
}

export default function DesktopFeaturedMovieCard({
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
      .resize(fill().width(600).height(900))
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
    navigate(`/movies/${displayedMovie.id}`);
  };

  return (
    <div
      className="flex items-stretch gap-4 transition-opacity duration-300"
      style={{ opacity: fading ? 0 : 1 }}
    >
      <BiografCard
        className="flex w-3/5 shrink-0 overflow-hidden border-none shadow-none"
        contentClassName="p-0"
      >
        <DesktopPoster
          poster={displayedMovie.posterUrl ?? undefined}
          title={displayedMovie.title}
        />
      </BiografCard>

      <BiografCard
        className="flex-1 border-none bg-[#1a1a1a] shadow-none"
        contentClassName="p-0"
      >
        <DesktopInfoPanel
          movie={displayedMovie}
          onBook={handleBook}
          bookLabel={t('featuredMovie.book')}
          trendingLabel={t('featuredMovie.trending')}
        />
      </BiografCard>
    </div>
  );
}
