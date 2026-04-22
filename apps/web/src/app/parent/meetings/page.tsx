'use client';

import { useMemo, useState } from 'react';
import { CalendarCheck, Clock, Info, MapPin, Video } from 'lucide-react';

import { EditorialAvatar, EditorialCard, SectionEyebrow } from '@/components/student/primitives';
import { ChildColourDot, ParentPageHeader, ParentStatusPill } from '@/components/parent/primitives';
import { useSelectedChild } from '@/components/parent/selected-child-context';
import { MEETING_SLOTS, MEETING_TEACHERS, slotState } from '@/lib/mock/parent-extras';

/**
 * Parent meetings — §12.
 *
 *   - List of available booking windows
 *   - Teacher × slot grid picker (sage = available, terracotta = yours,
 *     grey = booked by another parent, break = break)
 *   - In-person / video toggle per booking
 *   - Optional "what would you like to discuss" note
 */
export default function ParentMeetingsPage() {
  const { selectedChild } = useSelectedChild();
  const [selection, setSelection] = useState<{ teacherIdx: number; slotIdx: number } | null>({
    teacherIdx: 0,
    slotIdx: 1,
  });
  const [mode, setMode] = useState<'in-person' | 'video'>('video');
  const [note, setNote] = useState('');

  const selectedSlotLabel = useMemo(() => {
    if (!selection) return null;
    const t = MEETING_TEACHERS[selection.teacherIdx];
    const s = MEETING_SLOTS[selection.slotIdx];
    if (!t || !s) return null;
    return `${t.name} · ${s}`;
  }, [selection]);

  return (
    <div className="space-y-8">
      <ParentPageHeader
        eyebrow={`${selectedChild.firstName} ${selectedChild.lastName}`}
        title="Parent-teacher meetings,"
        accent="booked on your schedule."
        subtitle="10-minute slots per teacher. Video-joining for parents abroad."
      />

      {/* Available booking windows */}
      <EditorialCard className="overflow-hidden">
        <div className="border-b border-sand px-6 py-4">
          <SectionEyebrow>Open booking windows</SectionEyebrow>
        </div>
        <ul className="divide-y divide-sand-light">
          <li className="flex flex-wrap items-center gap-4 px-6 py-4">
            <CalendarCheck className="h-5 w-5 flex-none text-earth" strokeWidth={1.5} aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="font-display text-[18px] text-ink">Term 2 Parent-Teacher Meeting</p>
              <p className="font-sans text-[12px] text-stone">
                Tuesday 29 April · 17:00–18:30 · Main hall or online
              </p>
            </div>
            <ParentStatusPill state="action-required">Book by 28 April</ParentStatusPill>
          </li>
          <li className="flex flex-wrap items-center gap-4 px-6 py-4">
            <CalendarCheck className="h-5 w-5 flex-none text-earth" strokeWidth={1.5} aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="font-display text-[18px] text-ink">Form 4A form-teacher review</p>
              <p className="font-sans text-[12px] text-stone">
                Mid-term · Thursday 15 May · 15 minutes each
              </p>
            </div>
            <ParentStatusPill state="booked">You&rsquo;ve booked 15:30</ParentStatusPill>
          </li>
        </ul>
      </EditorialCard>

      {/* Slot picker */}
      <EditorialCard className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand px-6 py-4">
          <div>
            <SectionEyebrow>Term 2 Parent-Teacher Meeting · Tuesday 29 April</SectionEyebrow>
            <p className="mt-1 flex items-center gap-2 font-sans text-[13px] text-stone">
              <ChildColourDot tone={selectedChild.colourTone} />
              Pick a 10-minute slot with each of {selectedChild.firstName}&rsquo;s teachers
            </p>
          </div>
          <div role="radiogroup" aria-label="Meeting mode" className="inline-flex overflow-hidden rounded border border-sand bg-white">
            <ModeButton active={mode === 'video'} onClick={() => setMode('video')} label="Video" icon={Video} />
            <ModeButton active={mode === 'in-person'} onClick={() => setMode('in-person')} label="In person" icon={MapPin} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-sand-light/40 text-left">
                <th className="sticky left-0 bg-sand-light/80 px-5 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Teacher
                </th>
                {MEETING_SLOTS.map((s) => (
                  <th
                    key={s}
                    className={[
                      'px-2 py-3 text-center font-sans',
                      s === 'Break'
                        ? 'text-[10px] italic text-stone'
                        : 'text-[10px] font-semibold uppercase tracking-[0.14em] text-stone',
                    ].join(' ')}
                  >
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MEETING_TEACHERS.map((t, tIdx) => (
                <tr key={t.id} className="border-t border-sand-light">
                  <td className="sticky left-0 bg-white px-5 py-3">
                    <div className="flex items-center gap-3">
                      <EditorialAvatar name={t.name} size="sm" />
                      <div>
                        <p className="font-sans text-[13px] font-medium text-ink">{t.name}</p>
                        <p className="font-sans text-[11px] text-stone">{t.subject}</p>
                      </div>
                    </div>
                  </td>
                  {MEETING_SLOTS.map((s, sIdx) => {
                    const state = slotState(tIdx, sIdx);
                    const isSelected =
                      selection?.teacherIdx === tIdx && selection?.slotIdx === sIdx;
                    const effective = isSelected ? 'booked-mine' : state;
                    const classes = {
                      'available': 'bg-sand-light/50 hover:bg-[#E6F0E9] hover:border-ok cursor-pointer',
                      'booked-mine': 'bg-terracotta text-cream cursor-pointer',
                      'booked-other': 'bg-sand cursor-not-allowed',
                      'break': 'bg-cream/60 cursor-not-allowed',
                    }[effective];
                    return (
                      <td key={s} className="px-1 py-1.5">
                        <button
                          type="button"
                          disabled={state === 'booked-other' || state === 'break'}
                          onClick={() => {
                            if (state === 'available' || state === 'booked-mine') {
                              setSelection(
                                selection?.teacherIdx === tIdx && selection?.slotIdx === sIdx
                                  ? null
                                  : { teacherIdx: tIdx, slotIdx: sIdx },
                              );
                            }
                          }}
                          className={[
                            'h-8 w-full rounded border border-sand font-sans text-[11px] font-semibold transition-colors',
                            classes,
                          ].join(' ')}
                          aria-label={`${t.name} · ${s} · ${effective}`}
                        >
                          {state === 'break'
                            ? '—'
                            : effective === 'booked-mine'
                            ? '✓'
                            : effective === 'booked-other'
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
      </EditorialCard>

      {/* Selection confirm */}
      <EditorialCard className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <SectionEyebrow>Your selection</SectionEyebrow>
            {selection ? (
              <>
                <p className="mt-2 font-display text-[22px] text-ink">{selectedSlotLabel}</p>
                <p className="mt-1 flex items-center gap-2 font-sans text-[13px] text-stone">
                  <Clock className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                  10 minutes · {mode === 'video' ? 'joins in-portal' : 'Main hall'}
                </p>
              </>
            ) : (
              <p className="mt-2 font-serif text-[15px] text-stone">
                Pick a slot above to book.
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!selection}
              className="inline-flex h-10 items-center rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-earth hover:bg-sand-light disabled:opacity-40"
            >
              Cancel
            </button>
            <button type="button" disabled={!selection} className="btn-terracotta disabled:opacity-40">
              <CalendarCheck className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              Confirm booking
            </button>
          </div>
        </div>

        {selection ? (
          <div className="mt-5">
            <label className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
              What would you like to discuss? (optional)
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="A short note helps the teacher prepare."
              className="mt-2 w-full rounded border border-sand bg-white p-3 font-serif text-[14px] text-ink placeholder-stone focus:border-terracotta focus:outline-none"
            />
          </div>
        ) : null}
      </EditorialCard>

      <div className="rounded border border-sand bg-sand-light/60 px-5 py-4">
        <p className="flex items-start gap-3 font-sans text-[13px] text-stone">
          <Info className="mt-0.5 h-4 w-4 flex-none text-earth" strokeWidth={1.5} aria-hidden />
          <span>
            Video meetings open directly in the portal. 24-hour and 15-minute reminders are sent
            automatically. Recordings are not available for parent-teacher meetings.
          </span>
        </p>
      </div>
    </div>
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
        'inline-flex h-10 items-center gap-2 px-4 font-sans text-[13px] font-medium transition-colors',
        active ? 'bg-ink text-cream' : 'text-stone hover:bg-sand-light',
      ].join(' ')}
    >
      <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
      {label}
    </button>
  );
}
