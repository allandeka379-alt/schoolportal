'use client';

import { useState } from 'react';
import { Download, Eye, FileText, PlayCircle, Plus, Upload } from 'lucide-react';

import { EditorialCard, SectionEyebrow } from '@/components/student/primitives';
import { TeacherPageHeader, TeacherStatusPill } from '@/components/teacher/primitives';

type Tab = 'mine' | 'department' | 'class';

interface Resource {
  id: string;
  title: string;
  kind: 'Notes' | 'Past Paper' | 'Video' | 'Worksheet' | 'Interactive';
  size: string;
  visibility: 'private' | 'department' | 'class' | 'exam-release';
  publishedTo?: string;
  openedBy?: number;
  outOf?: number;
  contributor?: string;
}

const MINE: Resource[] = [
  { id: 'r-mine-1', title: 'Chapter 4: Functions — Lesson Notes', kind: 'Notes', size: '1.1 MB', visibility: 'class', publishedTo: '4A, 4B', openedBy: 28, outOf: 32 },
  { id: 'r-mine-2', title: 'Worked Example — Completing the Square', kind: 'Video', size: '240 MB', visibility: 'private' },
  { id: 'r-mine-3', title: 'Math 2024 Nov — with marking scheme', kind: 'Past Paper', size: '850 KB', visibility: 'exam-release', publishedTo: '4A' },
  { id: 'r-mine-4', title: 'Algebra Worksheet 5', kind: 'Worksheet', size: '180 KB', visibility: 'class', publishedTo: '3B', openedBy: 18, outOf: 30 },
];

const DEPARTMENT: Resource[] = [
  { id: 'r-dep-1', title: 'Form 3 Maths Scheme of Work', kind: 'Notes', size: '540 KB', visibility: 'department', contributor: 'Mr Phiri (HOD)' },
  { id: 'r-dep-2', title: 'O-Level Past Papers 2015–2023', kind: 'Past Paper', size: '12 MB', visibility: 'department', contributor: 'Mrs Nyoka' },
  { id: 'r-dep-3', title: 'GeoGebra — Quadratic Explorer', kind: 'Interactive', size: '—', visibility: 'department', contributor: 'Mr Shoko' },
];

const CLASSR: Resource[] = MINE.filter((r) => r.visibility === 'class' || r.visibility === 'exam-release');

const KIND_ICON = {
  Notes: FileText,
  'Past Paper': FileText,
  Video: PlayCircle,
  Worksheet: FileText,
  Interactive: PlayCircle,
} as const;

/**
 * Teacher resources library — §12.
 *
 * Three tabs: Mine · Department · Class.
 * Tabs share list layout, differ in data source + contributed-by column.
 */
export default function TeacherResourcesPage() {
  const [tab, setTab] = useState<Tab>('mine');

  const source = tab === 'mine' ? MINE : tab === 'department' ? DEPARTMENT : CLASSR;

  return (
    <div className="space-y-8">
      <TeacherPageHeader
        eyebrow="Resources"
        title="Your library,"
        accent="and the department&rsquo;s."
        subtitle={`${MINE.length} items · ${MINE.filter((r) => r.visibility === 'class').length} published to students`}
        right={
          <button type="button" className="btn-terracotta">
            <Upload className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            Upload
          </button>
        }
      />

      {/* Tabs */}
      <nav aria-label="Resources tabs" className="border-b border-sand">
        <ul className="flex flex-wrap gap-0">
          {(
            [
              { key: 'mine' as const, label: 'Mine', count: MINE.length },
              { key: 'department' as const, label: 'Department library', count: DEPARTMENT.length },
              { key: 'class' as const, label: 'Class resources', count: CLASSR.length },
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

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {['All types', 'Topics', 'Form', tab === 'mine' ? 'Published / Draft' : 'Year uploaded'].map(
          (l) => (
            <button
              key={l}
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
            >
              {l}
            </button>
          ),
        )}
      </div>

      {/* Resource list */}
      <EditorialCard className="overflow-hidden">
        <ul className="divide-y divide-sand-light">
          {source.map((r) => {
            const Icon = KIND_ICON[r.kind] ?? FileText;
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
                  </p>
                  {r.openedBy !== undefined && r.outOf !== undefined ? (
                    <p className="mt-1 flex items-center gap-1.5 font-sans text-[11px] text-ok">
                      <Eye className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                      Opened by {r.openedBy} / {r.outOf} in your class
                    </p>
                  ) : null}
                </div>
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    className="rounded p-2 text-stone hover:bg-sand hover:text-ink"
                    aria-label="Download"
                  >
                    <Download className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                  {tab === 'department' ? (
                    <button
                      type="button"
                      className="inline-flex h-8 items-center rounded bg-sand px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
                    >
                      <Plus className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                      Add to mine
                    </button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </EditorialCard>
    </div>
  );
}
