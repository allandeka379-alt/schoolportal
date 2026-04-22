import { ArrowDown, ArrowRight, ArrowUp } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@hha/ui';

/**
 * Small building blocks shared across the redesigned student portal.
 * Editorial palette (ink / earth / terracotta / ochre / cream / sand / stone)
 * with Fraunces headings, Source Serif body, Inter UI. See:
 *   docs spec §03 Global UI Patterns.
 */

/* ------------------------------------------------------------------ */
/*  Status Pill                                                        */
/* ------------------------------------------------------------------ */

export type StatusState =
  | 'pending'
  | 'submitted'
  | 'marked'
  | 'overdue'
  | 'locked'
  | 'paid'
  | 'partial'
  | 'outstanding'
  | 'verified'
  | 'draft';

const PILL_STYLES: Record<StatusState, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-[#FDF4E3]', text: 'text-[#92650B]', label: 'pending' },
  submitted: { bg: 'bg-[#E6F0E9]', text: 'text-[#2F7D4E]', label: 'submitted' },
  marked: { bg: 'bg-[#EBE8F5]', text: 'text-[#4F3E99]', label: 'marked' },
  overdue: { bg: 'bg-[#FBEBEA]', text: 'text-[#B0362A]', label: 'overdue' },
  locked: { bg: 'bg-[#EEE9DC]', text: 'text-[#6B6458]', label: 'locked' },
  paid: { bg: 'bg-[#E6F0E9]', text: 'text-[#2F7D4E]', label: 'paid' },
  partial: { bg: 'bg-[#FDF4E3]', text: 'text-[#92650B]', label: 'partial' },
  outstanding: { bg: 'bg-[#FBEBEA]', text: 'text-[#B0362A]', label: 'outstanding' },
  verified: { bg: 'bg-[#E6F0E9]', text: 'text-[#2F7D4E]', label: 'verified' },
  draft: { bg: 'bg-sand-light', text: 'text-stone', label: 'draft' },
};

export function StatusPill({ state, children }: { state: StatusState; children?: ReactNode }) {
  const s = PILL_STYLES[state];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em]',
        s.bg,
        s.text,
      )}
    >
      {children ?? s.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Trend Arrow                                                        */
/* ------------------------------------------------------------------ */

export function TrendArrow({
  direction,
  className,
}: {
  direction: 'up' | 'flat' | 'down';
  className?: string;
}) {
  if (direction === 'up') {
    return <ArrowUp className={cn('h-4 w-4 text-ok', className)} strokeWidth={1.5} aria-label="Improving" />;
  }
  if (direction === 'down') {
    return <ArrowDown className={cn('h-4 w-4 text-danger', className)} strokeWidth={1.5} aria-label="Declining" />;
  }
  return <ArrowRight className={cn('h-4 w-4 text-stone', className)} strokeWidth={1.5} aria-label="Steady" />;
}

/* ------------------------------------------------------------------ */
/*  Empty State                                                        */
/* ------------------------------------------------------------------ */

export function EmptyBook({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 100" className={cn('text-stone', className)} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 20 q50 -12 100 0 v60 q-50 -10 -100 0 z" />
        <path d="M70 14 v72" />
        <path d="M30 34 h30 M30 46 h28 M30 58 h24" />
        <path d="M80 34 h30 M82 46 h28 M82 58 h22" />
      </g>
    </svg>
  );
}

export function EmptyInbox({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 100" className={cn('text-stone', className)} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 40 h100 v36 a8 8 0 0 1 -8 8 h-84 a8 8 0 0 1 -8 -8 z" />
        <path d="M30 40 l40 -24 40 24" />
        <path d="M20 40 l36 22 h28 l36 -22" />
      </g>
    </svg>
  );
}

export interface StudentEmptyStateProps {
  heading: string;
  body?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function StudentEmptyState({
  heading,
  body,
  icon = <EmptyBook className="h-24 w-32" />,
  action,
  className,
}: StudentEmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-16 text-center', className)}>
      <div className="mb-6">{icon}</div>
      <h4 className="font-display text-[22px] text-ink">{heading}</h4>
      {body ? (
        <p className="mt-2 max-w-md font-serif text-[16px] leading-relaxed text-stone">{body}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section header                                                     */
/* ------------------------------------------------------------------ */

export function SectionEyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-earth',
        className,
      )}
    >
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/*  Card surface                                                       */
/* ------------------------------------------------------------------ */

export function EditorialCard({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded border border-sand bg-white transition-all duration-200 ease-out-soft',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Avatar                                                             */
/* ------------------------------------------------------------------ */

const AVATAR_SIZES = {
  xs: 'h-7 w-7 text-[10px]',
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
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

export function EditorialAvatar({
  name,
  size = 'md',
  className,
  tone = 'sand',
}: {
  name: string;
  size?: keyof typeof AVATAR_SIZES;
  className?: string;
  tone?: 'sand' | 'terracotta' | 'ochre' | 'ink';
}) {
  const toneClass = {
    sand: 'bg-sand-light text-earth',
    terracotta: 'bg-terracotta/10 text-terracotta-hover',
    ochre: 'bg-ochre/15 text-earth',
    ink: 'bg-ink text-cream',
  }[tone];

  return (
    <span
      className={cn(
        'inline-flex flex-none items-center justify-center rounded-full border border-sand font-sans font-semibold',
        AVATAR_SIZES[size],
        toneClass,
        className,
      )}
      aria-label={name}
    >
      {initials(name)}
    </span>
  );
}
