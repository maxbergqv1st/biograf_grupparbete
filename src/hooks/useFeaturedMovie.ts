import { useCallback, useEffect, useRef, useState } from 'react';

export function useFeaturedMovie<T>(items: T[], intervalMs = 15_000): T | null {
  const [index, setIndex] = useState(0);
  const indexRef = useRef(index);
  indexRef.current = index;

  const pickRandom = useCallback(() => {
    if (items.length <= 1) return;
    let next: number;
    do {
      next = Math.floor(Math.random() * items.length);
    } while (next === indexRef.current);
    setIndex(next);
  }, [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(pickRandom, intervalMs);
    return () => clearInterval(id);
  }, [items.length, pickRandom, intervalMs]);

  return items[index] ?? items[0] ?? null;
}
