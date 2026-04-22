'use client';

import Link from 'next/link';
import { ArrowRight, MessageSquarePlus } from 'lucide-react';

import { EditorialCard, SectionEyebrow, TrendArrow } from '@/components/student/primitives';
import { ParentPageHeader } from '@/components/parent/primitives';
import { useSelectedChild } from '@/components/parent/selected-child-context';
import { gradesFor } from '@/lib/mock/parent-extras';

/**
 * Parent progress — §06.
 *
 * Per-subject cards with prominent trend arrows (parents care about direction).
 * Contextual line below the average. Subjects with a new mark carry a small
 * dot. Clicking navigates to subject detail (simplified for demo).
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
                <Link
                  href="#"
                  className="group block h-full rounded border border-sand bg-white p-5 transition-all duration-200 ease-out-soft hover:-translate-y-px hover:shadow-e2"
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
                </Link>
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
      {sub ? (
        <p className="mt-1 font-sans text-[11px] text-stone">{sub}</p>
      ) : null}
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
