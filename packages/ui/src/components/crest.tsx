import { cn } from '../cn';

/**
 * Placeholder HHA crest — a simple SVG monogram used in the header bar,
 * report cards, and email templates until the school supplies the real
 * crest asset. Deliberately minimal; meant to read as institutional, not
 * decorative.
 */
export interface CrestProps {
  size?: number;
  className?: string;
  label?: string;
}

export function Crest({ size = 36, className, label = 'Harare Heritage Academy' }: CrestProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      role="img"
      aria-label={label}
      className={cn('inline-block', className)}
    >
      <defs>
        <linearGradient id="hhaCrestG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f1d3a" />
          <stop offset="1" stopColor="#2b3a55" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="46" height="46" rx="6" fill="url(#hhaCrestG)" />
      <path
        d="M14 12 v24 M24 12 v24 M34 12 v24 M14 24 h20"
        stroke="#faf0cb"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="24" cy="42" r="1.6" fill="#d9951f" />
    </svg>
  );
}
