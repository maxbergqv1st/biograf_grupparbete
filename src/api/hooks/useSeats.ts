import { useQuery } from '@tanstack/react-query';
import { seatsService } from '../services/seats';

export const useHallConfig = (hallId: number) => 
  useQuery({
    queryKey: ['hall-config', hallId],
    queryFn: () => seatsService.getHallConfig(hallId),
    enabled: hallId > 0,
  });

export const useSeatStatuses = (screeningId: number) => 
  useQuery({ 
    queryKey: ['seat-statuses', screeningId], 
    queryFn: () => seatsService.getSeatStatuses(screeningId),
    enabled: screeningId > 0,
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });
