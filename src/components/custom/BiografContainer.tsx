import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  fluid?: boolean;
}

export function BiografContainer({
  fluid = false,
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-3',
        fluid ? 'max-w-none' : 'max-w-[970px]',
        className,
      )}
      {...props}
    />
  );
}

type RowProps = HTMLAttributes<HTMLDivElement>;

export function BiografRow({ className, ...props }: RowProps) {
  return <div className={cn('-mx-3 flex flex-wrap', className)} {...props} />;
}

type ColSpan = number | 'auto';

interface ColProps extends HTMLAttributes<HTMLDivElement> {
  xs?: ColSpan;
  sm?: ColSpan;
  md?: ColSpan;
  lg?: ColSpan;
  xl?: ColSpan;
  xxl?: ColSpan;
}

const spanClass = (prefix: string, span?: ColSpan) => {
  if (span === undefined) {
    return null;
  }

  if (span === 'auto') {
    return `${prefix}w-auto ${prefix}flex-none`;
  }

  const clamped = Math.min(12, Math.max(1, span));
  return `${prefix}w-[calc(100%*${clamped}/12)] ${prefix}flex-none`;
};

export function BiografCol({
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  className,
  ...props
}: ColProps) {
  const hasExplicitSpan =
    xs !== undefined ||
    sm !== undefined ||
    md !== undefined ||
    lg !== undefined ||
    xl !== undefined ||
    xxl !== undefined;

  return (
    <div
      className={cn(
        'px-3',
        hasExplicitSpan ? 'w-full' : 'min-w-0 flex-1',
        spanClass('', xs),
        spanClass('sm:', sm),
        spanClass('md:', md),
        spanClass('lg:', lg),
        spanClass('xl:', xl),
        spanClass('2xl:', xxl),
        className,
      )}
      {...props}
    />
  );
}
