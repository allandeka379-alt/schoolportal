import Link from 'next/link';
import { BookOpen, Bookmark, BookMarked, Download, FileText, PlayCircle, Search } from 'lucide-react';

import { RESOURCES, SUBJECTS } from '@/lib/mock/fixtures';

import { EditorialCard, SectionEyebrow } from '@/components/student/primitives';

const KIND_ICON = {
  Textbook: BookOpen,
  Notes: FileText,
  'Past Paper': FileText,
  Video: PlayCircle,
  Worksheet: FileText,
} as const;

/**
 * Library — §08 of the spec.
 *
 *  - Universal search bar at the top
 *  - Subject browse strip (4×2 on desktop)
 *  - Recently opened strip
 *  - Full resource list
 */
export default function LibraryPage() {
  return (
    <div className="space-y-8">
      <header>
        <SectionEyebrow>Library</SectionEyebrow>
        <h1 className="mt-2 font-display text-[clamp(1.75rem,3vw,2.25rem)] text-ink">
          Everything to read,{' '}
          <span className="italic font-light text-terracotta">in one place.</span>
        </h1>
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
          placeholder="Search textbooks, notes, past papers…"
          className="h-14 w-full rounded border border-sand bg-white pl-12 pr-4 font-serif text-[18px] text-ink placeholder-stone focus:border-terracotta focus:outline-none"
        />
      </div>

      {/* Subject browse */}
      <section>
        <SectionEyebrow>Subjects</SectionEyebrow>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
          {SUBJECTS.slice(0, 8).map((s) => {
            const count = RESOURCES.filter((r) => r.subjectCode === s.code).length || Math.floor(Math.random() * 20 + 18);
            return (
              <li key={s.code}>
                <Link
                  href={`/student/library?subject=${s.code}`}
                  className="group block h-full rounded border border-sand bg-white p-5 transition-all duration-200 ease-out-soft hover:-translate-y-px hover:shadow-e2"
                >
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                    {s.code}
                  </p>
                  <p className="mt-1 font-display text-[20px] text-ink group-hover:text-earth">
                    {s.name}
                  </p>
                  <p className="mt-4 font-sans text-[13px] text-stone">{count} resources</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Recently opened */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <SectionEyebrow>Recently opened</SectionEyebrow>
          <span className="font-sans text-[12px] text-stone">Continues from your last session</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {RESOURCES.slice(0, 6).map((r) => {
            const Icon = KIND_ICON[r.kind];
            return (
              <a
                key={r.id}
                href="#"
                className="group flex w-[280px] flex-none flex-col gap-3 rounded border border-sand bg-white p-5 transition-all duration-200 ease-out-soft hover:-translate-y-px hover:shadow-e2"
              >
                <div className="flex h-24 items-center justify-center rounded bg-sand-light">
                  <Icon className="h-8 w-8 text-earth" strokeWidth={1.25} aria-hidden />
                </div>
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                  {r.kind}
                </p>
                <p className="font-display text-[15px] leading-snug text-ink line-clamp-2">
                  {r.title}
                </p>
              </a>
            );
          })}
        </div>
      </section>

      {/* Full list */}
      <EditorialCard className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-sand px-6 py-4">
          <SectionEyebrow>All resources</SectionEyebrow>
          <span className="font-sans text-[12px] text-stone">{RESOURCES.length} items</span>
        </div>
        <ul className="divide-y divide-sand-light">
          {RESOURCES.map((r) => {
            const Icon = KIND_ICON[r.kind];
            return (
              <li key={r.id} className="group flex items-center gap-4 px-6 py-4 hover:bg-sand-light/40">
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded bg-sand-light">
                  <Icon className="h-5 w-5 text-earth" strokeWidth={1.5} aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-[17px] text-ink">{r.title}</p>
                  <p className="mt-0.5 font-sans text-[12px] text-stone">
                    {r.subjectCode} · {r.kind} · {r.size ?? r.duration} · updated{' '}
                    {new Date(r.updatedAt).toLocaleDateString('en-ZW', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                {r.bookmarked ? (
                  <span className="inline-flex items-center gap-1 rounded-sm bg-sand-light px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-earth">
                    <BookMarked className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                    Offline
                  </span>
                ) : null}
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    aria-label="Bookmark"
                    className="rounded p-2 text-stone hover:bg-sand hover:text-terracotta"
                  >
                    <Bookmark className="h-4 w-4" strokeWidth={1.5} />
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
      </EditorialCard>
    </div>
  );
}
