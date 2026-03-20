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
  rowName: string;
  numberInRow: number;
}

export interface ReserveSeatsRequest {
  screeningId: number;
  sessionId: string;
  seatIds: number[];
}

export interface ReleaseSeatsRequest {
  screeningId: number;
  sessionId: string;
}

export const seatsService = {
  getHallConfig: (hallId: number): Promise<HallRowConfig[]> =>
    apiClient.get(`/seats/hall/${hallId}`).then((r) => r.data),

  getSeatStatuses: (screeningId: number): Promise<SeatStatus[]> =>
    apiClient.get(`/seats/screening/${screeningId}`).then((r) => r.data),

  reserveSeats: (payload: ReserveSeatsRequest): Promise<void> =>
    apiClient.post('/seats/reserve', payload).then(() => undefined),

  releaseSeats: (payload: ReleaseSeatsRequest): Promise<void> =>
    apiClient.post('/seats/release', payload).then(() => undefined),
};
