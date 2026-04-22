import { Paperclip, Search, Send, SmilePlus } from 'lucide-react';

import { EditorialAvatar, EditorialCard, SectionEyebrow } from '@/components/student/primitives';

const THREADS = [
  {
    id: 't1',
    with: 'Mrs M. Dziva',
    role: 'Mathematics',
    last: "I'll have Worksheet 5 marked by Friday.",
    ago: '10 min ago',
    unread: 1,
    active: true,
  },
  {
    id: 't2',
    with: 'Mr T. Gondo',
    role: 'English',
    last: 'Your essay draft is strong — see comments on para 3.',
    ago: '2 h ago',
    unread: 2,
    active: false,
  },
  {
    id: 't3',
    with: 'Form 3 Blue channel',
    role: 'Form group',
    last: "Mrs Dziva: don't forget Saturday lesson.",
    ago: 'yesterday',
    unread: 0,
    active: false,
  },
  {
    id: 't4',
    with: 'Mr S. Chakanetsa',
    role: 'History',
    last: 'Essay rubric attached.',
    ago: '2 days ago',
    unread: 0,
    active: false,
  },
];

const CONVERSATION = [
  { from: 'them', body: "Hi Farai — thanks for the early submission. Quick question on Q9.", at: '08:42' },
  { from: 'me', body: 'Hello Mrs Dziva. I wasn\'t sure whether to factor or complete the square.', at: '08:44' },
  { from: 'them', body: 'Your instinct was right. Factoring would have worked — see the first hint in the worked example PDF.', at: '08:45' },
  { from: 'them', body: "I'll have Worksheet 5 marked by Friday.", at: '09:12' },
] as const;

/**
 * Messages — §13 of the spec.
 *
 * Two-column layout: threads list (38%) + conversation (62%).
 * Guardrails: moderated, within school hours, no student-to-student DMs.
 */
export default function MessagesPage() {
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
                placeholder="Search teachers or subjects…"
                className="h-10 w-full rounded border border-sand bg-cream pl-9 pr-3 font-sans text-[13px] text-ink placeholder-stone focus:border-terracotta focus:outline-none"
              />
            </div>
          </div>
          <ul className="divide-y divide-sand-light">
            {THREADS.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  className={[
                    'flex w-full items-start gap-3 px-5 py-4 text-left transition-colors',
                    t.active ? 'bg-sand-light/70' : 'hover:bg-sand-light/40',
                  ].join(' ')}
                >
                  <EditorialAvatar
                    name={t.with}
                    size="md"
                    tone={t.with.includes('Mrs') ? 'terracotta' : 'sand'}
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
                        {t.ago}
                      </span>
                    </div>
                    <p className="font-sans text-[12px] text-stone">{t.role}</p>
                    <p className="mt-1 truncate font-serif text-[13px] text-stone">{t.last}</p>
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
        <EditorialCard className="overflow-hidden lg:col-span-7">
          <div className="flex items-center gap-3 border-b border-sand px-6 py-4">
            <EditorialAvatar name="Mrs M. Dziva" size="md" tone="terracotta" />
            <div className="flex-1">
              <p className="font-sans font-semibold text-ink">Mrs M. Dziva</p>
              <p className="font-sans text-[12px] text-stone">Mathematics · read 10 mins ago</p>
            </div>
          </div>

          <div className="flex min-h-[360px] flex-col gap-3 bg-cream p-6">
            {CONVERSATION.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={[
                    'max-w-[70%] rounded px-4 py-2.5 font-serif text-[15px] leading-snug',
                    m.from === 'me'
                      ? 'bg-sand text-ink'
                      : 'border border-sand bg-white text-ink',
                  ].join(' ')}
                >
                  {m.body}
                  <p className="mt-1 font-sans text-[11px] text-stone">{m.at}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-sand bg-white p-4">
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
                placeholder="Write a message to Mrs Dziva…"
                className="h-10 flex-1 rounded border border-sand bg-cream px-3 font-serif text-[14px] text-ink placeholder-stone focus:border-terracotta focus:outline-none"
              />
              <button
                type="button"
                aria-label="Insert emoji"
                className="rounded p-2 text-stone hover:bg-sand-light hover:text-ink"
              >
                <SmilePlus className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <button type="submit" className="btn-terracotta">
                Send
                <Send className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </button>
            </div>
          </div>
        </EditorialCard>
      </div>
    </div>
  );
}
