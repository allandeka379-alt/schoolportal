'use client';

import { useMemo, useState } from 'react';
import { Paperclip, Search, Send, Sparkles, TriangleAlert } from 'lucide-react';

import { EditorialAvatar, EditorialCard, SectionEyebrow, TrendArrow } from '@/components/student/primitives';
import { TeacherPageHeader } from '@/components/teacher/primitives';
import { TEACHER_THREADS, type MessageTab, type TeacherThread } from '@/lib/mock/teacher-extras';

const PARENT_CONVERSATION = [
  { from: 'them', body: 'Good afternoon, Mrs Dziva. I noticed Tapiwa\'s maths marks have dropped this term. I\'m concerned.', at: 'Yesterday 17:22' },
  { from: 'me',   body: 'Thank you for getting in touch, Mr Ndlovu. Tapiwa has the ability — what\'s changed is consistency with his working. We can arrange a short weekly check-in if that would help.', at: 'Yesterday 18:10' },
  { from: 'them', body: 'That would be appreciated. What time suits you?', at: 'Yesterday 18:14' },
  { from: 'me',   body: 'I\'m free Thursdays at 15:30 — I can keep him back for 20 minutes. I\'ll also attach this week\'s working examples so you can see what "good enough" looks like.', at: 'Yesterday 18:30' },
  { from: 'them', body: 'Thank you — we\'ll work with him this weekend.', at: '10 min ago' },
] as const;

/**
 * Teacher messages — §13.
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
    <div className="space-y-6">
      <TeacherPageHeader
        eyebrow="Messages"
        title="Parents first,"
        accent="always."
        subtitle="Moderated · logged · school-hours policy applied to student messages."
      />

      {/* Tabs */}
      <nav aria-label="Inbox tabs" className="flex flex-wrap gap-2">
        {(
          [
            { key: 'parents' as const, label: 'Parents', hint: 'Priority inbox' },
            { key: 'students' as const, label: 'Students', hint: 'Moderated' },
            { key: 'staff' as const, label: 'Staff', hint: 'Standard' },
          ]
        ).map((t) => {
          const active = t.key === tab;
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
                'inline-flex h-10 items-center gap-2 rounded-full px-4 font-sans text-[13px] font-medium transition-colors',
                active
                  ? 'bg-ink text-cream'
                  : 'border border-sand bg-white text-stone hover:bg-sand-light',
              ].join(' ')}
            >
              {t.label}
              {unreadByTab[t.key] > 0 ? (
                <span
                  className={[
                    'rounded-full px-1.5 font-sans text-[11px] font-semibold tabular-nums',
                    active ? 'bg-terracotta text-cream' : 'bg-terracotta/20 text-terracotta',
                  ].join(' ')}
                >
                  {unreadByTab[t.key]}
                </span>
              ) : null}
              <span className="hidden font-sans text-[11px] font-normal text-stone sm:inline">
                {t.hint}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Threads list */}
        <EditorialCard className="overflow-hidden lg:col-span-5">
          <div className="border-b border-sand p-3">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone"
                strokeWidth={1.5}
                aria-hidden
              />
              <input
                type="search"
                placeholder={
                  tab === 'parents' ? 'Search parents or children…' : 'Search threads…'
                }
                className="h-10 w-full rounded border border-sand bg-cream pl-9 pr-3 font-sans text-[13px] text-ink placeholder-stone focus:border-terracotta focus:outline-none"
              />
            </div>
          </div>
          <ul className="divide-y divide-sand-light">
            {threads.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(t.id)}
                  className={[
                    'flex w-full items-start gap-3 px-5 py-4 text-left transition-colors',
                    t.id === active?.id ? 'bg-sand-light/70' : 'hover:bg-sand-light/40',
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
                          'truncate font-sans text-[14px]',
                          t.unread > 0 ? 'font-semibold text-ink' : 'font-medium text-stone',
                        ].join(' ')}
                      >
                        {t.with}
                      </p>
                      <span className="ml-auto flex-none font-sans text-[11px] text-stone">
                        {t.lastAgo}
                      </span>
                    </div>
                    <p className="font-sans text-[12px] text-stone">{t.withRole}</p>
                    <p className="mt-1 truncate font-sans text-[13px] text-ink">{t.subject}</p>
                    <p className="mt-0.5 truncate font-serif text-[13px] text-stone">
                      {t.lastSnippet}
                    </p>
                  </div>
                  {t.unread > 0 ? (
                    <span className="flex-none rounded-full bg-terracotta px-1.5 text-[11px] font-semibold text-cream">
                      {t.unread}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </EditorialCard>

        {/* Conversation */}
        {active ? (
          <EditorialCard className="overflow-hidden lg:col-span-7">
            {/* Student context card — only for parent threads */}
            {active.tab === 'parents' && active.childStudentName ? (
              <div className="border-b border-sand bg-sand-light/40 p-5">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-earth">
                  Student context
                </p>
                <div className="mt-2 flex flex-wrap items-start gap-4">
                  <div className="flex items-center gap-3">
                    <EditorialAvatar name={active.childStudentName} size="md" />
                    <div>
                      <p className="font-sans font-semibold text-ink">{active.childStudentName}</p>
                      <p className="font-sans text-[12px] text-stone">{active.childForm}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 font-sans text-[12px]">
                    <span className="inline-flex items-center gap-1 text-stone">
                      Average{' '}
                      <span className="font-mono text-ink">{active.childAvg}%</span>
                      {active.childAvgTrend ? (
                        <TrendArrow direction={active.childAvgTrend} className="ml-1" />
                      ) : null}
                    </span>
                    <span className="text-sand">·</span>
                    <span className="text-stone">
                      Attendance{' '}
                      <span className="font-mono text-ink">{active.childAttendance}%</span>
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex items-center justify-between border-b border-sand px-6 py-4">
              <div className="flex items-center gap-3">
                <EditorialAvatar
                  name={active.with}
                  size="md"
                  tone={tab === 'parents' ? 'terracotta' : 'sand'}
                />
                <div>
                  <p className="font-sans font-semibold text-ink">{active.with}</p>
                  <p className="font-sans text-[12px] text-stone">{active.withRole}</p>
                </div>
              </div>
              <p className="font-sans text-[12px] text-stone">{active.subject}</p>
            </div>

            <div className="flex min-h-[360px] flex-col gap-3 bg-cream p-6">
              {(tab === 'parents' ? PARENT_CONVERSATION : []).map((m, i) => (
                <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={[
                      'max-w-[70%] rounded px-4 py-2.5 font-serif text-[15px] leading-snug',
                      m.from === 'me' ? 'bg-sand text-ink' : 'border border-sand bg-white text-ink',
                    ].join(' ')}
                  >
                    {m.body}
                    <p className="mt-1 font-sans text-[11px] text-stone">{m.at}</p>
                  </div>
                </div>
              ))}
              {tab !== 'parents' ? (
                <div className="rounded border border-sand bg-white p-8 text-center">
                  <p className="font-serif text-[15px] text-stone">
                    Open a thread from the list to view the conversation.
                  </p>
                </div>
              ) : null}
            </div>

            <div className="border-t border-sand bg-white p-4">
              <div className="mb-2 flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex h-7 items-center gap-1 rounded border border-sand bg-cream px-2 font-sans text-[11px] font-medium text-earth hover:bg-sand-light"
                >
                  Request meeting
                </button>
                <button
                  type="button"
                  className="inline-flex h-7 items-center gap-1 rounded border border-sand bg-cream px-2 font-sans text-[11px] font-medium text-earth hover:bg-sand-light"
                >
                  Positive feedback
                </button>
                <button
                  type="button"
                  className="inline-flex h-7 items-center gap-1 rounded border border-sand bg-cream px-2 font-sans text-[11px] font-medium text-earth hover:bg-sand-light"
                >
                  Concern about submission
                </button>
                <span className="ml-auto inline-flex items-center gap-1 font-sans text-[11px] text-stone">
                  <Sparkles className="h-3 w-3 text-terracotta" strokeWidth={1.5} aria-hidden />
                  Tone-aware
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Attach"
                  className="rounded p-2 text-stone hover:bg-sand-light hover:text-ink"
                >
                  <Paperclip className="h-4 w-4" strokeWidth={1.5} />
                </button>
                <input
                  type="text"
                  placeholder={
                    tab === 'staff'
                      ? 'Write a staff message…'
                      : 'Write a message — translated to parent preferred language'
                  }
                  className="h-10 flex-1 rounded border border-sand bg-cream px-3 font-serif text-[14px] text-ink placeholder-stone focus:border-terracotta focus:outline-none"
                />
                <button type="submit" className="btn-terracotta">
                  Send
                  <Send className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                </button>
              </div>
              {tab === 'students' ? (
                <p className="mt-3 inline-flex items-center gap-1.5 font-sans text-[11px] text-stone">
                  <TriangleAlert className="h-3 w-3 text-ochre" strokeWidth={1.5} aria-hidden />
                  Student replies queue outside school hours (07:00–20:00).
                </p>
              ) : null}
            </div>
          </EditorialCard>
        ) : null}
      </div>
    </div>
  );
}
