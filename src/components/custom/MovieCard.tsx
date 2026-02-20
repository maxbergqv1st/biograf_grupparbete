import type Movie from '@/interfaces/Movie';

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div>
      <h2>{movie.title}</h2>
    </div>
  );
}
