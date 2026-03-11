import { useState } from 'react';

import { BiografCol, BiografContainer, BiografRow } from './BiografContainer';
import BiografInput from './BiografInput';
import BiografSelect from './BiografSelect';

type Props = {
  onFiltersChange: (filters: { date: string; ageRating: string }) => void;
};

export default function BiografFilters({ onFiltersChange }: Props) {
  const [date, setDate] = useState<string>('');
  const [ageRating, setAgeRating] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  const ageOptions = [
    { value: ' ', label: 'Alla åldrar' },
    { value: 'B', label: 'Barn (B)' },
    { value: '7', label: 'Från 7 år' },
    { value: '11', label: 'Från 11 år' },
    { value: '15', label: 'Från 15 år' },
  ];
  console.log(ageRating, 'Age Rating');
  const handleFilter = () => {
    onFiltersChange({ date, ageRating });
  };

  const handleReset = () => {
    setDate('');
    setAgeRating('');
  };

  return (
    <BiografContainer className="mb-6">
      {/* Filter toggle knapp */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mb-4 flex items-center gap-2 text-[#F3EEE4] md:hidden"
      >
        <img
          src="/images/icons/Filtericon.svg"
          alt="Filter"
          className="h-6 w-6"
        />
        <span>{isOpen ? 'Dölj' : 'Filtrera'}</span>
      </button>
      {/* Filter-fält - syns bara när isOpen är true */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? 'max-h-[500px] opacity-100 md:max-h-none md:opacity-100'
            : 'max-h-0 opacity-0 md:max-h-none md:opacity-100'
        }`}
      >
        <BiografRow className="items-end gap-y-4">
          {/* Välj datum */}
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

          {/* Åldersgräns komponent */}
          <BiografCol xs={12} sm={6}>
            <label className="mb-1 block text-sm text-[#F3EEE4]">
              Åldersgräns
            </label>
            <BiografSelect
              placeholder="Age Rating"
              value={ageRating}
              options={ageOptions}
              onValueChange={(e) => setAgeRating(e)}
              className="h-11 w-full cursor-pointer rounded-md border border-[#7b6738] bg-[#141414] px-3 py-2 text-[#F3EEE4]"
            />
          </BiografCol>

          {/* Knappar rensa och sök*/}
          <BiografCol xs={12} className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="h-11 flex-1 rounded-md border border-[#7b6738] px-4 py-2.5 text-[#F3EEE4] transition-colors hover:bg-[#7b6738]/30"
            >
              Rensa
            </button>
            <button
              onClick={handleFilter}
              className="h-11 flex-1 rounded-md bg-[#B69852] px-4 py-2.5 font-medium text-[#141414] transition-colors hover:bg-[#B69852]/80"
            >
              Sök
            </button>
          </BiografCol>
        </BiografRow>
      </div>
    </BiografContainer>
  );
}
