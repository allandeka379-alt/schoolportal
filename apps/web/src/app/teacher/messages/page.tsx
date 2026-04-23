'use client';

import { useMemo, useState } from 'react';
import { Paperclip, Plus, Search, Send, Sparkles, TriangleAlert } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { EditorialAvatar, TrendArrow } from '@/components/student/primitives';
import { TEACHER_THREADS, type MessageTab } from '@/lib/mock/teacher-extras';

const PARENT_CONVERSATION = [
  {
    from: 'them',
    body: "Good afternoon, Mrs Dziva. I noticed Tapiwa's maths marks have dropped this term. I'm concerned.",
    at: 'Yesterday 17:22',
  },
  {
    from: 'me',
    body: "Thank you for getting in touch, Mr Ndlovu. Tapiwa has the ability — what's changed is consistency with his working. We can arrange a short weekly check-in if that would help.",
    at: 'Yesterday 18:10',
  },
  { from: 'them', body: 'That would be appreciated. What time suits you?', at: 'Yesterday 18:14' },
  {
    from: 'me',
    body: "I'm free Thursdays at 15:30 — I can keep him back for 20 minutes. I'll also attach this week's working examples so you can see what \"good enough\" looks like.",
    at: 'Yesterday 18:30',
  },
  { from: 'them', body: "Thank you — we'll work with him this weekend.", at: '10 min ago' },
] as const;

/**
 * Teacher messages — card-dense redesign.
 *
 * Three tabs: Parents (priority), Students (moderated), Staff.
 * Parent threads show a persistent student context card.
 */
export default function TeacherMessagesPage() {
  const [tab, setTab] = useState<MessageTab>('parents');
  const threads = useMemo(() => TEACHER_THREADS.filter((t) => t.tab === tab), [tab]);
  const [activeId, setActiveId] = useState(threads[0]?.id ?? '');
  const active = threads.find((t) => t.id === activeId) ?? threads[0];

  const unreadByTab: Record<MessageTab, number> = {
    parents: TEACHER_THREADS.filter((t) => t.tab === 'parents' && t.unread > 0).length,
    students: TEACHER_THREADS.filter((t) => t.tab === 'students' && t.unread > 0).length,
    staff: TEACHER_THREADS.filter((t) => t.tab === 'staff' && t.unread > 0).length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-small text-muted">Messages</p>
          <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-ink">
            Parents first, always
          </h1>
          <p className="mt-2 text-small text-muted">
            Moderated · logged · school-hours policy applied to student messages.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-primary px-5 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md"
        >
          <Plus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          New message
        </button>
      </header>

      {/* KPI tiles */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <KpiTile
          label="Parents unread"
          value={String(unreadByTab.parents)}
          sub="Priority inbox"
          tone={unreadByTab.parents > 0 ? 'warning' : 'success'}
        />
        <KpiTile
          label="Students unread"
          value={String(unreadByTab.students)}
          sub="Moderated"
          tone={unreadByTab.students > 0 ? 'brand' : undefined}
        />
        <KpiTile label="Staff unread" value={String(unreadByTab.staff)} sub="Standard" />
      </ul>

      {/* Tabs */}
      <nav
        aria-label="Inbox tabs"
        className="inline-flex gap-1 rounded-full bg-surface p-1"
      >
        {(
          [
            { key: 'parents' as const, label: 'Parents', hint: 'Priority' },
            { key: 'students' as const, label: 'Students', hint: 'Moderated' },
            { key: 'staff' as const, label: 'Staff', hint: 'Standard' },
          ]
        ).map((t) => {
          const activeTab = t.key === tab;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => {
                setTab(t.key);
                const first = TEACHER_THREADS.find((x) => x.tab === t.key);
                if (first) setActiveId(first.id);
              }}
              className={[
                'inline-flex h-10 items-center gap-2 rounded-full px-4 text-small font-semibold transition-colors',
                activeTab ? 'bg-card text-ink shadow-card-sm' : 'text-muted hover:text-ink',
              ].join(' ')}
            >
              {t.label}
              {unreadByTab[t.key] > 0 ? (
                <span
                  className={[
                    'rounded-full px-1.5 py-0.5 text-micro tabular-nums',
                    activeTab ? 'bg-brand-primary/10 text-brand-primary' : 'bg-card/60 text-muted',
                  ].join(' ')}
                >
                  {unreadByTab[t.key]}
                </span>
              ) : null}
              <span className="hidden text-micro font-normal text-muted sm:inline">· {t.hint}</span>
            </button>
          );
        })}
      </nav>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Threads list */}
        <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm lg:col-span-5">
          <div className="border-b border-line p-3">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                strokeWidth={1.75}
                aria-hidden
              />
              <input
                type="search"
                placeholder={tab === 'parents' ? 'Search parents or children…' : 'Search threads…'}
                className="h-10 w-full rounded-md border border-line bg-surface/40 pl-9 pr-3 text-small text-ink placeholder:text-muted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              />
            </div>
          </div>
          <ul className="divide-y divide-line">
            {threads.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(t.id)}
                  className={[
                    'flex w-full items-start gap-3 px-5 py-4 text-left transition-colors',
                    t.id === active?.id ? 'bg-brand-primary/[0.06]' : 'hover:bg-surface/60',
                  ].join(' ')}
                >
                  <EditorialAvatar
                    name={t.with}
                    size="md"
                    tone={tab === 'parents' ? 'terracotta' : tab === 'staff' ? 'ink' : 'sand'}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p
                        className={[
                          'truncate text-small',
                          t.unread > 0 ? 'font-semibold text-ink' : 'font-medium text-muted',
                        ].join(' ')}
                      >
                        {t.with}
                      </p>
                      <span className="ml-auto flex-none text-micro text-muted">{t.lastAgo}</span>
                    </div>
                    <p className="text-micro text-muted">{t.withRole}</p>
                    <p className="mt-1 truncate text-small text-ink">{t.subject}</p>
                    <p className="mt-0.5 truncate text-small text-muted">{t.lastSnippet}</p>
                  </div>
                  {t.unread > 0 ? (
                    <Badge tone="brand" dot>
                      {t.unread}
                    </Badge>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Conversation */}
        {active ? (
          <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm lg:col-span-7">
            {active.tab === 'parents' && active.childStudentName ? (
              <div className="border-b border-line bg-surface/40 p-5">
                <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
                  Student context
                </p>
                <div className="mt-2 flex flex-wrap items-start gap-4">
                  <div className="flex items-center gap-3">
                    <EditorialAvatar name={active.childStudentName} size="md" />
                    <div>
                      <p className="text-small font-semibold text-ink">
                        {active.childStudentName}
                      </p>
                      <p className="text-micro text-muted">{active.childForm}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-micro">
                    <span className="inline-flex items-center gap-1 text-muted">
                      Average{' '}
                      <span className="font-semibold tabular-nums text-ink">
                        {active.childAvg}%
                      </span>
                      {active.childAvgTrend ? (
                        <TrendArrow direction={active.childAvgTrend} className="ml-1" />
                      ) : null}
                    </span>
                    <span className="text-line">·</span>
                    <span className="text-muted">
                      Attendance{' '}
                      <span className="font-semibold tabular-nums text-ink">
                        {active.childAttendance}%
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <div className="flex items-center gap-3">
                <EditorialAvatar
                  name={active.with}
                  size="md"
                  tone={tab === 'parents' ? 'terracotta' : 'sand'}
                />
                <div>
                  <p className="text-small font-semibold text-ink">{active.with}</p>
                  <p className="text-micro text-muted">{active.withRole}</p>
                </div>
              </div>
              <p className="text-micro text-muted">{active.subject}</p>
            </div>

            <div className="flex min-h-[360px] flex-col gap-3 bg-surface/30 p-6">
              {(tab === 'parents' ? PARENT_CONVERSATION : []).map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={[
                      'max-w-[70%] rounded-lg px-4 py-2.5 text-small leading-snug shadow-card-sm',
                      m.from === 'me'
                        ? 'bg-brand-primary text-white'
                        : 'border border-line bg-card text-ink',
                    ].join(' ')}
                  >
                    {m.body}
                    <p
                      className={[
                        'mt-1 text-micro',
                        m.from === 'me' ? 'text-white/80' : 'text-muted',
                      ].join(' ')}
                    >
                      {m.at}
                    </p>
                  </div>
                </div>
              ))}
              {tab !== 'parents' ? (
                <div className="rounded-lg border border-line bg-card p-8 text-center">
                  <p className="text-small text-muted">
                    Open a thread from the list to view the conversation.
                  </p>
                </div>
              ) : null}
            </div>

            <div className="border-t border-line bg-card p-4">
              <div className="mb-2 flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex h-7 items-center rounded-full border border-line bg-card px-3 text-micro font-semibold text-ink transition-colors hover:bg-surface"
                >
                  Request meeting
                </button>
                <button
                  type="button"
                  className="inline-flex h-7 items-center rounded-full border border-line bg-card px-3 text-micro font-semibold text-ink transition-colors hover:bg-surface"
                >
                  Positive feedback
                </button>
                <button
                  type="button"
                  className="inline-flex h-7 items-center rounded-full border border-line bg-card px-3 text-micro font-semibold text-ink transition-colors hover:bg-surface"
                >
                  Concern about submission
                </button>
                <span className="ml-auto inline-flex items-center gap-1 text-micro text-muted">
                  <Sparkles
                    className="h-3 w-3 text-brand-primary"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  Tone-aware
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Attach"
                  className="rounded-full p-2 text-muted transition-colors hover:bg-surface hover:text-ink"
                >
                  <Paperclip className="h-4 w-4" strokeWidth={1.75} />
                </button>
                <input
                  type="text"
                  placeholder={
                    tab === 'staff'
                      ? 'Write a staff message…'
                      : 'Write a message — translated to parent preferred language'
                  }
                  className="h-11 flex-1 rounded-full border border-line bg-surface/40 px-4 text-small text-ink placeholder:text-muted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                />
                <button
                  type="submit"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-primary px-5 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md"
                >
                  Send
                  <Send className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </button>
              </div>
              {tab === 'students' ? (
                <p className="mt-3 inline-flex items-center gap-1.5 text-micro text-muted">
                  <TriangleAlert className="h-3 w-3 text-warning" strokeWidth={1.75} aria-hidden />
                  Student replies queue outside school hours (07:00–20:00).
                </p>
              ) : null}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

function KpiTile({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: 'brand' | 'success' | 'warning';
}) {
  const valueColor =
    tone === 'warning' ? 'text-warning' : tone === 'success' ? 'text-success' : tone === 'brand' ? 'text-brand-primary' : 'text-ink';
  return (
    <li className="rounded-lg border border-line bg-card p-5 shadow-card-sm">
      <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className={`mt-2 text-h2 tabular-nums ${valueColor}`}>{value}</p>
      {sub ? <p className="mt-1 text-micro text-muted">{sub}</p> : null}
    </li>
  );
}
