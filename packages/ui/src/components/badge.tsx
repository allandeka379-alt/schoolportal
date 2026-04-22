import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';

import { cn } from '../cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-medium tracking-wide',
  {
    variants: {
      tone: {
        neutral: 'bg-granite-100 text-granite-800',
        info: 'bg-heritage-100 text-heritage-800',
        success: 'bg-emerald-100 text-emerald-800',
        warning: 'bg-savanna-100 text-savanna-800',
        danger: 'bg-msasa-100 text-msasa-800',
        outline: 'border border-granite-300 text-granite-700',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
);

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...rest }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...rest} />;
}
