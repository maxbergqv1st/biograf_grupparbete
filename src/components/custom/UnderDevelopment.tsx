import { Construction } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import BiografButton from '@/components/custom/BiografButton';
import {
  BiografCol,
  BiografContainer,
  BiografRow,
} from '@/components/custom/BiografContainer';
import { cn } from '@/lib/utils';

interface UnderDevelopmentProps {
  className?: string;
  feature?: string;
  fullPage?: boolean;
}

export default function UnderDevelopment({
  className,
  feature,
  fullPage = false,
}: UnderDevelopmentProps) {
  const { t } = useTranslation();

  const content = (
    <div
      className={cn(
        'flex flex-col items-center gap-3 rounded-lg border border-[#B69852]/30 bg-[#141414] p-6 text-center',
        className,
      )}
    >
      <Construction size={32} className="text-[#B69852]" />
      <p className="text-sm font-medium text-[#F3EEE4]">
        {feature ?? t('common:underDevelopment.title')}
      </p>
      <p className="text-xs text-[#7b6738]">
        {t('common:underDevelopment.message')}
      </p>
      {fullPage && (
        <BiografButton
          variant="default"
          className="mt-2"
          onClick={() => window.history.back()}
        >
          {t('common:underDevelopment.goBack')}
        </BiografButton>
      )}
    </div>
  );

  if (!fullPage) return content;

  return (
    <BiografContainer className="py-4">
      <BiografRow className="justify-center">
        <BiografCol sm={8} md={6} lg={4} className="mt-24">
          {content}
        </BiografCol>
      </BiografRow>
    </BiografContainer>
  );
}
