import { useState } from 'react';

import { useResetPassword } from '@/api/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import BiografButton from '@/components/custom/BiografButton';
import {
  BiografCol,
  BiografContainer,
  BiografRow,
} from '@/components/custom/BiografContainer';
import BiografInput from '@/components/custom/BiografInput';

const resetSchema = z
  .object({
    newPassword: z.string().min(6),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
  });
type ResetFormData = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const { mutateAsync: reset, isPending } = useResetPassword();
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormData) => {
    if (!token) return;
    try {
      await reset({ token, newPassword: data.newPassword });
      setSuccess(true);
    } catch {
      toast.error(t('auth:resetPassword.error'));
    }
  };

  if (!token) {
    return (
      <BiografContainer className="py-4">
        <BiografRow className="justify-center">
          <BiografCol sm={8} md={6} lg={4} className="mt-12 flex flex-col items-center gap-6 text-center">
            <h1 className="text-2xl font-bold text-[#F3EEE4]">
              {t('auth:resetPassword.invalidTitle')}
            </h1>
            <p className="text-[#7b6738]">
              {t('auth:resetPassword.invalidMessage')}
            </p>
            <Link to="/login">
              <BiografButton variant="default">
                {t('auth:resetPassword.goLogin')}
              </BiografButton>
            </Link>
          </BiografCol>
        </BiografRow>
      </BiografContainer>
    );
  }

  return (
    <BiografContainer className="py-4">
      <BiografRow className="justify-center">
        <BiografCol sm={8} md={6} lg={4} className="mt-12 flex flex-col gap-6">
          <h1 className="text-2xl font-bold text-[#F3EEE4]">
            {t('auth:resetPassword.title')}
          </h1>

          {success ? (
            <div className="flex flex-col gap-4">
              <p className="text-[#7b6738]">
                {t('auth:resetPassword.success')}
              </p>
              <Link to="/login">
                <BiografButton variant="default" className="w-full">
                  {t('auth:resetPassword.goLogin')}
                </BiografButton>
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1">
                <div className="relative">
                  <BiografInput
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('auth:resetPassword.newPassword')}
                    {...register('newPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-[#7b6738]"
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-xs text-red-500">
                    {t('auth:resetPassword.validation.newPassword')}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <BiografInput
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('auth:resetPassword.confirmPassword')}
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">
                    {t('auth:resetPassword.validation.confirmPassword')}
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
                  ? t('auth:resetPassword.submitting')
                  : t('auth:resetPassword.submit')}
              </BiografButton>
            </form>
          )}
        </BiografCol>
      </BiografRow>
    </BiografContainer>
  );
}
