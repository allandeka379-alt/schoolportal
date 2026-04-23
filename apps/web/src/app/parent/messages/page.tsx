'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCheck,
  Languages,
  Paperclip,
  Plus,
  Search,
  Send,
  Sparkles,
  X,
} from 'lucide-react';

import {
  EditorialAvatar,
  EditorialCard,
  SectionEyebrow,
  TrendArrow,
} from '@/components/student/primitives';
import { ChildColourDot, ParentPageHeader } from '@/components/parent/primitives';
import { useSelectedChild } from '@/components/parent/selected-child-context';
import {
  CONVERSATION_SAMPLE,
  PARENT_CHILDREN,
  PARENT_THREADS,
  type ParentThread,
} from '@/lib/mock/parent-extras';

/**
 * Parent messages — §11.
 *
 *   - Single inbox · threads tagged by child
 *   - Send composes a message; correspondent auto-replies after ~2s
 *   - Per-thread conversation state persists across switches
 *   - Template pills insert text into the compose
 *   - "New message" modal creates a new thread (child + correspondent + subject + body)
 *   - Translate toggle re-renders teacher messages in Shona
 */

interface Message {
  id: string;
  from: 'me' | 'them';
  body: string;
  translated?: string;
  at: string;
}

const TEMPLATES: readonly { label: string; body: string }[] = [
  {
    label: 'Request meeting',
    body:
      "I'd like to arrange a short meeting to discuss this further. Any time next week suits us — whatever works for you.",
  },
  {
    label: 'Explain absence',
    body:
      'Thank you for letting me know. My child was unwell yesterday and we took them to see the doctor. I will upload the slip.',
  },
  {
    label: 'Question about assignment',
    body:
      'Thanks for the update. Could you point me to which section my child should focus on this week?',
  },
  {
    label: 'Concern about marks',
    body:
      "I noticed my child's last mark has slipped. Is there anything specific we should work on at home?",
  },
  {
    label: 'Positive feedback',
    body:
      "Thank you for the note today — my child has been really engaged with this subject. They mentioned this teacher specifically.",
  },
];

const AUTO_REPLIES: Record<string, string[]> = {
  'pt-1': [
    "Lovely — Thursday 15:30 works. I'll send a calendar invite.",
    'Thank you. I will keep an eye on his working in the next piece.',
    'Understood. A short call is the best approach. I will confirm tomorrow.',
  ],
  'pt-2': [
    'Thank you for the note. I will update you after Friday assembly.',
    'Noted — I will include this in the form circular.',
  ],
  'pt-3': [
    'Confirmed. Receipt has been posted to your portal.',
    'Your payment is on file. A copy of the receipt is attached in the ledger.',
  ],
  'pt-4': [
    'Permission recorded. Thank you.',
    'Received — the consent is now complete.',
  ],
  'pt-5': [
    'Thank you for letting me know. I will keep encouraging her.',
    'Kind note — I will pass it on to the English team.',
  ],
};

function clockTime(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function minutesLabel(ms: number): string {
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return 'just now';
  if (mins === 1) return '1 min ago';
  if (mins < 60) return `${mins} min ago`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h} h ago`;
  return `${Math.floor(h / 24)} d ago`;
}

function seedConversation(threadId: string, subject: string): Message[] {
  if (threadId === 'pt-1') {
    return CONVERSATION_SAMPLE.map((m, i) => ({
      id: `seed-${i}`,
      from: m.from as 'me' | 'them',
      body: m.body,
      translated:
        m.from === 'them'
          ? 'Masikati, Amai Moyo. Ndaona kuti bvunzo yaFarai yapedzisira yange iri pasi pezvaanowanzoita.'
          : undefined,
      at: m.at,
    }));
  }
  // Generic conversations for other threads
  return [
    {
      id: `${threadId}-1`,
      from: 'them',
      body: `Good afternoon — this thread concerns: ${subject}.`,
      at: 'Earlier today',
    },
  ];
}

export default function ParentMessagesPage() {
  const { selectedChild } = useSelectedChild();
  const [threads, setThreads] = useState<ParentThread[]>([...PARENT_THREADS]);
  const [activeId, setActiveId] = useState<string>(threads[0]!.id);
  const [conversations, setConversations] = useState<Record<string, Message[]>>(() => {
    const init: Record<string, Message[]> = {};
    for (const t of PARENT_THREADS) {
      init[t.id] = seedConversation(t.id, t.subject);
    }
    return init;
  });
  const [lastActivity, setLastActivity] = useState<Record<string, number>>(() => {
    const now = Date.now();
    return Object.fromEntries(PARENT_THREADS.map((t, i) => [t.id, now - (i + 1) * 1000 * 60 * 32]));
  });
  const [unread, setUnread] = useState<Set<string>>(
    () => new Set(PARENT_THREADS.filter((t) => t.unread).map((t) => t.id)),
  );
  const [draft, setDraft] = useState('');
  const [query, setQuery] = useState('');
  const [translating, setTranslating] = useState(false);
  const [typing, setTyping] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const active = useMemo(
    () => threads.find((t) => t.id === activeId) ?? threads[0]!,
    [threads, activeId],
  );
  const childInThread =
    PARENT_CHILDREN.find((c) => c.id === active.childId) ?? PARENT_CHILDREN[0]!;
  const activeConversation = conversations[active.id] ?? [];

  useEffect(() => {
    setUnread((u) => {
      if (!u.has(activeId)) return u;
      const next = new Set(u);
      next.delete(activeId);
      return next;
    });
  }, [activeId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [activeConversation.length, typing]);

  function insertTemplate(body: string) {
    setDraft((d) => (d.trim() ? `${d.trim()}\n\n${body}` : body));
    inputRef.current?.focus();
  }

  function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = draft.trim();
    if (!body) return;
    const msg: Message = {
      id: `m-${Date.now()}`,
      from: 'me',
      body,
      at: clockTime(),
    };
    setConversations((prev) => ({
      ...prev,
      [active.id]: [...(prev[active.id] ?? []), msg],
    }));
    setThreads((prev) =>
      prev.map((t) => (t.id === active.id ? { ...t, lastSnippet: body.slice(0, 80), needsReply: false } : t)),
    );
    setLastActivity((la) => ({ ...la, [active.id]: Date.now() }));
    setDraft('');
    setTyping(true);

    const replies = AUTO_REPLIES[active.id] ?? [
      'Thank you for your message — I will respond today.',
    ];
    const pick = replies[Math.floor(Math.random() * replies.length)]!;
    const delay = 1500 + Math.random() * 900;

    setTimeout(() => {
      const reply: Message = {
        id: `m-${Date.now() + 1}`,
        from: 'them',
        body: pick,
        at: clockTime(),
      };
      setConversations((prev) => ({
        ...prev,
        [active.id]: [...(prev[active.id] ?? []), reply],
      }));
      setThreads((prev) =>
        prev.map((t) =>
          t.id === active.id
            ? { ...t, lastSnippet: pick.slice(0, 80), needsReply: false }
            : t,
        ),
      );
      setLastActivity((la) => ({ ...la, [active.id]: Date.now() }));
      setTyping(false);
    }, delay);
  }

  function createThread(payload: {
    childId: string;
    correspondent: string;
    correspondentRole: string;
    subject: string;
    body: string;
    category: ParentThread['category'];
  }) {
    const id = `pt-${Date.now()}`;
    const child = PARENT_CHILDREN.find((c) => c.id === payload.childId) ?? PARENT_CHILDREN[0]!;
    const t: ParentThread = {
      id,
      with: payload.correspondent,
      withRole: payload.correspondentRole,
      subject: payload.subject,
      childId: child.id,
      childName: child.firstName,
      lastSnippet: payload.body.slice(0, 80),
      ago: 'just now',
      unread: false,
      needsReply: false,
      category: payload.category,
    };
    setThreads((curr) => [t, ...curr]);
    setConversations((prev) => ({
      ...prev,
      [id]: [
        {
          id: `${id}-1`,
          from: 'me',
          body: payload.body,
          at: clockTime(),
        },
      ],
    }));
    setLastActivity((la) => ({ ...la, [id]: Date.now() }));
    setActiveId(id);
    setComposeOpen(false);
    setTyping(true);
    setTimeout(() => {
      const reply: Message = {
        id: `${id}-reply`,
        from: 'them',
        body: `Thank you for the note about ${child.firstName}. I will respond in detail this afternoon.`,
        at: clockTime(),
      };
      setConversations((prev) => ({ ...prev, [id]: [...(prev[id] ?? []), reply] }));
      setTyping(false);
    }, 2100);
  }

  const filteredThreads = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return threads;
    return threads.filter(
      (t) =>
        t.with.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.childName.toLowerCase().includes(q) ||
        t.withRole.toLowerCase().includes(q),
    );
  }, [threads, query]);

  return (
    <div className="space-y-6">
      <ParentPageHeader
        eyebrow="Messages"
        title="Your direct line,"
        accent="to the school."
        subtitle="Moderated · logged · scoped to the children you are linked to."
        right={
          <button
            type="button"
            onClick={() => setComposeOpen(true)}
            className="btn-terracotta"
          >
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
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by teacher, subject, or child…"
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
                const isUnread = unread.has(t.id);
                const isActive = t.id === activeId;
                const ago = minutesLabel(Date.now() - (lastActivity[t.id] ?? Date.now()));
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
                      <ThreadAvatar thread={t} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p
                            className={[
                              'truncate font-sans text-[14px]',
                              isUnread ? 'font-semibold text-ink' : 'font-medium text-stone',
                            ].join(' ')}
                          >
                            {t.with}
                          </p>
                          <span className="ml-auto flex-none font-sans text-[11px] text-stone">
                            {ago}
                          </span>
                        </div>
                        <p className="font-sans text-[12px] text-stone">{t.withRole}</p>
                        <p className="mt-1 truncate font-sans text-[13px] text-ink">{t.subject}</p>
                        <p className="mt-0.5 truncate font-serif text-[13px] text-stone">
                          {t.lastSnippet}
                        </p>
                      </div>
                      {isUnread ? (
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
                );
              })}
            </ul>
          )}
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
                {translating ? 'Showing Shona' : 'Translate'}
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex min-h-[360px] max-h-[440px] flex-col gap-3 overflow-y-auto bg-cream p-6">
            {activeConversation.length === 0 ? (
              <p className="m-auto font-sans text-[13px] text-stone">
                This thread is empty. Write the first message below.
              </p>
            ) : (
              activeConversation.map((m) => (
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
                    {translating && m.translated ? m.translated : m.body}
                    <p className="mt-1 flex items-center gap-1 font-sans text-[11px] text-stone">
                      {m.at}
                      {m.from === 'me' ? (
                        <CheckCheck className="h-3 w-3 text-ok" strokeWidth={1.5} aria-hidden />
                      ) : null}
                    </p>
                  </div>
                </div>
              ))
            )}
            {typing ? (
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

          {/* Compose */}
          <form onSubmit={send} className="border-t border-sand bg-white p-4">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                Templates
              </span>
              {TEMPLATES.map((t) => (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => insertTemplate(t.body)}
                  className="inline-flex h-7 items-center rounded border border-sand bg-cream px-2 font-sans text-[11px] font-medium text-earth hover:bg-sand-light"
                >
                  {t.label}
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
                ref={inputRef}
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Write a message — will be delivered in the teacher's preferred language"
                className="h-10 flex-1 rounded border border-sand bg-cream px-3 font-serif text-[14px] text-ink placeholder-stone focus:border-terracotta focus:outline-none"
              />
              <button
                type="submit"
                disabled={!draft.trim() || typing}
                className="btn-terracotta disabled:cursor-not-allowed disabled:opacity-60"
              >
                Send
                <Send className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </button>
            </div>
            <p className="mt-3 font-sans text-[11px] text-stone">
              {active.with} responds during school hours (Mon–Fri, 07:00–17:00). Replies outside those
              hours queue to their first check-in.
            </p>
          </form>
        </EditorialCard>
      </div>

      {composeOpen ? (
        <ComposeModal onClose={() => setComposeOpen(false)} onSend={createThread} />
      ) : null}
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

const CORRESPONDENTS: readonly { name: string; role: string; category: ParentThread['category'] }[] = [
  { name: 'Mrs M. Dziva', role: 'Mathematics', category: 'academic' },
  { name: 'Mr T. Gondo', role: 'English', category: 'academic' },
  { name: 'Mr T. Chikova', role: 'Form teacher', category: 'pastoral' },
  { name: 'Mrs F. Chiweshe', role: 'Shona', category: 'academic' },
  { name: 'Mr P. Mhlanga', role: 'Chemistry', category: 'academic' },
  { name: 'Bursary', role: "Bursar's office", category: 'administrative' },
  { name: 'School Office', role: 'Admin', category: 'administrative' },
  { name: 'Headmaster', role: "Headmaster's office", category: 'administrative' },
];

function ComposeModal({
  onClose,
  onSend,
}: {
  onClose: () => void;
  onSend: (p: {
    childId: string;
    correspondent: string;
    correspondentRole: string;
    subject: string;
    body: string;
    category: ParentThread['category'];
  }) => void;
}) {
  const [childId, setChildId] = useState<string>(PARENT_CHILDREN[0]!.id);
  const [correspondentIdx, setCorrespondentIdx] = useState<number>(0);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    const c = CORRESPONDENTS[correspondentIdx]!;
    onSend({
      childId,
      correspondent: c.name,
      correspondentRole: c.role,
      subject: subject.trim(),
      body: body.trim(),
      category: c.category,
    });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[88vh] w-full max-w-xl flex-col overflow-hidden rounded bg-white shadow-e3"
      >
        <div className="flex items-center justify-between border-b border-sand px-6 py-4">
          <h2 className="font-display text-[20px] text-ink">New message</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-2 text-stone transition-colors hover:bg-sand-light hover:text-ink"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
        <div className="space-y-4 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-stone">
                About
              </span>
              <select
                className="input-boxed"
                value={childId}
                onChange={(e) => setChildId(e.target.value)}
              >
                {PARENT_CHILDREN.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName} · {c.form}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-stone">
                To
              </span>
              <select
                className="input-boxed"
                value={correspondentIdx}
                onChange={(e) => setCorrespondentIdx(Number(e.target.value))}
              >
                {CORRESPONDENTS.map((c, i) => (
                  <option key={c.name} value={i}>
                    {c.name} · {c.role}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block">
            <span className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-stone">
              Subject
            </span>
            <input
              className="input-boxed"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Short and specific"
              required
            />
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-stone">
              Message
            </span>
            <textarea
              rows={5}
              className="w-full rounded border border-sand bg-white p-3 font-serif text-[14px] leading-relaxed text-ink placeholder-stone focus:border-terracotta focus:outline-none"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write what you would like to say — the portal will handle translation to the teacher's preferred language."
              required
            />
          </label>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-sand bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-stone hover:bg-sand-light"
          >
            Cancel
          </button>
          <button type="submit" className="btn-terracotta">
            <Send className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            Send message
          </button>
        </div>
      </form>
    </div>
  );
}
