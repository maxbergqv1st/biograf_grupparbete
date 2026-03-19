import { useTranslation } from 'react-i18next';

type SeatScreeningInfoProps = {
  movieTitle: string;
  hallName?: string | null;
  screeningDate?: string | null;
  screeningTime?: string | null;
  totalPrice: number;
  ageRating: number;
};

export default function SeatScreeningInfo({
  movieTitle,
  hallName,
  screeningDate,
  screeningTime,
  totalPrice,
  ageRating,
}: SeatScreeningInfoProps) {
  const { t } = useTranslation('seats');

  return (
    <div className="mb-8 w-full rounded-2xl bg-[#1E1E1E] p-4 shadow-lg sm:max-w-4xl sm:p-6">
      <h1 className="text-2xl font-bold text-[#b69852]">{t('title')}</h1>
      <div className="mt-4 grid gap-2 text-sm md:grid-cols-2">
        <p>{t('movie')}: {movieTitle}</p>
        <p>{t('hall')}: {hallName ?? '-'}</p>
        <p>{t('date')}: {screeningDate ?? '-'}</p>
        <p>{t('time')}: {screeningTime?.slice(0, 5) ?? '-'}</p>
        <p>{t('totalPrice')}: {totalPrice} kr</p>
        <p>
          {t('ageRestriction')}: {ageRating > 0 ? `${ageRating}+` : t('childAllowed')}
        </p>
      </div>
    </div>
  );
}
