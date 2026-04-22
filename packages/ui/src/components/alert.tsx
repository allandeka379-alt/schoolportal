import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '../cn';

type Tone = 'info' | 'success' | 'warning' | 'danger';

const TONE_STYLES: Record<Tone, { box: string; icon: ReactNode }> = {
  info: {
    box: 'bg-heritage-50 border-heritage-200 text-heritage-900',
    icon: <Info className="h-5 w-5 text-heritage-600" aria-hidden />,
  },
  success: {
    box: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden />,
  },
  warning: {
    box: 'bg-savanna-50 border-savanna-200 text-savanna-900',
    icon: <TriangleAlert className="h-5 w-5 text-savanna-600" aria-hidden />,
  },
  danger: {
    box: 'bg-msasa-50 border-msasa-200 text-msasa-900',
    icon: <AlertCircle className="h-5 w-5 text-msasa-600" aria-hidden />,
  },
};

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
  title?: string;
}

export function Alert({ tone = 'info', title, className, children, ...rest }: AlertProps) {
  const style = TONE_STYLES[tone];
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cn('flex gap-3 border rounded p-4', style.box, className)}
      {...rest}
    >
      <div className="mt-0.5 flex-none">{style.icon}</div>
      <div className="min-w-0 flex-1">
        {title ? <p className="font-semibold text-sm mb-0.5">{title}</p> : null}
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
