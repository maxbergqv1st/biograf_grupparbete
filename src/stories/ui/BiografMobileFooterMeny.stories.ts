import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';

import BiografMobileFooterMeny from '@/components/custom/BiografMobileFooterMeny';

const meta = {
  title: 'Example/components/ui/BiografMobileFooterMeny',
  component: BiografMobileFooterMeny,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) =>
      MemoryRouter({
        children: Story(),
      }),
  ],

  args: { onClick: () => console.log('clicked') },
} satisfies Meta<typeof BiografMobileFooterMeny>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
