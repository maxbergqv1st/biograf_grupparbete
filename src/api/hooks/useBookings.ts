import { useMutation, useQuery } from '@tanstack/react-query';

import { cancelBooking, getMyBookings } from '../services/bookings';

export const bookingKeys = {
  myBookings: () => ['screenings', 'my-bookings'] as const,

};

export function useCancelBooking() {
  return useMutation({
    mutationFn: (bookingReference: string) => cancelBooking(bookingReference),
  });
}

export function useMyBookings() {
  const query = useQuery({
    queryKey: bookingKeys.myBookings(),
    queryFn: () => getMyBookings(),
  });
  return query;
}