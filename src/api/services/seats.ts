import { apiClient } from '../apiClient';

export interface HallRowConfig {
  hallId: number;
  name: string;
  numberOfSeats: number;
}

export interface SeatStatus {
  seatId: number;
  screeningId: number;
  status: string;
}

export const seatsService = {
  getHallConfig: (hallId: number): Promise<HallRowConfig[]> => apiClient.get(`/api/v2/seats/hall/${hallId}`).then(r => r.data),
  getSeatStatuses: (screeningId: number): Promise<SeatStatus[]> => apiClient.get(`/api/v2/seats/screening/${screeningId}`).then(r => r.data)
};
