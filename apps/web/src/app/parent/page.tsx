'use client';

import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  FileText,
  Megaphone,
  MessageSquare,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

import { EditorialAvatar, EditorialCard, SectionEyebrow, TrendArrow } from '@/components/student/primitives';
import { ChildColourDot, ParentPageHeader, ParentStatusPill } from '@/components/parent/primitives';
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
} from '@/lib/mock/parent-extras';

/**
 * Parent dashboard — §05 of the spec.
 *
 * Answers the four questions:
 *   1. How was today?
 *   2. What needs me?
 *   3. What is coming?
 *   4. What has the school said?
 *
 * When "All children" is selected in the switcher, renders the aggregate view.
 */
export default function ParentDashboard() {
  const { selectedChild, allSelected, setSelectedId, setAllSelected } = useSelectedChild();

  if (allSelected) {
    return <AllChildrenView onOpen={(id) => {
      setAllSelected(false);
      setSelectedId(id);
    }} />;
  }

  const child = selectedChild;
  const greeting = greetingFor();
  const context = todayContext(child.id);
  const childSubjects = gradesFor(child.id);
  const newMarksToday = childSubjects.filter((s) => s.hasNewMark);
  const attention = attentionFor(child.id);

  const upcomingEvents = PARENT_EVENTS.filter(
    (e) => new Date(e.date).getTime() >= Date.now() - 86400000 && e.affectedChildIds.includes(child.id),
  ).slice(0, 3);

  const latestAnnouncement = PARENT_ANNOUNCEMENTS[0]!;

  const messageStats = {
    unread: PARENT_THREADS.filter((t) => t.unread && t.childId === child.id).length,
    needReply: PARENT_THREADS.filter((t) => t.needsReply && t.childId === child.id).length,
  };

  const now = new Date();
  const weekday = now.toLocaleDateString('en-ZW', { weekday: 'long' });
  const dateLabel = now.toLocaleDateString('en-ZW', { day: 'numeric', month: 'long' });

  return (
    <div className="space-y-8">
      {/* Zone 1 — Greeting */}
      <section className="rounded border border-sand bg-sand-light px-6 py-8 md:px-10 md:py-10">
        <div className="flex items-center gap-2">
          <ChildColourDot tone={child.colourTone} />
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-earth">
            Viewing {child.firstName}
          </p>
        </div>
        <h1 className="mt-3 font-display text-[clamp(2rem,4vw,2.75rem)] leading-tight text-ink">
          {greeting}, {ME_PARENT.displayName}
          <span className="text-terracotta">.</span>
        </h1>
        <p className="mt-3 font-serif text-body-lg text-stone">
          {weekday}, {dateLabel} · {child.firstName} {context}
        </p>
      </section>

      {/* Zone 2 — Needs your attention */}
      <EditorialCard className="overflow-hidden border-t-[3px] border-t-terracotta">
        <div className="flex items-center justify-between border-b border-sand px-6 py-4">
          <SectionEyebrow>Needs your attention</SectionEyebrow>
          <span className="font-sans text-[12px] text-stone">
            Resolves as you complete items
          </span>
        </div>
        {attention.length === 0 ? (
          <p className="px-6 py-10 text-center font-serif text-[15px] text-stone">
            All clear. Nothing pending from you this evening.
          </p>
        ) : (
          <ul className="divide-y divide-sand-light">
            {attention.map((a) => (
              <li key={a.id}>
                <Link
                  href={a.href}
                  className="group flex items-start gap-3 px-6 py-4 hover:bg-sand-light/40"
                >
                  <span
                    aria-hidden
                    className={[
                      'mt-1.5 block h-2 w-2 flex-none rounded-full',
                      a.tone === 'overdue'
                        ? 'bg-danger'
                        : a.tone === 'warning'
                        ? 'bg-ochre'
                        : 'bg-earth/50',
                    ].join(' ')}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-[14px] font-medium text-ink group-hover:text-earth">
                      {a.label}
                    </p>
                    <p
                      className={[
                        'mt-0.5 font-sans text-[12px]',
                        a.tone === 'overdue'
                          ? 'text-danger'
                          : a.tone === 'warning'
                          ? 'text-ochre'
                          : 'text-stone',
                      ].join(' ')}
                    >
                      {a.detail}
                    </p>
                  </div>
                  <ChevronRight
                    className="h-4 w-4 flex-none text-stone transition-transform group-hover:translate-x-0.5 group-hover:text-terracotta"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </EditorialCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Zone 3 — Today */}
          <EditorialCard className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-sand px-6 py-4">
              <SectionEyebrow>Today</SectionEyebrow>
              <span className="inline-flex items-center gap-1.5 rounded-sm bg-[#E6F0E9] px-2 py-0.5 font-sans text-[11px] font-semibold text-ok">
                <CheckCircle2 className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                Present all day
              </span>
            </div>
            <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
              <div className="border-b border-sand-light px-6 py-5 md:border-b-0 md:border-r">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Marks returned today
                </p>
                {newMarksToday.length === 0 ? (
                  <p className="mt-3 font-serif text-[14px] text-stone">
                    No new marks today.
                  </p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {newMarksToday.slice(0, 2).map((m) => (
                      <li key={m.subjectCode} className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-sans text-[13px] font-medium text-ink">
                            {m.subjectName}
                          </p>
                          <p className="font-sans text-[11px] text-stone">{m.teacher}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-display text-[20px] tabular-nums text-ink">
                            {m.percent}%
                          </span>
                          <span className="ml-2 inline-flex items-center rounded-sm bg-[#EBE8F5] px-1.5 py-0.5 font-sans text-[10px] font-semibold text-[#4F3E99]">
                            {m.grade}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <Link
                  href="/parent/progress"
                  className="mt-4 inline-flex items-center gap-1 font-sans text-[12px] font-medium text-terracotta hover:underline underline-offset-4"
                >
                  View full progress
                  <ArrowRight className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                </Link>
              </div>
              <div className="px-6 py-5">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Notes from teachers
                </p>
                {child.lastIncident ? (
                  <p className="mt-3 flex items-start gap-2 font-serif text-[14px] text-ink">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-ok" aria-hidden />
                    {child.lastIncident}
                  </p>
                ) : (
                  <p className="mt-3 font-serif text-[14px] text-stone">
                    No notes today. That&rsquo;s usually a good thing.
                  </p>
                )}
              </div>
            </div>
          </EditorialCard>

          {/* Zone 4 — Term snapshot */}
          <EditorialCard className="overflow-hidden">
            <div className="border-b border-sand px-6 py-4">
              <SectionEyebrow>Term snapshot</SectionEyebrow>
              <p className="mt-1 font-sans text-[13px] text-stone">
                {child.firstName}&rsquo;s term average is{' '}
                <strong className="text-ink">
                  {child.deltaFromLastTerm >= 0 ? 'up' : 'down'}{' '}
                  {Math.abs(child.deltaFromLastTerm)} points
                </strong>{' '}
                from last term.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-0">
              <Stat
                label="Average"
                value={`${child.termAveragePercent}%`}
                sub={
                  <span
                    className={[
                      'inline-flex items-center gap-1 font-sans text-[12px] font-medium',
                      child.termAverageTrend === 'up'
                        ? 'text-ok'
                        : child.termAverageTrend === 'down'
                        ? 'text-danger'
                        : 'text-stone',
                    ].join(' ')}
                  >
                    <TrendArrow direction={child.termAverageTrend} />
                    {child.deltaFromLastTerm > 0 ? `+${child.deltaFromLastTerm}` : child.deltaFromLastTerm} from Term 1
                  </span>
                }
              />
              <Stat
                label="Attendance"
                value={`${child.attendancePercent}%`}
                sub={<span className="font-sans text-[12px] text-stone">stable</span>}
              />
              <Stat
                label="Position"
                value={`${child.classPosition}`}
                sub={
                  <span className="font-sans text-[12px] text-stone">
                    of {child.classSize}
                  </span>
                }
              />
            </div>
            <div className="border-t border-sand-light bg-sand-light/30 px-6 py-3">
              <Link
                href="/parent/progress"
                className="inline-flex items-center gap-1 font-sans text-[13px] font-medium text-terracotta hover:underline underline-offset-4"
              >
                See every subject
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              </Link>
            </div>
          </EditorialCard>
        </div>

        {/* Secondary tiles */}
        <div className="space-y-6">
          <TileSection title="Coming up">
            {upcomingEvents.length === 0 ? (
              <p className="px-5 py-6 font-serif text-[14px] text-stone">Nothing in the near calendar.</p>
            ) : (
              <ul className="divide-y divide-sand-light">
                {upcomingEvents.map((e) => (
                  <li key={e.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="w-14 flex-none text-center">
                      <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-stone">
                        {new Date(e.date).toLocaleDateString('en-ZW', { month: 'short' })}
                      </p>
                      <p className="font-display text-[18px] text-ink">
                        {new Date(e.date).getDate()}
                      </p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-sans text-[13px] font-medium text-ink">{e.title}</p>
                      <p className="font-sans text-[11px] text-stone">
                        {e.time ? `${e.time} · ` : ''}
                        {e.location ?? 'Harare Heritage Academy'}
                      </p>
                    </div>
                    {e.requiresPermission && !e.permissionGranted ? (
                      <ParentStatusPill state="action-required">Permission</ParentStatusPill>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </TileSection>

          <TileSection
            title="From the school"
            icon={<Megaphone className="h-4 w-4 text-earth" strokeWidth={1.5} aria-hidden />}
          >
            <div className="px-5 py-4">
              {latestAnnouncement.category === 'Urgent' ? (
                <span className="inline-flex items-center rounded-sm bg-terracotta px-1.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-cream">
                  URGENT
                </span>
              ) : (
                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-earth">
                  {latestAnnouncement.category} · {latestAnnouncement.ago}
                </span>
              )}
              <p className="mt-2 font-display text-[16px] text-ink">{latestAnnouncement.title}</p>
              <p className="mt-1 line-clamp-2 font-serif text-[13px] text-stone">
                {latestAnnouncement.body}
              </p>
              <Link
                href="/parent/announcements"
                className="mt-3 inline-flex items-center gap-1 font-sans text-[12px] font-medium text-terracotta hover:underline underline-offset-4"
              >
                All announcements
                <ArrowRight className="h-3 w-3" strokeWidth={1.5} aria-hidden />
              </Link>
            </div>
          </TileSection>

          <TileSection
            title="Messages"
            icon={<MessageSquare className="h-4 w-4 text-earth" strokeWidth={1.5} aria-hidden />}
          >
            <div className="px-5 py-4">
              <p className="font-display text-[28px] leading-none text-ink tabular-nums">
                {messageStats.unread}
              </p>
              <p className="mt-1 font-sans text-[13px] text-stone">
                {messageStats.unread} unread · {messageStats.needReply} awaiting your reply
              </p>
              <Link
                href="/parent/messages"
                className="mt-3 inline-flex items-center gap-1 font-sans text-[12px] font-medium text-terracotta hover:underline underline-offset-4"
              >
                Open inbox
                <ArrowRight className="h-3 w-3" strokeWidth={1.5} aria-hidden />
              </Link>
            </div>
          </TileSection>
        </div>
      </div>

      <div className="rounded border border-sand bg-sand-light/60 px-5 py-3 flex items-center gap-3">
        <ShieldAlert className="h-4 w-4 flex-none text-stone" strokeWidth={1.5} aria-hidden />
        <p className="font-sans text-[12px] text-stone">
          You see only your own child&rsquo;s information. No other student&rsquo;s data is visible
          to you — this is not configurable.
        </p>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: React.ReactNode;
}) {
  return (
    <div className="border-r border-sand-light px-6 py-5 last:border-r-0">
      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
        {label}
      </p>
      <p className="mt-1 font-display text-[30px] leading-none text-ink tabular-nums">{value}</p>
      {sub ? <p className="mt-2">{sub}</p> : null}
    </div>
  );
}

function TileSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <EditorialCard className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-sand px-5 py-3">
        <SectionEyebrow>{title}</SectionEyebrow>
        {icon}
      </div>
      {children}
    </EditorialCard>
  );
}

function AllChildrenView({ onOpen }: { onOpen: (id: string) => void }) {
  const greeting = greetingFor();

  // Sort: attention items first, then alphabetically by first name.
  const rows = [...PARENT_CHILDREN].sort((a, b) => {
    if ((b.attentionItems > 0 ? 1 : 0) - (a.attentionItems > 0 ? 1 : 0) !== 0) {
      return (b.attentionItems > 0 ? 1 : 0) - (a.attentionItems > 0 ? 1 : 0);
    }
    return a.firstName.localeCompare(b.firstName);
  });

  return (
    <div className="space-y-8">
      <ParentPageHeader
        eyebrow="All children"
        title="The family,"
        accent="at a glance."
        subtitle={`${PARENT_CHILDREN.length} children at HHA · ${greeting}, ${ME_PARENT.displayName}.`}
      />

      <EditorialCard className="overflow-hidden">
        <ul className="divide-y divide-sand-light">
          {rows.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onOpen(c.id)}
                className="group flex w-full items-center gap-4 px-6 py-5 text-left transition-colors hover:bg-sand-light/40"
              >
                <ChildColourDot tone={c.colourTone} />
                <EditorialAvatar
                  name={`${c.firstName} ${c.lastName}`}
                  size="lg"
                  tone={c.colourTone === 'earth' ? 'sand' : 'terracotta'}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-[20px] text-ink group-hover:text-earth">
                    {c.firstName} {c.lastName}
                  </p>
                  <p className="font-sans text-[12px] text-stone">
                    {c.form} · {c.house} House · form teacher {c.formTeacher}
                  </p>
                </div>
                <dl className="hidden items-center gap-6 md:flex">
                  <div className="text-right">
                    <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                      Avg
                    </dt>
                    <dd className="mt-0.5 flex items-center gap-1 font-display text-[18px] text-ink tabular-nums">
                      {c.termAveragePercent}%
                      {c.termAverageTrend === 'up' ? (
                        <TrendingUp className="h-3.5 w-3.5 text-ok" strokeWidth={1.5} />
                      ) : c.termAverageTrend === 'down' ? (
                        <TrendingDown className="h-3.5 w-3.5 text-danger" strokeWidth={1.5} />
                      ) : null}
                    </dd>
                  </div>
                  <div className="text-right">
                    <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                      Attendance
                    </dt>
                    <dd className="mt-0.5 font-display text-[18px] text-ink tabular-nums">
                      {c.attendancePercent}%
                    </dd>
                  </div>
                </dl>
                <div className="w-36 text-right">
                  {c.attentionItems > 0 ? (
                    <ParentStatusPill state="action-required">
                      {c.attentionItems} attention {c.attentionItems === 1 ? 'item' : 'items'}
                    </ParentStatusPill>
                  ) : (
                    <ParentStatusPill state="acknowledged">All clear</ParentStatusPill>
                  )}
                </div>
                <ChevronRight
                  className="h-5 w-5 flex-none text-stone transition-transform group-hover:translate-x-1 group-hover:text-terracotta"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </button>
            </li>
          ))}
        </ul>
      </EditorialCard>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link
          href="/parent/fees"
          className="group flex items-center justify-between rounded border border-sand bg-white p-5 transition-all hover:-translate-y-px hover:shadow-e2"
        >
          <div>
            <SectionEyebrow>Family fees</SectionEyebrow>
            <p className="mt-1 font-sans text-[12px] text-stone">View combined totals</p>
          </div>
          <ArrowRight className="h-4 w-4 text-terracotta" strokeWidth={1.5} aria-hidden />
        </Link>
        <Link
          href="/parent/calendar"
          className="group flex items-center justify-between rounded border border-sand bg-white p-5 transition-all hover:-translate-y-px hover:shadow-e2"
        >
          <div>
            <SectionEyebrow>Merged calendar</SectionEyebrow>
            <p className="mt-1 font-sans text-[12px] text-stone">All children&rsquo;s events</p>
          </div>
          <CalendarDays className="h-4 w-4 text-terracotta" strokeWidth={1.5} aria-hidden />
        </Link>
        <Link
          href="/parent/reports"
          className="group flex items-center justify-between rounded border border-sand bg-white p-5 transition-all hover:-translate-y-px hover:shadow-e2"
        >
          <div>
            <SectionEyebrow>Term reports</SectionEyebrow>
            <p className="mt-1 font-sans text-[12px] text-stone">Per-child PDFs</p>
          </div>
          <FileText className="h-4 w-4 text-terracotta" strokeWidth={1.5} aria-hidden />
        </Link>
      </div>
    </div>
  );
}
