import { useState } from 'react';

import { useForgotPassword } from '@/api/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import BiografButton from '@/components/custom/BiografButton';
import {
  BiografCol,
  BiografContainer,
  BiografRow,
} from '@/components/custom/BiografContainer';
import BiografInput from '@/components/custom/BiografInput';

const forgotSchema = z.object({
  email: z.string().email(),
});
type ForgotFormData = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const { mutateAsync: forgot, isPending } = useForgotPassword();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormData) => {
    try {
      await forgot(data.email);
      setSent(true);
    } catch {
      toast.error(t('auth:forgotPassword.error'));
    }
  };

  return (
    <BiografContainer className="py-4">
      <BiografRow className="justify-center">
        <BiografCol sm={8} md={6} lg={4} className="mt-12 flex flex-col gap-6">
          <h1 className="text-2xl font-bold text-[#F3EEE4]">
            {t('auth:forgotPassword.title')}
          </h1>

          {sent ? (
            <div className="flex flex-col gap-4">
              <p className="text-[#7b6738]">
                {t('auth:forgotPassword.success')}
              </p>
              <Link to="/login">
                <BiografButton variant="default" className="w-full">
                  {t('auth:forgotPassword.backToLogin')}
                </BiografButton>
              </Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-[#7b6738]">
                {t('auth:forgotPassword.instructions')}
              </p>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1">
                  <BiografInput
                    type="text"
                    placeholder={t('auth:login.email')}
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">
                      {t('auth:login.validation.email')}
                    </p>
                  )}
                </div>

                <BiografButton
                  type="submit"
                  variant="default"
                  className="w-full"
                  disabled={isPending}
                >
                  {isPending
                    ? t('auth:forgotPassword.submitting')
                    : t('auth:forgotPassword.submit')}
                </BiografButton>
              </form>

              <p className="text-center text-sm text-[#7b6738]">
                <Link to="/login" className="cursor-pointer text-[#F3EEE4]">
                  {t('auth:forgotPassword.backToLogin')}
                </Link>
              </p>
            </>
          )}
        </BiografCol>
      </BiografRow>
    </BiografContainer>
  );
}
