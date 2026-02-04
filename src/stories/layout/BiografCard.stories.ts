import type { Meta, StoryObj } from '@storybook/react-vite';

import BiografCard from '@/components/custom/BiografCard';

const meta = {
  title: 'Example/components/layout/BiografCard',
  component: BiografCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      description: 'Card title displayed in the header.',
      control: 'text',
      table: {
        type: { detail: 'string' },
      },
    },
    description: {
      description: 'Card description displayed below the title.',
      control: 'text',
      table: {
        type: { detail: 'string' },
      },
    },
    footer: {
      description: 'Content rendered in the card footer.',
      control: 'text',
      table: {
        type: { detail: 'React.ReactNode' },
      },
    },
    children: {
      description: 'Main content of the card.',
      control: 'text',
      table: {
        type: { detail: 'React.ReactNode' },
      },
    },
    headerClassName: {
      description: 'Additional class names for the header.',
      control: 'text',
      table: {
        disable: true,
      },
    },
    contentClassName: {
      description: 'Additional class names for the content area.',
      control: 'text',
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof BiografCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Card Title',
    description: 'This is a card description.',
    children: 'Card content goes here.',
  },
};

export const WithFooter: Story = {
  args: {
    title: 'Card Title',
    description: 'A card with a footer.',
    children: 'Card content goes here.',
    footer: 'Footer content',
  },
};

export const ContentOnly: Story = {
  args: {
    children: 'Card with no title or description.',
  },
};
