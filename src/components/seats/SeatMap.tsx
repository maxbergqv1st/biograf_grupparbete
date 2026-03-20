import type { HallRowConfig, SeatStatus } from '@/api/services/seats';
import { Seat, type SeatVariants } from '@/components/Seat';
import { useTranslation } from 'react-i18next';

type SeatMapProps = {
  hallConfig: HallRowConfig[];
  maxSeatsInRow: number;
  seatStatusMap: Map<string, SeatStatus>;
  selectedSeats: number[];
  onToggleSeat: (seatId: number) => void;
  childTicketsAllowed: boolean;
};

export default function SeatMap({
  hallConfig,
  maxSeatsInRow,
  seatStatusMap,
  selectedSeats,
  onToggleSeat,
  childTicketsAllowed,
}: SeatMapProps) {
  const { t } = useTranslation('seats');

  return (
    <div className="w-full rounded-2xl bg-[#111] p-3 shadow-lg sm:max-w-5xl sm:p-4 md:p-8">
      <div className="mb-6 text-center text-sm tracking-[0.35em] text-[#b69852] uppercase">
        {t('screen')}
      </div>

      <div className="px-1 sm:px-2">
        <div className="space-y-2 sm:space-y-3">
          {hallConfig.map((row) => (
            <div
              key={row.name}
              className="grid grid-cols-[auto_1fr] items-center gap-2 sm:gap-3"
            >
              <span className="flex w-5 items-center justify-center text-xs font-semibold sm:w-8 sm:text-sm">
                {row.name}
              </span>
              <div
                className="mx-auto grid items-center justify-center gap-1 sm:gap-2"
                style={{
                  width: `${((row.numberOfSeats + 1) / (maxSeatsInRow + 1)) * 100}%`,
                  gridTemplateColumns: `repeat(${row.numberOfSeats}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({ length: row.numberOfSeats }, (_, index) => {
                  const numberInRow = index + 1;
                  const seatStatus = seatStatusMap.get(
                    `${row.name}-${numberInRow}`,
                  );

                  if (!seatStatus) {
                    return (
                      <div
                        key={`${row.name}-${numberInRow}`}
                        className="h-7 min-w-0 rounded border border-dashed opacity-30 sm:h-8 lg:h-10"
                      />
                    );
                  }

                  return (
                    <Seat
                      key={seatStatus.seatId}
                      seatId={seatStatus.seatId}
                      label={seatStatus.numberInRow}
                      status={seatStatus.status as SeatVariants}
                      selected={selectedSeats.includes(seatStatus.seatId)}
                      onToggle={onToggleSeat}
                      className="h-7 min-w-0 w-full px-0 text-[11px] sm:h-8 sm:text-xs lg:h-10 lg:text-sm"
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!childTicketsAllowed ? (
        <p className="mt-4 text-center text-sm text-[#b69852]">
          {t('childNotAllowed')}
        </p>
      ) : null}
    </div>
  );
}
