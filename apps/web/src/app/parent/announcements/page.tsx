'use client';

import { useMemo, useState } from 'react';
import { Check, CheckCircle2, Languages, Pin } from 'lucide-react';

import { EditorialCard, SectionEyebrow } from '@/components/student/primitives';
import { ParentPageHeader } from '@/components/parent/primitives';
import {
  PARENT_ANNOUNCEMENTS,
  type ParentAnnouncement,
  type ParentAnnouncementCategory,
} from '@/lib/mock/parent-extras';

const FILTERS: readonly (ParentAnnouncementCategory | 'All' | 'Unread')[] = [
  'All',
  'Urgent',
  'Academic',
  'Event',
  'Fees',
  'Unread',
];

/**
 * Parent announcements — §10.
 *
 *   - Ordering: pinned urgent first, then unread, then reverse-chronological
 *   - Urgent items styled with 2px Terracotta top-border + Sand Light fill
 *   - Unread items carry a 2px Terracotta left-border
 *   - "I have read this" acknowledgement for items that require it
 *   - Translate toggle per-item renders Shona for teacher-authored content
 *   - Counter chips show size of each filter
 *   - "Mark all read" clears the session's unread list
 */
export default function ParentAnnouncementsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  const [acknowledged, setAcknowledged] = useState<Record<string, boolean>>({});
  const [read, setRead] = useState<Set<string>>(
    () => new Set(PARENT_ANNOUNCEMENTS.filter((a) => !a.unread).map((a) => a.id)),
  );
  const [translated, setTranslated] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: 0, Urgent: 0, Academic: 0, Event: 0, Fees: 0, Unread: 0 };
    for (const a of PARENT_ANNOUNCEMENTS) {
      c.All += 1;
      c[a.category] = (c[a.category] ?? 0) + 1;
      if (!read.has(a.id)) c.Unread += 1;
    }
    return c;
  }, [read]);

  const items = useMemo(() => {
    let list: readonly ParentAnnouncement[] = PARENT_ANNOUNCEMENTS;
    if (filter === 'Unread') list = list.filter((a) => !read.has(a.id));
    else if (filter !== 'All') list = list.filter((a) => a.category === filter);

    return [...list].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      const aUnread = !read.has(a.id);
      const bUnread = !read.has(b.id);
      if (aUnread !== bUnread) return aUnread ? -1 : 1;
      return b.publishedAt.localeCompare(a.publishedAt);
    });
  }, [filter, read]);

  function markRead(id: string) {
    setRead((curr) => {
      if (curr.has(id)) return curr;
      const next = new Set(curr);
      next.add(id);
      return next;
    });
  }

  function markAllRead() {
    setRead(new Set(PARENT_ANNOUNCEMENTS.map((a) => a.id)));
  }

  function toggleTranslate(id: string) {
    setTranslated((curr) => {
      const next = new Set(curr);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleExpanded(id: string) {
    setExpanded((curr) => {
      const next = new Set(curr);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    markRead(id);
  }

  function acknowledge(id: string) {
    setAcknowledged((prev) => ({ ...prev, [id]: true }));
    markRead(id);
  }

  return (
    <div className="space-y-6">
      <ParentPageHeader
        eyebrow="Announcements"
        title="From the school,"
        accent="to parents."
        subtitle="Curated by the Headmaster's office, the bursary, and the teaching staff."
        right={
          counts.Unread > 0 ? (
            <button
              type="button"
              onClick={markAllRead}
              className="inline-flex h-9 items-center gap-1.5 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
            >
              <Check className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              Mark all as read
            </button>
          ) : null
        }
      />

      {/* Filter chips */}
      <div role="tablist" aria-label="Filter announcements" className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = f === filter;
          return (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f)}
              className={[
                'inline-flex h-8 items-center gap-2 rounded-full px-4 font-sans text-[13px] font-medium transition-colors',
                active
                  ? 'bg-ink text-cream'
                  : 'border border-sand bg-white text-stone hover:bg-sand-light',
              ].join(' ')}
            >
              {f}
              <span
                className={[
                  'rounded-full px-1.5 font-mono text-[11px] tabular-nums',
                  active ? 'bg-cream/20 text-cream' : 'bg-sand text-earth',
                ].join(' ')}
              >
                {counts[f] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Feed */}
      {items.length === 0 ? (
        <EditorialCard className="px-6 py-10 text-center">
          <p className="font-serif text-[15px] text-stone">No announcements match that filter.</p>
        </EditorialCard>
      ) : (
        <ul className="space-y-3">
          {items.map((a) => {
            const isRead = read.has(a.id);
            const isExpanded = expanded.has(a.id);
            const isTranslated = translated.has(a.id);
            const isAcknowledged = acknowledged[a.id] || a.acknowledged;
            return (
              <li key={a.id}>
                <article
                  className={[
                    'relative rounded border px-6 py-5 transition-all duration-200 ease-out-soft',
                    a.pinned
                      ? 'border-t-[2px] border-t-terracotta border-x-sand border-b-sand bg-sand-light/50'
                      : !isRead
                      ? 'border-sand bg-white hover:shadow-e2'
                      : 'border-sand-light bg-white',
                  ].join(' ')}
                >
                  {!isRead && !a.pinned ? (
                    <span
                      aria-hidden
                      className="absolute inset-y-3 left-0 w-[2px] rounded-r-sm bg-terracotta"
                    />
                  ) : null}
                  <button
                    type="button"
                    onClick={() => toggleExpanded(a.id)}
                    className="block w-full text-left"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      {a.pinned ? (
                        <span className="inline-flex items-center gap-1 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-terracotta">
                          <Pin className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                          Pinned
                        </span>
                      ) : null}
                      {a.category === 'Urgent' ? (
                        <span className="rounded-sm bg-terracotta px-1.5 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-cream">
                          Urgent
                        </span>
                      ) : (
                        <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-earth">
                          {a.category}
                        </span>
                      )}
                      <span className="font-sans text-[12px] text-stone">· {a.ago}</span>
                      <span className="font-sans text-[12px] text-stone">· {a.author}</span>
                      {!isRead ? (
                        <span className="ml-auto rounded-full bg-terracotta px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-cream">
                          new
                        </span>
                      ) : null}
                    </div>

                    <h3
                      className={[
                        'mt-3 font-display leading-snug',
                        'text-[22px] md:text-[26px]',
                        !isRead ? 'text-ink' : 'text-stone',
                      ].join(' ')}
                    >
                      {a.title}
                    </h3>
                    <p
                      className={[
                        'mt-2 font-serif text-[15px] leading-relaxed text-stone',
                        isExpanded ? '' : 'line-clamp-2',
                      ].join(' ')}
                    >
                      {isTranslated ? translate(a.body) : a.body}
                    </p>
                  </button>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleExpanded(a.id)}
                      className="font-sans text-[13px] font-medium text-terracotta hover:text-earth"
                    >
                      {isExpanded ? 'Show less' : 'Read more →'}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleTranslate(a.id)}
                      className={[
                        'inline-flex items-center gap-1 rounded border px-2 py-0.5 font-sans text-[11px] font-medium transition-colors',
                        isTranslated
                          ? 'border-terracotta bg-sand-light text-terracotta'
                          : 'border-sand bg-white text-earth hover:bg-sand-light',
                      ].join(' ')}
                    >
                      <Languages className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                      {isTranslated ? 'Showing Shona' : 'Translate'}
                    </button>
                    {a.requiresAcknowledgement ? (
                      isAcknowledged ? (
                        <span className="inline-flex items-center gap-1.5 rounded border border-ok/40 bg-[#F0F6F2] px-3 py-1 font-sans text-[12px] font-medium text-ok">
                          <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                          You acknowledged this
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => acknowledge(a.id)}
                          className="inline-flex h-8 items-center rounded border border-terracotta/40 bg-sand-light px-3 font-sans text-[12px] font-medium text-terracotta hover:bg-sand"
                        >
                          I have read this
                        </button>
                      )
                    ) : null}
                  </div>

                  {isExpanded ? (
                    <div className="mt-4 border-t border-sand-light pt-3 font-sans text-[12px] text-stone">
                      <SectionEyebrow>Details</SectionEyebrow>
                      <p className="mt-2">
                        Published {a.ago} · {a.author} · {a.category.toLowerCase()} ·{' '}
                        {a.requiresAcknowledgement ? 'acknowledgement required' : 'informational'}
                      </p>
                    </div>
                  ) : null}
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function translate(body: string): string {
  // Tiny illustrative Shona translator for demo purposes — the real pipeline
  // would call the translation service configured per announcement.
  return body
    .replace(/Term 2/g, 'Chikamu 2')
    .replace(/school/gi, 'chikoro')
    .replace(/parents/gi, 'vabereki')
    .replace(/fees/gi, 'mari yechikoro')
    .replace(/please/gi, 'tapota');
}
