import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import SignUpForm from '@/components/auth/SignUpForm';
import {
  BiografCol,
  BiografContainer,
  BiografRow,
} from '@/components/custom/BiografContainer';

export default function SignUpPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/');
  };

  return (
    <BiografContainer className="py-4">
      <BiografRow className="justify-center">
        <BiografCol sm={8} md={6} lg={4} className="mt-12 flex flex-col gap-6">
          <h1 className="text-2xl font-bold text-[#F3EEE4]">
            {t('auth:signup.title')}
          </h1>
          <SignUpForm onSuccess={handleSuccess} />

          <p className="mt-auto pb-8 text-center text-sm text-[#7b6738]">
            {t('auth:signup.hasAccount')}{' '}
            <Link to="/login" className="cursor-pointer text-[#F3EEE4]">
              {t('auth:signup.login')}
            </Link>
          </p>
        </BiografCol>
      </BiografRow>
    </BiografContainer>
  );
}
