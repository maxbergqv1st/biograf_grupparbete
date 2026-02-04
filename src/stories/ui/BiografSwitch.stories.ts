import type { Meta, StoryObj } from '@storybook/react-vite';

import BiografSwitch from '@/components/custom/BiografSwitch';

const meta = {
  title: 'Example/components/ui/BiografSwitch',
  component: BiografSwitch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      description: 'Whether the switch is toggled on.',
      control: 'boolean',
      table: {
        type: { detail: 'boolean' },
      },
    },
    defaultChecked: {
      description: 'The default checked state when uncontrolled.',
      control: 'boolean',
      table: {
        type: { detail: 'boolean' },
      },
    },
    disabled: {
      description: 'Whether the switch is disabled.',
      control: 'boolean',
      table: {
        type: { detail: 'boolean' },
      },
    },
    onCheckedChange: {
      description: 'Callback fired when the checked state changes.',
      table: {
        type: { detail: '(checked: boolean) => void' },
      },
    },
  },
  args: {
    onCheckedChange: (checked: boolean) => console.log('checked:', checked),
  },
} satisfies Meta<typeof BiografSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    defaultChecked: true,
    disabled: true,
  },
};
