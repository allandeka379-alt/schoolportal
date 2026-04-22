import type { ReactNode } from 'react';

import { cn } from '../cn';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-granite-300 bg-granite-50/50 px-6 py-12 text-center',
        className,
      )}
    >
      {icon ? <div className="text-granite-400">{icon}</div> : null}
      <h4 className="text-base font-semibold text-granite-900">{title}</h4>
      {description ? <p className="text-sm text-granite-600 max-w-md">{description}</p> : null}
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
