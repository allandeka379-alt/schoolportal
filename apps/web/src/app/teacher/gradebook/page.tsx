'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Download,
  Lock,
  Pencil,
  Send,
  Upload,
  X,
} from 'lucide-react';

import { EditorialCard, TrendArrow } from '@/components/student/primitives';
import { TeacherPageHeader } from '@/components/teacher/primitives';
import {
  GRADEBOOK_COLUMNS,
  GRADEBOOK_ROWS,
  GRADEBOOK_SUMMARY,
  type GradebookRow,
} from '@/lib/mock/teacher-extras';

/**
 * Gradebook matrix — §09.
 *
 *   - Students down × assessments across
 *   - Click a cell to edit inline (keyboard-first: Enter saves, Esc cancels)
 *   - Edits stamp the cell with "M" (moderated) and show in audit hint
 *   - Totals + grade + trend auto-recompute from cell values
 *   - "Publish to parents" commits the term and toggles a read-only state
 */

type CellValue = number | null;

interface EditableCell {
  value: CellValue;
  outlier?: boolean;
  edited: boolean;
  moderatedBy?: string;
  moderatedAt?: string;
}

interface EditableRow {
  studentId: string;
  name: string;
  cells: EditableCell[];
  trend: GradebookRow['trend'];
}

function cellSurface(value: CellValue): string {
  if (value === null) return 'text-stone';
  if (value >= 80) return 'bg-[#E6F0E9] text-[#23603C]';
  if (value >= 50) return 'text-ink';
  return 'bg-[#FBEBEA] text-[#B0362A]';
}

function deriveGrade(total: number): 'A' | 'B' | 'C' | 'D' | 'E' {
  if (total >= 80) return 'A';
  if (total >= 70) return 'B';
  if (total >= 60) return 'C';
  if (total >= 50) return 'D';
  return 'E';
}

function gradeTone(grade: 'A' | 'B' | 'C' | 'D' | 'E'): string {
  return grade === 'A'
    ? 'bg-[#EBE8F5] text-[#4F3E99]'
    : grade === 'B'
    ? 'bg-sand-light text-earth'
    : grade === 'C'
    ? 'bg-[#FDF4E3] text-[#92650B]'
    : 'bg-[#FBEBEA] text-[#B0362A]';
}

/** CA 40% (split across CA columns) · Mid 20% · End 40% per header copy. */
function weightFor(col: (typeof GRADEBOOK_COLUMNS)[number]): number {
  if (col.kind === 'ca') {
    const caCount = GRADEBOOK_COLUMNS.filter((c) => c.kind === 'ca').length || 1;
    return 0.4 / caCount;
  }
  if (col.kind === 'mid') return 0.2;
  if (col.kind === 'end') return 0.4;
  return 0;
}

function computeTotal(cells: EditableCell[]): number {
  let weightedScore = 0;
  let weightAccounted = 0;
  cells.forEach((cell, i) => {
    const col = GRADEBOOK_COLUMNS[i];
    if (!col) return;
    const weight = weightFor(col);
    if (cell.value === null) return;
    weightedScore += (cell.value / col.max) * weight;
    weightAccounted += weight;
  });
  if (weightAccounted === 0) return 0;
  // Normalise across completed assessments so a half-complete term still shows a sensible number.
  return Math.round((weightedScore / weightAccounted) * 100);
}

export default function GradebookPage() {
  const [rows, setRows] = useState<EditableRow[]>(() =>
    GRADEBOOK_ROWS.map((r) => ({
      studentId: r.studentId,
      name: r.name,
      cells: r.cells.map((c) => ({ ...c, edited: !!c.edited })),
      trend: r.trend,
    })),
  );
  const [editing, setEditing] = useState<{ row: number; col: number } | null>(null);
  const [draft, setDraft] = useState<string>('');
  const [published, setPublished] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 2400);
    return () => clearTimeout(t);
  }, [flash]);

  function openCell(rowIdx: number, colIdx: number) {
    if (published) return;
    const cell = rows[rowIdx]?.cells[colIdx];
    if (!cell) return;
    setEditing({ row: rowIdx, col: colIdx });
    setDraft(cell.value === null ? '' : String(cell.value));
  }

  function commit() {
    if (!editing) return;
    const { row: rowIdx, col: colIdx } = editing;
    const raw = draft.trim();
    const max = GRADEBOOK_COLUMNS[colIdx]?.max ?? 100;
    let nextValue: CellValue = null;
    if (raw !== '' && raw !== '-') {
      const parsed = Number(raw);
      if (Number.isNaN(parsed) || parsed < 0 || parsed > max) {
        setFlash(`Must be a number 0–${max}`);
        return;
      }
      nextValue = Math.round(parsed);
    }

    setRows((prev) =>
      prev.map((r, i) => {
        if (i !== rowIdx) return r;
        const nextCells = r.cells.map((c, j) =>
          j === colIdx
            ? {
                ...c,
                value: nextValue,
                edited: true,
                moderatedBy: 'Mrs Dziva',
                moderatedAt: new Date().toISOString(),
              }
            : c,
        );
        return { ...r, cells: nextCells };
      }),
    );
    setEditing(null);
    setSavedAt(Date.now());
    setFlash('Saved');
  }

  function cancel() {
    setEditing(null);
    setDraft('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      commit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      commit();
      if (!editing) return;
      const nextCol = e.shiftKey ? editing.col - 1 : editing.col + 1;
      const row = rows[editing.row];
      if (!row) return;
      if (nextCol >= 0 && nextCol < row.cells.length) {
        setTimeout(() => openCell(editing.row, nextCol), 0);
      }
    }
  }

  const totals = useMemo(
    () =>
      rows.map((r) => {
        const total = computeTotal(r.cells);
        return { total, grade: deriveGrade(total) };
      }),
    [rows],
  );

  const summary = useMemo(() => {
    const scores = totals.map((t) => t.total).sort((a, b) => a - b);
    const average = Math.round(scores.reduce((s, v) => s + v, 0) / Math.max(1, scores.length));
    const median = scores[Math.floor(scores.length / 2)] ?? 0;
    const low = scores[0] ?? 0;
    const high = scores[scores.length - 1] ?? 0;
    const distribution = (['A', 'B', 'C', 'D', 'E'] as const).map((g) => ({
      grade: g,
      count: totals.filter((t) => t.grade === g).length,
    }));
    return { average, median, low, high, distribution };
  }, [totals]);

  const pendingEdits = rows.reduce(
    (sum, r) => sum + r.cells.filter((c) => c.edited).length,
    0,
  );

  return (
    <div className="space-y-8">
      <TeacherPageHeader
        eyebrow="Mathematics · Form 4A"
        title="Gradebook,"
        accent="Term 2 2026."
        subtitle={`${rows.length} students · CA 40% · Mid 20% · End 40% · ${
          published ? 'published to parents' : 'click a cell to edit'
        }`}
        right={
          <>
            <button
              type="button"
              disabled={published}
              className="inline-flex h-10 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-earth hover:bg-sand-light disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Upload className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              Import from photo
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-earth hover:bg-sand-light"
            >
              <Download className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              Export
            </button>
            {published ? (
              <span className="inline-flex h-10 items-center gap-2 rounded border border-ok/40 bg-[#F0F6F2] px-3 font-sans text-[13px] font-medium text-ok">
                <Lock className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                Published
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setPublished(true);
                  setFlash('Published to parents · students notified');
                }}
                className="btn-terracotta"
              >
                <Send className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                Publish to parents
              </button>
            )}
          </>
        }
      />

      {/* Status strip */}
      <div className="flex flex-wrap items-center gap-3 rounded border border-sand bg-sand-light/40 px-4 py-2.5 font-sans text-[12px]">
        <span className="inline-flex items-center gap-1 text-stone">
          <span
            aria-hidden
            className="inline-block h-2 w-2 rounded-full bg-ok"
          />
          {published
            ? 'Published · edits locked'
            : savedAt
            ? `Saved · auto-saved ${new Date(savedAt).toLocaleTimeString('en-ZW', { hour: '2-digit', minute: '2-digit' })}`
            : 'Draft · edits auto-save'}
        </span>
        <span className="text-stone">·</span>
        <span className="text-stone">
          {pendingEdits} moderated {pendingEdits === 1 ? 'mark' : 'marks'} in this session
        </span>
        {flash ? (
          <span className="ml-auto rounded-full bg-ink px-2 py-0.5 font-sans text-[11px] font-semibold text-cream">
            {flash}
          </span>
        ) : null}
      </div>

      {/* Matrix */}
      <EditorialCard className="overflow-hidden">
        <div className="max-h-[620px] overflow-auto">
          <table className="w-full text-[13px]">
            <thead className="sticky top-0 z-10 bg-sand-light/80 backdrop-blur">
              <tr>
                <th className="sticky left-0 z-20 border-b border-sand bg-sand-light/95 px-4 py-3 text-left font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Student
                </th>
                {GRADEBOOK_COLUMNS.map((c) => (
                  <th
                    key={c.key}
                    className="border-b border-sand px-3 py-3 text-center font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone"
                  >
                    <div>{c.label}</div>
                    <div className="mt-0.5 font-sans text-[9px] font-normal normal-case tracking-normal text-stone">
                      /{c.max}
                    </div>
                  </th>
                ))}
                <th className="border-b border-sand bg-sand-light/95 px-3 py-3 text-center font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Total
                </th>
                <th className="border-b border-sand bg-sand-light/95 px-3 py-3 text-center font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Grade
                </th>
                <th className="border-b border-sand bg-sand-light/95 px-3 py-3 text-center font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const t = totals[i]!;
                return (
                  <tr key={row.studentId} className="hover:bg-sand-light/30">
                    <td className="sticky left-0 z-10 whitespace-nowrap border-b border-sand-light bg-white px-4 py-2 font-sans font-medium text-ink hover:bg-sand-light/40">
                      {row.name}
                    </td>
                    {row.cells.map((cell, j) => {
                      const isEditing = editing?.row === i && editing?.col === j;
                      return (
                        <td
                          key={j}
                          className={[
                            'relative border-b border-sand-light px-0 py-0 text-center font-mono text-[13px] tabular-nums',
                            isEditing ? 'bg-sand-light' : cellSurface(cell.value),
                          ].join(' ')}
                        >
                          {isEditing ? (
                            <input
                              ref={inputRef}
                              type="text"
                              inputMode="numeric"
                              value={draft}
                              onChange={(e) => setDraft(e.target.value)}
                              onBlur={commit}
                              onKeyDown={handleKeyDown}
                              className="h-9 w-full bg-white px-2 text-center font-mono text-[13px] text-ink focus:outline-terracotta"
                            />
                          ) : (
                            <button
                              type="button"
                              onClick={() => openCell(i, j)}
                              disabled={published}
                              className={[
                                'flex h-9 w-full items-center justify-center px-2 transition-colors',
                                published
                                  ? 'cursor-not-allowed'
                                  : 'hover:outline hover:outline-1 hover:outline-earth/50 cursor-pointer',
                              ].join(' ')}
                            >
                              {cell.value ?? '—'}
                            </button>
                          )}
                          {cell.outlier ? (
                            <span
                              title="Significantly different from this student's average"
                              className="absolute right-1 top-1 inline-flex h-2 w-2 rounded-full bg-ochre"
                              aria-hidden
                            />
                          ) : null}
                          {cell.edited ? (
                            <span
                              title={`Moderated by ${cell.moderatedBy ?? 'Mrs Dziva'}`}
                              className="absolute left-1 top-1 font-sans text-[9px] font-bold text-earth"
                              aria-hidden
                            >
                              M
                            </span>
                          ) : null}
                        </td>
                      );
                    })}
                    <td className="border-b border-sand-light bg-sand-light/30 px-3 py-2 text-center font-mono text-[14px] font-semibold tabular-nums text-ink">
                      {t.total}
                    </td>
                    <td className="border-b border-sand-light bg-sand-light/30 px-3 py-2 text-center">
                      <span
                        className={`inline-flex items-center rounded-sm px-2 py-0.5 font-sans text-[11px] font-semibold ${gradeTone(
                          t.grade,
                        )}`}
                      >
                        {t.grade}
                      </span>
                    </td>
                    <td className="border-b border-sand-light bg-sand-light/30 px-3 py-2 text-center">
                      <TrendArrow direction={row.trend} className="mx-auto" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary bar */}
        <div className="grid grid-cols-2 gap-4 border-t border-sand bg-sand-light/50 px-6 py-4 md:grid-cols-4 lg:grid-cols-8">
          <SummaryStat label="Average" value={`${summary.average}%`} />
          <SummaryStat label="Median" value={`${summary.median}%`} />
          <SummaryStat label="Highest" value={`${summary.high}%`} />
          <SummaryStat label="Lowest" value={`${summary.low}%`} />
          {summary.distribution.map((g) => (
            <SummaryStat
              key={g.grade}
              label={`Grade ${g.grade}`}
              value={g.count.toString()}
            />
          ))}
        </div>
      </EditorialCard>

      {/* Outlier / publish notice */}
      <div className="flex flex-wrap items-center gap-2 rounded border border-ochre/30 bg-[#FDF4E3] px-4 py-3 font-sans text-[12px] text-earth">
        {published ? (
          <>
            <CheckCircle2 className="h-4 w-4 flex-none text-ok" strokeWidth={1.5} aria-hidden />
            <span>
              Published. Farai and 31 other Form 4A students (and their parents) have been notified.
              Report cards queue to Headmaster for sign-off.
            </span>
          </>
        ) : (
          <>
            <AlertTriangle className="h-4 w-4 flex-none text-ochre" strokeWidth={1.5} aria-hidden />
            <span>
              Amber dots mark marks that look anomalous compared to the student&rsquo;s pattern.
              Hover for the reason · click the cell to confirm or correct · Tab moves sideways.
            </span>
          </>
        )}
      </div>

      <UnsavedHint hidden={editing === null}>
        <span className="inline-flex items-center gap-2 font-sans text-[12px] text-stone">
          <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          Editing …
          <kbd className="rounded bg-sand px-1 font-mono text-[10px] text-earth">↵</kbd> save
          <kbd className="rounded bg-sand px-1 font-mono text-[10px] text-earth">Tab</kbd> next
          <kbd className="rounded bg-sand px-1 font-mono text-[10px] text-earth">Esc</kbd> cancel
          <button
            type="button"
            onClick={cancel}
            className="ml-2 inline-flex items-center gap-1 rounded p-1 text-stone hover:text-ink"
            aria-label="Cancel"
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={commit}
            className="ml-1 inline-flex items-center gap-1 rounded bg-terracotta px-2 py-1 font-sans text-[11px] font-semibold text-cream hover:bg-[#A74627]"
          >
            <Check className="h-3 w-3" strokeWidth={2} aria-hidden />
            Save
          </button>
        </span>
      </UnsavedHint>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
        {label}
      </p>
      <p className="mt-1 font-display text-[22px] text-ink tabular-nums">{value}</p>
    </div>
  );
}

function UnsavedHint({ hidden, children }: { hidden: boolean; children: React.ReactNode }) {
  return (
    <div
      aria-hidden={hidden}
      className={[
        'fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full border border-sand bg-white px-4 py-2 shadow-e2 transition-all duration-200',
        hidden ? 'pointer-events-none translate-y-4 opacity-0' : 'opacity-100',
      ].join(' ')}
    >
      {children}
    </div>
  );
}
