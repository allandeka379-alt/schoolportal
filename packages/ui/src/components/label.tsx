import type { LabelHTMLAttributes } from 'react';

import { cn } from '../cn';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({ className, required, children, ...rest }: LabelProps) {
  return (
    <label
      className={cn('block text-sm font-medium text-granite-800 mb-1.5', className)}
      {...rest}
    >
      {children}
      {required ? <span className="ml-0.5 text-msasa-600" aria-hidden>*</span> : null}
    </label>
  );
}
