import { useMutation } from '@tanstack/react-query';

import { cancelBooking } from '../services/bookings';

export function useCancelBooking() {
  return useMutation({
    mutationFn: (bookingReference: string) => cancelBooking(bookingReference),
  });
}
