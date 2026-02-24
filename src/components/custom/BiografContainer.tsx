import type { HTMLAttributes } from 'react';

import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const containerVariants = cva('w-full', {
  variants: {
    variant: {
      default: 'mx-auto max-w-[970px] px-3',
      fluid: 'mx-auto px-3',
      page: 'flex min-h-screen flex-col',
    },
    colorScheme: {
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      brand: 'bg-accent text-accent-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface ContainerProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

export function BiografContainer({
  variant,
  colorScheme,
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(containerVariants({ variant, colorScheme }), className)}
      {...props}
    />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { containerVariants };

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
