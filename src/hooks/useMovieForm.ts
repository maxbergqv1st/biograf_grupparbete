import { useState } from 'react';

type SubmitPayload = {
  title: string;
  originalTitle: string;
  tagline: string;
  description: string;
  durationMinutes: number;
  ageRating: 'B' | '7' | '11' | '15';
  director: string;
  releaseDate: string;
  language: number;
  trailerUrl: string;
  file: File | null;
};

export function useMovieForm() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  async function submit(payload: SubmitPayload) {
    setError('');
    setStatus('');
    if (submitting) return;
    setSubmitting(true);

    const createRes = await fetch('/api/v2/movies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: payload.title,
        original_title: payload.originalTitle || null,
        tagline: payload.tagline,
        description: payload.description,
        duration: payload.durationMinutes,
        age_rating: payload.ageRating,
        director: payload.director,
        release_date: payload.releaseDate,
        language_id: payload.language,
        trailer_url: payload.trailerUrl,
      }),
    });
    const created = await createRes.json();
    if (!createRes.ok) {
      setError(created?.error ?? 'Failed to create movies');
      setSubmitting(false);
      return;
    }

    const movieId = created?.insertId;
    if (!movieId) {
      setError('Missing insertId from /api/v2/movies');
      setSubmitting(false);
      return;
    }

    if (payload.file) {
      const fd = new FormData();
      fd.append('file', payload.file);
      fd.append('folder', 'filmer');
      const uploadRes = await fetch(`/api/v2/movies/${movieId}/poster`, {
        method: 'POST',
        body: fd,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        setError(uploadData?.error ?? 'Failed to upload poster');
        setSubmitting(false);
        return;
      }
    }

    setStatus('Sparad');
    setSubmitting(false);
  }

  return { submit, submitting, status, error };
}
