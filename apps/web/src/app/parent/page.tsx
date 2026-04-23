'use client';

import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calendar,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  FileText,
  GraduationCap,
  Home,
  Megaphone,
  MessageSquare,
  Search,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/student/progress-ring';
import { useSelectedChild } from '@/components/parent/selected-child-context';
import {
  attentionFor,
  gradesFor,
  greetingFor,
  ME_PARENT,
  PARENT_ANNOUNCEMENTS,
  PARENT_CHILDREN,
  PARENT_EVENTS,
  PARENT_THREADS,
  todayContext,
  type ParentChild,
} from '@/lib/mock/parent-extras';

/**
 * Parent dashboard — civic-light card redesign.
 *
 * Single-child view  : focused stats for the selected child
 * All-children view  : a card per child (the equivalent of the reference's
 *                      property cards) with progress ring, status chip,
 *                      and per-child "Open" CTA.
 *
 * Across both modes the visual language is card-dense: no long editorial
 * lists, every panel is a bordered card with an eyebrow header and
 * coloured affordances.
 */
export default function ParentDashboard() {
  const { selectedChild, allSelected, setSelectedId, setAllSelected } = useSelectedChild();

  if (allSelected) {
    return (
      <AllChildrenView
        onOpen={(id) => {
          setAllSelected(false);
          setSelectedId(id);
        }}
      />
    );
  }

  return <SingleChildView child={selectedChild} />;
}

/* ------------------------------------------------------------------ */
/*  Single-child view                                                  */
/* ------------------------------------------------------------------ */

function SingleChildView({ child }: { child: ParentChild }) {
  const greeting = greetingFor();
  const context = todayContext(child.id);
  const childSubjects = gradesFor(child.id);
  const attention = attentionFor(child.id);

  const upcomingEvents = PARENT_EVENTS.filter(
    (e) =>
      new Date(e.date).getTime() >= Date.now() - 86400000 &&
      e.affectedChildIds.includes(child.id),
  ).slice(0, 3);

  const latestAnnouncement = PARENT_ANNOUNCEMENTS[0]!;
  const messageStats = {
    unread: PARENT_THREADS.filter((t) => t.unread && t.childId === child.id).length,
    needReply: PARENT_THREADS.filter((t) => t.needsReply && t.childId === child.id).length,
  };

  const now = new Date();
  const weekday = now.toLocaleDateString('en-ZW', { weekday: 'long' });
  const dateLabel = now.toLocaleDateString('en-ZW', { day: 'numeric', month: 'long' });

  const trendBadge =
    child.termAverageTrend === 'up' ? (
      <span className="inline-flex items-center gap-1 text-small font-semibold text-success">
        <TrendingUp className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
        +{Math.abs(child.deltaFromLastTerm)} pts
      </span>
    ) : child.termAverageTrend === 'down' ? (
      <span className="inline-flex items-center gap-1 text-small font-semibold text-danger">
        <TrendingDown className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
        −{Math.abs(child.deltaFromLastTerm)} pts
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-small font-semibold text-muted">flat</span>
    );

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
            placeholder={`Search ${child.firstName}'s marks, assignments, fees…`}
            className="h-11 w-full rounded-full border border-line bg-card pl-10 pr-4 text-small text-ink placeholder-muted/80 transition-colors focus:border-brand-primary focus:outline-none focus:ring-4 focus:ring-brand-primary/10"
          />
        </div>
      </div>

      {/* Hero greeting + headline stat */}
      <section className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="flex items-center gap-2">
            <ChildColourDot tone={child.colourTone} />
            <span className="text-micro font-semibold uppercase tracking-[0.12em] text-brand-primary">
              Viewing {child.firstName}
            </span>
          </div>
          <p className="mt-2 text-small text-muted">
            {greeting}, {ME_PARENT.displayName}.
          </p>
          <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-ink">
            {child.firstName}&rsquo;s term, at a glance.
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-small text-muted">
            <span>{weekday}, {dateLabel}</span>
            <span className="h-1 w-1 rounded-full bg-line" aria-hidden />
            <span>{child.form}</span>
            <span className="h-1 w-1 rounded-full bg-line" aria-hidden />
            <span>{child.house} House</span>
            <span className="h-1 w-1 rounded-full bg-line" aria-hidden />
            <span>Form teacher {child.formTeacher}</span>
          </p>
        </div>

        <div className="rounded-lg border border-line bg-card p-4 shadow-card-sm">
          <div className="flex items-center justify-between">
            <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
              Term average
            </p>
            <ProgressRing
              value={child.termAveragePercent}
              size={44}
              stroke={5}
              tone={
                child.termAveragePercent >= 80
                  ? 'success'
                  : child.termAveragePercent >= 60
                  ? 'brand'
                  : 'warning'
              }
            />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-[2rem] font-bold leading-none tabular-nums text-ink">
              {child.termAveragePercent}%
            </span>
            {trendBadge}
          </div>
          <p className="mt-1 text-micro text-muted">
            Position {child.classPosition} of {child.classSize} · {context}
          </p>
        </div>
      </section>

      {/* Alert band */}
      {attention.length > 0 ? (
        <AlertBand
          tone="warning"
          icon={<AlertTriangle className="h-5 w-5" strokeWidth={1.75} />}
          title={`${attention.length} ${attention.length === 1 ? 'item' : 'items'} need your attention`}
          body="Acknowledgements, permission slips and replies waiting for you."
          actionLabel="Review now"
          actionHref="#attention"
        />
      ) : (
        <AlertBand
          tone="success"
          icon={<CheckCircle2 className="h-5 w-5" strokeWidth={1.75} />}
          title="Nothing pending from you this evening."
          body={`${child.firstName} is present and on track. Enjoy the quiet.`}
          actionLabel="Open progress"
          actionHref="/parent/progress"
        />
      )}

      {/* Snapshot stats */}
      <section>
        <h2 className="mb-4 text-h3 text-ink">{child.firstName}&rsquo;s snapshot</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SnapshotTile
            label="Average"
            value={`${child.termAveragePercent}%`}
            sub={`${child.deltaFromLastTerm >= 0 ? '+' : ''}${child.deltaFromLastTerm} pts vs last term`}
            icon={<GraduationCap className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
            tone="brand"
          />
          <SnapshotTile
            label="Attendance"
            value={`${child.attendancePercent}%`}
            sub="Stable · this term"
            icon={<CheckCircle2 className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
            tone="success"
          />
          <SnapshotTile
            label="Class position"
            value={`${child.classPosition}`}
            sub={`of ${child.classSize} in ${child.form}`}
            icon={<TrendingUp className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
            tone="info"
          />
          <SnapshotTile
            label="Messages"
            value={`${messageStats.unread}`}
            sub={`${messageStats.unread} unread · ${messageStats.needReply} await reply`}
            icon={<MessageSquare className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
            tone="gold"
          />
        </div>
      </section>

      {/* Subject grid */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-h3 text-ink">Subjects this term</h2>
          <Link
            href="/parent/progress"
            className="inline-flex items-center gap-1 text-small font-semibold text-brand-primary hover:text-brand-primary/80"
          >
            View progress
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
          </Link>
        </div>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {childSubjects.slice(0, 8).map((s) => {
            const tone: 'success' | 'brand' | 'warning' | 'danger' =
              s.percent >= 80 ? 'success' : s.percent >= 60 ? 'brand' : s.percent >= 50 ? 'warning' : 'danger';
            const gradeBadge: 'success' | 'info' | 'warning' | 'danger' =
              s.grade === 'A' ? 'success' : s.grade === 'B' ? 'info' : s.grade === 'C' ? 'warning' : 'danger';
            return (
              <li key={s.subjectCode}>
                <div className="hover-lift group flex h-full flex-col gap-4 rounded-lg border border-line bg-card p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-2.5 py-0.5 text-micro font-semibold text-brand-primary">
                      <BookOpen className="h-3 w-3" strokeWidth={2} aria-hidden />
                      {s.subjectCode}
                    </div>
                    <ProgressRing value={s.percent} tone={tone} size={52} stroke={5} />
                  </div>
                  <div>
                    <p className="text-small font-semibold text-ink">{s.subjectName}</p>
                    <p className="mt-0.5 text-micro text-muted">
                      {s.teacher} · class avg {s.classAverage}%
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-line pt-3">
                    <Badge tone={gradeBadge}>Grade {s.grade}</Badge>
                    <span className="inline-flex items-center gap-1 text-micro text-muted">
                      {s.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3 text-success" strokeWidth={2} aria-hidden />
                      ) : s.trend === 'down' ? (
                        <TrendingDown className="h-3 w-3 text-danger" strokeWidth={2} aria-hidden />
                      ) : null}
                      this term
                    </span>
                  </div>
                </div>
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
            icon={<MessageSquare className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
            label="Messages"
            sub={`${messageStats.unread} unread · ${messageStats.needReply} to reply`}
            href="/parent/messages"
            tone="brand"
          />
          <QuickTile
            icon={<CreditCard className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
            label="Fees"
            sub="Pay or upload a slip"
            href="/parent/fees"
            tone="gold"
          />
          <QuickTile
            icon={<CalendarCheck className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
            label="Book a meeting"
            sub="Parent-teacher slots"
            href="/parent/meetings"
            tone="info"
          />
          <QuickTile
            icon={<FileText className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
            label="Reports"
            sub="Termly report cards"
            href="/parent/reports"
            tone="success"
          />
        </ul>
      </section>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          {/* Attention */}
          <Panel
            id="attention"
            title="Needs your attention"
            sub="Resolves as you complete items"
          >
            {attention.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-success" strokeWidth={1.5} aria-hidden />
                <p className="mt-2 text-small text-muted">All clear tonight.</p>
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {attention.map((a) => (
                  <li key={a.id}>
                    <Link
                      href={a.href}
                      className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface"
                    >
                      <span
                        className={[
                          'inline-flex h-10 w-10 flex-none items-center justify-center rounded-md',
                          a.tone === 'overdue'
                            ? 'bg-danger/10 text-danger'
                            : a.tone === 'warning'
                            ? 'bg-warning/10 text-warning'
                            : 'bg-info/10 text-info',
                        ].join(' ')}
                      >
                        <AlertTriangle className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-small font-semibold text-ink group-hover:text-brand-primary">
                          {a.label}
                        </p>
                        <p className="text-micro text-muted">{a.detail}</p>
                      </div>
                      <Badge
                        tone={
                          a.tone === 'overdue'
                            ? 'danger'
                            : a.tone === 'warning'
                            ? 'warning'
                            : 'info'
                        }
                        dot
                      >
                        {a.tone === 'overdue'
                          ? 'Overdue'
                          : a.tone === 'warning'
                          ? 'Action'
                          : 'FYI'}
                      </Badge>
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

          {/* Latest announcement */}
          <Panel
            title="From the school"
            sub="Most recent announcement"
            href="/parent/announcements"
            hrefLabel="All announcements"
          >
            <div className="px-5 py-4">
              <div className="flex items-center gap-2">
                {latestAnnouncement.category === 'Urgent' ? (
                  <Badge tone="danger">Urgent</Badge>
                ) : (
                  <Badge tone="brand">{latestAnnouncement.category}</Badge>
                )}
                <span className="text-micro text-muted">· {latestAnnouncement.ago}</span>
                <span className="text-micro text-muted">· {latestAnnouncement.author}</span>
              </div>
              <p className="mt-2 text-small font-semibold text-ink">{latestAnnouncement.title}</p>
              <p className="mt-1 line-clamp-2 text-small text-muted">{latestAnnouncement.body}</p>
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          {/* Today */}
          <Panel title="Today" sub={`${weekday}, ${dateLabel}`}>
            <div className="px-5 py-4">
              <Badge tone="success" dot>Present all day</Badge>
              <p className="mt-3 text-small text-ink">
                <strong className="font-semibold">{child.firstName}</strong> {context}.
              </p>
              {child.lastIncident ? (
                <div className="mt-4 rounded-md bg-success/5 px-3 py-2">
                  <p className="text-micro font-semibold uppercase tracking-[0.1em] text-success">
                    Note from teacher
                  </p>
                  <p className="mt-1 text-small text-ink">{child.lastIncident}</p>
                </div>
              ) : null}
            </div>
          </Panel>

          {/* Coming up */}
          <Panel title="Coming up" sub={`${upcomingEvents.length} events`} href="/parent/calendar" hrefLabel="Full calendar">
            {upcomingEvents.length === 0 ? (
              <p className="px-5 py-6 text-small text-muted">Nothing on the near calendar.</p>
            ) : (
              <ul className="divide-y divide-line">
                {upcomingEvents.map((e) => (
                  <li key={e.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="w-12 flex-none text-center">
                      <p className="text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                        {new Date(e.date).toLocaleDateString('en-ZW', { month: 'short' })}
                      </p>
                      <p className="text-h3 tabular-nums text-ink">
                        {new Date(e.date).getDate()}
                      </p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-small font-semibold text-ink">{e.title}</p>
                      <p className="text-micro text-muted">
                        {e.time ? `${e.time} · ` : ''}
                        {e.location ?? 'Harare Heritage Academy'}
                      </p>
                    </div>
                    {e.requiresPermission && !e.permissionGranted ? (
                      <Badge tone="warning" dot>
                        Permission
                      </Badge>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {/* Privacy note */}
          <div className="rounded-lg border border-line bg-surface px-4 py-3">
            <p className="flex items-start gap-2 text-micro text-muted">
              <ShieldAlert className="mt-0.5 h-3.5 w-3.5 flex-none text-muted" strokeWidth={1.75} aria-hidden />
              You see only your own child&rsquo;s information. No other student&rsquo;s data is visible to you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  All-children view                                                  */
/* ------------------------------------------------------------------ */

function AllChildrenView({ onOpen }: { onOpen: (id: string) => void }) {
  const greeting = greetingFor();
  const rows = [...PARENT_CHILDREN].sort((a, b) => {
    const aAttn = a.attentionItems > 0 ? 1 : 0;
    const bAttn = b.attentionItems > 0 ? 1 : 0;
    if (bAttn - aAttn !== 0) return bAttn - aAttn;
    return a.firstName.localeCompare(b.firstName);
  });

  const totalAttention = PARENT_CHILDREN.reduce((s, c) => s + c.attentionItems, 0);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_280px]">
        <div>
          <p className="text-small text-muted">{greeting}, {ME_PARENT.displayName}.</p>
          <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-ink">
            The family, at a glance.
          </h1>
          <p className="mt-2 text-small text-muted">
            {PARENT_CHILDREN.length} children at HHA · click a card to open their portal.
          </p>
        </div>
        <div className="rounded-lg border border-line bg-card p-4 shadow-card-sm">
          <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
            Total attention items
          </p>
          <p className="mt-1 text-[2rem] font-bold leading-none tabular-nums text-ink">
            {totalAttention}
          </p>
          <p className="mt-2 text-micro text-muted">
            across {PARENT_CHILDREN.filter((c) => c.attentionItems > 0).length} children
          </p>
        </div>
      </section>

      {totalAttention > 0 ? (
        <AlertBand
          tone="warning"
          icon={<AlertTriangle className="h-5 w-5" strokeWidth={1.75} />}
          title={`${totalAttention} ${totalAttention === 1 ? 'item needs' : 'items need'} your attention`}
          body="Open a child's card to see what's waiting."
          actionLabel="Start with the first one"
          actionHref="#children"
        />
      ) : (
        <AlertBand
          tone="success"
          icon={<CheckCircle2 className="h-5 w-5" strokeWidth={1.75} />}
          title="Every child is settled."
          body="Attendance normal, marks holding, no alerts from any teacher."
          actionLabel="Open family calendar"
          actionHref="/parent/calendar"
        />
      )}

      {/* Children grid */}
      <section id="children">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-h3 text-ink">Your children</h2>
          <span className="text-small text-muted">{PARENT_CHILDREN.length} linked</span>
        </div>
        <ul className="stagger-children grid grid-cols-1 gap-4 md:grid-cols-2">
          {rows.map((c) => {
            const ringTone: 'success' | 'brand' | 'warning' | 'danger' =
              c.termAveragePercent >= 80
                ? 'success'
                : c.termAveragePercent >= 60
                ? 'brand'
                : c.termAveragePercent >= 50
                ? 'warning'
                : 'danger';
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => onOpen(c.id)}
                  className="hover-lift group flex h-full w-full flex-col gap-4 rounded-lg border border-line bg-card p-5 text-left"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-2.5 py-0.5 text-micro font-semibold text-brand-primary">
                        <Home className="h-3 w-3" strokeWidth={2} aria-hidden />
                        {c.form}
                      </div>
                      <p className="mt-3 text-h2 text-ink group-hover:text-brand-primary">
                        {c.firstName} {c.lastName}
                      </p>
                      <p className="mt-0.5 text-small text-muted">
                        {c.house} House · FT {c.formTeacher}
                      </p>
                    </div>
                    <ProgressRing
                      value={c.termAveragePercent}
                      size={64}
                      stroke={6}
                      tone={ringTone}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3 rounded-md border border-line bg-surface/60 p-3">
                    <MiniStat label="Average" value={`${c.termAveragePercent}%`} trend={c.termAverageTrend} delta={c.deltaFromLastTerm} />
                    <MiniStat label="Attendance" value={`${c.attendancePercent}%`} />
                    <MiniStat label="Position" value={`${c.classPosition}/${c.classSize}`} />
                  </div>

                  <div className="flex items-center justify-between">
                    {c.attentionItems > 0 ? (
                      <Badge tone="warning" dot>
                        {c.attentionItems} attention {c.attentionItems === 1 ? 'item' : 'items'}
                      </Badge>
                    ) : (
                      <Badge tone="success" dot>
                        All clear
                      </Badge>
                    )}
                    <span className="inline-flex items-center gap-1 text-small font-semibold text-brand-primary">
                      Open portal
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                        strokeWidth={2}
                        aria-hidden
                      />
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="mb-4 text-h3 text-ink">Family actions</h2>
        <ul className="stagger-children grid grid-cols-2 gap-3 sm:grid-cols-4">
          <QuickTile
            icon={<CreditCard className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
            label="Family fees"
            sub="Combined totals"
            href="/parent/fees"
            tone="gold"
          />
          <QuickTile
            icon={<Calendar className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
            label="Merged calendar"
            sub="All children's events"
            href="/parent/calendar"
            tone="info"
          />
          <QuickTile
            icon={<FileText className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
            label="Term reports"
            sub="Per-child PDFs"
            href="/parent/reports"
            tone="success"
          />
          <QuickTile
            icon={<MessageSquare className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
            label="Messages"
            sub="All threads"
            href="/parent/messages"
            tone="brand"
          />
        </ul>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Local primitives                                                   */
/* ------------------------------------------------------------------ */

function ChildColourDot({ tone }: { tone: ParentChild['colourTone'] }) {
  const bg = {
    terracotta: 'bg-brand-primary',
    ochre: 'bg-brand-accent',
    earth: 'bg-info',
    sage: 'bg-success',
  }[tone];
  return <span aria-hidden className={`inline-block h-2 w-2 rounded-full ${bg}`} />;
}

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

function MiniStat({
  label,
  value,
  trend,
  delta,
}: {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'flat';
  delta?: number;
}) {
  return (
    <div>
      <p className="text-micro font-semibold uppercase tracking-[0.1em] text-muted">{label}</p>
      <p className="mt-0.5 flex items-center gap-1 text-small font-semibold tabular-nums text-ink">
        {value}
        {trend === 'up' ? (
          <TrendingUp className="h-3 w-3 text-success" strokeWidth={2} aria-hidden />
        ) : trend === 'down' ? (
          <TrendingDown className="h-3 w-3 text-danger" strokeWidth={2} aria-hidden />
        ) : null}
      </p>
      {delta !== undefined ? (
        <p className="text-micro text-muted">
          {delta >= 0 ? `+${delta}` : delta} pts
        </p>
      ) : null}
    </div>
  );
}
