import { useEffect } from 'react';

import { useVerifyEmail } from '@/api/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';

import BiografButton from '@/components/custom/BiografButton';
import {
  BiografCol,
  BiografContainer,
  BiografRow,
} from '@/components/custom/BiografContainer';

export default function VerifyEmailPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const { mutate: verify, isPending, isSuccess, isError } = useVerifyEmail();

  useEffect(() => {
    if (token) {
      verify(token);
    }
  }, [token, verify]);

  return (
    <BiografContainer className="py-4">
      <BiografRow className="justify-center">
        <BiografCol sm={8} md={6} lg={4} className="mt-12 flex flex-col items-center gap-6 text-center">
          {isPending && (
            <p className="text-[#F3EEE4]">{t('auth:verifyEmail.verifying')}</p>
          )}

          {isSuccess && (
            <>
              <h1 className="text-2xl font-bold text-[#F3EEE4]">
                {t('auth:verifyEmail.successTitle')}
              </h1>
              <p className="text-[#7b6738]">
                {t('auth:verifyEmail.successMessage')}
              </p>
              <Link to="/">
                <BiografButton variant="default">
                  {t('auth:verifyEmail.goHome')}
                </BiografButton>
              </Link>
            </>
          )}

          {(isError || !token) && (
            <>
              <h1 className="text-2xl font-bold text-[#F3EEE4]">
                {t('auth:verifyEmail.errorTitle')}
              </h1>
              <p className="text-[#7b6738]">
                {t('auth:verifyEmail.errorMessage')}
              </p>
              <Link to="/login">
                <BiografButton variant="default">
                  {t('auth:verifyEmail.goLogin')}
                </BiografButton>
              </Link>
            </>
          )}
        </BiografCol>
      </BiografRow>
    </BiografContainer>
  );
}
