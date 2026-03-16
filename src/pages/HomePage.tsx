import { useState } from 'react';

import {
  BiografCol,
  BiografContainer,
  BiografRow,
} from '@/components/custom/BiografContainer';
import BiografFilters from '@/components/custom/BiografFilters';
import MoviePoster from '@/components/custom/MoviePoster';
import { useHomeMovies } from '@/hooks/useHomeMovies';
import { Skeleton } from '@/components/ui/skeleton';

const IS_V1 = import.meta.env.VITE_API_VERSION !== 'v2';

export default function HomePage() {
  const [filters, setFilters] = useState({
    date: '',
    ageRating: '',
    search: '',
  });

  const handleFilter = (newFilters: {
    date: string;
    ageRating: string;
    search: string;
  }) => {
    setFilters(newFilters);
  };

  const { movies, isLoading, isError } = useHomeMovies(
    IS_V1
      ? undefined
      : {
          screeningDate: filters.date || undefined,
          ageRating: filters.ageRating || undefined,
          search: filters.search || undefined,
        },
  );

  return (
    <BiografContainer>
      {!IS_V1 && <BiografFilters onFiltersChange={handleFilter} />}
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
