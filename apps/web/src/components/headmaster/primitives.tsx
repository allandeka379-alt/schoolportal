import type { ReactNode } from 'react';
import { ArrowDown, ArrowRight, ArrowUp } from 'lucide-react';

import { cn } from '@hha/ui';

/**
 * Headmaster-portal primitives — executive visual register.
 *
 * Same editorial palette as the family, deployed with the gravity of a
 * boardroom: larger KPI numerals, chart-forward layouts, mono for data.
 * Spec §02 "Visual register".
 */

/* ------------------------------------------------------------------ */
/*  KPI Card                                                           */
/* ------------------------------------------------------------------ */

export interface KPICardProps {
  label: string;
  value: ReactNode;
  deltaLabel?: string;
  trend?: 'up' | 'down' | 'down-good' | 'flat';
  onClick?: () => void;
  href?: string;
  size?: 'md' | 'lg';
  className?: string;
}

export function KPICard({
  label,
  value,
  deltaLabel,
  trend = 'flat',
  size = 'md',
  className,
}: KPICardProps) {
  const valueCls =
    size === 'lg'
      ? 'font-display text-[clamp(3rem,5vw,4rem)] leading-none tabular-nums'
      : 'font-display text-[clamp(2.25rem,3.5vw,3rem)] leading-none tabular-nums';
  const trendColour = {
    up: 'text-ok',
    'down-good': 'text-ok',
    down: 'text-danger',
    flat: 'text-stone',
  }[trend];
  const Arrow =
    trend === 'up'
      ? ArrowUp
      : trend === 'down'
      ? ArrowDown
      : trend === 'down-good'
      ? ArrowDown
      : ArrowRight;

  return (
    <div
      className={cn(
        'rounded border border-sand bg-white p-5 transition-all duration-200 ease-out-soft',
        className,
      )}
    >
      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-stone">
        {label}
      </p>
      <p className={cn('mt-2 text-ink', valueCls)}>{value}</p>
      {deltaLabel ? (
        <p className={cn('mt-2 inline-flex items-center gap-1 font-sans text-[12px]', trendColour)}>
          <Arrow className="h-3 w-3" strokeWidth={1.5} aria-hidden />
          {deltaLabel}
        </p>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  DeltaBadge                                                         */
/* ------------------------------------------------------------------ */

export function DeltaBadge({
  value,
  trend = 'flat',
  className,
}: {
  value: string;
  trend?: 'up' | 'down' | 'down-good' | 'flat';
  className?: string;
}) {
  const colour = {
    up: 'text-ok',
    'down-good': 'text-ok',
    down: 'text-danger',
    flat: 'text-stone',
  }[trend];
  const Arrow =
    trend === 'up'
      ? ArrowUp
      : trend === 'down'
      ? ArrowDown
      : trend === 'down-good'
      ? ArrowDown
      : ArrowRight;
  return (
    <span className={cn('inline-flex items-center gap-1 font-mono text-[12px] tabular-nums', colour, className)}>
      <Arrow className="h-3 w-3" strokeWidth={1.5} aria-hidden />
      {value}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  ChartBar — horizontal progress bar with numeric label              */
/* ------------------------------------------------------------------ */

export function ChartBar({
  label,
  value,
  max = 100,
  sub,
  tone = 'default',
  width = 'full',
}: {
  label: string;
  value: number;
  max?: number;
  sub?: ReactNode;
  tone?: 'default' | 'good' | 'warn' | 'danger' | 'complete';
  width?: 'full' | 'compact';
}) {
  const pct = Math.min(100, (value / max) * 100);
  const fill = {
    default: 'bg-earth',
    good: 'bg-ok',
    warn: 'bg-ochre',
    danger: 'bg-danger',
    complete: 'bg-ok',
  }[tone];

  return (
    <div
      className={cn(
        'grid items-center gap-4 py-1.5',
        width === 'full' ? 'grid-cols-[180px_1fr_80px]' : 'grid-cols-[140px_1fr_72px]',
      )}
    >
      <span className="truncate font-sans text-[13px] text-ink">{label}</span>
      <div className="h-3 overflow-hidden rounded-sm bg-sand">
        <div
          className={cn('h-full transition-all duration-300 ease-out-soft', fill)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-right font-mono text-[13px] tabular-nums text-ink">
        {sub ?? `${value}%`}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sparkline — inline tiny line chart                                 */
/* ------------------------------------------------------------------ */

export function Sparkline({
  values,
  width = 120,
  height = 36,
  stroke = '#C65D3D',
  fill = 'url(#sparkFill)',
}: {
  values: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
}) {
  if (values.length === 0) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);
  const points = values
    .map((v, i) => {
      const x = (i / Math.max(1, values.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={stroke} stopOpacity="0.3" />
          <stop offset="1" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" />
      <polygon points={`0,${height} ${points} ${width},${height}`} fill={fill} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Status badge (reusing editorial tones)                             */
/* ------------------------------------------------------------------ */

export type HMStatus = 'on-track' | 'at-risk' | 'complete' | 'below' | 'near' | 'behind' | 'on-target';

export function HMStatusBadge({ state }: { state: HMStatus }) {
  const styles: Record<HMStatus, string> = {
    'on-track':  'bg-[#E6F0E9] text-[#2F7D4E]',
    complete:    'bg-[#EBE8F5] text-[#4F3E99]',
    'at-risk':   'bg-[#FBEBEA] text-[#B0362A]',
    below:       'bg-[#FBEBEA] text-[#B0362A]',
    near:        'bg-[#FDF4E3] text-[#92650B]',
    behind:      'bg-[#FDF4E3] text-[#92650B]',
    'on-target': 'bg-[#E6F0E9] text-[#2F7D4E]',
  };
  const labels: Record<HMStatus, string> = {
    'on-track':  'on track',
    complete:    'complete',
    'at-risk':   'at risk',
    below:       'below target',
    near:        'near target',
    behind:      'behind',
    'on-target': 'on target',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em]',
        styles[state],
      )}
    >
      {labels[state]}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Executive page header                                              */
/* ------------------------------------------------------------------ */

export function ExecPageHeader({
  eyebrow,
  title,
  subtitle,
  right,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-sand pb-5">
      <div>
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
          {eyebrow}
        </p>
        <h1 className="mt-1.5 font-display text-[clamp(1.75rem,3vw,2.25rem)] tracking-tight text-ink">
          {title}
        </h1>
        {subtitle ? <p className="mt-1 font-sans text-[13px] text-stone">{subtitle}</p> : null}
      </div>
      {right ? <div className="flex flex-wrap items-center gap-2">{right}</div> : null}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Heatmap cell                                                       */
/* ------------------------------------------------------------------ */

export function HeatCell({ value }: { value: number }) {
  let bg = 'bg-sand-light';
  let fg = 'text-ink';
  if (value >= 85) {
    bg = 'bg-[#2F7D4E]';
    fg = 'text-cream';
  } else if (value >= 75) {
    bg = 'bg-[#8DB98A]';
  } else if (value >= 70) {
    bg = 'bg-[#D9C07A]';
  } else if (value >= 65) {
    bg = 'bg-[#E5A475]';
  } else {
    bg = 'bg-[#C85549]';
    fg = 'text-cream';
  }
  return (
    <div
      className={cn(
        'flex h-12 items-center justify-center rounded-sm font-mono text-[13px] tabular-nums transition-transform hover:scale-[1.04] hover:shadow-e2',
        bg,
        fg,
      )}
    >
      {value}
    </div>
  );
}
