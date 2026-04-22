import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

import { cn } from '../cn';

/**
 * Primary button — deliberately restrained. Five variants, three sizes, and
 * that is the entire API. We do not support "colorful" variants; novelty is
 * the enemy of institutional trust.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium ' +
    'transition-colors duration-150 ' +
    'focus-visible:outline-none focus-visible:shadow-focus ' +
    'disabled:opacity-50 disabled:cursor-not-allowed ' +
    'rounded select-none',
  {
    variants: {
      variant: {
        primary:
          'bg-heritage-900 text-white hover:bg-heritage-800 active:bg-heritage-950 border border-heritage-900',
        secondary:
          'bg-white text-heritage-900 hover:bg-granite-50 active:bg-granite-100 border border-granite-300',
        ghost: 'bg-transparent text-heritage-900 hover:bg-granite-100 border border-transparent',
        danger:
          'bg-msasa-600 text-white hover:bg-msasa-700 active:bg-msasa-800 border border-msasa-600',
        link: 'bg-transparent text-heritage-700 underline-offset-4 hover:underline p-0 border-0',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-5 text-base',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, fullWidth, loading, disabled, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
      ) : null}
      {children}
    </button>
  );
});
