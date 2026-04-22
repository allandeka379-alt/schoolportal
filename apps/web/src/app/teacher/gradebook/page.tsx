import { AlertTriangle, Download, Upload } from 'lucide-react';

import { EditorialCard, SectionEyebrow, TrendArrow } from '@/components/student/primitives';
import { TeacherPageHeader } from '@/components/teacher/primitives';
import {
  GRADEBOOK_COLUMNS,
  GRADEBOOK_ROWS,
  GRADEBOOK_SUMMARY,
} from '@/lib/mock/teacher-extras';

/**
 * Gradebook matrix — §09.
 *
 *   - Students down × assessments across
 *   - First column (student name) and last columns (total, grade, trend) are
 *     visually frozen via sticky positioning
 *   - Cell colour: 80%+ sage, 50-79% default cream, <50% soft danger
 *   - Outliers marked with an amber dot + tooltip "significantly lower…"
 *   - Summary bar sticky at bottom
 */

function cellSurface(value: number | null): string {
  if (value === null) return 'text-stone';
  if (value >= 80) return 'bg-[#E6F0E9] text-[#23603C]';
  if (value >= 50) return 'text-ink';
  return 'bg-[#FBEBEA] text-[#B0362A]';
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

export default function GradebookPage() {
  return (
    <div className="space-y-8">
      <TeacherPageHeader
        eyebrow="Mathematics · Form 4A"
        title="Gradebook,"
        accent="Term 2 2026."
        subtitle={`${GRADEBOOK_ROWS.length} students · CA 40% · Mid 20% · End 40%`}
        right={
          <>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-earth hover:bg-sand-light"
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
          </>
        }
      />

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
              {GRADEBOOK_ROWS.map((row, i) => (
                <tr key={row.studentId} className="hover:bg-sand-light/30">
                  <td className="sticky left-0 z-10 whitespace-nowrap border-b border-sand-light bg-white px-4 py-2 font-sans font-medium text-ink hover:bg-sand-light/40">
                    {row.name}
                  </td>
                  {row.cells.map((cell, j) => (
                    <td
                      key={j}
                      className={`relative border-b border-sand-light px-3 py-2 text-center font-mono text-[13px] tabular-nums ${cellSurface(
                        cell.value,
                      )}`}
                    >
                      {cell.value ?? '—'}
                      {cell.outlier ? (
                        <span
                          title="Significantly higher than this student's term average"
                          className="absolute right-1 top-1 inline-flex h-2 w-2 rounded-full bg-ochre"
                          aria-hidden
                        />
                      ) : null}
                      {cell.edited ? (
                        <span
                          title="Moderated — see audit trail"
                          className="absolute right-1 top-1 font-sans text-[9px] font-bold text-stone"
                          aria-hidden
                        >
                          M
                        </span>
                      ) : null}
                    </td>
                  ))}
                  <td className="border-b border-sand-light bg-sand-light/30 px-3 py-2 text-center font-mono text-[14px] font-semibold tabular-nums text-ink">
                    {row.total}
                  </td>
                  <td className="border-b border-sand-light bg-sand-light/30 px-3 py-2 text-center">
                    <span
                      className={`inline-flex items-center rounded-sm px-2 py-0.5 font-sans text-[11px] font-semibold ${gradeTone(
                        row.grade,
                      )}`}
                    >
                      {row.grade}
                    </span>
                  </td>
                  <td className="border-b border-sand-light bg-sand-light/30 px-3 py-2 text-center">
                    <TrendArrow direction={row.trend} className="mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary bar */}
        <div className="grid grid-cols-2 gap-4 border-t border-sand bg-sand-light/50 px-6 py-4 md:grid-cols-4 lg:grid-cols-8">
          <SummaryStat label="Average" value={`${GRADEBOOK_SUMMARY.average}%`} />
          <SummaryStat label="Median" value={`${GRADEBOOK_SUMMARY.median}%`} />
          <SummaryStat label="Highest" value={`${GRADEBOOK_SUMMARY.high}%`} />
          <SummaryStat label="Lowest" value={`${GRADEBOOK_SUMMARY.low}%`} />
          {GRADEBOOK_SUMMARY.gradeDistribution.map((g) => (
            <SummaryStat
              key={g.grade}
              label={`Grade ${g.grade}`}
              value={g.count.toString()}
            />
          ))}
        </div>
      </EditorialCard>

      {/* Outlier notice */}
      <div className="flex items-center gap-2 rounded border border-ochre/30 bg-[#FDF4E3] px-4 py-3 font-sans text-[12px] text-earth">
        <AlertTriangle className="h-4 w-4 flex-none text-ochre" strokeWidth={1.5} aria-hidden />
        <span>
          Amber dots mark marks that appear anomalous compared to the student&rsquo;s pattern.
          Hover to see the reason · click a cell to confirm or correct.
        </span>
      </div>
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
