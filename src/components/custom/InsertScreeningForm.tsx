import { useState } from 'react';
import { InsertScreeningFormView, type ScreeningFormValues } from './InsertScreeningFormView';

export default function InsertScreeningForm() {
  const [values, setValues] = useState<ScreeningFormValues>({
    movie_id: 0,
    hall_id: 0,
    start_time: '',
    end_time: '',
    base_price: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  function onChange(name: string, value: string | number) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

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

    setSubmitting(true);
    // TODO: koppla till API när det finns
    setSubmitting(false);
    setStatus('Sparat (demo).');
  }

  return (
    <InsertScreeningFormView
      values={values}
      onChange={onChange}
      onSubmit={onSubmit}
      submitting={submitting}
      status={status}
      error={error}
    />
  );
}
