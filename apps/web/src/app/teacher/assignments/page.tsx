'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ChevronRight, Copy, Plus, Search, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { ClassChip, type TeacherStatusState } from '@/components/teacher/primitives';

type TabKey = 'active' | 'drafts' | 'scheduled' | 'archived';

interface AssignmentRow {
  id: string;
  title: string;
  classLabel: string;
  form: string;
  stream: string;
  tab: TabKey;
  status: TeacherStatusState;
  submitted: number;
  total: number;
  marked: number;
  dueLabel: string;
  releasedLabel?: string;
  subject?: string;
}

const ROWS: AssignmentRow[] = [
  {
    id: 'a-math-5',
    title: 'Problem Set 7 — Quadratic Equations',
    classLabel: 'Form 4A · Mathematics',
    form: '4',
    stream: 'A',
    tab: 'active',
    status: 'to-mark',
    submitted: 18,
    total: 32,
    marked: 4,
    dueLabel: 'due in 2 days',
    releasedLabel: 'released 18 Apr',
    subject: 'Mathematics',
  },
  {
    id: 'a-math-test2',
    title: 'Test 2 — Functions',
    classLabel: 'Form 4B · Mathematics',
    form: '4',
    stream: 'B',
    tab: 'active',
    status: 'marked',
    submitted: 28,
    total: 30,
    marked: 28,
    dueLabel: 'released 16 Apr',
    releasedLabel: 'ready to release',
    subject: 'Mathematics',
  },
  {
    id: 'a-math-4',
    title: 'Chapter 3 Worksheet',
    classLabel: 'Form 3B · Mathematics',
    form: '3',
    stream: 'B',
    tab: 'active',
    status: 'active',
    submitted: 28,
    total: 30,
    marked: 12,
    dueLabel: 'overdue by 1d',
    releasedLabel: 'released 14 Apr',
    subject: 'Mathematics',
  },
  {
    id: 'a-math-7',
    title: 'Homework 9 — Algebra revision',
    classLabel: 'Form 3A · Mathematics',
    form: '3',
    stream: 'A',
    tab: 'active',
    status: 'active',
    submitted: 4,
    total: 28,
    marked: 0,
    dueLabel: 'due in 5 days',
    releasedLabel: 'released today',
    subject: 'Mathematics',
  },
  {
    id: 'a-math-draft-1',
    title: 'Simultaneous equations — Worksheet 6',
    classLabel: 'Form 4A · Mathematics',
    form: '4',
    stream: 'A',
    tab: 'drafts',
    status: 'active',
    submitted: 0,
    total: 32,
    marked: 0,
    dueLabel: 'draft · set release date',
    releasedLabel: 'last edited 2h ago',
    subject: 'Mathematics',
  },
  {
    id: 'a-math-draft-2',
    title: 'Trigonometry — extension set',
    classLabel: 'Form 4B · Mathematics',
    form: '4',
    stream: 'B',
    tab: 'drafts',
    status: 'active',
    submitted: 0,
    total: 30,
    marked: 0,
    dueLabel: 'draft · rubric outstanding',
    releasedLabel: 'last edited yesterday',
    subject: 'Mathematics',
  },
  {
    id: 'a-math-sched-1',
    title: 'Mid-term paper · calculator allowed',
    classLabel: 'Form 4A · Mathematics',
    form: '4',
    stream: 'A',
    tab: 'scheduled',
    status: 'active',
    submitted: 0,
    total: 32,
    marked: 0,
    dueLabel: 'releases Mon 12 May · 08:00',
    releasedLabel: 'timed 90 min',
    subject: 'Mathematics',
  },
  {
    id: 'a-math-arch-1',
    title: 'Test 1 — Indices',
    classLabel: 'Form 4A · Mathematics',
    form: '4',
    stream: 'A',
    tab: 'archived',
    status: 'marked',
    submitted: 32,
    total: 32,
    marked: 32,
    dueLabel: 'archived 04 Apr',
    releasedLabel: 'average 73%',
    subject: 'Mathematics',
  },
  {
    id: 'a-math-arch-2',
    title: 'Worksheet 4 — Surds',
    classLabel: 'Form 4B · Mathematics',
    form: '4',
    stream: 'B',
    tab: 'archived',
    status: 'marked',
    submitted: 30,
    total: 30,
    marked: 30,
    dueLabel: 'archived 20 Mar',
    releasedLabel: 'average 68%',
    subject: 'Mathematics',
  },
];

const TEMPLATES = [
  { key: 'problem-set', label: 'Problem set', blurb: 'Numbered questions, single-file, numerical rubric.' },
  { key: 'essay', label: 'Essay', blurb: 'Word-count, 4-criterion rubric (thesis · evidence · structure · writing).' },
  { key: 'lab-report', label: 'Lab report', blurb: 'Aim / method / results / conclusion sections.' },
  { key: 'test', label: 'Test', blurb: 'Timed release, submission-locked after duration.' },
  { key: 'comprehension', label: 'Comprehension', blurb: 'Passage slot + short-answer format.' },
  { key: 'revision', label: 'Revision', blurb: 'No marks — tracking only, any format.' },
];

const TABS: readonly { key: TabKey; label: string }[] = [
  { key: 'active', label: 'Active' },
  { key: 'drafts', label: 'Drafts' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'archived', label: 'Archived' },
];

function statusToBadge(s: TeacherStatusState): { tone: 'success' | 'warning' | 'danger' | 'info' | 'brand' | 'neutral'; label: string } {
  switch (s) {
    case 'to-mark':
      return { tone: 'warning', label: 'To mark' };
    case 'marked':
      return { tone: 'success', label: 'Marked' };
    case 'active':
      return { tone: 'brand', label: 'Active' };
    default:
      return { tone: 'neutral', label: String(s) };
  }
}

export default function TeacherAssignmentsPage() {
  const [tab, setTab] = useState<TabKey>('active');
  const [query, setQuery] = useState('');

  const counts = useMemo(() => {
    const c: Record<TabKey, number> = { active: 0, drafts: 0, scheduled: 0, archived: 28 };
    for (const r of ROWS) c[r.tab] = (c[r.tab] ?? 0) + 1;
    if (ROWS.filter((r) => r.tab === 'archived').length > 0) {
      c.archived = Math.max(c.archived, ROWS.filter((r) => r.tab === 'archived').length);
    }
    return c;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ROWS.filter((r) => r.tab === tab).filter((r) => {
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        r.classLabel.toLowerCase().includes(q) ||
        (r.subject ?? '').toLowerCase().includes(q)
      );
    });
  }, [tab, query]);

  const activeRows = ROWS.filter((r) => r.tab === 'active');
  const toMarkTotal = activeRows.reduce((acc, r) => acc + (r.submitted - r.marked), 0);
  const submittedTotal = activeRows.reduce((acc, r) => acc + r.submitted, 0);
  const totalExpected = activeRows.reduce((acc, r) => acc + r.total, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-small text-muted">Assignments</p>
          <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-ink">
            What you&rsquo;ve set, and what&rsquo;s in
          </h1>
          <p className="mt-2 text-small text-muted">
            {activeRows.length} active · {counts.drafts} drafts · {counts.scheduled} scheduled
          </p>
        </div>
        <Link
          href="/teacher/assignments/new"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-primary px-5 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md"
        >
          <Plus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          New assignment
        </Link>
      </header>

      {/* KPI tiles */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiTile label="Active" value={String(activeRows.length)} sub="Currently running" tone="brand" />
        <KpiTile
          label="To mark"
          value={String(toMarkTotal)}
          sub={toMarkTotal > 0 ? 'Across active sets' : 'Caught up'}
          tone={toMarkTotal > 0 ? 'warning' : 'success'}
        />
        <KpiTile
          label="Submitted"
          value={`${submittedTotal}/${totalExpected}`}
          sub="This week"
        />
        <KpiTile label="Drafts" value={String(counts.drafts)} sub="Not yet released" />
      </ul>

      {/* Tabs + search */}
      <div className="flex flex-wrap items-center gap-2">
        <nav aria-label="Assignments status" className="inline-flex gap-1 rounded-full bg-surface p-1">
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                aria-current={active ? 'page' : undefined}
                className={[
                  'inline-flex h-9 items-center gap-2 rounded-full px-4 text-small font-semibold transition-colors',
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
                  {counts[t.key]}
                </span>
              </button>
            );
          })}
        </nav>
        <div className="relative ml-auto min-w-[240px] flex-1 sm:max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            strokeWidth={1.75}
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, class, subject…"
            className="h-11 w-full rounded-full border border-line bg-card pl-9 pr-9 text-small text-ink placeholder:text-muted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
          {query ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted transition-colors hover:bg-surface hover:text-ink"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          ) : null}
        </div>
      </div>

      {/* Table */}
      <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
        {filtered.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-h3 text-ink">Nothing on this tab.</p>
            <p className="mt-2 text-small text-muted">
              {query
                ? 'Try clearing the search or switching tabs.'
                : tab === 'drafts'
                ? 'Drafts live here until you release them.'
                : tab === 'scheduled'
                ? 'Scheduled assignments will appear here until the release time.'
                : 'Historical assignments live here once archived.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-small">
              <thead>
                <tr className="bg-surface/60 text-left">
                  <th className="px-5 py-3 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                    Title
                  </th>
                  <th className="px-4 py-3 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                    Class
                  </th>
                  <th className="px-4 py-3 text-center text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                    Submissions
                  </th>
                  <th className="px-4 py-3 text-center text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                    Marked
                  </th>
                  <th className="px-4 py-3 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                    Due
                  </th>
                  <th className="px-4 py-3 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                    Status
                  </th>
                  <th className="w-10 px-2" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const submittedPct = (r.submitted / Math.max(r.total, 1)) * 100;
                  const markedPct = r.marked > 0 ? (r.marked / Math.max(r.submitted, 1)) * 100 : 0;
                  const badge = statusToBadge(r.status);
                  return (
                    <tr key={r.id} className="border-t border-line hover:bg-surface/40">
                      <td className="px-5 py-4">
                        <Link
                          href={
                            tab === 'drafts' || tab === 'scheduled'
                              ? `/teacher/assignments/new?id=${r.id}`
                              : `/teacher/marking/${r.id}`
                          }
                          className="text-small font-semibold leading-snug text-ink transition-colors hover:text-brand-primary"
                        >
                          {r.title}
                        </Link>
                        <p className="mt-1 text-micro text-muted">{r.releasedLabel}</p>
                      </td>
                      <td className="px-4 py-4">
                        <ClassChip form={r.form} stream={r.stream} subjectTone="ochre" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="mx-auto w-32 text-center">
                          <div className="text-small tabular-nums text-ink">
                            {r.submitted}/{r.total}
                          </div>
                          <div className="mt-1 h-1 overflow-hidden rounded-full bg-surface">
                            <div
                              className="h-full bg-brand-primary"
                              style={{ width: `${submittedPct}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="mx-auto w-32 text-center">
                          <div className="text-small tabular-nums text-ink">
                            {r.marked}/{Math.max(r.submitted, 1)}
                          </div>
                          <div className="mt-1 h-1 overflow-hidden rounded-full bg-surface">
                            <div
                              className="h-full bg-success"
                              style={{ width: `${markedPct}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-small text-muted">{r.dueLabel}</td>
                      <td className="px-4 py-4">
                        <Badge tone={badge.tone} dot>
                          {badge.label}
                        </Badge>
                      </td>
                      <td className="px-2 py-4 text-right">
                        <Link
                          href={
                            tab === 'drafts' || tab === 'scheduled'
                              ? `/teacher/assignments/new?id=${r.id}`
                              : `/teacher/marking/${r.id}`
                          }
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink"
                          aria-label="Open"
                        >
                          <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Template bank */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-small font-semibold text-ink">Templates</h2>
            <p className="text-micro text-muted">
              Accelerate authoring — pre-configured structure + rubric
            </p>
          </div>
        </div>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((t) => (
            <li key={t.key}>
              <Link
                href={`/teacher/assignments/new?template=${t.key}`}
                className="hover-lift group flex h-full flex-col gap-2 rounded-lg border border-line bg-card p-5 shadow-card-sm transition-colors hover:border-brand-primary/30"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-primary/10 text-brand-primary">
                  <Copy className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </span>
                <p className="text-small font-semibold text-ink">{t.label}</p>
                <p className="text-small text-muted">{t.blurb}</p>
              </Link>
            </li>
          ))}
        </ul>
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
