'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarCheck, Check, CheckCircle2, Clock, Info, MapPin, Video, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { EditorialAvatar } from '@/components/student/primitives';
import { ChildColourDot } from '@/components/parent/primitives';
import { useSelectedChild } from '@/components/parent/selected-child-context';
import { MEETING_SLOTS, MEETING_TEACHERS, slotState } from '@/lib/mock/parent-extras';

interface Booking {
  teacherIdx: number;
  slotIdx: number;
  mode: 'video' | 'in-person';
  note: string;
  confirmedAt: string;
}

/**
 * Parent meetings — card-dense redesign.
 *
 *   - KPI tile row (Windows open / Your bookings / Teachers / Mode)
 *   - Open windows list
 *   - Teacher × slot grid picker in a card
 *   - Confirm card with note field
 *   - Confirmed bookings as success chips
 */
export default function ParentMeetingsPage() {
  const { selectedChild } = useSelectedChild();
  const [selection, setSelection] = useState<{ teacherIdx: number; slotIdx: number } | null>({
    teacherIdx: 0,
    slotIdx: 1,
  });
  const [mode, setMode] = useState<'in-person' | 'video'>('video');
  const [note, setNote] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const selectedSlotLabel = useMemo(() => {
    if (!selection) return null;
    const t = MEETING_TEACHERS[selection.teacherIdx];
    const s = MEETING_SLOTS[selection.slotIdx];
    if (!t || !s) return null;
    return `${t.name} · ${s}`;
  }, [selection]);

  function isBooked(teacherIdx: number, slotIdx: number) {
    return bookings.some((b) => b.teacherIdx === teacherIdx && b.slotIdx === slotIdx);
  }

  function confirm() {
    if (!selection) return;
    setBookings((curr) => [
      ...curr.filter((b) => b.teacherIdx !== selection.teacherIdx),
      {
        teacherIdx: selection.teacherIdx,
        slotIdx: selection.slotIdx,
        mode,
        note: note.trim(),
        confirmedAt: new Date().toLocaleString('en-ZW', {
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);
    const teacher = MEETING_TEACHERS[selection.teacherIdx];
    const slot = MEETING_SLOTS[selection.slotIdx];
    setToast(`Booked · ${teacher?.name} · ${slot}`);
    setSelection(null);
    setNote('');
  }

  function cancelBooking(teacherIdx: number) {
    const teacher = MEETING_TEACHERS[teacherIdx];
    setBookings((curr) => curr.filter((b) => b.teacherIdx !== teacherIdx));
    setToast(`Cancelled ${teacher?.name} meeting`);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-small text-muted">
            {selectedChild.firstName} {selectedChild.lastName}
          </p>
          <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-ink">
            Parent-teacher meetings, on your schedule
          </h1>
          <p className="mt-2 text-small text-muted">
            10-minute slots per teacher — video-joining for parents abroad.
          </p>
        </div>
      </header>

      {/* KPI tiles */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiTile label="Open windows" value="2" sub="Book before 28 April" tone="brand" />
        <KpiTile
          label="Your bookings"
          value={String(bookings.length)}
          sub={bookings.length === 0 ? 'None yet' : 'Confirmed'}
          tone={bookings.length > 0 ? 'success' : undefined}
        />
        <KpiTile label="Teachers available" value={String(MEETING_TEACHERS.length)} sub="Form + subjects" />
        <KpiTile
          label="Default mode"
          value={mode === 'video' ? 'Video' : 'In person'}
          sub={mode === 'video' ? 'Joins in-portal' : 'Main hall'}
        />
      </ul>

      {/* Available booking windows */}
      <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
        <header className="border-b border-line px-5 py-3.5">
          <h2 className="text-small font-semibold text-ink">Open booking windows</h2>
          <p className="text-micro text-muted">Term-wide parent-teacher events</p>
        </header>
        <ul className="divide-y divide-line">
          <li className="flex flex-wrap items-center gap-4 px-5 py-4">
            <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-md bg-brand-primary/10 text-brand-primary">
              <CalendarCheck className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-small font-semibold text-ink">Term 2 Parent-Teacher Meeting</p>
              <p className="text-micro text-muted">
                Tuesday 29 April · 17:00–18:30 · Main hall or online
              </p>
            </div>
            <Badge tone="warning" dot>
              Book by 28 April
            </Badge>
          </li>
          <li className="flex flex-wrap items-center gap-4 px-5 py-4">
            <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-md bg-success/10 text-success">
              <CalendarCheck className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-small font-semibold text-ink">Form 4A form-teacher review</p>
              <p className="text-micro text-muted">
                Mid-term · Thursday 15 May · 15 minutes each
              </p>
            </div>
            <Badge tone="success" dot>
              Booked 15:30
            </Badge>
          </li>
        </ul>
      </section>

      {/* Slot picker */}
      <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <div>
            <h2 className="text-small font-semibold text-ink">
              Term 2 Parent-Teacher Meeting · Tuesday 29 April
            </h2>
            <p className="mt-1 flex items-center gap-2 text-micro text-muted">
              <ChildColourDot tone={selectedChild.colourTone} />
              Pick a 10-minute slot with each of {selectedChild.firstName}&rsquo;s teachers
            </p>
          </div>
          <div
            role="radiogroup"
            aria-label="Meeting mode"
            className="inline-flex overflow-hidden rounded-full border border-line bg-card"
          >
            <ModeButton active={mode === 'video'} onClick={() => setMode('video')} label="Video" icon={Video} />
            <ModeButton active={mode === 'in-person'} onClick={() => setMode('in-person')} label="In person" icon={MapPin} />
          </div>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full text-small">
            <thead>
              <tr className="bg-surface/60 text-left">
                <th className="sticky left-0 bg-surface px-5 py-3 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  Teacher
                </th>
                {MEETING_SLOTS.map((s) => (
                  <th
                    key={s}
                    className={[
                      'px-2 py-3 text-center',
                      s === 'Break'
                        ? 'text-micro italic text-muted'
                        : 'text-micro font-semibold uppercase tracking-[0.1em] text-muted',
                    ].join(' ')}
                  >
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MEETING_TEACHERS.map((t, tIdx) => (
                <tr key={t.id} className="border-t border-line">
                  <td className="sticky left-0 bg-card px-5 py-3">
                    <div className="flex items-center gap-3">
                      <EditorialAvatar name={t.name} size="sm" />
                      <div>
                        <p className="text-small font-semibold text-ink">{t.name}</p>
                        <p className="text-micro text-muted">{t.subject}</p>
                      </div>
                    </div>
                  </td>
                  {MEETING_SLOTS.map((s, sIdx) => {
                    const state = slotState(tIdx, sIdx);
                    const isBookedByMe = isBooked(tIdx, sIdx);
                    const isSelected =
                      selection?.teacherIdx === tIdx && selection?.slotIdx === sIdx;
                    const effective = isBookedByMe
                      ? 'booked-mine'
                      : isSelected
                      ? 'selecting'
                      : state;
                    const classes = {
                      available:
                        'bg-surface/50 hover:bg-success/10 hover:border-success/40 cursor-pointer',
                      selecting:
                        'bg-brand-primary/10 border-brand-primary text-brand-primary cursor-pointer',
                      'booked-mine': 'bg-success text-white border-success cursor-pointer',
                      'booked-other': 'bg-surface cursor-not-allowed opacity-60',
                      break: 'bg-surface/40 cursor-not-allowed',
                    }[effective];
                    return (
                      <td key={s} className="px-1 py-1.5">
                        <button
                          type="button"
                          disabled={state === 'booked-other' || state === 'break'}
                          onClick={() => {
                            if (state === 'break' || state === 'booked-other') return;
                            if (isBookedByMe) {
                              cancelBooking(tIdx);
                              return;
                            }
                            setSelection(
                              selection?.teacherIdx === tIdx && selection?.slotIdx === sIdx
                                ? null
                                : { teacherIdx: tIdx, slotIdx: sIdx },
                            );
                          }}
                          className={[
                            'h-9 w-full rounded-md border border-line font-semibold text-micro transition-colors',
                            classes,
                          ].join(' ')}
                          aria-label={`${t.name} · ${s} · ${effective}`}
                        >
                          {state === 'break'
                            ? '—'
                            : isBookedByMe
                            ? '✓'
                            : isSelected
                            ? '…'
                            : state === 'booked-other'
                            ? '—'
                            : ''}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Selection confirm */}
      <section className="rounded-lg border border-line bg-card p-6 shadow-card-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
              {selection ? 'Your selection' : bookings.length > 0 ? 'Your bookings' : 'Pick a slot'}
            </p>
            {selection ? (
              <>
                <p className="mt-1 text-h2 text-ink">{selectedSlotLabel}</p>
                <p className="mt-1 flex items-center gap-2 text-small text-muted">
                  <Clock className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                  10 minutes · {mode === 'video' ? 'joins in-portal' : 'Main hall'}
                </p>
              </>
            ) : bookings.length > 0 ? (
              <p className="mt-2 text-small text-muted">
                {bookings.length} confirmed · tap a cell above to add or change
              </p>
            ) : (
              <p className="mt-2 text-small text-muted">Pick a slot above to book.</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!selection}
              onClick={() => {
                setSelection(null);
                setNote('');
              }}
              className="inline-flex h-10 items-center rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface disabled:opacity-40"
            >
              Clear selection
            </button>
            <button
              type="button"
              disabled={!selection}
              onClick={confirm}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-primary px-5 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md disabled:opacity-40"
            >
              <CalendarCheck className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              Confirm booking
            </button>
          </div>
        </div>

        {selection ? (
          <div className="mt-5">
            <label className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
              What would you like to discuss? (optional)
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="A short note helps the teacher prepare."
              className="mt-2 w-full rounded-md border border-line bg-card p-3 text-small text-ink placeholder:text-muted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>
        ) : null}

        {bookings.length > 0 ? (
          <ul className="mt-5 space-y-2 border-t border-line pt-5">
            {bookings.map((b) => {
              const teacher = MEETING_TEACHERS[b.teacherIdx];
              const slot = MEETING_SLOTS[b.slotIdx];
              if (!teacher || !slot) return null;
              return (
                <li
                  key={`${b.teacherIdx}-${b.slotIdx}`}
                  className="flex flex-wrap items-center gap-3 rounded-md border border-success/30 bg-success/5 px-4 py-3"
                >
                  <CheckCircle2 className="h-5 w-5 flex-none text-success" strokeWidth={1.75} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="text-small font-semibold text-ink">
                      {teacher.name} · {slot}
                    </p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-2 text-micro text-muted">
                      {teacher.subject} · {b.mode === 'video' ? 'Video (in-portal)' : 'Main hall'} ·
                      confirmed {b.confirmedAt}
                      {b.note ? <span className="italic text-brand-primary">· &ldquo;{b.note}&rdquo;</span> : null}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => cancelBooking(b.teacherIdx)}
                    className="inline-flex h-8 items-center gap-1 rounded-full border border-line bg-card px-3 text-micro font-semibold text-muted transition-colors hover:bg-surface hover:text-ink"
                  >
                    <X className="h-3 w-3" strokeWidth={1.75} aria-hidden />
                    Cancel
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </section>

      <div className="rounded-lg border border-info/25 bg-info/[0.04] px-5 py-4">
        <p className="flex items-start gap-3 text-small text-ink">
          <Info className="mt-0.5 h-4 w-4 flex-none text-info" strokeWidth={1.75} aria-hidden />
          <span>
            Video meetings open directly in the portal. 24-hour and 15-minute reminders are sent
            automatically. Recordings are not available for parent-teacher meetings.
          </span>
        </p>
      </div>

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

function ModeButton({
  active,
  onClick,
  label,
  icon: Icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: typeof Video;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={[
        'inline-flex h-10 items-center gap-2 px-4 text-small font-semibold transition-colors',
        active ? 'bg-brand-primary text-white' : 'text-muted hover:bg-surface hover:text-ink',
      ].join(' ')}
    >
      <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
      {label}
    </button>
  );
}
