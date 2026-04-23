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

import { EditorialCard, SectionEyebrow } from '@/components/student/primitives';
import { ChildColourDot, ParentPageHeader, ParentStatusPill } from '@/components/parent/primitives';
import {
  PARENT_CHILDREN,
  PARENT_EVENTS,
  type ParentCalendarKind,
  type ParentEvent,
} from '@/lib/mock/parent-extras';

/**
 * Parent calendar — §10.
 *
 *   - Month grid on desktop, list below on mobile
 *   - Events coloured by kind; colour-coded by child when affecting only one
 *   - Upcoming events strip below the grid
 *   - RSVP + permission-slip status per event
 */
const KIND_COLOUR: Record<ParentCalendarKind, { dot: string; label: string }> = {
  academic: { dot: 'bg-earth', label: 'Academic' },
  sports: { dot: 'bg-ok', label: 'Sports' },
  cultural: { dot: 'bg-ochre', label: 'Cultural' },
  'parent-only': { dot: 'bg-terracotta', label: 'Parent-only' },
  holiday: { dot: 'bg-stone', label: 'Holiday' },
  trip: { dot: 'bg-terracotta', label: 'Trip' },
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

  function toggleChild(id: string) {
    setActiveChildIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  return (
    <div className="space-y-6">
      <ParentPageHeader
        eyebrow="Calendar"
        title="What&rsquo;s coming up,"
        accent="for your family."
        subtitle="All events across all children, colour-coded by kind."
        right={
          <button
            type="button"
            onClick={exportIcs}
            className="inline-flex h-10 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-earth hover:bg-sand-light"
          >
            <Download className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            Export ICS
          </button>
        }
      />

      {/* Child filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-sans text-[12px] text-stone">Show events for:</span>
        {PARENT_CHILDREN.map((c) => {
          const active = activeChildIds.includes(c.id);
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => toggleChild(c.id)}
              aria-pressed={active}
              className={[
                'inline-flex h-8 items-center gap-2 rounded-full border px-3 font-sans text-[12px] font-medium transition-colors',
                active
                  ? 'border-sand bg-white text-ink'
                  : 'border-sand bg-cream text-stone line-through',
              ].join(' ')}
            >
              <ChildColourDot tone={c.colourTone} />
              {c.firstName}
            </button>
          );
        })}
        <span className="ml-auto flex flex-wrap items-center gap-3 font-sans text-[11px] text-stone">
          {(Object.keys(KIND_COLOUR) as ParentCalendarKind[]).map((k) => (
            <span key={k} className="inline-flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${KIND_COLOUR[k].dot}`} aria-hidden />
              {KIND_COLOUR[k].label}
            </span>
          ))}
        </span>
      </div>

      {/* Month header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-[22px] text-ink">
          {cursor.toLocaleDateString('en-ZW', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() =>
              setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
            }
            className="flex h-9 w-9 items-center justify-center rounded border border-sand bg-white text-stone hover:bg-sand-light"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => setCursor(new Date('2026-05-01'))}
            className="inline-flex h-9 items-center rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() =>
              setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
            }
            className="flex h-9 w-9 items-center justify-center rounded border border-sand bg-white text-stone hover:bg-sand-light"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Month grid */}
      <EditorialCard className="overflow-hidden">
        <div className="grid grid-cols-7 border-b border-sand bg-sand-light/30 text-center">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
            <div
              key={d}
              className="py-2 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 text-[12px]">
          {monthGrid.map((cell, i) => (
            <div
              key={i}
              className={[
                'min-h-[84px] border-b border-r border-sand-light p-1.5',
                cell.inMonth ? 'bg-white' : 'bg-cream/60',
                cell.isToday ? 'bg-sand-light/40' : '',
              ].join(' ')}
            >
              <p
                className={[
                  'font-sans text-[11px] tabular-nums',
                  cell.inMonth ? 'text-ink' : 'text-stone/60',
                  cell.isToday ? 'font-semibold text-terracotta' : '',
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
                      className="flex w-full items-center gap-1 truncate rounded-sm bg-sand-light/60 px-1 py-0.5 text-left hover:bg-sand"
                      title={`${e.title} · ${e.time ?? ''}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 flex-none rounded-full ${KIND_COLOUR[e.kind].dot}`}
                        aria-hidden
                      />
                      <span className="truncate font-sans text-[10px] text-ink">{e.title}</span>
                    </button>
                  </li>
                ))}
                {cell.events.length > 3 ? (
                  <li className="font-sans text-[10px] text-stone">+ {cell.events.length - 3} more</li>
                ) : null}
              </ul>
            </div>
          ))}
        </div>
      </EditorialCard>

      {/* Upcoming */}
      <EditorialCard className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-sand px-6 py-4">
          <SectionEyebrow>Upcoming</SectionEyebrow>
          <span className="font-sans text-[12px] text-stone">
            {upcoming.length} events in the next 14 days
          </span>
        </div>
        <ul className="divide-y divide-sand-light">
          {upcoming.map((e) => {
            const r = effectiveRsvp(e);
            const perm = hasPermission(e);
            return (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => setPreview(e)}
                  className="flex w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-sand-light/40"
                >
                  <div className="w-14 flex-none text-center">
                    <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-stone">
                      {new Date(e.date).toLocaleDateString('en-ZW', { month: 'short' })}
                    </p>
                    <p className="font-display text-[20px] text-ink">
                      {new Date(e.date).getDate()}
                    </p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-earth">
                      <span className={`h-1.5 w-1.5 rounded-full ${KIND_COLOUR[e.kind].dot}`} aria-hidden />
                      {KIND_COLOUR[e.kind].label}
                    </p>
                    <p className="mt-1 font-display text-[17px] text-ink">{e.title}</p>
                    <p className="font-sans text-[12px] text-stone">
                      {e.time ? `${e.time} · ` : ''}
                      {e.location ?? 'Harare Heritage Academy'}
                    </p>
                    <div className="mt-1 flex items-center gap-1">
                      {e.affectedChildIds.map((id) => {
                        const c = PARENT_CHILDREN.find((x) => x.id === id);
                        if (!c) return null;
                        return (
                          <span
                            key={id}
                            title={`Affects ${c.firstName}`}
                            className="inline-flex items-center gap-1 rounded border border-sand bg-cream px-1.5 py-0.5 font-sans text-[10px] text-stone"
                          >
                            <ChildColourDot tone={c.colourTone} />
                            {c.firstName}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  {e.requiresPermission && !perm ? (
                    <ParentStatusPill state="action-required">Permission needed</ParentStatusPill>
                  ) : e.requiresPermission && perm ? (
                    <ParentStatusPill state="booked">Permission granted</ParentStatusPill>
                  ) : r === 'yes' ? (
                    <ParentStatusPill state="booked">RSVP&rsquo;d yes</ParentStatusPill>
                  ) : r === 'no' ? (
                    <ParentStatusPill state="acknowledged">Declined</ParentStatusPill>
                  ) : e.kind === 'parent-only' ? (
                    <ParentStatusPill state="action-required">RSVP needed</ParentStatusPill>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </EditorialCard>

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
          className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full bg-ink px-4 py-2 font-sans text-[12px] font-semibold text-cream shadow-e3"
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
        className="relative flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden rounded bg-white shadow-e3"
      >
        <div className="flex items-start justify-between gap-3 border-b border-sand px-6 py-4">
          <div>
            <p className="flex items-center gap-2 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-earth">
              <span className={`h-1.5 w-1.5 rounded-full ${KIND_COLOUR[event.kind].dot}`} aria-hidden />
              {KIND_COLOUR[event.kind].label}
            </p>
            <h2 className="mt-1 font-display text-[20px] text-ink">{event.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-2 text-stone transition-colors hover:bg-sand-light hover:text-ink"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
        <div className="space-y-3 px-6 py-5 font-sans text-[13px] text-stone">
          <p className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-earth" strokeWidth={1.5} aria-hidden />
            {new Date(event.date).toLocaleDateString('en-ZW', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
            {event.time ? <span>· {event.time}</span> : null}
          </p>
          {event.location ? (
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-earth" strokeWidth={1.5} aria-hidden />
              {event.location}
            </p>
          ) : null}
          {/* description field not on ParentEvent — omit */}
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
              Who this affects
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {event.affectedChildIds.map((id) => {
                const c = PARENT_CHILDREN.find((x) => x.id === id);
                if (!c) return null;
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 rounded border border-sand bg-cream px-1.5 py-0.5 font-sans text-[11px] text-stone"
                  >
                    <ChildColourDot tone={c.colourTone} />
                    {c.firstName}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-sand bg-sand-light/40 px-6 py-4">
          {event.requiresPermission && !hasPermission ? (
            <button
              type="button"
              onClick={onGrantPermission}
              className="btn-terracotta"
            >
              <FileCheck2 className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              Grant permission
            </button>
          ) : event.requiresPermission ? (
            <span className="inline-flex items-center gap-2 font-sans text-[13px] font-medium text-ok">
              <FileCheck2 className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              Permission granted
            </span>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onRsvp('yes')}
                className={[
                  'inline-flex h-10 items-center gap-2 rounded border px-3 font-sans text-[13px] font-medium transition-colors',
                  rsvp === 'yes'
                    ? 'border-ok bg-[#F0F6F2] text-ok'
                    : 'border-sand bg-white text-earth hover:bg-sand-light',
                ].join(' ')}
              >
                <CalendarCheck className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                {rsvp === 'yes' ? 'Going' : 'RSVP yes'}
              </button>
              <button
                type="button"
                onClick={() => onRsvp('no')}
                className={[
                  'inline-flex h-10 items-center rounded border px-3 font-sans text-[13px] font-medium transition-colors',
                  rsvp === 'no'
                    ? 'border-stone/50 bg-sand text-ink'
                    : 'border-sand bg-white text-stone hover:bg-sand-light hover:text-ink',
                ].join(' ')}
              >
                Can&rsquo;t make it
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            className="font-sans text-[13px] text-stone hover:text-ink"
          >
            <Clock className="mr-1 inline-block h-3 w-3" strokeWidth={1.5} aria-hidden />
            Close
          </button>
        </div>
      </div>
    </div>
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
