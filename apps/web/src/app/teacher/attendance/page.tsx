'use client';

import { useState } from 'react';
import { CheckCircle2, Clock, Info, MinusCircle, Save, XCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/student/progress-ring';
import { EditorialAvatar } from '@/components/student/primitives';
import { ClassChip } from '@/components/teacher/primitives';
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
 * Teacher attendance register — card-dense redesign.
 *
 *   - KPI tile row (Attendance ring / Present / Late / Excused / Absent)
 *   - 48-px tappable rows grouped into a civic card
 *   - 4-state pill picker (Present/Late/Excused/Absent)
 *   - Auto-save helper text
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
  const attendancePct = Math.round((present / Math.max(rows.length, 1)) * 100);
  const ringTone: 'success' | 'brand' | 'warning' | 'danger' =
    attendancePct >= 95 ? 'success' : attendancePct >= 85 ? 'brand' : attendancePct >= 75 ? 'warning' : 'danger';

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-small text-muted">Register</p>
          <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-ink">
            Form 4A · Mathematics, 07:30
          </h1>
          <p className="mt-2 text-small text-muted">
            {new Date().toLocaleDateString('en-ZW', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ClassChip form="4" stream="A" subjectTone="ochre" />
          <button
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-primary px-5 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md"
          >
            <Save className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            Save register
          </button>
        </div>
      </header>

      {/* Stats strip */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <KpiTile
          label="Attendance"
          value={`${attendancePct}%`}
          ring={attendancePct}
          ringTone={ringTone}
        />
        <KpiTile label="Present" value={String(present)} tone="success" />
        <KpiTile label="Late" value={String(late)} tone={late > 0 ? 'warning' : undefined} />
        <KpiTile label="Excused" value={String(excused)} />
        <KpiTile label="Absent" value={String(absent)} tone={absent > 0 ? 'danger' : undefined} />
      </ul>

      {/* Register */}
      <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
        <header className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <div>
            <h2 className="text-small font-semibold text-ink">Roll call</h2>
            <p className="text-micro text-muted">
              Default is <strong className="text-ink">Present</strong> — override exceptions only. Saves
              automatically.
            </p>
          </div>
          <Badge tone="success" dot>
            Auto-saving
          </Badge>
        </header>
        <ul className="divide-y divide-line">
          {rows.map((r) => (
            <li key={r.id} className="flex min-h-[56px] items-center gap-3 px-5 py-2.5">
              <EditorialAvatar name={r.name} size="sm" />
              <p className="flex-1 text-small font-semibold text-ink">{r.name}</p>
              <div className="flex overflow-hidden rounded-full border border-line bg-card">
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
      </section>

      <div className="flex items-start gap-3 rounded-lg border border-info/25 bg-info/[0.04] px-4 py-3 text-small text-ink">
        <Info className="mt-0.5 h-4 w-4 flex-none text-info" strokeWidth={1.75} aria-hidden />
        <span>
          Parents of unexcused absences receive an SMS + in-app notification within 10 minutes of
          register submission. &ldquo;Late&rdquo; does not trigger an alert — repeat lateness triggers
          a weekly pattern notification to the form teacher.
        </span>
      </div>
    </div>
  );
}

function KpiTile({
  label,
  value,
  tone,
  ring,
  ringTone,
}: {
  label: string;
  value: string;
  tone?: 'success' | 'warning' | 'danger';
  ring?: number;
  ringTone?: 'success' | 'brand' | 'warning' | 'danger';
}) {
  const valueColor =
    tone === 'warning'
      ? 'text-warning'
      : tone === 'success'
      ? 'text-success'
      : tone === 'danger'
      ? 'text-danger'
      : 'text-ink';
  return (
    <li className="rounded-lg border border-line bg-card p-5 shadow-card-sm">
      <div className="flex items-center justify-between">
        <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
        {ring !== undefined && ringTone ? (
          <ProgressRing value={ring} size={40} stroke={4} tone={ringTone} />
        ) : null}
      </div>
      <p className={`mt-3 text-h2 tabular-nums ${valueColor}`}>{value}</p>
    </li>
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
    ok: 'bg-success text-white',
    warn: 'bg-warning text-white',
    info: 'bg-info text-white',
    danger: 'bg-danger text-white',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={label}
      className={[
        'inline-flex h-10 items-center justify-center gap-1.5 px-3 text-micro font-semibold transition-colors',
        selected
          ? toneClasses[tone]
          : 'border-l border-line text-muted first:border-l-0 hover:bg-surface hover:text-ink',
      ].join(' ')}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
