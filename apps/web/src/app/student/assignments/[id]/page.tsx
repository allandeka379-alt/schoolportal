import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronLeft,
  Clock,
  FileBadge2,
  FileText,
  MessageSquarePlus,
  Target,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/student/progress-ring';
import { ASSIGNMENTS_FOR_FARAI } from '@/lib/mock/fixtures';
import { ASSIGNMENT_DETAILS, dueLabel, subjectNameByCode } from '@/lib/mock/student-extras';

import { SubmissionPanel } from '@/components/student/submission-panel';

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Assignment detail — card-dense redesign.
 *
 * Left: headline card with subject pill + status badge + countdown, then
 * instructions, attachment tiles, rubric table and teacher feedback.
 * Right: sticky submission panel (drag-drop file upload + submit).
 */
export default async function AssignmentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const a = ASSIGNMENT_DETAILS[id] ?? ASSIGNMENTS_FOR_FARAI.find((x) => x.id === id);
  if (!a) notFound();

  const detail = ASSIGNMENT_DETAILS[id];
  const due = dueLabel(a.dueAt);
  const dueDate = new Date(a.dueAt);
  const hoursRemaining = Math.max(0, Math.floor((dueDate.getTime() - Date.now()) / (1000 * 60 * 60)));
  const showCountdown = hoursRemaining > 0 && hoursRemaining < 24;

  const statusBadge: { tone: 'success' | 'info' | 'warning' | 'danger' | 'brand'; label: string } =
    a.status === 'RETURNED'
      ? { tone: 'success', label: 'Marked' }
      : a.status === 'SUBMITTED'
      ? { tone: 'info', label: 'Submitted · waiting mark' }
      : a.status === 'LATE'
      ? { tone: 'danger', label: 'Overdue' }
      : { tone: 'warning', label: due.label };

  const pct = a.markAwarded !== undefined ? (a.markAwarded / a.maxMarks) * 100 : null;
  const markRing: 'success' | 'brand' | 'warning' | 'danger' =
    pct === null ? 'brand' : pct >= 80 ? 'success' : pct >= 60 ? 'brand' : pct >= 50 ? 'warning' : 'danger';

  return (
    <div className="space-y-6">
      <Link
        href="/student/assignments"
        className="inline-flex items-center gap-1.5 text-small font-medium text-muted transition-colors hover:text-brand-primary"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        Back to assignments
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left column */}
        <article className="space-y-6 lg:col-span-8">
          {/* Headline card */}
          <section className="rounded-lg border border-line bg-card p-6 shadow-card-sm">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="brand">
                <FileBadge2 className="h-3 w-3" strokeWidth={2} aria-hidden />
                {subjectNameByCode(a.subjectCode)}
              </Badge>
              <Badge tone={statusBadge.tone} dot>
                {statusBadge.label}
              </Badge>
            </div>
            <h1 className="mt-4 text-[clamp(1.5rem,3vw,2rem)] font-bold leading-tight tracking-tight text-ink">
              {a.title}
            </h1>
            <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <DetailTile
                label="Set by"
                value={a.teacher}
                icon={<MessageSquarePlus className="h-4 w-4" strokeWidth={1.75} aria-hidden />}
              />
              <DetailTile
                label="Due"
                value={
                  dueDate.toLocaleDateString('en-ZW', { day: 'numeric', month: 'short' }) +
                  ' · ' +
                  dueDate.toLocaleTimeString('en-ZW', { hour: '2-digit', minute: '2-digit', hour12: false })
                }
                icon={<Clock className="h-4 w-4" strokeWidth={1.75} aria-hidden />}
              />
              <DetailTile
                label="Max marks"
                value={`${a.maxMarks}`}
                icon={<Target className="h-4 w-4" strokeWidth={1.75} aria-hidden />}
              />
            </dl>
            {showCountdown ? (
              <div className="mt-5 flex flex-wrap items-center gap-3 rounded-md border border-warning/30 bg-warning/5 px-4 py-3">
                <Clock className="h-4 w-4 text-warning" strokeWidth={1.75} aria-hidden />
                <p className="text-small text-ink">
                  <span className="font-semibold text-warning">Due in {hoursRemaining} hours</span> —
                  submit early if you can.
                </p>
              </div>
            ) : null}
          </section>

          {/* Instructions */}
          <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
            <header className="border-b border-line px-5 py-3.5">
              <h2 className="text-small font-semibold text-ink">Instructions</h2>
            </header>
            <div className="space-y-3 px-5 py-5 text-body text-ink">
              {(detail?.body ?? a.instructions).split('\n').map((line, i) => (
                <p key={i}>{line || <br />}</p>
              ))}
            </div>
          </section>

          {/* Attachments */}
          {a.attachments.length > 0 ? (
            <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
              <header className="border-b border-line px-5 py-3.5">
                <h2 className="text-small font-semibold text-ink">Attached readings</h2>
                <p className="text-micro text-muted">{a.attachments.length} file(s)</p>
              </header>
              <ul className="divide-y divide-line">
                {a.attachments.map((att) => (
                  <li key={att.name}>
                    <a
                      href="#"
                      className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface"
                    >
                      <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-md bg-brand-primary/10 text-brand-primary">
                        <FileText className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-small font-semibold text-ink group-hover:text-brand-primary">
                          {att.name}
                        </p>
                        <p className="text-micro text-muted">{att.size}</p>
                      </div>
                      <span className="text-small font-semibold text-brand-primary opacity-0 transition-opacity group-hover:opacity-100">
                        Open →
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* Rubric */}
          {detail && detail.rubric.length > 0 ? (
            <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
              <header className="border-b border-line px-5 py-3.5">
                <h2 className="text-small font-semibold text-ink">Rubric</h2>
                <p className="text-micro text-muted">
                  Your teacher marks against each criterion — {detail.rubric.length} total
                </p>
              </header>
              <ul className="divide-y divide-line">
                {detail.rubric.map((r) => {
                  const share = (r.maxPoints / a.maxMarks) * 100;
                  return (
                    <li key={r.criterion} className="flex items-center gap-4 px-5 py-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-small font-semibold text-ink">{r.criterion}</p>
                        <p className="mt-0.5 text-small text-muted">{r.descriptor}</p>
                      </div>
                      <div className="w-28 flex-none text-right">
                        <p className="text-small font-bold tabular-nums text-ink">{r.maxPoints}</p>
                        <p className="text-micro text-muted">of {a.maxMarks} ({share.toFixed(0)}%)</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          {/* Teacher feedback */}
          {a.status === 'RETURNED' && a.feedback && a.markAwarded !== undefined ? (
            <section className="overflow-hidden rounded-lg border border-success/30 bg-success/[0.04] shadow-card-sm">
              <header className="border-b border-success/20 px-5 py-3.5">
                <h2 className="text-small font-semibold text-success">Teacher feedback</h2>
                <p className="text-micro text-muted">Released by {a.teacher}</p>
              </header>
              <div className="flex flex-wrap items-start gap-5 px-5 py-5">
                <ProgressRing value={pct ?? 0} size={72} stroke={6} tone={markRing} />
                <div className="min-w-0 flex-1">
                  <p className="flex items-baseline gap-2">
                    <span className="text-h1 tabular-nums text-ink">{a.markAwarded}</span>
                    <span className="text-small text-muted">of {a.maxMarks}</span>
                    <Badge
                      tone={
                        (pct ?? 0) >= 80
                          ? 'success'
                          : (pct ?? 0) >= 60
                          ? 'info'
                          : (pct ?? 0) >= 50
                          ? 'warning'
                          : 'danger'
                      }
                    >
                      {Math.round(pct ?? 0)}%
                    </Badge>
                  </p>
                  <p className="mt-3 text-body text-ink">&ldquo;{a.feedback}&rdquo;</p>
                  <Link
                    href="/student/messages"
                    className="mt-3 inline-flex items-center gap-1 text-small font-semibold text-brand-primary hover:text-brand-primary/80"
                  >
                    <MessageSquarePlus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                    Ask a follow-up
                  </Link>
                </div>
              </div>
            </section>
          ) : null}
        </article>

        {/* Right column — submission panel */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-20">
            <SubmissionPanel
              assignmentId={a.id}
              status={a.status}
              dueAtIso={a.dueAt}
              submittedAtIso={a.submittedAt}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

function DetailTile({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-line bg-surface/60 px-3 py-2.5">
      <span className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-md bg-brand-primary/10 text-brand-primary">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-micro font-semibold uppercase tracking-[0.1em] text-muted">{label}</p>
        <p className="truncate text-small font-semibold text-ink">{value}</p>
      </div>
    </div>
  );
}
