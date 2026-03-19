import { useState } from 'react';

import { SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

import BiografButton from './BiografButton';
import { BiografCol, BiografContainer, BiografRow } from './BiografContainer';
import BiografInput from './BiografInput';
import BiografSelect from './BiografSelect';

type Props = {
  onFiltersChange: (filters: {
    date: string;
    ageRating: string;
    search: string;
  }) => void;
};

export default function BiografFilters({ onFiltersChange }: Props) {
  const { t } = useTranslation('common');
  const [date, setDate] = useState<string>('');
  const [ageRating, setAgeRating] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const ageOptions = [
    { value: 'all', label: t('filters.allAges') },
    { value: 'B', label: t('filters.childrenB') },
    { value: '7', label: t('filters.from7') },
    { value: '11', label: t('filters.from11') },
    { value: '15', label: t('filters.from15') },
  ];

  const handleFilter = () => {
    onFiltersChange({ date, search, ageRating: ageRating === 'all' ? '' : ageRating });
    setDialogOpen(false);
  };

  const handleReset = () => {
    setDate('');
    setAgeRating('all');
    setSearch('');
    onFiltersChange({ date: '', ageRating: '', search: '' });
  };

  return (
    <BiografContainer className="mb-6">
      <BiografRow className="flex justify-end md:hidden">
        <BiografButton
          variant="default"
          size="sm"
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-2 rounded-full"
        >
          <SlidersHorizontal className="h-5 w-5" />
          <span className="text-sm">{t('filters.filter')}</span>
        </BiografButton>
      </BiografRow>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-lg rounded-3xl border-(--color-gold) bg-[#1E1E1E]">
          <DialogHeader>
            <DialogTitle className="text-(--color-text-primary)">
              {t('filters.filterMovies')}
            </DialogTitle>
          </DialogHeader>
          <BiografContainer className="flex flex-col gap-4 px-0">
            <BiografCol>
              <Label className="mb-1 block text-(--color-text-primary)">
                {t('filters.searchMovie')}
              </Label>
              <BiografInput
                type="text"
                placeholder={t('filters.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-md border border-[#7b6738] bg-[#141414] px-3 py-2 text-[#F3EEE4]"
              />
            </BiografCol>
            <BiografCol>
              <Label className="mb-1 block text-(--color-text-primary)">
                {t('filters.selectDate')}
              </Label>
              <BiografInput
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  onFiltersChange({ search, ageRating: ageRating === 'all' ? '' : ageRating, date: e.target.value });
                }}
                className="box-border h-11 w-full min-w-0 appearance-none rounded-md border border-[#7b6738] bg-[#141414] px-3 py-2 text-[#F3EEE4] [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-date-and-time-value]:text-left"
              />
            </BiografCol>
            <BiografCol>
              <Label className="mb-1 block text-(--color-text-primary)">
                {t('filters.ageRating')}
              </Label>
              <BiografSelect
                placeholder={t('filters.allAges')}
                value={ageRating}
                options={ageOptions}
                onValueChange={(e) => {
                  setAgeRating(e);
                  onFiltersChange({ date, search, ageRating: e === 'all' ? '' : e });
                }}
                className="h-11 w-full rounded-md border border-[#7b6738] bg-[#141414] px-3 py-2 text-[#F3EEE4]"
              />
            </BiografCol>
            <BiografRow className="gap-3 px-3">
              <BiografButton
                variant="default"
                onClick={handleReset}
                className="h-11 flex-1"
              >
                {t('filters.reset')}
              </BiografButton>
              <BiografButton
                variant="primary"
                onClick={handleFilter}
                className="h-11 flex-1"
              >
                {t('filters.search')}
              </BiografButton>
            </BiografRow>
          </BiografContainer>
        </DialogContent>
      </Dialog>

      <BiografContainer className="hidden px-0 md:block">
        <BiografRow className="items-end gap-x-4 gap-y-4">
          <BiografCol xs={12} sm={6} md={3}>
            <Label className="mb-1 block text-[#F3EEE4]">
              {t('filters.searchMovie')}
            </Label>
            <BiografInput
              type="text"
              placeholder={t('filters.searchShort')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full cursor-pointer rounded-md border border-[#7b6738] bg-[#141414] px-3 py-2 text-[#F3EEE4]"
            />
          </BiografCol>
          <BiografCol xs={12} sm={6} md={3}>
            <Label className="mb-1 block text-[#F3EEE4]">
              {t('filters.selectDate')}
            </Label>
            <BiografInput
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                onFiltersChange({ search, ageRating: ageRating === 'all' ? '' : ageRating, date: e.target.value });
              }}
              className="h-11 w-full cursor-pointer rounded-md border border-[#7b6738] bg-[#141414] px-3 py-2 text-[#F3EEE4]"
            />
          </BiografCol>
          <BiografCol xs={12} sm={6} md={3}>
            <Label className="mb-1 block text-[#F3EEE4]">
              {t('filters.ageRating')}
            </Label>
            <BiografSelect
              placeholder={t('filters.allAges')}
              value={ageRating}
              options={ageOptions}
              onValueChange={(e) => {
                setAgeRating(e);
                onFiltersChange({ date, search, ageRating: e === 'all' ? '' : e });
              }}
              className="h-11 w-full cursor-pointer rounded-md border border-[#7b6738] bg-[#141414] px-3 py-2 text-[#F3EEE4]"
            />
          </BiografCol>
          <BiografCol xs={12} sm={6} md={3} className="flex items-end gap-2">
            <BiografButton
              variant="outline"
              onClick={handleReset}
              className="h-11 flex-1"
            >
              {t('filters.reset')}
            </BiografButton>
            <BiografButton
              variant="default"
              onClick={handleFilter}
              className="h-11 flex-1"
            >
              {t('filters.search')}
            </BiografButton>
          </BiografCol>
        </BiografRow>
      </BiografContainer>
    </BiografContainer>
  );
}