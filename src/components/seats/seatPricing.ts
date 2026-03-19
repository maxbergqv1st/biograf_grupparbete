export const BASE_TICKET_PRICE = 140;

export const PRICE_CATEGORIES = {
  Adult: {
    id: 1,
    discount: 1.0,
    label: 'Vuxen',
  },
  Child: {
    id: 2,
    discount: 0.7,
    label: 'Barn',
  },
  Senior: {
    id: 3,
    discount: 0.8,
    label: 'Pensionär',
  },
} as const;

export type PriceCategory = keyof typeof PRICE_CATEGORIES;

export function calculateTicketPrice(category: PriceCategory): number {
  const { discount } = PRICE_CATEGORIES[category];
  return BASE_TICKET_PRICE * discount;
}

export function generateReservationSessionId(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).slice(2, 11);

  return `reservation-${timestamp}-${randomPart}`;
}
