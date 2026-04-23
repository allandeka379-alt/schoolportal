import Link from 'next/link';

import { cn } from '@hha/ui';

/**
 * Junior High School logo — crest-shield glyph + wordmark.
 *
 * `variant="on-light"` renders the crest in brand-primary (navy blue) over a
 * white background; `on-dark` flips to white-on-navy for dark hero contexts.
 */

interface LogoProps {
  size?: number;
  showText?: boolean;
  variant?: 'on-light' | 'on-dark';
  asLink?: boolean;
  className?: string;
}

export function Logo({
  size = 32,
  showText = true,
  variant = 'on-light',
  asLink = false,
  className,
}: LogoProps) {
  const inner = (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span
        aria-hidden
        className={cn(
          'relative inline-flex flex-none items-center justify-center rounded-md shadow-card-sm',
          variant === 'on-light' ? 'bg-brand-primary text-white' : 'bg-white text-brand-primary',
        )}
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 32 32"
          width={size * 0.62}
          height={size * 0.62}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.9}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Stylised shield crest */}
          <path d="M16 4 L26 8 V16 C26 21 21.5 26 16 28 C10.5 26 6 21 6 16 V8 L16 4 Z" />
          <path d="M11 14 L16 18 L21 14" />
          <path d="M16 10 V22" />
        </svg>
        <span
          aria-hidden
          className={cn(
            'absolute -right-1 -top-1 inline-block h-2 w-2 rounded-full',
            variant === 'on-light' ? 'bg-brand-accent' : 'bg-brand-accent',
          )}
        />
      </span>
      {showText ? (
        <span className="flex flex-col leading-tight">
          <span
            className={cn(
              'text-body font-bold tracking-tight',
              variant === 'on-light' ? 'text-brand-primary' : 'text-white',
            )}
          >
            Junior High School
          </span>
          <span
            className={cn(
              'text-micro font-medium',
              variant === 'on-light' ? 'text-muted' : 'text-white/80',
            )}
          >
            Masvingo · Portal
          </span>
        </span>
      ) : null}
    </span>
  );

  if (asLink) {
    return (
      <Link
        href="/"
        aria-label="Junior High School Portal — home"
        className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40"
      >
        {inner}
      </Link>
    );
  }

  return inner;
}
