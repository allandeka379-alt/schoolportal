'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Paperclip, Search, Send, SmilePlus, X } from 'lucide-react';

import {
  EditorialAvatar,
  EditorialCard,
  SectionEyebrow,
} from '@/components/student/primitives';

/**
 * Messages — §13.
 *
 * Two-column layout: threads list (38%) + conversation (62%).
 * Thread switching is live. Sending a message appends optimistically and
 * the teacher auto-replies after a short delay so the demo feels real.
 * Moderated, logged, scoped to school hours.
 */

interface Message {
  id: string;
  from: 'me' | 'them';
  body: string;
  at: string;
}

interface Thread {
  id: string;
  with: string;
  role: string;
  avatarTone: 'terracotta' | 'sand' | 'ochre' | 'ink';
  canReply: boolean;
  messages: Message[];
}

const INITIAL_THREADS: Thread[] = [
  {
    id: 't1',
    with: 'Mrs M. Dziva',
    role: 'Mathematics',
    avatarTone: 'terracotta',
    canReply: true,
    messages: [
      { id: 'm1', from: 'them', body: 'Hi Farai — thanks for the early submission. Quick question on Q9.', at: '08:42' },
      { id: 'm2', from: 'me', body: "Hello Mrs Dziva. I wasn't sure whether to factor or complete the square.", at: '08:44' },
      { id: 'm3', from: 'them', body: 'Your instinct was right. Factoring would have worked — see the first hint in the worked example PDF.', at: '08:45' },
      { id: 'm4', from: 'them', body: "I'll have Worksheet 5 marked by Friday.", at: '09:12' },
    ],
  },
  {
    id: 't2',
    with: 'Mr T. Gondo',
    role: 'English',
    avatarTone: 'ochre',
    canReply: true,
    messages: [
      { id: 'g1', from: 'them', body: 'Farai — strong opening in your essay draft.', at: 'Mon 14:10' },
      { id: 'g2', from: 'them', body: 'Tighten paragraph 3 and the marks lift quickly.', at: 'Mon 14:11' },
      { id: 'g3', from: 'me', body: 'Thank you, sir. I will rework it tonight.', at: 'Mon 19:02' },
      { id: 'g4', from: 'them', body: 'Your essay draft is strong — see comments on para 3.', at: 'Tue 09:20' },
    ],
  },
  {
    id: 't3',
    with: 'Form 3 Blue channel',
    role: 'Form group',
    avatarTone: 'sand',
    canReply: false,
    messages: [
      { id: 'c1', from: 'them', body: 'Mrs Dziva: reminder about the Saturday revision class — 09:00 in B12.', at: 'Yesterday 18:30' },
      { id: 'c2', from: 'them', body: 'Mr Mhlanga: please submit your Chemistry practical by Thursday.', at: 'Yesterday 19:02' },
    ],
  },
  {
    id: 't4',
    with: 'Mr S. Chakanetsa',
    role: 'History',
    avatarTone: 'ink',
    canReply: true,
    messages: [
      { id: 'h1', from: 'them', body: 'The essay rubric is now attached to the assignment.', at: 'Sat 10:04' },
      { id: 'h2', from: 'them', body: 'Essay rubric attached.', at: 'Sun 08:55' },
    ],
  },
];

const AUTO_REPLIES: Record<string, string[]> = {
  t1: [
    'Got it — I will respond in detail after period 3.',
    'Good question. We will cover this in class tomorrow.',
    'Thanks Farai — that is exactly the right approach.',
  ],
  t2: [
    'Good. Keep that introduction punchy.',
    'Send me the revised version by Friday.',
    'Well done — the argument is clearer now.',
  ],
  t4: [
    'Yes — use at least three primary sources.',
    'Read the examiner\'s report before you start the next essay.',
  ],
};

function minutesSince(startTs: number): string {
  const now = Date.now();
  const mins = Math.floor((now - startTs) / 60000);
  if (mins < 1) return 'just now';
  if (mins === 1) return '1 min ago';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  return `${Math.floor(hours / 24)} d ago`;
}

function clockTime(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function MessagesPage() {
  const [threads, setThreads] = useState<Thread[]>(INITIAL_THREADS);
  const [activeId, setActiveId] = useState<string>(INITIAL_THREADS[0]!.id);
  const [unread, setUnread] = useState<Record<string, number>>({ t1: 1, t2: 2 });
  const [lastActivity, setLastActivity] = useState<Record<string, number>>(() => {
    const now = Date.now();
    return { t1: now - 1000 * 60 * 10, t2: now - 1000 * 60 * 60 * 2, t3: now - 86400000, t4: now - 86400000 * 2 };
  });
  const [draft, setDraft] = useState('');
  const [query, setQuery] = useState('');
  const [teacherTyping, setTeacherTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = useMemo(() => threads.find((t) => t.id === activeId)!, [threads, activeId]);

  useEffect(() => {
    // Clear unread on selecting
    setUnread((u) => ({ ...u, [activeId]: 0 }));
  }, [activeId]);

  useEffect(() => {
    // Auto-scroll on new message
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [active.messages.length, teacherTyping]);

  function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = draft.trim();
    if (!body || !active.canReply) return;

    const myMessage: Message = {
      id: `m${Date.now()}`,
      from: 'me',
      body,
      at: clockTime(),
    };
    setThreads((curr) =>
      curr.map((t) => (t.id === active.id ? { ...t, messages: [...t.messages, myMessage] } : t)),
    );
    setLastActivity((la) => ({ ...la, [active.id]: Date.now() }));
    setDraft('');

    // Teacher is typing…
    setTeacherTyping(true);
    const replies = AUTO_REPLIES[active.id] ?? ['Thanks Farai.'];
    const pick = replies[Math.floor(Math.random() * replies.length)]!;
    const delay = 1400 + Math.random() * 900;

    setTimeout(() => {
      const reply: Message = {
        id: `m${Date.now() + 1}`,
        from: 'them',
        body: pick,
        at: clockTime(),
      };
      setThreads((curr) =>
        curr.map((t) => (t.id === active.id ? { ...t, messages: [...t.messages, reply] } : t)),
      );
      setLastActivity((la) => ({ ...la, [active.id]: Date.now() }));
      setTeacherTyping(false);
    }, delay);
  }

  const filteredThreads = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return threads;
    return threads.filter((t) => t.with.toLowerCase().includes(q) || t.role.toLowerCase().includes(q));
  }, [threads, query]);

  return (
    <div className="space-y-6">
      <header>
        <SectionEyebrow>Messages</SectionEyebrow>
        <h1 className="mt-2 font-display text-[clamp(1.75rem,3vw,2.25rem)] text-ink">
          Your conversations,{' '}
          <span className="italic font-light text-terracotta">with teachers.</span>
        </h1>
        <p className="mt-2 font-sans text-[13px] text-stone">
          Moderated, logged, and only during school hours (07:00–20:00).
        </p>
      </header>

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
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search teachers or subjects…"
                className="h-10 w-full rounded border border-sand bg-cream pl-9 pr-9 font-sans text-[13px] text-ink placeholder-stone focus:border-terracotta focus:outline-none"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-stone hover:bg-sand-light hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
              ) : null}
            </div>
          </div>
          {filteredThreads.length === 0 ? (
            <div className="p-8 text-center font-sans text-[13px] text-stone">No matching threads.</div>
          ) : (
            <ul className="divide-y divide-sand-light">
              {filteredThreads.map((t) => {
                const isActive = t.id === activeId;
                const last = t.messages[t.messages.length - 1];
                const count = unread[t.id] ?? 0;
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(t.id)}
                      className={[
                        'flex w-full items-start gap-3 px-5 py-4 text-left transition-colors',
                        isActive ? 'bg-sand-light/70' : 'hover:bg-sand-light/40',
                      ].join(' ')}
                    >
                      <EditorialAvatar name={t.with} size="md" tone={t.avatarTone} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p
                            className={[
                              'truncate font-sans text-[14px]',
                              count > 0 ? 'font-semibold text-ink' : 'font-medium text-stone',
                            ].join(' ')}
                          >
                            {t.with}
                          </p>
                          <span className="ml-auto flex-none font-sans text-[11px] text-stone">
                            {minutesSince(lastActivity[t.id] ?? Date.now())}
                          </span>
                        </div>
                        <p className="font-sans text-[12px] text-stone">{t.role}</p>
                        <p className="mt-1 truncate font-serif text-[13px] text-stone">
                          {last?.from === 'me' ? 'You: ' : ''}
                          {last?.body}
                        </p>
                      </div>
                      {count > 0 ? (
                        <span className="flex-none rounded-full bg-terracotta px-1.5 text-[11px] font-semibold text-cream">
                          {count}
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </EditorialCard>

        {/* Conversation */}
        <EditorialCard className="overflow-hidden lg:col-span-7">
          <div className="flex items-center gap-3 border-b border-sand px-6 py-4">
            <EditorialAvatar name={active.with} size="md" tone={active.avatarTone} />
            <div className="flex-1">
              <p className="font-sans font-semibold text-ink">{active.with}</p>
              <p className="font-sans text-[12px] text-stone">
                {active.role}
                {active.canReply ? ' · read receipts on' : ' · read-only'}
              </p>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex max-h-[440px] min-h-[360px] flex-col gap-3 overflow-y-auto bg-cream p-6"
          >
            {active.messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}
              >
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
            {teacherTyping ? (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-1 rounded border border-sand bg-white px-4 py-3">
                  <Dot delay={0} />
                  <Dot delay={120} />
                  <Dot delay={240} />
                  <span className="ml-1 font-sans text-[11px] text-stone">
                    {active.with.split(' ').pop()} is typing
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          {active.canReply ? (
            <form onSubmit={send} className="border-t border-sand bg-white p-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Attach file"
                  className="rounded p-2 text-stone hover:bg-sand-light hover:text-ink"
                >
                  <Paperclip className="h-4 w-4" strokeWidth={1.5} />
                </button>
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={`Write to ${active.with}…`}
                  className="h-10 flex-1 rounded border border-sand bg-cream px-3 font-serif text-[14px] text-ink placeholder-stone focus:border-terracotta focus:outline-none"
                />
                <button
                  type="button"
                  aria-label="Insert emoji"
                  className="rounded p-2 text-stone hover:bg-sand-light hover:text-ink"
                >
                  <SmilePlus className="h-4 w-4" strokeWidth={1.5} />
                </button>
                <button type="submit" className="btn-terracotta" disabled={!draft.trim()}>
                  Send
                  <Send className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                </button>
              </div>
              <p className="mt-2 font-sans text-[11px] text-stone">
                Messages are moderated and logged. Teachers reply during school hours.
              </p>
            </form>
          ) : (
            <div className="border-t border-sand bg-sand-light/40 px-6 py-5 text-center">
              <p className="font-sans text-[13px] text-stone">
                This is a read-only channel. Your form teacher decides who can post here.
              </p>
            </div>
          )}
        </EditorialCard>
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-stone"
      style={{ animationDelay: `${delay}ms` }}
      aria-hidden
    />
  );
}
