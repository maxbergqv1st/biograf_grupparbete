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
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [ageRating, setAgeRating] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const ageOptions = [
    { value: 'all', label: 'Alla åldrar' },
    { value: 'B', label: 'Barn (B)' },
    { value: '7', label: 'Från 7 år' },
    { value: '11', label: 'Från 11 år' },
    { value: '15', label: 'Från 15 år' },
    { value: ' ', label: t('filters.allAges') },
    { value: 'B', label: t('filters.childrenB') },
    { value: '7', label: t('filters.from7') },
    { value: '11', label: t('filters.from11') },
    { value: '15', label: t('filters.from15') },
  ];

  console.log(ageRating, 'Alla åldrar');
  const handleFilter = () => {
    onFiltersChange({ date, ageRating, search });
    setDialogOpen(false);
    onFiltersChange({ date, search, ageRating: ageRating === 'all' ? '' : ageRating });
    //onFiltersChange({ date, ageRating, search });
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
                onChange={(e) => setDate(e.target.value)}
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
                onValueChange={(e) => setAgeRating(e)}
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
              <BiografButton
                variant="default"
                onClick={handleFilter}
                className="h-11 px-4"
              >
                Sök
              </BiografButton>
            </div>
          </BiografCol>
        </BiografRow>
      </div>

      {/* mobil filter delen */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${filterOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <BiografRow className="items-end gap-y-4">
          <BiografCol xs={12} sm={6}>
            <label className="mb-1 block text-sm text-[#F3EEE4]">
              Välj datum
            </label>
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
          <BiografCol xs={12} sm={6}>
            <label className="mb-1 block text-sm text-[#F3EEE4]">
              Åldersgräns
            </label>
            <BiografSelect
              placeholder="Alla åldrar"
              value={ageRating}
              options={ageOptions}
              onValueChange={(e) => {
              setAgeRating(e);
              onFiltersChange({ date, search, ageRating: e === 'all' ? '' : e });
            }}
              className="h-11 w-full cursor-pointer rounded-md border border-[#7b6738] bg-[#141414] px-3 py-2 text-[#F3EEE4]"
            />
          </BiografCol>
          <BiografCol xs={12} className="flex items-center gap-3">
            <BiografButton
              variant="default" //  samma som sök knappen
              onClick={handleReset}
              className="h-11 flex-1"
            >
              Rensa
            </BiografButton>
            <BiografButton
              variant="default"
              onClick={handleFilter}
              className="h-11 flex-1"
            >
              Sök
            </BiografButton>
          </BiografCol>
        </BiografRow>
      </div>

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
