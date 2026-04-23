'use client';

import { useMemo, useState } from 'react';
import { Check, Pin } from 'lucide-react';

import { STUDENT_ANNOUNCEMENTS, type StudentAnnouncement } from '@/lib/mock/student-extras';

import { EditorialCard, SectionEyebrow } from '@/components/student/primitives';

type FilterKey = 'All' | 'Urgent' | 'Academic' | 'Events' | 'Unread';

const FILTERS: readonly FilterKey[] = ['All', 'Urgent', 'Academic', 'Events', 'Unread'];

/**
 * Announcements feed — §12 of the spec.
 *
 *   - Filter chips: all / urgent / academic / events / unread
 *   - Reading an announcement clears the unread flag (optimistic, session)
 *   - "I have read this" persists acknowledgement for urgent items
 *   - Counter chip shows filtered total
 */
export default function AnnouncementsFeedPage() {
  const [filter, setFilter] = useState<FilterKey>('All');
  const [read, setRead] = useState<Set<string>>(
    () => new Set(STUDENT_ANNOUNCEMENTS.filter((a) => !a.unread).map((a) => a.id)),
  );
  const [acked, setAcked] = useState<Set<string>>(
    () => new Set(STUDENT_ANNOUNCEMENTS.filter((a) => a.acknowledged).map((a) => a.id)),
  );
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const counts = useMemo(() => {
    const c: Record<FilterKey, number> = { All: 0, Urgent: 0, Academic: 0, Events: 0, Unread: 0 };
    for (const a of STUDENT_ANNOUNCEMENTS) {
      c.All += 1;
      if (a.category === 'Urgent') c.Urgent += 1;
      if (a.category === 'Academic') c.Academic += 1;
      if (a.category === 'Event') c.Events += 1;
      if (!read.has(a.id)) c.Unread += 1;
    }
    return c;
  }, [read]);

  const filtered = useMemo(() => {
    return STUDENT_ANNOUNCEMENTS.filter((a) => {
      if (filter === 'All') return true;
      if (filter === 'Urgent') return a.category === 'Urgent';
      if (filter === 'Academic') return a.category === 'Academic';
      if (filter === 'Events') return a.category === 'Event';
      if (filter === 'Unread') return !read.has(a.id);
      return true;
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

  function markAll() {
    setRead(new Set(STUDENT_ANNOUNCEMENTS.map((a) => a.id)));
  }

  function acknowledge(id: string) {
    setAcked((curr) => {
      const next = new Set(curr);
      next.add(id);
      return next;
    });
    markRead(id);
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

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionEyebrow>Announcements</SectionEyebrow>
          <h1 className="mt-2 font-display text-[clamp(1.75rem,3vw,2.25rem)] text-ink">
            What the school is saying,{' '}
            <span className="italic font-light text-terracotta">openly.</span>
          </h1>
          <p className="mt-2 font-sans text-[13px] text-stone">
            {counts.Unread === 0
              ? 'All caught up.'
              : `${counts.Unread} unread · read one and the rest stay.`}
          </p>
        </div>
        {counts.Unread > 0 ? (
          <button
            type="button"
            onClick={markAll}
            className="inline-flex h-9 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
          >
            <Check className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
            Mark all as read
          </button>
        ) : null}
      </header>

      {/* Filter chips */}
      <div role="tablist" aria-label="Filter announcements" className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f;
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
                {counts[f]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Feed */}
      {filtered.length === 0 ? (
        <EditorialCard className="p-10 text-center">
          <p className="font-display text-[18px] text-ink">Nothing here.</p>
          <p className="mt-2 font-sans text-[13px] text-stone">
            Try a different filter — or enjoy the quiet.
          </p>
        </EditorialCard>
      ) : (
        <ul className="space-y-3">
          {filtered.map((a) => (
            <AnnouncementRow
              key={a.id}
              announcement={a}
              read={read.has(a.id)}
              acknowledged={acked.has(a.id)}
              expanded={expanded.has(a.id)}
              onToggle={() => toggleExpanded(a.id)}
              onAcknowledge={() => acknowledge(a.id)}
            />
          ))}
        </ul>
      )}

      <EditorialCard className="p-4 text-center">
        <button type="button" className="font-sans text-[13px] text-stone hover:text-ink">
          Load older announcements
        </button>
      </EditorialCard>
    </div>
  );
}

function AnnouncementRow({
  announcement: a,
  read,
  acknowledged,
  expanded,
  onToggle,
  onAcknowledge,
}: {
  announcement: StudentAnnouncement;
  read: boolean;
  acknowledged: boolean;
  expanded: boolean;
  onToggle: () => void;
  onAcknowledge: () => void;
}) {
  const unread = !read;
  const isUrgent = a.category === 'Urgent';
  return (
    <li>
      <article
        className={[
          'relative rounded border px-6 py-5 transition-all duration-200 ease-out-soft',
          a.pinned
            ? 'border-t-[3px] border-t-terracotta border-x-sand border-b-sand bg-sand-light/40'
            : unread
            ? 'border-sand bg-white hover:shadow-e2'
            : 'border-sand-light bg-white',
        ].join(' ')}
      >
        {unread && !a.pinned ? (
          <span
            aria-hidden
            className="absolute inset-y-3 left-0 w-[2px] rounded-r-sm bg-terracotta"
          />
        ) : null}
        <button
          type="button"
          onClick={onToggle}
          className="block w-full text-left"
          aria-expanded={expanded}
        >
          <div className="flex flex-wrap items-center gap-2">
            {a.pinned ? (
              <span className="inline-flex items-center gap-1 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-terracotta">
                <Pin className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                Pinned
              </span>
            ) : null}
            {isUrgent ? (
              <span className="rounded-sm bg-terracotta px-1.5 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-cream">
                Urgent
              </span>
            ) : (
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-earth">
                {a.category}
              </span>
            )}
            <span className="font-sans text-[12px] text-stone">· {a.publishedAgo}</span>
            <span className="font-sans text-[12px] text-stone">· {a.author}</span>
            {unread ? (
              <span className="ml-auto rounded-full bg-terracotta px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-cream">
                new
              </span>
            ) : null}
          </div>
          <h3
            className={[
              'mt-3 font-display text-[22px] md:text-[26px] leading-snug',
              unread ? 'text-ink' : 'text-stone',
            ].join(' ')}
          >
            {a.title}
          </h3>
          <p
            className={[
              'mt-2 font-serif text-[15px] text-stone',
              expanded ? '' : 'line-clamp-2',
            ].join(' ')}
          >
            {a.body}
          </p>
        </button>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onToggle}
            className="font-sans text-[13px] font-medium text-terracotta hover:text-earth"
          >
            {expanded ? 'Show less' : 'Read more →'}
          </button>
          {isUrgent ? (
            acknowledged ? (
              <span className="inline-flex items-center gap-1 rounded border border-ok/40 bg-[#F0F6F2] px-3 py-1 font-sans text-[12px] font-medium text-ok">
                <Check className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                Acknowledged
              </span>
            ) : (
              <button
                type="button"
                onClick={onAcknowledge}
                className="inline-flex h-8 items-center rounded border border-terracotta/40 bg-sand-light px-3 font-sans text-[12px] font-medium text-terracotta hover:bg-sand"
              >
                I have read this
              </button>
            )
          ) : null}
        </div>
      </article>
    </li>
  );
}
