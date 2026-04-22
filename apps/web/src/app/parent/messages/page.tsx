'use client';

import { useMemo, useState } from 'react';
import { Languages, Paperclip, Plus, Search, Send, Sparkles, TrendingUp } from 'lucide-react';

import { EditorialAvatar, EditorialCard, SectionEyebrow, TrendArrow } from '@/components/student/primitives';
import { ChildColourDot, ParentPageHeader } from '@/components/parent/primitives';
import { useSelectedChild } from '@/components/parent/selected-child-context';
import { CONVERSATION_SAMPLE, PARENT_CHILDREN, PARENT_THREADS, type ParentThread } from '@/lib/mock/parent-extras';

/**
 * Parent messages — §11.
 *
 *   - Single inbox with threads tagged by child (tinted dot)
 *   - New-message flow requires child + correspondent
 *   - Student context card persistent in every thread
 *   - Translate toggle for teacher-original messages
 *   - Template replies + tone-aware compose
 */
export default function ParentMessagesPage() {
  const { selectedChild } = useSelectedChild();
  const [activeId, setActiveId] = useState<string>(PARENT_THREADS[0]!.id);
  const [translating, setTranslating] = useState(false);

  const active = useMemo(
    () => PARENT_THREADS.find((t) => t.id === activeId) ?? PARENT_THREADS[0]!,
    [activeId],
  );
  const childInThread = PARENT_CHILDREN.find((c) => c.id === active.childId)!;

  return (
    <div className="space-y-6">
      <ParentPageHeader
        eyebrow="Messages"
        title="Your direct line,"
        accent="to the school."
        subtitle="Moderated · logged · scoped to the children you are linked to."
        right={
          <button type="button" className="btn-terracotta">
            <Plus className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            New message
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Thread list */}
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
                placeholder="Search by teacher or subject…"
                className="h-10 w-full rounded border border-sand bg-cream pl-9 pr-3 font-sans text-[13px] text-ink placeholder-stone focus:border-terracotta focus:outline-none"
              />
            </div>
          </div>
          <ul className="divide-y divide-sand-light">
            {PARENT_THREADS.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(t.id)}
                  className={[
                    'flex w-full items-start gap-3 px-5 py-4 text-left transition-colors',
                    t.id === active.id ? 'bg-sand-light/70' : 'hover:bg-sand-light/40',
                  ].join(' ')}
                >
                  <ThreadAvatar thread={t} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p
                        className={[
                          'truncate font-sans text-[14px]',
                          t.unread ? 'font-semibold text-ink' : 'font-medium text-stone',
                        ].join(' ')}
                      >
                        {t.with}
                      </p>
                      <span className="ml-auto flex-none font-sans text-[11px] text-stone">{t.ago}</span>
                    </div>
                    <p className="font-sans text-[12px] text-stone">{t.withRole}</p>
                    <p className="mt-1 truncate font-sans text-[13px] text-ink">{t.subject}</p>
                    <p className="mt-0.5 truncate font-serif text-[13px] text-stone">{t.lastSnippet}</p>
                  </div>
                  {t.unread ? (
                    <span className="mt-1 flex-none rounded-full bg-terracotta px-1.5 text-[11px] font-semibold text-cream">
                      new
                    </span>
                  ) : t.needsReply ? (
                    <span className="mt-1 flex-none rounded-full bg-ochre/20 px-1.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-ochre">
                      reply
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </EditorialCard>

        {/* Conversation */}
        <EditorialCard className="overflow-hidden lg:col-span-7">
          {/* Student context card */}
          <div className="border-b border-sand bg-sand-light/40 p-5">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-earth">
              Student context
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <ChildColourDot tone={childInThread.colourTone} />
                <EditorialAvatar
                  name={`${childInThread.firstName} ${childInThread.lastName}`}
                  size="md"
                  tone={childInThread.colourTone === 'earth' ? 'sand' : 'terracotta'}
                />
                <div>
                  <p className="font-sans font-semibold text-ink">
                    {childInThread.firstName} {childInThread.lastName}
                  </p>
                  <p className="font-sans text-[12px] text-stone">{childInThread.form}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 font-sans text-[12px]">
                <span className="inline-flex items-center gap-1 text-stone">
                  Avg{' '}
                  <span className="font-mono text-ink">{childInThread.termAveragePercent}%</span>
                  <TrendArrow direction={childInThread.termAverageTrend} />
                </span>
                <span className="text-sand">·</span>
                <span className="text-stone">
                  Attendance <span className="font-mono text-ink">{childInThread.attendancePercent}%</span>
                </span>
                {childInThread.id === selectedChild.id ? null : (
                  <span className="ml-auto rounded border border-sand bg-white px-2 py-0.5 font-sans text-[11px] text-stone">
                    Currently viewing {selectedChild.firstName}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-sand px-6 py-4">
            <div className="min-w-0">
              <p className="truncate font-sans font-semibold text-ink">{active.with}</p>
              <p className="font-sans text-[12px] text-stone">{active.withRole}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTranslating((v) => !v)}
                className={[
                  'inline-flex h-8 items-center gap-1 rounded border px-3 font-sans text-[12px] font-medium transition-colors',
                  translating
                    ? 'border-terracotta bg-terracotta/10 text-terracotta-hover'
                    : 'border-sand bg-white text-earth hover:bg-sand-light',
                ].join(' ')}
              >
                <Languages className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                {translating ? 'Showing translated' : 'Translate'}
              </button>
            </div>
          </div>

          <div className="flex min-h-[360px] flex-col gap-3 bg-cream p-6">
            {CONVERSATION_SAMPLE.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={[
                    'max-w-[72%] rounded px-4 py-2.5 font-serif text-[15px] leading-snug',
                    m.from === 'me' ? 'bg-sand text-ink' : 'border border-sand bg-white text-ink',
                  ].join(' ')}
                >
                  {m.body}
                  <p className="mt-1 font-sans text-[11px] text-stone">{m.at}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Compose */}
          <div className="border-t border-sand bg-white p-4">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                Templates
              </span>
              {[
                'Request meeting',
                'Explain absence',
                'Question about assignment',
                'Concern about marks',
                'Positive feedback',
              ].map((t) => (
                <button
                  key={t}
                  type="button"
                  className="inline-flex h-7 items-center rounded border border-sand bg-cream px-2 font-sans text-[11px] font-medium text-earth hover:bg-sand-light"
                >
                  {t}
                </button>
              ))}
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
                placeholder="Write a message — will be delivered in the teacher's preferred language"
                className="h-10 flex-1 rounded border border-sand bg-cream px-3 font-serif text-[14px] text-ink placeholder-stone focus:border-terracotta focus:outline-none"
              />
              <button type="submit" className="btn-terracotta">
                Send
                <Send className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </button>
            </div>
            <p className="mt-3 font-sans text-[11px] text-stone">
              Mrs Dziva responds during school hours (Mon–Fri, 07:00–17:00). Replies outside those
              hours queue to her first check-in.
            </p>
          </div>
        </EditorialCard>
      </div>
    </div>
  );
}

function ThreadAvatar({ thread }: { thread: ParentThread }) {
  const child = PARENT_CHILDREN.find((c) => c.id === thread.childId);
  return (
    <div className="relative flex-none">
      <EditorialAvatar
        name={thread.with}
        size="md"
        tone={thread.category === 'academic' ? 'terracotta' : 'sand'}
      />
      {child ? (
        <span
          className={[
            'absolute -bottom-0.5 -right-0.5 block h-2.5 w-2.5 rounded-full border-2 border-white',
            child.colourTone === 'terracotta'
              ? 'bg-terracotta'
              : child.colourTone === 'ochre'
              ? 'bg-ochre'
              : child.colourTone === 'earth'
              ? 'bg-earth'
              : 'bg-ok',
          ].join(' ')}
          aria-label={`Relates to ${child.firstName}`}
        />
      ) : null}
    </div>
  );
}
