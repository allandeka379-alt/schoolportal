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

import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/student/progress-ring';
import { TrendArrow } from '@/components/student/primitives';
import {
  GRADEBOOK_COLUMNS,
  GRADEBOOK_ROWS,
  type GradebookRow,
} from '@/lib/mock/teacher-extras';

/**
 * Teacher gradebook — card-dense redesign.
 *
 *   - KPI tile row (Average ring / Median / Highest / Lowest)
 *   - Full matrix in a border-line bg-card panel
 *   - Grade badges + TrendArrow on the right
 *   - Civic colour tints for cell ranges (success / warning / danger)
 *   - Editing, Tab-next navigation, publish-to-parents state preserved
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
  if (value === null) return 'text-muted';
  if (value >= 80) return 'bg-success/10 text-success';
  if (value >= 50) return 'text-ink';
  return 'bg-danger/10 text-danger';
}

function deriveGrade(total: number): 'A' | 'B' | 'C' | 'D' | 'E' {
  if (total >= 80) return 'A';
  if (total >= 70) return 'B';
  if (total >= 60) return 'C';
  if (total >= 50) return 'D';
  return 'E';
}

function gradeTone(grade: 'A' | 'B' | 'C' | 'D' | 'E'): 'success' | 'brand' | 'warning' | 'danger' {
  if (grade === 'A') return 'success';
  if (grade === 'B') return 'brand';
  if (grade === 'C') return 'warning';
  return 'danger';
}

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

  const ringTone: 'success' | 'brand' | 'warning' | 'danger' =
    summary.average >= 80 ? 'success' : summary.average >= 65 ? 'brand' : summary.average >= 50 ? 'warning' : 'danger';

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-small text-muted">Mathematics · Form 4A</p>
          <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-ink">
            Gradebook, Term 2 2026
          </h1>
          <p className="mt-2 text-small text-muted">
            {rows.length} students · CA 40% · Mid 20% · End 40% ·{' '}
            {published ? 'published to parents' : 'click a cell to edit'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={published}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Upload className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            Import from photo
          </button>
          <button
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface"
          >
            <Download className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            Export
          </button>
          {published ? (
            <span className="inline-flex h-11 items-center gap-2 rounded-full border border-success/30 bg-success/5 px-4 text-small font-semibold text-success">
              <Lock className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              Published
            </span>
          ) : (
            <button
              type="button"
              onClick={() => {
                setPublished(true);
                setFlash('Published to parents · students notified');
              }}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-primary px-5 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md"
            >
              <Send className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              Publish to parents
            </button>
          )}
        </div>
      </header>

      {/* KPI tiles */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiTile label="Class average" value={`${summary.average}%`} ring={summary.average} ringTone={ringTone} />
        <KpiTile label="Median" value={`${summary.median}%`} />
        <KpiTile label="Highest" value={`${summary.high}%`} tone="success" />
        <KpiTile label="Lowest" value={`${summary.low}%`} tone={summary.low < 50 ? 'warning' : undefined} />
      </ul>

      {/* Status strip */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-line bg-card px-5 py-3 text-micro shadow-card-sm">
        <span className="inline-flex items-center gap-1.5 text-muted">
          <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-success" />
          {published
            ? 'Published · edits locked'
            : savedAt
            ? `Saved · auto-saved ${new Date(savedAt).toLocaleTimeString('en-ZW', {
                hour: '2-digit',
                minute: '2-digit',
              })}`
            : 'Draft · edits auto-save'}
        </span>
        <span className="text-line">·</span>
        <span className="text-muted">
          {pendingEdits} moderated {pendingEdits === 1 ? 'mark' : 'marks'} in this session
        </span>
        {flash ? (
          <span className="ml-auto rounded-full bg-ink px-3 py-0.5 text-micro font-semibold text-white">
            {flash}
          </span>
        ) : null}
      </div>

      {/* Matrix */}
      <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
        <div className="max-h-[620px] overflow-auto">
          <table className="w-full text-small">
            <thead className="sticky top-0 z-10 bg-surface/95 backdrop-blur">
              <tr>
                <th className="sticky left-0 z-20 border-b border-line bg-surface/95 px-4 py-3 text-left text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  Student
                </th>
                {GRADEBOOK_COLUMNS.map((c) => (
                  <th
                    key={c.key}
                    className="border-b border-line px-3 py-3 text-center text-micro font-semibold uppercase tracking-[0.1em] text-muted"
                  >
                    <div>{c.label}</div>
                    <div className="mt-0.5 text-micro font-normal normal-case tracking-normal text-muted">
                      /{c.max}
                    </div>
                  </th>
                ))}
                <th className="border-b border-line bg-surface/95 px-3 py-3 text-center text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  Total
                </th>
                <th className="border-b border-line bg-surface/95 px-3 py-3 text-center text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  Grade
                </th>
                <th className="border-b border-line bg-surface/95 px-3 py-3 text-center text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const t = totals[i]!;
                return (
                  <tr key={row.studentId} className="hover:bg-surface/40">
                    <td className="sticky left-0 z-10 whitespace-nowrap border-b border-line bg-card px-4 py-2 text-small font-semibold text-ink">
                      {row.name}
                    </td>
                    {row.cells.map((cell, j) => {
                      const isEditing = editing?.row === i && editing?.col === j;
                      return (
                        <td
                          key={j}
                          className={[
                            'relative border-b border-line px-0 py-0 text-center tabular-nums',
                            isEditing ? 'bg-brand-primary/10' : cellSurface(cell.value),
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
                              className="h-9 w-full bg-white px-2 text-center text-small text-ink focus:outline focus:outline-2 focus:outline-brand-primary"
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
                                  : 'hover:outline hover:outline-2 hover:outline-brand-primary/40 cursor-pointer',
                              ].join(' ')}
                            >
                              {cell.value ?? '—'}
                            </button>
                          )}
                          {cell.outlier ? (
                            <span
                              title="Significantly different from this student's average"
                              className="absolute right-1 top-1 inline-flex h-2 w-2 rounded-full bg-warning"
                              aria-hidden
                            />
                          ) : null}
                          {cell.edited ? (
                            <span
                              title={`Moderated by ${cell.moderatedBy ?? 'Mrs Dziva'}`}
                              className="absolute left-1 top-1 text-micro font-bold text-brand-primary"
                              aria-hidden
                            >
                              M
                            </span>
                          ) : null}
                        </td>
                      );
                    })}
                    <td className="border-b border-line bg-surface/40 px-3 py-2 text-center text-small font-bold tabular-nums text-ink">
                      {t.total}
                    </td>
                    <td className="border-b border-line bg-surface/40 px-3 py-2 text-center">
                      <Badge tone={gradeTone(t.grade)} dot>
                        {t.grade}
                      </Badge>
                    </td>
                    <td className="border-b border-line bg-surface/40 px-3 py-2 text-center">
                      <TrendArrow direction={row.trend} className="mx-auto" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Grade distribution */}
        <div className="grid grid-cols-5 gap-3 border-t border-line bg-surface/40 px-5 py-4">
          {summary.distribution.map((g) => (
            <div
              key={g.grade}
              className="flex flex-col items-center rounded-md border border-line bg-card p-3"
            >
              <Badge tone={gradeTone(g.grade)} dot>
                Grade {g.grade}
              </Badge>
              <p className="mt-2 text-h2 tabular-nums text-ink">{g.count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Outlier / publish notice */}
      <div
        className={[
          'flex flex-wrap items-start gap-3 rounded-lg border p-4 text-small',
          published
            ? 'border-success/30 bg-success/5 text-ink'
            : 'border-warning/30 bg-warning/5 text-ink',
        ].join(' ')}
      >
        {published ? (
          <>
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-success" strokeWidth={1.75} aria-hidden />
            <span>
              Published. Farai and 31 other Form 4A students (and their parents) have been notified.
              Report cards queue to Headmaster for sign-off.
            </span>
          </>
        ) : (
          <>
            <AlertTriangle
              className="mt-0.5 h-4 w-4 flex-none text-warning"
              strokeWidth={1.75}
              aria-hidden
            />
            <span>
              Amber dots mark marks that look anomalous compared to the student&rsquo;s pattern. Hover
              for the reason · click the cell to confirm or correct · Tab moves sideways.
            </span>
          </>
        )}
      </div>

      <UnsavedHint hidden={editing === null}>
        <span className="inline-flex items-center gap-2 text-micro text-muted">
          <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
          Editing …
          <kbd className="rounded bg-surface px-1.5 py-0.5 font-mono text-micro text-ink">↵</kbd>{' '}
          save
          <kbd className="rounded bg-surface px-1.5 py-0.5 font-mono text-micro text-ink">Tab</kbd>{' '}
          next
          <kbd className="rounded bg-surface px-1.5 py-0.5 font-mono text-micro text-ink">Esc</kbd>{' '}
          cancel
          <button
            type="button"
            onClick={cancel}
            className="ml-2 inline-flex items-center gap-1 rounded-full p-1 text-muted transition-colors hover:text-ink"
            aria-label="Cancel"
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={commit}
            className="ml-1 inline-flex items-center gap-1 rounded-full bg-brand-primary px-3 py-1 text-micro font-semibold text-white transition hover:bg-brand-primary/90"
          >
            <Check className="h-3 w-3" strokeWidth={2} aria-hidden />
            Save
          </button>
        </span>
      </UnsavedHint>
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

function UnsavedHint({ hidden, children }: { hidden: boolean; children: React.ReactNode }) {
  return (
    <div
      aria-hidden={hidden}
      className={[
        'fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full border border-line bg-card px-4 py-2 shadow-card-md transition-all duration-200',
        hidden ? 'pointer-events-none translate-y-4 opacity-0' : 'opacity-100',
      ].join(' ')}
    >
      {children}
    </div>
  );
}
