import { getAllHalls, getHall } from '@/api/services/halls';
import { useQuery } from '@tanstack/react-query';

export const hallKeys = {
  all: () => ['halls'] as const,
  detail: (id: number) => ['halls', id] as const,
};

export function useHalls() {
  return useQuery({
    queryKey: hallKeys.all(),
    queryFn: () => getAllHalls(),
  });
}

export function useHall(id: number) {
  return useQuery({
    queryKey: hallKeys.detail(id),
    queryFn: () => getHall(id),
  });
}