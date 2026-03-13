import { useState } from 'react';

import { useMovies } from '@/api/hooks/useMovies';
import MoviePoster from '@/components/custom/MoviePoster';

import {
  BiografCol,
  BiografContainer,
  BiografRow,
} from '@/components/custom/BiografContainer';
import BiografFilters from '@/components/custom/BiografFilters';
import { Skeleton } from '@/components/ui/skeleton';

LandingPage.route = {
  path: '/',
  menuLabel: 'Home',
};

export default function LandingPage() {

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

  const { data, isLoading, isError } = useMovies({
    screeningDate: filters.date || undefined,
    ageRating: filters.ageRating || undefined,
    search: filters.search || undefined, // ← Lägg till!
  });

  const navigate = useNavigate();
  const { data, isLoading, isError } = useMovies()

  console.log('data', data);
  console.log('isLoading', isLoading);
  console.log('isError', isError);

  return (
    <BiografContainer>
      <BiografFilters onFiltersChange={handleFilter} />
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

        {data?.data.map((movie) => {
          if (!movie.id) return null;
          return (
            <BiografCol key={movie.id}>
              <MoviePoster
                id={movie.id}
                title={movie.title ?? 'Untitled'}
                poster={movie.posterUrl ?? undefined}
              />
            </BiografCol>
          );
        })}
      </BiografRow>
    </BiografContainer>
  );
}
