import type { SeatStatus } from '@/api/services/seats';
import BiografSelect from '@/components/custom/BiografSelect';
import {
  calculateTicketPrice,
  type PriceCategory,
} from '@/components/seats/SeatPricing';
import { useTranslation } from 'react-i18next';

type SeatSelectionPanelProps = {
  selectedSeats: number[];
  seatStatuses: SeatStatus[];
  seatCategories: Record<number, PriceCategory | undefined>;
  childTicketsAllowed: boolean;
  onCategoryChange: (seatId: number, category: PriceCategory) => void;
};

export default function SeatSelectionPanel({
  selectedSeats,
  seatStatuses,
  seatCategories,
  childTicketsAllowed,
  onCategoryChange,
}: SeatSelectionPanelProps) {
  const { t } = useTranslation('seats');

  return (
    <div className="mt-8 w-full rounded-2xl bg-[#1E1E1E] p-4 shadow-lg sm:max-w-4xl sm:p-6">
      <h2 className="text-lg font-semibold text-[#b69852]">
        {t('selectedTickets')}
      </h2>

      {selectedSeats.length === 0 ? (
        <p className="mt-3 text-sm text-gray-300">{t('selectSeatHelp')}</p>
      ) : (
        <div className="mt-4 space-y-3">
          {selectedSeats.map((seatId) => {
            const seat = seatStatuses.find((item) => item.seatId === seatId);
            if (!seat) return null;

            return (
              <div
                key={seatId}
                className="grid gap-3 rounded-xl border border-[#333] p-4 md:grid-cols-[1fr_220px]"
              >
                <div>
                  <p className="font-medium">
                    {t('seat')} {seat.rowName}
                    {seat.numberInRow}
                  </p>
                  <p className="text-sm text-gray-300">
                    {t('seatId')}: {seat.seatId}
                  </p>
                  <p className="text-sm text-gray-300">
                    {t('price')}: {' '}
                    {seatCategories[seatId]
                      ? `${calculateTicketPrice(seatCategories[seatId] as PriceCategory)} kr`
                      : t('selectTicketType')}
                  </p>
                </div>

                <BiografSelect
                  value={seatCategories[seatId] ?? ''}
                  onValueChange={(value) =>
                    onCategoryChange(seatId, value as PriceCategory)
                  }
                  options={[
                    {
                      value: 'Adult',
                      label: `${t('adult')} - ${calculateTicketPrice('Adult')} kr`,
                    },
                    ...(childTicketsAllowed
                      ? [
                          {
                            value: 'Child',
                            label: `${t('child')} - ${calculateTicketPrice('Child')} kr`,
                          },
                        ]
                      : []),
                    {
                      value: 'Senior',
                      label: `${t('senior')} - ${calculateTicketPrice('Senior')} kr`,
                    },
                  ]}
                  placeholder={t('selectTicketType')}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
