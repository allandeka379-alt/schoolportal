import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '../cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        'flex h-10 w-full rounded border border-granite-300 bg-white px-3 py-2',
        'text-sm text-granite-900 placeholder:text-granite-400',
        'transition-colors focus-visible:outline-none focus-visible:border-heritage-500 focus-visible:shadow-focus',
        'disabled:bg-granite-50 disabled:cursor-not-allowed',
        invalid && 'border-msasa-500 focus-visible:border-msasa-600',
        className,
      )}
      {...rest}
    />
  );
});
