import type { ComponentProps } from 'react';

import { Switch } from '@/components/ui/switch';

import { cn } from '@/lib/utils';

type BiografSwitchProps = ComponentProps<typeof Switch>;

export default function BiografSwitch({
  className,
  ...props
}: BiografSwitchProps) {
  return <Switch className={cn('!rounded-md', className)} {...props} />;
}
