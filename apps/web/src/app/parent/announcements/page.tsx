'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, Languages, Pin } from 'lucide-react';

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
 *   - Translate toggle for non-English announcements
 */
export default function ParentAnnouncementsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  const [acknowledged, setAcknowledged] = useState<Record<string, boolean>>({});

  const items = useMemo(() => {
    let list: readonly ParentAnnouncement[] = PARENT_ANNOUNCEMENTS;
    if (filter === 'Unread') list = list.filter((a) => a.unread);
    else if (filter !== 'All') list = list.filter((a) => a.category === filter);

    return [...list].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      if (a.unread !== b.unread) return a.unread ? -1 : 1;
      return b.publishedAt.localeCompare(a.publishedAt);
    });
  }, [filter]);

  return (
    <div className="space-y-6">
      <ParentPageHeader
        eyebrow="Announcements"
        title="From the school,"
        accent="to parents."
        subtitle="Curated by the Headmaster's office, the bursary, and the teaching staff."
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
                'inline-flex h-8 items-center rounded-full px-4 font-sans text-[13px] font-medium transition-colors',
                active
                  ? 'bg-ink text-cream'
                  : 'border border-sand bg-white text-stone hover:bg-sand-light',
              ].join(' ')}
            >
              {f}
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
            const isAcknowledged = acknowledged[a.id] || a.acknowledged;
            return (
              <li key={a.id}>
                <article
                  className={[
                    'relative rounded border px-6 py-5 transition-all duration-200 ease-out-soft hover:shadow-e2',
                    a.pinned
                      ? 'border-t-[2px] border-t-terracotta border-x-sand border-b-sand bg-sand-light/50'
                      : a.unread
                      ? 'border-sand bg-white'
                      : 'border-sand-light bg-white',
                  ].join(' ')}
                >
                  {a.unread && !a.pinned ? (
                    <span
                      aria-hidden
                      className="absolute inset-y-3 left-0 w-[2px] rounded-r-sm bg-terracotta"
                    />
                  ) : null}
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
                    <button
                      type="button"
                      className="ml-auto inline-flex items-center gap-1 rounded border border-sand bg-white px-2 py-0.5 font-sans text-[11px] font-medium text-earth hover:bg-sand-light"
                    >
                      <Languages className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                      Translate
                    </button>
                  </div>

                  <h3
                    className={[
                      'mt-3 font-display leading-snug',
                      'text-[22px] md:text-[26px]',
                      a.unread ? 'text-ink' : 'text-stone',
                    ].join(' ')}
                  >
                    {a.title}
                  </h3>
                  <p className="mt-2 font-serif text-[15px] leading-relaxed text-stone">
                    {a.body}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <a href="#" className="landing-link font-sans text-[13px] font-medium text-terracotta">
                      Read more →
                    </a>
                    {a.requiresAcknowledgement ? (
                      isAcknowledged ? (
                        <span className="inline-flex items-center gap-1.5 rounded border border-sand bg-white px-3 py-1 font-sans text-[12px] font-medium text-ok">
                          <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                          You acknowledged this
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setAcknowledged((prev) => ({ ...prev, [a.id]: true }))}
                          className="inline-flex h-8 items-center rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
                        >
                          I have read this
                        </button>
                      )
                    ) : null}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
