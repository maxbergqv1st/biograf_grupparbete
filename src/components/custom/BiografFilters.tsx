import { useState } from 'react';

import { Search, SlidersHorizontal } from 'lucide-react';

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
  const [date, setDate] = useState<string>('');
  const [ageRating, setAgeRating] = useState<string>('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [search, setSearch] = useState<string>('');

  const ageOptions = [
    { value: 'all', label: 'Alla åldrar' },
    { value: 'B', label: 'Barn (B)' },
    { value: '7', label: 'Från 7 år' },
    { value: '11', label: 'Från 11 år' },
    { value: '15', label: 'Från 15 år' },
  ];
  console.log(ageRating, 'Alla åldrar');
  const handleFilter = () => {
    onFiltersChange({ date, ageRating, search });
  };

  const handleReset = () => {
  setDate('');
  setAgeRating('all');
  setSearch('');
  onFiltersChange({ date: '', ageRating: '', search: '' });
  };

  return (
    <BiografContainer className="mb-6">
      {/* mobil ikon rad centrerad till höger */}
      <div className="mb-4 flex justify-end gap-4 md:hidden">
        {/* Sök ikon */}
        <button
          onClick={() => setSearchFocused(!searchFocused)}
          className="flex items-center gap-2"
        >
          {/*<img
            src="/images/icons/Searchicon.svg"
            alt="Sök"
            className="h-10 w-10" // ändrr storlek
          /> */}

          <Search />
        </button>

        {/* filter ikon */}
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="flex items-center gap-2"
        >
          {/*<img
            src="/images/icons/Filtericon.svg"
            alt="Filter"
            className="h-8 w-8" // ändrar storlek
          />*/}

          <SlidersHorizontal />

          <span>{filterOpen ? 'Dölj' : 'Filtrera'}</span>
        </button>
      </div>

      {/* mobil sök delen */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${searchFocused ? 'max-h-[100px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <BiografRow className="items-end gap-y-4">
          <BiografCol xs={12}>
            <label className="mb-1 block text-sm text-[#F3EEE4]">
              Sök film
            </label>
            <div className="flex gap-2">
              <BiografInput
                type="text"
                placeholder="Sök t.ex. Truman..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 flex-1 cursor-pointer rounded-md border border-[#7b6738] bg-[#141414] px-3 py-2 text-[#F3EEE4]"
              />
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
              onChange={(e) => setDate(e.target.value)}
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

      {/* destop alltid synligt */}
      <div className="hidden md:block">
        <BiografRow className="items-end gap-x-4 gap-y-4">
          <BiografCol xs={12} sm={6} md={3}>
            <label className="mb-1 block text-sm text-[#F3EEE4]">
              Sök film
            </label>
            <BiografInput
              type="text"
              placeholder="Sök..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full cursor-pointer rounded-md border border-[#7b6738] bg-[#141414] px-3 py-2 text-[#F3EEE4]"
            />
          </BiografCol>
          <BiografCol xs={12} sm={6} md={3}>
            <label className="mb-1 block text-sm text-[#F3EEE4]">
              Välj datum
            </label>
            <BiografInput
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-11 w-full cursor-pointer rounded-md border border-[#7b6738] bg-[#141414] px-3 py-2 text-[#F3EEE4]"
            />
          </BiografCol>
          <BiografCol xs={12} sm={6} md={3}>
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
          <BiografCol xs={12} sm={6} md={3} className="flex items-end gap-2">
            <BiografButton
              variant="outline"
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
    </BiografContainer>
  );
}
