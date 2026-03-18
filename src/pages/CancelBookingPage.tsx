import { useCancelBooking } from '@/api/hooks/useBookings';
import BiografButton from '@/components/custom/BiografButton';
import {
  BiografCol,
  BiografContainer,
  BiografRow,
} from '@/components/custom/BiografContainer';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function CancelBookingPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const bookingRef = searchParams.get('ref');

  const { mutate: cancel, isPending, isSuccess } = useCancelBooking();

  const handleCancel = () => {
    if (bookingRef) {
      cancel(bookingRef, {
        onSuccess: () => toast.success(t('booking:cancel.successMessage')),
        onError: () => toast.error(t('booking:cancel.errorMessage')),
      });
    }
  };

  return (
    <BiografContainer className="py-4">
      <BiografRow className="justify-center">
        <BiografCol sm={8} md={6} lg={4} className="mt-12 flex flex-col items-center gap-6 text-center">
          {!bookingRef ? (
            <>
              <h1 className="text-2xl font-bold text-[#F3EEE4]">
                {t('booking:cancel.errorTitle')}
              </h1>
              <p className="text-[#7b6738]">
                {t('booking:cancel.missingRef')}
              </p>
            </>
          ) : isSuccess ? (
            <>
              <h1 className="text-2xl font-bold text-[#F3EEE4]">
                {t('booking:cancel.successTitle')}
              </h1>
              <Link to="/">
                <BiografButton variant="default">
                  {t('booking:cancel.goHome')}
                </BiografButton>
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-[#F3EEE4]">
                {t('booking:cancel.title')}
              </h1>
              <p className="text-[#7b6738]">
                {t('booking:cancel.confirmMessage', { ref: bookingRef })}
              </p>
              <BiografButton
                variant="default"
                onClick={handleCancel}
                disabled={isPending}
              >
                {isPending ? t('booking:cancel.cancelling') : t('booking:cancel.confirmButton')}
              </BiografButton>
            </>
          )}
        </BiografCol>
      </BiografRow>
    </BiografContainer>
  );
}
