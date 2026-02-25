import type Movie from '@/interfaces/Movie';
import { useLoaderData } from 'react-router-dom';

import BiografCard from '@/components/custom/BiografCard';

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
    <section className="grid gap-4 md:grid-cols-2">
      {movies.map((movie) => (
        <BiografCard
          key={movie.id}
          title={movie.title}
          description={`Director: ${movie.director}`}
        >
          <p>{movie.description_short}</p>
        </BiografCard>
      ))}
    </section>
  );
}
