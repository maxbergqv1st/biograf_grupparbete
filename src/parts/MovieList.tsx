import MoviePoster from '@/components/custom/MoviePoster';
import type Movie from '@/interfaces/Movie';

type Props = {
  movies: Movie[];
};

export default function MovieList({ movies }: Props) {
  return (
    <section className="mx-auto grid w-full max-w-7xl grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {movies.map((movie) => (
        <MoviePoster
          key={movie.id}
          id={movie.id}
          title={movie.title}
          director={movie.director}
          description={movie.description_short}
          poster={movie.poster}
        />
      ))}
    </section>
  );
}