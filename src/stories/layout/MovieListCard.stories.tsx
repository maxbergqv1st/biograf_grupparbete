import type Movie from '@/interfaces/Movie';
import MovieList from '@/parts/MovieList';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';

const mockMovies: Movie[] = [
  {
    id: 1,
    title: 'Grimsby',
    description_short: 'Ep.',
    director: 'Louis Leterrier',
    poster: '/images/movies/Fight_Club.jpg',
  },
  {
    id: 2,
    title: 'Boondocks',
    description_short: 'Historical drama.',
    director: 'Troy Duffy',
    poster: '/images/movies/Boondocks.jpg',
  },
  {
    id: 3,
    title: 'A night at Roxburry',
    description_short: 'Comp.',
    director: 'John Fortenberry',
    poster: '/images/movies/Roxbury.jpg',
  },
  {
    id: 4,
    title: 'Truman',
    description_short: 'Historical drama.',
    director: 'Peter Weir ',
    poster: '/images/movies/Truman.jpg',
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
