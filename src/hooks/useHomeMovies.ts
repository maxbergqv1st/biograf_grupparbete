import { useMovies } from '@/api/hooks/useMovies';
import { useLoaderData } from 'react-router-dom';

const IS_V1 = import.meta.env.VITE_API_VERSION !== 'v2';

export type MovieListItem = {
  id: number;
  title: string;
  poster: string | undefined;
};

type Filters = {
  screeningDate?: string;
  ageRating?: string;
  search?: string;
};

export function useHomeMovies(filters?: Filters) {
  if (IS_V1) {
    const loaderData = useLoaderData() as Record<string, unknown>[] | undefined;

    const movies: MovieListItem[] | undefined = (loaderData as any[])?.map(
      (m) => ({
        id: m.id,
        title: m.title ?? 'Untitled',
        poster: m.poster ?? m.poster_url,
      }),
    );
    return { movies, isLoading: false, isError: false };
  }
  const query = useMovies(IS_V1 ? undefined : filters);

  const movies: MovieListItem[] | undefined = query.data?.data.map((m) => ({
    id: m.id,
    title: m.title ?? 'Untitled',
    poster: m.posterUrl ?? undefined,
  }));

  return { movies, isLoading: query.isLoading, isError: query.isError,error:query.error };
}
