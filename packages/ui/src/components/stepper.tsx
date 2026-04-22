import { Check, X } from 'lucide-react';

import { cn } from '../cn';

export interface StepperItem {
  readonly key: string;
  readonly label: string;
  readonly description?: string;
  readonly status: 'pending' | 'in-progress' | 'done' | 'failed' | 'skipped';
}

export interface StepperProps {
  items: readonly StepperItem[];
  className?: string;
}

/**
 * Vertical stepper. Used heavily in the bank-slip detail view, where the
 * six-step pipeline (enhance → OCR → parse → verify → reconcile → update) is
 * rendered so a parent can see exactly where their upload is.
 */
export function Stepper({ items, className }: StepperProps) {
  return (
    <ol className={cn('space-y-4', className)}>
      {items.map((item, idx) => {
        const last = idx === items.length - 1;
        return (
          <li key={item.key} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  'h-7 w-7 rounded-full border flex items-center justify-center text-xs font-semibold',
                  item.status === 'done' && 'bg-emerald-100 border-emerald-300 text-emerald-800',
                  item.status === 'in-progress' && 'bg-heritage-100 border-heritage-400 text-heritage-900 animate-pulse',
                  item.status === 'pending' && 'bg-granite-50 border-granite-300 text-granite-500',
                  item.status === 'failed' && 'bg-msasa-100 border-msasa-400 text-msasa-800',
                  item.status === 'skipped' && 'bg-granite-100 border-granite-300 text-granite-500',
                )}
                aria-hidden
              >
                {item.status === 'done' ? (
                  <Check className="h-4 w-4" />
                ) : item.status === 'failed' ? (
                  <X className="h-4 w-4" />
                ) : (
                  idx + 1
                )}
              </span>
              {!last ? <span className="w-px flex-1 bg-granite-200 mt-1" aria-hidden /> : null}
            </div>
            <div className="pb-1 flex-1">
              <p className="text-sm font-medium text-granite-900">{item.label}</p>
              {item.description ? (
                <p className="text-xs text-granite-600 mt-0.5">{item.description}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
