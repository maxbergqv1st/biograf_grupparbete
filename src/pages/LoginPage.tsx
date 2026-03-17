import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSuccess = () => {
    const params = new URLSearchParams(location.search);
    navigate(params.get('redirect') || '/');
  };

  return (
    <div className="flex flex-col px-6 py-4">
      <div className="mx-auto mt-12 flex w-full max-w-sm flex-col gap-6">
        <h1 className="text-2xl font-bold text-[#F3EEE4]">
          {t('auth:login.title')}
        </h1>
        <LoginForm onSuccess={handleSuccess} />

        <p className="mt-auto pb-8 text-center text-sm text-[#7b6738]">
          {t('auth:login.noAccount')}{' '}
          <span className="cursor-pointer text-[#F3EEE4]">
            {t('auth:login.register')}
          </span>
        </p>
      </div>
    </div>
  );
}
