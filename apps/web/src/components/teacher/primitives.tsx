import Link from 'next/link';
import type { ReactNode } from 'react';

import { cn } from '@hha/ui';

import { EditorialAvatar } from '@/components/student/primitives';
import type { TeacherClass } from '@/lib/mock/teacher-extras';

/**
 * Teacher-portal primitives — built on the editorial palette (shared with
 * the landing and student portal). Teacher-specific status pills and chips.
 *
 * Spec reference: §03 Global UI Patterns.
 */

/* ------------------------------------------------------------------ */
/*  Status pills (teacher states — §03)                                */
/* ------------------------------------------------------------------ */

export type TeacherStatusState =
  | 'draft'
  | 'scheduled'
  | 'active'
  | 'to-mark'
  | 'marked'
  | 'returned'
  | 'archived'
  | 'flagged';

const PILL: Record<TeacherStatusState, { bg: string; fg: string; label: string }> = {
  draft:     { bg: 'bg-[#EEE9DC]', fg: 'text-[#6B6458]', label: 'draft' },
  scheduled: { bg: 'bg-[#FDF4E3]', fg: 'text-[#92650B]', label: 'scheduled' },
  active:    { bg: 'bg-[#E6F0E9]', fg: 'text-[#2F7D4E]', label: 'active' },
  'to-mark': { bg: 'bg-[#FBEBEA]', fg: 'text-[#B0362A]', label: 'to mark' },
  marked:    { bg: 'bg-[#EBE8F5]', fg: 'text-[#4F3E99]', label: 'marked' },
  returned:  { bg: 'bg-[#FAF5EB]', fg: 'text-[#5C3A1E]', label: 'returned' },
  archived:  { bg: 'bg-[#F5EEDC]', fg: 'text-[#8A8275]', label: 'archived' },
  flagged:   { bg: 'bg-[#FBEBEA]', fg: 'text-[#B0362A]', label: 'flagged' },
};

export function TeacherStatusPill({
  state,
  children,
  className,
}: {
  state: TeacherStatusState;
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
/*  Class chip — §03                                                   */
/* ------------------------------------------------------------------ */

const SUBJECT_DOT: Record<NonNullable<TeacherClass['subjectTone']>, string> = {
  ochre: 'bg-ochre',
  terracotta: 'bg-terracotta',
  earth: 'bg-earth',
  sage: 'bg-ok',
};

export interface ClassChipProps {
  form: string;
  stream: string;
  subjectName?: string;
  subjectTone?: TeacherClass['subjectTone'];
  href?: string;
  className?: string;
}

export function ClassChip({
  form,
  stream,
  subjectName,
  subjectTone = 'ochre',
  href,
  className,
}: ClassChipProps) {
  const body = (
    <>
      <span
        className={cn('h-1.5 w-1.5 flex-none rounded-full', SUBJECT_DOT[subjectTone])}
        aria-hidden
      />
      <span className="font-sans text-[13px] font-medium text-ink">
        {form}
        {stream}
      </span>
      {subjectName ? (
        <>
          <span className="text-sand">·</span>
          <span className="font-sans text-[13px] text-stone">{subjectName}</span>
        </>
      ) : null}
    </>
  );
  const base =
    'inline-flex items-center gap-1.5 rounded border border-sand bg-white px-2.5 py-1 transition-colors';
  if (href) {
    return (
      <Link href={href} className={cn(base, 'hover:border-terracotta hover:bg-sand-light/40', className)}>
        {body}
      </Link>
    );
  }
  return <span className={cn(base, className)}>{body}</span>;
}

/* ------------------------------------------------------------------ */
/*  Student chip — §03                                                 */
/* ------------------------------------------------------------------ */

export function StudentChip({
  name,
  formLabel,
  href,
  className,
}: {
  name: string;
  formLabel?: string;
  href?: string;
  className?: string;
}) {
  const inner = (
    <>
      <EditorialAvatar name={name} size="xs" tone="terracotta" />
      <span className="font-sans text-[13px] font-medium text-ink">{name}</span>
      {formLabel ? (
        <>
          <span className="text-sand">·</span>
          <span className="font-sans text-[12px] text-stone">{formLabel}</span>
        </>
      ) : null}
    </>
  );
  const base =
    'inline-flex items-center gap-2 rounded border border-sand bg-white py-1 pl-1 pr-2.5 transition-colors';
  if (href) {
    return (
      <Link href={href} className={cn(base, 'hover:border-terracotta hover:bg-sand-light/40', className)}>
        {inner}
      </Link>
    );
  }
  return <span className={cn(base, className)}>{inner}</span>;
}

/* ------------------------------------------------------------------ */
/*  Teacher "tag" — HOD / FT / headmaster (compact pastoral marker)    */
/* ------------------------------------------------------------------ */

export function TeacherTag({
  label,
  tone = 'earth',
}: {
  label: string;
  tone?: 'earth' | 'terracotta' | 'ochre';
}) {
  const cls = {
    earth: 'bg-earth text-cream',
    terracotta: 'bg-terracotta text-cream',
    ochre: 'bg-ochre text-ink',
  }[tone];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-1.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.14em]',
        cls,
      )}
    >
      {label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Attention list item                                                */
/* ------------------------------------------------------------------ */

export function AttentionRow({
  tone,
  label,
  detail,
  href,
}: {
  tone: 'overdue' | 'warning' | 'info';
  label: string;
  detail: string;
  href: string;
}) {
  const accent = {
    overdue: 'bg-danger',
    warning: 'bg-ochre',
    info: 'bg-earth/40',
  }[tone];
  const textTone = {
    overdue: 'text-danger',
    warning: 'text-ochre',
    info: 'text-stone',
  }[tone];
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 border-b border-sand-light px-5 py-3.5 last:border-0 hover:bg-sand-light/40"
    >
      <span className={cn('mt-1.5 block h-2 w-2 flex-none rounded-full', accent)} aria-hidden />
      <span className="min-w-0 flex-1">
        <span className="block font-sans text-[14px] font-medium text-ink group-hover:text-earth">
          {label}
        </span>
        <span className={cn('block font-sans text-[12px]', textTone)}>{detail}</span>
      </span>
      <span className="flex-none font-sans text-[13px] text-stone group-hover:text-terracotta">
        →
      </span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Teacher page header (shared)                                       */
/* ------------------------------------------------------------------ */

export function TeacherPageHeader({
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
