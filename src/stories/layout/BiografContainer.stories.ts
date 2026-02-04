import type { Meta, StoryObj } from '@storybook/react-vite';

import { BiografContainer } from '@/components/custom/BiografContainer';

const meta = {
  title: 'Example/components/layout/BiografContainer',
  component: BiografContainer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    fluid: {
      description: 'When true, the container spans the full width with no max-width constraint.',
      control: 'boolean',
      table: {
        type: { detail: 'boolean' },
      },
    },
    children: {
      description: 'Content rendered inside the container.',
      control: 'text',
      table: {
        type: { detail: 'React.ReactNode' },
      },
    },
  },
} satisfies Meta<typeof BiografContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Container content (max-width: 970px)',
  },
};

export const Fluid: Story = {
  args: {
    fluid: true,
    children: 'Fluid container content (full width)',
  },
};
