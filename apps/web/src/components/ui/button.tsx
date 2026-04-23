'use client';

import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';
import { Loader2 } from 'lucide-react';

import { cn } from '@hha/ui';

/**
 * Civic primary button + four related variants. Matches the Bikita design
 * system: soft card shadow, rounded-md corners, 200ms out-expo transitions
 * across colour/shadow/transform, active-scale 0.985, focus ring at 2px on
 * the brand primary.
 *
 * Sizes hit 56px (lg) on mobile so payment-style CTAs have a proper touch
 * target without extra styling.
 */

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'gold' | 'outline';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary:     'bg-brand-primary text-white hover:bg-brand-primary/90 shadow-card-sm hover:shadow-card-md',
  secondary:   'bg-white text-brand-primary border border-line hover:bg-surface hover:border-brand-primary/30',
  ghost:       'bg-transparent text-brand-primary hover:bg-brand-primary/10',
  destructive: 'bg-danger text-white hover:bg-danger/90 shadow-card-sm',
  gold:        'bg-brand-accent text-brand-ink hover:bg-brand-accent/90 shadow-card-sm',
  outline:     'bg-transparent text-brand-primary border border-brand-primary/40 hover:bg-brand-primary/10',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-3 text-small',
  md: 'h-11 px-5 text-body',
  lg: 'h-14 px-7 text-body font-semibold',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    fullWidth,
    leadingIcon,
    trailingIcon,
    children,
    ...props
  },
  ref,
) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-md font-medium',
    'transition-[background-color,color,box-shadow,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
    'disabled:pointer-events-none disabled:opacity-60',
    'active:scale-[0.985]',
    VARIANTS[variant],
    SIZES[size],
    fullWidth && 'w-full',
    className,
  );

  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      ) : leadingIcon ? (
        <span className="inline-flex" aria-hidden>
          {leadingIcon}
        </span>
      ) : null}
      <span>{children}</span>
      {!loading && trailingIcon ? (
        <span className="inline-flex" aria-hidden>
          {trailingIcon}
        </span>
      ) : null}
    </button>
  );
});
