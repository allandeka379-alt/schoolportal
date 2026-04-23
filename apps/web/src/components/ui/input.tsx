import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '@hha/ui';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        'h-11 w-full rounded-sm border bg-card px-3.5 py-2.5 text-body text-ink placeholder-muted/70 transition-colors',
        'focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10',
        invalid
          ? 'border-danger focus:border-danger focus:ring-danger/15'
          : 'border-line',
        className,
      )}
      {...props}
    />
  );
});
