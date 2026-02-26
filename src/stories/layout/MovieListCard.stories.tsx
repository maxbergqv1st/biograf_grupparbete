import type Movie from '@/interfaces/Movie';
import MovieList from '@/parts/MovieList';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';

const mockMovies: Movie[] = [
  {
    id: 1,
    title: 'Grimsby',
    description_short: 'Ep.',
    director: 'Denis Villeneuve',
    poster: '/images/movies/FIGHTCLUB.jpg',
  },
  {
    id: 2,
    title: 'Oppenheimer',
    description_short: 'Historical drama.',
    director: 'Christopher Nolan',
    poster: '/images/movies/BOONDOCKSAINTS.jpg',
  },
  {
    id: 3,
    title: 'A night at Roxburry',
    description_short: 'Epic sci-fi.',
    director: 'Crippa',
    poster: '/images/movies/ANIGHTATROXBURRY.jpg',
  },
  {
    id: 4,
    title: 'Intersteller',
    description_short: 'Historical drama.',
    director: 'Christopher ',
    poster: '/images/movies/THEYRUMANSHOW.jpg',
  },
];

const meta = {
  title: 'Example/components/layout/MovieList',
  component: MovieList,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof MovieList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    movies: mockMovies,
  },
};