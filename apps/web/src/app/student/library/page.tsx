'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  BookMarked,
  BookOpen,
  Bookmark,
  Download,
  FileText,
  PlayCircle,
  Search,
  X,
} from 'lucide-react';

import { RESOURCES, SUBJECTS, type DemoResource } from '@/lib/mock/fixtures';

import { EditorialCard, SectionEyebrow } from '@/components/student/primitives';

/**
 * Library — §08 of the spec.
 *
 * Universal search · subject browse · recently opened · full list. Bookmark
 * state and "recently opened" carry through the session so the page feels
 * alive. Clicking a resource opens a preview modal.
 */

const KIND_ICON: Record<DemoResource['kind'], React.ElementType> = {
  Textbook: BookOpen,
  Notes: FileText,
  'Past Paper': FileText,
  Video: PlayCircle,
  Worksheet: FileText,
};

export default function LibraryPage() {
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState<string>('ALL');
  const [bookmarks, setBookmarks] = useState<Set<string>>(
    () => new Set(RESOURCES.filter((r) => r.bookmarked).map((r) => r.id)),
  );
  const [recent, setRecent] = useState<string[]>(['r1', 'r4', 'r3', 'r6']);
  const [preview, setPreview] = useState<DemoResource | null>(null);

  const subjectCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of RESOURCES) c[r.subjectCode] = (c[r.subjectCode] ?? 0) + 1;
    return c;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RESOURCES.filter((r) => {
      if (subject !== 'ALL' && r.subjectCode !== subject) return false;
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        r.kind.toLowerCase().includes(q) ||
        r.subjectCode.toLowerCase().includes(q)
      );
    });
  }, [query, subject]);

  const recentlyOpened = useMemo(
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

  return (
    <div className="space-y-8">
      <header>
        <SectionEyebrow>Library</SectionEyebrow>
        <h1 className="mt-2 font-display text-[clamp(1.75rem,3vw,2.25rem)] text-ink">
          Everything to read,{' '}
          <span className="italic font-light text-terracotta">in one place.</span>
        </h1>
        <p className="mt-2 font-sans text-[13px] text-stone">
          {RESOURCES.length} resources · {bookmarks.size} bookmarked · works offline for bookmarked items
        </p>
      </header>

      {/* Search */}
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone"
          strokeWidth={1.5}
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search textbooks, notes, past papers…"
          className="h-14 w-full rounded border border-sand bg-white pl-12 pr-12 font-serif text-[18px] text-ink placeholder-stone focus:border-terracotta focus:outline-none"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1.5 text-stone hover:bg-sand-light hover:text-ink"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        ) : null}
      </div>

      {/* Subject browse */}
      <section>
        <SectionEyebrow>Subjects</SectionEyebrow>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <li>
            <button
              type="button"
              onClick={() => setSubject('ALL')}
              className={[
                'group block h-full w-full rounded border bg-white p-5 text-left transition-all duration-200 ease-out-soft hover:-translate-y-px hover:shadow-e2',
                subject === 'ALL' ? 'border-terracotta bg-sand-light/70' : 'border-sand',
              ].join(' ')}
            >
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                All
              </p>
              <p className="mt-1 font-display text-[20px] text-ink group-hover:text-earth">
                Everything
              </p>
              <p className="mt-4 font-sans text-[13px] text-stone">{RESOURCES.length} resources</p>
            </button>
          </li>
          {SUBJECTS.slice(0, 7).map((s) => {
            const count = subjectCounts[s.code] ?? 0;
            const active = subject === s.code;
            return (
              <li key={s.code}>
                <button
                  type="button"
                  onClick={() => setSubject(s.code)}
                  className={[
                    'group block h-full w-full rounded border bg-white p-5 text-left transition-all duration-200 ease-out-soft hover:-translate-y-px hover:shadow-e2',
                    active ? 'border-terracotta bg-sand-light/70' : 'border-sand',
                  ].join(' ')}
                >
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                    {s.code}
                  </p>
                  <p className="mt-1 font-display text-[20px] text-ink group-hover:text-earth">
                    {s.name}
                  </p>
                  <p className="mt-4 font-sans text-[13px] text-stone">
                    {count} resource{count === 1 ? '' : 's'}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Recently opened */}
      {recentlyOpened.length > 0 ? (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <SectionEyebrow>Recently opened</SectionEyebrow>
            <span className="font-sans text-[12px] text-stone">
              Continues from your last session
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {recentlyOpened.map((r) => {
              const Icon = KIND_ICON[r.kind];
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => open(r)}
                  className="group flex w-[280px] flex-none flex-col gap-3 rounded border border-sand bg-white p-5 text-left transition-all duration-200 ease-out-soft hover:-translate-y-px hover:shadow-e2"
                >
                  <div className="flex h-24 items-center justify-center rounded bg-sand-light">
                    <Icon className="h-8 w-8 text-earth" strokeWidth={1.25} aria-hidden />
                  </div>
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                    {r.kind}
                  </p>
                  <p className="font-display text-[15px] leading-snug text-ink line-clamp-2 group-hover:text-earth">
                    {r.title}
                  </p>
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* Full list */}
      <EditorialCard className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-sand px-6 py-4">
          <SectionEyebrow>
            {subject === 'ALL'
              ? 'All resources'
              : `${SUBJECTS.find((s) => s.code === subject)?.name ?? subject} resources`}
          </SectionEyebrow>
          <span className="font-sans text-[12px] text-stone">{filtered.length} items</span>
        </div>
        {filtered.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-display text-[18px] text-ink">No matches.</p>
            <p className="mt-2 font-sans text-[13px] text-stone">
              Try another subject or simpler keywords.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-sand-light">
            {filtered.map((r) => {
              const Icon = KIND_ICON[r.kind];
              const bookmarked = bookmarks.has(r.id);
              return (
                <li key={r.id} className="group flex items-center gap-4 px-6 py-4 hover:bg-sand-light/40">
                  <button
                    type="button"
                    onClick={() => open(r)}
                    className="flex min-w-0 flex-1 items-center gap-4 text-left"
                  >
                    <div className="flex h-10 w-10 flex-none items-center justify-center rounded bg-sand-light">
                      <Icon className="h-5 w-5 text-earth" strokeWidth={1.5} aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-[17px] text-ink group-hover:text-earth">
                        {r.title}
                      </p>
                      <p className="mt-0.5 font-sans text-[12px] text-stone">
                        {r.subjectCode} · {r.kind} · {r.size ?? r.duration} · updated{' '}
                        {new Date(r.updatedAt).toLocaleDateString('en-ZW', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                    </div>
                  </button>
                  {bookmarked ? (
                    <span className="inline-flex items-center gap-1 rounded-sm bg-sand-light px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-earth">
                      <BookMarked className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                      Offline
                    </span>
                  ) : null}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleBookmark(r.id)}
                      aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark'}
                      aria-pressed={bookmarked}
                      className={[
                        'rounded p-2 transition-colors',
                        bookmarked
                          ? 'text-terracotta hover:bg-sand-light'
                          : 'text-stone hover:bg-sand hover:text-terracotta',
                      ].join(' ')}
                    >
                      <Bookmark
                        className="h-4 w-4"
                        strokeWidth={1.5}
                        fill={bookmarked ? 'currentColor' : 'none'}
                      />
                    </button>
                    <button
                      type="button"
                      aria-label="Download"
                      className="rounded p-2 text-stone hover:bg-sand hover:text-earth"
                    >
                      <Download className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </EditorialCard>

      {/* Preview modal */}
      {preview ? (
        <ResourcePreview
          resource={preview}
          onClose={() => setPreview(null)}
          bookmarked={bookmarks.has(preview.id)}
          onToggleBookmark={() => toggleBookmark(preview.id)}
        />
      ) : null}
    </div>
  );
}

function ResourcePreview({
  resource,
  onClose,
  bookmarked,
  onToggleBookmark,
}: {
  resource: DemoResource;
  onClose: () => void;
  bookmarked: boolean;
  onToggleBookmark: () => void;
}) {
  const Icon = KIND_ICON[resource.kind];
  const subject = SUBJECTS.find((s) => s.code === resource.subjectCode);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded bg-white shadow-e3"
      >
        <div className="flex items-center justify-between gap-4 border-b border-sand px-6 py-4">
          <div className="min-w-0 flex-1">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">
              {resource.subjectCode} · {resource.kind}
            </p>
            <h2 className="mt-1 truncate font-display text-[18px] text-ink">
              {resource.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="rounded p-2 text-stone transition-colors hover:bg-sand-light hover:text-ink"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-sand-light/40 p-8">
          <figure className="mx-auto max-w-[560px] rounded bg-white p-10 shadow-e2">
            <div className="flex h-64 items-center justify-center rounded border border-sand bg-sand-light">
              <Icon className="h-20 w-20 text-earth" strokeWidth={1.25} aria-hidden />
            </div>
            <figcaption className="mt-6 space-y-3">
              <p className="font-display text-[20px] leading-snug text-ink">{resource.title}</p>
              <p className="font-serif text-[15px] leading-relaxed text-stone">
                {stubSummary(resource)}
              </p>
              <ul className="font-sans text-[12px] text-stone">
                <li>Subject · {subject?.name ?? resource.subjectCode}</li>
                <li>Teacher · {subject?.teacher ?? 'HHA faculty'}</li>
                <li>Type · {resource.kind}</li>
                <li>
                  Size · {resource.size ?? resource.duration} · updated{' '}
                  {new Date(resource.updatedAt).toLocaleDateString('en-ZW', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </li>
              </ul>
            </figcaption>
          </figure>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-sand bg-white px-6 py-4">
          <button
            type="button"
            onClick={onToggleBookmark}
            className={[
              'inline-flex h-10 items-center gap-2 rounded border px-3 font-sans text-[13px] font-medium transition-colors',
              bookmarked
                ? 'border-terracotta bg-sand-light text-terracotta hover:bg-sand'
                : 'border-sand bg-white text-earth hover:bg-sand-light',
            ].join(' ')}
          >
            <Bookmark
              className="h-4 w-4"
              strokeWidth={1.5}
              fill={bookmarked ? 'currentColor' : 'none'}
            />
            {bookmarked ? 'Bookmarked · offline' : 'Bookmark · keep offline'}
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-earth hover:bg-sand-light"
          >
            <Download className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            Download
          </button>
          <Link
            href={`/student/library?subject=${resource.subjectCode}`}
            onClick={onClose}
            className="ml-auto font-sans text-[12px] font-medium text-earth hover:text-terracotta"
          >
            See more {resource.subjectCode} resources
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
