import Link from 'next/link';
import { ChevronRight, Search, SlidersHorizontal } from 'lucide-react';

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
 *   6. Archived             (default collapsed)
 *
 * Each row is 88px tall on desktop, colour-coded by group via a subtle
 * left surface.
 */

interface Group {
  key: string;
  heading: string;
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
    { key: 'overdue', heading: 'Overdue', expanded: true, items: overdue },
    { key: 'this-week', heading: 'Due This Week', expanded: true, items: thisWeek },
    { key: 'later', heading: 'Due Later', expanded: false, items: later },
    { key: 'submitted', heading: 'Submitted — Awaiting Mark', expanded: false, items: submitted },
    { key: 'marked', heading: 'Marked', expanded: false, items: marked },
  ];
}

export default function AssignmentsListPage() {
  const groups = buildGroups(ASSIGNMENTS_FOR_FARAI);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionEyebrow>Assignments</SectionEyebrow>
          <h1 className="mt-2 font-display text-[clamp(1.75rem,3vw,2.25rem)] text-ink">
            Every piece of work,{' '}
            <span className="italic font-light text-terracotta">in one list.</span>
          </h1>
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
            placeholder="Search assignments…"
            className="h-10 w-full rounded border border-sand bg-white pl-9 pr-3 font-sans text-[14px] text-ink placeholder-stone focus:border-terracotta focus:outline-none"
          />
        </div>
        <Dropdown label="Subject" />
        <Dropdown label="Status" />
        <Dropdown label="Date range" />
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-earth hover:bg-sand-light"
        >
          <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          More filters
        </button>
      </EditorialCard>

      {/* Groups */}
      <div className="space-y-6">
        {groups.map((g) => (
          <AssignmentGroup key={g.key} group={g} />
        ))}
      </div>
    </div>
  );
}

function Dropdown({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex h-10 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-earth hover:bg-sand-light"
    >
      {label}
      <ChevronRight className="h-3.5 w-3.5 rotate-90" strokeWidth={1.5} aria-hidden />
    </button>
  );
}

function AssignmentGroup({ group }: { group: Group }) {
  if (group.items.length === 0 && !group.expanded) return null;

  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">
        {group.heading}
        <span className="rounded bg-sand px-1.5 py-0.5 text-[11px] text-earth">
          {group.items.length}
        </span>
      </h2>

      {group.items.length === 0 ? (
        <EditorialCard>
          <StudentEmptyState
            heading="Nothing here."
            body={
              group.key === 'overdue'
                ? "No overdue work. Keep it that way."
                : 'Check back soon — teachers set new work regularly.'
            }
          />
        </EditorialCard>
      ) : (
        <ul className="space-y-2">
          {group.items.map((a) => (
            <li key={a.id}>
              <AssignmentRow assignment={a} group={group.key} />
            </li>
          ))}
        </ul>
      )}
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
