'use client';

import { useMemo, useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Plus,
  Users,
} from 'lucide-react';

import {
  SCHOOL_EVENTS,
  eventAudienceLabel,
  type EventKind,
  type SchoolEvent,
} from '@/lib/mock/school';

/**
 * Master school calendar — admin view.
 *
 * Month grid on the left; upcoming list + event detail on the right.
 * Events are tinted by kind so at a glance the week's shape is obvious.
 */

const KIND_COLOR: Record<EventKind, string> = {
  TERM: 'bg-obsidian text-snow',
  EXAM: 'bg-signal-error/15 text-signal-error',
  SPORT: 'bg-signal-success/15 text-signal-success',
  PARENT_MEETING: 'bg-[rgb(var(--accent))]/15 text-[rgb(var(--accent))]',
  SPEECH_DAY: 'bg-signal-warning/15 text-signal-warning',
  PUBLIC_HOLIDAY: 'bg-fog text-slate',
  INSET: 'bg-graphite/10 text-graphite',
  DEADLINE: 'bg-signal-warning/10 text-signal-warning',
  TRIP: 'bg-[rgb(var(--accent))]/10 text-[rgb(var(--accent))]',
};

const KIND_DOT: Record<EventKind, string> = {
  TERM: 'bg-obsidian',
  EXAM: 'bg-signal-error',
  SPORT: 'bg-signal-success',
  PARENT_MEETING: 'bg-[rgb(var(--accent))]',
  SPEECH_DAY: 'bg-signal-warning',
  PUBLIC_HOLIDAY: 'bg-steel',
  INSET: 'bg-graphite',
  DEADLINE: 'bg-signal-warning',
  TRIP: 'bg-[rgb(var(--accent))]',
};

const KIND_LABEL: Record<EventKind, string> = {
  TERM: 'Term',
  EXAM: 'Exam',
  SPORT: 'Sport',
  PARENT_MEETING: 'Parent',
  SPEECH_DAY: 'Speech Day',
  PUBLIC_HOLIDAY: 'Holiday',
  INSET: 'INSET',
  DEADLINE: 'Deadline',
  TRIP: 'Trip',
};

export default function AdminCalendarPage() {
  // Anchor on May 2026 since that's where the demo events live.
  const [monthOffset, setMonthOffset] = useState(0);
  const anchor = new Date(2026, 4 + monthOffset, 1); // May 2026 + offset
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const [selectedId, setSelectedId] = useState<string>(SCHOOL_EVENTS[0]!.id);

  const monthEvents = useMemo(() => {
    return SCHOOL_EVENTS.filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }, [year, month]);

  const upcoming = useMemo(() => {
    const now = new Date('2026-04-23T00:00:00Z').getTime();
    return [...SCHOOL_EVENTS]
      .filter((e) => new Date(e.date).getTime() >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, []);

  const selected = SCHOOL_EVENTS.find((e) => e.id === selectedId) ?? SCHOOL_EVENTS[0]!;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay(); // 0 Sun - 6 Sat
  const leading = (firstWeekday + 6) % 7; // shift so Mon=0
  const grid: (number | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (grid.length % 7 !== 0) grid.push(null);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p
            className="font-mono text-[11px] font-medium uppercase tracking-[0.18em]"
            style={{ color: 'rgb(var(--accent))' }}
          >
            Operations · Calendar
          </p>
          <h1 className="mt-2 font-display text-[clamp(1.75rem,3vw,2.25rem)] font-medium tracking-tight text-obsidian">
            Master school calendar.
          </h1>
          <p className="mt-2 max-w-[72ch] font-sans text-[14px] text-slate">
            Term dates · exams · sports · parent meetings · speech day. Every published event flows
            to student, teacher and parent portals with their audience filter applied.
          </p>
        </div>
        <button type="button" className="btn-primary">
          <Plus className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          Add event
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Month grid */}
        <section className="xl:col-span-2">
          <div className="overflow-hidden rounded-md border border-mist bg-snow">
            <div className="flex items-center justify-between border-b border-mist px-5 py-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMonthOffset((o) => o - 1)}
                  className="rounded-md border border-mist p-1.5 text-slate hover:bg-fog"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                </button>
                <p className="font-display text-[18px] font-medium tracking-tight text-obsidian">
                  {anchor.toLocaleString('en-ZW', { month: 'long', year: 'numeric' })}
                </p>
                <button
                  type="button"
                  onClick={() => setMonthOffset((o) => o + 1)}
                  className="rounded-md border border-mist p-1.5 text-slate hover:bg-fog"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setMonthOffset(0)}
                className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-slate hover:text-obsidian"
              >
                Today
              </button>
            </div>

            <div className="grid grid-cols-7 border-b border-mist">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                <p
                  key={d}
                  className="px-2 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-steel"
                >
                  {d}
                </p>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {grid.map((day, i) => {
                const date = day
                  ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  : null;
                const events = date ? monthEvents.filter((e) => e.date === date) : [];
                const isToday = date === '2026-04-23';
                return (
                  <div
                    key={i}
                    className={[
                      'min-h-[92px] border-b border-r border-mist/60 px-2 py-1.5 last:border-r-0',
                      isToday ? 'bg-fog' : 'bg-snow',
                    ].join(' ')}
                  >
                    {day ? (
                      <>
                        <p
                          className={[
                            'font-mono text-[12px] tabular-nums',
                            isToday ? 'font-semibold text-obsidian' : 'text-steel',
                          ].join(' ')}
                        >
                          {day}
                        </p>
                        <ul className="mt-1 space-y-1">
                          {events.slice(0, 2).map((e) => (
                            <li key={e.id}>
                              <button
                                type="button"
                                onClick={() => setSelectedId(e.id)}
                                className={[
                                  'block w-full truncate rounded-sm px-1.5 py-0.5 text-left font-sans text-[11px] transition-opacity',
                                  selectedId === e.id ? KIND_COLOR[e.kind] : 'bg-fog text-slate hover:opacity-80',
                                ].join(' ')}
                              >
                                {e.title}
                              </button>
                            </li>
                          ))}
                          {events.length > 2 ? (
                            <li>
                              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-steel">
                                +{events.length - 2} more
                              </span>
                            </li>
                          ) : null}
                        </ul>
                      </>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-3 flex flex-wrap items-center gap-4 px-1 font-mono text-[11px] uppercase tracking-[0.1em] text-steel">
            {(Object.keys(KIND_LABEL) as EventKind[]).map((k) => (
              <span key={k} className="inline-flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${KIND_DOT[k]}`} aria-hidden />
                {KIND_LABEL[k]}
              </span>
            ))}
          </div>
        </section>

        {/* Side panel: upcoming + detail */}
        <section className="xl:col-span-1 space-y-4">
          <div className="overflow-hidden rounded-md border border-mist bg-snow">
            <div className="border-b border-mist px-5 py-3">
              <p className="font-sans text-[13px] font-medium text-obsidian">Upcoming</p>
              <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.1em] text-steel">
                Next 6 weeks
              </p>
            </div>
            <ul className="divide-y divide-mist">
              {upcoming.slice(0, 7).map((e) => {
                const active = selectedId === e.id;
                return (
                  <li key={e.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(e.id)}
                      className={[
                        'flex w-full items-start gap-3 px-5 py-3 text-left transition-colors',
                        active ? 'bg-fog' : 'hover:bg-fog/60',
                      ].join(' ')}
                    >
                      <div className="flex-none text-center">
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel">
                          {new Date(e.date).toLocaleDateString('en-ZW', { month: 'short' })}
                        </p>
                        <p className="font-display text-[22px] font-medium leading-none text-obsidian tabular-nums">
                          {new Date(e.date).getDate()}
                        </p>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-sans text-[13px] font-medium text-obsidian">
                          {e.title}
                        </p>
                        <p className="mt-0.5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em]">
                          <span
                            className={`h-1.5 w-1.5 flex-none rounded-full ${KIND_DOT[e.kind]}`}
                            aria-hidden
                          />
                          <span className="truncate text-steel">
                            {KIND_LABEL[e.kind]} {e.time ? `· ${e.time}` : ''}
                          </span>
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <EventDetail event={selected} />
        </section>
      </div>
    </div>
  );
}

function EventDetail({ event }: { event: SchoolEvent }) {
  return (
    <article className="overflow-hidden rounded-md border border-mist bg-snow">
      <div className="border-b border-mist px-5 py-4">
        <span
          className={[
            'inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em]',
            KIND_COLOR[event.kind],
          ].join(' ')}
        >
          {KIND_LABEL[event.kind]}
        </span>
        <h3 className="mt-2 font-display text-[18px] font-medium leading-snug tracking-tight text-obsidian">
          {event.title}
        </h3>
      </div>

      <div className="px-5 py-4 space-y-3">
        <p className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.08em] text-steel">
          <CalendarIcon className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          {new Date(event.date).toLocaleDateString('en-ZW', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
          {event.endDate
            ? ` → ${new Date(event.endDate).toLocaleDateString('en-ZW', {
                day: 'numeric',
                month: 'short',
              })}`
            : ''}
          {event.time ? ` · ${event.time}` : ''}
        </p>
        {event.location ? (
          <p className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.08em] text-steel">
            <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
            {event.location}
          </p>
        ) : null}
        <p className="flex items-start gap-2 font-mono text-[12px] uppercase tracking-[0.08em] text-steel">
          <Users className="mt-0.5 h-3.5 w-3.5 flex-none" strokeWidth={1.5} aria-hidden />
          <span className="lowercase tracking-normal">
            {event.audience.map((a) => eventAudienceLabel(a)).join(' · ')}
          </span>
        </p>
        {event.description ? (
          <p className="font-sans text-[13px] leading-relaxed text-slate">{event.description}</p>
        ) : null}
        {event.requiresRsvp ? (
          <div className="rounded-md border border-[rgb(var(--accent))]/40 bg-[rgb(var(--accent))]/5 px-3 py-2">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[rgb(var(--accent-hover))]">
              RSVP required
            </p>
            <p className="mt-0.5 font-sans text-[12px] text-slate">
              Parents see an acknowledge prompt on their dashboard.
            </p>
          </div>
        ) : null}
      </div>
    </article>
  );
}
