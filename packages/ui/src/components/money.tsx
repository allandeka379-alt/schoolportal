import { cn } from '../cn';

export interface MoneyProps {
  amount: string;
  currency: 'USD' | 'ZWL' | 'ZWG';
  tone?: 'positive' | 'negative' | 'neutral';
  bold?: boolean;
  className?: string;
}

/**
 * Money display component.
 *
 * Uses the mono font for the digits so amounts in tables line up column-wise.
 * The currency code is rendered in a smaller weight so the eye is drawn to
 * the magnitude first — the same pattern every banking UI uses.
 */
export function Money({ amount, currency, tone = 'neutral', bold = false, className }: MoneyProps) {
  const numeric = Number(amount);
  const formatted = new Intl.NumberFormat('en-ZW', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(numeric) ? numeric : 0);

  return (
    <span
      className={cn(
        'inline-flex items-baseline gap-1 font-mono tabular-nums',
        tone === 'positive' && 'text-emerald-700',
        tone === 'negative' && 'text-msasa-700',
        bold && 'font-semibold',
        className,
      )}
    >
      <span className="text-xs text-granite-500 font-sans">{currency}</span>
      <span>{formatted}</span>
    </span>
  );
}
