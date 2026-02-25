import type Movie from '@/interfaces/Movie';
import MovieList from '@/parts/MovieList';
import { useLoaderData } from 'react-router-dom';

import moviesLoader from '@/utils/movieLoader';

DevPage.route = {
  path: '/dev',
  menuLabel: 'dev',
  index: 2,
  loader: moviesLoader,
};

export default function DevPage() {
  const movies = useLoaderData() as Movie[];
  return <MovieList movies={movies} />;
}
