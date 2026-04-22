import { Pin } from 'lucide-react';

import { STUDENT_ANNOUNCEMENTS } from '@/lib/mock/student-extras';

import { EditorialCard, SectionEyebrow } from '@/components/student/primitives';

const FILTERS = ['All', 'Urgent', 'Academic', 'Events', 'Unread'] as const;

/**
 * Announcements feed — §12 of the spec.
 *
 * Filter chips along the top; pinned urgent announcements rise to the top
 * with a 3px Terracotta top-border + Sand Light fill + "PINNED" tag.
 * Unread rows get a 2px Terracotta left-border; read rows fade slightly.
 */
export default function AnnouncementsFeedPage() {
  return (
    <div className="space-y-8">
      <header>
        <SectionEyebrow>Announcements</SectionEyebrow>
        <h1 className="mt-2 font-display text-[clamp(1.75rem,3vw,2.25rem)] text-ink">
          What the school is saying,{' '}
          <span className="italic font-light text-terracotta">openly.</span>
        </h1>
      </header>

      {/* Filter chips */}
      <div role="tablist" aria-label="Filter announcements" className="flex flex-wrap gap-2">
        {FILTERS.map((f, i) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={i === 0}
            className={[
              'inline-flex h-8 items-center rounded-full px-4 font-sans text-[13px] font-medium transition-colors',
              i === 0
                ? 'bg-ink text-cream'
                : 'border border-sand bg-white text-stone hover:bg-sand-light',
            ].join(' ')}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Feed */}
      <ul className="space-y-3">
        {STUDENT_ANNOUNCEMENTS.map((a) => (
          <li key={a.id}>
            <article
              className={[
                'relative rounded border px-6 py-5 transition-all duration-200 ease-out-soft hover:shadow-e2',
                a.pinned
                  ? 'border-t-[3px] border-t-terracotta border-x-sand border-b-sand bg-sand-light/40'
                  : a.unread
                  ? 'border-sand bg-white'
                  : 'border-sand-light bg-white',
              ].join(' ')}
            >
              {a.unread && !a.pinned ? (
                <span aria-hidden className="absolute inset-y-3 left-0 w-[2px] rounded-r-sm bg-terracotta" />
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
                <span className="font-sans text-[12px] text-stone">· {a.publishedAgo}</span>
                <span className="font-sans text-[12px] text-stone">· {a.author}</span>
              </div>
              <h3
                className={[
                  'mt-3 font-display text-[22px] md:text-[26px] leading-snug',
                  a.unread ? 'text-ink' : 'text-stone',
                ].join(' ')}
              >
                {a.title}
              </h3>
              <p className="mt-2 line-clamp-2 font-serif text-[15px] text-stone">{a.body}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <a href="#" className="landing-link font-sans text-[13px] font-medium text-terracotta">
                  Read more →
                </a>
                {a.category === 'Urgent' && !a.acknowledged ? (
                  <button
                    type="button"
                    className="inline-flex h-8 items-center rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
                  >
                    I have read this
                  </button>
                ) : null}
              </div>
            </article>
          </li>
        ))}
      </ul>

      <EditorialCard className="p-4 text-center">
        <button type="button" className="font-sans text-[13px] text-stone hover:text-ink">
          Load older announcements
        </button>
      </EditorialCard>
    </div>
  );
}
