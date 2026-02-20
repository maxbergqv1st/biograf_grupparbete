import type Movie from '@/interfaces/Movie';
import { useLoaderData } from 'react-router-dom';

import MovieCard from '@/components/custom/MovieCard';

import moviesLoader from '@/utils/moviesLoader';

dev.route = {
  path: '/dev',
  menuLabel: 'dev',
  index: 2,
  loader: moviesLoader,
};

export default function dev() {
  const { movies } = useLoaderData();

  return (
    <div className="movieCard">
      {movies.map((movie: Movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
