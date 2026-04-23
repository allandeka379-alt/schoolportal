'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';

import { SUBJECTS, TIMETABLE_FORM3_BLUE } from '@/lib/mock/fixtures';
import { TODAY_SLOTS } from '@/lib/mock/student-extras';

import { EditorialCard, SectionEyebrow } from '@/components/student/primitives';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const;
type Day = (typeof DAYS)[number];

const PERIODS = [
  { label: 'P1', start: '07:30', end: '08:15' },
  { label: 'P2', start: '08:20', end: '09:05' },
  { label: 'P3', start: '09:10', end: '09:55' },
  { label: 'Break', start: '09:55', end: '10:30', isBreak: true },
  { label: 'P4', start: '10:30', end: '11:15' },
];

/**
 * Subject tones — a muted, distinct surface per subject so the week grid
 * reads at a glance even without reading labels.
 */
const SUBJECT_TONE: Record<string, { bg: string; text: string }> = {
  MATH: { bg: 'bg-[#EBE8F5]', text: 'text-[#4F3E99]' },
  ENGL: { bg: 'bg-[#E6F0E9]', text: 'text-[#2F7D4E]' },
  SHON: { bg: 'bg-[#FDF4E3]', text: 'text-[#92650B]' },
  CHEM: { bg: 'bg-[#FBEBEA]', text: 'text-[#B0362A]' },
  PHYS: { bg: 'bg-[#E8EDF5]', text: 'text-[#30527A]' },
  BIO: { bg: 'bg-[#EAF1EA]', text: 'text-[#426E42]' },
  HIST: { bg: 'bg-[#F3EDE2]', text: 'text-[#6E5320]' },
  GEOG: { bg: 'bg-[#EAEFEF]', text: 'text-[#3F5F5F]' },
};

const DEFAULT_TONE = { bg: 'bg-sand-light', text: 'text-earth' };

export default function TimetablePage() {
  const [weekOffset, setWeekOffset] = useState(0); // 0 = this week, -1 = last, +1 = next
  const [selectedDay, setSelectedDay] = useState<Day>(() => {
    const today = new Date().getDay(); // Sun=0..Sat=6
    const map: Record<number, Day> = { 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri' };
    return map[today] ?? 'Mon';
  });

  const weekLabel = useMemo(() => {
    const today = new Date();
    const monday = new Date(today);
    const day = monday.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    monday.setDate(monday.getDate() + diff + weekOffset * 7);
    const friday = new Date(monday);
    friday.setDate(friday.getDate() + 4);
    const fmt = (d: Date) =>
      d.toLocaleDateString('en-ZW', { day: 'numeric', month: 'short' });
    return `${fmt(monday)} – ${fmt(friday)}`;
  }, [weekOffset]);

  const todayName = useMemo(() => {
    const d = new Date();
    const map: Record<number, Day> = { 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri' };
    return map[d.getDay()];
  }, []);

  function lookup(day: Day, start: string) {
    return TIMETABLE_FORM3_BLUE.find((s) => s.day === day && s.start === start);
  }
  function subjectName(code: string) {
    return SUBJECTS.find((s) => s.code === code)?.name ?? code;
  }
  function subjectTeacher(code: string) {
    return SUBJECTS.find((s) => s.code === code)?.teacher ?? '';
  }

  const selectedDaySlots = useMemo(
    () =>
      TIMETABLE_FORM3_BLUE.filter((s) => s.day === selectedDay).sort((a, b) =>
        a.start.localeCompare(b.start),
      ),
    [selectedDay],
  );

  const isThisWeek = weekOffset === 0;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionEyebrow>Timetable</SectionEyebrow>
          <h1 className="mt-2 font-display text-[clamp(1.75rem,3vw,2.25rem)] text-ink">
            Where to be,{' '}
            <span className="italic font-light text-terracotta">when.</span>
          </h1>
          <p className="mt-2 font-sans text-[13px] text-stone">
            Form 3 Blue · {weekLabel}
            {isThisWeek ? ' · this week' : weekOffset < 0 ? ' · past week' : ' · upcoming week'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setWeekOffset((w) => w - 1)}
            aria-label="Previous week"
            className="inline-flex h-9 w-9 items-center justify-center rounded border border-sand bg-white text-earth hover:bg-sand-light"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => setWeekOffset(0)}
            disabled={isThisWeek}
            className={[
              'inline-flex h-9 items-center gap-2 rounded border px-3 font-sans text-[13px] font-medium transition-colors',
              isThisWeek
                ? 'border-sand bg-sand-light text-stone cursor-default'
                : 'border-sand bg-white text-earth hover:bg-sand-light',
            ].join(' ')}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setWeekOffset((w) => w + 1)}
            aria-label="Next week"
            className="inline-flex h-9 w-9 items-center justify-center rounded border border-sand bg-white text-earth hover:bg-sand-light"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Day tabs */}
      <div role="tablist" aria-label="Day" className="flex flex-wrap gap-2">
        {DAYS.map((d) => {
          const active = selectedDay === d;
          const isToday = isThisWeek && d === todayName;
          return (
            <button
              key={d}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSelectedDay(d)}
              className={[
                'inline-flex h-9 items-center gap-2 rounded-full px-4 font-sans text-[13px] font-medium transition-colors',
                active
                  ? 'bg-ink text-cream'
                  : 'border border-sand bg-white text-stone hover:bg-sand-light',
              ].join(' ')}
            >
              {d}
              {isToday ? (
                <span
                  aria-hidden
                  className={[
                    'h-1.5 w-1.5 rounded-full',
                    active ? 'bg-cream' : 'bg-terracotta',
                  ].join(' ')}
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Day column */}
        <div className="lg:col-span-4">
          <EditorialCard className="overflow-hidden">
            <div className="border-b border-sand px-6 py-4">
              <SectionEyebrow>{selectedDay}</SectionEyebrow>
              <p className="mt-1 font-sans text-[13px] text-stone">
                {isThisWeek && selectedDay === todayName ? 'Today' : `${weekLabel.split(' – ')[0]} start`} ·{' '}
                {selectedDaySlots.length} classes
              </p>
            </div>
            <ul className="divide-y divide-sand-light">
              {isThisWeek && selectedDay === todayName
                ? TODAY_SLOTS.map((slot) => (
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
                      {slot.current ? (
                        <span className="rounded-full bg-terracotta px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-cream">
                          Now
                        </span>
                      ) : null}
                    </li>
                  ))
                : selectedDaySlots.map((slot) => {
                    const tone = SUBJECT_TONE[slot.subjectCode] ?? DEFAULT_TONE;
                    return (
                      <li key={slot.start} className="flex items-center gap-3 px-6 py-3">
                        <span className="w-16 flex-none font-mono text-[13px] tabular-nums text-stone">
                          {slot.start}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className={`font-display text-[16px] ${tone.text}`}>
                            {subjectName(slot.subjectCode)}
                          </p>
                          <p className="font-sans text-[12px] text-stone">
                            {subjectTeacher(slot.subjectCode)} · Room {slot.room}
                          </p>
                        </div>
                      </li>
                    );
                  })}
              {!isThisWeek && selectedDaySlots.length === 0 ? (
                <li className="px-6 py-8 text-center font-sans text-[13px] text-stone">
                  No classes scheduled.
                </li>
              ) : null}
            </ul>
          </EditorialCard>

          {/* Up next */}
          {isThisWeek && selectedDay === todayName ? (
            <EditorialCard className="mt-4 p-6">
              <SectionEyebrow>Up next</SectionEyebrow>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-12 w-12 flex-none items-center justify-center rounded bg-sand-light">
                  <Clock className="h-5 w-5 text-earth" strokeWidth={1.5} aria-hidden />
                </div>
                <div>
                  {(() => {
                    const next = TODAY_SLOTS.find((s) => s.kind === 'class' && !s.current);
                    return next ? (
                      <>
                        <p className="font-display text-[15px] text-ink">
                          {next.subject}
                        </p>
                        <p className="font-sans text-[12px] text-stone">
                          {next.start} · {next.teacher} · {next.room}
                        </p>
                      </>
                    ) : (
                      <p className="font-sans text-[13px] text-stone">No more classes today.</p>
                    );
                  })()}
                </div>
              </div>
            </EditorialCard>
          ) : null}
        </div>

        {/* Week grid */}
        <div className="lg:col-span-8">
          <EditorialCard className="overflow-hidden">
            <div className="border-b border-sand px-6 py-4">
              <SectionEyebrow>This week</SectionEyebrow>
              <p className="mt-1 font-sans text-[13px] text-stone">
                Mon–Fri · click a day above to focus
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="bg-sand-light/40">
                    <th className="px-3 py-2 text-left font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                      Period
                    </th>
                    {DAYS.map((d) => {
                      const isToday = isThisWeek && d === todayName;
                      const active = d === selectedDay;
                      return (
                        <th
                          key={d}
                          className={[
                            'px-3 py-2 text-left font-sans text-[11px] font-semibold uppercase tracking-[0.14em]',
                            active
                              ? 'text-ink bg-sand-light'
                              : isToday
                              ? 'text-terracotta'
                              : 'text-stone',
                          ].join(' ')}
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedDay(d)}
                            className="flex items-center gap-1 hover:underline underline-offset-4"
                          >
                            {d}
                            {isToday ? (
                              <span
                                aria-hidden
                                className="h-1.5 w-1.5 rounded-full bg-terracotta"
                              />
                            ) : null}
                          </button>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {PERIODS.map((p) => (
                    <tr key={p.label} className="border-t border-sand-light align-top">
                      <td className="px-3 py-3 font-mono text-[12px] text-stone tabular-nums">
                        {p.label}
                        <br />
                        {p.start}
                      </td>
                      {DAYS.map((d) => {
                        if (p.isBreak) {
                          return (
                            <td key={d} className="px-2 py-3">
                              <div className="rounded border border-dashed border-sand bg-white px-3 py-2 text-center">
                                <p className="font-sans text-[11px] italic text-stone">Break</p>
                              </div>
                            </td>
                          );
                        }
                        const slot = lookup(d, p.start);
                        const tone = slot
                          ? SUBJECT_TONE[slot.subjectCode] ?? DEFAULT_TONE
                          : DEFAULT_TONE;
                        const isTodayCol = isThisWeek && d === todayName;
                        return (
                          <td
                            key={d}
                            className={[
                              'px-2 py-3',
                              isTodayCol ? 'bg-sand-light/30' : '',
                            ].join(' ')}
                          >
                            {slot ? (
                              <div className={`rounded border border-sand ${tone.bg} px-3 py-2`}>
                                <p className={`font-display text-[14px] ${tone.text}`}>
                                  {subjectName(slot.subjectCode)}
                                </p>
                                <p className="mt-0.5 flex items-center gap-1 font-sans text-[11px] text-stone">
                                  <MapPin className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                                  {slot.room}
                                </p>
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
