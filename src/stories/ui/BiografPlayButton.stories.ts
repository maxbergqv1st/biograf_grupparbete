import type { Meta, StoryObj } from '@storybook/react-vite';

import BiografButton from '@/components/custom/BiografButton';
import BiografPlayButton from '@/components/custom/BiografPlayButton';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Example/components/ui/BiografPlayButton',
  component: BiografPlayButton,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    variant: {
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
    },
    size: {
      description: 'The size to use.',
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
      table: {
        type: { detail: 'string' },
      },
    },
    children: {
      description: 'In this case it is a title',
      control: 'text',
      table: {
        type: { detail: 'React.ReactNode' },
      },
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
  args: { onClick: () => console.log('clicked') },
} satisfies Meta<typeof BiografPlayButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    variant: 'default',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Large: Story = {
  args: {

    children: '',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

export const Empty: Story = {
  args: {
    size: 'sm'
  },
};