import { useState } from 'react';
import { useMovies } from '@/api/hooks/useMovies';

export default function PosterUpload() {
  const { data, isLoading, isError, refetch } = useMovies();
  const [movieId, setMovieId] = useState<number | ''>('');
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

    const res = await fetch(`/api/movies/${movieId}/poster`, {
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
  }

  return (
    <form onSubmit={submit} style={{ padding: 24, maxWidth: 520 }}>
      <h2>Byt poster</h2>
      {isLoading && <p>Laddar filmer...</p>}
      {isError && <p style={{ color: 'crimson' }}>Kunde inte hämta filmer</p>}

      <select
        value={movieId}
        onChange={(e) => setMovieId(e.target.value ? Number(e.target.value) : '')}
        disabled={isLoading}
        style={{ display: 'block', marginBottom: 12, width: '100%' }}
      >
        <option value="">Välj film</option>
        {data?.data.map((movie) => (
          <option key={movie.id} value={movie.id ?? ''}>
            {movie.title ?? 'Untitled'} (id: {movie.id})
          </option>
        ))}
      </select>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />

      <button type="submit" disabled={submitting} style={{ display: 'block', marginTop: 12 }}>
        {submitting ? 'Laddar upp...' : 'Ladda upp poster'}
      </button>

      {status && <p style={{ color: 'green' }}>{status}</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
    </form>
  );
}
