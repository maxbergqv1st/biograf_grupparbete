import React from 'react';
import BiografInput from './BiografInput';
import BiografButton from './BiografButton';

export type ScreeningFormValues = {
  movie_id: number;
  hall_id: number;
  start_time: string;
  end_time: string;
  base_price: number;
};

type InsertScreeningFormProps = {
  values: ScreeningFormValues;
  onChange: (name: string, value: string | number) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  status: string;
  error: string;
};


export function InsertScreeningFormView({
  values,
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

      <BiografInput
        type="number"
        min={1}
        value={values.movie_id}
        onChange={(e) => onChange('movie_id', Number(e.target.value))}
        placeholder="Film-id"
        required
      />

      <BiografInput
        type="number"
        min={1}
        value={values.hall_id}
        onChange={(e) => onChange('hall_id', Number(e.target.value))}
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
        onChange={(e) => onChange('base_price', Number(e.target.value))}
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
