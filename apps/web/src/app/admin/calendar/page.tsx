'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Calendar as CalendarIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapPin,
  Plus,
  Users,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  SCHOOL_EVENTS,
  eventAudienceLabel,
  type EventAudience,
  type EventKind,
  type SchoolEvent,
} from '@/lib/mock/school';

const KIND_TONE: Record<EventKind, 'brand' | 'danger' | 'success' | 'warning' | 'neutral' | 'info' | 'gold'> = {
  TERM: 'brand',
  EXAM: 'danger',
  SPORT: 'success',
  PARENT_MEETING: 'gold',
  SPEECH_DAY: 'warning',
  PUBLIC_HOLIDAY: 'neutral',
  INSET: 'info',
  DEADLINE: 'warning',
  TRIP: 'gold',
};

const KIND_DOT: Record<EventKind, string> = {
  TERM: 'bg-brand-primary',
  EXAM: 'bg-danger',
  SPORT: 'bg-success',
  PARENT_MEETING: 'bg-brand-accent',
  SPEECH_DAY: 'bg-warning',
  PUBLIC_HOLIDAY: 'bg-muted',
  INSET: 'bg-info',
  DEADLINE: 'bg-warning',
  TRIP: 'bg-brand-accent',
};

const KIND_CELL_BG: Record<EventKind, string> = {
  TERM: 'bg-brand-primary text-white',
  EXAM: 'bg-danger/10 text-danger',
  SPORT: 'bg-success/10 text-success',
  PARENT_MEETING: 'bg-brand-accent/15 text-brand-accent',
  SPEECH_DAY: 'bg-warning/10 text-warning',
  PUBLIC_HOLIDAY: 'bg-surface text-muted',
  INSET: 'bg-info/10 text-info',
  DEADLINE: 'bg-warning/10 text-warning',
  TRIP: 'bg-brand-accent/15 text-brand-accent',
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
  const [monthOffset, setMonthOffset] = useState(0);
  const anchor = new Date(2026, 4 + monthOffset, 1);
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const [selectedId, setSelectedId] = useState<string>(SCHOOL_EVENTS[0]!.id);
  const [localEvents, setLocalEvents] = useState<SchoolEvent[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const allEvents = useMemo(() => [...localEvents, ...SCHOOL_EVENTS], [localEvents]);

  const monthEvents = useMemo(() => {
    return allEvents.filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }, [year, month, allEvents]);

  const upcoming = useMemo(() => {
    const now = new Date('2026-04-23T00:00:00Z').getTime();
    return [...allEvents]
      .filter((e) => new Date(e.date).getTime() >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [allEvents]);

  const selected = allEvents.find((e) => e.id === selectedId) ?? allEvents[0]!;

  function addEvent(e: SchoolEvent) {
    setLocalEvents((curr) => [e, ...curr]);
    setSelectedId(e.id);
    setAddOpen(false);
    setToast(`Added "${e.title}" · parents and staff notified`);
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const leading = (firstWeekday + 6) % 7;
  const grid: (number | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (grid.length % 7 !== 0) grid.push(null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-small text-muted">Operations · calendar</p>
          <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-ink">
            Master school calendar
          </h1>
          <p className="mt-2 max-w-[72ch] text-small text-muted">
            Term dates · exams · sports · parent meetings · speech day. Every published event flows
            to student, teacher and parent portals with their audience filter applied.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-primary px-5 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md"
        >
          <Plus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          Add event
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Month grid */}
        <section className="xl:col-span-2">
          <div className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
            <header className="flex items-center justify-between border-b border-line px-5 py-3.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMonthOffset((o) => o - 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-card text-muted transition-colors hover:bg-surface hover:text-ink"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
                </button>
                <p className="text-h3 text-ink">
                  {anchor.toLocaleString('en-ZW', { month: 'long', year: 'numeric' })}
                </p>
                <button
                  type="button"
                  onClick={() => setMonthOffset((o) => o + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-card text-muted transition-colors hover:bg-surface hover:text-ink"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setMonthOffset(0)}
                className="inline-flex h-9 items-center rounded-full border border-line bg-card px-3 text-micro font-semibold text-ink transition-colors hover:bg-surface"
              >
                Today
              </button>
            </header>

            <div className="grid grid-cols-7 border-b border-line bg-surface/60">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                <p
                  key={d}
                  className="px-2 py-2 text-center text-micro font-semibold uppercase tracking-[0.12em] text-muted"
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
                      'min-h-[96px] border-b border-r border-line/60 px-2 py-1.5 last:border-r-0',
                      isToday ? 'bg-brand-primary/[0.06]' : 'bg-card',
                    ].join(' ')}
                  >
                    {day ? (
                      <>
                        <p
                          className={[
                            'text-micro tabular-nums',
                            isToday ? 'font-bold text-brand-primary' : 'text-muted',
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
                                  'block w-full truncate rounded-sm px-1.5 py-0.5 text-left text-micro transition-opacity',
                                  selectedId === e.id
                                    ? KIND_CELL_BG[e.kind]
                                    : 'bg-surface text-ink hover:opacity-80',
                                ].join(' ')}
                              >
                                {e.title}
                              </button>
                            </li>
                          ))}
                          {events.length > 2 ? (
                            <li>
                              <span className="text-micro text-muted">
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
          <div className="mt-3 flex flex-wrap items-center gap-3 px-1 text-micro text-muted">
            {(Object.keys(KIND_LABEL) as EventKind[]).map((k) => (
              <span key={k} className="inline-flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${KIND_DOT[k]}`} aria-hidden />
                {KIND_LABEL[k]}
              </span>
            ))}
          </div>
        </section>

        {/* Side panel */}
        <section className="space-y-4 xl:col-span-1">
          <div className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
            <header className="border-b border-line px-5 py-3.5">
              <h2 className="text-small font-semibold text-ink">Upcoming</h2>
              <p className="text-micro text-muted">Next 6 weeks</p>
            </header>
            <ul className="divide-y divide-line">
              {upcoming.slice(0, 7).map((e) => {
                const activeRow = selectedId === e.id;
                return (
                  <li key={e.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(e.id)}
                      className={[
                        'flex w-full items-start gap-3 px-5 py-3 text-left transition-colors',
                        activeRow ? 'bg-brand-primary/[0.06]' : 'hover:bg-surface/40',
                      ].join(' ')}
                    >
                      <div className="flex w-12 flex-none flex-col items-center justify-center rounded-md border border-line bg-surface/40 py-1">
                        <p className="text-micro uppercase tracking-[0.1em] text-muted">
                          {new Date(e.date).toLocaleDateString('en-ZW', { month: 'short' })}
                        </p>
                        <p className="text-h3 font-bold tabular-nums text-ink">
                          {new Date(e.date).getDate()}
                        </p>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-small font-semibold text-ink">{e.title}</p>
                        <p className="mt-0.5 flex items-center gap-2 text-micro text-muted">
                          <span
                            className={`h-1.5 w-1.5 flex-none rounded-full ${KIND_DOT[e.kind]}`}
                            aria-hidden
                          />
                          <span className="truncate">
                            {KIND_LABEL[e.kind]}
                            {e.time ? ` · ${e.time}` : ''}
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

      {addOpen ? (
        <AddEventModal onClose={() => setAddOpen(false)} onAdd={addEvent} />
      ) : null}

      {toast ? (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-micro font-semibold text-white shadow-card-md"
        >
          <Check className="mr-1 inline-block h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          {toast}
        </div>
      ) : null}
    </div>
  );
}

function AddEventModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (e: SchoolEvent) => void;
}) {
  const [title, setTitle] = useState('');
  const [kind, setKind] = useState<EventKind>('EXAM');
  const [date, setDate] = useState('2026-05-12');
  const [time, setTime] = useState('09:00');
  const [location, setLocation] = useState('');
  const [audience, setAudience] = useState<EventAudience[]>(['SCHOOL']);
  const [description, setDescription] = useState('');
  const [requiresRsvp, setRequiresRsvp] = useState(false);
  const [saving, setSaving] = useState(false);

  const audiences: EventAudience[] = [
    'SCHOOL',
    'FORM_1',
    'FORM_2',
    'FORM_3',
    'FORM_4',
    'STAFF',
    'PARENTS',
    'BOARDERS',
  ];
  const kinds: EventKind[] = [
    'EXAM',
    'SPORT',
    'PARENT_MEETING',
    'SPEECH_DAY',
    'PUBLIC_HOLIDAY',
    'INSET',
    'DEADLINE',
    'TRIP',
    'TERM',
  ];

  function toggleAudience(a: EventAudience) {
    setAudience((curr) =>
      curr.includes(a) ? curr.filter((x) => x !== a) : [...curr, a],
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || audience.length === 0) return;
    setSaving(true);
    setTimeout(() => {
      onAdd({
        id: `evt-${Date.now()}`,
        title: title.trim(),
        kind,
        date,
        time: time || undefined,
        location: location.trim() || undefined,
        audience,
        description: description.trim() || undefined,
        requiresRsvp,
      });
    }, 600);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-lg border border-line bg-card shadow-card-md"
      >
        <header className="flex items-center justify-between border-b border-line px-6 py-4">
          <div>
            <p className="text-micro font-semibold uppercase tracking-[0.12em] text-brand-primary">
              Add event
            </p>
            <h3 className="text-h3 text-ink">New calendar entry</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-muted transition-colors hover:bg-surface hover:text-ink"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </header>
        <div className="space-y-4 overflow-y-auto p-6">
          <label className="block">
            <span className="mb-2 block text-micro font-semibold uppercase tracking-[0.12em] text-muted">
              Title
            </span>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sports Day"
              className="h-11 w-full rounded-md border border-line bg-card px-3 text-small text-ink placeholder:text-muted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-2 block text-micro font-semibold uppercase tracking-[0.12em] text-muted">
                Kind
              </span>
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as EventKind)}
                className="h-11 w-full rounded-md border border-line bg-card px-3 text-small text-ink focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              >
                {kinds.map((k) => (
                  <option key={k} value={k}>
                    {k.replace(/_/g, ' ').toLowerCase()}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-micro font-semibold uppercase tracking-[0.12em] text-muted">
                Date
              </span>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-11 w-full rounded-md border border-line bg-card px-3 text-small text-ink focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-2 block text-micro font-semibold uppercase tracking-[0.12em] text-muted">
                Time (optional)
              </span>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="h-11 w-full rounded-md border border-line bg-card px-3 text-small text-ink focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-micro font-semibold uppercase tracking-[0.12em] text-muted">
                Location
              </span>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Main hall"
                className="h-11 w-full rounded-md border border-line bg-card px-3 text-small text-ink placeholder:text-muted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              />
            </label>
          </div>
          <div>
            <p className="mb-2 text-micro font-semibold uppercase tracking-[0.12em] text-muted">
              Audience
            </p>
            <div className="flex flex-wrap gap-1.5">
              {audiences.map((a) => {
                const on = audience.includes(a);
                return (
                  <button
                    type="button"
                    key={a}
                    onClick={() => toggleAudience(a)}
                    className={[
                      'inline-flex h-8 items-center rounded-full border px-3 text-micro font-semibold transition-colors',
                      on
                        ? 'border-brand-primary bg-brand-primary text-white'
                        : 'border-line bg-card text-muted hover:bg-surface',
                    ].join(' ')}
                  >
                    {eventAudienceLabel(a)}
                  </button>
                );
              })}
            </div>
          </div>
          <label className="block">
            <span className="mb-2 block text-micro font-semibold uppercase tracking-[0.12em] text-muted">
              Description (optional)
            </span>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short summary — shown in student, parent and teacher feeds."
              className="w-full rounded-md border border-line bg-card p-3 text-small text-ink placeholder:text-muted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </label>
          <label className="inline-flex cursor-pointer select-none items-center gap-2 text-small text-ink">
            <input
              type="checkbox"
              checked={requiresRsvp}
              onChange={(e) => setRequiresRsvp(e.target.checked)}
              className="h-4 w-4 rounded border-line accent-brand-primary"
            />
            Require RSVP from parents
          </label>
        </div>
        <footer className="flex items-center justify-end gap-2 border-t border-line bg-card px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-primary px-4 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} aria-hidden />
            ) : (
              <Plus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            )}
            {saving ? 'Saving…' : 'Publish event'}
          </button>
        </footer>
      </form>
    </div>
  );
}

function EventDetail({ event }: { event: SchoolEvent }) {
  return (
    <article className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
      <header className="border-b border-line px-5 py-4">
        <Badge tone={KIND_TONE[event.kind]} dot>
          {KIND_LABEL[event.kind]}
        </Badge>
        <h3 className="mt-2 text-h3 leading-snug tracking-tight text-ink">{event.title}</h3>
      </header>

      <div className="space-y-3 px-5 py-4">
        <p className="flex items-center gap-2 text-small text-ink">
          <CalendarIcon className="h-3.5 w-3.5 text-brand-primary" strokeWidth={1.75} aria-hidden />
          <span>
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
          </span>
        </p>
        {event.location ? (
          <p className="flex items-center gap-2 text-small text-ink">
            <MapPin className="h-3.5 w-3.5 text-brand-primary" strokeWidth={1.75} aria-hidden />
            {event.location}
          </p>
        ) : null}
        <p className="flex items-start gap-2 text-small text-muted">
          <Users
            className="mt-0.5 h-3.5 w-3.5 flex-none text-brand-primary"
            strokeWidth={1.75}
            aria-hidden
          />
          <span>{event.audience.map((a) => eventAudienceLabel(a)).join(' · ')}</span>
        </p>
        {event.description ? (
          <p className="text-small leading-relaxed text-ink">{event.description}</p>
        ) : null}
        {event.requiresRsvp ? (
          <div className="rounded-md border border-brand-accent/40 bg-brand-accent/5 px-3 py-2">
            <p className="text-micro font-semibold uppercase tracking-[0.12em] text-brand-accent">
              RSVP required
            </p>
            <p className="mt-0.5 text-small text-ink">
              Parents see an acknowledge prompt on their dashboard.
            </p>
          </div>
        ) : null}
      </div>
    </article>
  );
}
