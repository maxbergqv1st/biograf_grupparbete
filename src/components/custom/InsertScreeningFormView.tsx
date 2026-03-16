import React from 'react';
import BiografInput from './BiografInput';
import BiografButton from './BiografButton';
import BiografSelect from './BiografSelect';

export type ScreeningFormValues = {
  movie_id: string;
  hall_id: string;
  start_time: string;
  end_time: string;
  base_price: string;
};

type MovieOption = {
  value: string;
  label: string;
};

type InsertScreeningFormProps = {
  values: ScreeningFormValues;
  movieOptions: MovieOption[];
  moviesLoading: boolean;
  moviesError: boolean;
  onChange: (name: string, value: string | number) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  status: string;
  error: string;
};


export function InsertScreeningFormView({
  values,
  movieOptions,
  moviesLoading,
  moviesError,
  onChange,
  onSubmit,
  submitting,
  status,
  error,
}: InsertScreeningFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="grid max-w-520px gap-3 p-6"
    >
      <h1 className="text-2xl font-bold text-[#F3EEE4]">Lägg till en film visning</h1>

      {moviesLoading && (
        <p className="text-sm text-[color:var(--color-gold-dark)]">Laddar filmer...</p>
      )}
      {moviesError && <p className="text-sm text-red-500">Kunde inte hämta filmer</p>}

      <BiografSelect
        value={values.movie_id}
        onValueChange={(value) => onChange('movie_id', value)}
        placeholder="Välj film"
        options={movieOptions}
      />

      <BiografInput
        type="number"
        min={1}
        value={values.hall_id}
        onChange={(e) => onChange('hall_id', e.target.value)}
        placeholder="Salong-id"
        required
      />

      <BiografInput
        type="datetime-local"
        value={values.start_time}
        onChange={(e) => onChange('start_time', e.target.value)}
        placeholder="Starttid"
        required
      />

      <BiografInput
        type="datetime-local"
        value={values.end_time}
        onChange={(e) => onChange('end_time', e.target.value)}
        placeholder="Sluttid"
        required
      />

      <BiografInput
        type="number"
        min={0}
        step="0.01"
        value={values.base_price}
        onChange={(e) => onChange('base_price', e.target.value)}
        placeholder="Baspris"
        required
      />

      <BiografButton type="submit" disabled={submitting}>
        {submitting ? 'Sparar...' : 'Spara'}
      </BiografButton>

      {status && <p className="text-sm text-green-500">{status}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  );
}
