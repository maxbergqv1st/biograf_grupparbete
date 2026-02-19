import type { Meta, StoryObj } from '@storybook/react-vite';

import BiografCard from '@/components/custom/BiografCard';
import BiografCarousel from '@/components/custom/BiografCarousel';
import Image from '../../parts/Image';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router-dom';

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
    ),
  ],
  
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
  args: { onClick: () => console.log('clicked') },
} satisfies Meta<typeof BiografCarousel>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Dates: Story = {
  args: {
    children: (
      <div className='flex flex-col'>
        <span className='justify-center'>15:e Feb</span>
        <span className='flex justify-center text-xs'>Salong 2</span>
      </div>
    ),
  },
};

export const Images: Story = {
  args: {
    children: <div className=' h-45 rounded-xl m-0 border-0'><Image className='h-45' src="images/products/1.jpg" alt="A group photo of our employees." />
  </div>
  },
};

export const Large: Story = {
  args: {
    children: 'Button',
  },
};

export const Small: Story = {
  args: {
    children: 'Button',
  },
};
