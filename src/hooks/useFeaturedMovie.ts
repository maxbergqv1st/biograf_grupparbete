import { useCallback, useEffect, useRef, useState } from 'react';

export type FeaturedMovie = {
  id: number;
  title: string;
  poster?: string;
  trailerUrl?: string;
  language?: string;
  ageRating?: string;
  genres?: string[];
};
export function useFeaturedMovie(
  featuredMovies: FeaturedMovie[],
  intervalMs = 15_000,
) {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const indexRef = useRef(featuredIndex);
  indexRef.current = featuredIndex;

  const pickRandom = useCallback(() => {
    if (featuredMovies.length <= 1) return;
    let next: number;
    do {
      next = Math.floor(Math.random() * featuredMovies.length);
    } while (next === indexRef.current);
    setFeaturedIndex(next);
  }, [featuredMovies.length]);

  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const id = setInterval(pickRandom, intervalMs);
    return () => clearInterval(id);
  }, [featuredMovies.length, pickRandom, intervalMs]);

  return featuredMovies[featuredIndex] ?? featuredMovies[0] ?? null;
}
