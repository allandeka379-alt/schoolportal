import { cn } from '../cn';

export interface AvatarProps {
  name: string;
  src?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
} as const;

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .join('');
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const cls = cn(
    'inline-flex items-center justify-center rounded-full bg-heritage-100 text-heritage-900 font-semibold shrink-0',
    SIZES[size],
    className,
  );
  if (src) {
    return (
      <img
        src={src}
        alt=""
        aria-hidden
        className={cn('rounded-full object-cover', SIZES[size], className)}
      />
    );
  }
  return (
    <span className={cls} aria-label={name}>
      {initials(name)}
    </span>
  );
}
