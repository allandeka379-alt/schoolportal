import { Award, BookOpenText, CalendarClock, FileCheck2, NotebookPen, Plus } from 'lucide-react';

import { EditorialCard, SectionEyebrow } from '@/components/student/primitives';
import { ClassChip, TeacherPageHeader, TeacherStatusPill } from '@/components/teacher/primitives';

const MY_PLANS = [
  { id: 'lp1', title: 'Form 4A — Quadratic Equations · Lesson 7', date: 'Thursday 23 Apr · 07:30', status: 'active' as const, syllabus: 'ZIMSEC 4004 · §3.4', form: '4', stream: 'A' },
  { id: 'lp2', title: 'Form 3B — Algebraic Manipulation · Lesson 12', date: 'Today 10:00', status: 'active' as const, syllabus: 'ZIMSEC 4004 · §2.3', form: '3', stream: 'B' },
  { id: 'lp3', title: 'Form 4B — Functions · Revision', date: 'Today 11:00', status: 'draft' as const, syllabus: 'ZIMSEC 4004 · §3.2', form: '4', stream: 'B' },
  { id: 'lp4', title: 'Form 3A — Introduction to Functions', date: 'Today 13:00', status: 'scheduled' as const, syllabus: 'ZIMSEC 4004 · §3.1', form: '3', stream: 'A' },
];

const DEPT = [
  { id: 'd1', title: 'Introduction to Calculus · 6-lesson sequence', author: 'Mr Phiri (HOD)', hearts: 14 },
  { id: 'd2', title: 'ZIMSEC Paper 2 exam technique · 2-lesson', author: 'Mrs Nyoka', hearts: 11 },
  { id: 'd3', title: 'Factor theorem — worked examples pack', author: 'Mr Shoko', hearts: 8 },
];

const CPD = [
  { id: 'c1', title: 'ZIMTA workshop — Active-learning Mathematics', when: '2 Apr 2026', hours: 6, status: 'completed' as const },
  { id: 'c2', title: 'GeoGebra for classroom demonstration', when: '14 Mar 2026', hours: 3, status: 'completed' as const },
  { id: 'c3', title: 'Pearson webinar — Year 11 progression strategies', when: '8 May 2026', hours: 2, status: 'upcoming' as const },
];

/**
 * Lesson plans & CPD — §15.
 *
 *   Mine        — personal collection
 *   Department  — shared library, HOD-curated
 *   CPD logbook — personal development record + targets
 */
export default function LessonPlansPage() {
  const hoursThisYear = CPD.filter((c) => c.status === 'completed').reduce((s, c) => s + c.hours, 0);

  return (
    <div className="space-y-8">
      <TeacherPageHeader
        eyebrow="Lesson plans &amp; CPD"
        title="Your plans,"
        accent="the department's memory."
        right={
          <button type="button" className="btn-terracotta">
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
            <span className="font-sans text-[12px] text-stone">{MY_PLANS.length} this week</span>
          </div>
          <ul className="divide-y divide-sand-light">
            {MY_PLANS.map((p) => (
              <li key={p.id} className="group flex items-center gap-4 px-6 py-4 hover:bg-sand-light/40">
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
              </li>
            ))}
          </ul>
        </EditorialCard>

        {/* Department library */}
        <EditorialCard className="overflow-hidden lg:col-span-5">
          <div className="flex items-center justify-between border-b border-sand px-6 py-4">
            <SectionEyebrow>Department library</SectionEyebrow>
            <span className="font-sans text-[12px] text-stone">Curated by HOD</span>
          </div>
          <ul className="divide-y divide-sand-light">
            {DEPT.map((d) => (
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
                  className="rounded border border-sand bg-white px-2 py-1 font-sans text-[11px] font-medium text-earth hover:bg-sand-light"
                >
                  Duplicate
                </button>
              </li>
            ))}
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
            className="inline-flex h-9 items-center gap-1.5 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
            Log CPD
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="h-2 overflow-hidden rounded-full bg-sand">
            <div
              className="h-full bg-terracotta"
              style={{ width: `${Math.min(100, (hoursThisYear / 30) * 100)}%` }}
            />
          </div>
        </div>

        <ul className="divide-y divide-sand-light">
          {CPD.map((c) => (
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
    </div>
  );
}
