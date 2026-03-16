import { getScreening, getScreeningsByMovieId } from '@/api/services/screenings';
import { useQuery } from '@tanstack/react-query';

export const screeningKeys = {
  byMovieId: (movieId: number) =>
    ['screenings', 'by-movie-id', movieId] as const,
  detail: (id: number) => ['screenings', id] as const,
};

export function useScreenings(movieId: number) {
  const query = useQuery({
    queryKey: screeningKeys.byMovieId(movieId),
    queryFn: () => getScreeningsByMovieId(movieId),
  });

  return query;
}

export function useScreening(id: number) {
  const query = useQuery({
    queryKey: screeningKeys.detail(id),
    queryFn: () => getScreening(id),
  });
  return query;
}