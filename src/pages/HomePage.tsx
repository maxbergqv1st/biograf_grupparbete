import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import {
  BiografCol,
  BiografContainer,
  BiografRow,
} from '@/components/custom/BiografContainer';
import BiografFilters from '@/components/custom/BiografFilters';
import MobileFeaturedMovieCard from '@/components/custom/MobileFeaturedMovieCard';
import MoviePoster from '@/components/custom/MoviePoster';
import { Skeleton } from '@/components/ui/skeleton';

import { useIsMobile } from '@/hooks/common/useIsMobile';
import { useFeaturedMovie } from '@/hooks/useFeaturedMovie';
import { useHomeMovies } from '@/hooks/useHomeMovies';

const IS_V1 = import.meta.env.VITE_API_VERSION !== 'v2';

export default function HomePage() {
  const [filters, setFilters] = useState({
    date: '',
    ageRating: '',
    search: '',
  });
  const { t } = useTranslation('main');
  const isMobile = useIsMobile();

  const handleFilter = (newFilters: {
    date: string;
    ageRating: string;
    search: string;
  }) => {
    setFilters(newFilters);
  };

  const { movies, featuredMovies, isLoading, isError } = useHomeMovies(
    IS_V1
      ? undefined
      : {
          screeningDate: filters.date || undefined,
          ageRating: filters.ageRating || undefined,
          search: filters.search || undefined,
        },
  );

  const currentFeatured = useFeaturedMovie(featuredMovies);

  return (
    <BiografContainer>
      {!IS_V1 && <BiografFilters onFiltersChange={handleFilter} />}

      {isMobile && currentFeatured && (
        <div className="mb-6 px-2">
          <MobileFeaturedMovieCard movie={currentFeatured} />
        </div>
      )}

      {isMobile && movies && movies.length > 0 && (
        <div className="mb-4 flex items-center justify-between px-2">
          <h2 className="text-lg font-bold text-[#F3EEE4]">
            {t('featuredMovie.moviesInCinema')}
          </h2>
        </div>
      )}

      <BiografRow className="justify-center gap-y-6">
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => (
            <BiografCol key={i}>
              <div className="mx-auto w-full max-w-xs">
                <Skeleton className="aspect-[2/3] w-full rounded-xl" />
              </div>
            </BiografCol>
          ))}

        {isError && <div>Error loading movies.</div>}

        <BiografCol className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {movies?.map((movie) => (
            <BiografCol key={movie.id}>
              <MoviePoster
                id={movie.id}
                title={movie.title}
                poster={movie.poster}
              />
            </BiografCol>
          ))}
        </BiografCol>
      </BiografRow>
    </BiografContainer>
  );
}
