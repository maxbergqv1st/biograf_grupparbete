export interface Movie {
  id: number;
  title: string;
  release_date: string;
  genre: string;
  director: string;
  description: string;
  description_short: string;
  poster: string | null;
  language: number;
  duration_minutes: number;
  age_rating: number;
}
