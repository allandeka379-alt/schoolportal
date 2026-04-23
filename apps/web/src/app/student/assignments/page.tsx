'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react';

import { ASSIGNMENTS_FOR_FARAI, type DemoAssignment } from '@/lib/mock/fixtures';
import { dueLabel, subjectNameByCode } from '@/lib/mock/student-extras';

import {
  EditorialCard,
  SectionEyebrow,
  StatusPill,
  StudentEmptyState,
} from '@/components/student/primitives';

/**
 * Assignments list — §06 of the spec.
 *
 * Grouping (fixed order):
 *   1. Overdue              (default expanded)
 *   2. Due This Week        (default expanded)
 *   3. Due Later            (default collapsed)
 *   4. Submitted            (default collapsed)
 *   5. Marked               (default collapsed)
 *
 * Search + subject + status filters are fully live. Filter bar reflects
 * the number of items visible after filtering.
 */

type StatusFilter = 'ALL' | 'OPEN' | 'SUBMITTED' | 'RETURNED' | 'LATE';

interface Group {
  key: string;
  heading: string;
  tone: 'danger' | 'default' | 'neutral' | 'success' | 'marked';
  expanded: boolean;
  items: DemoAssignment[];
}

function buildGroups(assignments: readonly DemoAssignment[]): Group[] {
  const now = new Date();
  const weekFromNow = new Date(now.getTime() + 7 * 86400000);

  const overdue: DemoAssignment[] = [];
  const thisWeek: DemoAssignment[] = [];
  const later: DemoAssignment[] = [];
  const submitted: DemoAssignment[] = [];
  const marked: DemoAssignment[] = [];

  for (const a of assignments) {
    if (a.status === 'RETURNED') {
      marked.push(a);
      continue;
    }
    if (a.status === 'SUBMITTED') {
      submitted.push(a);
      continue;
    }
    const due = new Date(a.dueAt);
    if (a.status === 'LATE' || due.getTime() < now.getTime()) {
      overdue.push(a);
      continue;
    }
    if (due.getTime() <= weekFromNow.getTime()) {
      thisWeek.push(a);
      continue;
    }
    later.push(a);
  }

  const sortByDue = (x: DemoAssignment, y: DemoAssignment) =>
    new Date(x.dueAt).getTime() - new Date(y.dueAt).getTime();
  overdue.sort(sortByDue);
  thisWeek.sort(sortByDue);
  later.sort(sortByDue);

  return [
    { key: 'overdue', heading: 'Overdue', tone: 'danger', expanded: true, items: overdue },
    { key: 'this-week', heading: 'Due This Week', tone: 'default', expanded: true, items: thisWeek },
    { key: 'later', heading: 'Due Later', tone: 'neutral', expanded: false, items: later },
    { key: 'submitted', heading: 'Submitted — Awaiting Mark', tone: 'success', expanded: false, items: submitted },
    { key: 'marked', heading: 'Marked', tone: 'marked', expanded: false, items: marked },
  ];
}

function uniqueSubjectCodes(assignments: readonly DemoAssignment[]): string[] {
  return [...new Set(assignments.map((a) => a.subjectCode))].sort();
}

export default function AssignmentsListPage() {
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState<string>('ALL');
  const [status, setStatus] = useState<StatusFilter>('ALL');
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set(['later', 'marked']));

  const subjects = useMemo(() => uniqueSubjectCodes(ASSIGNMENTS_FOR_FARAI), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ASSIGNMENTS_FOR_FARAI.filter((a) => {
      if (subject !== 'ALL' && a.subjectCode !== subject) return false;
      if (status !== 'ALL' && a.status !== status) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.teacher.toLowerCase().includes(q) ||
        subjectNameByCode(a.subjectCode).toLowerCase().includes(q) ||
        a.instructions.toLowerCase().includes(q)
      );
    });
  }, [query, subject, status]);

  const groups = buildGroups(filtered);
  const totalVisible = filtered.length;
  const hasFilters = query.length > 0 || subject !== 'ALL' || status !== 'ALL';

  function toggleGroup(key: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function clearFilters() {
    setQuery('');
    setSubject('ALL');
    setStatus('ALL');
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionEyebrow>Assignments</SectionEyebrow>
          <h1 className="mt-2 font-display text-[clamp(1.75rem,3vw,2.25rem)] text-ink">
            Every piece of work,{' '}
            <span className="italic font-light text-terracotta">in one list.</span>
          </h1>
          <p className="mt-2 font-sans text-[13px] text-stone">
            {totalVisible} of {ASSIGNMENTS_FOR_FARAI.length} assignments visible
            {hasFilters ? ' after filters' : ''}.
          </p>
        </div>
      </header>

      {/* Filter bar */}
      <EditorialCard className="flex flex-wrap items-center gap-3 p-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone"
            strokeWidth={1.5}
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, teacher, subject, instructions…"
            className="h-10 w-full rounded border border-sand bg-white pl-9 pr-3 font-sans text-[14px] text-ink placeholder-stone focus:border-terracotta focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-stone hover:bg-sand-light hover:text-ink"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          ) : null}
        </div>
        <FilterSelect
          label="Subject"
          value={subject}
          onChange={(v) => setSubject(v)}
          options={[
            { value: 'ALL', label: 'All subjects' },
            ...subjects.map((code) => ({
              value: code,
              label: `${code} · ${subjectNameByCode(code)}`,
            })),
          ]}
        />
        <FilterSelect
          label="Status"
          value={status}
          onChange={(v) => setStatus(v as StatusFilter)}
          options={[
            { value: 'ALL', label: 'All statuses' },
            { value: 'OPEN', label: 'Open' },
            { value: 'SUBMITTED', label: 'Submitted' },
            { value: 'RETURNED', label: 'Marked' },
            { value: 'LATE', label: 'Late' },
          ]}
        />
        {hasFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex h-10 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-stone hover:bg-sand-light hover:text-ink"
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
            Clear
          </button>
        ) : (
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-earth hover:bg-sand-light"
          >
            <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            More filters
          </button>
        )}
      </EditorialCard>

      {/* Groups */}
      <div className="space-y-6">
        {groups.length === 0 || totalVisible === 0 ? (
          <EditorialCard>
            <StudentEmptyState
              heading={hasFilters ? 'No matches.' : 'Nothing here.'}
              body={
                hasFilters
                  ? 'Try clearing a filter, or broaden your search.'
                  : 'Check back soon — teachers set new work regularly.'
              }
            />
          </EditorialCard>
        ) : (
          groups.map((g) => (
            <AssignmentGroup
              key={g.key}
              group={g}
              collapsed={collapsed.has(g.key)}
              onToggle={() => toggleGroup(g.key)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="relative">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 appearance-none rounded border border-sand bg-white pl-3 pr-9 font-sans text-[13px] font-medium text-earth hover:bg-sand-light focus:border-terracotta focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {label}: {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone"
        strokeWidth={1.5}
        aria-hidden
      />
    </label>
  );
}

function AssignmentGroup({
  group,
  collapsed,
  onToggle,
}: {
  group: Group;
  collapsed: boolean;
  onToggle: () => void;
}) {
  if (group.items.length === 0) return null;

  return (
    <section>
      <button
        type="button"
        onClick={onToggle}
        className="mb-3 flex w-full items-center gap-2 text-left font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-stone transition-colors hover:text-ink"
      >
        <ChevronRight
          className={[
            'h-3.5 w-3.5 transition-transform',
            collapsed ? '' : 'rotate-90',
          ].join(' ')}
          strokeWidth={1.5}
          aria-hidden
        />
        {group.heading}
        <span className="rounded bg-sand px-1.5 py-0.5 text-[11px] text-earth">
          {group.items.length}
        </span>
      </button>

      {!collapsed ? (
        <ul className="space-y-2">
          {group.items.map((a) => (
            <li key={a.id}>
              <AssignmentRow assignment={a} group={group.key} />
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function AssignmentRow({ assignment, group }: { assignment: DemoAssignment; group: string }) {
  const due = dueLabel(assignment.dueAt);
  const pill =
    assignment.status === 'RETURNED'
      ? 'marked'
      : assignment.status === 'SUBMITTED'
      ? 'submitted'
      : assignment.status === 'LATE'
      ? 'overdue'
      : group === 'overdue'
      ? 'overdue'
      : 'pending';

  const surface =
    group === 'overdue'
      ? 'bg-[#FDF2F1] border-[#F3D4D1]'
      : group === 'marked'
      ? 'bg-[#F5F2FB] border-[#E4DEF1]'
      : group === 'submitted'
      ? 'bg-[#F0F6F2] border-[#D7E5DC]'
      : 'bg-white border-sand';

  return (
    <Link
      href={`/student/assignments/${assignment.id}`}
      className={`group flex items-center gap-5 rounded border px-6 transition-all duration-200 ease-out-soft hover:-translate-y-px hover:shadow-e2 ${surface}`}
      style={{ minHeight: 88 }}
    >
      <div className="min-w-0 flex-1 py-4">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-stone">
          {subjectNameByCode(assignment.subjectCode)}
        </p>
        <p className="mt-1 truncate font-display text-[18px] leading-snug text-ink group-hover:text-earth">
          {assignment.title}
        </p>
        <p className="mt-1 flex items-center gap-3 font-sans text-[13px] text-stone">
          <span>{assignment.teacher}</span>
          <span>·</span>
          <span
            className={
              due.tone === 'overdue' || due.tone === 'due-today'
                ? 'text-danger font-medium'
                : due.tone === 'soon'
                ? 'text-ochre font-medium'
                : 'text-stone'
            }
          >
            {due.label}
          </span>
        </p>
      </div>

      {assignment.status === 'RETURNED' && assignment.markAwarded !== undefined ? (
        <div className="flex-none text-right">
          <span className="font-display text-[22px] tabular-nums text-ink">
            {assignment.markAwarded}
          </span>
          <span className="font-sans text-[13px] text-stone"> /{assignment.maxMarks}</span>
        </div>
      ) : null}

      <div className="flex-none">
        <StatusPill state={pill} />
      </div>

      <ChevronRight
        className="h-5 w-5 flex-none text-stone transition-transform group-hover:translate-x-0.5 group-hover:text-terracotta"
        strokeWidth={1.5}
        aria-hidden
      />
    </Link>
  );
}
