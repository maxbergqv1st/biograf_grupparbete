import type { GetApiV2MoviesParams } from '@/api/generated/models';
import { getAllMovies, getMovie } from '@/api/services/movies';
import { useQuery } from '@tanstack/react-query';

export const movieKeys = {
  all: (params?: GetApiV2MoviesParams) => ['movies', params] as const,
  detail: (id: number) => ['movies', id] as const,
};

export function useMovies(
  params?: GetApiV2MoviesParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: movieKeys.all(params),
    queryFn: () => getAllMovies(params),
    enabled: options?.enabled,
  });
}

export function useMovie(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: movieKeys.detail(id),
    queryFn: () => getMovie(id),
    enabled: options?.enabled,
  });
}
