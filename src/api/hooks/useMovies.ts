import type { GetApiMoviesParams } from '@/api/generated/models';
import { getAllMovies, getMovie } from '@/api/services/movies';
import { useQuery } from '@tanstack/react-query';

export const movieKeys = {
  all: (params?: GetApiMoviesParams) => ['movies', params] as const,
  detail: (id: number) => ['movies', id] as const,
};

export function useMovies(params?: GetApiMoviesParams) {
  const query = useQuery({
    queryKey: movieKeys.all(params),
    queryFn: () => getAllMovies(params),
  });

  return query;
}

export function useMovie(id: number) {
  const query = useQuery({
    queryKey: movieKeys.detail(id),
    queryFn: () => getMovie(id),
  });
  return query;
}
