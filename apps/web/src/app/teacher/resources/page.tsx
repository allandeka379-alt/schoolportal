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

import { Badge } from '@/components/ui/badge';

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

const KIND_META: Record<Kind, { icon: React.ElementType; tone: 'brand' | 'success' | 'warning' | 'info' | 'gold' }> = {
  Notes: { icon: FileText, tone: 'brand' },
  'Past Paper': { icon: FileText, tone: 'warning' },
  Video: { icon: PlayCircle, tone: 'info' },
  Worksheet: { icon: FileText, tone: 'success' },
  Interactive: { icon: PlayCircle, tone: 'gold' },
};

const TONE_BG: Record<'brand' | 'success' | 'warning' | 'info' | 'gold', string> = {
  brand: 'bg-brand-primary/10 text-brand-primary',
  success: 'bg-success/10 text-success',
  info: 'bg-info/10 text-info',
  warning: 'bg-warning/10 text-warning',
  gold: 'bg-brand-accent/15 text-brand-accent',
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

  const publishedCount = mine.filter((r) => r.visibility === 'class').length;
  const examReleaseCount = mine.filter((r) => r.visibility === 'exam-release').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-small text-muted">Resources</p>
          <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-ink">
            Your library, and the department&rsquo;s
          </h1>
          <p className="mt-2 text-small text-muted">
            {mine.length} items in your library · {publishedCount} published to students
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-primary px-5 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md"
        >
          <Upload className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          Upload
        </button>
      </header>

      {/* KPI tiles */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiTile label="Your library" value={String(mine.length)} sub="Items on file" />
        <KpiTile label="Published" value={String(publishedCount)} sub="Class resources" tone="success" />
        <KpiTile label="Exam releases" value={String(examReleaseCount)} sub="Scheduled drop" tone="warning" />
        <KpiTile label="Department" value={String(DEPARTMENT.length)} sub="Shared items" tone="brand" />
      </ul>

      {flash ? (
        <div className="rounded-lg border border-success/30 bg-success/[0.04] px-4 py-2.5 text-small text-ink">
          <Check className="mr-2 inline-block h-3.5 w-3.5 text-success" strokeWidth={2} aria-hidden />
          {flash}
        </div>
      ) : null}

      {/* Tabs */}
      <nav aria-label="Resources tabs" className="inline-flex gap-1 rounded-full bg-surface p-1">
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
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={[
                'inline-flex h-10 items-center gap-2 rounded-full px-4 text-small font-semibold transition-colors',
                active ? 'bg-card text-ink shadow-card-sm' : 'text-muted hover:text-ink',
              ].join(' ')}
            >
              {t.label}
              <span
                className={[
                  'rounded-full px-1.5 py-0.5 text-micro tabular-nums',
                  active ? 'bg-brand-primary/10 text-brand-primary' : 'bg-card/60 text-muted',
                ].join(' ')}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Search + filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[260px] flex-1 sm:max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            strokeWidth={1.75}
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search resources…"
            className="h-11 w-full rounded-full border border-line bg-card pl-9 pr-9 text-small text-ink placeholder:text-muted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted transition-colors hover:bg-surface hover:text-ink"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.75} />
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
                'inline-flex h-9 items-center rounded-full px-3 text-micro font-semibold transition-colors',
                kindFilter === k
                  ? 'bg-brand-primary text-white shadow-card-sm'
                  : 'border border-line bg-card text-ink hover:bg-surface',
              ].join(' ')}
            >
              {k}
            </button>
          ))}
        </div>

        <select
          value={formFilter}
          onChange={(e) => setFormFilter(e.target.value as (typeof FORMS)[number])}
          className="h-10 rounded-full border border-line bg-card px-3 text-small font-semibold text-ink transition-colors hover:bg-surface focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
        >
          {FORMS.map((f) => (
            <option key={f} value={f}>
              {f === 'All forms' ? f : `Form ${f}`}
            </option>
          ))}
        </select>
      </div>

      {/* Resource list */}
      <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
        {filtered.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-h3 text-ink">No matches.</p>
            <p className="mt-2 text-small text-muted">
              Try clearing a filter or uploading something new.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {filtered.map((r) => {
              const meta = KIND_META[r.kind];
              const Icon = meta.icon;
              const isAdded = added.has(r.id) || mine.some((m) => m.id === r.id);
              const isDownloaded = downloaded.has(r.id);
              return (
                <li
                  key={r.id}
                  className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface/40"
                >
                  <span className={`inline-flex h-10 w-10 flex-none items-center justify-center rounded-md ${TONE_BG[meta.tone]}`}>
                    <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={meta.tone} dot>
                        {r.kind}
                      </Badge>
                      {r.visibility === 'private' ? (
                        <Badge tone="neutral" dot>
                          Private
                        </Badge>
                      ) : r.visibility === 'exam-release' ? (
                        <Badge tone="warning" dot>
                          Exam release
                        </Badge>
                      ) : null}
                    </div>
                    <p className="mt-1 truncate text-small font-semibold text-ink transition-colors group-hover:text-brand-primary">
                      {r.title}
                    </p>
                    <p className="mt-0.5 text-micro text-muted">
                      {r.size}
                      {r.publishedTo ? ` · Published to ${r.publishedTo}` : ''}
                      {r.contributor ? ` · ${r.contributor}` : ''}
                      {r.form ? ` · Form ${r.form}` : ''}
                    </p>
                    {r.openedBy !== undefined && r.outOf !== undefined ? (
                      <p className="mt-1 flex items-center gap-1.5 text-micro text-success">
                        <Eye className="h-3 w-3" strokeWidth={1.75} aria-hidden />
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
                        'rounded-full p-2 transition-colors',
                        isDownloaded
                          ? 'bg-success/10 text-success'
                          : 'text-muted hover:bg-surface hover:text-ink',
                      ].join(' ')}
                    >
                      {isDownloaded ? (
                        <Check className="h-4 w-4" strokeWidth={2} />
                      ) : (
                        <Download className="h-4 w-4" strokeWidth={1.75} />
                      )}
                    </button>
                    {tab === 'department' ? (
                      isAdded ? (
                        <span className="inline-flex h-8 items-center gap-1 rounded-full border border-success/30 bg-success/5 px-3 text-micro font-semibold text-success">
                          <Check className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                          In your library
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addToMine(r)}
                          className="inline-flex h-8 items-center gap-1 rounded-full border border-line bg-card px-3 text-micro font-semibold text-ink transition-colors hover:bg-surface"
                        >
                          <Plus className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
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
      </section>
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
