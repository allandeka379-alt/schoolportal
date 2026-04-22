'use client';

import { useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

import { EditorialCard, SectionEyebrow, TrendArrow } from '@/components/student/primitives';
import { ClassChip, TeacherPageHeader } from '@/components/teacher/primitives';
import { REPORT_SUBJECTS, type ReportSubject } from '@/lib/mock/teacher-extras';

/**
 * End-of-term reports — §10.
 *
 *   - Progress bar (written / drafting / not-started)
 *   - Left column: academic summary (read-only, sourced from gradebook)
 *   - Right column: comment editor with word count, Suggest, comment bank
 *   - Save & next student navigates linearly through class
 */
export default function ReportsPage() {
  const [subjects, setSubjects] = useState<ReportSubject[]>([...REPORT_SUBJECTS]);
  const [idx, setIdx] = useState(0);
  const current = subjects[idx]!;
  const [draft, setDraft] = useState(current.commentDraft ?? '');

  const written = subjects.filter((s) => s.commentStatus === 'written').length;
  const drafting = subjects.filter((s) => s.commentStatus === 'draft').length;
  const progressPct = (written / subjects.length) * 100;
  const words = draft.trim().split(/\s+/).filter(Boolean).length;

  function goto(nextIdx: number) {
    // Save current draft as "draft" status when navigating away.
    setSubjects((prev) =>
      prev.map((s, i) =>
        i === idx ? { ...s, commentDraft: draft, commentStatus: draft ? 'draft' : 'not-started' } : s,
      ),
    );
    const wrapped = Math.max(0, Math.min(subjects.length - 1, nextIdx));
    setIdx(wrapped);
    setDraft(subjects[wrapped]?.commentDraft ?? '');
  }

  function saveAndNext() {
    setSubjects((prev) =>
      prev.map((s, i) =>
        i === idx ? { ...s, commentDraft: draft, commentStatus: 'written' } : s,
      ),
    );
    if (idx < subjects.length - 1) {
      setIdx(idx + 1);
      setDraft(subjects[idx + 1]?.commentDraft ?? '');
    }
  }

  return (
    <div className="space-y-8">
      <TeacherPageHeader
        eyebrow="End-of-term reports"
        title="Comments for Form 4A,"
        accent="Term 2."
        subtitle="Review, edit, submit to HOD. Reports release to parents after head sign-off."
      />

      {/* Progress bar */}
      <EditorialCard className="p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-sans text-[12px] text-stone">
              {written} of {subjects.length} comments written · {drafting} in draft
            </p>
            <div className="mt-2 h-2 w-[320px] max-w-full overflow-hidden rounded-full bg-sand">
              <div className="h-full bg-terracotta" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
          <button
            type="button"
            disabled={written < subjects.length}
            className="btn-terracotta disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            Submit all to HOD
          </button>
        </div>

        {/* Per-student grid */}
        <ul className="mt-5 grid grid-cols-4 gap-1.5 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-16">
          {subjects.map((s, i) => {
            const tone =
              s.commentStatus === 'written'
                ? 'bg-ok'
                : s.commentStatus === 'draft'
                ? 'bg-ochre'
                : 'bg-sand';
            const active = i === idx;
            return (
              <li key={s.studentId}>
                <button
                  type="button"
                  onClick={() => goto(i)}
                  title={`${s.studentName} · ${s.commentStatus}`}
                  className={[
                    'block h-6 w-full rounded-sm transition-all',
                    tone,
                    active ? 'ring-2 ring-offset-1 ring-terracotta' : 'hover:scale-105',
                  ].join(' ')}
                  aria-label={s.studentName}
                />
              </li>
            );
          })}
          {/* Fill to 32 for visual completeness */}
          {Array.from({ length: Math.max(0, 32 - subjects.length) }).map((_, i) => (
            <li key={`empty-${i}`} className="h-6 rounded-sm bg-sand opacity-40" />
          ))}
        </ul>
      </EditorialCard>

      {/* Main editor */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Academic summary */}
        <aside className="lg:col-span-5">
          <EditorialCard className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-sand px-6 py-4">
              <div>
                <SectionEyebrow>Academic summary</SectionEyebrow>
                <p className="mt-1 font-display text-[20px] text-ink">{current.studentName}</p>
                <ClassChip
                  form={current.classLabel.split('A')[0]?.trim() ?? '4'}
                  stream="A"
                  subjectName="Mathematics"
                  subjectTone="ochre"
                  className="mt-2"
                />
              </div>
              <TrendArrow direction={current.marks.trend} />
            </div>
            <dl className="divide-y divide-sand-light">
              <Row label="CA1" value={`${current.marks.ca1}%`} />
              <Row label="CA2" value={`${current.marks.ca2}%`} />
              <Row label="Mid-term" value={`${current.marks.midterm}%`} />
              <Row label="End-term" value={`${current.marks.endterm}%`} />
              <Row label="Term total" value={`${current.marks.total}%`} strong />
              <Row label="Grade" value={current.marks.grade} strong />
              <Row label="Class average" value={`${current.marks.classAverage}%`} muted />
              <Row
                label="Position"
                value={`${current.marks.position} of ${current.marks.classSize}`}
                muted
              />
              <Row label="Attendance" value={`${current.marks.attendance}%`} muted />
            </dl>
          </EditorialCard>

          <p className="mt-3 font-sans text-[12px] italic text-stone">
            Marks are read-only here — edits must go through the gradebook with an audit entry.
          </p>
        </aside>

        {/* Comment editor */}
        <section className="lg:col-span-7">
          <EditorialCard className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-sand px-6 py-4">
              <SectionEyebrow>Your comment</SectionEyebrow>
              <span
                className={[
                  'font-sans text-[12px]',
                  words < 60 ? 'text-ochre' : words > 120 ? 'text-ochre' : 'text-stone',
                ].join(' ')}
              >
                {words} words · target 60–120
              </span>
            </div>

            <div className="flex items-center gap-2 border-b border-sand-light px-6 py-2">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded border border-sand bg-white px-2.5 py-1 font-sans text-[11px] font-medium text-terracotta hover:bg-sand-light"
              >
                <Sparkles className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                Suggest phrasing
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded border border-sand bg-white px-2.5 py-1 font-sans text-[11px] font-medium text-earth hover:bg-sand-light"
              >
                Insert from comment bank
              </button>
              <span className="ml-auto font-sans text-[11px] text-stone">
                Auto-saved 12s ago
              </span>
            </div>

            <textarea
              rows={12}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a specific, supportive 60–120-word comment. The machine can suggest a starting point — but it is not the final word."
              className="w-full border-0 bg-white px-6 py-5 font-serif text-[16px] leading-relaxed text-ink placeholder-stone focus:outline-none"
            />

            <div className="flex items-center justify-between border-t border-sand px-6 py-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goto(idx - 1)}
                  disabled={idx === 0}
                  className="inline-flex h-9 items-center rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light disabled:opacity-40"
                >
                  <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => goto(idx + 1)}
                  disabled={idx === subjects.length - 1}
                  className="inline-flex h-9 items-center rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                </button>
              </div>
              <button type="button" onClick={saveAndNext} className="btn-terracotta">
                Save &amp; next student
                <ChevronRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </button>
            </div>
          </EditorialCard>

          <p className="mt-3 font-sans text-[12px] italic text-stone">
            Suggestions are starting points, not final comments. Your voice is what the parent
            values.
          </p>
        </section>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
  muted,
}: {
  label: string;
  value: string;
  strong?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-2.5">
      <dt
        className={[
          'font-sans text-[12px] uppercase tracking-[0.14em]',
          muted ? 'text-stone' : 'text-earth font-semibold',
        ].join(' ')}
      >
        {label}
      </dt>
      <dd
        className={[
          'font-mono tabular-nums',
          strong ? 'text-[18px] text-ink' : 'text-[13px] text-ink',
          muted ? 'text-stone' : '',
        ].join(' ')}
      >
        {value}
      </dd>
    </div>
  );
}
