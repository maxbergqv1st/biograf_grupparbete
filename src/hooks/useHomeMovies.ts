import { useMovies } from '@/api/hooks/useMovies';
import { useLoaderData } from 'react-router-dom';

import type { MovieSummaryDto } from '@/api/generated/models/movieSummaryDto';

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

type HomeMoviesResult = {
  movies: MovieListItem[] | undefined;
  featuredMovies: MovieSummaryDto[];
  isLoading: boolean;
  isError: boolean;
};

function useHomeMoviesV1(_filters?: Filters): HomeMoviesResult {
  const loaderData = useLoaderData() as Record<string, unknown>[] | undefined;

  const movies: MovieListItem[] | undefined = loaderData?.map((m) => ({
    id: m.id as number,
    title: (m.title as string) ?? 'Untitled',
    poster: (m.poster as string) ?? (m.poster_url as string),
  }));

  const featuredMovies: MovieSummaryDto[] = (loaderData ?? []).map((m) => ({
    id: m.id as number,
    title: (m.title as string) ?? 'Untitled',
    tagline: '',
    ageRating: '',
    posterUrl: ((m.poster as string) ?? (m.poster_url as string)) || undefined,
    genres: [],
  }));

  return {
    movies,
    featuredMovies,
    isLoading: false,
    isError: false,
  };
}

function useHomeMoviesV2(filters?: Filters): HomeMoviesResult {
  const query = useMovies(filters);

  const movies: MovieListItem[] | undefined = query.data?.data.map((m) => ({
    id: m.id,
    title: m.title ?? 'Untitled',
    poster: m.posterUrl ?? undefined,
  }));

  return {
    movies,
    featuredMovies: query.data?.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export const useHomeMovies = IS_V1 ? useHomeMoviesV1 : useHomeMoviesV2;
