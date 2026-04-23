import Link from 'next/link';
import { AlertCircle, ClipboardCheck, MessageSquarePlus, PlusCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/student/progress-ring';
import { TeacherTag } from '@/components/teacher/primitives';
import { TEACHER_CLASSES } from '@/lib/mock/teacher-extras';

/**
 * Teacher classes — card-dense redesign.
 *
 *   - KPI tile row (Classes / Students / Avg average / At-risk)
 *   - Filter pill bar
 *   - 2×2 grid of class cards, each with a ProgressRing on the average
 *   - 3-stat strip + at-risk badge + quick-action chips
 */
export default function ClassesPage() {
  const totalStudents = TEACHER_CLASSES.reduce(
    (sum, c) => sum + Math.max(c.studentIds.length, 28),
    0,
  );
  const avgAverage = Math.round(
    TEACHER_CLASSES.reduce((s, c) => s + c.averagePercent, 0) /
      Math.max(TEACHER_CLASSES.length, 1),
  );
  const avgAttendance = Math.round(
    TEACHER_CLASSES.reduce((s, c) => s + c.attendancePercent, 0) /
      Math.max(TEACHER_CLASSES.length, 1),
  );
  const atRiskTotal = TEACHER_CLASSES.reduce((s, c) => s + c.atRiskCount, 0);
  const ringTone: 'success' | 'brand' | 'warning' | 'danger' =
    avgAverage >= 80 ? 'success' : avgAverage >= 65 ? 'brand' : avgAverage >= 50 ? 'warning' : 'danger';

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <p className="text-small text-muted">Classes</p>
        <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-ink">
          My classes, at a glance
        </h1>
        <p className="mt-2 text-small text-muted">
          {TEACHER_CLASSES.length} classes · {totalStudents} students taught
        </p>
      </header>

      {/* KPI tiles */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiTile label="Classes" value={String(TEACHER_CLASSES.length)} sub="This term" />
        <KpiTile
          label="Department average"
          value={`${avgAverage}%`}
          ring={avgAverage}
          ringTone={ringTone}
        />
        <KpiTile label="Attendance" value={`${avgAttendance}%`} sub="Across all classes" tone="success" />
        <KpiTile
          label="At risk"
          value={String(atRiskTotal)}
          sub={atRiskTotal === 0 ? 'None flagged' : 'Students flagged'}
          tone={atRiskTotal > 0 ? 'warning' : 'success'}
        />
      </ul>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <FilterDropdown label="All subjects" />
        <FilterDropdown label="All forms" />
        <FilterDropdown label="Current term" />
      </div>

      {/* 2×2 grid */}
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {TEACHER_CLASSES.map((c) => {
          const studentCount = Math.max(c.studentIds.length, 28);
          const classRingTone: 'success' | 'brand' | 'warning' | 'danger' =
            c.averagePercent >= 80
              ? 'success'
              : c.averagePercent >= 65
              ? 'brand'
              : c.averagePercent >= 50
              ? 'warning'
              : 'danger';
          return (
            <li key={c.id}>
              <Link
                href={`/teacher/classes/${c.id}`}
                className="hover-lift group relative block overflow-hidden rounded-lg border border-line bg-card p-6 shadow-card-sm transition-colors hover:border-brand-primary/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <ProgressRing
                      value={c.averagePercent}
                      size={64}
                      stroke={7}
                      tone={classRingTone}
                    />
                    <div>
                      <Badge tone="brand" dot>
                        {c.subjectName}
                      </Badge>
                      <h3 className="mt-2 text-h2 text-ink transition-colors group-hover:text-brand-primary">
                        Form {c.form}
                        {c.stream}
                      </h3>
                    </div>
                  </div>
                  {c.isFormTeacher ? <TeacherTag label="FT" /> : null}
                </div>

                <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-line pt-4">
                  <div>
                    <dt className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
                      Students
                    </dt>
                    <dd className="mt-1 text-h3 tabular-nums text-ink">{studentCount}</dd>
                  </div>
                  <div>
                    <dt className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
                      Average
                    </dt>
                    <dd className="mt-1 text-h3 tabular-nums text-ink">{c.averagePercent}%</dd>
                  </div>
                  <div>
                    <dt className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
                      Attendance
                    </dt>
                    <dd className="mt-1 text-h3 tabular-nums text-ink">{c.attendancePercent}%</dd>
                  </div>
                </dl>

                {c.atRiskCount > 0 ? (
                  <p className="mt-4">
                    <Badge tone="danger" dot>
                      <AlertCircle className="mr-1 inline-block h-3 w-3" strokeWidth={1.75} aria-hidden />
                      {c.atRiskCount} at risk
                    </Badge>
                  </p>
                ) : null}

                {/* Quick-action bar */}
                <div className="mt-6 flex items-center gap-1 border-t border-line pt-3 opacity-80 transition-opacity group-hover:opacity-100">
                  <QuickAction icon={ClipboardCheck} label="Take register" />
                  <QuickAction icon={PlusCircle} label="Set assignment" />
                  <QuickAction icon={MessageSquarePlus} label="Message class" />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function KpiTile({
  label,
  value,
  sub,
  tone,
  ring,
  ringTone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: 'brand' | 'success' | 'warning';
  ring?: number;
  ringTone?: 'success' | 'brand' | 'warning' | 'danger';
}) {
  const valueColor =
    tone === 'warning' ? 'text-warning' : tone === 'success' ? 'text-success' : tone === 'brand' ? 'text-brand-primary' : 'text-ink';
  return (
    <li className="rounded-lg border border-line bg-card p-5 shadow-card-sm">
      <div className="flex items-center justify-between">
        <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
        {ring !== undefined && ringTone ? (
          <ProgressRing value={ring} size={44} stroke={5} tone={ringTone} />
        ) : null}
      </div>
      <p className={`mt-3 text-h2 tabular-nums ${valueColor}`}>{value}</p>
      {sub ? <p className="mt-1 text-micro text-muted">{sub}</p> : null}
    </li>
  );
}

function FilterDropdown({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface"
    >
      {label}
    </button>
  );
}

function QuickAction({ icon: Icon, label }: { icon: typeof ClipboardCheck; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-micro font-semibold text-muted transition-colors group-hover:text-brand-primary">
      <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
      {label}
    </span>
  );
}
