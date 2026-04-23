import { cn } from '@hha/ui';

/**
 * Landing crest — a variant tuned to the editorial palette.
 *
 * The portal's authenticated crest uses the heritage-navy gradient;
 * the landing uses Earth → deeper sepia, with an Ochre dot, per the
 * aesthetic direction in §02.
 */
interface LandingCrestProps {
  size?: number;
  className?: string;
  label?: string;
  variant?: 'cream' | 'earth';
}

export function LandingCrest({
  size = 36,
  className,
  label = 'Junior High School',
  variant = 'earth',
}: LandingCrestProps) {
  const fill = variant === 'cream' ? '#FAF5EB' : 'url(#hhaEarth)';
  const rule = variant === 'cream' ? '#5C3A1E' : '#FAF5EB';
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
        <linearGradient id="hhaEarth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5C3A1E" />
          <stop offset="1" stopColor="#3E2713" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="46" height="46" rx="3" fill={fill} stroke="#5C3A1E" strokeOpacity={variant === 'cream' ? 0.15 : 0} />
      <path
        d="M14 12 v24 M24 12 v24 M34 12 v24 M14 24 h20"
        stroke={rule}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeOpacity="0.95"
      />
      <circle cx="24" cy="42.5" r="1.25" fill="#D4943A" />
    </svg>
  );
}
