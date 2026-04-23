'use client';

import { useMemo, useState } from 'react';
import {
  Check,
  Download,
  Eye,
  FileText,
  PlayCircle,
  Plus,
  Search,
  Upload,
  X,
} from 'lucide-react';

import { EditorialCard } from '@/components/student/primitives';
import { TeacherPageHeader, TeacherStatusPill } from '@/components/teacher/primitives';

type Tab = 'mine' | 'department' | 'class';
type Kind = 'Notes' | 'Past Paper' | 'Video' | 'Worksheet' | 'Interactive';

interface Resource {
  id: string;
  title: string;
  kind: Kind;
  size: string;
  visibility: 'private' | 'department' | 'class' | 'exam-release';
  publishedTo?: string;
  openedBy?: number;
  outOf?: number;
  contributor?: string;
  form?: string;
}

const INITIAL_MINE: Resource[] = [
  { id: 'r-mine-1', title: 'Chapter 4: Functions — Lesson Notes', kind: 'Notes', size: '1.1 MB', visibility: 'class', publishedTo: '4A, 4B', openedBy: 28, outOf: 32, form: '4' },
  { id: 'r-mine-2', title: 'Worked Example — Completing the Square', kind: 'Video', size: '240 MB', visibility: 'private', form: '4' },
  { id: 'r-mine-3', title: 'Math 2024 Nov — with marking scheme', kind: 'Past Paper', size: '850 KB', visibility: 'exam-release', publishedTo: '4A', form: '4' },
  { id: 'r-mine-4', title: 'Algebra Worksheet 5', kind: 'Worksheet', size: '180 KB', visibility: 'class', publishedTo: '3B', openedBy: 18, outOf: 30, form: '3' },
];

const DEPARTMENT: readonly Resource[] = [
  { id: 'r-dep-1', title: 'Form 3 Maths Scheme of Work', kind: 'Notes', size: '540 KB', visibility: 'department', contributor: 'Mr Phiri (HOD)', form: '3' },
  { id: 'r-dep-2', title: 'O-Level Past Papers 2015–2023', kind: 'Past Paper', size: '12 MB', visibility: 'department', contributor: 'Mrs Nyoka', form: '4' },
  { id: 'r-dep-3', title: 'GeoGebra — Quadratic Explorer', kind: 'Interactive', size: '—', visibility: 'department', contributor: 'Mr Shoko', form: '4' },
  { id: 'r-dep-4', title: 'Form 4 Mid-term revision pack', kind: 'Worksheet', size: '2.4 MB', visibility: 'department', contributor: 'Mrs Dziva', form: '4' },
  { id: 'r-dep-5', title: 'ZIMSEC 2023 · Video walkthrough', kind: 'Video', size: '380 MB', visibility: 'department', contributor: 'Mr Phiri', form: '4' },
];

const KIND_ICON: Record<Kind, React.ElementType> = {
  Notes: FileText,
  'Past Paper': FileText,
  Video: PlayCircle,
  Worksheet: FileText,
  Interactive: PlayCircle,
};

const KIND_FILTERS: readonly ('All' | Kind)[] = [
  'All',
  'Notes',
  'Worksheet',
  'Past Paper',
  'Video',
  'Interactive',
];

const FORMS = ['All forms', '3', '4'] as const;

export default function TeacherResourcesPage() {
  const [tab, setTab] = useState<Tab>('mine');
  const [mine, setMine] = useState<Resource[]>(INITIAL_MINE);
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState('');
  const [kindFilter, setKindFilter] = useState<'All' | Kind>('All');
  const [formFilter, setFormFilter] = useState<(typeof FORMS)[number]>('All forms');
  const [downloaded, setDownloaded] = useState<Set<string>>(new Set());
  const [flash, setFlash] = useState<string | null>(null);

  const source = useMemo(() => {
    if (tab === 'mine') return mine;
    if (tab === 'department') return DEPARTMENT;
    return mine.filter((r) => r.visibility === 'class' || r.visibility === 'exam-release');
  }, [tab, mine]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return source.filter((r) => {
      if (kindFilter !== 'All' && r.kind !== kindFilter) return false;
      if (formFilter !== 'All forms' && r.form !== formFilter) return false;
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        r.kind.toLowerCase().includes(q) ||
        (r.contributor ?? '').toLowerCase().includes(q) ||
        (r.publishedTo ?? '').toLowerCase().includes(q)
      );
    });
  }, [source, query, kindFilter, formFilter]);

  function addToMine(r: Resource) {
    if (mine.some((m) => m.id === r.id)) return;
    setMine((curr) => [{ ...r, visibility: 'private', contributor: undefined }, ...curr]);
    setAdded((s) => {
      const next = new Set(s);
      next.add(r.id);
      return next;
    });
    setFlash(`Added "${r.title}" to your library`);
    setTimeout(() => setFlash(null), 2200);
  }

  function download(id: string, title: string) {
    setDownloaded((s) => {
      const next = new Set(s);
      next.add(id);
      return next;
    });
    setFlash(`Downloaded "${title}"`);
    setTimeout(() => setFlash(null), 2000);
  }

  return (
    <div className="space-y-8">
      <TeacherPageHeader
        eyebrow="Resources"
        title="Your library,"
        accent="and the department&rsquo;s."
        subtitle={`${mine.length} items in your library · ${mine.filter((r) => r.visibility === 'class').length} published to students`}
        right={
          <button type="button" className="btn-terracotta">
            <Upload className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            Upload
          </button>
        }
      />

      {flash ? (
        <div className="rounded border border-ok/40 bg-[#F0F6F2] px-4 py-2 font-sans text-[13px] text-ok">
          {flash}
        </div>
      ) : null}

      {/* Tabs */}
      <nav aria-label="Resources tabs" className="border-b border-sand">
        <ul className="flex flex-wrap gap-0">
          {(
            [
              { key: 'mine' as const, label: 'Mine', count: mine.length },
              { key: 'department' as const, label: 'Department library', count: DEPARTMENT.length },
              {
                key: 'class' as const,
                label: 'Class resources',
                count: mine.filter((r) => r.visibility === 'class' || r.visibility === 'exam-release').length,
              },
            ]
          ).map((t) => {
            const active = t.key === tab;
            return (
              <li key={t.key}>
                <button
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={[
                    'inline-flex h-11 items-center gap-2 border-b-[2px] px-4 font-sans text-[14px] transition-colors',
                    active
                      ? 'border-terracotta font-semibold text-ink'
                      : 'border-transparent text-stone hover:text-ink',
                  ].join(' ')}
                >
                  {t.label}
                  <span
                    className={[
                      'rounded-sm px-1.5 py-0.5 font-sans text-[11px] font-semibold tabular-nums',
                      active ? 'bg-sand text-earth' : 'bg-sand-light text-stone',
                    ].join(' ')}
                  >
                    {t.count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Search + filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone"
            strokeWidth={1.5}
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search resources…"
            className="h-10 w-full rounded border border-sand bg-white pl-9 pr-9 font-sans text-[13px] text-ink placeholder-stone focus:border-terracotta focus:outline-none"
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

        <div className="flex flex-wrap items-center gap-1">
          {KIND_FILTERS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKindFilter(k)}
              className={[
                'inline-flex h-9 items-center rounded-full px-3 font-sans text-[12px] font-medium transition-colors',
                kindFilter === k
                  ? 'bg-ink text-cream'
                  : 'border border-sand bg-white text-stone hover:bg-sand-light',
              ].join(' ')}
            >
              {k}
            </button>
          ))}
        </div>

        <select
          value={formFilter}
          onChange={(e) => setFormFilter(e.target.value as (typeof FORMS)[number])}
          className="h-9 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-earth hover:bg-sand-light focus:border-terracotta focus:outline-none"
        >
          {FORMS.map((f) => (
            <option key={f} value={f}>
              {f === 'All forms' ? f : `Form ${f}`}
            </option>
          ))}
        </select>
      </div>

      {/* Resource list */}
      <EditorialCard className="overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-display text-[18px] text-ink">No matches.</p>
            <p className="mt-2 font-sans text-[13px] text-stone">
              Try clearing a filter or uploading something new.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-sand-light">
            {filtered.map((r) => {
              const Icon = KIND_ICON[r.kind] ?? FileText;
              const isAdded = added.has(r.id) || mine.some((m) => m.id === r.id);
              const isDownloaded = downloaded.has(r.id);
              return (
                <li
                  key={r.id}
                  className="group flex items-center gap-4 px-6 py-4 hover:bg-sand-light/40"
                >
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded bg-sand-light">
                    <Icon className="h-5 w-5 text-earth" strokeWidth={1.5} aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                      {r.kind}
                      {r.visibility === 'private' ? (
                        <TeacherStatusPill state="draft" />
                      ) : r.visibility === 'exam-release' ? (
                        <TeacherStatusPill state="scheduled">Exam release</TeacherStatusPill>
                      ) : null}
                    </p>
                    <p className="mt-1 truncate font-display text-[17px] text-ink group-hover:text-earth">
                      {r.title}
                    </p>
                    <p className="mt-0.5 font-sans text-[12px] text-stone">
                      {r.size}
                      {r.publishedTo ? ` · Published to ${r.publishedTo}` : ''}
                      {r.contributor ? ` · ${r.contributor}` : ''}
                      {r.form ? ` · Form ${r.form}` : ''}
                    </p>
                    {r.openedBy !== undefined && r.outOf !== undefined ? (
                      <p className="mt-1 flex items-center gap-1.5 font-sans text-[11px] text-ok">
                        <Eye className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                        Opened by {r.openedBy} / {r.outOf} in your class
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => download(r.id, r.title)}
                      aria-label="Download"
                      className={[
                        'rounded p-2 transition-colors',
                        isDownloaded
                          ? 'text-ok hover:bg-[#E6F0E9]'
                          : 'text-stone hover:bg-sand hover:text-ink',
                      ].join(' ')}
                    >
                      {isDownloaded ? (
                        <Check className="h-4 w-4" strokeWidth={2} />
                      ) : (
                        <Download className="h-4 w-4" strokeWidth={1.5} />
                      )}
                    </button>
                    {tab === 'department' ? (
                      isAdded ? (
                        <span className="inline-flex h-8 items-center gap-1 rounded bg-[#E6F0E9] px-3 font-sans text-[12px] font-medium text-ok">
                          <Check className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                          In your library
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addToMine(r)}
                          className="inline-flex h-8 items-center rounded bg-sand px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
                        >
                          <Plus className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                          Add to mine
                        </button>
                      )
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </EditorialCard>
    </div>
  );
}
