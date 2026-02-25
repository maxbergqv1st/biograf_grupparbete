import type Movie from '@/interfaces/Movie';
import { useLoaderData } from 'react-router-dom';

import BiografCard from '@/components/custom/BiografCard';

export default function MovieList() {
  const movies = useLoaderData() as Movie[];

  return (
    <section className="grid gap-4 md:grid-cols-2">
      {movies.map((movie) => (
        <BiografCard
          key={movie.id}
          title={movie.title}
          description={movie.director}
        ></BiografCard>
      ))}
    </section>
  );
}
