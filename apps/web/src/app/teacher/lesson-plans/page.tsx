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

import { EditorialCard, SectionEyebrow } from '@/components/student/primitives';
import { ClassChip, TeacherPageHeader, TeacherStatusPill } from '@/components/teacher/primitives';

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

  return (
    <div className="space-y-8">
      <TeacherPageHeader
        eyebrow="Lesson plans &amp; CPD"
        title="Your plans,"
        accent="the department's memory."
        right={
          <button
            type="button"
            onClick={() => setNewPlanOpen(true)}
            className="btn-terracotta"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            New lesson plan
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Mine */}
        <EditorialCard className="overflow-hidden lg:col-span-7">
          <div className="flex items-center justify-between border-b border-sand px-6 py-4">
            <SectionEyebrow>My lesson plans</SectionEyebrow>
            <span className="font-sans text-[12px] text-stone">{plans.length} this week</span>
          </div>
          <ul className="divide-y divide-sand-light">
            {plans.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setEditing(p)}
                  className="group flex w-full items-center gap-4 px-6 py-4 text-left hover:bg-sand-light/40"
                >
                  <NotebookPen className="h-5 w-5 flex-none text-earth" strokeWidth={1.5} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[17px] leading-snug text-ink group-hover:text-earth">
                      {p.title}
                    </p>
                    <p className="mt-0.5 flex items-center gap-2 font-sans text-[12px] text-stone">
                      <CalendarClock className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                      {p.date}
                      <span className="text-sand">·</span>
                      <span>{p.syllabus}</span>
                    </p>
                  </div>
                  <ClassChip form={p.form} stream={p.stream} subjectTone="ochre" />
                  <TeacherStatusPill state={p.status} />
                </button>
              </li>
            ))}
            {plans.length === 0 ? (
              <li className="px-6 py-10 text-center font-sans text-[13px] text-stone">
                No plans yet — tap the button above to start one.
              </li>
            ) : null}
          </ul>
        </EditorialCard>

        {/* Department library */}
        <EditorialCard className="overflow-hidden lg:col-span-5">
          <div className="flex items-center justify-between border-b border-sand px-6 py-4">
            <SectionEyebrow>Department library</SectionEyebrow>
            <span className="font-sans text-[12px] text-stone">Curated by HOD</span>
          </div>
          <ul className="divide-y divide-sand-light">
            {DEPT.map((d) => {
              const done = duplicated.has(d.id);
              return (
                <li key={d.id} className="group flex items-start gap-3 px-6 py-4 hover:bg-sand-light/40">
                  <BookOpenText className="h-5 w-5 flex-none text-earth" strokeWidth={1.5} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[16px] leading-snug text-ink group-hover:text-earth">
                      {d.title}
                    </p>
                    <p className="mt-0.5 font-sans text-[12px] text-stone">
                      {d.author} · ♥ {d.hearts}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => duplicate(d)}
                    disabled={done}
                    className={[
                      'inline-flex items-center gap-1 rounded border px-2 py-1 font-sans text-[11px] font-medium transition-colors',
                      done
                        ? 'border-ok/40 bg-[#F0F6F2] text-ok cursor-not-allowed'
                        : 'border-sand bg-white text-earth hover:bg-sand-light',
                    ].join(' ')}
                  >
                    {done ? (
                      <>
                        <Check className="h-3 w-3" strokeWidth={2} aria-hidden />
                        Duplicated
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                        Duplicate
                      </>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </EditorialCard>
      </div>

      {/* CPD */}
      <EditorialCard className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand px-6 py-4">
          <div>
            <SectionEyebrow>CPD logbook</SectionEyebrow>
            <p className="mt-1 font-sans text-[13px] text-stone">
              {hoursThisYear} of 30 hours completed this appraisal year
            </p>
          </div>
          <button
            type="button"
            onClick={() => setNewCpdOpen(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
            Log CPD
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="h-2 overflow-hidden rounded-full bg-sand">
            <div
              className="h-full bg-terracotta transition-[width] duration-300"
              style={{ width: `${Math.min(100, (hoursThisYear / 30) * 100)}%` }}
            />
          </div>
        </div>

        <ul className="divide-y divide-sand-light">
          {cpd.map((c) => (
            <li key={c.id} className="flex items-center gap-4 px-6 py-4">
              {c.status === 'completed' ? (
                <FileCheck2 className="h-5 w-5 flex-none text-ok" strokeWidth={1.5} aria-hidden />
              ) : (
                <Award className="h-5 w-5 flex-none text-ochre" strokeWidth={1.5} aria-hidden />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-sans text-[14px] font-medium text-ink">{c.title}</p>
                <p className="mt-0.5 font-sans text-[12px] text-stone">
                  {c.when} · {c.hours} hours
                </p>
              </div>
              <TeacherStatusPill state={c.status === 'completed' ? 'marked' : 'scheduled'}>
                {c.status === 'completed' ? 'logged' : 'upcoming'}
              </TeacherStatusPill>
            </li>
          ))}
        </ul>
      </EditorialCard>

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
        className="relative flex max-h-[88vh] w-full max-w-xl flex-col overflow-hidden rounded bg-white shadow-e3"
      >
        <div className="flex items-center justify-between border-b border-sand px-6 py-4">
          <h2 className="font-display text-[20px] text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-2 text-stone transition-colors hover:bg-sand-light hover:text-ink"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
        <div className="space-y-4 overflow-y-auto p-6">
          <Field label="Title">
            <input
              className="input-boxed"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Form 4A — Quadratic Equations · Lesson 8"
              required
            />
          </Field>
          <Field label="When">
            <input
              className="input-boxed"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              placeholder="Friday 24 Apr · 09:10"
              required
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Form">
              <select
                className="input-boxed"
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
                className="input-boxed"
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
              className="input-boxed"
              value={form.syllabus}
              onChange={(e) => setForm((f) => ({ ...f, syllabus: e.target.value }))}
              placeholder="ZIMSEC 4004 · §3.4"
            />
          </Field>
          <Field label="Status">
            <select
              className="input-boxed"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Plan['status'] }))}
            >
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="active">Active</option>
            </select>
          </Field>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-sand bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-stone hover:bg-sand-light"
          >
            Cancel
          </button>
          <button type="submit" className="btn-terracotta">
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
        className="relative flex w-full max-w-md flex-col overflow-hidden rounded bg-white shadow-e3"
      >
        <div className="flex items-center justify-between border-b border-sand px-6 py-4">
          <h2 className="font-display text-[20px] text-ink">Log CPD</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-2 text-stone transition-colors hover:bg-sand-light hover:text-ink"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
        <div className="space-y-4 p-6">
          <Field label="Activity">
            <input
              className="input-boxed"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. ZIMTA curriculum workshop"
              required
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="When">
              <input
                className="input-boxed"
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
                className="input-boxed"
                value={form.hours}
                onChange={(e) => setForm((f) => ({ ...f, hours: Number(e.target.value) }))}
                required
              />
            </Field>
          </div>
          <Field label="Status">
            <select
              className="input-boxed"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Cpd['status'] }))}
            >
              <option value="completed">Completed</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </Field>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-sand bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-stone hover:bg-sand-light"
          >
            Cancel
          </button>
          <button type="submit" className="btn-terracotta">
            Add to log
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-stone">
        {label}
      </span>
      {children}
    </label>
  );
}
