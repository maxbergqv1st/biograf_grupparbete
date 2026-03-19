import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';

import MobileFooterNav from '@/components/custom/MobileFooterNav';
import { mobileNavItems } from '@/config/mobileNavigation';

const meta = {
  title: 'Example/components/ui/MobileFooterNav',
  component: MobileFooterNav,
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
  args: { items: mobileNavItems },
} satisfies Meta<typeof MobileFooterNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
