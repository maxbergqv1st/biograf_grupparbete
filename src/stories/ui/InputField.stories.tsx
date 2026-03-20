import type { Meta, StoryObj } from '@storybook/react-vite';
import BiografInput from '@/components/custom/BiografInput';

const meta = {
  title: 'Example/components/ui/BiografInput',
  component: BiografInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    placeholder: 'Sök film... ',
    disabled: false,
  },
} satisfies Meta<typeof BiografInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Kan inte skriva här',
  },
};
