'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  MessageSquarePlus,
  X,
} from 'lucide-react';

import { EditorialCard, SectionEyebrow, TrendArrow } from '@/components/student/primitives';
import { ParentPageHeader } from '@/components/parent/primitives';
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

  return (
    <div className="space-y-8">
      <ParentPageHeader
        eyebrow={`${selectedChild.firstName} ${selectedChild.lastName} · ${selectedChild.form}`}
        title="Academic progress,"
        accent="this term."
        subtitle={`${contextLine} ${vsClass}`}
        right={
          <Link
            href="/parent/reports"
            className="inline-flex h-10 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-earth hover:bg-sand-light"
          >
            View end-of-term report
          </Link>
        }
      />

      {/* Summary row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <SummaryTile label="Term average" value={`${average}%`} sub="Current position">
          <span className="font-sans text-[13px] text-stone">
            {selectedChild.classPosition} of {selectedChild.classSize}
          </span>
        </SummaryTile>
        <SummaryTile label="Trend" value={null}>
          <span className="inline-flex items-center gap-2 font-sans text-[16px] text-ink">
            <TrendArrow direction={selectedChild.termAverageTrend} />
            {selectedChild.deltaFromLastTerm > 0
              ? `+${selectedChild.deltaFromLastTerm} pts`
              : `${selectedChild.deltaFromLastTerm} pts`}
            <span className="font-sans text-[13px] text-stone">from Term 1</span>
          </span>
        </SummaryTile>
        <SummaryTile label="Class average" value={`${classAverage}%`} sub="For context">
          <span className="font-sans text-[13px] text-stone">
            {average >= classAverage ? 'Above' : 'Below'} class average
          </span>
        </SummaryTile>
      </div>

      {/* Subject grid */}
      <section>
        <SectionEyebrow>Subjects</SectionEyebrow>
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {subjects.map((s) => {
            const percentTone =
              s.percent >= 80 ? 'text-ok' : s.percent >= 50 ? 'text-ink' : 'text-warn';
            const gradeSurface =
              s.grade === 'A'
                ? 'bg-[#EBE8F5] text-[#4F3E99]'
                : s.grade === 'B'
                ? 'bg-sand-light text-earth'
                : s.grade === 'C'
                ? 'bg-[#FDF4E3] text-[#92650B]'
                : 'bg-[#FBEBEA] text-[#B0362A]';

            return (
              <li key={s.subjectCode}>
                <button
                  type="button"
                  onClick={() => setPreview(s)}
                  className="group flex h-full w-full flex-col rounded border border-sand bg-white p-5 text-left transition-all duration-200 ease-out-soft hover:-translate-y-px hover:shadow-e2"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                      {s.subjectCode}
                    </p>
                    {s.hasNewMark ? (
                      <span
                        className="inline-flex h-5 items-center rounded-sm bg-terracotta/10 px-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-terracotta-hover"
                        aria-label="New mark this week"
                      >
                        New
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 font-display text-[18px] leading-snug text-ink group-hover:text-earth">
                    {s.subjectName}
                  </p>
                  <p className="mt-0.5 font-sans text-[11px] text-stone">{s.teacher}</p>
                  <div className="mt-5 flex items-end justify-between">
                    <span className={`font-display text-[40px] leading-none tabular-nums ${percentTone}`}>
                      {s.percent}
                      <span className="text-[18px] text-stone">%</span>
                    </span>
                    <TrendArrow direction={s.trend} />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span
                      className={`rounded-sm px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] ${gradeSurface}`}
                    >
                      Grade {s.grade}
                    </span>
                    <span className="font-sans text-[12px] text-stone">
                      class avg {s.classAverage}%
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Encouragement block */}
      <EditorialCard className="p-6">
        <SectionEyebrow>How to help at home</SectionEyebrow>
        <p className="mt-3 font-serif text-[15px] leading-relaxed text-ink">
          Three short ideas, contributed by {selectedChild.firstName}&rsquo;s teachers for
          this term. Never prescriptive — just suggestions if a conversation at home would help.
        </p>
        <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
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
      </EditorialCard>

      {/* Teacher shortcut */}
      <EditorialCard className="flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <SectionEyebrow>Message a teacher</SectionEyebrow>
          <p className="mt-2 font-serif text-[15px] text-ink">
            Specific question about {selectedChild.firstName}&rsquo;s progress in a subject?
            Start a conversation with the teacher directly.
          </p>
        </div>
        <Link
          href="/parent/messages"
          className="inline-flex h-10 items-center gap-2 rounded bg-terracotta px-4 font-sans text-[13px] font-semibold text-cream hover:bg-terracotta-hover"
        >
          <MessageSquarePlus className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          Open messages
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
        </Link>
      </EditorialCard>

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

function SummaryTile({
  label,
  value,
  sub,
  children,
}: {
  label: string;
  value: string | null;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <EditorialCard className="px-5 py-4">
      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
        {label}
      </p>
      {value ? (
        <p className="mt-1 font-display text-[30px] leading-none text-ink tabular-nums">{value}</p>
      ) : null}
      <div className="mt-2">{children}</div>
      {sub ? <p className="mt-1 font-sans text-[11px] text-stone">{sub}</p> : null}
    </EditorialCard>
  );
}

function SuggestionCard({ subject, body }: { subject: string; body: string }) {
  return (
    <li className="rounded border border-sand bg-sand-light/40 px-4 py-3">
      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-earth">
        {subject}
      </p>
      <p className="mt-1.5 font-serif text-[14px] text-ink">{body}</p>
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
