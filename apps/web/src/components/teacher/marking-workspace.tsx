'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BellRing,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  CircleDot,
  Download,
  Flag,
  Highlighter,
  Loader2,
  Mail,
  Mic,
  MinusSquare,
  PenSquare,
  Save,
  Send,
  Shapes,
  Sparkles,
  Type,
  Users,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { EditorialAvatar } from '@/components/student/primitives';
import { SUBMISSIONS_PS7, type Submission } from '@/lib/mock/teacher-extras';
import { buildGenericDoc, downloadPdf } from '@/lib/pdf/generate';

import { TeacherStatusPill } from './primitives';

/**
 * 3-panel marking workspace — §08 of the spec.
 *
 *   Left (280px):  queue — students with progress indicator + filters
 *   Centre (flex): annotated submission viewer (PDF / image / text)
 *   Right (220px): marker — total, rubric sliders, comment, save-and-next
 *
 * Per-student rubric + comment state persists when you switch between
 * submissions in the session, so the ergonomics feel real. Auto-save
 * every 20s simulated via a timestamp. Keyboard shortcut ⌘+→ / Ctrl+→
 * advances with save.
 */

interface Props {
  assignmentId: string;
  assignmentTitle: string;
  classLabel: string;
  maxMarks: number;
  rubricTemplate: { criterion: string; max: number }[];
}

interface DraftState {
  rubric: number[];
  comment: string;
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
  const [drafts, setDrafts] = useState<Record<string, DraftState>>({});
  const [published, setPublished] = useState(false);
  const [autoSavedAt, setAutoSavedAt] = useState<number>(Date.now());
  const [flash, setFlash] = useState<string | null>(null);
  const [confirmReleaseOpen, setConfirmReleaseOpen] = useState(false);
  const [releasing, setReleasing] = useState(false);
  const [releasedAt, setReleasedAt] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (filter === 'all') return submissions;
    if (filter === 'to-mark')
      return submissions.filter((s) => s.status === 'to-mark' || s.status === 'late');
    return submissions.filter((s) => s.status === filter);
  }, [submissions, filter]);

  const current = filtered[currentIdx] ?? filtered[0] ?? submissions[0];

  // Ensure a draft exists for the current submission, pre-filled from its mark
  // if it has one — so reopening a marked student restores their scores.
  useEffect(() => {
    if (!current) return;
    if (drafts[current.id]) return;
    const seed = seedDraft(current, rubricTemplate);
    setDrafts((d) => ({ ...d, [current.id]: seed }));
  }, [current, drafts, rubricTemplate]);

  const draft = current ? drafts[current.id] : undefined;
  const rubricScores = draft?.rubric ?? rubricTemplate.map((r) => Math.round(r.max * 0.75));
  const comment = draft?.comment ?? '';
  const total = rubricScores.reduce((sum, s) => sum + s, 0);

  const markedCount = submissions.filter(
    (s) => s.status === 'marked' || s.status === 'flagged',
  ).length;
  const allMarked = markedCount === submissions.filter((s) => s.status !== 'not-submitted').length;

  // Simulated auto-save every 20s if there's any local draft change.
  useEffect(() => {
    const t = setInterval(() => setAutoSavedAt(Date.now()), 20_000);
    return () => clearInterval(t);
  }, []);

  // Keyboard ⌘+→ / Ctrl+→ saves & advances.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'ArrowRight') {
        e.preventDefault();
        saveAndNext();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, rubricScores, comment, filtered]);

  function updateRubric(i: number, v: number) {
    if (!current) return;
    setDrafts((d) => ({
      ...d,
      [current.id]: {
        rubric: (d[current.id]?.rubric ?? rubricScores).map((x, j) => (j === i ? v : x)),
        comment: d[current.id]?.comment ?? comment,
      },
    }));
  }

  function updateComment(v: string) {
    if (!current) return;
    setDrafts((d) => ({
      ...d,
      [current.id]: {
        rubric: d[current.id]?.rubric ?? rubricScores,
        comment: v,
      },
    }));
  }

  function saveOnly(asFlagged = false) {
    if (!current || published) return;
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === current.id
          ? { ...s, status: asFlagged ? 'flagged' : 'marked', mark: total }
          : s,
      ),
    );
    setAutoSavedAt(Date.now());
    setFlash(asFlagged ? 'Flagged for moderation' : 'Saved');
    setTimeout(() => setFlash(null), 1800);
  }

  function saveAndNext() {
    if (!current || published) return;
    saveOnly(false);
    if (currentIdx < filtered.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  }

  function askRelease() {
    setConfirmReleaseOpen(true);
  }

  function releaseAll() {
    setConfirmReleaseOpen(false);
    setReleasing(true);
    setTimeout(() => {
      setReleasing(false);
      setPublished(true);
      setReleasedAt(Date.now());
    }, 1100);
  }

  function downloadSummary() {
    const marked = submissions.filter((s) => s.mark !== undefined);
    const avg =
      marked.reduce((sum, s) => sum + (s.mark ?? 0), 0) / Math.max(marked.length, 1);
    const lines = marked.map((s) => ({
      label: s.studentName,
      value: `${s.mark ?? 0} / ${s.outOf}`,
    }));
    downloadPdf(
      `JHS-${assignmentTitle.replace(/\s+/g, '-')}-marks.pdf`,
      buildGenericDoc({
        title: `${assignmentTitle} · marks`,
        eyebrow: `JHS · ${classLabel}`,
        subtitle: `Released ${releasedAt ? new Date(releasedAt).toLocaleString('en-ZW') : 'today'}`,
        fields: [
          { label: 'Students marked', value: `${marked.length} of ${submissions.length}` },
          { label: 'Class average', value: `${Math.round(avg)}%` },
          { label: 'Max marks', value: String(maxMarks) },
        ],
        lines,
        footer: 'Marks released to students + parents. Moderated by the HOD before archival.',
      }),
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-11rem)] flex-col">
      {/* Header strip */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/teacher/assignments"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-card text-muted transition-colors hover:bg-surface hover:text-ink"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          </Link>
          <div>
            <p className="text-micro font-semibold uppercase tracking-[0.12em] text-brand-primary">
              Marking · {classLabel}
            </p>
            <h1 className="mt-0.5 text-h2 text-ink">{assignmentTitle}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {flash ? (
            <span className="inline-flex h-8 items-center rounded-full bg-ink px-3 text-micro font-semibold text-white">
              {flash}
            </span>
          ) : (
            <span className="text-micro text-muted">
              Auto-saved{' '}
              {new Date(autoSavedAt).toLocaleTimeString('en-ZW', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}
          <span className="text-micro text-muted">
            · {markedCount} of {submissions.length} marked
          </span>
          {published ? (
            <>
              <Badge tone="success" dot>
                Released
              </Badge>
              <button
                type="button"
                onClick={downloadSummary}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-card px-3 text-micro font-semibold text-ink transition-colors hover:bg-surface"
              >
                <Download className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                Marks PDF
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={askRelease}
              disabled={!allMarked || releasing}
              title={allMarked ? undefined : 'Finish marking every submission before release'}
              className={[
                'inline-flex h-10 items-center gap-2 rounded-full px-4 text-small font-semibold transition-colors',
                allMarked
                  ? 'bg-brand-primary text-white shadow-card-sm hover:bg-brand-primary/90 hover:shadow-card-md'
                  : 'border border-line bg-card text-muted cursor-not-allowed',
              ].join(' ')}
            >
              {releasing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.75} aria-hidden />
              ) : (
                <Send className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              )}
              {releasing ? 'Releasing…' : 'Release to students'}
            </button>
          )}
        </div>
      </div>

      <div className="grid min-h-[620px] flex-1 grid-cols-12 gap-4">
        {/* Queue panel */}
        <aside className="col-span-12 rounded border border-sand bg-white md:col-span-4 lg:col-span-3">
          <div className="border-b border-sand px-4 py-3">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-earth">
              Queue
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-1">
              <FilterChip active={filter === 'all'} onClick={() => setFilter('all')} label="All" />
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
                      <p className="font-sans text-[11px] text-stone">
                        {s.submittedAgo}
                        {s.mark !== undefined ? ` · ${s.mark}/${s.outOf}` : ''}
                      </p>
                    </div>
                    {s.status === 'marked' ? (
                      <CheckCircle2
                        className="h-4 w-4 text-ok"
                        strokeWidth={1.5}
                        aria-label="Marked"
                      />
                    ) : s.status === 'flagged' ? (
                      <Flag
                        className="h-4 w-4 text-danger"
                        strokeWidth={1.5}
                        aria-label="Flagged"
                      />
                    ) : s.status === 'late' ? (
                      <span className="rounded-sm bg-[#FDF4E3] px-1.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-[#92650B]">
                        late
                      </span>
                    ) : s.status === 'not-submitted' ? (
                      <MinusSquare
                        className="h-4 w-4 text-stone"
                        strokeWidth={1.5}
                        aria-label="Not submitted"
                      />
                    ) : (
                      <CircleDot
                        className="h-4 w-4 text-earth"
                        strokeWidth={1.5}
                        aria-label="To mark"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-sand px-4 py-3">
            <p className="font-sans text-[11px] text-stone">
              <kbd className="rounded bg-sand px-1 font-mono text-[10px] text-earth">⌘</kbd>
              {' + '}
              <kbd className="rounded bg-sand px-1 font-mono text-[10px] text-earth">→</kbd>{' '}
              save &amp; advance
            </p>
          </div>
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
                {current ? ` · ${current.files[0]?.name ?? 'no attachment'}` : ''}
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
              <span className="ml-auto">
                <TeacherStatusPill state={pillForStatus(current?.status)}>
                  {labelForStatus(current?.status)}
                </TeacherStatusPill>
              </span>
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
                    onChange={(e) => updateRubric(i, Number(e.target.value))}
                    disabled={published}
                    className="mt-1 w-full accent-terracotta disabled:opacity-60"
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
                onClick={() =>
                  updateComment(
                    comment
                      ? `${comment} Keep the working clear and check your signs.`
                      : 'Good grasp overall. Keep the working clear and check your signs.',
                  )
                }
                className="inline-flex items-center gap-1 font-sans text-[11px] font-medium text-terracotta hover:underline"
              >
                <Sparkles className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                Suggest
              </button>
            </div>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => updateComment(e.target.value)}
              disabled={published}
              placeholder="Specific, warm, actionable."
              className="mt-2 w-full rounded border border-sand bg-white p-2.5 font-serif text-[13px] leading-relaxed text-ink placeholder-stone focus:border-terracotta focus:outline-none disabled:opacity-60"
            />
            <div className="mt-2 flex flex-wrap gap-1">
              {['Strong working', 'Watch signs', 'Try factoring', 'Well set out'].map((p) => (
                <button
                  key={p}
                  type="button"
                  disabled={published}
                  onClick={() => updateComment(comment ? `${comment} ${p}.` : `${p}.`)}
                  className="rounded border border-sand bg-cream px-1.5 py-0.5 font-sans text-[11px] text-stone hover:border-terracotta hover:text-earth disabled:opacity-60"
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={published}
              className="mt-3 inline-flex items-center gap-1.5 font-sans text-[12px] font-medium text-stone hover:text-terracotta disabled:opacity-60"
            >
              <Mic className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              Record audio feedback
            </button>
          </div>

          <div className="space-y-2 border-t border-sand px-5 py-4">
            <button
              type="button"
              onClick={saveAndNext}
              disabled={published}
              className="btn-terracotta w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              Save &amp; next
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => saveOnly(false)}
                disabled={published}
                className="inline-flex items-center justify-center gap-1 rounded border border-sand bg-white px-3 py-2 font-sans text-[12px] font-medium text-earth hover:bg-sand-light disabled:opacity-60"
              >
                <Circle className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                Save only
              </button>
              <button
                type="button"
                onClick={() => saveOnly(true)}
                disabled={published}
                className="inline-flex items-center justify-center gap-1 rounded border border-sand bg-white px-3 py-2 font-sans text-[12px] font-medium text-danger hover:bg-[#FBEBEA] disabled:opacity-60"
              >
                <Flag className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                Flag
              </button>
            </div>
          </div>

          {published ? (
            <div className="border-t border-line bg-success/[0.05] px-5 py-3">
              <p className="flex items-center gap-2 text-micro text-success">
                <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                Grades released · {submissions.filter((s) => s.mark !== undefined).length} students
                notified
              </p>
            </div>
          ) : null}
        </aside>
      </div>

      {confirmReleaseOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setConfirmReleaseOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-lg border border-line bg-card shadow-card-md"
          >
            <header className="border-b border-line px-6 py-4">
              <p className="text-micro font-semibold uppercase tracking-[0.12em] text-brand-primary">
                Release marks
              </p>
              <h3 className="text-h3 text-ink">Confirm release to students</h3>
            </header>
            <div className="space-y-3 p-6">
              <div className="rounded-md border border-line bg-surface/40 p-4 text-small">
                <p className="font-semibold text-ink">{assignmentTitle}</p>
                <p className="mt-1 text-micro text-muted">{classLabel}</p>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-md bg-card p-2">
                    <p className="text-micro uppercase tracking-[0.12em] text-muted">Marked</p>
                    <p className="mt-0.5 text-h3 tabular-nums text-ink">
                      {submissions.filter((s) => s.mark !== undefined).length}
                    </p>
                  </div>
                  <div className="rounded-md bg-card p-2">
                    <p className="text-micro uppercase tracking-[0.12em] text-muted">Avg</p>
                    <p className="mt-0.5 text-h3 tabular-nums text-ink">
                      {Math.round(
                        submissions.reduce((sum, s) => sum + (s.mark ?? 0), 0) /
                          Math.max(
                            submissions.filter((s) => s.mark !== undefined).length,
                            1,
                          ),
                      )}
                      %
                    </p>
                  </div>
                  <div className="rounded-md bg-card p-2">
                    <p className="text-micro uppercase tracking-[0.12em] text-muted">Max</p>
                    <p className="mt-0.5 text-h3 tabular-nums text-ink">{maxMarks}</p>
                  </div>
                </div>
              </div>
              <p className="rounded-md border border-warning/25 bg-warning/[0.05] p-3 text-small text-ink">
                Students + parents see the mark, rubric breakdown and comment as soon as you
                release. You cannot edit marks after release — only the HOD can unlock.
              </p>
            </div>
            <footer className="flex items-center justify-end gap-2 border-t border-line bg-card px-6 py-4">
              <button
                type="button"
                onClick={() => setConfirmReleaseOpen(false)}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={releaseAll}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-primary px-4 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md"
              >
                <Send className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                Release to {submissions.filter((s) => s.mark !== undefined).length} students
              </button>
            </footer>
          </div>
        </div>
      ) : null}

      {published && releasedAt ? (
        <ReleasedMarksModal
          submissions={submissions}
          assignmentTitle={assignmentTitle}
          classLabel={classLabel}
          maxMarks={maxMarks}
          releasedAt={releasedAt}
          onDismiss={() => setReleasedAt(null)}
          onDownload={downloadSummary}
        />
      ) : null}
    </div>
  );
}

function ReleasedMarksModal({
  submissions,
  assignmentTitle,
  classLabel,
  maxMarks,
  releasedAt,
  onDismiss,
  onDownload,
}: {
  submissions: Submission[];
  assignmentTitle: string;
  classLabel: string;
  maxMarks: number;
  releasedAt: number;
  onDismiss: () => void;
  onDownload: () => void;
}) {
  const marked = submissions.filter((s) => s.mark !== undefined);
  const avg =
    marked.reduce((sum, s) => sum + (s.mark ?? 0), 0) / Math.max(marked.length, 1);
  const topFive = [...marked]
    .sort((a, b) => (b.mark ?? 0) - (a.mark ?? 0))
    .slice(0, 5);
  const bottomThree = [...marked]
    .sort((a, b) => (a.mark ?? 0) - (b.mark ?? 0))
    .slice(0, 3);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
    >
      <div className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-lg border border-line bg-card shadow-card-md">
        <div className="bg-success px-6 py-5 text-white">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                <CheckCircle2 className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </span>
              <div>
                <p className="text-micro font-semibold uppercase tracking-[0.12em] text-white/80">
                  Marks released
                </p>
                <h3 className="text-h3">{assignmentTitle}</h3>
              </div>
            </div>
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Close"
              className="rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-micro text-white/90">
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              {marked.length} students in {classLabel}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              Released{' '}
              {new Date(releasedAt).toLocaleTimeString('en-ZW', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>

        <div className="space-y-5 overflow-y-auto p-6">
          {/* KPIs */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-md border border-line bg-surface/40 p-3 text-center">
              <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">Avg</p>
              <p className="mt-1 text-h2 tabular-nums text-ink">{Math.round(avg)}%</p>
            </div>
            <div className="rounded-md border border-line bg-surface/40 p-3 text-center">
              <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
                Highest
              </p>
              <p className="mt-1 text-h2 tabular-nums text-ink">{marked[0]?.outOf ?? maxMarks}</p>
            </div>
            <div className="rounded-md border border-line bg-surface/40 p-3 text-center">
              <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
                Submissions
              </p>
              <p className="mt-1 text-h2 tabular-nums text-ink">
                {marked.length}/{submissions.length}
              </p>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
              Just sent
            </p>
            <ul className="mt-2 space-y-2">
              <li className="flex items-center gap-3 rounded-md border border-line bg-card p-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand-primary/10 text-brand-primary">
                  <BellRing className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-small font-semibold text-ink">Student push + email</p>
                  <p className="text-micro text-muted">
                    {marked.length} students notified with mark + rubric + comment
                  </p>
                </div>
                <Check className="h-4 w-4 text-success" strokeWidth={2} aria-hidden />
              </li>
              <li className="flex items-center gap-3 rounded-md border border-line bg-card p-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-info/10 text-info">
                  <Mail className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-small font-semibold text-ink">Parent dashboard</p>
                  <p className="text-micro text-muted">
                    Mark appears on the parent&rsquo;s Progress tab next login
                  </p>
                </div>
                <Check className="h-4 w-4 text-success" strokeWidth={2} aria-hidden />
              </li>
              <li className="flex items-center gap-3 rounded-md border border-line bg-card p-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-success/10 text-success">
                  <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-small font-semibold text-ink">Gradebook updated</p>
                  <p className="text-micro text-muted">
                    Marks live in the Term 2 gradebook · feeds the end-of-term report
                  </p>
                </div>
                <Check className="h-4 w-4 text-success" strokeWidth={2} aria-hidden />
              </li>
            </ul>
          </div>

          {/* Top + attention */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-line bg-card p-3">
              <p className="text-micro font-semibold uppercase tracking-[0.12em] text-brand-primary">
                Top marks
              </p>
              <ul className="mt-2 space-y-1.5">
                {topFive.map((s, i) => (
                  <li key={s.id} className="flex items-center justify-between text-small">
                    <span className="text-ink">
                      {i + 1}. {s.studentName}
                    </span>
                    <span className="font-mono tabular-nums text-ink">
                      {s.mark}/{s.outOf}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-md border border-warning/25 bg-warning/[0.04] p-3">
              <p className="text-micro font-semibold uppercase tracking-[0.12em] text-warning">
                Needs follow-up
              </p>
              <ul className="mt-2 space-y-1.5">
                {bottomThree.map((s) => (
                  <li key={s.id} className="flex items-center justify-between text-small">
                    <span className="text-ink">{s.studentName}</span>
                    <span className="font-mono tabular-nums text-warning">
                      {s.mark}/{s.outOf}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-micro text-muted">
                Parent dashboards mark these as &ldquo;attention items&rdquo; — consider a brief
                message.
              </p>
            </div>
          </div>
        </div>

        <footer className="flex flex-wrap items-center justify-end gap-2 border-t border-line bg-card px-6 py-4">
          <button
            type="button"
            onClick={onDownload}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface"
          >
            <Download className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            Download marks PDF
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-primary px-5 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md"
          >
            Done
            <Check className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </button>
        </footer>
      </div>
    </div>
  );
}

function seedDraft(
  submission: Submission,
  template: { criterion: string; max: number }[],
): DraftState {
  if (submission.mark !== undefined) {
    // Distribute the existing mark across rubric criteria proportionally.
    const total = template.reduce((s, r) => s + r.max, 0);
    return {
      rubric: template.map((r) => Math.round((submission.mark! / total) * r.max)),
      comment: '',
    };
  }
  return { rubric: template.map((r) => Math.round(r.max * 0.75)), comment: '' };
}

function pillForStatus(status: Submission['status'] | undefined) {
  switch (status) {
    case 'marked':
      return 'marked';
    case 'flagged':
      return 'flagged';
    case 'late':
      return 'to-mark';
    case 'not-submitted':
      return 'draft';
    default:
      return 'to-mark';
  }
}

function labelForStatus(status: Submission['status'] | undefined): string {
  switch (status) {
    case 'marked':
      return 'marked';
    case 'flagged':
      return 'flagged';
    case 'late':
      return 'late';
    case 'not-submitted':
      return 'not submitted';
    default:
      return 'to mark';
  }
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
