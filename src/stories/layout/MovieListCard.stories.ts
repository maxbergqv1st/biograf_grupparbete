import type Movie from '@/interfaces/Movie';
import MovieList from '@/parts/MovieList';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mockMovies: Movie[] = [
  {
    id: 1,
    title: 'Dune',
    description_short: 'Epic sci-fi.',
    director: 'Denis Villeneuve',
  },
  {
    id: 2,
    title: 'Oppenheimer',
    description_short: 'Historical drama.',
    director: 'Christopher Nolan',
  },
  {
    id: 3,
    title: 'MadMax',
    description_short: 'Epic sci-fi.',
    director: 'Crippa',
  },
  {
    id: 4,
    title: 'Intersteller',
    description_short: 'Historical drama.',
    director: 'Christopher ',
  },
];

const meta = {
  title: 'Example/components/layout/MovieList',
  component: MovieList,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MovieList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    movies: mockMovies,
  },
};
