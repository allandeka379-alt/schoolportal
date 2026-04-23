'use client';

import { useMemo, useState } from 'react';
import {
  Award,
  BookOpenText,
  CalendarClock,
  Check,
  Copy,
  FileCheck2,
  NotebookPen,
  Plus,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/student/progress-ring';
import { ClassChip } from '@/components/teacher/primitives';

interface Plan {
  id: string;
  title: string;
  date: string;
  status: 'active' | 'draft' | 'scheduled';
  syllabus: string;
  form: string;
  stream: string;
}

interface Cpd {
  id: string;
  title: string;
  when: string;
  hours: number;
  status: 'completed' | 'upcoming';
}

interface DepartmentPlan {
  id: string;
  title: string;
  author: string;
  hearts: number;
}

const INITIAL_MY_PLANS: Plan[] = [
  { id: 'lp1', title: 'Form 4A — Quadratic Equations · Lesson 7', date: 'Thursday 23 Apr · 07:30', status: 'active', syllabus: 'ZIMSEC 4004 · §3.4', form: '4', stream: 'A' },
  { id: 'lp2', title: 'Form 3B — Algebraic Manipulation · Lesson 12', date: 'Today 10:00', status: 'active', syllabus: 'ZIMSEC 4004 · §2.3', form: '3', stream: 'B' },
  { id: 'lp3', title: 'Form 4B — Functions · Revision', date: 'Today 11:00', status: 'draft', syllabus: 'ZIMSEC 4004 · §3.2', form: '4', stream: 'B' },
  { id: 'lp4', title: 'Form 3A — Introduction to Functions', date: 'Today 13:00', status: 'scheduled', syllabus: 'ZIMSEC 4004 · §3.1', form: '3', stream: 'A' },
];

const DEPT: readonly DepartmentPlan[] = [
  { id: 'd1', title: 'Introduction to Calculus · 6-lesson sequence', author: 'Mr Phiri (HOD)', hearts: 14 },
  { id: 'd2', title: 'ZIMSEC Paper 2 exam technique · 2-lesson', author: 'Mrs Nyoka', hearts: 11 },
  { id: 'd3', title: 'Factor theorem — worked examples pack', author: 'Mr Shoko', hearts: 8 },
];

const INITIAL_CPD: Cpd[] = [
  { id: 'c1', title: 'ZIMTA workshop — Active-learning Mathematics', when: '2 Apr 2026', hours: 6, status: 'completed' },
  { id: 'c2', title: 'GeoGebra for classroom demonstration', when: '14 Mar 2026', hours: 3, status: 'completed' },
  { id: 'c3', title: 'Pearson webinar — Year 11 progression strategies', when: '8 May 2026', hours: 2, status: 'upcoming' },
];

function statusBadge(s: Plan['status']): { tone: 'success' | 'brand' | 'warning'; label: string } {
  if (s === 'active') return { tone: 'success', label: 'Active' };
  if (s === 'scheduled') return { tone: 'brand', label: 'Scheduled' };
  return { tone: 'warning', label: 'Draft' };
}

export default function LessonPlansPage() {
  const [plans, setPlans] = useState<Plan[]>(INITIAL_MY_PLANS);
  const [cpd, setCpd] = useState<Cpd[]>(INITIAL_CPD);
  const [duplicated, setDuplicated] = useState<Set<string>>(new Set());
  const [newPlanOpen, setNewPlanOpen] = useState(false);
  const [newCpdOpen, setNewCpdOpen] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);

  const hoursThisYear = useMemo(
    () => cpd.filter((c) => c.status === 'completed').reduce((s, c) => s + c.hours, 0),
    [cpd],
  );
  const cpdPct = Math.min(100, Math.round((hoursThisYear / 30) * 100));

  function addPlan(p: Omit<Plan, 'id'>) {
    setPlans((curr) => [{ ...p, id: `lp-${Date.now()}` }, ...curr]);
    setNewPlanOpen(false);
  }

  function updatePlan(p: Plan) {
    setPlans((curr) => curr.map((x) => (x.id === p.id ? p : x)));
    setEditing(null);
  }

  function addCpd(entry: Omit<Cpd, 'id'>) {
    setCpd((curr) => [{ ...entry, id: `cpd-${Date.now()}` }, ...curr]);
    setNewCpdOpen(false);
  }

  function duplicate(d: DepartmentPlan) {
    setPlans((curr) => [
      {
        id: `lp-${Date.now()}`,
        title: `${d.title} (copy)`,
        date: 'Next week · set date',
        status: 'draft',
        syllabus: 'ZIMSEC 4004',
        form: '4',
        stream: 'A',
      },
      ...curr,
    ]);
    setDuplicated((s) => {
      const next = new Set(s);
      next.add(d.id);
      return next;
    });
  }

  const activeCount = plans.filter((p) => p.status === 'active').length;
  const draftCount = plans.filter((p) => p.status === 'draft').length;
  const scheduledCount = plans.filter((p) => p.status === 'scheduled').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-small text-muted">Lesson plans &amp; CPD</p>
          <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-ink">
            Your plans, the department&rsquo;s memory
          </h1>
          <p className="mt-2 text-small text-muted">
            {plans.length} lesson plans · {hoursThisYear} CPD hours this year
          </p>
        </div>
        <button
          type="button"
          onClick={() => setNewPlanOpen(true)}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-primary px-5 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md"
        >
          <Plus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          New lesson plan
        </button>
      </header>

      {/* KPI tiles */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiTile label="Active" value={String(activeCount)} tone="success" />
        <KpiTile label="Scheduled" value={String(scheduledCount)} tone="brand" />
        <KpiTile
          label="Drafts"
          value={String(draftCount)}
          tone={draftCount > 0 ? 'warning' : undefined}
        />
        <KpiTile
          label="CPD hours"
          value={`${hoursThisYear}/30`}
          ring={cpdPct}
          ringTone={cpdPct >= 50 ? 'success' : 'brand'}
        />
      </ul>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Mine */}
        <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm lg:col-span-7">
          <header className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <div>
              <h2 className="text-small font-semibold text-ink">My lesson plans</h2>
              <p className="text-micro text-muted">{plans.length} this week</p>
            </div>
          </header>
          <ul className="divide-y divide-line">
            {plans.map((p) => {
              const badge = statusBadge(p.status);
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => setEditing(p)}
                    className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-surface/60"
                  >
                    <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-md bg-brand-primary/10 text-brand-primary">
                      <NotebookPen className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-small font-semibold leading-snug text-ink transition-colors group-hover:text-brand-primary">
                        {p.title}
                      </p>
                      <p className="mt-0.5 flex flex-wrap items-center gap-2 text-micro text-muted">
                        <CalendarClock className="h-3 w-3" strokeWidth={1.75} aria-hidden />
                        {p.date}
                        <span className="text-line">·</span>
                        <span>{p.syllabus}</span>
                      </p>
                    </div>
                    <ClassChip form={p.form} stream={p.stream} subjectTone="ochre" />
                    <Badge tone={badge.tone} dot>
                      {badge.label}
                    </Badge>
                  </button>
                </li>
              );
            })}
            {plans.length === 0 ? (
              <li className="px-6 py-10 text-center text-small text-muted">
                No plans yet — tap the button above to start one.
              </li>
            ) : null}
          </ul>
        </section>

        {/* Department library */}
        <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm lg:col-span-5">
          <header className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <div>
              <h2 className="text-small font-semibold text-ink">Department library</h2>
              <p className="text-micro text-muted">Curated by HOD</p>
            </div>
          </header>
          <ul className="divide-y divide-line">
            {DEPT.map((d) => {
              const done = duplicated.has(d.id);
              return (
                <li
                  key={d.id}
                  className="group flex items-start gap-3 px-5 py-4 transition-colors hover:bg-surface/60"
                >
                  <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-md bg-brand-accent/15 text-brand-accent">
                    <BookOpenText className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-small font-semibold leading-snug text-ink">
                      {d.title}
                    </p>
                    <p className="mt-0.5 text-micro text-muted">
                      {d.author} · ♥ {d.hearts}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => duplicate(d)}
                    disabled={done}
                    className={[
                      'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-micro font-semibold transition-colors',
                      done
                        ? 'cursor-not-allowed border-success/30 bg-success/5 text-success'
                        : 'border-line bg-card text-ink hover:bg-surface',
                    ].join(' ')}
                  >
                    {done ? (
                      <>
                        <Check className="h-3 w-3" strokeWidth={2} aria-hidden />
                        Duplicated
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" strokeWidth={1.75} aria-hidden />
                        Duplicate
                      </>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {/* CPD */}
      <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <div>
            <h2 className="text-small font-semibold text-ink">CPD logbook</h2>
            <p className="mt-0.5 text-micro text-muted">
              {hoursThisYear} of 30 hours completed this appraisal year
            </p>
          </div>
          <button
            type="button"
            onClick={() => setNewCpdOpen(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-card px-4 text-micro font-semibold text-ink transition-colors hover:bg-surface"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            Log CPD
          </button>
        </header>

        <div className="px-5 py-4">
          <div className="h-2 overflow-hidden rounded-full bg-surface">
            <div
              className="h-full bg-brand-primary transition-[width] duration-300"
              style={{ width: `${cpdPct}%` }}
            />
          </div>
        </div>

        <ul className="divide-y divide-line">
          {cpd.map((c) => (
            <li key={c.id} className="flex items-center gap-4 px-5 py-4">
              {c.status === 'completed' ? (
                <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-md bg-success/10 text-success">
                  <FileCheck2 className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </span>
              ) : (
                <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-md bg-warning/10 text-warning">
                  <Award className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-small font-semibold text-ink">{c.title}</p>
                <p className="mt-0.5 text-micro text-muted">
                  {c.when} · {c.hours} hours
                </p>
              </div>
              <Badge tone={c.status === 'completed' ? 'success' : 'warning'} dot>
                {c.status === 'completed' ? 'Logged' : 'Upcoming'}
              </Badge>
            </li>
          ))}
        </ul>
      </section>

      {newPlanOpen ? (
        <PlanModal
          title="New lesson plan"
          onClose={() => setNewPlanOpen(false)}
          onSave={addPlan}
        />
      ) : null}

      {editing ? (
        <PlanModal
          title="Edit lesson plan"
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={(p) => updatePlan({ ...editing, ...p })}
        />
      ) : null}

      {newCpdOpen ? (
        <CpdModal onClose={() => setNewCpdOpen(false)} onSave={addCpd} />
      ) : null}
    </div>
  );
}

function KpiTile({
  label,
  value,
  tone,
  ring,
  ringTone,
}: {
  label: string;
  value: string;
  tone?: 'brand' | 'success' | 'warning';
  ring?: number;
  ringTone?: 'success' | 'brand' | 'warning' | 'danger';
}) {
  const valueColor =
    tone === 'warning' ? 'text-warning' : tone === 'success' ? 'text-success' : tone === 'brand' ? 'text-brand-primary' : 'text-ink';
  return (
    <li className="rounded-lg border border-line bg-card p-5 shadow-card-sm">
      <div className="flex items-center justify-between">
        <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
        {ring !== undefined && ringTone ? (
          <ProgressRing value={ring} size={44} stroke={5} tone={ringTone} />
        ) : null}
      </div>
      <p className={`mt-3 text-h2 tabular-nums ${valueColor}`}>{value}</p>
    </li>
  );
}

function PlanModal({
  title,
  initial,
  onClose,
  onSave,
}: {
  title: string;
  initial?: Plan;
  onClose: () => void;
  onSave: (p: Omit<Plan, 'id'>) => void;
}) {
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    date: initial?.date ?? '',
    syllabus: initial?.syllabus ?? 'ZIMSEC 4004',
    form: initial?.form ?? '4',
    stream: initial?.stream ?? 'A',
    status: initial?.status ?? 'draft',
  });

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.date.trim()) return;
    onSave({ ...form });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
    >
      <form
        onSubmit={save}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[88vh] w-full max-w-xl flex-col overflow-hidden rounded-lg border border-line bg-card shadow-card-md"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="text-h3 text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-muted transition-colors hover:bg-surface hover:text-ink"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
        <div className="space-y-4 overflow-y-auto p-6">
          <Field label="Title">
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Form 4A — Quadratic Equations · Lesson 8"
              required
            />
          </Field>
          <Field label="When">
            <input
              className={inputClass}
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              placeholder="Friday 24 Apr · 09:10"
              required
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Form">
              <select
                className={inputClass}
                value={form.form}
                onChange={(e) => setForm((f) => ({ ...f, form: e.target.value }))}
              >
                <option value="1">Form 1</option>
                <option value="2">Form 2</option>
                <option value="3">Form 3</option>
                <option value="4">Form 4</option>
              </select>
            </Field>
            <Field label="Stream">
              <select
                className={inputClass}
                value={form.stream}
                onChange={(e) => setForm((f) => ({ ...f, stream: e.target.value }))}
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="Blue">Blue</option>
                <option value="Green">Green</option>
                <option value="Gold">Gold</option>
              </select>
            </Field>
          </div>
          <Field label="Syllabus reference">
            <input
              className={inputClass}
              value={form.syllabus}
              onChange={(e) => setForm((f) => ({ ...f, syllabus: e.target.value }))}
              placeholder="ZIMSEC 4004 · §3.4"
            />
          </Field>
          <Field label="Status">
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Plan['status'] }))}
            >
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="active">Active</option>
            </select>
          </Field>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-line bg-card px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-primary px-4 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md"
          >
            {initial ? 'Save changes' : 'Create plan'}
          </button>
        </div>
      </form>
    </div>
  );
}

function CpdModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (c: Omit<Cpd, 'id'>) => void;
}) {
  const [form, setForm] = useState({
    title: '',
    when: '',
    hours: 1,
    status: 'completed' as Cpd['status'],
  });

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.when.trim()) return;
    onSave({ ...form, hours: Math.max(0.5, Number(form.hours) || 0) });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
    >
      <form
        onSubmit={save}
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-md flex-col overflow-hidden rounded-lg border border-line bg-card shadow-card-md"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="text-h3 text-ink">Log CPD</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-muted transition-colors hover:bg-surface hover:text-ink"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
        <div className="space-y-4 p-6">
          <Field label="Activity">
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. ZIMTA curriculum workshop"
              required
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="When">
              <input
                className={inputClass}
                value={form.when}
                onChange={(e) => setForm((f) => ({ ...f, when: e.target.value }))}
                placeholder="12 May 2026"
                required
              />
            </Field>
            <Field label="Hours">
              <input
                type="number"
                min={0.5}
                step={0.5}
                className={inputClass}
                value={form.hours}
                onChange={(e) => setForm((f) => ({ ...f, hours: Number(e.target.value) }))}
                required
              />
            </Field>
          </div>
          <Field label="Status">
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Cpd['status'] }))}
            >
              <option value="completed">Completed</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </Field>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-line bg-card px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-primary px-4 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md"
          >
            Add to log
          </button>
        </div>
      </form>
    </div>
  );
}

const inputClass =
  'h-11 w-full rounded-md border border-line bg-card px-3 text-small text-ink placeholder:text-muted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-micro font-semibold uppercase tracking-[0.12em] text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}
