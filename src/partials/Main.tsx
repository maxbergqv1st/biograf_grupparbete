import { Outlet } from 'react-router-dom';

import { BiografContainer } from '@/components/custom/BiografContainer';

import { useStateObject } from '../utils/useStateObject';

export default function Main() {
  // a state to use with outlet context
  const stateAndSetter = useStateObject({
    categoryChoice: 'All',
    sortChoice: 'Price (low to high)',
    bwImages: false,
  });

  return (
    <main className="py-10">
      <BiografContainer className="space-y-10">
        <Outlet context={stateAndSetter} />
      </BiografContainer>
    </main>
  );
}
