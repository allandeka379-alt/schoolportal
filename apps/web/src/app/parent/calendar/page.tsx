'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Calendar as CalendarIcon,
  CalendarCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  FileCheck2,
  MapPin,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { ChildColourDot } from '@/components/parent/primitives';
import {
  PARENT_CHILDREN,
  PARENT_EVENTS,
  type ParentCalendarKind,
  type ParentEvent,
} from '@/lib/mock/parent-extras';

/**
 * Parent calendar — card-dense redesign.
 *
 *   - KPI tile row (Events / Upcoming / RSVPs / Permissions)
 *   - Child filter pills + kind legend
 *   - Month grid in a card, civic typography
 *   - Upcoming list with coloured date block
 *   - Event preview modal
 */
const KIND_COLOUR: Record<ParentCalendarKind, { dot: string; badge: 'brand' | 'success' | 'warning' | 'info' | 'neutral' | 'gold'; label: string }> = {
  academic: { dot: 'bg-brand-primary', badge: 'brand', label: 'Academic' },
  sports: { dot: 'bg-success', badge: 'success', label: 'Sports' },
  cultural: { dot: 'bg-brand-accent', badge: 'gold', label: 'Cultural' },
  'parent-only': { dot: 'bg-warning', badge: 'warning', label: 'Parent-only' },
  holiday: { dot: 'bg-muted', badge: 'neutral', label: 'Holiday' },
  trip: { dot: 'bg-info', badge: 'info', label: 'Trip' },
};

export default function ParentCalendarPage() {
  const [cursor, setCursor] = useState(new Date('2026-05-01'));
  const [activeChildIds, setActiveChildIds] = useState<string[]>(
    PARENT_CHILDREN.map((c) => c.id),
  );
  const [rsvps, setRsvps] = useState<Record<string, 'yes' | 'no'>>({});
  const [permissions, setPermissions] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<ParentEvent | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const events = useMemo(
    () =>
      PARENT_EVENTS.filter((e) =>
        e.affectedChildIds.some((id) => activeChildIds.includes(id)),
      ),
    [activeChildIds],
  );

  function rsvp(id: string, answer: 'yes' | 'no') {
    setRsvps((curr) => ({ ...curr, [id]: answer }));
    setToast(answer === 'yes' ? 'RSVP confirmed' : 'RSVP declined — school notified');
  }

  function grantPermission(id: string) {
    setPermissions((curr) => {
      const next = new Set(curr);
      next.add(id);
      return next;
    });
    setToast('Permission granted · slip logged to office');
  }

  function exportIcs() {
    setToast('Calendar (.ics) downloading — subscribe in Apple/Google Calendar');
  }

  function effectiveRsvp(e: ParentEvent): 'yes' | 'no' | null {
    return rsvps[e.id] ?? e.rsvp ?? null;
  }

  function hasPermission(e: ParentEvent): boolean {
    return permissions.has(e.id) || e.permissionGranted === true;
  }

  const monthGrid = useMemo(() => buildMonthGrid(cursor, events), [cursor, events]);
  const upcoming = useMemo(() => {
    const now = Date.now();
    return events
      .filter((e) => new Date(e.date).getTime() >= now - 86400000)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5);
  }, [events]);

  const rsvpNeeded = upcoming.filter(
    (e) => e.kind === 'parent-only' && !effectiveRsvp(e),
  ).length;
  const permsNeeded = upcoming.filter(
    (e) => e.requiresPermission && !hasPermission(e),
  ).length;

  function toggleChild(id: string) {
    setActiveChildIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-small text-muted">Calendar</p>
          <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-ink">
            What&rsquo;s coming up for your family
          </h1>
          <p className="mt-2 text-small text-muted">
            All events across all children, colour-coded by kind.
          </p>
        </div>
        <button
          type="button"
          onClick={exportIcs}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface"
        >
          <Download className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          Export ICS
        </button>
      </header>

      {/* KPI tiles */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiTile label="Events visible" value={String(events.length)} sub="This month & beyond" />
        <KpiTile label="Upcoming" value={String(upcoming.length)} sub="Next 14 days" tone="brand" />
        <KpiTile
          label="RSVPs needed"
          value={String(rsvpNeeded)}
          sub={rsvpNeeded === 0 ? 'All caught up' : 'Parent-only events'}
          tone={rsvpNeeded > 0 ? 'warning' : 'success'}
        />
        <KpiTile
          label="Permissions"
          value={String(permsNeeded)}
          sub={permsNeeded === 0 ? 'All signed' : 'Slips pending'}
          tone={permsNeeded > 0 ? 'warning' : 'success'}
        />
      </ul>

      {/* Child filters + kind legend */}
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-line bg-card p-4 shadow-card-sm">
        <span className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
          Show for:
        </span>
        {PARENT_CHILDREN.map((c) => {
          const active = activeChildIds.includes(c.id);
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => toggleChild(c.id)}
              aria-pressed={active}
              className={[
                'inline-flex h-8 items-center gap-2 rounded-full border px-3 text-micro font-semibold transition-colors',
                active
                  ? 'border-brand-primary/30 bg-brand-primary/5 text-ink'
                  : 'border-line bg-surface text-muted line-through',
              ].join(' ')}
            >
              <ChildColourDot tone={c.colourTone} />
              {c.firstName}
            </button>
          );
        })}
        <span className="ml-auto flex flex-wrap items-center gap-3 text-micro text-muted">
          {(Object.keys(KIND_COLOUR) as ParentCalendarKind[]).map((k) => (
            <span key={k} className="inline-flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${KIND_COLOUR[k].dot}`} aria-hidden />
              {KIND_COLOUR[k].label}
            </span>
          ))}
        </span>
      </div>

      {/* Month header + grid */}
      <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
        <header className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <h2 className="text-small font-semibold text-ink">
            {cursor.toLocaleDateString('en-ZW', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() =>
                setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
              }
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-card text-muted transition-colors hover:bg-surface hover:text-ink"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={() => setCursor(new Date('2026-05-01'))}
              className="inline-flex h-9 items-center rounded-full border border-line bg-card px-3 text-micro font-semibold text-ink transition-colors hover:bg-surface"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() =>
                setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
              }
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-card text-muted transition-colors hover:bg-surface hover:text-ink"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </header>
        <div className="grid grid-cols-7 border-b border-line bg-surface/60 text-center">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
            <div
              key={d}
              className="py-2 text-micro font-semibold uppercase tracking-[0.12em] text-muted"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {monthGrid.map((cell, i) => (
            <div
              key={i}
              className={[
                'min-h-[96px] border-b border-r border-line p-2',
                cell.inMonth ? 'bg-card' : 'bg-surface/40',
                cell.isToday ? 'bg-brand-primary/5' : '',
              ].join(' ')}
            >
              <p
                className={[
                  'text-micro tabular-nums',
                  cell.inMonth ? 'text-ink' : 'text-muted/60',
                  cell.isToday ? 'font-bold text-brand-primary' : '',
                ].join(' ')}
              >
                {cell.day}
              </p>
              <ul className="mt-1 space-y-0.5">
                {cell.events.slice(0, 3).map((e) => (
                  <li key={e.id}>
                    <button
                      type="button"
                      onClick={() => setPreview(e)}
                      className="flex w-full items-center gap-1 truncate rounded-sm bg-surface px-1 py-0.5 text-left transition-colors hover:bg-brand-primary/5"
                      title={`${e.title} · ${e.time ?? ''}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 flex-none rounded-full ${KIND_COLOUR[e.kind].dot}`}
                        aria-hidden
                      />
                      <span className="truncate text-micro text-ink">{e.title}</span>
                    </button>
                  </li>
                ))}
                {cell.events.length > 3 ? (
                  <li className="text-micro text-muted">+ {cell.events.length - 3} more</li>
                ) : null}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming */}
      <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
        <header className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <div>
            <h2 className="text-small font-semibold text-ink">Upcoming</h2>
            <p className="text-micro text-muted">
              {upcoming.length} events in the next 14 days
            </p>
          </div>
        </header>
        <ul className="divide-y divide-line">
          {upcoming.map((e) => {
            const r = effectiveRsvp(e);
            const perm = hasPermission(e);
            return (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => setPreview(e)}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-surface/60"
                >
                  <div className="flex w-14 flex-none flex-col items-center justify-center rounded-md border border-line bg-surface/40 py-2">
                    <p className="text-micro uppercase tracking-[0.1em] text-muted">
                      {new Date(e.date).toLocaleDateString('en-ZW', { month: 'short' })}
                    </p>
                    <p className="text-h3 font-bold tabular-nums text-ink">
                      {new Date(e.date).getDate()}
                    </p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge tone={KIND_COLOUR[e.kind].badge} dot>
                        {KIND_COLOUR[e.kind].label}
                      </Badge>
                    </div>
                    <p className="mt-1 truncate text-small font-semibold text-ink">{e.title}</p>
                    <p className="text-micro text-muted">
                      {e.time ? `${e.time} · ` : ''}
                      {e.location ?? 'Junior High School'}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      {e.affectedChildIds.map((id) => {
                        const c = PARENT_CHILDREN.find((x) => x.id === id);
                        if (!c) return null;
                        return (
                          <span
                            key={id}
                            title={`Affects ${c.firstName}`}
                            className="inline-flex items-center gap-1 rounded-full border border-line bg-surface/60 px-2 py-0.5 text-micro text-muted"
                          >
                            <ChildColourDot tone={c.colourTone} />
                            {c.firstName}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  {e.requiresPermission && !perm ? (
                    <Badge tone="warning" dot>
                      Permission needed
                    </Badge>
                  ) : e.requiresPermission && perm ? (
                    <Badge tone="success" dot>
                      Permission granted
                    </Badge>
                  ) : r === 'yes' ? (
                    <Badge tone="success" dot>
                      RSVP&rsquo;d yes
                    </Badge>
                  ) : r === 'no' ? (
                    <Badge tone="neutral" dot>
                      Declined
                    </Badge>
                  ) : e.kind === 'parent-only' ? (
                    <Badge tone="warning" dot>
                      RSVP needed
                    </Badge>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {preview ? (
        <EventPreview
          event={preview}
          rsvp={effectiveRsvp(preview)}
          hasPermission={hasPermission(preview)}
          onClose={() => setPreview(null)}
          onRsvp={(answer) => {
            rsvp(preview.id, answer);
          }}
          onGrantPermission={() => grantPermission(preview.id)}
        />
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

function EventPreview({
  event,
  rsvp,
  hasPermission,
  onClose,
  onRsvp,
  onGrantPermission,
}: {
  event: ParentEvent;
  rsvp: 'yes' | 'no' | null;
  hasPermission: boolean;
  onClose: () => void;
  onRsvp: (answer: 'yes' | 'no') => void;
  onGrantPermission: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-lg border border-line bg-card shadow-card-md"
      >
        <div className="flex items-start justify-between gap-3 border-b border-line px-6 py-4">
          <div>
            <Badge tone={KIND_COLOUR[event.kind].badge} dot>
              {KIND_COLOUR[event.kind].label}
            </Badge>
            <h2 className="mt-2 text-h3 text-ink">{event.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-muted transition-colors hover:bg-surface hover:text-ink"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
        <div className="space-y-3 px-6 py-5 text-small text-muted">
          <p className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-brand-primary" strokeWidth={1.75} aria-hidden />
            <span className="text-ink">
              {new Date(event.date).toLocaleDateString('en-ZW', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            {event.time ? <span>· {event.time}</span> : null}
          </p>
          {event.location ? (
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-primary" strokeWidth={1.75} aria-hidden />
              <span className="text-ink">{event.location}</span>
            </p>
          ) : null}
          <div>
            <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
              Who this affects
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {event.affectedChildIds.map((id) => {
                const c = PARENT_CHILDREN.find((x) => x.id === id);
                if (!c) return null;
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2 py-0.5 text-micro text-ink"
                  >
                    <ChildColourDot tone={c.colourTone} />
                    {c.firstName}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-line bg-surface/40 px-6 py-4">
          {event.requiresPermission && !hasPermission ? (
            <button
              type="button"
              onClick={onGrantPermission}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-primary px-4 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md"
            >
              <FileCheck2 className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              Grant permission
            </button>
          ) : event.requiresPermission ? (
            <span className="inline-flex items-center gap-2 text-small font-semibold text-success">
              <FileCheck2 className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              Permission granted
            </span>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onRsvp('yes')}
                className={[
                  'inline-flex h-10 items-center gap-2 rounded-full border px-4 text-small font-semibold transition-colors',
                  rsvp === 'yes'
                    ? 'border-success/30 bg-success/5 text-success'
                    : 'border-line bg-card text-ink hover:bg-surface',
                ].join(' ')}
              >
                <CalendarCheck className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                {rsvp === 'yes' ? 'Going' : 'RSVP yes'}
              </button>
              <button
                type="button"
                onClick={() => onRsvp('no')}
                className={[
                  'inline-flex h-10 items-center rounded-full border px-4 text-small font-semibold transition-colors',
                  rsvp === 'no'
                    ? 'border-line bg-surface text-ink'
                    : 'border-line bg-card text-muted hover:bg-surface hover:text-ink',
                ].join(' ')}
              >
                Can&rsquo;t make it
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-small text-muted transition-colors hover:text-ink"
          >
            <Clock className="mr-1 inline-block h-3 w-3" strokeWidth={1.75} aria-hidden />
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function KpiTile({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: 'brand' | 'success' | 'warning';
}) {
  const valueColor =
    tone === 'warning' ? 'text-warning' : tone === 'success' ? 'text-success' : tone === 'brand' ? 'text-brand-primary' : 'text-ink';
  return (
    <li className="rounded-lg border border-line bg-card p-5 shadow-card-sm">
      <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className={`mt-2 text-h2 tabular-nums ${valueColor}`}>{value}</p>
      {sub ? <p className="mt-1 text-micro text-muted">{sub}</p> : null}
    </li>
  );
}

interface Cell {
  day: number;
  inMonth: boolean;
  isToday: boolean;
  events: ParentEvent[];
}

function buildMonthGrid(cursor: Date, events: readonly ParentEvent[]): Cell[] {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const startOffset = (first.getDay() + 6) % 7; // Monday-start
  const start = new Date(first);
  start.setDate(first.getDate() - startOffset);
  const cells: Cell[] = [];
  const today = new Date('2026-04-22');
  for (let i = 0; i < 42; i += 1) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    cells.push({
      day: d.getDate(),
      inMonth: d.getMonth() === cursor.getMonth(),
      isToday: d.toDateString() === today.toDateString(),
      events: events.filter((e) => e.date === iso),
    });
  }
  return cells;
}
