import { useState } from 'react';

import { useLogin } from '@/api/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Apple, Eye, EyeOff, Facebook } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import BiografButton from '@/components/custom/BiografButton';
import BiografInput from '@/components/custom/BiografInput';
import { Separator } from '@/components/ui/separator';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
type LoginFormData = z.infer<typeof loginSchema>;

type LoginFormProps = {
  onSuccess?: () => void;
};

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { t } = useTranslation();
  const { mutateAsync: login, isPending } = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      onSuccess?.();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error(t('auth:login.error.invalidCredentials'));
      } else {
        toast.error(t('auth:login.error.generic'));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <BiografInput
          type="email"
          placeholder={t('auth:login.email')}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-xs text-red-500">
            {t('auth:login.validation.email')}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="relative">
          <BiografInput
            type={showPassword ? 'text' : 'password'}
            placeholder={t('auth:login.password')}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-[#7b6738]"
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500">
            {t('auth:login.validation.password')}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <span className="cursor-pointer text-sm text-[#F3EEE4]">
          {t('auth:login.forgotPassword')}
        </span>
      </div>

      <BiografButton
        type="submit"
        variant="default"
        className="w-full"
        disabled={isPending}
      >
        {isPending ? t('auth:login.submitting') : t('auth:login.submit')}
      </BiografButton>

      <div className="flex items-center gap-4">
        <Separator className="flex-1" />
        <span className="text-sm text-[#7b6738]">{t('or')}</span>
        <Separator className="flex-1" />
      </div>

      <div className="flex gap-3">
        <BiografButton variant="default" className="flex-1">
          <Facebook size={20} />
        </BiografButton>
        <BiografButton variant="default" className="flex-1">
          <span className="text-lg font-bold">G</span>
        </BiografButton>
        <BiografButton variant="default" className="flex-1">
          <Apple size={20} />
        </BiografButton>
      </div>
    </form>
  );
}
