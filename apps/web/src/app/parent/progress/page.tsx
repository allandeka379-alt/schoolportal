'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  MessageSquarePlus,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/student/progress-ring';
import { EditorialCard, SectionEyebrow, TrendArrow } from '@/components/student/primitives';
import { useSelectedChild } from '@/components/parent/selected-child-context';
import { gradesFor } from '@/lib/mock/parent-extras';

type Subject = ReturnType<typeof gradesFor>[number];

/**
 * Parent progress — §06.
 *
 * Per-subject cards with prominent trend arrows. Clicking a card opens a
 * drawer showing: breakdown of continuous / mid / end marks, six-term
 * trend, teacher's comment for the term, and what to do next (book a
 * meeting / message the teacher / open library).
 */
export default function ProgressPage() {
  const { selectedChild } = useSelectedChild();
  const subjects = gradesFor(selectedChild.id);
  const average = Math.round(
    subjects.reduce((sum, s) => sum + s.percent, 0) / subjects.length,
  );
  const classAverage = Math.round(
    subjects.reduce((sum, s) => sum + s.classAverage, 0) / subjects.length,
  );

  const [preview, setPreview] = useState<Subject | null>(null);

  const contextLine =
    selectedChild.deltaFromLastTerm > 0
      ? `${selectedChild.firstName}'s average is up ${selectedChild.deltaFromLastTerm} points from last term.`
      : selectedChild.deltaFromLastTerm < 0
      ? `${selectedChild.firstName}'s average is ${Math.abs(selectedChild.deltaFromLastTerm)} points below last term.`
      : `${selectedChild.firstName}'s average is stable vs last term.`;

  const vsClass =
    average >= classAverage
      ? `${average - classAverage} points above the class average.`
      : `${classAverage - average} points below the class average.`;

  const termRingTone: 'success' | 'brand' | 'warning' | 'danger' =
    average >= 80 ? 'success' : average >= 60 ? 'brand' : average >= 50 ? 'warning' : 'danger';

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-small text-muted">
            {selectedChild.firstName} {selectedChild.lastName} · {selectedChild.form}
          </p>
          <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-ink">
            Academic progress
          </h1>
          <p className="mt-2 text-small text-muted">
            {contextLine} {vsClass}
          </p>
        </div>
        <Link
          href="/parent/reports"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface"
        >
          View end-of-term report
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
        </Link>
      </header>

      {/* KPI tiles */}
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <li className="rounded-lg border border-line bg-card p-5 shadow-card-sm">
          <div className="flex items-center justify-between">
            <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
              Term average
            </p>
            <ProgressRing value={average} size={44} stroke={5} tone={termRingTone} />
          </div>
          <p className="mt-3 text-h1 tabular-nums text-ink">{average}%</p>
          <p className="mt-1 text-micro text-muted">
            Position {selectedChild.classPosition} of {selectedChild.classSize}
          </p>
        </li>
        <li className="rounded-lg border border-line bg-card p-5 shadow-card-sm">
          <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">Trend</p>
          <p className="mt-3 flex items-baseline gap-2 text-h1 text-ink">
            {selectedChild.deltaFromLastTerm > 0 ? (
              <TrendingUp className="h-6 w-6 text-success" strokeWidth={2} aria-hidden />
            ) : selectedChild.deltaFromLastTerm < 0 ? (
              <TrendingDown className="h-6 w-6 text-danger" strokeWidth={2} aria-hidden />
            ) : null}
            <span className="tabular-nums">
              {selectedChild.deltaFromLastTerm > 0 ? '+' : ''}
              {selectedChild.deltaFromLastTerm}
            </span>
            <span className="text-small text-muted">pts</span>
          </p>
          <p className="mt-1 text-micro text-muted">vs Term 1</p>
        </li>
        <li className="rounded-lg border border-line bg-card p-5 shadow-card-sm">
          <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
            Class average
          </p>
          <p className="mt-3 text-h1 tabular-nums text-ink">{classAverage}%</p>
          <p className="mt-1 text-micro text-muted">
            {average >= classAverage
              ? `+${average - classAverage} pts above peers`
              : `${classAverage - average} pts below peers`}
          </p>
        </li>
      </ul>

      {/* Subject grid */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-h3 text-ink">Subjects</h2>
          <p className="text-small text-muted">Tap a subject to drill down</p>
        </div>
        <ul className="stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {subjects.map((s) => {
            const ringTone: 'success' | 'brand' | 'warning' | 'danger' =
              s.percent >= 80 ? 'success' : s.percent >= 65 ? 'brand' : s.percent >= 50 ? 'warning' : 'danger';
            const gradeBadge: 'success' | 'info' | 'warning' | 'danger' =
              s.grade === 'A' ? 'success' : s.grade === 'B' ? 'info' : s.grade === 'C' ? 'warning' : 'danger';
            return (
              <li key={s.subjectCode}>
                <button
                  type="button"
                  onClick={() => setPreview(s)}
                  className="hover-lift group flex h-full w-full flex-col gap-4 rounded-lg border border-line bg-card p-5 text-left"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                      <Badge tone="brand">
                        <BookOpen className="h-3 w-3" strokeWidth={2} aria-hidden />
                        {s.subjectCode}
                      </Badge>
                      {s.hasNewMark ? (
                        <Badge tone="warning" dot>
                          New
                        </Badge>
                      ) : null}
                    </div>
                    <ProgressRing value={s.percent} tone={ringTone} size={52} stroke={5} />
                  </div>
                  <div>
                    <p className="text-small font-semibold text-ink group-hover:text-brand-primary">
                      {s.subjectName}
                    </p>
                    <p className="mt-0.5 text-micro text-muted">
                      {s.teacher} · class avg {s.classAverage}%
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-line pt-3">
                    <Badge tone={gradeBadge}>Grade {s.grade}</Badge>
                    <span className="inline-flex items-center gap-1 text-micro text-muted">
                      {s.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3 text-success" strokeWidth={2} aria-hidden />
                      ) : s.trend === 'down' ? (
                        <TrendingDown className="h-3 w-3 text-danger" strokeWidth={2} aria-hidden />
                      ) : null}
                      this term
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Encouragement block */}
      <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
        <header className="border-b border-line px-5 py-3.5">
          <h2 className="text-small font-semibold text-ink">How to help at home</h2>
          <p className="text-micro text-muted">
            Three short ideas, contributed by {selectedChild.firstName}&rsquo;s teachers. Never
            prescriptive — just suggestions.
          </p>
        </header>
        <ul className="grid grid-cols-1 gap-3 p-5 md:grid-cols-3">
          <SuggestionCard
            subject="Mathematics · Mrs Dziva"
            body="Review last week's Problem Set 7 together. Farai benefits from saying his working out loud."
          />
          <SuggestionCard
            subject="English · Mr Gondo"
            body="One short essay a week, any topic, 250 words. Fluency grows in short sessions."
          />
          <SuggestionCard
            subject="Biology · Dr Madziva"
            body="The photosynthesis diagrams are up on the library wall — a short visit before the test would help."
          />
        </ul>
      </section>

      {/* Teacher shortcut */}
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-card p-6 shadow-card-sm">
        <div>
          <p className="text-micro font-semibold uppercase tracking-[0.12em] text-brand-primary">
            Message a teacher
          </p>
          <p className="mt-2 text-body text-ink">
            Specific question about {selectedChild.firstName}&rsquo;s progress in a subject?
            Start a conversation with the teacher directly.
          </p>
        </div>
        <Link
          href="/parent/messages"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-primary px-5 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md"
        >
          <MessageSquarePlus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          Open messages
          <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </Link>
      </section>

      {preview ? (
        <SubjectDrawer
          subject={preview}
          childName={selectedChild.firstName}
          onClose={() => setPreview(null)}
        />
      ) : null}
    </div>
  );
}

function SuggestionCard({ subject, body }: { subject: string; body: string }) {
  return (
    <li className="rounded-lg border border-line bg-surface/60 p-4">
      <p className="text-micro font-semibold uppercase tracking-[0.12em] text-brand-primary">
        {subject}
      </p>
      <p className="mt-2 text-small text-ink">{body}</p>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/*  Subject drawer                                                     */
/* ------------------------------------------------------------------ */

function SubjectDrawer({
  subject,
  childName,
  onClose,
}: {
  subject: Subject;
  childName: string;
  onClose: () => void;
}) {
  const history = useMemo(() => buildHistory(subject), [subject]);
  const trend = useMemo(() => buildTermTrend(subject), [subject]);
  const comment = useMemo(() => teacherComment(subject, childName), [subject, childName]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-stretch justify-end bg-ink/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-2xl flex-col overflow-hidden bg-white shadow-e3"
      >
        <div className="flex items-start justify-between gap-3 border-b border-sand px-6 py-4">
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
              {subject.subjectCode}
            </p>
            <h2 className="mt-1 font-display text-[22px] text-ink">{subject.subjectName}</h2>
            <p className="font-sans text-[13px] text-stone">{subject.teacher}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-2 text-stone transition-colors hover:bg-sand-light hover:text-ink"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Headline */}
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-stone">Current</p>
              <p className="mt-1 font-display text-[52px] leading-none text-ink tabular-nums">
                {subject.percent}
                <span className="text-[20px] text-stone">%</span>
              </p>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-stone">Grade</p>
              <p className="mt-1 font-display text-[26px] text-ink">{subject.grade}</p>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-stone">Class avg</p>
              <p className="mt-1 font-display text-[26px] text-stone">{subject.classAverage}%</p>
            </div>
            <div className="ml-auto inline-flex items-center gap-2 rounded border border-sand bg-cream px-3 py-2 font-sans text-[13px] text-stone">
              <TrendArrow direction={subject.trend} />
              {subject.trend === 'up'
                ? 'Trending up'
                : subject.trend === 'down'
                ? 'Trending down'
                : 'Steady'}
            </div>
          </div>

          {/* Assessment history */}
          <section className="rounded border border-sand bg-white">
            <div className="border-b border-sand px-5 py-3">
              <SectionEyebrow>This term · assessment history</SectionEyebrow>
              <p className="mt-1 font-sans text-[12px] text-stone">
                {history.length} assessments so far
              </p>
            </div>
            <ul className="divide-y divide-sand-light">
              {history.map((h) => (
                <li key={h.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[15px] text-ink">{h.label}</p>
                    <p className="mt-0.5 font-sans text-[12px] text-stone">
                      {h.kind} · {h.date} · weight {h.weight}%
                    </p>
                  </div>
                  <p className="flex-none font-mono tabular-nums text-[14px] text-ink">
                    {h.score}
                    <span className="text-stone text-[12px]"> / {h.max}</span>
                  </p>
                  <span className="w-12 flex-none text-right font-mono tabular-nums text-[12px] text-stone">
                    {((h.score / h.max) * 100).toFixed(0)}%
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Six-term trend */}
          <section className="rounded border border-sand bg-white p-5">
            <SectionEyebrow>Six-term trend</SectionEyebrow>
            <svg viewBox="0 0 480 120" className="mt-3 h-32 w-full">
              <polyline
                fill="none"
                stroke="rgb(var(--accent))"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                points={trend
                  .map((d, i) => `${i * (480 / (trend.length - 1))},${yFor(d.score, trend)}`)
                  .join(' ')}
              />
              {trend.map((d, i) => (
                <circle
                  key={d.term}
                  cx={i * (480 / (trend.length - 1))}
                  cy={yFor(d.score, trend)}
                  r={3.5}
                  fill="rgb(var(--accent))"
                />
              ))}
            </svg>
            <ul className="mt-3 grid grid-cols-6 gap-1 font-mono text-[11px] uppercase tracking-[0.08em] text-stone">
              {trend.map((d, i) => (
                <li
                  key={d.term}
                  className={[
                    'flex flex-col items-center',
                    i === trend.length - 1 ? 'font-semibold text-ink' : '',
                  ].join(' ')}
                >
                  <span className="font-sans tabular-nums">{d.score}%</span>
                  <span>{d.term}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Teacher comment */}
          <section className="rounded border border-sand bg-sand-light/40 p-5">
            <SectionEyebrow>What the teacher says</SectionEyebrow>
            <blockquote className="mt-3 font-serif text-[16px] leading-relaxed text-ink">
              &ldquo;{comment}&rdquo;
            </blockquote>
            <p className="mt-3 font-sans text-[12px] text-stone">— {subject.teacher}</p>
          </section>

          {/* Shortcuts */}
          <section>
            <SectionEyebrow>What you can do next</SectionEyebrow>
            <ul className="mt-3 space-y-2">
              <Shortcut
                icon={<MessageSquarePlus className="h-4 w-4" strokeWidth={1.5} aria-hidden />}
                title={`Message ${subject.teacher}`}
                body="Ask a specific question about the latest mark or an upcoming piece of work."
                href={`/parent/messages`}
              />
              <Shortcut
                icon={<BookOpen className="h-4 w-4" strokeWidth={1.5} aria-hidden />}
                title={`Open ${subject.subjectCode} library`}
                body="Past papers, revision notes, and class recordings in one place."
                href={`/student/library?subject=${subject.subjectCode}`}
              />
            </ul>
          </section>
        </div>

        <div className="flex items-center justify-between border-t border-sand bg-white px-6 py-4">
          <p className="font-sans text-[12px] text-stone">
            All marks shown are final. Moderated marks carry an “M” tag in the school gradebook.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-earth hover:bg-sand-light"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Shortcut({
  icon,
  title,
  body,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-start gap-3 rounded border border-sand bg-white p-4 transition-colors hover:bg-sand-light/40"
      >
        <span className="mt-0.5 text-earth">{icon}</span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[15px] text-ink group-hover:text-earth">{title}</p>
          <p className="mt-0.5 font-serif text-[13px] text-stone">{body}</p>
        </div>
        <ChevronRight
          className="h-4 w-4 flex-none text-stone transition-transform group-hover:translate-x-0.5 group-hover:text-terracotta"
          strokeWidth={1.5}
          aria-hidden
        />
      </Link>
    </li>
  );
}

function yFor(score: number, trend: { score: number }[]) {
  const max = Math.max(...trend.map((t) => t.score));
  const min = Math.min(...trend.map((t) => t.score));
  const range = Math.max(max - min, 10);
  return 120 - ((score - min) / range) * 100 - 10;
}

function buildHistory(s: Subject) {
  return [
    { id: 'h1', label: 'Baseline test', kind: 'Assessment', date: 'Week 1', score: Math.max(30, s.percent - 6), max: 100, weight: 5 },
    { id: 'h2', label: 'Class work 1', kind: 'Class work', date: 'Week 2', score: Math.max(30, s.percent - 3), max: 100, weight: 8 },
    { id: 'h3', label: 'Class work 2', kind: 'Class work', date: 'Week 3', score: Math.min(100, s.percent + 1), max: 100, weight: 8 },
    { id: 'h4', label: 'Mid-term paper', kind: 'Examination', date: 'Week 4', score: s.percent, max: 100, weight: 20 },
    { id: 'h5', label: 'Class work 3', kind: 'Class work', date: 'Week 5', score: Math.min(100, s.percent + 2), max: 100, weight: 8 },
  ];
}

function buildTermTrend(s: Subject) {
  const offsets = [-8, -6, -4, -2, -1, 0];
  return offsets.map((o, i) => ({
    term: ['T3 2024', 'T1 2025', 'T2 2025', 'T3 2025', 'T1 2026', 'T2 2026'][i]!,
    score: Math.max(30, Math.min(98, s.percent + o)),
  }));
}

function teacherComment(s: Subject, childName: string): string {
  if (s.trend === 'up') {
    return `${childName} is building momentum in ${s.subjectName}. Keep the habits that are working — particularly how ${childName} tackles problem-type questions.`;
  }
  if (s.trend === 'down') {
    return `${s.subjectName} needs attention this term. We'd recommend 20 minutes of focused review on the last assessment at home, then come see me during period 4 if it helps.`;
  }
  return `${s.subjectName} is steady. A small push this term could lift ${childName} into the next grade band — the base is strong.`;
}
