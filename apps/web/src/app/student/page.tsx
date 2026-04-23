import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  FileBadge2,
  GraduationCap,
  Library,
  MessageSquare,
  NotebookPen,
  Search,
  TrendingUp,
  Users,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/student/progress-ring';
import { currentAccount } from '@/lib/auth/session';
import { ASSIGNMENTS_FOR_FARAI, GRADEBOOK_FARAI } from '@/lib/mock/fixtures';
import {
  CURRENT_TERM,
  dueLabel,
  FEES_SUMMARY,
  greetingFor,
  ME_STUDENT,
  RECENT_MARKS,
  STUDENT_ANNOUNCEMENTS,
  subjectNameByCode,
  TODAY_SLOTS,
} from '@/lib/mock/student-extras';

/**
 * Student dashboard — civic-light card redesign.
 *
 * The page is organised visually rather than editorially:
 *   • Greeting band with one headline stat on the right
 *   • Alert row for anything overdue
 *   • "Your subjects" grid with circular progress rings
 *   • Quick-actions strip of big tiles
 *   • Recent activity list on the left, today's timetable on the right
 */
export default async function StudentDashboard() {
  const account = await currentAccount();
  const firstName = account?.firstName ?? ME_STUDENT.firstName;

  const greeting = greetingFor();
  const now = new Date();
  const weekday = now.toLocaleDateString('en-ZW', { weekday: 'long' });
  const dateLabel = now.toLocaleDateString('en-ZW', { day: 'numeric', month: 'long' });

  const openAssignments = ASSIGNMENTS_FOR_FARAI.filter(
    (a) => a.status === 'OPEN' || a.status === 'LATE',
  );
  const overdue = openAssignments.filter((a) => new Date(a.dueAt).getTime() < now.getTime());
  const dueSoon = [...openAssignments]
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
    .slice(0, 3);

  // Subject data — grade book fused with coloured tones per subject.
  const SUBJECT_TONES: Record<string, { bg: string; text: string; ring: 'brand' | 'success' | 'warning' | 'danger' }> = {
    MATH: { bg: 'bg-info/10',          text: 'text-info',          ring: 'brand' },
    ENGL: { bg: 'bg-success/10',       text: 'text-success',       ring: 'success' },
    SHON: { bg: 'bg-warning/10',       text: 'text-warning',       ring: 'warning' },
    CHEM: { bg: 'bg-danger/10',        text: 'text-danger',        ring: 'danger' },
    PHYS: { bg: 'bg-brand-primary/10', text: 'text-brand-primary', ring: 'brand' },
    BIO:  { bg: 'bg-success/10',       text: 'text-success',       ring: 'success' },
    HIST: { bg: 'bg-brand-accent/15',  text: 'text-brand-accent',  ring: 'brand' },
    GEOG: { bg: 'bg-info/10',          text: 'text-info',          ring: 'brand' },
  };

  const termAverage = Math.round(
    GRADEBOOK_FARAI.reduce((s, r) => s + r.total, 0) / GRADEBOOK_FARAI.length,
  );

  const attendance = 96;

  return (
    <div className="space-y-8">
      {/* Top search bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-[560px]">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" strokeWidth={1.75} aria-hidden />
          <input
            type="search"
            placeholder="Search assignments, subjects, library…"
            className="h-11 w-full rounded-full border border-line bg-card pl-10 pr-4 text-small text-ink placeholder-muted/80 transition-colors focus:border-brand-primary focus:outline-none focus:ring-4 focus:ring-brand-primary/10"
          />
        </div>
      </div>

      {/* Hero greeting + headline stat */}
      <section className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_280px]">
        <div>
          <p className="text-small text-muted">{greeting} {firstName}.</p>
          <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-ink">
            Your term, at a glance.
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-small text-muted">
            <span>{weekday}, {dateLabel}</span>
            <span className="h-1 w-1 rounded-full bg-line" aria-hidden />
            <span>{ME_STUDENT.form} {ME_STUDENT.stream}</span>
            <span className="h-1 w-1 rounded-full bg-line" aria-hidden />
            <span>{CURRENT_TERM.label} · Week {CURRENT_TERM.weekNumber}</span>
          </p>
        </div>
        <div className="rounded-lg border border-line bg-card p-4 shadow-card-sm">
          <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
            Term average
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-[2rem] font-bold leading-none tabular-nums text-ink">
              {termAverage}%
            </span>
            <span className="inline-flex items-center gap-1 text-small font-semibold text-success">
              <TrendingUp className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
              +4
            </span>
          </div>
          <p className="mt-2 text-micro text-muted">up from last term · {CURRENT_TERM.classPosition} of {CURRENT_TERM.classSize} in class</p>
        </div>
      </section>

      {/* Alert band */}
      {overdue.length > 0 ? (
        <AlertBand
          tone="warning"
          icon={<AlertTriangle className="h-5 w-5" strokeWidth={1.75} />}
          title={`${overdue.length} ${overdue.length === 1 ? 'assignment' : 'assignments'} overdue`}
          body="Submit today to keep your pass streak."
          actionLabel="Go to assignments"
          actionHref="/student/assignments"
        />
      ) : (
        <AlertBand
          tone="success"
          icon={<CheckCircle2 className="h-5 w-5" strokeWidth={1.75} />}
          title="You are all caught up."
          body={`${openAssignments.length} open, all on schedule. Keep it going.`}
          actionLabel="See what's due"
          actionHref="/student/assignments"
        />
      )}

      {/* Your subjects */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-h3 text-ink">Your subjects</h2>
          <Link
            href="/student/grades"
            className="inline-flex items-center gap-1 text-small font-semibold text-brand-primary hover:text-brand-primary/80"
          >
            View all grades
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
          </Link>
        </div>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {GRADEBOOK_FARAI.slice(0, 8).map((row) => {
            const tone = SUBJECT_TONES[row.subjectCode] ?? {
              bg: 'bg-brand-primary/10',
              text: 'text-brand-primary',
              ring: 'brand' as const,
            };
            const ringTone: 'brand' | 'success' | 'warning' | 'danger' =
              row.total >= 80 ? 'success' : row.total >= 60 ? tone.ring : 'danger';
            const trendIcon =
              row.trend === 'up' ? (
                <TrendingUp className="h-3 w-3 text-success" strokeWidth={2} aria-hidden />
              ) : row.trend === 'down' ? (
                <TrendingUp className="h-3 w-3 rotate-180 text-danger" strokeWidth={2} aria-hidden />
              ) : null;
            return (
              <li key={row.subjectCode}>
                <Link
                  href={`/student/grades/${row.subjectCode.toLowerCase()}`}
                  className="hover-lift group flex h-full flex-col gap-4 rounded-lg border border-line bg-card p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className={[
                        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-micro font-semibold',
                        tone.bg,
                        tone.text,
                      ].join(' ')}
                    >
                      <BookOpen className="h-3 w-3" strokeWidth={2} aria-hidden />
                      {row.subjectCode}
                    </div>
                    <ProgressRing value={row.total} tone={ringTone} size={52} stroke={5} />
                  </div>
                  <div>
                    <p className="text-small font-semibold text-ink group-hover:text-brand-primary">
                      {row.subjectName}
                    </p>
                    <p className="mt-0.5 text-micro text-muted">Position {row.position}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-line pt-3">
                    <span className="inline-flex items-center gap-1.5 text-micro font-semibold text-muted">
                      Grade{' '}
                      <span
                        className={[
                          'inline-flex h-5 items-center justify-center rounded-full px-1.5 text-micro font-bold',
                          row.grade === 'A'
                            ? 'bg-success/10 text-success'
                            : row.grade === 'B'
                            ? 'bg-info/10 text-info'
                            : row.grade === 'C'
                            ? 'bg-warning/10 text-warning'
                            : 'bg-danger/10 text-danger',
                        ].join(' ')}
                      >
                        {row.grade}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-micro text-muted">
                      {trendIcon}
                      this term
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="mb-4 text-h3 text-ink">Quick actions</h2>
        <ul className="stagger-children grid grid-cols-2 gap-3 sm:grid-cols-4">
          <QuickTile
            icon={<NotebookPen className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
            label="Submit an assignment"
            sub={`${openAssignments.length} open`}
            href="/student/assignments"
            tone="brand"
          />
          <QuickTile
            icon={<Library className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
            label="Open the library"
            sub="Past papers · notes"
            href="/student/library"
            tone="info"
          />
          <QuickTile
            icon={<MessageSquare className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
            label="Message a teacher"
            sub="Moderated channel"
            href="/student/messages"
            tone="success"
          />
          <QuickTile
            icon={<Calendar className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
            label="Timetable"
            sub={`${TODAY_SLOTS.length} classes today`}
            href="/student/timetable"
            tone="gold"
          />
        </ul>
      </section>

      {/* Main grid — left: due + activity; right: today + fees */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          {/* Due soon */}
          <Panel
            title="Due soon"
            href="/student/assignments"
            hrefLabel="View all assignments"
          >
            <ul className="divide-y divide-line">
              {dueSoon.map((a) => {
                const due = dueLabel(a.dueAt);
                const tone: 'danger' | 'warning' | 'info' =
                  due.tone === 'overdue' || due.tone === 'due-today'
                    ? 'danger'
                    : due.tone === 'soon'
                    ? 'warning'
                    : 'info';
                return (
                  <li key={a.id}>
                    <Link
                      href={`/student/assignments/${a.id}`}
                      className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface"
                    >
                      <span
                        className={[
                          'inline-flex h-10 w-10 flex-none items-center justify-center rounded-md',
                          tone === 'danger'
                            ? 'bg-danger/10 text-danger'
                            : tone === 'warning'
                            ? 'bg-warning/10 text-warning'
                            : 'bg-info/10 text-info',
                        ].join(' ')}
                      >
                        <FileBadge2 className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-small font-semibold text-ink group-hover:text-brand-primary">
                          {a.title}
                        </p>
                        <p className="text-micro text-muted">
                          {subjectNameByCode(a.subjectCode)} · {a.teacher}
                        </p>
                      </div>
                      <Badge tone={tone} dot>
                        {due.label}
                      </Badge>
                      <ChevronRight
                        className="h-4 w-4 flex-none text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand-primary"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Panel>

          {/* Recent activity */}
          <Panel
            title="Recent activity"
            href="/student/grades"
            hrefLabel="See all grades"
          >
            <ul className="divide-y divide-line">
              {RECENT_MARKS.map((m) => {
                const pct = (m.mark / m.outOf) * 100;
                const tone: 'success' | 'info' | 'warning' =
                  pct >= 80 ? 'success' : pct >= 60 ? 'info' : 'warning';
                return (
                  <li
                    key={m.id}
                    className="flex items-center gap-4 px-5 py-4"
                  >
                    <span
                      className={[
                        'inline-flex h-10 w-10 flex-none items-center justify-center rounded-md',
                        tone === 'success'
                          ? 'bg-success/10 text-success'
                          : tone === 'info'
                          ? 'bg-info/10 text-info'
                          : 'bg-warning/10 text-warning',
                      ].join(' ')}
                    >
                      <GraduationCap className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-small font-semibold text-ink">{m.title}</p>
                      <p className="text-micro text-muted">
                        {m.subjectName} · returned {m.returnedAgo}
                      </p>
                    </div>
                    <Badge tone={tone}>{pct.toFixed(0)}%</Badge>
                    <span className="hidden text-small font-bold tabular-nums text-ink sm:inline-block">
                      {m.mark}
                      <span className="text-micro text-muted"> / {m.outOf}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </Panel>

          {/* Announcements — compact */}
          <Panel
            title="Announcements"
            href="/student/announcements"
            hrefLabel="View all announcements"
          >
            <ul className="divide-y divide-line">
              {STUDENT_ANNOUNCEMENTS.slice(0, 2).map((a) => (
                <li key={a.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {a.category === 'Urgent' ? (
                      <Badge tone="danger">Urgent</Badge>
                    ) : (
                      <Badge tone="brand">{a.category}</Badge>
                    )}
                    <span className="text-micro text-muted">· {a.publishedAgo}</span>
                    <span className="text-micro text-muted">· {a.author}</span>
                  </div>
                  <p className="mt-2 text-small font-semibold text-ink">{a.title}</p>
                  <p className="mt-1 line-clamp-2 text-small text-muted">{a.body}</p>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        {/* Right column: today + fees + attendance */}
        <div className="space-y-6">
          {/* Today */}
          <Panel title="Today" sub={`${weekday}, ${dateLabel}`}>
            <ul className="divide-y divide-line">
              {TODAY_SLOTS.slice(0, 6).map((s) => (
                <li
                  key={s.start}
                  className={[
                    'relative flex items-center gap-3 px-5 py-3',
                    s.current ? 'bg-brand-primary/5' : '',
                  ].join(' ')}
                >
                  {s.current ? (
                    <span
                      aria-hidden
                      className="absolute inset-y-2 left-0 w-[3px] rounded-r-sm bg-brand-primary"
                    />
                  ) : null}
                  <span
                    className={[
                      'w-14 flex-none text-micro font-mono tabular-nums',
                      s.current ? 'font-semibold text-brand-primary' : 'text-muted',
                    ].join(' ')}
                  >
                    {s.start}
                  </span>
                  <div className="min-w-0 flex-1">
                    {s.kind === 'class' ? (
                      <>
                        <p
                          className={[
                            'text-small font-semibold',
                            s.current ? 'text-brand-primary' : 'text-ink',
                          ].join(' ')}
                        >
                          {s.subject}
                        </p>
                        <p className="text-micro text-muted">
                          {[s.teacher, s.room].filter(Boolean).join(' · ')}
                        </p>
                      </>
                    ) : (
                      <p className="text-small italic text-muted">{s.subject}</p>
                    )}
                  </div>
                  {s.current ? <Badge tone="brand">Now</Badge> : null}
                </li>
              ))}
            </ul>
          </Panel>

          {/* Fees */}
          <div className="rounded-lg border border-line bg-card p-5 shadow-card-sm">
            <div className="flex items-center justify-between">
              <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
                Fees this term
              </p>
              <Badge tone={FEES_SUMMARY.status === 'PAID' ? 'success' : 'warning'} dot>
                {FEES_SUMMARY.status === 'PAID' ? 'Paid up' : 'Due soon'}
              </Badge>
            </div>
            {FEES_SUMMARY.status === 'PAID' ? (
              <p className="mt-3 text-h2 text-success">Settled in full.</p>
            ) : (
              <>
                <p className="mt-3 flex items-baseline gap-1">
                  <span className="text-micro text-muted">{FEES_SUMMARY.currency}</span>
                  <span className="text-[2rem] font-bold leading-none tabular-nums text-ink">
                    {FEES_SUMMARY.outstanding}
                  </span>
                </p>
                <p className="mt-1 text-micro text-muted">outstanding · next bill due 30 Apr</p>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-brand-primary transition-all"
                    style={{ width: `62%` }}
                  />
                </div>
                <p className="mt-1.5 text-micro text-muted">62% of term paid</p>
              </>
            )}
            <Link
              href="/parent/fees/upload"
              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-5 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md"
            >
              <CreditCard className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              {FEES_SUMMARY.status === 'PAID' ? 'View history' : 'Pay now'}
            </Link>
          </div>

          {/* Attendance mini-card */}
          <div className="rounded-lg border border-line bg-card p-5 shadow-card-sm">
            <div className="flex items-center justify-between">
              <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
                Attendance this term
              </p>
              <ProgressRing value={attendance} size={48} stroke={5} tone="success" />
            </div>
            <div className="mt-4 flex items-center gap-2 text-small">
              <Users className="h-4 w-4 text-success" strokeWidth={1.75} aria-hidden />
              <span className="font-semibold text-ink">{attendance}% present</span>
              <span className="text-muted">· Savanna House</span>
            </div>
            <Link
              href="/parent/attendance"
              className="mt-3 inline-flex items-center gap-1 text-small font-semibold text-brand-primary hover:text-brand-primary/80"
            >
              View register
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Local primitives                                                   */
/* ------------------------------------------------------------------ */

function AlertBand({
  tone,
  icon,
  title,
  body,
  actionLabel,
  actionHref,
}: {
  tone: 'success' | 'warning' | 'danger' | 'info';
  icon: React.ReactNode;
  title: string;
  body: string;
  actionLabel: string;
  actionHref: string;
}) {
  const surface = {
    success: 'bg-success/8 border-success/25 text-success',
    warning: 'bg-warning/8 border-warning/25 text-warning',
    danger:  'bg-danger/8 border-danger/25 text-danger',
    info:    'bg-info/8 border-info/25 text-info',
  }[tone];
  return (
    <div className={`flex flex-wrap items-center gap-4 rounded-lg border px-5 py-4 ${surface}`}>
      <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white shadow-card-sm">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-small font-semibold text-ink">{title}</p>
        <p className="text-small text-muted">{body}</p>
      </div>
      <Link
        href={actionHref}
        className="inline-flex h-10 items-center gap-1 rounded-full bg-white px-4 text-small font-semibold text-ink shadow-card-sm transition hover:shadow-card-md"
      >
        {actionLabel}
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
      </Link>
    </div>
  );
}

function QuickTile({
  icon,
  label,
  sub,
  href,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  href: string;
  tone: 'brand' | 'success' | 'info' | 'gold' | 'warning';
}) {
  const toneStyles = {
    brand:   'bg-brand-primary/10 text-brand-primary',
    info:    'bg-info/10 text-info',
    success: 'bg-success/10 text-success',
    gold:    'bg-brand-accent/15 text-brand-accent',
    warning: 'bg-warning/10 text-warning',
  }[tone];
  return (
    <li>
      <Link
        href={href}
        className="hover-lift group flex h-full items-start gap-3 rounded-lg border border-line bg-card p-4"
      >
        <span className={`inline-flex h-10 w-10 flex-none items-center justify-center rounded-md ${toneStyles}`}>
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-small font-semibold text-ink group-hover:text-brand-primary">{label}</p>
          <p className="mt-0.5 text-micro text-muted">{sub}</p>
        </div>
        <ChevronRight
          className="h-4 w-4 flex-none text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand-primary"
          strokeWidth={1.75}
          aria-hidden
        />
      </Link>
    </li>
  );
}

function Panel({
  title,
  sub,
  href,
  hrefLabel,
  children,
}: {
  title: string;
  sub?: string;
  href?: string;
  hrefLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <div>
          <h3 className="text-small font-semibold text-ink">{title}</h3>
          {sub ? <p className="text-micro text-muted">{sub}</p> : null}
        </div>
        {href && hrefLabel ? (
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-micro font-semibold text-brand-primary hover:text-brand-primary/80"
          >
            {hrefLabel}
            <ArrowRight className="h-3 w-3" strokeWidth={2} aria-hidden />
          </Link>
        ) : null}
      </header>
      {children}
    </section>
  );
}
