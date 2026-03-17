import { useQuery } from '@tanstack/react-query';
import { seatsService } from '../services/seats';

export const useHallConfig = (hallId: number) => 
  useQuery({ queryKey: ['hall-config', hallId], queryFn: () => seatsService.getHallConfig(hallId) });

export const useSeatStatuses = (screeningId: number) => 
  useQuery({ 
    queryKey: ['seat-statuses', screeningId], 
    queryFn: () => seatsService.getSeatStatuses(screeningId),
    refetchInterval: 5000 
  });
