import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Send,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/student/progress-ring';
import { MARKING_QUEUE } from '@/lib/mock/teacher-extras';

/**
 * Teacher marking index — lists assignments needing marking.
 *
 *   - KPI tiles (To mark / In progress / Ready to release / Completion rate)
 *   - Grouped list: urgent (overdue) → to mark → in progress → ready to release
 *   - Each row links to /teacher/marking/{assignmentId}
 */

export default function MarkingIndexPage() {
  const toMark = MARKING_QUEUE.filter((q) => q.status === 'to-mark');
  const inProgress = MARKING_QUEUE.filter((q) => q.status === 'in-progress');
  const readyToRelease = MARKING_QUEUE.filter((q) => q.status === 'marked-pending-release');
  const totalSubmitted = MARKING_QUEUE.reduce((sum, q) => sum + q.submitted, 0);
  const totalExpected = MARKING_QUEUE.reduce((sum, q) => sum + q.total, 0);
  const submissionPct =
    totalExpected > 0 ? Math.round((totalSubmitted / totalExpected) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <p className="text-small text-muted">Marking</p>
        <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-ink">
          Your marking queue
        </h1>
        <p className="mt-2 text-small text-muted">
          Assignments awaiting marking or release, grouped by status.
        </p>
      </header>

      {/* KPI tiles */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiTile
          label="To mark"
          value={String(toMark.length)}
          sub={toMark.some((q) => q.overdue) ? 'Some overdue' : 'Fresh submissions'}
          tone={toMark.some((q) => q.overdue) ? 'danger' : 'warning'}
        />
        <KpiTile
          label="In progress"
          value={String(inProgress.length)}
          sub="Partially marked"
          tone="brand"
        />
        <KpiTile
          label="Ready to release"
          value={String(readyToRelease.length)}
          sub="Waiting publish"
          tone={readyToRelease.length > 0 ? 'success' : undefined}
        />
        <KpiTile
          label="Submission rate"
          value={`${submissionPct}%`}
          sub={`${totalSubmitted} / ${totalExpected} submissions`}
          ring={submissionPct}
          ringTone="brand"
        />
      </ul>

      {/* Queue */}
      <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
        <header className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <div>
            <h2 className="text-small font-semibold text-ink">All assignments</h2>
            <p className="text-micro text-muted">
              {MARKING_QUEUE.length} sets · click to open the marking workspace
            </p>
          </div>
        </header>
        <ul className="divide-y divide-line">
          {MARKING_QUEUE.map((q) => {
            const markedPct = q.total > 0 ? Math.round((q.submitted / q.total) * 100) : 0;
            const statusBadge =
              q.status === 'marked-pending-release'
                ? { tone: 'success' as const, label: 'Ready to release', icon: Send }
                : q.overdue
                ? { tone: 'danger' as const, label: 'Overdue', icon: AlertTriangle }
                : q.status === 'to-mark'
                ? { tone: 'warning' as const, label: 'To mark', icon: Clock }
                : { tone: 'brand' as const, label: 'In progress', icon: ClipboardCheck };
            const Icon = statusBadge.icon;
            return (
              <li key={q.assignmentId}>
                <Link
                  href={`/teacher/marking/${q.assignmentId}`}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface/60"
                >
                  <span
                    className={`inline-flex h-10 w-10 flex-none items-center justify-center rounded-md ${
                      statusBadge.tone === 'danger'
                        ? 'bg-danger/10 text-danger'
                        : statusBadge.tone === 'warning'
                        ? 'bg-warning/10 text-warning'
                        : statusBadge.tone === 'success'
                        ? 'bg-success/10 text-success'
                        : 'bg-brand-primary/10 text-brand-primary'
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-small font-semibold text-ink">{q.title}</p>
                    <p className="mt-0.5 text-micro text-muted">
                      {q.classLabel} · {q.dueLabel}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-micro text-muted">
                        {q.submitted}/{q.total} submitted
                      </span>
                      <div className="h-1 w-32 overflow-hidden rounded-full bg-surface">
                        <div
                          className={`h-full ${
                            statusBadge.tone === 'success' ? 'bg-success' : 'bg-brand-primary'
                          }`}
                          style={{ width: `${markedPct}%` }}
                        />
                      </div>
                      <span className="tabular-nums text-micro text-muted">{markedPct}%</span>
                    </div>
                  </div>
                  <Badge tone={statusBadge.tone} dot>
                    {statusBadge.label}
                  </Badge>
                  <ArrowRight className="h-4 w-4 flex-none text-muted" strokeWidth={1.75} aria-hidden />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Empty / help */}
      <div className="rounded-lg border border-info/25 bg-info/[0.04] p-4 text-small text-ink">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-info" strokeWidth={1.75} aria-hidden />
          <div>
            <p className="font-semibold">How marking works</p>
            <p className="mt-1 text-micro text-muted">
              Open an assignment to mark submissions one-by-one with rubric scoring and comments.
              Tap &ldquo;Release to students&rdquo; once every submission is marked — students and
              parents are notified instantly, and the mark feeds into the gradebook.
            </p>
          </div>
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
  ring,
  ringTone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: 'brand' | 'success' | 'warning' | 'danger';
  ring?: number;
  ringTone?: 'success' | 'brand' | 'warning' | 'danger';
}) {
  const valueColor =
    tone === 'warning'
      ? 'text-warning'
      : tone === 'success'
      ? 'text-success'
      : tone === 'brand'
      ? 'text-brand-primary'
      : tone === 'danger'
      ? 'text-danger'
      : 'text-ink';
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
