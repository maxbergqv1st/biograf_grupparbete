import { useNavigate } from 'react-router-dom';

type MoviePosterProps = {
  id: number;
  title: string;
  director: string;
  description?: string;
  poster?: string | null;
};

export default function MoviePoster({
  id,
  title,
  director,
  description,
  poster,
}: MoviePosterProps) {
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate('/movies/' + id)}
      className="group relative mx-auto w-full max-w-xs cursor-pointer overflow-hidden rounded-xl border border-zinc-800 shadow-md transition-transform hover:scale-[1.02]"
    >
      <div className="relative aspect-[2/3] w-full">
        {poster ? (
          <img
            src={poster}
            alt={`Poster för ${title}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-72 w-full items-center justify-center bg-zinc-700">
            <p className="text-sm text-zinc-200">Ingen bild ännu</p>
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-end bg-black/60 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-zinc-200">{director}</p>
          {description ? (
            <p className="mt-1 line-clamp-2 text-sm text-zinc-300">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
