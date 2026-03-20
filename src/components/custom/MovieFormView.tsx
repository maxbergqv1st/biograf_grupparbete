import React from 'react';

import BiografButton from './BiografButton';
import BiografDatePicker from './BiografDatePicker';
import BiografInput from './BiografInput';
import BiografSelect from './BiografSelect';

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

const ageRatingOptions = [
  { value: 'B', label: 'B' },
  { value: '7', label: '7' },
  { value: '11', label: '11' },
  { value: '15', label: '15' },
];

export function MovieFormView({
  values,
  onChange,
  onFileChange,
  onSubmit,
  submitting,
  status,
  error,
}: MovieFormViewProps) {
  return (
    <form onSubmit={onSubmit} className="max-w-520px grid gap-3 p-6">
      <h1 className="text-2xl font-bold text-[#F3EEE4]">Lägg till filmer</h1>
      <BiografInput
        value={values.title}
        onChange={(e) => onChange('title', e.target.value)}
        placeholder="Titel"
        required
      />
      <BiografInput
        value={values.originalTitle}
        onChange={(e) => onChange('originalTitle', e.target.value)}
        placeholder="Originaltitel (valfritt)"
      />
      <BiografInput
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
        className="bg--card-foreground text--color-gold border--border placeholder:text--muted focus-visible:ring--gold min-h-80px rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
      />
      <BiografInput
        type="number"
        min={1}
        value={values.durationMinutes}
        onChange={(e) => onChange('durationMinutes', Number(e.target.value))}
        placeholder="Längd i minuter"
        required
      />
      <BiografSelect
        value={values.ageRating}
        onValueChange={(value) => onChange('ageRating', value)}
        options={ageRatingOptions}
        placeholder="Åldersgräns"
      />
      <BiografInput
        value={values.director}
        onChange={(e) => onChange('director', e.target.value)}
        placeholder="Regissör"
        required
      />
      <BiografDatePicker
        value={values.releaseDate}
        onValueChange={(value) => onChange('releaseDate', value)}
        placeholder="Välj datum"
      />
      <BiografInput
        type="number"
        min={1}
        value={values.language}
        onChange={(e) => onChange('language', Number(e.target.value))}
        placeholder="Språk-id"
        required
      />
      <BiografInput
        value={values.trailerUrl}
        onChange={(e) => onChange('trailerUrl', e.target.value)}
        placeholder="Trailer URL"
        required
      />
      <BiografInput
        type="file"
        accept="image/*"
        onChange={(e) =>
          onFileChange((e.target as HTMLInputElement).files?.[0] ?? null)
        }
      />
      <BiografButton type="submit" disabled={submitting}>
        {submitting ? 'Sparar...' : 'Spara'}
      </BiografButton>
      {status && <p className="text-sm text-green-500">{status}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  );
}
