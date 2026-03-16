import { useState } from 'react';
import { MovieFormView } from './MovieFormView';
import { useMovieForm } from '../../hooks/useMovieForm';

export default function MovieForm() {
  const [values, setValues] = useState({
    title: '',
    originalTitle: '',
    tagline: '',
    description: '',
    durationMinutes: 120,
    ageRating: '11' as 'B' | '7' | '11' | '15',
    director: '',
    releaseDate: '',
    language: 1,
    trailerUrl: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const { submit, submitting, status, error } = useMovieForm();

  function onChange(name: string, value: string | number) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    submit({ ...values, file });
  }

  return (
    <MovieFormView
      values={values}
      file={file}
      onChange={onChange}
      onFileChange={setFile}
      onSubmit={onSubmit}
      submitting={submitting}
      status={status}
      error={error}
    />
  );
}
