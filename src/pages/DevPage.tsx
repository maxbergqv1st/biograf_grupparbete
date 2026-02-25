import MovieList from '@/parts/MovieList';

import moviesLoader from '@/utils/movieLoader';

DevPage.route = {
  path: '/dev',
  menuLabel: 'dev',
  index: 2,
  loader: moviesLoader,
};

export default function DevPage() {
  return <MovieList />;
}
