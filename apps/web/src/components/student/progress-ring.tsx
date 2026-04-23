import { cn } from '@hha/ui';

/**
 * Circular progress indicator used across the student dashboard and
 * subject cards. Matches the Bikita `Stand 4521 · 75%` ring treatment.
 */
export function ProgressRing({
  value,
  size = 56,
  stroke = 6,
  tone = 'brand',
  label,
  className,
}: {
  value: number;            // 0–100
  size?: number;
  stroke?: number;
  tone?: 'brand' | 'success' | 'warning' | 'danger';
  label?: string;
  className?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = c - (clamped / 100) * c;

  const colour = {
    brand: 'rgb(var(--color-brand-primary))',
    success: 'rgb(var(--color-success))',
    warning: 'rgb(var(--color-warning))',
    danger: 'rgb(var(--color-danger))',
  }[tone];

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgb(var(--color-border))"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colour}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        />
      </svg>
      <span
        className="absolute inset-0 flex flex-col items-center justify-center text-center"
        aria-hidden
      >
        <span className="text-small font-semibold tabular-nums text-ink">
          {label ?? `${Math.round(clamped)}%`}
        </span>
      </span>
    </div>
  );
}
