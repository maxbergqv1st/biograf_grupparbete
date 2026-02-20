import type Movie from '@/interfaces/Movie';

interface MoveCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MoveCardProps) {
  return (
    <div>
      <h2>{movie.title}</h2>
      <p>{movie.description}</p>
    </div>
  );
}
