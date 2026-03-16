import { useMemo, useState } from 'react';
import { InsertScreeningFormView, type ScreeningFormValues } from './InsertScreeningFormView';
import { useMovies } from '@/api/hooks/useMovies';

export default function InsertScreeningForm() {
  const { data, isLoading, isError } = useMovies();
  const [values, setValues] = useState<ScreeningFormValues>({
    movie_id: '',
    hall_id: '',
    start_time: '',
    end_time: '',
    base_price: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  function onChange(name: string, value: string | number) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  const movieOptions = useMemo(
    () =>
      (data?.data ?? [])
        .filter((movie) => movie.id != null)
        .map((movie) => ({
          value: String(movie.id),
          label: movie.title ?? 'Untitled',
        })),
    [data],
  );

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('');
    setError('');

    if (!values.movie_id || !values.hall_id) {
      setError('Fyll i film-id och salong-id.');
      return;
    }
    if (!values.start_time || !values.end_time) {
      setError('Fyll i start- och sluttid.');
      return;
    }

    const payload = {
      movie_id: Number(values.movie_id),
      hall_id: Number(values.hall_id),
      start_time: values.start_time,
      end_time: values.end_time,
      base_price: Number(values.base_price),
    };

    setSubmitting(true);
    // TODO: koppla till API när det finns
    setSubmitting(false);
    setStatus('Sparat (demo).');
    void payload;
  }

  return (
    <InsertScreeningFormView
      values={values}
      movieOptions={movieOptions}
      moviesLoading={isLoading}
      moviesError={isError}
      onChange={onChange}
      onSubmit={onSubmit}
      submitting={submitting}
      status={status}
      error={error}
    />
  );
}
