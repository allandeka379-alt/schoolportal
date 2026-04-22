import Link from 'next/link';
import { AlertCircle, ClipboardCheck, MessageSquarePlus, PlusCircle } from 'lucide-react';

import { EditorialCard, SectionEyebrow } from '@/components/student/primitives';
import { TeacherPageHeader, TeacherTag } from '@/components/teacher/primitives';
import { TEACHER_CLASSES } from '@/lib/mock/teacher-extras';

/**
 * Classes list — §06 of the spec.
 *
 * A 2×2 grid of class cards (stacks on mobile). Hovering reveals three
 * quick actions along the bottom edge of each card: Take register,
 * Set assignment, Message class.
 */
export default function ClassesPage() {
  return (
    <div className="space-y-8">
      <TeacherPageHeader
        eyebrow="Classes"
        title="My classes,"
        accent="at a glance."
        subtitle={`${TEACHER_CLASSES.length} classes · ${TEACHER_CLASSES.reduce(
          (sum, c) => sum + Math.max(c.studentIds.length, 28),
          0,
        )} students taught`}
      />

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <FilterDropdown label="All subjects" />
        <FilterDropdown label="All forms" />
        <FilterDropdown label="Current term" />
      </div>

      {/* 2×2 grid */}
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {TEACHER_CLASSES.map((c) => {
          const studentCount = Math.max(c.studentIds.length, 28);
          return (
            <li key={c.id}>
              <Link
                href={`/teacher/classes/${c.id}`}
                className="group relative block overflow-hidden rounded border border-sand bg-white p-6 transition-all duration-200 ease-out-soft hover:-translate-y-px hover:shadow-e2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="flex items-center gap-2 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-terracotta">
                      <span className="h-1.5 w-1.5 rounded-full bg-ochre" aria-hidden />
                      {c.subjectName}
                    </p>
                    <h3 className="mt-2 font-display text-[28px] text-ink group-hover:text-earth">
                      Form {c.form}
                      {c.stream}
                    </h3>
                  </div>
                  {c.isFormTeacher ? <TeacherTag label="FT" /> : null}
                </div>

                <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-sand-light pt-4">
                  <div>
                    <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                      Students
                    </dt>
                    <dd className="mt-1 font-display text-[20px] text-ink tabular-nums">
                      {studentCount}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                      Average
                    </dt>
                    <dd className="mt-1 font-display text-[20px] text-ink tabular-nums">
                      {c.averagePercent}%
                    </dd>
                  </div>
                  <div>
                    <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                      Attendance
                    </dt>
                    <dd className="mt-1 font-display text-[20px] text-ink tabular-nums">
                      {c.attendancePercent}%
                    </dd>
                  </div>
                </dl>

                {c.atRiskCount > 0 ? (
                  <p className="mt-4 inline-flex items-center gap-1.5 rounded-sm bg-[#FBEBEA] px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-danger">
                    <AlertCircle className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                    {c.atRiskCount} at risk
                  </p>
                ) : null}

                {/* Quick-action bar — reveals on hover */}
                <div className="mt-6 flex items-center gap-1 border-t border-sand-light pt-3 opacity-70 transition-opacity group-hover:opacity-100">
                  <QuickAction icon={ClipboardCheck} label="Take register" />
                  <QuickAction icon={PlusCircle} label="Set assignment" />
                  <QuickAction icon={MessageSquarePlus} label="Message class" />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function FilterDropdown({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex h-10 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-earth hover:bg-sand-light"
    >
      {label}
    </button>
  );
}

function QuickAction({ icon: Icon, label }: { icon: typeof ClipboardCheck; label: string }) {
  // Visual-only inside a card-level Link. The whole card navigates to the
  // class detail; these chips are affordances, not clickable controls.
  return (
    <span className="inline-flex items-center gap-1.5 rounded px-2 py-1 font-sans text-[12px] text-stone transition-colors group-hover:text-earth">
      <Icon className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
      {label}
    </span>
  );
}
