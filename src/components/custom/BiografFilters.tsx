import { useState } from 'react';

import { BiografCol, BiografContainer, BiografRow } from './BiografContainer';
import BiografInput from './BiografInput';
import BiografSelect from './BiografSelect';

export default function BiografFilters() {
  const [date, setDate] = useState<string>('');
  const [ageRating, setAgeRating] = useState<string>('');

  const ageOptions = [
    { value: ' ', label: 'Alla åldrar' },
    { value: 'B', label: 'Barn (B)' },
    { value: '7', label: 'Från 7 år' },
    { value: '11', label: 'Från 11 år' },
    { value: '15', label: 'Från 15 år' },
  ];
  console.log(ageRating, 'Age Rating');
  const handleFilter = () => {
    console.log('Filtrera:', { date, ageRating });
  };

  const handleReset = () => {
    setDate('');
    setAgeRating('');
  };

  return (
    <BiografContainer className="mb-6">
      <BiografRow className="items-end gap-y-4">
        {/* Datum-väljare */}
        <BiografCol xs={12} sm={6}>
          <label className="mb-1 block text-sm text-[#F3EEE4]">
            Välj datum
          </label>
          <BiografInput
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full cursor-pointer rounded-md border border-[#7b6738] bg-[#141414] px-3 py-2 text-[#F3EEE4]"
          />
        </BiografCol>

        {/* Åldersgräns */}
        <BiografCol xs={12} sm={6}>
          <label className="mb-1 block text-sm text-[#F3EEE4]">
            Åldersgräns
          </label>
          <BiografSelect
            placeholder="Age Rating"
            value={ageRating}
            options={ageOptions}
            onValueChange={(e) => setAgeRating(e)}
            className="w-full cursor-pointer rounded-md border border-[#7b6738] bg-[#141414] px-3 py-2 text-[#F3EEE4]"
          />
        </BiografCol>

        {/* Knappar - vanliga HTML */}
        <BiografCol xs={12} className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 rounded-md border border-[#7b6738] px-4 py-2.5 text-[#F3EEE4] transition-colors hover:bg-[#7b6738]/30"
          >
            Rensa
          </button>
          <button
            onClick={handleFilter}
            className="flex-1 rounded-md bg-[#B69852] px-4 py-2.5 font-medium text-[#141414] transition-colors hover:bg-[#B69852]/80"
          >
            Sök
          </button>
        </BiografCol>
      </BiografRow>
    </BiografContainer>
  );
}
