import type { AxiosResponse } from 'axios';
import { apiClient } from '../apiClient';
import type { BookingDto } from '../generated/models';

export async function cancelBooking(bookingReference: string) {
  return apiClient.post('/bookings/cancel', { bookingReference });
}

export const getMyBookings = (): Promise<AxiosResponse<BookingDto[]>> => {
  return apiClient.get('/bookings/my-bookings');
};
