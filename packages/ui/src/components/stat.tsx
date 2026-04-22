import type { ReactNode } from 'react';

import { cn } from '../cn';

export interface StatProps {
  label: string;
  value: ReactNode;
  trend?: 'up' | 'down' | 'flat';
  trendLabel?: string;
  hint?: string;
  icon?: ReactNode;
  className?: string;
}

const TREND_COLOUR = {
  up: 'text-emerald-700',
  down: 'text-msasa-700',
  flat: 'text-granite-600',
} as const;

export function Stat({ label, value, trend, trendLabel, hint, icon, className }: StatProps) {
  return (
    <div className={cn('hha-card-surface p-5', className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="hha-label">{label}</p>
        {icon ? <div className="text-granite-400">{icon}</div> : null}
      </div>
      <p className="mt-2 text-display-sm font-display text-heritage-950 tracking-tight">{value}</p>
      {trendLabel ? (
        <p className={cn('mt-2 text-sm', trend ? TREND_COLOUR[trend] : 'text-granite-600')}>
          {trendLabel}
        </p>
      ) : null}
      {hint ? <p className="mt-1 text-xs text-granite-500">{hint}</p> : null}
    </div>
  );
}
