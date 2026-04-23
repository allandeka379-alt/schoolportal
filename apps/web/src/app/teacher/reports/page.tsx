'use client';

import { useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/student/progress-ring';
import { TrendArrow } from '@/components/student/primitives';
import { ClassChip } from '@/components/teacher/primitives';
import { REPORT_SUBJECTS, type ReportSubject } from '@/lib/mock/teacher-extras';

/**
 * Teacher end-of-term reports — card-dense redesign.
 *
 *   - Progress card with written/drafting/not-started counters
 *   - Per-student cell grid as a quick scrubber
 *   - Left column: academic summary card
 *   - Right column: comment editor with word count + suggest
 *   - Save & next student navigates linearly
 */
export default function ReportsPage() {
  const [subjects, setSubjects] = useState<ReportSubject[]>([...REPORT_SUBJECTS]);
  const [idx, setIdx] = useState(0);
  const current = subjects[idx]!;
  const [draft, setDraft] = useState(current.commentDraft ?? '');

  const written = subjects.filter((s) => s.commentStatus === 'written').length;
  const drafting = subjects.filter((s) => s.commentStatus === 'draft').length;
  const notStarted = subjects.filter((s) => s.commentStatus === 'not-started').length;
  const progressPct = Math.round((written / subjects.length) * 100);
  const words = draft.trim().split(/\s+/).filter(Boolean).length;

  function goto(nextIdx: number) {
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
      prev.map((s, i) => (i === idx ? { ...s, commentDraft: draft, commentStatus: 'written' } : s)),
    );
    if (idx < subjects.length - 1) {
      setIdx(idx + 1);
      setDraft(subjects[idx + 1]?.commentDraft ?? '');
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <p className="text-small text-muted">End-of-term reports</p>
        <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-ink">
          Comments for Form 4A, Term 2
        </h1>
        <p className="mt-2 text-small text-muted">
          Review, edit, submit to HOD. Reports release to parents after head sign-off.
        </p>
      </header>

      {/* KPI tiles */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiTile label="Progress" value={`${progressPct}%`} ring={progressPct} ringTone="brand" />
        <KpiTile label="Written" value={String(written)} tone="success" />
        <KpiTile label="In draft" value={String(drafting)} tone={drafting > 0 ? 'warning' : undefined} />
        <KpiTile
          label="Not started"
          value={String(notStarted)}
          tone={notStarted > 0 ? 'warning' : 'success'}
        />
      </ul>

      {/* Progress scrubber */}
      <section className="rounded-lg border border-line bg-card p-6 shadow-card-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-small font-semibold text-ink">Class progress</h2>
            <p className="text-micro text-muted">
              {written} of {subjects.length} comments written · {drafting} in draft
            </p>
          </div>
          <button
            type="button"
            disabled={written < subjects.length}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-primary px-5 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            Submit all to HOD
          </button>
        </div>

        <ul className="mt-5 grid grid-cols-4 gap-1.5 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-16">
          {subjects.map((s, i) => {
            const tone =
              s.commentStatus === 'written'
                ? 'bg-success'
                : s.commentStatus === 'draft'
                ? 'bg-warning'
                : 'bg-line';
            const activeCell = i === idx;
            return (
              <li key={s.studentId}>
                <button
                  type="button"
                  onClick={() => goto(i)}
                  title={`${s.studentName} · ${s.commentStatus}`}
                  className={[
                    'block h-7 w-full rounded-sm transition-all',
                    tone,
                    activeCell
                      ? 'ring-2 ring-brand-primary ring-offset-2 ring-offset-card'
                      : 'hover:scale-105',
                  ].join(' ')}
                  aria-label={s.studentName}
                />
              </li>
            );
          })}
          {Array.from({ length: Math.max(0, 32 - subjects.length) }).map((_, i) => (
            <li key={`empty-${i}`} className="h-7 rounded-sm bg-line opacity-40" />
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-micro text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-success" aria-hidden /> Written
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-warning" aria-hidden /> In draft
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-line" aria-hidden /> Not started
          </span>
        </div>
      </section>

      {/* Main editor */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Academic summary */}
        <aside className="lg:col-span-5">
          <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
            <header className="flex items-start justify-between gap-3 border-b border-line px-6 py-4">
              <div>
                <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
                  Academic summary
                </p>
                <p className="mt-1 text-h3 text-ink">{current.studentName}</p>
                <ClassChip
                  form={current.classLabel.split('A')[0]?.trim() ?? '4'}
                  stream="A"
                  subjectName="Mathematics"
                  subjectTone="ochre"
                  className="mt-2"
                />
              </div>
              <TrendArrow direction={current.marks.trend} />
            </header>
            <dl className="divide-y divide-line">
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
          </section>

          <p className="mt-3 text-micro italic text-muted">
            Marks are read-only here — edits must go through the gradebook with an audit entry.
          </p>
        </aside>

        {/* Comment editor */}
        <section className="lg:col-span-7">
          <div className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
            <header className="flex items-center justify-between border-b border-line px-6 py-4">
              <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
                Your comment
              </p>
              <Badge tone={words < 60 || words > 120 ? 'warning' : 'success'} dot>
                {words} words · target 60–120
              </Badge>
            </header>

            <div className="flex items-center gap-2 border-b border-line px-6 py-2">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full border border-brand-primary/30 bg-brand-primary/5 px-3 py-1 text-micro font-semibold text-brand-primary transition-colors hover:bg-brand-primary/10"
              >
                <Sparkles className="h-3 w-3" strokeWidth={1.75} aria-hidden />
                Suggest phrasing
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full border border-line bg-card px-3 py-1 text-micro font-semibold text-ink transition-colors hover:bg-surface"
              >
                Insert from comment bank
              </button>
              <span className="ml-auto text-micro text-muted">Auto-saved 12s ago</span>
            </div>

            <textarea
              rows={12}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a specific, supportive 60–120-word comment. The machine can suggest a starting point — but it is not the final word."
              className="w-full border-0 bg-card px-6 py-5 text-small leading-relaxed text-ink placeholder:text-muted focus:outline-none"
            />

            <div className="flex items-center justify-between border-t border-line px-6 py-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goto(idx - 1)}
                  disabled={idx === 0}
                  className="inline-flex h-9 items-center rounded-full border border-line bg-card px-3 text-micro font-semibold text-ink transition-colors hover:bg-surface disabled:opacity-40"
                >
                  <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => goto(idx + 1)}
                  disabled={idx === subjects.length - 1}
                  className="inline-flex h-9 items-center rounded-full border border-line bg-card px-3 text-micro font-semibold text-ink transition-colors hover:bg-surface disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                </button>
              </div>
              <button
                type="button"
                onClick={saveAndNext}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-primary px-5 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md"
              >
                Save &amp; next student
                <ChevronRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </button>
            </div>
          </div>

          <p className="mt-3 text-micro italic text-muted">
            Suggestions are starting points, not final comments. Your voice is what the parent
            values.
          </p>
        </section>
      </div>
    </div>
  );
}

function KpiTile({
  label,
  value,
  tone,
  ring,
  ringTone,
}: {
  label: string;
  value: string;
  tone?: 'brand' | 'success' | 'warning';
  ring?: number;
  ringTone?: 'success' | 'brand' | 'warning' | 'danger';
}) {
  const valueColor =
    tone === 'warning' ? 'text-warning' : tone === 'success' ? 'text-success' : tone === 'brand' ? 'text-brand-primary' : 'text-ink';
  return (
    <li className="rounded-lg border border-line bg-card p-5 shadow-card-sm">
      <div className="flex items-center justify-between">
        <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
        {ring !== undefined && ringTone ? (
          <ProgressRing value={ring} size={44} stroke={5} tone={ringTone} />
        ) : null}
      </div>
      <p className={`mt-3 text-h2 tabular-nums ${valueColor}`}>{value}</p>
    </li>
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
          'text-micro uppercase tracking-[0.12em]',
          muted ? 'text-muted' : 'font-semibold text-brand-primary',
        ].join(' ')}
      >
        {label}
      </dt>
      <dd
        className={[
          'tabular-nums',
          strong ? 'text-small font-bold text-ink' : 'text-small text-ink',
          muted ? 'text-muted' : '',
        ].join(' ')}
      >
        {value}
      </dd>
    </div>
  );
}
