'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, Download, FilePlus, SendHorizontal } from 'lucide-react';

import { EditorialCard, SectionEyebrow } from '@/components/student/primitives';
import { HeatmapCell, ParentPageHeader, ParentStatusPill } from '@/components/parent/primitives';
import { useSelectedChild } from '@/components/parent/selected-child-context';
import { buildAttendance, RECENT_ABSENCES, type AttendanceEntry } from '@/lib/mock/parent-extras';

/**
 * Parent attendance — §07.
 *
 *   - Summary band: attendance %, absences, late arrivals, excused
 *   - Term calendar heatmap (7-col week grid)
 *   - Absence history list with explain-absence inline action
 *   - "Notify school of a planned absence" CTA
 */
export default function ParentAttendancePage() {
  const { selectedChild } = useSelectedChild();
  const days = useMemo(() => buildAttendance(selectedChild.id), [selectedChild.id]);

  const stats = useMemo(() => {
    const present = days.filter((d) => d.kind === 'present').length;
    const absentUnexcused = days.filter((d) => d.kind === 'absent-unexcused').length;
    const absentExcused = days.filter((d) => d.kind === 'absent-excused').length;
    const late = days.filter((d) => d.kind === 'late').length;
    const school = days.filter((d) =>
      ['present', 'absent-unexcused', 'absent-excused', 'late'].includes(d.kind),
    ).length;
    const pct = Math.round(((present + late) / Math.max(1, school)) * 100);
    return { pct, absentUnexcused, absentExcused, late };
  }, [days]);

  const absences = RECENT_ABSENCES.filter((e) => e.childId === selectedChild.id);

  // Group days into weeks for the heatmap.
  const weeks: typeof days[] = [];
  let currentWeek: typeof days = [];
  for (const d of days) {
    const dow = new Date(d.date).getDay();
    if (dow === 1 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(d);
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const [explainingId, setExplainingId] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <ParentPageHeader
        eyebrow={`${selectedChild.firstName} ${selectedChild.lastName} · ${selectedChild.form}`}
        title="Attendance,"
        accent="Term 2 2026."
        right={
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-earth hover:bg-sand-light"
          >
            <FilePlus className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            Notify a planned absence
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Attendance" value={`${stats.pct}%`} tone={stats.pct >= 95 ? 'ok' : stats.pct >= 90 ? 'neutral' : 'warn'} />
        <Stat label="Absences" value={stats.absentUnexcused + stats.absentExcused} tone="neutral" />
        <Stat label="Late arrivals" value={stats.late} tone="neutral" />
        <Stat label="Excused" value={stats.absentExcused} tone="neutral" />
      </div>

      {/* Heatmap */}
      <EditorialCard className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-sand px-6 py-4">
          <div>
            <SectionEyebrow>Term calendar</SectionEyebrow>
            <p className="mt-1 font-sans text-[13px] text-stone">
              Hover a day for the reason. Days ahead are not yet recorded.
            </p>
          </div>
          <Legend />
        </div>
        <div className="overflow-x-auto p-6">
          <div className="flex gap-1.5">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1.5">
                {week.map((d) => {
                  const label = new Date(d.date).toLocaleDateString('en-ZW', {
                    day: 'numeric',
                    month: 'short',
                  });
                  const title =
                    d.kind === 'present'
                      ? `${label} · present`
                      : d.kind === 'absent-unexcused'
                      ? `${label} · absent · ${d.note ?? 'no reason provided'}`
                      : d.kind === 'absent-excused'
                      ? `${label} · excused · ${d.note ?? ''}`
                      : d.kind === 'late'
                      ? `${label} · late · ${d.note ?? ''}`
                      : d.kind === 'holiday'
                      ? `${label} · public holiday`
                      : d.kind === 'weekend'
                      ? `${label} · weekend`
                      : `${label} · not yet recorded`;
                  return <HeatmapCell key={d.date} kind={d.kind} title={title} />;
                })}
              </div>
            ))}
          </div>
        </div>
      </EditorialCard>

      {/* Absence list */}
      <EditorialCard className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-sand px-6 py-4">
          <SectionEyebrow>Absences &amp; lateness</SectionEyebrow>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
          >
            <Download className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
            Export
          </button>
        </div>
        {absences.length === 0 ? (
          <p className="px-6 py-10 text-center font-serif text-[15px] text-stone">
            No absences or late arrivals recorded this term. Excellent.
          </p>
        ) : (
          <ul className="divide-y divide-sand-light">
            {absences.map((a) => (
              <li key={a.id}>
                <AbsenceRow
                  entry={a}
                  explaining={explainingId === a.id}
                  onExplain={() => setExplainingId(a.id)}
                  onCancel={() => setExplainingId(null)}
                  onSubmit={() => setExplainingId(null)}
                />
              </li>
            ))}
          </ul>
        )}
      </EditorialCard>

      {/* Info */}
      <div className="rounded border border-sand bg-sand-light/60 px-5 py-4">
        <p className="flex items-start gap-3 font-sans text-[13px] text-stone">
          <AlertTriangle
            className="mt-0.5 h-4 w-4 flex-none text-earth"
            strokeWidth={1.5}
            aria-hidden
          />
          <span>
            If {selectedChild.firstName} is marked absent without an excuse, you&rsquo;ll receive an
            SMS + in-app notification within 10 minutes. You can reply with a reason by SMS or
            provide one here.
          </span>
        </p>
      </div>
    </div>
  );
}

function AbsenceRow({
  entry,
  explaining,
  onExplain,
  onCancel,
  onSubmit,
}: {
  entry: AttendanceEntry;
  explaining: boolean;
  onExplain: () => void;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  const [reason, setReason] = useState('');
  const [category, setCategory] = useState('medical');

  const date = new Date(entry.date).toLocaleDateString('en-ZW', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  return (
    <div className="px-6 py-4">
      <div className="flex items-start gap-4">
        <div className="w-24 flex-none">
          <p className="font-sans text-[12px] text-stone">{date}</p>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-sans text-[14px] font-medium text-ink">
            {entry.type === 'absent-full-day'
              ? 'Absent — full day'
              : entry.type === 'absent-periods'
              ? 'Absent — specific periods'
              : 'Late arrival'}
          </p>
          <p className="mt-0.5 font-sans text-[12px] text-stone">{entry.periodsMissed}</p>
          {entry.reason ? (
            <p className="mt-2 font-serif text-[14px] italic text-ink">
              &ldquo;{entry.reason}&rdquo;
            </p>
          ) : null}
          {entry.document ? (
            <p className="mt-1 font-sans text-[12px] text-terracotta">📎 {entry.document}</p>
          ) : null}
        </div>
        <div className="flex flex-col items-end gap-2">
          <ParentStatusPill
            state={
              entry.status === 'excused'
                ? 'acknowledged'
                : entry.status === 'under-review'
                ? 'pending-verification'
                : 'action-required'
            }
          >
            {entry.status === 'under-review' ? 'under review' : entry.status}
          </ParentStatusPill>
          {entry.status === 'unexcused' && !explaining ? (
            <button
              type="button"
              onClick={onExplain}
              className="inline-flex h-8 items-center rounded bg-terracotta px-3 font-sans text-[12px] font-semibold text-cream hover:bg-terracotta-hover"
            >
              Explain
            </button>
          ) : null}
        </div>
      </div>

      {explaining ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="mt-4 rounded border border-sand bg-sand-light/60 p-4"
        >
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-earth">
            Provide a reason
          </p>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 h-10 w-full rounded border border-sand bg-white px-3 font-sans text-[14px] text-ink focus:border-terracotta focus:outline-none"
              >
                <option value="medical">Medical</option>
                <option value="family">Family emergency</option>
                <option value="religious">Religious observance</option>
                <option value="transport">Transport</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                Optional note to the form teacher
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Optional — a short note helps the form teacher understand context."
                className="mt-1 w-full rounded border border-sand bg-white p-3 font-serif text-[14px] text-ink placeholder-stone focus:border-terracotta focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 font-sans text-[13px] font-medium text-stone hover:text-earth"
            >
              📎 Attach a doctor&rsquo;s note
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex h-9 items-center rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
              >
                Cancel
              </button>
              <button type="submit" className="btn-terracotta">
                <SendHorizontal className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                Submit reason
              </button>
            </div>
          </div>
        </form>
      ) : null}
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | string;
  tone: 'ok' | 'warn' | 'neutral';
}) {
  const colour = tone === 'ok' ? 'text-ok' : tone === 'warn' ? 'text-warn' : 'text-ink';
  return (
    <EditorialCard className="px-5 py-4">
      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
        {label}
      </p>
      <p className={`mt-1 font-display text-[28px] leading-none tabular-nums ${colour}`}>{value}</p>
    </EditorialCard>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-3 font-sans text-[11px] text-stone">
      <span className="inline-flex items-center gap-1.5">
        <HeatmapCell kind="present" title="" /> Present
      </span>
      <span className="inline-flex items-center gap-1.5">
        <HeatmapCell kind="late" title="" /> Late
      </span>
      <span className="inline-flex items-center gap-1.5">
        <HeatmapCell kind="absent-excused" title="" /> Excused
      </span>
      <span className="inline-flex items-center gap-1.5">
        <HeatmapCell kind="absent-unexcused" title="" /> Absent
      </span>
      <span className="inline-flex items-center gap-1.5">
        <HeatmapCell kind="weekend" title="" /> Weekend
      </span>
    </div>
  );
}
