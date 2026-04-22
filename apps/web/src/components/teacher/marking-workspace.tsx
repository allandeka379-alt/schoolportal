'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Circle,
  CircleDot,
  Filter,
  Flag,
  Highlighter,
  Mic,
  MinusSquare,
  PenSquare,
  Save,
  Shapes,
  Sparkles,
  Type,
} from 'lucide-react';

import { EditorialAvatar } from '@/components/student/primitives';
import { SUBMISSIONS_PS7, type Submission } from '@/lib/mock/teacher-extras';

import { TeacherStatusPill } from './primitives';

/**
 * 3-panel marking workspace — §08 of the spec.
 *
 *   Left (280px):  queue — students with progress indicator + filters
 *   Centre (flex): annotated submission viewer (PDF / image / text)
 *   Right (220px): marker — total, rubric sliders, comment, save-and-next
 *
 * A full keyboard motion is simulated. "Save & next" is the primary action.
 * Auto-save every 20s (simulated by state).
 */

interface Props {
  assignmentId: string;
  assignmentTitle: string;
  classLabel: string;
  maxMarks: number;
  rubricTemplate: { criterion: string; max: number }[];
}

export function MarkingWorkspace({
  assignmentId,
  assignmentTitle,
  classLabel,
  maxMarks,
  rubricTemplate,
}: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [submissions, setSubmissions] = useState<Submission[]>([...SUBMISSIONS_PS7]);
  const [filter, setFilter] = useState<'all' | 'to-mark' | 'late' | 'marked' | 'flagged'>('all');
  const [rubricScores, setRubricScores] = useState<number[]>(
    rubricTemplate.map((r) => Math.round(r.max * 0.75)),
  );
  const [comment, setComment] = useState('');

  const filtered = useMemo(() => {
    if (filter === 'all') return submissions;
    return submissions.filter((s) => s.status === filter || (filter === 'to-mark' && (s.status === 'to-mark' || s.status === 'late')));
  }, [submissions, filter]);

  const current = filtered[currentIdx] ?? submissions[0];
  const total = rubricScores.reduce((sum, s) => sum + s, 0);
  const markedCount = submissions.filter((s) => s.status === 'marked' || s.status === 'flagged').length;

  function saveAndNext() {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === current?.id ? { ...s, status: 'marked', mark: total } : s,
      ),
    );
    setComment('');
    setRubricScores(rubricTemplate.map((r) => Math.round(r.max * 0.75)));
    if (currentIdx < filtered.length - 1) setCurrentIdx(currentIdx + 1);
  }

  return (
    <div className="flex min-h-[calc(100vh-11rem)] flex-col">
      {/* Header strip */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-sand pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/teacher/assignments"
            className="inline-flex h-9 w-9 items-center justify-center rounded text-stone transition-colors hover:bg-sand-light hover:text-ink"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          </Link>
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-earth">
              Marking · {classLabel}
            </p>
            <h1 className="mt-1 font-display text-[22px] text-ink">{assignmentTitle}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-sans text-[12px] text-stone">
            {markedCount} of {submissions.length} marked
          </span>
          <button
            type="button"
            className="inline-flex h-9 items-center rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
          >
            Before releasing…
          </button>
        </div>
      </div>

      <div className="grid min-h-[620px] flex-1 grid-cols-12 gap-4">
        {/* Queue panel */}
        <aside className="col-span-12 rounded border border-sand bg-white md:col-span-4 lg:col-span-3">
          <div className="border-b border-sand px-4 py-3">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-earth">
              Queue
            </p>
            <div className="mt-2 flex items-center gap-1">
              <FilterChip
                active={filter === 'all'}
                onClick={() => setFilter('all')}
                label="All"
              />
              <FilterChip
                active={filter === 'to-mark'}
                onClick={() => setFilter('to-mark')}
                label="To mark"
              />
              <FilterChip
                active={filter === 'marked'}
                onClick={() => setFilter('marked')}
                label="Marked"
              />
              <FilterChip
                active={filter === 'flagged'}
                onClick={() => setFilter('flagged')}
                label="Flagged"
              />
            </div>
          </div>
          <ul className="max-h-[560px] divide-y divide-sand-light overflow-y-auto">
            {filtered.map((s, i) => {
              const active = s.id === current?.id;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setCurrentIdx(i)}
                    className={[
                      'relative flex w-full items-center gap-3 px-4 py-3 text-left transition-colors',
                      active ? 'bg-sand-light/70' : 'hover:bg-sand-light/40',
                    ].join(' ')}
                  >
                    {active ? (
                      <span
                        aria-hidden
                        className="absolute inset-y-2 left-0 w-[2px] rounded-r-sm bg-terracotta"
                      />
                    ) : null}
                    <EditorialAvatar name={s.studentName} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-sans text-[13px] font-medium text-ink">
                        {s.studentName}
                      </p>
                      <p className="font-sans text-[11px] text-stone">{s.submittedAgo}</p>
                    </div>
                    {s.status === 'marked' ? (
                      <CheckCircle2 className="h-4 w-4 text-ok" strokeWidth={1.5} aria-label="Marked" />
                    ) : s.status === 'flagged' ? (
                      <Flag className="h-4 w-4 text-danger" strokeWidth={1.5} aria-label="Flagged" />
                    ) : s.status === 'late' ? (
                      <span className="rounded-sm bg-[#FDF4E3] px-1.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-[#92650B]">
                        late
                      </span>
                    ) : s.status === 'not-submitted' ? (
                      <MinusSquare className="h-4 w-4 text-stone" strokeWidth={1.5} aria-label="Not submitted" />
                    ) : (
                      <CircleDot className="h-4 w-4 text-earth" strokeWidth={1.5} aria-label="To mark" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Viewer panel */}
        <section className="col-span-12 min-w-0 rounded border border-sand bg-white md:col-span-8 lg:col-span-6">
          <div className="flex items-center justify-between border-b border-sand px-5 py-3">
            <div>
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                Submission
              </p>
              <p className="mt-0.5 font-sans text-[13px] font-medium text-ink">
                {current?.studentName} · {current?.submittedAgo}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <AnnotationTool icon={Highlighter} label="Highlight" />
              <AnnotationTool icon={Type} label="Comment" />
              <AnnotationTool icon={PenSquare} label="Pen" />
              <AnnotationTool icon={Shapes} label="Shape" />
            </div>
          </div>

          <div className="relative h-[540px] overflow-hidden bg-sand-light/40">
            {/* Mock paper sheet */}
            <div className="absolute inset-6 rounded bg-white shadow-screenshot">
              <div className="border-b border-sand px-6 py-4">
                <p className="font-display text-[20px] text-ink">{current?.studentName}</p>
                <p className="font-sans text-[12px] text-stone">
                  Worksheet 5 · Quadratic Equations · Form 4A
                </p>
              </div>
              <div className="space-y-4 px-6 py-5 font-serif text-[14px] leading-relaxed text-ink">
                <p>
                  <span className="font-semibold">Q1.</span> Solve x² − 5x + 6 = 0 by factoring.
                </p>
                <p className="pl-6">
                  (x − 2)(x − 3) = 0 <br />
                  <span className="bg-ochre/30 px-1">x = 2 or x = 3</span>
                </p>
                <p>
                  <span className="font-semibold">Q2.</span> Use the quadratic formula to solve
                  2x² + 3x − 2 = 0.
                </p>
                <p className="pl-6">
                  a = 2, b = 3, c = −2 <br />
                  Discriminant = 9 + 16 = 25 <br />
                  x = (−3 ± 5) / 4 <br />
                  <span className="bg-ochre/30 px-1">x = ½ or x = −2</span>
                </p>
                <p>
                  <span className="font-semibold">Q3.</span> Complete the square for x² + 6x + 5.
                </p>
                <p className="pl-6 text-danger">
                  <span className="line-through">x² + 6x + 5 = (x + 3)² − 9 + 5 = (x + 3)² − 4</span>
                  <span className="ml-2 text-danger">✗ sign error in step 2</span>
                </p>
              </div>

              {/* Annotation pins */}
              <span
                aria-hidden
                className="absolute left-[60%] top-[48%] inline-flex h-6 w-6 items-center justify-center rounded-full bg-terracotta text-[11px] font-bold text-cream shadow-e2"
              >
                1
              </span>
              <span
                aria-hidden
                className="absolute right-12 top-[72%] inline-flex h-6 w-6 items-center justify-center rounded-full bg-earth text-[11px] font-bold text-cream shadow-e2"
              >
                2
              </span>
            </div>
            <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded bg-white px-2 py-1 font-sans text-[11px] text-stone shadow-e2">
              Page 1 of 3
              <ChevronRight className="h-3 w-3" strokeWidth={1.5} aria-hidden />
            </div>
          </div>
        </section>

        {/* Marker panel */}
        <aside className="col-span-12 rounded border border-sand bg-white md:col-span-12 lg:col-span-3">
          <div className="border-b border-sand px-5 py-3">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-earth">
              Mark
            </p>
            <div className="mt-2 flex items-end gap-2">
              <span className="font-display text-[40px] leading-none tabular-nums text-ink">
                {total}
              </span>
              <span className="pb-1 font-sans text-[14px] text-stone">/ {maxMarks}</span>
            </div>
          </div>

          <div className="px-5 py-4">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-stone">
              Rubric
            </p>
            <ul className="mt-3 space-y-4">
              {rubricTemplate.map((r, i) => (
                <li key={r.criterion}>
                  <div className="flex items-center justify-between">
                    <label htmlFor={`r-${i}`} className="font-sans text-[12px] text-ink">
                      {r.criterion}
                    </label>
                    <span className="font-mono text-[12px] tabular-nums text-ink">
                      {rubricScores[i]}
                      <span className="text-stone"> / {r.max}</span>
                    </span>
                  </div>
                  <input
                    id={`r-${i}`}
                    type="range"
                    min={0}
                    max={r.max}
                    value={rubricScores[i]}
                    onChange={(e) =>
                      setRubricScores((prev) =>
                        prev.map((v, j) => (j === i ? Number(e.target.value) : v)),
                      )
                    }
                    className="mt-1 w-full accent-terracotta"
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-sand px-5 py-4">
            <div className="flex items-center justify-between">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-stone">
                Comment
              </p>
              <button
                type="button"
                className="inline-flex items-center gap-1 font-sans text-[11px] font-medium text-terracotta hover:underline"
              >
                <Sparkles className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                Suggest
              </button>
            </div>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Specific, warm, actionable."
              className="mt-2 w-full rounded border border-sand bg-white p-2.5 font-serif text-[13px] leading-relaxed text-ink placeholder-stone focus:border-terracotta focus:outline-none"
            />
            <div className="mt-2 flex flex-wrap gap-1">
              {['Strong working', 'Watch signs', 'Try factoring', 'Well set out'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setComment((c) => (c ? `${c} ${p}.` : `${p}.`))}
                  className="rounded border border-sand bg-cream px-1.5 py-0.5 font-sans text-[11px] text-stone hover:border-terracotta hover:text-earth"
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="mt-3 inline-flex items-center gap-1.5 font-sans text-[12px] font-medium text-stone hover:text-terracotta"
            >
              <Mic className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              Record audio feedback
            </button>
          </div>

          <div className="border-t border-sand px-5 py-4 space-y-2">
            <button
              type="button"
              onClick={saveAndNext}
              className="btn-terracotta w-full"
            >
              <Save className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              Save &amp; next
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-1 rounded border border-sand bg-white px-3 py-2 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
            >
              <Circle className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              Save only
            </button>
          </div>

          <div className="border-t border-sand px-5 py-3">
            <p className="font-sans text-[11px] text-stone">
              <kbd className="rounded bg-sand px-1 font-mono text-[10px] text-earth">
                ⌘
              </kbd>{' '}
              +{' '}
              <kbd className="rounded bg-sand px-1 font-mono text-[10px] text-earth">
                →
              </kbd>{' '}
              to save &amp; advance
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'inline-flex h-7 items-center rounded-full px-2.5 font-sans text-[11px] font-semibold transition-colors',
        active
          ? 'bg-ink text-cream'
          : 'border border-sand bg-white text-stone hover:bg-sand-light',
      ].join(' ')}
    >
      {label}
    </button>
  );
}

function AnnotationTool({ icon: Icon, label }: { icon: typeof Highlighter; label: string }) {
  return (
    <button
      type="button"
      className="flex h-8 w-8 items-center justify-center rounded text-stone transition-colors hover:bg-sand hover:text-ink"
      aria-label={label}
    >
      <Icon className="h-4 w-4" strokeWidth={1.5} />
    </button>
  );
}
