import type { AxiosResponse } from 'axios';

import { apiClient } from '../apiClient';
import type { ScreeningDto } from '../generated/models';

export interface BookingDto {
id: number;
email: string;
screeningId: number;
screeningDate: string;
totalPrice: number;
status: string;
reference: string;
userId: number;
}

export const getMyBookings = (): Promise<AxiosResponse<BookingDto[]>> => {
  return apiClient.get('/screenings/my-bookings');
};


export const getScreening = (
  id: number,
): Promise<AxiosResponse<ScreeningDto>> => {
  return apiClient.get(`/screenings/${id}`);
};

export const getScreeningsByMovieId = (
  movieId: number,
): Promise<AxiosResponse<ScreeningDto[]>> => {
  return apiClient.get(`/screenings/by-movie-id/${movieId}`);
};
