import { useQuery } from '@tanstack/react-query';
import { getScreening, getScreeningsByMovieId, getMyBookings } from '@/api/services/screenings';


export const screeningKeys = {
  byMovieId: (movieId: number) =>
    ['screenings', 'by-movie-id', movieId] as const,
  detail: (id: number) => ['screenings', id] as const,
  myBookings: () => ['screenings', 'my-bookings'] as const,

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
export function useMyBookings() {
  const query = useQuery({
    queryKey: screeningKeys.myBookings(),
    queryFn: () => getMyBookings(),
  });
  return query;
}


