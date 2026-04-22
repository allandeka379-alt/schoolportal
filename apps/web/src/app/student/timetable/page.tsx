import { SUBJECTS, TIMETABLE_FORM3_BLUE } from '@/lib/mock/fixtures';
import { TODAY_SLOTS } from '@/lib/mock/student-extras';

import { EditorialCard, SectionEyebrow } from '@/components/student/primitives';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const;
const PERIODS = [
  { start: '07:30', end: '08:15' },
  { start: '08:20', end: '09:05' },
  { start: '09:10', end: '09:55' },
  { start: '10:30', end: '11:15' },
];

/**
 * Timetable — §10 of the spec.
 *
 * Two views shown on the same page:
 *   - Today (narrow left column)
 *   - Week grid (wider right column)
 */
export default function TimetablePage() {
  function lookup(day: (typeof DAYS)[number], start: string) {
    return TIMETABLE_FORM3_BLUE.find((s) => s.day === day && s.start === start);
  }
  function subjectName(code: string) {
    return SUBJECTS.find((s) => s.code === code)?.name ?? code;
  }
  const today = new Date().toLocaleDateString('en-ZW', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="space-y-8">
      <header>
        <SectionEyebrow>Timetable</SectionEyebrow>
        <h1 className="mt-2 font-display text-[clamp(1.75rem,3vw,2.25rem)] text-ink">
          Where to be,{' '}
          <span className="italic font-light text-terracotta">when.</span>
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Today column */}
        <div className="lg:col-span-4">
          <EditorialCard className="overflow-hidden">
            <div className="border-b border-sand px-6 py-4">
              <SectionEyebrow>Today</SectionEyebrow>
              <p className="mt-1 font-sans text-[13px] text-stone">{today}</p>
            </div>
            <ul className="divide-y divide-sand-light">
              {TODAY_SLOTS.map((slot) => (
                <li
                  key={slot.start}
                  className={`relative flex items-center gap-3 px-6 py-3 ${
                    slot.current ? 'bg-sand-light/60' : ''
                  }`}
                >
                  {slot.current ? (
                    <span
                      aria-hidden
                      className="absolute inset-y-2 left-0 w-[2px] rounded-r-sm bg-terracotta"
                    />
                  ) : null}
                  <span className="w-16 flex-none font-mono text-[13px] tabular-nums text-stone">
                    {slot.start}
                  </span>
                  <div className="min-w-0 flex-1">
                    {slot.kind === 'class' ? (
                      <>
                        <p className="font-display text-[16px] text-ink">{slot.subject}</p>
                        <p className="font-sans text-[12px] text-stone">
                          {[slot.teacher, slot.room].filter(Boolean).join(' · ')}
                        </p>
                      </>
                    ) : (
                      <p className="font-serif italic text-[15px] text-stone">{slot.subject}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </EditorialCard>
        </div>

        {/* Week grid */}
        <div className="lg:col-span-8">
          <EditorialCard className="overflow-hidden">
            <div className="border-b border-sand px-6 py-4">
              <SectionEyebrow>This week</SectionEyebrow>
              <p className="mt-1 font-sans text-[13px] text-stone">Form 3 Blue</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="bg-sand-light/40">
                    <th className="px-3 py-2 text-left font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                      Period
                    </th>
                    {DAYS.map((d) => (
                      <th
                        key={d}
                        className="px-3 py-2 text-left font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone"
                      >
                        {d}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PERIODS.map((p) => (
                    <tr key={p.start} className="border-t border-sand-light align-top">
                      <td className="px-3 py-3 font-mono text-[12px] text-stone tabular-nums">
                        {p.start}
                        <br />
                        {p.end}
                      </td>
                      {DAYS.map((d) => {
                        const slot = lookup(d, p.start);
                        return (
                          <td key={d} className="px-2 py-3">
                            {slot ? (
                              <div className="rounded border border-sand bg-cream px-3 py-2">
                                <p className="font-display text-[14px] text-ink">
                                  {subjectName(slot.subjectCode)}
                                </p>
                                <p className="mt-0.5 font-sans text-[11px] text-stone">Room {slot.room}</p>
                              </div>
                            ) : (
                              <span className="text-stone">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </EditorialCard>
        </div>
      </div>
    </div>
  );
}
