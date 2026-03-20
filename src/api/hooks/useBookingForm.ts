import { useState } from 'react';

export type BookingSeat = {
  seatId: number;
  seatLabel: string;       // The seat name in the hall, not unique id
  priceCategorySeatId: number;
  category: string;        // Available categories for now are "Adult", "Child", "Senior". Translator available in BookingPage for display purposes.
  discountModifier: number;
  finalPrice: number;      // basePrice from screenings * discountModifier from seat category
};

export type BookingPayload = {
  email: string;
  screeningId: number;
  totalPrice: number;
  userId?: number;
  reservationSessionId?: string;
  seats: BookingSeat[];
};

export function useBookingForm() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  async function submit(payload: BookingPayload) {
    setError('');
    setStatus('');
    if (submitting) return;
    setSubmitting(true);

    const res = await fetch('/api/v2/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: payload.email,
        screeningId: payload.screeningId,
        total_price: payload.totalPrice,
        user_id: payload.userId ?? null,
        reservationSessionId: payload.reservationSessionId ?? null,
        seats: payload.seats.map(s => ({
          seatId: s.seatId,
          priceCategorySeatId: s.priceCategorySeatId,
          finalPrice: s.finalPrice
        }))
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data?.error ?? 'Failed to create booking');
      setSubmitting(false);
      return;
    }

    setStatus('Bekräftad');
    setSubmitting(false);
    return data;
  }

  return { submit, submitting, status, error };
}
