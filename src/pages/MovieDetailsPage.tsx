import { useLoaderData, useParams } from 'react-router-dom';
import type Movie from '@/interfaces/Movie';
import moviesLoader from '@/utils/movieLoader';

MovieDetailsPage.route = {
  path: '/movies/:id',
  parent: '/',
  loader: moviesLoader,
};

export default function MovieDetailsPage() {
  const { id } = useParams();
  const movies = useLoaderData() as Movie[];
  const movie = movies.find((m) => String(m.id) === id);

  if (!movie) return <h1>Movie not found</h1>;

  return (
    <article>
      <h1>{movie.title}</h1>
      <p>{movie.description_short}</p>
      <p>{movie.director}</p>
      {movie.poster ? <img src={movie.poster} alt={movie.title} /> : null}
    </article>
  );
}

