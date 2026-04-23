'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BookOpenCheck,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Clock,
  FileBadge2,
  Filter,
  Plus,
  Search,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { ASSIGNMENTS_FOR_FARAI, type DemoAssignment } from '@/lib/mock/fixtures';
import { dueLabel, subjectNameByCode } from '@/lib/mock/student-extras';

/**
 * Student assignments — card-dense list.
 *
 *   Hero strip with four status KPIs
 *   Search + subject + status filters in a single pill bar
 *   Five collapsible groups (Overdue / Due this week / Later /
 *   Submitted / Marked)
 *   Each row is a card: coloured icon square, title + metadata, due
 *   badge, grade badge when marked, chevron affordance
 */

type StatusFilter = 'ALL' | 'OPEN' | 'SUBMITTED' | 'RETURNED' | 'LATE';

interface Group {
  key: string;
  heading: string;
  description: string;
  items: DemoAssignment[];
  tone: 'danger' | 'warning' | 'brand' | 'info' | 'success';
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
    { key: 'overdue',   heading: 'Overdue',                 description: 'Submit as soon as you can',           items: overdue,   tone: 'danger' },
    { key: 'this-week', heading: 'Due this week',           description: 'Plan your evenings',                  items: thisWeek,  tone: 'warning' },
    { key: 'later',     heading: 'Due later',               description: 'On the horizon',                       items: later,     tone: 'brand' },
    { key: 'submitted', heading: 'Submitted · waiting mark',description: 'Teacher has your work',                 items: submitted, tone: 'info' },
    { key: 'marked',    heading: 'Marked',                  description: 'Your grades are back',                 items: marked,    tone: 'success' },
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

  const kpiOverdue = groups.find((g) => g.key === 'overdue')?.items.length ?? 0;
  const kpiDueThisWeek = groups.find((g) => g.key === 'this-week')?.items.length ?? 0;
  const kpiSubmitted = groups.find((g) => g.key === 'submitted')?.items.length ?? 0;
  const kpiMarked = groups.find((g) => g.key === 'marked')?.items.length ?? 0;

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
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-small text-muted">Everything due, submitted, or returned</p>
          <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-ink">
            Assignments
          </h1>
          <p className="mt-2 text-small text-muted">
            {totalVisible} of {ASSIGNMENTS_FOR_FARAI.length} visible
            {hasFilters ? ' after filters' : ''}
          </p>
        </div>
      </header>

      {/* KPI strip */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          label="Overdue"
          value={kpiOverdue}
          icon={<AlertTriangle className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
          tone="danger"
        />
        <KpiCard
          label="Due this week"
          value={kpiDueThisWeek}
          icon={<Clock className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
          tone="warning"
        />
        <KpiCard
          label="Submitted"
          value={kpiSubmitted}
          icon={<ClipboardCheck className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
          tone="info"
        />
        <KpiCard
          label="Marked"
          value={kpiMarked}
          icon={<BookOpenCheck className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
          tone="success"
        />
      </ul>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-line bg-card p-3 shadow-card-sm">
        <div className="relative flex-1 min-w-[220px]">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            strokeWidth={1.75}
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, teacher, subject…"
            className="h-10 w-full rounded-full border border-line bg-surface pl-10 pr-9 text-small text-ink placeholder-muted/80 transition-colors focus:border-brand-primary focus:outline-none focus:ring-4 focus:ring-brand-primary/10"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted hover:bg-line hover:text-ink"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          ) : null}
        </div>
        <FilterSelect
          label="Subject"
          value={subject}
          onChange={(v) => setSubject(v)}
          options={[
            { value: 'ALL', label: 'All subjects' },
            ...subjects.map((code) => ({ value: code, label: subjectNameByCode(code) })),
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
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-small font-medium text-muted transition-colors hover:bg-card hover:text-ink"
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            Clear
          </button>
        ) : (
          <button
            type="button"
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-small font-medium text-ink transition-colors hover:bg-card"
          >
            <Filter className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            More
          </button>
        )}
      </div>

      {/* Groups */}
      <div className="space-y-6">
        {totalVisible === 0 ? (
          <EmptyPanel
            heading={hasFilters ? 'No matches.' : 'Nothing here.'}
            body={
              hasFilters
                ? 'Try clearing a filter or broadening your search.'
                : 'Check back — teachers set new work regularly.'
            }
          />
        ) : (
          groups.map((g) =>
            g.items.length === 0 ? null : (
              <AssignmentGroup
                key={g.key}
                group={g}
                collapsed={collapsed.has(g.key)}
                onToggle={() => toggleGroup(g.key)}
              />
            ),
          )
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function KpiCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: 'danger' | 'warning' | 'info' | 'success';
}) {
  const toneStyles = {
    danger: 'bg-danger/10 text-danger',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-info/10 text-info',
    success: 'bg-success/10 text-success',
  }[tone];
  return (
    <li className="rounded-lg border border-line bg-card p-4 shadow-card-sm">
      <div className="flex items-center justify-between">
        <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
        <span className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${toneStyles}`}>
          {icon}
        </span>
      </div>
      <p className="mt-3 text-h1 tabular-nums text-ink">{value}</p>
    </li>
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
        className="h-10 appearance-none rounded-full border border-line bg-surface pl-4 pr-9 text-small font-medium text-ink transition-colors hover:bg-card focus:border-brand-primary focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {label}: {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
        strokeWidth={1.75}
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
  const toneStyles = {
    danger: 'bg-danger/10 text-danger',
    warning: 'bg-warning/10 text-warning',
    brand: 'bg-brand-primary/10 text-brand-primary',
    info: 'bg-info/10 text-info',
    success: 'bg-success/10 text-success',
  }[group.tone];

  return (
    <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 border-b border-line px-5 py-3.5 text-left transition-colors hover:bg-surface"
      >
        <span className={`inline-flex h-8 w-8 flex-none items-center justify-center rounded-md ${toneStyles}`}>
          <ChevronRight
            className={['h-4 w-4 transition-transform', collapsed ? '' : 'rotate-90'].join(' ')}
            strokeWidth={2}
            aria-hidden
          />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-small font-semibold text-ink">{group.heading}</h2>
            <Badge tone={group.tone === 'brand' ? 'brand' : group.tone === 'danger' ? 'danger' : group.tone === 'warning' ? 'warning' : group.tone === 'info' ? 'info' : 'success'}>
              {group.items.length}
            </Badge>
          </div>
          <p className="text-micro text-muted">{group.description}</p>
        </div>
      </button>
      {!collapsed ? (
        <ul className="divide-y divide-line">
          {group.items.map((a) => (
            <li key={a.id}>
              <AssignmentRow assignment={a} groupTone={group.tone} />
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function AssignmentRow({
  assignment,
  groupTone,
}: {
  assignment: DemoAssignment;
  groupTone: Group['tone'];
}) {
  const due = dueLabel(assignment.dueAt);
  const isMarked = assignment.status === 'RETURNED';
  const isSubmitted = assignment.status === 'SUBMITTED';

  const iconTone = {
    danger: 'bg-danger/10 text-danger',
    warning: 'bg-warning/10 text-warning',
    brand: 'bg-brand-primary/10 text-brand-primary',
    info: 'bg-info/10 text-info',
    success: 'bg-success/10 text-success',
  }[groupTone];

  const dueBadge: 'danger' | 'warning' | 'info' =
    due.tone === 'overdue' || due.tone === 'due-today'
      ? 'danger'
      : due.tone === 'soon'
      ? 'warning'
      : 'info';

  const pct = isMarked && assignment.markAwarded !== undefined
    ? (assignment.markAwarded / assignment.maxMarks) * 100
    : null;

  const markBadge: 'success' | 'info' | 'warning' | 'danger' =
    pct === null ? 'info' : pct >= 80 ? 'success' : pct >= 60 ? 'info' : pct >= 50 ? 'warning' : 'danger';

  return (
    <Link
      href={`/student/assignments/${assignment.id}`}
      className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface"
    >
      <span className={`inline-flex h-10 w-10 flex-none items-center justify-center rounded-md ${iconTone}`}>
        <FileBadge2 className="h-4 w-4" strokeWidth={1.75} aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-small font-semibold text-ink group-hover:text-brand-primary">
          {assignment.title}
        </p>
        <p className="text-micro text-muted">
          {subjectNameByCode(assignment.subjectCode)} · {assignment.teacher}
        </p>
      </div>
      {isMarked && assignment.markAwarded !== undefined ? (
        <>
          <Badge tone={markBadge}>{Math.round(pct ?? 0)}%</Badge>
          <span className="hidden text-small font-bold tabular-nums text-ink sm:inline-block">
            {assignment.markAwarded}
            <span className="text-micro text-muted"> / {assignment.maxMarks}</span>
          </span>
        </>
      ) : isSubmitted ? (
        <Badge tone="info" dot>
          <CheckCircle2 className="h-3 w-3" strokeWidth={2} aria-hidden />
          Submitted
        </Badge>
      ) : (
        <Badge tone={dueBadge} dot>
          {due.label}
        </Badge>
      )}
      <ChevronRight
        className="h-4 w-4 flex-none text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand-primary"
        strokeWidth={1.75}
        aria-hidden
      />
    </Link>
  );
}

function EmptyPanel({ heading, body }: { heading: string; body: string }) {
  return (
    <section className="rounded-lg border border-dashed border-line bg-card p-10 text-center shadow-card-sm">
      <Plus className="mx-auto h-8 w-8 text-muted/50" strokeWidth={1.25} aria-hidden />
      <p className="mt-3 text-small font-semibold text-ink">{heading}</p>
      <p className="mt-1 text-small text-muted">{body}</p>
    </section>
  );
}
