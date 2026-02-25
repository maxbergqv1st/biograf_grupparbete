import type Movie from '@/interfaces/Movie';
import { useLoaderData } from 'react-router-dom';

import MovieCard from '@/components/custom/MovieCard';

import moviesLoader from '@/utils/movieLoader';

DevPage.route = {
  path: '/dev',
  menuLabel: 'dev',
  index: 2,
  loader: moviesLoader,
};

export default function DevPage() {
  const movies = useLoaderData<Movie[]>();

  return (
    <>
      <h1>Max och Dusans Dev Page</h1>
      <MovieCard movie={movies} />
    </>
  );
}
