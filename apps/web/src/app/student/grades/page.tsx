import Link from 'next/link';

import { GRADEBOOK_FARAI } from '@/lib/mock/fixtures';
import { CURRENT_TERM } from '@/lib/mock/student-extras';

import {
  EditorialCard,
  SectionEyebrow,
  TrendArrow,
} from '@/components/student/primitives';

/**
 * Grades overview — §09 of the spec.
 *
 * Header band: current term average, optional class position.
 * Grid: 4×2 subject cards, each with current total + letter grade + trend.
 * Clicking a card navigates to the subject detail (single-subject deep-dive).
 */
export default function GradesOverviewPage() {
  const average =
    GRADEBOOK_FARAI.reduce((sum, row) => sum + row.total, 0) / GRADEBOOK_FARAI.length;

  return (
    <div className="space-y-8">
      <header>
        <SectionEyebrow>Grades</SectionEyebrow>
        <h1 className="mt-2 font-display text-[clamp(1.75rem,3vw,2.25rem)] text-ink">
          {CURRENT_TERM.label}
          <span className="text-terracotta">.</span>
        </h1>
      </header>

      {/* Overview band */}
      <div className="rounded border border-sand bg-sand-light px-6 py-8 md:px-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <p className="hha-eyebrow-earth">Current average</p>
            <p className="mt-2 font-display text-display-md leading-none text-ink tabular-nums">
              {average.toFixed(0)}
              <span className="text-[22px] text-stone">%</span>
            </p>
          </div>
          {CURRENT_TERM.classPositionOptedIn ? (
            <div>
              <p className="hha-eyebrow-earth">Your position</p>
              <p className="mt-2 font-display text-display-md leading-none text-ink tabular-nums">
                {CURRENT_TERM.classPosition}
                <span className="text-[22px] text-stone"> of {CURRENT_TERM.classSize}</span>
              </p>
              <p className="mt-1 font-sans text-[12px] text-stone">
                Shown to you only · opt in/out under Privacy
              </p>
            </div>
          ) : (
            <div>
              <p className="hha-eyebrow-earth">Class position</p>
              <p className="mt-2 font-serif text-[16px] text-stone">
                Hidden. You can opt in under Profile → Privacy.
              </p>
            </div>
          )}
          <div>
            <p className="hha-eyebrow-earth">Report card</p>
            <p className="mt-2 font-serif text-[15px] text-stone">
              Releases after mid-term. Form teacher and head both sign off.
            </p>
          </div>
        </div>
      </div>

      {/* Subject grid */}
      <section>
        <h2 className="sr-only">Subjects</h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {GRADEBOOK_FARAI.map((row) => {
            const tone =
              row.total >= 80 ? 'text-ok' : row.total >= 50 ? 'text-ink' : 'text-warn';
            const gradeSurface =
              row.grade === 'A'
                ? 'bg-[#EBE8F5] text-[#4F3E99]'
                : row.grade === 'B'
                ? 'bg-sand-light text-earth'
                : row.grade === 'C'
                ? 'bg-[#FDF4E3] text-[#92650B]'
                : 'bg-[#FBEBEA] text-[#B0362A]';
            return (
              <li key={row.subjectCode}>
                <Link
                  href={`/student/grades/${row.subjectCode.toLowerCase()}`}
                  className="group block h-full rounded border border-sand bg-white p-5 transition-all duration-200 ease-out-soft hover:-translate-y-px hover:shadow-e2"
                >
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                    {row.subjectCode}
                  </p>
                  <p className="mt-1 font-display text-[18px] leading-snug text-ink group-hover:text-earth">
                    {row.subjectName}
                  </p>
                  <div className="mt-5 flex items-end justify-between">
                    <span className={`font-display text-[44px] leading-none tabular-nums ${tone}`}>
                      {row.total}
                      <span className="text-[20px] text-stone">%</span>
                    </span>
                    <TrendArrow direction={row.trend === 'up' ? 'up' : row.trend === 'down' ? 'down' : 'flat'} />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span
                      className={`rounded-sm px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] ${gradeSurface}`}
                    >
                      Grade {row.grade}
                    </span>
                    <span className="font-sans text-[12px] text-stone">
                      Position {row.position}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Subject breakdown table (compact) */}
      <EditorialCard className="overflow-hidden">
        <div className="border-b border-sand px-6 py-4">
          <SectionEyebrow>Breakdown</SectionEyebrow>
          <p className="mt-1 font-sans text-[13px] text-stone">
            Continuous 40% · Mid-term 20% · End-term 40%
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="bg-sand-light/40 text-left font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                <th className="px-6 py-3">Subject</th>
                <th className="px-4 py-3 text-right">CA</th>
                <th className="px-4 py-3 text-right">Mid</th>
                <th className="px-4 py-3 text-right">End</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3">Grade</th>
              </tr>
            </thead>
            <tbody>
              {GRADEBOOK_FARAI.map((row) => (
                <tr key={row.subjectCode} className="border-t border-sand-light">
                  <td className="px-6 py-3">
                    <span className="font-sans font-medium text-ink">{row.subjectName}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums">{row.continuous}%</td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums">{row.midterm}%</td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-stone">
                    {row.endterm ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums font-semibold text-ink">
                    {row.total}%
                  </td>
                  <td className="px-4 py-3 font-sans font-medium">{row.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </EditorialCard>
    </div>
  );
}
