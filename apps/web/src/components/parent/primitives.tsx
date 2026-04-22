import Link from 'next/link';
import type { ReactNode } from 'react';

import { cn } from '@hha/ui';

import { EditorialAvatar } from '@/components/student/primitives';
import type { ParentChild } from '@/lib/mock/parent-extras';

/**
 * Parent-portal primitives — editorial palette, matching the landing /
 * student / teacher design family.
 *
 * Spec reference: §03 Global UI Patterns.
 */

/* ------------------------------------------------------------------ */
/*  Parent status pills (§03)                                          */
/* ------------------------------------------------------------------ */

export type ParentStatusState =
  | 'paid'
  | 'partial'
  | 'overdue'
  | 'pending-verification'
  | 'awaiting-reply'
  | 'action-required'
  | 'booked'
  | 'acknowledged'
  | 'draft';

const PILL: Record<ParentStatusState, { bg: string; fg: string; label: string }> = {
  'paid':                 { bg: 'bg-[#E6F0E9]', fg: 'text-[#2F7D4E]', label: 'paid' },
  'partial':              { bg: 'bg-[#FDF4E3]', fg: 'text-[#92650B]', label: 'partial' },
  'overdue':              { bg: 'bg-[#FBEBEA]', fg: 'text-[#B0362A]', label: 'overdue' },
  'pending-verification': { bg: 'bg-[#FDF4E3]', fg: 'text-[#92650B]', label: 'pending verification' },
  'awaiting-reply':       { bg: 'bg-[#FBEBEA]', fg: 'text-[#B0362A]', label: 'awaiting your reply' },
  'action-required':      { bg: 'bg-[#FDF4E3]', fg: 'text-[#92650B]', label: 'action required' },
  'booked':               { bg: 'bg-[#E6F0E9]', fg: 'text-[#2F7D4E]', label: 'booked' },
  'acknowledged':         { bg: 'bg-[#E6F0E9]', fg: 'text-[#2F7D4E]', label: 'acknowledged' },
  'draft':                { bg: 'bg-[#EEE9DC]', fg: 'text-[#6B6458]', label: 'draft' },
};

export function ParentStatusPill({
  state,
  children,
  className,
}: {
  state: ParentStatusState;
  children?: ReactNode;
  className?: string;
}) {
  const s = PILL[state];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em]',
        s.bg,
        s.fg,
        className,
      )}
    >
      {children ?? s.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Child chip — shows avatar + name + form + coloured dot             */
/* ------------------------------------------------------------------ */

const CHILD_DOT: Record<ParentChild['colourTone'], string> = {
  terracotta: 'bg-terracotta',
  ochre: 'bg-ochre',
  earth: 'bg-earth',
  sage: 'bg-ok',
};

export function ChildChip({
  child,
  href,
  size = 'md',
  className,
}: {
  child: Pick<ParentChild, 'firstName' | 'lastName' | 'form' | 'colourTone' | 'avatarInitials'>;
  href?: string;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const inner = (
    <>
      <span
        className={cn('h-1.5 w-1.5 flex-none rounded-full', CHILD_DOT[child.colourTone])}
        aria-hidden
      />
      <EditorialAvatar name={`${child.firstName} ${child.lastName}`} size={size === 'sm' ? 'xs' : 'sm'} />
      <span className="font-sans text-[13px] font-medium text-ink">
        {child.firstName} {child.lastName}
      </span>
      <span className="text-sand">·</span>
      <span className="font-sans text-[12px] text-stone">{child.form.replace('Form ', '')}</span>
    </>
  );

  const base =
    'inline-flex items-center gap-2 rounded border border-sand bg-white py-1 pl-2 pr-3 transition-colors';
  if (href) {
    return (
      <Link
        href={href}
        className={cn(base, 'hover:border-terracotta hover:bg-sand-light/40', className)}
      >
        {inner}
      </Link>
    );
  }
  return <span className={cn(base, className)}>{inner}</span>;
}

export function ChildColourDot({
  tone,
  className,
}: {
  tone: ParentChild['colourTone'];
  className?: string;
}) {
  return (
    <span
      className={cn('h-1.5 w-1.5 flex-none rounded-full', CHILD_DOT[tone], className)}
      aria-hidden
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Attendance heatmap cell                                            */
/* ------------------------------------------------------------------ */

export function HeatmapCell({
  kind,
  title,
}: {
  kind:
    | 'present'
    | 'absent-unexcused'
    | 'absent-excused'
    | 'late'
    | 'excused-leave'
    | 'weekend'
    | 'holiday'
    | 'future';
  title: string;
}) {
  const colour = {
    'present': 'bg-ok/85',
    'absent-unexcused': 'bg-danger',
    'absent-excused': 'bg-stone/50',
    'late': 'bg-ochre',
    'excused-leave': 'bg-stone/30',
    'weekend': 'bg-sand',
    'holiday': 'bg-earth/20',
    'future': 'bg-sand-light border border-dashed border-sand',
  }[kind];
  return <span title={title} className={cn('block h-4 w-4 rounded-sm', colour)} />;
}

/* ------------------------------------------------------------------ */
/*  Page header (identical shape to teacher's; included here so parent */
/*  pages don't need to import teacher code).                          */
/* ------------------------------------------------------------------ */

export function ParentPageHeader({
  eyebrow,
  title,
  accent,
  subtitle,
  right,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-sand pb-6">
      <div>
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-earth">
          {eyebrow}
        </p>
        <h1 className="mt-2 font-display text-[clamp(1.75rem,3vw,2.25rem)] text-ink">
          {title}
          {accent ? <span className="text-terracotta"> {accent}</span> : null}
        </h1>
        {subtitle ? <p className="mt-1 font-sans text-[13px] text-stone">{subtitle}</p> : null}
      </div>
      {right ? <div className="flex items-center gap-2">{right}</div> : null}
    </header>
  );
}
