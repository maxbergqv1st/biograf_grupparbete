import type Movie from '@/interfaces/Movie';

import BiografCard from '@/components/custom/BiografCard';

type Props = {
  movies: Movie[];
};

export default function MovieList({ movies }: Props) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {movies.map((movie) => (
        <BiografCard
          key={movie.id}
          title={movie.title}
          description={movie.director}
        />
      ))}
    </section>
  );
}
