import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import LoginForm from '@/components/auth/LoginForm';
import {
  BiografCol,
  BiografContainer,
  BiografRow,
} from '@/components/custom/BiografContainer';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSuccess = () => {
    const params = new URLSearchParams(location.search);
    navigate(params.get('redirect') || '/');
  };

  return (
    <BiografContainer className="py-4">
      <BiografRow className="justify-center">
        <BiografCol sm={8} md={6} lg={4} className="mt-12 flex flex-col gap-6">
          <h1 className="text-2xl font-bold text-[#F3EEE4]">
            {t('auth:login.title')}
          </h1>
          <LoginForm onSuccess={handleSuccess} />

          <p className="text-center text-sm">
            <Link
              to="/forgot-password"
              className="cursor-pointer text-[#7b6738] hover:text-[#F3EEE4]"
            >
              {t('auth:login.forgotPassword')}
            </Link>
          </p>

          <p className="mt-auto pb-8 text-center text-sm text-[#7b6738]">
            {t('auth:login.noAccount')}{' '}
            <Link to="/signup" className="cursor-pointer text-[#F3EEE4]">
              {t('auth:login.register')}
            </Link>
          </p>
        </BiografCol>
      </BiografRow>
    </BiografContainer>
  );
}
