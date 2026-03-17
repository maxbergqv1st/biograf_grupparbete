import { useState } from 'react';
import { useMovies } from '@/api/hooks/useMovies';
import { useQueryClient } from '@tanstack/react-query';
import { movieKeys } from '@/api/hooks/useMovies';
import BiografButton from './BiografButton';
import BiografInput from './BiografInput';
import BiografSelect from './BiografSelect';

export default function PosterUpload() {
  const { data, isLoading, isError, refetch } = useMovies();
  const queryClient = useQueryClient();
  const [movieId, setMovieId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setStatus('');
    if (submitting) return;
    if (!movieId) {
      setError('Välj en film');
      return;
    }
    if (!file) {
      setError('Välj en bildfil');
      return;
    }

    setSubmitting(true);
    const fd = new FormData();
    fd.append('file', file);
    
    const id = Number(movieId);
    const res = await fetch(`/api/v2/movies/${id}/poster`, {
      method: 'POST',
      body: fd,
    });
    const payload = await res.json();
    if (!res.ok) {
      setError(payload?.error ?? 'Kunde inte ladda upp');
      setSubmitting(false);
      return;
    }

    setStatus('Poster uppdaterad');
    setSubmitting(false);
    refetch();
    await queryClient.invalidateQueries({ queryKey: movieKeys.all() });
    await queryClient.invalidateQueries({
      queryKey: movieKeys.detail(Number(movieId)),
    });
  }

  return (
    <form onSubmit={submit} className="grid max-w-520px gap-3 p-6">
      <h1 className="text-2xl font-bold text-[#F3EEE4]">Byt poster</h1>
      {isLoading && (
        <p className="text-sm text--color-gold-dark">
          Laddar filmer...
        </p>
      )}
      {isError && <p className="text-sm text-red-500">Kunde inte hämta filmer</p>}

      <BiografSelect
        value={movieId}
        onValueChange={setMovieId}
        placeholder="Välj film"
        options={(data?.data ?? [])
          .filter((movie) => movie.id != null)
          .map((movie) => ({
            value: String(movie.id),
            label: `${movie.title ?? 'Untitled'} (id: ${movie.id})`,
          }))}
      />

      <BiografInput
        type="file"
        accept="image/*"
        onChange={(e) => setFile((e.target as HTMLInputElement).files?.[0] ?? null)}
      />

      <BiografButton type="submit" disabled={submitting}>
        {submitting ? 'Laddar upp...' : 'Ladda upp poster'}
      </BiografButton>

      {status && <p className="text-sm text-green-500">{status}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  );
}
