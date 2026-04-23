'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  BookMarked,
  BookOpen,
  Bookmark,
  Check,
  Download,
  FileText,
  Loader2,
  PlayCircle,
  Search,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { RESOURCES, SUBJECTS, type DemoResource } from '@/lib/mock/fixtures';

/**
 * Library — card-dense redesign.
 *
 *   Pill search bar · subject filter chips · bookmarked / all tabs
 *   Recently opened strip with colour-toned cards
 *   Full resource list as a card with coloured icon squares, kind/size
 *   metadata, download + bookmark actions, tap-to-preview
 */

const KIND_ICON: Record<DemoResource['kind'], React.ElementType> = {
  Textbook: BookOpen,
  Notes: FileText,
  'Past Paper': FileText,
  Video: PlayCircle,
  Worksheet: FileText,
};

const KIND_TONE: Record<DemoResource['kind'], 'brand' | 'info' | 'success' | 'warning' | 'gold'> = {
  Textbook: 'brand',
  Notes: 'info',
  'Past Paper': 'warning',
  Video: 'gold',
  Worksheet: 'success',
};

const KIND_STYLES: Record<'brand' | 'info' | 'success' | 'warning' | 'gold', string> = {
  brand: 'bg-brand-primary/10 text-brand-primary',
  info: 'bg-info/10 text-info',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  gold: 'bg-brand-accent/15 text-brand-accent',
};

type ViewTab = 'all' | 'bookmarked' | 'recent';

export default function LibraryPage() {
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState<string>('ALL');
  const [view, setView] = useState<ViewTab>('all');
  const [bookmarks, setBookmarks] = useState<Set<string>>(
    () => new Set(RESOURCES.filter((r) => r.bookmarked).map((r) => r.id)),
  );
  const [recent, setRecent] = useState<string[]>(['r1', 'r4', 'r3', 'r6']);
  const [preview, setPreview] = useState<DemoResource | null>(null);
  const [downloaded, setDownloaded] = useState<Set<string>>(new Set());
  const [downloading, setDownloading] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const subjectCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of RESOURCES) c[r.subjectCode] = (c[r.subjectCode] ?? 0) + 1;
    return c;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let base: readonly DemoResource[] = RESOURCES;
    if (view === 'bookmarked') base = RESOURCES.filter((r) => bookmarks.has(r.id));
    else if (view === 'recent') base = recent.map((id) => RESOURCES.find((r) => r.id === id)).filter((r): r is DemoResource => !!r);

    return base.filter((r) => {
      if (subject !== 'ALL' && r.subjectCode !== subject) return false;
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        r.kind.toLowerCase().includes(q) ||
        r.subjectCode.toLowerCase().includes(q)
      );
    });
  }, [query, subject, view, bookmarks, recent]);

  const recentResources = useMemo(
    () => recent.map((id) => RESOURCES.find((r) => r.id === id)).filter((r): r is DemoResource => !!r),
    [recent],
  );

  function toggleBookmark(id: string) {
    setBookmarks((curr) => {
      const next = new Set(curr);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function open(r: DemoResource) {
    setPreview(r);
    setRecent((curr) => [r.id, ...curr.filter((x) => x !== r.id)].slice(0, 6));
  }

  function download(id: string) {
    const resource = RESOURCES.find((r) => r.id === id);
    if (!resource) return;
    if (downloaded.has(id)) {
      setToast(`"${resource.title}" already saved to your device`);
      return;
    }
    setDownloading(id);
    setTimeout(() => {
      setDownloading(null);
      setDownloaded((curr) => {
        const next = new Set(curr);
        next.add(id);
        return next;
      });
      setToast(`Downloaded "${resource.title}"`);
    }, 900);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <p className="text-small text-muted">Past papers, lesson notes, recordings</p>
        <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-ink">
          Library
        </h1>
        <p className="mt-2 text-small text-muted">
          {RESOURCES.length} resources · {bookmarks.size} bookmarked · works offline for bookmarked items
        </p>
      </header>

      {/* Search */}
      <div className="relative max-w-[720px]">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
          strokeWidth={1.75}
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search textbooks, notes, past papers…"
          className="h-14 w-full rounded-full border border-line bg-card pl-12 pr-12 text-body text-ink placeholder-muted/80 shadow-card-sm transition-colors focus:border-brand-primary focus:outline-none focus:ring-4 focus:ring-brand-primary/10"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted hover:bg-surface hover:text-ink"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        ) : null}
      </div>

      {/* View tabs */}
      <div className="flex flex-wrap items-center gap-2 rounded-full border border-line bg-card p-1 shadow-card-sm w-fit">
        {(
          [
            { key: 'all' as const, label: 'All resources', count: RESOURCES.length },
            { key: 'bookmarked' as const, label: 'Bookmarked', count: bookmarks.size },
            { key: 'recent' as const, label: 'Recently opened', count: recentResources.length },
          ]
        ).map((t) => {
          const active = view === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setView(t.key)}
              className={[
                'inline-flex h-9 items-center gap-2 rounded-full px-4 text-small font-medium transition-colors',
                active ? 'bg-brand-primary text-white' : 'text-muted hover:text-ink',
              ].join(' ')}
            >
              {t.label}
              <span
                className={[
                  'rounded-full px-1.5 text-micro font-semibold tabular-nums',
                  active ? 'bg-white/20 text-white' : 'bg-surface text-muted',
                ].join(' ')}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Subject browse */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-h3 text-ink">Browse by subject</h2>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-9">
          <li>
            <button
              type="button"
              onClick={() => setSubject('ALL')}
              className={[
                'hover-lift flex h-full w-full flex-col gap-1.5 rounded-lg border bg-card p-3 text-left transition-colors',
                subject === 'ALL' ? 'border-brand-primary bg-brand-primary/5' : 'border-line',
              ].join(' ')}
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand-primary/10 text-brand-primary">
                <BookOpen className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </span>
              <p className="text-small font-semibold text-ink">All</p>
              <p className="text-micro text-muted">{RESOURCES.length}</p>
            </button>
          </li>
          {SUBJECTS.slice(0, 8).map((s) => {
            const count = subjectCounts[s.code] ?? 0;
            const active = subject === s.code;
            return (
              <li key={s.code}>
                <button
                  type="button"
                  onClick={() => setSubject(s.code)}
                  className={[
                    'hover-lift flex h-full w-full flex-col gap-1.5 rounded-lg border bg-card p-3 text-left transition-colors',
                    active ? 'border-brand-primary bg-brand-primary/5' : 'border-line',
                  ].join(' ')}
                >
                  <span className="text-micro font-semibold uppercase tracking-[0.12em] text-brand-primary">
                    {s.code}
                  </span>
                  <p className="text-small font-semibold text-ink">{s.name}</p>
                  <p className="text-micro text-muted">{count}</p>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Recently opened carousel */}
      {recentResources.length > 0 && view === 'all' ? (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-h3 text-ink">Recently opened</h2>
            <p className="text-small text-muted">Continues from your last session</p>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {recentResources.map((r) => {
              const Icon = KIND_ICON[r.kind];
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => open(r)}
                  className="hover-lift group flex w-[280px] flex-none flex-col gap-3 rounded-lg border border-line bg-card p-4 text-left shadow-card-sm"
                >
                  <div className={`flex h-24 items-center justify-center rounded-md ${KIND_STYLES[KIND_TONE[r.kind]]}`}>
                    <Icon className="h-10 w-10" strokeWidth={1.25} aria-hidden />
                  </div>
                  <div>
                    <p className="text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                      {r.kind}
                    </p>
                    <p className="mt-1 line-clamp-2 text-small font-semibold text-ink group-hover:text-brand-primary">
                      {r.title}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* Full list */}
      <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
        <header className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <div>
            <h2 className="text-small font-semibold text-ink">
              {subject === 'ALL' ? 'All resources' : `${SUBJECTS.find((s) => s.code === subject)?.name ?? subject}`}
            </h2>
            <p className="text-micro text-muted">{filtered.length} items</p>
          </div>
        </header>
        {filtered.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-small font-semibold text-ink">No matches.</p>
            <p className="mt-1 text-small text-muted">Try another subject or simpler keywords.</p>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {filtered.map((r) => {
              const Icon = KIND_ICON[r.kind];
              const bookmarked = bookmarks.has(r.id);
              const tone = KIND_TONE[r.kind];
              return (
                <li key={r.id} className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface">
                  <button
                    type="button"
                    onClick={() => open(r)}
                    className="flex min-w-0 flex-1 items-center gap-4 text-left"
                  >
                    <span className={`inline-flex h-10 w-10 flex-none items-center justify-center rounded-md ${KIND_STYLES[tone]}`}>
                      <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-small font-semibold text-ink group-hover:text-brand-primary">
                        {r.title}
                      </p>
                      <p className="text-micro text-muted">
                        {r.subjectCode} · {r.kind} · {r.size ?? r.duration} · updated{' '}
                        {new Date(r.updatedAt).toLocaleDateString('en-ZW', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                    </div>
                  </button>
                  {bookmarked ? (
                    <Badge tone="brand" dot>
                      <BookMarked className="h-3 w-3" strokeWidth={2} aria-hidden />
                      Offline
                    </Badge>
                  ) : null}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleBookmark(r.id)}
                      aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark'}
                      aria-pressed={bookmarked}
                      className={[
                        'rounded-md p-2 transition-colors',
                        bookmarked
                          ? 'text-brand-primary hover:bg-brand-primary/10'
                          : 'text-muted hover:bg-surface hover:text-brand-primary',
                      ].join(' ')}
                    >
                      <Bookmark
                        className="h-4 w-4"
                        strokeWidth={1.75}
                        fill={bookmarked ? 'currentColor' : 'none'}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => download(r.id)}
                      disabled={downloading === r.id}
                      aria-label="Download"
                      className={[
                        'rounded-md p-2 transition-colors disabled:opacity-60',
                        downloaded.has(r.id)
                          ? 'text-success hover:bg-success/10'
                          : 'text-muted hover:bg-surface hover:text-ink',
                      ].join(' ')}
                    >
                      {downloading === r.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                      ) : downloaded.has(r.id) ? (
                        <Check className="h-4 w-4" strokeWidth={2} />
                      ) : (
                        <Download className="h-4 w-4" strokeWidth={1.75} />
                      )}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Preview modal */}
      {preview ? (
        <ResourcePreview
          resource={preview}
          onClose={() => setPreview(null)}
          bookmarked={bookmarks.has(preview.id)}
          downloaded={downloaded.has(preview.id)}
          downloading={downloading === preview.id}
          onToggleBookmark={() => toggleBookmark(preview.id)}
          onDownload={() => download(preview.id)}
        />
      ) : null}

      {toast ? (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-micro font-semibold text-white shadow-card-md"
        >
          <Check className="mr-1 inline-block h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          {toast}
        </div>
      ) : null}
    </div>
  );
}

function ResourcePreview({
  resource,
  onClose,
  bookmarked,
  downloaded,
  downloading,
  onToggleBookmark,
  onDownload,
}: {
  resource: DemoResource;
  onClose: () => void;
  bookmarked: boolean;
  downloaded: boolean;
  downloading: boolean;
  onToggleBookmark: () => void;
  onDownload: () => void;
}) {
  const Icon = KIND_ICON[resource.kind];
  const subject = SUBJECTS.find((s) => s.code === resource.subjectCode);
  const tone = KIND_TONE[resource.kind];

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-card shadow-card-lg"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Badge tone={tone === 'gold' ? 'gold' : tone === 'warning' ? 'warning' : tone === 'success' ? 'success' : tone === 'info' ? 'info' : 'brand'}>
                {resource.kind}
              </Badge>
              <span className="text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                {resource.subjectCode}
              </span>
            </div>
            <h2 className="mt-2 truncate text-h3 text-ink">{resource.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="rounded-md p-2 text-muted transition-colors hover:bg-surface hover:text-ink"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-surface/50 p-6 sm:p-8">
          <figure className="mx-auto max-w-[560px] rounded-lg bg-card p-8 shadow-card-md">
            <div className={`flex h-56 items-center justify-center rounded-md ${KIND_STYLES[tone]}`}>
              <Icon className="h-16 w-16" strokeWidth={1.25} aria-hidden />
            </div>
            <figcaption className="mt-6 space-y-3">
              <p className="text-h3 text-ink">{resource.title}</p>
              <p className="text-small leading-relaxed text-muted">{stubSummary(resource)}</p>
              <dl className="grid grid-cols-2 gap-3 border-t border-line pt-3 text-small">
                <div>
                  <dt className="text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                    Subject
                  </dt>
                  <dd className="mt-0.5 text-ink">{subject?.name ?? resource.subjectCode}</dd>
                </div>
                <div>
                  <dt className="text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                    Teacher
                  </dt>
                  <dd className="mt-0.5 text-ink">{subject?.teacher ?? 'HHA faculty'}</dd>
                </div>
                <div>
                  <dt className="text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                    Size
                  </dt>
                  <dd className="mt-0.5 text-ink">{resource.size ?? resource.duration}</dd>
                </div>
                <div>
                  <dt className="text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                    Updated
                  </dt>
                  <dd className="mt-0.5 text-ink">
                    {new Date(resource.updatedAt).toLocaleDateString('en-ZW', {
                      day: 'numeric',
                      month: 'long',
                    })}
                  </dd>
                </div>
              </dl>
            </figcaption>
          </figure>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-line bg-card px-5 py-4">
          <button
            type="button"
            onClick={onToggleBookmark}
            className={[
              'inline-flex h-10 items-center gap-2 rounded-full px-4 text-small font-semibold transition-colors',
              bookmarked
                ? 'bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/15'
                : 'border border-line bg-card text-ink hover:bg-surface',
            ].join(' ')}
          >
            <Bookmark
              className="h-4 w-4"
              strokeWidth={1.75}
              fill={bookmarked ? 'currentColor' : 'none'}
            />
            {bookmarked ? 'Bookmarked · offline' : 'Bookmark · keep offline'}
          </button>
          <button
            type="button"
            onClick={onDownload}
            disabled={downloading}
            className={[
              'inline-flex h-10 items-center gap-2 rounded-full px-4 text-small font-semibold transition-colors disabled:opacity-60',
              downloaded
                ? 'bg-success/10 text-success hover:bg-success/15'
                : 'border border-line bg-card text-ink hover:bg-surface',
            ].join(' ')}
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} aria-hidden />
            ) : downloaded ? (
              <Check className="h-4 w-4" strokeWidth={2} aria-hidden />
            ) : (
              <Download className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            )}
            {downloading ? 'Downloading…' : downloaded ? 'Downloaded' : 'Download'}
          </button>
          <Link
            href={`/student/library?subject=${resource.subjectCode}`}
            onClick={onClose}
            className="ml-auto text-small font-semibold text-brand-primary hover:text-brand-primary/80"
          >
            See more {resource.subjectCode} →
          </Link>
        </div>
      </div>
    </div>
  );
}

function stubSummary(r: DemoResource): string {
  switch (r.kind) {
    case 'Textbook':
      return 'Core textbook — searchable, chapterised, with end-of-chapter exercises. Bookmark for offline access during boarding evenings.';
    case 'Past Paper':
      return 'Official past paper with the examiner\'s mark scheme. Work through in exam conditions — 2 hours, no calculator on Paper 1.';
    case 'Notes':
      return 'Teacher-prepared notes, reviewed by the HOD. Pair with the textbook for full coverage.';
    case 'Video':
      return 'Classroom recording. Use at 1.25× if you are revising. Captions are in English and Shona.';
    case 'Worksheet':
      return 'Printable worksheet. Students usually take 35 minutes. Submit via the assignments page once complete.';
    default:
      return '';
  }
}
