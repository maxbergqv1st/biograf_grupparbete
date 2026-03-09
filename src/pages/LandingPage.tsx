import { useMovies } from '@/api/hooks/useMovies';
import { useNavigate } from 'react-router-dom';

import BiografCard from '@/components/custom/BiografCard';
import {
  BiografCol,
  BiografContainer,
  BiografRow,
} from '@/components/custom/BiografContainer';
import BiografFilters from '@/components/custom/BiografFilters';
import { Skeleton } from '@/components/ui/skeleton';

LandingPage.route = {
  path: '/',
  menuLabel: 'Home',
};

export default function LandingPage() {
  const { data, isLoading, isError } = useMovies();
  const navigate = useNavigate();

  console.log('data', data);
  console.log('isLoading', isLoading);
  console.log('isError', isError);

  return (
    <BiografContainer>
      <BiografFilters />
      <BiografRow className="justify-center gap-y-6">
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => (
            <BiografCol key={i}>
              <BiografCard>
                <Skeleton className="mb-2 h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </BiografCard>
            </BiografCol>
          ))}

        {isError && <div>Error loading movies.</div>}

        {data?.data.map((movie) => (
          <BiografCol key={movie.id}>
            <BiografCard
              title={movie.title ?? 'Untitled'}
              description={movie.genres?.join(', ')}
              className="cursor-pointer transition-shadow hover:shadow-[var(--shadow-gold)]"
              onClick={() => navigate(`/movies/${movie.id}`)}
            />
          </BiografCol>
        ))}
      </BiografRow>
    </BiografContainer>
  );
}
