import { apiClient } from '../apiClient';

export async function cancelBooking(bookingReference: string) {
  return apiClient.post('/bookings/cancel', { bookingReference });
}
