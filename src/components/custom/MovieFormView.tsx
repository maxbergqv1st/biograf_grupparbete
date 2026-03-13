import React from 'react';

type FormValues = {
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
};

type MovieFormViewProps = {
  values: FormValues;
  file: File | null;
  onChange: (name: string, value: string | number) => void;
  onFileChange: (file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  status: string;
  error: string;
};

export function MovieFormView({
  values,
  file,
  onChange,
  onFileChange,
  onSubmit,
  submitting,
  status,
  error,
}: MovieFormViewProps) {
  return (
    <form
      onSubmit={onSubmit}
      style={{
        padding: 24,
        display: 'grid',
        gridTemplateColumns: '1fr',
        rowGap: 12,
        maxWidth: 520,
      }}
    >
      <h1>Lägg till filmer</h1>
      <input
        value={values.title}
        onChange={(e) => onChange('title', e.target.value)}
        placeholder="Titel"
        required
      />
      <input
        value={values.originalTitle}
        onChange={(e) => onChange('originalTitle', e.target.value)}
        placeholder="Originaltitel (valfritt)"
      />
      <input
        value={values.tagline}
        onChange={(e) => onChange('tagline', e.target.value)}
        placeholder="Tagline / kort beskrivning"
        required
      />
      <textarea
        value={values.description}
        onChange={(e) => onChange('description', e.target.value)}
        placeholder="Beskrivning"
        required
      />
      <input
        type="number"
        min={1}
        value={values.durationMinutes}
        onChange={(e) => onChange('durationMinutes', Number(e.target.value))}
        placeholder="Längd i minuter"
        required
      />
      <select
        value={values.ageRating}
        onChange={(e) => onChange('ageRating', e.target.value)}
        required
      >
        <option value="B">B</option>
        <option value="7">7</option>
        <option value="11">11</option>
        <option value="15">15</option>
      </select>
      <input
        value={values.director}
        onChange={(e) => onChange('director', e.target.value)}
        placeholder="Regissör"
        required
      />
      <input
        type="date"
        value={values.releaseDate}
        onChange={(e) => onChange('releaseDate', e.target.value)}
        required
      />
      <input
        type="number"
        min={1}
        value={values.language}
        onChange={(e) => onChange('language', Number(e.target.value))}
        placeholder="Språk-id"
        required
      />
      <input
        value={values.trailerUrl}
        onChange={(e) => onChange('trailerUrl', e.target.value)}
        placeholder="Trailer URL"
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
      />
      <button type="submit" disabled={submitting}>
        {submitting ? 'Sparar...' : 'Save'}
      </button>
      {status && <p style={{ color: 'green' }}>{status}</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
    </form>
  );
}
