'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ChevronRight, Copy, MoreHorizontal, Plus, Search, X } from 'lucide-react';

import { EditorialCard, SectionEyebrow } from '@/components/student/primitives';
import {
  ClassChip,
  TeacherPageHeader,
  TeacherStatusPill,
  type TeacherStatusState,
} from '@/components/teacher/primitives';

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

export default function TeacherAssignmentsPage() {
  const [tab, setTab] = useState<TabKey>('active');
  const [query, setQuery] = useState('');

  const counts = useMemo(() => {
    const c: Record<TabKey, number> = { active: 0, drafts: 0, scheduled: 0, archived: 28 }; // archive padded to show historical
    for (const r of ROWS) c[r.tab] = (c[r.tab] ?? 0) + 1;
    // When the actual archived list has items they override the padded count
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

  return (
    <div className="space-y-8">
      <TeacherPageHeader
        eyebrow="Assignments"
        title="What you&rsquo;ve set,"
        accent="and what&rsquo;s in."
        right={
          <Link href="/teacher/assignments/new" className="btn-terracotta">
            <Plus className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            New assignment
          </Link>
        }
      />

      {/* Tabs */}
      <nav aria-label="Assignments status" className="border-b border-sand">
        <ul className="flex flex-wrap gap-0">
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <li key={t.key}>
                <button
                  type="button"
                  onClick={() => setTab(t.key)}
                  aria-current={active ? 'page' : undefined}
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
                    {counts[t.key]}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone"
            strokeWidth={1.5}
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, class, subject…"
            className="h-10 w-full rounded border border-sand bg-white pl-9 pr-9 font-sans text-[13px] text-ink placeholder-stone focus:border-terracotta focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-stone hover:bg-sand-light hover:text-ink"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          ) : null}
        </div>
        <span className="font-sans text-[12px] text-stone">
          {filtered.length} of {counts[tab]} on this tab
        </span>
      </div>

      {/* Table */}
      <EditorialCard className="overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-display text-[18px] text-ink">Nothing on this tab.</p>
            <p className="mt-2 font-sans text-[13px] text-stone">
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
            <table className="w-full text-[14px]">
              <thead>
                <tr className="bg-sand-light/40 text-left">
                  <th className="px-5 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                    Title
                  </th>
                  <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                    Class
                  </th>
                  <th className="px-4 py-3 text-center font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                    Submissions
                  </th>
                  <th className="px-4 py-3 text-center font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                    Marked
                  </th>
                  <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                    Due
                  </th>
                  <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                    Status
                  </th>
                  <th className="w-10 px-2" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const submittedPct = (r.submitted / Math.max(r.total, 1)) * 100;
                  const markedPct = r.marked > 0 ? (r.marked / Math.max(r.submitted, 1)) * 100 : 0;
                  return (
                    <tr key={r.id} className="border-t border-sand-light hover:bg-sand-light/40">
                      <td className="px-5 py-4">
                        <Link
                          href={tab === 'drafts' || tab === 'scheduled'
                            ? `/teacher/assignments/new?id=${r.id}`
                            : `/teacher/marking/${r.id}`}
                          className="font-display text-[16px] leading-snug text-ink hover:text-earth"
                        >
                          {r.title}
                        </Link>
                        <p className="mt-1 font-sans text-[12px] text-stone">
                          {r.releasedLabel}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <ClassChip form={r.form} stream={r.stream} subjectTone="ochre" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="mx-auto w-32 text-center">
                          <div className="font-mono text-[13px] tabular-nums text-ink">
                            {r.submitted}/{r.total}
                          </div>
                          <div className="mt-1 h-1 overflow-hidden rounded-full bg-sand">
                            <div className="h-full bg-earth" style={{ width: `${submittedPct}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="mx-auto w-32 text-center">
                          <div className="font-mono text-[13px] tabular-nums text-ink">
                            {r.marked}/{Math.max(r.submitted, 1)}
                          </div>
                          <div className="mt-1 h-1 overflow-hidden rounded-full bg-sand">
                            <div
                              className="h-full bg-terracotta"
                              style={{ width: `${markedPct}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-sans text-[13px] text-stone">{r.dueLabel}</td>
                      <td className="px-4 py-4">
                        <TeacherStatusPill state={r.status} />
                      </td>
                      <td className="px-2 py-4 text-right">
                        <Link
                          href={tab === 'drafts' || tab === 'scheduled'
                            ? `/teacher/assignments/new?id=${r.id}`
                            : `/teacher/marking/${r.id}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded text-stone hover:bg-sand hover:text-ink"
                          aria-label="Open"
                        >
                          <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </EditorialCard>

      {/* Template bank */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <SectionEyebrow>Templates</SectionEyebrow>
          <span className="font-sans text-[12px] text-stone">
            Accelerate authoring — pre-configured structure + rubric
          </span>
        </div>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((t) => (
            <li key={t.key}>
              <Link
                href={`/teacher/assignments/new?template=${t.key}`}
                className="group flex h-full flex-col gap-2 rounded border border-sand bg-white p-5 transition-all duration-200 ease-out-soft hover:-translate-y-px hover:border-terracotta hover:shadow-e2"
              >
                <Copy className="h-4 w-4 text-earth" strokeWidth={1.5} aria-hidden />
                <p className="font-display text-[18px] text-ink group-hover:text-earth">
                  {t.label}
                </p>
                <p className="font-serif text-[13px] leading-relaxed text-stone">{t.blurb}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
