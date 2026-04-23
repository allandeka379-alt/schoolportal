'use client';

import { useMemo, useState } from 'react';
import { Check, CheckCircle2, Languages, Pin } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
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
 * Parent announcements — card-dense redesign.
 *
 *   - KPI tiles (Total / Unread / Urgent / Needs ack)
 *   - Pill filter bar with counters
 *   - Card feed, urgent items tinted warning
 *   - Translate toggle per-item, acknowledge flow
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

  const needsAck = useMemo(() => {
    return PARENT_ANNOUNCEMENTS.filter((a) => a.requiresAcknowledgement && !(acknowledged[a.id] || a.acknowledged)).length;
  }, [acknowledged]);

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
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-small text-muted">Announcements</p>
          <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-ink">
            From the school, to parents
          </h1>
          <p className="mt-2 text-small text-muted">
            Curated by the Headmaster&rsquo;s office, the bursary, and the teaching staff.
          </p>
        </div>
        {counts.Unread > 0 ? (
          <button
            type="button"
            onClick={markAllRead}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface"
          >
            <Check className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            Mark all as read
          </button>
        ) : null}
      </header>

      {/* KPI tiles */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiTile label="Total" value={String(counts.All)} sub="All-time" />
        <KpiTile
          label="Unread"
          value={String(counts.Unread)}
          sub={counts.Unread === 0 ? 'Inbox zero' : 'Tap to open'}
          tone={counts.Unread > 0 ? 'brand' : 'success'}
        />
        <KpiTile
          label="Urgent"
          value={String(counts.Urgent ?? 0)}
          sub="Require attention"
          tone={(counts.Urgent ?? 0) > 0 ? 'warning' : undefined}
        />
        <KpiTile
          label="Need acknowledgement"
          value={String(needsAck)}
          sub={needsAck === 0 ? 'All signed' : 'Tap to confirm'}
          tone={needsAck > 0 ? 'warning' : 'success'}
        />
      </ul>

      {/* Filter chips */}
      <div
        role="tablist"
        aria-label="Filter announcements"
        className="flex flex-wrap gap-2"
      >
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
                'inline-flex h-9 items-center gap-2 rounded-full px-4 text-small font-semibold transition-colors',
                active
                  ? 'bg-brand-primary text-white shadow-card-sm'
                  : 'border border-line bg-card text-ink hover:bg-surface',
              ].join(' ')}
            >
              {f}
              <span
                className={[
                  'rounded-full px-1.5 py-0.5 text-micro tabular-nums',
                  active ? 'bg-white/20 text-white' : 'bg-surface text-muted',
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
        <div className="rounded-lg border border-line bg-card px-6 py-10 text-center shadow-card-sm">
          <p className="text-small text-muted">No announcements match that filter.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((a) => {
            const isRead = read.has(a.id);
            const isExpanded = expanded.has(a.id);
            const isTranslated = translated.has(a.id);
            const isAcknowledged = acknowledged[a.id] || a.acknowledged;
            const isUrgent = a.category === 'Urgent';
            return (
              <li key={a.id}>
                <article
                  className={[
                    'relative rounded-lg border p-5 shadow-card-sm transition-all duration-200 ease-out',
                    isUrgent
                      ? 'border-warning/30 bg-warning/[0.04]'
                      : a.pinned
                      ? 'border-brand-primary/30 bg-brand-primary/[0.04]'
                      : !isRead
                      ? 'border-line bg-card hover:border-brand-primary/30 hover:shadow-card-md'
                      : 'border-line bg-card',
                  ].join(' ')}
                >
                  {!isRead && !a.pinned && !isUrgent ? (
                    <span
                      aria-hidden
                      className="absolute inset-y-3 left-0 w-[3px] rounded-r-sm bg-brand-primary"
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
                        <Badge tone="brand" dot>
                          <Pin className="mr-1 inline-block h-3 w-3" strokeWidth={1.75} aria-hidden />
                          Pinned
                        </Badge>
                      ) : null}
                      {isUrgent ? (
                        <Badge tone="danger" dot>
                          Urgent
                        </Badge>
                      ) : (
                        <Badge
                          tone={
                            a.category === 'Fees'
                              ? 'warning'
                              : a.category === 'Event'
                              ? 'info'
                              : 'brand'
                          }
                          dot
                        >
                          {a.category}
                        </Badge>
                      )}
                      <span className="text-micro text-muted">· {a.ago}</span>
                      <span className="text-micro text-muted">· {a.author}</span>
                      {!isRead ? (
                        <Badge tone="brand" dot>
                          New
                        </Badge>
                      ) : null}
                    </div>

                    <h3
                      className={[
                        'mt-3 text-h3 leading-snug',
                        !isRead ? 'text-ink' : 'text-muted',
                      ].join(' ')}
                    >
                      {a.title}
                    </h3>
                    <p
                      className={[
                        'mt-2 text-small leading-relaxed text-muted',
                        isExpanded ? '' : 'line-clamp-2',
                      ].join(' ')}
                    >
                      {isTranslated ? translate(a.body) : a.body}
                    </p>
                  </button>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleExpanded(a.id)}
                      className="text-small font-semibold text-brand-primary hover:underline underline-offset-4"
                    >
                      {isExpanded ? 'Show less' : 'Read more →'}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleTranslate(a.id)}
                      className={[
                        'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-micro font-semibold transition-colors',
                        isTranslated
                          ? 'border-brand-primary/30 bg-brand-primary/5 text-brand-primary'
                          : 'border-line bg-card text-muted hover:bg-surface hover:text-ink',
                      ].join(' ')}
                    >
                      <Languages className="h-3 w-3" strokeWidth={1.75} aria-hidden />
                      {isTranslated ? 'Showing Shona' : 'Translate'}
                    </button>
                    {a.requiresAcknowledgement ? (
                      isAcknowledged ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/5 px-3 py-1 text-micro font-semibold text-success">
                          <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                          You acknowledged this
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => acknowledge(a.id)}
                          className="inline-flex h-8 items-center rounded-full border border-warning/30 bg-warning/5 px-3 text-micro font-semibold text-warning transition-colors hover:bg-warning/10"
                        >
                          I have read this
                        </button>
                      )
                    ) : null}
                  </div>

                  {isExpanded ? (
                    <div className="mt-4 border-t border-line pt-3">
                      <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
                        Details
                      </p>
                      <p className="mt-2 text-micro text-muted">
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

function translate(body: string): string {
  return body
    .replace(/Term 2/g, 'Chikamu 2')
    .replace(/school/gi, 'chikoro')
    .replace(/parents/gi, 'vabereki')
    .replace(/fees/gi, 'mari yechikoro')
    .replace(/please/gi, 'tapota');
}
