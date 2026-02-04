import type { Meta, StoryObj } from '@storybook/react-vite';

import BiografSelect from '@/components/custom/BiografSelect';

const meta = {
  title: 'Example/components/ui/BiografSelect',
  component: BiografSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    options: {
      description: 'Array of options to display in the select dropdown.',
      control: 'object',
      table: {
        type: { detail: '{ value: string; label?: string }[]' },
      },
    },
    placeholder: {
      description: 'Placeholder text shown when no value is selected.',
      control: 'text',
      table: {
        type: { detail: 'string' },
      },
    },
    value: {
      description: 'The currently selected value.',
      control: 'text',
      table: {
        type: { detail: 'string' },
      },
    },
    onValueChange: {
      description: 'Callback fired when the selected value changes.',
      table: {
        type: { detail: '(value: string) => void' },
      },
    },
    triggerClassName: {
      description: 'Additional class names for the trigger button.',
      control: 'text',
      table: {
        disable: true,
      },
    },
    contentClassName: {
      description: 'Additional class names for the dropdown content.',
      control: 'text',
      table: {
        disable: true,
      },
    },
    className: {
      description: 'Additional class names for the trigger.',
      control: 'text',
      table: {
        disable: true,
      },
    },
  },
  args: {
    onValueChange: (value: string) => console.log('selected:', value),
  },
} satisfies Meta<typeof BiografSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Select an option',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
  },
};

export const WithSelectedValue: Story = {
  args: {
    value: 'option2',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
  },
};

export const LabellessOptions: Story = {
  args: {
    placeholder: 'Pick a fruit',
    options: [{ value: 'apple' }, { value: 'banana' }, { value: 'cherry' }],
  },
};
