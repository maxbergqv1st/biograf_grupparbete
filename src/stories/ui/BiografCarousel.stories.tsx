import { useScreenings } from '@/api/hooks/useScreenings';
import { queryClient } from '@/api/queryClient';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router-dom';

import BiografCarousel from '@/components/custom/BiografCarousel';

import Image from '../../parts/Image';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Example/components/ui/BiografCarousel',
  component: BiografCarousel,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    /*variant: {
      description: 'The variant to use.',
      control: { type: 'select' },
      options: [
        'default',
        'secondary',
        'outline',
        'ghost',
        'link',
        'destructive',
      ],
      table: {
        type: { detail: 'string' },
      },
    },*/

    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
    },

    children: {
      description: 'In this case it is a title',
      control: 'text',
      table: {
        type: { detail: 'React.ReactNode' },
      },
    },
  },

  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Routes>
            <Route
              element={
                <Outlet
                  context={[
                    { bwImages: false, categoryChoice: '', sortChoice: '' },
                    () => {},
                  ]}
                />
              }
              path="/"
            >
              <Route path="/" element={<Story />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    ),
  ],

  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
  args: { onClick: () => console.log('clicked') },
} satisfies Meta<typeof BiografCarousel>;
export default meta;
type Story = StoryObj<typeof meta>;

const formatDay = (dateValue: string) =>
  new Intl.DateTimeFormat('sv-SE', { day: 'numeric' }).format(
    new Date(`${dateValue}T00:00:00`),
  );
const formatMonth = (dateValue: string) => {
  const raw = new Intl.DateTimeFormat('sv-SE', { month: 'long' }).format(
    new Date(`${dateValue}T00:00:00`),
  );
  return raw.charAt(0).toUpperCase() + raw.slice(1);
};

const formatTime = (timeValue: string) => timeValue.slice(0, 5);

function ScreeningsDatesCarousel() {
  const { data, isLoading, isError } = useScreenings(1);
  const screenings = data?.data ?? [];

  if (isLoading) {
    return (
      <BiografCarousel
        selectable
        items={[<span key="loading">Hämtar datum...</span>]}
      />
    );
  }

  if (isError || screenings.length === 0) {
    return (
      <BiografCarousel
        selectable
        items={[<span key="empty">Inga datum</span>]}
      />
    );
  }

  const items = screenings.map((screening) => {
    const date = screening.screeningDate;
    const time = screening.screeningTime;
    return (
      <div
        key={screening.id ?? `${date ?? 'date'}-${time ?? 'time'}`}
        className="flex h-full w-full flex-col items-center justify-center rounded-xl"
      >
        <span>{date ? `${formatDay(date)}` : '-'}</span>
        <span>{date ? formatMonth(date) : ''}</span>
        {time ? <span className="text-xs">{formatTime(time)}</span> : null}
      </div>
    );
  });

  return <BiografCarousel selectable items={items} />;
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Dates: Story = {
  render: () => <ScreeningsDatesCarousel />,
};

export const Images: Story = {
  args: {
    children: (
      <div className="m-0 h-45 rounded-xl border-0">
        <Image
          className="h-45"
          src="images/products/1.jpg"
          alt="A group photo of our employees."
        />
      </div>
    ),
  },
};

export const Time: Story = {
  args: {
    selectable: true,
    children: (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-xl">
        <span>17:30</span>
        <span className="text-xs">Salong 2</span>
      </div>
    ),
  },
};

export const Small: Story = {
  args: {
    children: 'Button',
  },
};
