import { useMovie } from '@/api/hooks/useMovies';
import { useLoaderData } from 'react-router-dom';

const IS_V1 = import.meta.env.VITE_API_VERSION !== 'v2';

export type MovieDetail = {
  id: number;
  title: string;
  tagline: string;
  description: string;
  duration: number;
  ageRating: string;
  director: string;
  releaseDate: string;
  poster: string | undefined;
  trailerUrl: string | undefined;
  language: string | undefined;
  genres: string[];
  actors: { id: number; name: string }[];
};

// Replace any with unknown and cast it... maybe
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapV1(raw: Record<string, any>): MovieDetail {
  return {
    id: raw.id,
    title: raw.title ?? 'Untitled',
    tagline: raw.description_short ?? '',
    description: raw.description ?? '',
    duration: raw.duration_minutes ?? 0,
    ageRating: String(raw.age_rating ?? ''),
    director: raw.director ?? '',
    releaseDate: raw.release_date ?? '',
    poster: raw.poster_url ?? undefined,
    trailerUrl: raw.trailer_url ?? undefined,
    language: raw.language ? String(raw.language) : undefined,
    genres: [],
    actors: [],
  };
}

type MovieDetailsResult = {
  movie: MovieDetail | undefined;
  isLoading: boolean;
  isError: boolean;
};

function useMovieDetailsV1(_id?: number): MovieDetailsResult {
  const loaderData = useLoaderData() as Record<string, unknown> | undefined;
  const movie = loaderData ? mapV1(loaderData) : undefined;
  return { movie, isLoading: false, isError: false };
}

function useMovieDetailsV2(id: number): MovieDetailsResult {
  const v2Query = useMovie(id);
  const v2 = v2Query.data?.data;

  const movie: MovieDetail | undefined = v2
    ? {
        id: v2.id,
        title: v2.title,
        tagline: v2.tagline,
        description: v2.description,
        duration: v2.duration,
        ageRating: v2.ageRating,
        director: v2.director,
        releaseDate: v2.releaseDate,
        poster: v2.posterUrl ?? undefined,
        trailerUrl: v2.trailerUrl ?? undefined,
        language: v2.language?.code ?? undefined,
        genres: v2.genres ?? [],
        actors: v2.actors?.map((a) => ({ id: a.id, name: a.name })) ?? [],
      }
    : undefined;

  return { movie, isLoading: v2Query.isLoading, isError: v2Query.isError };
}

export const useMovieDetails = IS_V1 ? useMovieDetailsV1 : useMovieDetailsV2;
