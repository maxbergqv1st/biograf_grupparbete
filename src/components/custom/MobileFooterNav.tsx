import { useState } from 'react';

import { Ellipsis, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

import BiografButton from '@/components/custom/BiografButton';
import { BiografContainer } from '@/components/custom/BiografContainer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import type { NavLink as MobileNavItem } from '@/config/navigation';

import { cn } from '@/lib/utils';

export type { NavLink as MobileNavItem } from '@/config/navigation';

type LanguagePickerProps = {
  languages: string[];
  currentLanguage: string;
  onChangeLanguage: (lang: string) => void;
  labels?: Record<string, string>;
};

type MobileFooterNavProps = {
  items: MobileNavItem[];
  maxVisible?: number;
  languagePicker?: LanguagePickerProps;
};

function MobileFooterNavItem({
  item,
  isActive,
}: {
  item: MobileNavItem;
  isActive: boolean;
}) {
  const { t } = useTranslation();
  const Icon = item.icon;

  return (
    <BiografButton
      variant="ghost"
      size="sm"
      asChild
      className={cn(
        'flex items-center justify-center rounded-[20px] transition-all duration-300',
        isActive
          ? 'h-[58px] w-[113px] gap-2 bg-(--color-gold) font-semibold text-black hover:bg-(--color-gold)'
          : 'h-[58px] w-[58px] bg-linear-to-r from-[#1F1F1F] to-[#333333] text-(--color-text-primary) hover:bg-linear-to-r',
      )}
    >
      <Link to={item.path}>
        <Icon className={cn(isActive ? 'h-6 w-6' : 'h-7 w-7')} />
        {isActive && <span className="text-sm">{t(item.label)}</span>}
      </Link>
    </BiografButton>
  );
}

function MobileFooterOverflow({
  items,
  hasActiveChild,
  languagePicker,
}: {
  items: MobileNavItem[];
  hasActiveChild: boolean;
  languagePicker?: LanguagePickerProps;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const langLabels: Record<string, string> = {
    sv: 'Svenska',
    en: 'English',
    ...languagePicker?.labels,
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <BiografButton
          variant="ghost"
          size="sm"
          className={cn(
            'flex items-center justify-center rounded-[20px] transition-all duration-300',
            hasActiveChild
              ? 'h-[58px] w-[113px] gap-2 bg-(--color-gold) font-semibold text-black hover:bg-(--color-gold)'
              : 'h-[58px] w-[58px] bg-linear-to-r from-[#1F1F1F] to-[#333333] text-(--color-text-primary) hover:bg-linear-to-r',
          )}
        >
          <Ellipsis className="h-7 w-7" />
          {hasActiveChild && (
            <span className="text-sm">{t('common:mobileNav.more')}</span>
          )}
        </BiografButton>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        sideOffset={16}
        align="end"
        className="w-auto min-w-[160px] rounded-[12px] border-(--color-gold) bg-[#1E1E1E] p-2"
      >
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <BiografButton
              key={item.path}
              variant="ghost"
              size="sm"
              asChild
              className="flex w-full items-center justify-start gap-3 rounded-lg p-2.5 text-(--color-text-primary) transition-colors hover:bg-linear-to-r hover:from-[#1F1F1F] hover:to-[#333333] hover:text-(--color-gold)"
            >
              <Link to={item.path} onClick={() => setOpen(false)}>
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{t(item.label)}</span>
              </Link>
            </BiografButton>
          );
        })}

        {languagePicker && (
          <>
            <BiografContainer className="my-1.5 border-t border-white/10 px-0" />
            <BiografContainer className="flex items-center gap-3 rounded-lg p-2.5 text-(--color-text-primary)">
              <Globe className="h-5 w-5 shrink-0" />
              <BiografContainer className="flex gap-1.5 px-0">
                {languagePicker.languages.map((lang) => (
                  <BiografButton
                    key={lang}
                    variant="ghost"
                    size="sm"
                    onClick={() => languagePicker.onChangeLanguage(lang)}
                    className={cn(
                      'rounded-md px-2.5 py-1 text-sm font-medium transition-colors',
                      lang === languagePicker.currentLanguage
                        ? 'bg-(--color-gold) text-black hover:bg-(--color-gold)'
                        : 'text-(--color-text-primary) hover:bg-white/10',
                    )}
                  >
                    {langLabels[lang] ?? lang}
                  </BiografButton>
                ))}
              </BiografContainer>
            </BiografContainer>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default function MobileFooterNav({
  items,
  maxVisible = 3,
  languagePicker,
}: MobileFooterNavProps) {
  const { pathname } = useLocation();

  const hasOverflow = items.length > maxVisible || !!languagePicker;
  const visibleItems = hasOverflow ? items.slice(0, maxVisible) : items;
  const overflowItems = hasOverflow ? items.slice(maxVisible) : [];

  const isActive = (path: string) => pathname === path;
  const hasActiveOverflowChild = overflowItems.some((item) =>
    isActive(item.path),
  );

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 -translate-x-1/2">
      <BiografContainer className="flex items-center justify-around gap-2 rounded-[20px] bg-[#1E1E1E] p-3">
        {visibleItems.map((item) => (
          <MobileFooterNavItem
            key={item.path}
            item={item}
            isActive={isActive(item.path)}
          />
        ))}
        {hasOverflow && (
          <MobileFooterOverflow
            items={overflowItems}
            hasActiveChild={hasActiveOverflowChild}
            languagePicker={languagePicker}
          />
        )}
      </BiografContainer>
    </nav>
  );
}
