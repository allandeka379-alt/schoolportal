'use client';

import { useState } from 'react';
import { CheckCircle2, Clock, MinusCircle, Save, XCircle } from 'lucide-react';

import { EditorialAvatar, EditorialCard, SectionEyebrow } from '@/components/student/primitives';
import { ClassChip, TeacherPageHeader } from '@/components/teacher/primitives';
import { STUDENTS } from '@/lib/mock/fixtures';

type Status = 'present' | 'absent' | 'late' | 'excused';

interface Row {
  id: string;
  name: string;
  status: Status;
  reason?: string;
}

const INITIAL: Row[] = STUDENTS.filter((s) => s.form === 'Form 3' && s.stream === 'Blue').map(
  (s, i) => ({
    id: s.id,
    name: `${s.firstName} ${s.lastName}`,
    status: (['present', 'present', 'present', 'late', 'present', 'absent'] as const)[i % 6] ?? 'present',
  }),
);

/**
 * Attendance register — §11.
 *
 *   - 48px rows (48px+ tap target on mobile)
 *   - Default: every student Present (absences are the exception)
 *   - Four statuses: Present · Absent · Late · Excused
 *   - Excused status reveals an optional reason field
 *   - Auto-save on every change
 */
export default function AttendancePage() {
  const [rows, setRows] = useState<Row[]>(INITIAL);

  function setStatus(id: string, status: Status) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  const present = rows.filter((r) => r.status === 'present').length;
  const absent = rows.filter((r) => r.status === 'absent').length;
  const late = rows.filter((r) => r.status === 'late').length;
  const excused = rows.filter((r) => r.status === 'excused').length;

  return (
    <div className="space-y-6">
      <TeacherPageHeader
        eyebrow="Register"
        title="Form 4A · Mathematics,"
        accent="07:30."
        subtitle={new Date().toLocaleDateString('en-ZW', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
        right={
          <>
            <ClassChip form="4" stream="A" subjectTone="ochre" />
            <button type="button" className="btn-terracotta">
              <Save className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              Save register
            </button>
          </>
        }
      />

      {/* Stats strip */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Present" value={present} tone="ok" />
        <Stat label="Late" value={late} tone="warn" />
        <Stat label="Excused" value={excused} tone="neutral" />
        <Stat label="Absent" value={absent} tone="danger" />
      </div>

      {/* Register */}
      <EditorialCard className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-sand px-6 py-3">
          <SectionEyebrow>Roll call</SectionEyebrow>
          <p className="font-sans text-[12px] text-stone">
            Default is <strong className="text-ink">Present</strong> — override exceptions only. Saves
            automatically.
          </p>
        </div>
        <ul className="divide-y divide-sand-light">
          {rows.map((r) => (
            <li key={r.id} className="flex min-h-[48px] items-center gap-3 px-6 py-2.5">
              <EditorialAvatar name={r.name} size="sm" />
              <p className="flex-1 font-sans text-[14px] font-medium text-ink">{r.name}</p>
              <div className="flex overflow-hidden rounded border border-sand bg-white">
                <StatusButton
                  selected={r.status === 'present'}
                  tone="ok"
                  onClick={() => setStatus(r.id, 'present')}
                  icon={CheckCircle2}
                  label="Present"
                />
                <StatusButton
                  selected={r.status === 'late'}
                  tone="warn"
                  onClick={() => setStatus(r.id, 'late')}
                  icon={Clock}
                  label="Late"
                />
                <StatusButton
                  selected={r.status === 'excused'}
                  tone="info"
                  onClick={() => setStatus(r.id, 'excused')}
                  icon={MinusCircle}
                  label="Excused"
                />
                <StatusButton
                  selected={r.status === 'absent'}
                  tone="danger"
                  onClick={() => setStatus(r.id, 'absent')}
                  icon={XCircle}
                  label="Absent"
                />
              </div>
            </li>
          ))}
        </ul>
      </EditorialCard>

      <p className="rounded border border-sand bg-sand-light/40 px-4 py-3 font-sans text-[12px] text-stone">
        Parents of unexcused absences receive an SMS + in-app notification within 10 minutes of register
        submission. &ldquo;Late&rdquo; does not trigger an alert — repeat lateness triggers a
        weekly pattern notification to the form teacher.
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: 'ok' | 'warn' | 'neutral' | 'danger';
}) {
  const colour =
    tone === 'ok'
      ? 'text-ok'
      : tone === 'warn'
      ? 'text-ochre'
      : tone === 'danger'
      ? 'text-danger'
      : 'text-ink';
  return (
    <EditorialCard className="px-5 py-4">
      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
        {label}
      </p>
      <p className={`mt-1 font-display text-[28px] leading-none tabular-nums ${colour}`}>{value}</p>
    </EditorialCard>
  );
}

function StatusButton({
  selected,
  tone,
  onClick,
  icon: Icon,
  label,
}: {
  selected: boolean;
  tone: 'ok' | 'warn' | 'info' | 'danger';
  onClick: () => void;
  icon: typeof CheckCircle2;
  label: string;
}) {
  const toneClasses: Record<string, string> = {
    ok: 'bg-ok text-cream',
    warn: 'bg-ochre text-ink',
    info: 'bg-earth text-cream',
    danger: 'bg-danger text-cream',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={label}
      className={[
        'inline-flex h-9 items-center justify-center gap-1.5 px-3 font-sans text-[12px] font-semibold transition-colors',
        selected
          ? toneClasses[tone]
          : 'border-l border-sand text-stone first:border-l-0 hover:bg-sand-light',
      ].join(' ')}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
