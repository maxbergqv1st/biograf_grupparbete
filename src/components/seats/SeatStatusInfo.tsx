import { useTranslation } from 'react-i18next';

export default function SeatStatusInfo() {
  const { t } = useTranslation('seats');

  return (
    <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
      <div className="flex items-center gap-2">
        <span className="h-4 w-4 rounded bg-gray-200" />
        {t('available')}
      </div>
      <div className="flex items-center gap-2">
        <span className="h-4 w-4 rounded bg-yellow-200" />
        {t('reserved')}
      </div>
      <div className="flex items-center gap-2">
        <span className="h-4 w-4 rounded bg-red-300" />
        {t('booked')}
      </div>
      <div className="flex items-center gap-2">
        <span className="h-4 w-4 rounded bg-blue-500" />
        {t('selected')}
      </div>
    </div>
  );
}
