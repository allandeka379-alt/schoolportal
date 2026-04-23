import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  BookOpenCheck,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  FileEdit,
  GraduationCap,
  Megaphone,
  MessageSquare,
  NotebookPen,
  Search,
  Users,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/student/progress-ring';
import {
  ATTENTION_ITEMS,
  greetingFor,
  MARKING_QUEUE,
  ME_TEACHER,
  TEACHER_CLASSES,
  TEACHER_TODAY,
  TOTAL_STUDENTS_TAUGHT,
} from '@/lib/mock/teacher-extras';

/**
 * Teacher console — civic-light card redesign.
 *
 *   • Hero greeting + class-average stat card
 *   • Alert band for anything needing attention today
 *   • "Your classes" card grid with progress rings
 *   • Quick actions strip (Take register / Mark queue / New assignment /
 *     Messages)
 *   • Two-column body:
 *       left  → today's lessons + marking queue
 *       right → attention + messages + staff notes
 */
export default function TeacherConsole() {
  const greeting = greetingFor();
  const now = new Date();
  const weekday = now.toLocaleDateString('en-ZW', { weekday: 'long' });
  const dateLabel = now.toLocaleDateString('en-ZW', { day: 'numeric', month: 'long' });
  const lessonsToday = TEACHER_TODAY.filter((l) => l.classId !== undefined).length;
  const classAverage = Math.round(
    TEACHER_CLASSES.reduce((sum, c) => sum + c.averagePercent, 0) / TEACHER_CLASSES.length,
  );
  const totalAtRisk = TEACHER_CLASSES.reduce((sum, c) => sum + c.atRiskCount, 0);
  const pendingRegisters = TEACHER_TODAY.filter((l) => !l.registerTaken).length;

  return (
    <div className="space-y-8">
      {/* Search bar */}
      <div className="flex items-center gap-4">
        <div className="relative max-w-[560px] flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            strokeWidth={1.75}
            aria-hidden
          />
          <input
            type="search"
            placeholder="Search students, classes, assignments…"
            className="h-11 w-full rounded-full border border-line bg-card pl-10 pr-4 text-small text-ink placeholder-muted/80 transition-colors focus:border-brand-primary focus:outline-none focus:ring-4 focus:ring-brand-primary/10"
          />
        </div>
      </div>

      {/* Hero greeting + stat */}
      <section className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_280px]">
        <div>
          <p className="text-small text-muted">
            {greeting}, {ME_TEACHER.title} {ME_TEACHER.lastName}.
          </p>
          <h1 className="mt-1 flex flex-wrap items-center gap-3 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-ink">
            Your day, at a glance.
            {ME_TEACHER.isFormTeacher ? <Badge tone="brand">FT</Badge> : null}
            {ME_TEACHER.isHod ? <Badge tone="gold">HOD</Badge> : null}
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-small text-muted">
            <span>{weekday}, {dateLabel}</span>
            <span className="h-1 w-1 rounded-full bg-line" aria-hidden />
            <span>{ME_TEACHER.subject}</span>
            <span className="h-1 w-1 rounded-full bg-line" aria-hidden />
            <span>
              {lessonsToday} {lessonsToday === 1 ? 'lesson' : 'lessons'} today
            </span>
          </p>
        </div>
        <div className="rounded-lg border border-line bg-card p-4 shadow-card-sm">
          <div className="flex items-center justify-between">
            <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
              Department average
            </p>
            <ProgressRing
              value={classAverage}
              size={44}
              stroke={5}
              tone={classAverage >= 80 ? 'success' : classAverage >= 65 ? 'brand' : 'warning'}
            />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-[2rem] font-bold leading-none tabular-nums text-ink">
              {classAverage}%
            </span>
          </div>
          <p className="mt-1 text-micro text-muted">
            across {TEACHER_CLASSES.length} classes · {TOTAL_STUDENTS_TAUGHT} students
          </p>
        </div>
      </section>

      {/* Alert band */}
      {pendingRegisters > 0 ? (
        <AlertBand
          tone="warning"
          icon={<ClipboardCheck className="h-5 w-5" strokeWidth={1.75} />}
          title={`${pendingRegisters} ${pendingRegisters === 1 ? 'register' : 'registers'} waiting`}
          body="Take the morning register so the pastoral team can catch absences before break."
          actionLabel="Take register"
          actionHref="/teacher/attendance"
        />
      ) : ATTENTION_ITEMS.length > 0 ? (
        <AlertBand
          tone="warning"
          icon={<AlertTriangle className="h-5 w-5" strokeWidth={1.75} />}
          title={`${ATTENTION_ITEMS.length} ${ATTENTION_ITEMS.length === 1 ? 'item needs' : 'items need'} attention`}
          body="Marking deadlines, overdue submissions and department asks."
          actionLabel="Review"
          actionHref="#attention"
        />
      ) : (
        <AlertBand
          tone="success"
          icon={<CheckCircle2 className="h-5 w-5" strokeWidth={1.75} />}
          title="Clear morning."
          body="All registers taken, marking on schedule, no flagged items."
          actionLabel="Open assignments"
          actionHref="/teacher/assignments"
        />
      )}

      {/* Snapshot stats */}
      <section>
        <h2 className="mb-4 text-h3 text-ink">Department snapshot</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SnapshotTile
            label="Classes"
            value={`${TEACHER_CLASSES.length}`}
            sub={`${TOTAL_STUDENTS_TAUGHT} students · avg ${classAverage}%`}
            icon={<Users className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
            tone="brand"
          />
          <SnapshotTile
            label="Lessons today"
            value={`${lessonsToday}`}
            sub={`${pendingRegisters} ${pendingRegisters === 1 ? 'register' : 'registers'} pending`}
            icon={<Calendar className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
            tone="info"
          />
          <SnapshotTile
            label="Marking queue"
            value={`${MARKING_QUEUE.length}`}
            sub="scripts across classes"
            icon={<FileEdit className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
            tone="gold"
          />
          <SnapshotTile
            label="At-risk students"
            value={`${totalAtRisk}`}
            sub={totalAtRisk === 0 ? 'none flagged · well done' : 'being monitored'}
            icon={<AlertTriangle className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
            tone={totalAtRisk === 0 ? 'success' : 'warning'}
          />
        </div>
      </section>

      {/* Your classes */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-h3 text-ink">Your classes</h2>
          <Link
            href="/teacher/classes"
            className="inline-flex items-center gap-1 text-small font-semibold text-brand-primary hover:text-brand-primary/80"
          >
            All classes
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
          </Link>
        </div>
        <ul className="stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {TEACHER_CLASSES.map((c) => {
            const ringTone: 'success' | 'brand' | 'warning' | 'danger' =
              c.averagePercent >= 80
                ? 'success'
                : c.averagePercent >= 65
                ? 'brand'
                : c.averagePercent >= 50
                ? 'warning'
                : 'danger';
            const studentCount = Math.max(c.studentIds.length, 28);
            return (
              <li key={c.id}>
                <Link
                  href={`/teacher/classes/${c.id}`}
                  className="hover-lift group flex h-full flex-col gap-4 rounded-lg border border-line bg-card p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-2.5 py-0.5 text-micro font-semibold text-brand-primary">
                      <GraduationCap className="h-3 w-3" strokeWidth={2} aria-hidden />
                      Form {c.form}{c.stream}
                    </div>
                    <ProgressRing value={c.averagePercent} tone={ringTone} size={52} stroke={5} />
                  </div>
                  <div>
                    <p className="text-small font-semibold text-ink group-hover:text-brand-primary">
                      {c.subjectName}
                    </p>
                    <p className="mt-0.5 text-micro text-muted">
                      {studentCount} students · Room {c.roomDefault}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 rounded-md border border-line bg-surface/60 p-2.5">
                    <MiniStat label="Avg" value={`${c.averagePercent}%`} />
                    <MiniStat label="Att" value={`${c.attendancePercent}%`} />
                    <MiniStat label="Subm" value={`${c.submissionPercent}%`} />
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    {c.atRiskCount > 0 ? (
                      <Badge tone="warning" dot>
                        {c.atRiskCount} at risk
                      </Badge>
                    ) : (
                      <Badge tone="success" dot>
                        On track
                      </Badge>
                    )}
                    {c.isFormTeacher ? <Badge tone="brand">FT</Badge> : null}
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
            icon={<ClipboardCheck className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
            label="Take register"
            sub={pendingRegisters > 0 ? `${pendingRegisters} waiting` : 'All taken'}
            href="/teacher/attendance"
            tone={pendingRegisters > 0 ? 'warning' : 'success'}
          />
          <QuickTile
            icon={<FileEdit className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
            label="Mark queue"
            sub={`${MARKING_QUEUE.length} items`}
            href="/teacher/assignments"
            tone="brand"
          />
          <QuickTile
            icon={<NotebookPen className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
            label="New assignment"
            sub="Rubric + release"
            href="/teacher/assignments/new"
            tone="gold"
          />
          <QuickTile
            icon={<MessageSquare className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
            label="Messages"
            sub="Parents · students · staff"
            href="/teacher/messages"
            tone="info"
          />
        </ul>
      </section>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          {/* Today's lessons */}
          <Panel
            title="Today's lessons"
            sub={`${TEACHER_TODAY.length} scheduled`}
          >
            <ul className="divide-y divide-line">
              {TEACHER_TODAY.map((lesson) => {
                const cls = TEACHER_CLASSES.find((c) => c.id === lesson.classId);
                return (
                  <li
                    key={lesson.id}
                    className={[
                      'relative flex items-center gap-4 px-5 py-4 transition-colors',
                      lesson.isCurrent ? 'bg-brand-primary/5' : 'hover:bg-surface',
                    ].join(' ')}
                  >
                    {lesson.isCurrent ? (
                      <span
                        aria-hidden
                        className="absolute inset-y-2 left-0 w-[3px] rounded-r-sm bg-brand-primary"
                      />
                    ) : null}
                    <span
                      className={[
                        'w-14 flex-none text-small font-mono tabular-nums',
                        lesson.isCurrent ? 'font-semibold text-brand-primary' : 'text-muted',
                      ].join(' ')}
                    >
                      {lesson.start}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {cls ? (
                          <Badge tone="brand">
                            Form {cls.form}{cls.stream}
                          </Badge>
                        ) : null}
                        <span className="text-micro text-muted">Room {lesson.room}</span>
                        {lesson.isCurrent ? <Badge tone="brand">Now</Badge> : null}
                      </div>
                      <p className="mt-1.5 text-small text-ink">{lesson.topic}</p>
                    </div>
                    {!lesson.registerTaken ? (
                      <Link
                        href="/teacher/attendance"
                        className="inline-flex h-9 items-center gap-1 rounded-full bg-brand-primary px-3 text-micro font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90"
                      >
                        Take register
                      </Link>
                    ) : (
                      <Badge tone="success" dot>
                        Register taken
                      </Badge>
                    )}
                  </li>
                );
              })}
            </ul>
          </Panel>

          {/* Marking queue */}
          <Panel
            title="Marking queue"
            sub={`${MARKING_QUEUE.length} scripts · newest first`}
            href="/teacher/assignments"
            hrefLabel="Open queue"
          >
            <ul className="divide-y divide-line">
              {MARKING_QUEUE.map((q) => {
                const pct = (q.submitted / q.total) * 100;
                return (
                  <li key={q.assignmentId}>
                    <Link
                      href={`/teacher/marking/${q.assignmentId}`}
                      className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface"
                    >
                      <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-md bg-brand-primary/10 text-brand-primary">
                        <FileEdit className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-small font-semibold text-ink group-hover:text-brand-primary">
                            {q.title}
                          </p>
                          {q.status === 'marked-pending-release' ? (
                            <Badge tone="success">Ready to release</Badge>
                          ) : null}
                        </div>
                        <p className="text-micro text-muted">
                          {q.classLabel} · {q.submitted} of {q.total} submitted · {q.dueLabel}
                        </p>
                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface">
                          <div
                            className={[
                              'h-full rounded-full transition-all',
                              pct >= 75 ? 'bg-success' : pct >= 50 ? 'bg-brand-primary' : 'bg-warning',
                            ].join(' ')}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
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
        </div>

        <div className="space-y-6">
          {/* Attention today */}
          <Panel
            id="attention"
            title="Attention today"
            sub="Clears as you complete items"
          >
            {ATTENTION_ITEMS.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-success" strokeWidth={1.5} aria-hidden />
                <p className="mt-2 text-small text-muted">No outstanding actions.</p>
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {ATTENTION_ITEMS.slice(0, 4).map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className="group flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-surface"
                    >
                      <span
                        className={[
                          'inline-flex h-9 w-9 flex-none items-center justify-center rounded-md',
                          item.tone === 'overdue'
                            ? 'bg-danger/10 text-danger'
                            : item.tone === 'warning'
                            ? 'bg-warning/10 text-warning'
                            : 'bg-info/10 text-info',
                        ].join(' ')}
                      >
                        <ClipboardList className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-small font-semibold text-ink group-hover:text-brand-primary">
                          {item.label}
                        </p>
                        <p className="truncate text-micro text-muted">{item.detail}</p>
                      </div>
                      <ChevronRight
                        className="h-4 w-4 flex-none text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand-primary"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {/* Secondary tiles */}
          <div className="rounded-lg border border-line bg-card p-5 shadow-card-sm">
            <div className="flex items-center justify-between">
              <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
                Messages
              </p>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-info/10 text-info">
                <MessageSquare className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </span>
            </div>
            <p className="mt-3 text-h1 tabular-nums text-ink">10</p>
            <p className="mt-1 text-micro text-muted">3 parent · 5 student · 2 staff</p>
            <Link
              href="/teacher/messages"
              className="mt-3 inline-flex items-center gap-1 text-small font-semibold text-brand-primary hover:text-brand-primary/80"
            >
              Open inbox
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            </Link>
          </div>

          <div className="rounded-lg border border-line bg-card p-5 shadow-card-sm">
            <div className="flex items-center justify-between">
              <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
                Staff notices
              </p>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-brand-accent/15 text-brand-accent">
                <Megaphone className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </span>
            </div>
            <p className="mt-3 text-small font-semibold text-ink">
              Mid-term marking moderation · Thursday
            </p>
            <p className="mt-1 text-micro text-muted">
              HOD-led · bring three scripts per class to the staff room.
            </p>
            <Link
              href="#"
              className="mt-3 inline-flex items-center gap-1 text-small font-semibold text-brand-primary hover:text-brand-primary/80"
            >
              See staff noticeboard
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
    danger: 'bg-danger/8 border-danger/25 text-danger',
    info: 'bg-info/8 border-info/25 text-info',
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

function SnapshotTile({
  label,
  value,
  sub,
  icon,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  tone: 'brand' | 'success' | 'info' | 'gold' | 'warning';
}) {
  const toneStyles = {
    brand: 'bg-brand-primary/10 text-brand-primary',
    info: 'bg-info/10 text-info',
    success: 'bg-success/10 text-success',
    gold: 'bg-brand-accent/15 text-brand-accent',
    warning: 'bg-warning/10 text-warning',
  }[tone];
  return (
    <div className="rounded-lg border border-line bg-card p-5 shadow-card-sm">
      <div className="flex items-center justify-between">
        <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
        <span className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${toneStyles}`}>
          {icon}
        </span>
      </div>
      <p className="mt-3 text-h1 tabular-nums text-ink">{value}</p>
      <p className="mt-1 text-micro text-muted">{sub}</p>
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
    brand: 'bg-brand-primary/10 text-brand-primary',
    info: 'bg-info/10 text-info',
    success: 'bg-success/10 text-success',
    gold: 'bg-brand-accent/15 text-brand-accent',
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
  id,
  children,
}: {
  title: string;
  sub?: string;
  href?: string;
  hrefLabel?: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm"
    >
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

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-micro font-semibold uppercase tracking-[0.1em] text-muted">{label}</p>
      <p className="mt-0.5 text-small font-semibold tabular-nums text-ink">{value}</p>
    </div>
  );
}
