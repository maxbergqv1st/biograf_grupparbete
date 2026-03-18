import { useState } from 'react';

import { useRegister } from '@/api/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import BiografButton from '@/components/custom/BiografButton';
import BiografInput from '@/components/custom/BiografInput';

const signUpSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

type SignUpFormProps = {
  onSuccess?: () => void;
};

export default function SignUpForm({ onSuccess }: SignUpFormProps) {
  const { t } = useTranslation();
  const { mutateAsync: register, isPending } = useRegister();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });
      onSuccess?.();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast.error(t('auth:signup.error.emailTaken'));
      } else {
        toast.error(t('auth:signup.error.generic'));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex gap-3">
        <div className="flex flex-1 flex-col gap-1">
          <BiografInput
            type="text"
            placeholder={t('auth:signup.firstName')}
            {...registerField('firstName')}
          />
          {errors.firstName && (
            <p className="text-xs text-red-500">
              {t('auth:signup.validation.firstName')}
            </p>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <BiografInput
            type="text"
            placeholder={t('auth:signup.lastName')}
            {...registerField('lastName')}
          />
          {errors.lastName && (
            <p className="text-xs text-red-500">
              {t('auth:signup.validation.lastName')}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <BiografInput
          type="text"
          placeholder={t('auth:signup.email')}
          {...registerField('email')}
        />
        {errors.email && (
          <p className="text-xs text-red-500">
            {t('auth:signup.validation.email')}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="relative">
          <BiografInput
            type={showPassword ? 'text' : 'password'}
            placeholder={t('auth:signup.password')}
            {...registerField('password')}
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
            {t('auth:signup.validation.password')}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <BiografInput
          type={showPassword ? 'text' : 'password'}
          placeholder={t('auth:signup.confirmPassword')}
          {...registerField('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">
            {t('auth:signup.validation.confirmPassword')}
          </p>
        )}
      </div>

      <BiografButton
        type="submit"
        variant="default"
        className="w-full"
        disabled={isPending}
      >
        {isPending ? t('auth:signup.submitting') : t('auth:signup.submit')}
      </BiografButton>
    </form>
  );
}
