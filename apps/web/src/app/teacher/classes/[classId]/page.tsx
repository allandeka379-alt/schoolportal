import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpDown, Download, MoreHorizontal } from 'lucide-react';

import { EditorialAvatar, EditorialCard, SectionEyebrow } from '@/components/student/primitives';
import { TeacherPageHeader, TeacherTag } from '@/components/teacher/primitives';
import { STUDENTS } from '@/lib/mock/fixtures';
import { TEACHER_CLASSES } from '@/lib/mock/teacher-extras';

interface PageProps {
  params: Promise<{ classId: string }>;
  searchParams?: Promise<{ tab?: string }>;
}

/**
 * Class detail — §06.
 *
 * Six tabs pin below the header: Roster, Assignments, Gradebook, Attendance,
 * Lesson Plans, Analytics. Tab choice preserved in ?tab= query param.
 */
const TABS = [
  { key: 'roster', label: 'Roster' },
  { key: 'assignments', label: 'Assignments' },
  { key: 'gradebook', label: 'Gradebook' },
  { key: 'attendance', label: 'Attendance' },
  { key: 'lesson-plans', label: 'Lesson plans' },
  { key: 'analytics', label: 'Analytics' },
] as const;

export default async function ClassDetailPage({ params, searchParams }: PageProps) {
  const { classId } = await params;
  const sp = (await searchParams) ?? {};
  const tab = (sp.tab as (typeof TABS)[number]['key']) ?? 'roster';
  const cls = TEACHER_CLASSES.find((c) => c.id === classId);
  if (!cls) notFound();

  const rosterBase =
    cls.form === '4' && cls.stream === 'A'
      ? STUDENTS.filter((s) => s.form === 'Form 3' && s.stream === 'Blue').map((s, i) => ({
          ...s,
          attendance: [98, 94, 86, 99, 92, 88][i % 6] ?? 95,
          average: [82, 58, 74, 66, 79, 71][i % 6] ?? 70,
          outstanding: [0, 2, 1, 3, 0, 1][i % 6] ?? 0,
          flag: [null, 'At risk', null, 'Absent', null, null][i % 6],
        }))
      : STUDENTS.slice(0, 4).map((s, i) => ({
          ...s,
          attendance: 88 + (i * 3),
          average: 64 + (i * 4),
          outstanding: i,
          flag: null as string | null,
        }));

  return (
    <div className="space-y-8">
      <TeacherPageHeader
        eyebrow={`${cls.subjectName} · Form ${cls.form}${cls.stream}`}
        title={`Form ${cls.form}${cls.stream}`}
        accent={`· ${cls.subjectName}`}
        subtitle={`${Math.max(cls.studentIds.length, 28)} students · current term average ${cls.averagePercent}% · attendance ${cls.attendancePercent}%`}
        right={
          cls.isFormTeacher ? <TeacherTag label="Your form" tone="ochre" /> : null
        }
      />

      {/* Tabs */}
      <nav aria-label="Class sub-navigation" className="border-b border-sand">
        <ul className="flex flex-wrap gap-0">
          {TABS.map((t) => {
            const active = t.key === tab;
            return (
              <li key={t.key}>
                <Link
                  href={`/teacher/classes/${classId}?tab=${t.key}`}
                  className={[
                    'inline-flex h-11 items-center border-b-[2px] px-4 font-sans text-[14px] transition-colors',
                    active
                      ? 'border-terracotta font-semibold text-ink'
                      : 'border-transparent text-stone hover:text-ink',
                  ].join(' ')}
                >
                  {t.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Tab content */}
      {tab === 'roster' ? (
        <EditorialCard className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-sand px-6 py-4">
            <SectionEyebrow>Roster</SectionEyebrow>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-9 items-center gap-1.5 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
              >
                <ArrowUpDown className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                Sort
              </button>
              <button
                type="button"
                className="inline-flex h-9 items-center gap-1.5 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
              >
                <Download className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                Export
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="bg-sand-light/40 text-left">
                  <th className="px-6 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                    Student
                  </th>
                  <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                    ID
                  </th>
                  <th className="px-4 py-3 text-right font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                    Attendance
                  </th>
                  <th className="px-4 py-3 text-right font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                    Average
                  </th>
                  <th className="px-4 py-3 text-right font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                    To do
                  </th>
                  <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                    Flags
                  </th>
                  <th className="w-12 px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {rosterBase.map((s) => (
                  <tr key={s.id} className="border-t border-sand-light hover:bg-sand-light/40">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <EditorialAvatar name={`${s.firstName} ${s.lastName}`} size="sm" />
                        <span className="font-sans font-medium text-ink">
                          {s.firstName} {s.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-[12px] text-stone">{s.admissionNo}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums">{s.attendance}%</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums">{s.average}%</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-stone">
                      {s.outstanding}
                    </td>
                    <td className="px-4 py-3">
                      {s.flag ? (
                        <span className="inline-flex items-center rounded-sm bg-[#FBEBEA] px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-danger">
                          {s.flag}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="rounded p-1.5 text-stone hover:bg-sand hover:text-ink"
                        aria-label="More actions"
                      >
                        <MoreHorizontal className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </EditorialCard>
      ) : null}

      {tab === 'assignments' ? (
        <EditorialCard className="p-8">
          <SectionEyebrow>Assignments for Form {cls.form}{cls.stream}</SectionEyebrow>
          <p className="mt-3 font-serif text-[15px] text-stone">
            This tab lives within the class. Use{' '}
            <Link
              href={`/teacher/assignments?class=${cls.id}`}
              className="landing-link text-terracotta"
            >
              the full Assignments page
            </Link>{' '}
            for authoring, releasing, and archiving — pre-filtered by this class.
          </p>
        </EditorialCard>
      ) : null}

      {tab === 'gradebook' ? (
        <EditorialCard className="p-8">
          <SectionEyebrow>Gradebook</SectionEyebrow>
          <p className="mt-3 font-serif text-[15px] text-stone">
            Jump to{' '}
            <Link href="/teacher/gradebook" className="landing-link text-terracotta">
              the full gradebook matrix
            </Link>
            , scoped to this class.
          </p>
        </EditorialCard>
      ) : null}

      {tab === 'attendance' ? (
        <EditorialCard className="p-8">
          <SectionEyebrow>Attendance</SectionEyebrow>
          <p className="mt-3 font-serif text-[15px] text-stone">
            Open{' '}
            <Link href="/teacher/attendance" className="landing-link text-terracotta">
              the register for this class
            </Link>
            . History and patterns visible there.
          </p>
        </EditorialCard>
      ) : null}

      {tab === 'lesson-plans' ? (
        <EditorialCard className="p-8">
          <SectionEyebrow>Lesson plans</SectionEyebrow>
          <p className="mt-3 font-serif text-[15px] text-stone">
            See{' '}
            <Link href="/teacher/lesson-plans" className="landing-link text-terracotta">
              your lesson plans
            </Link>{' '}
            and the departmental library.
          </p>
        </EditorialCard>
      ) : null}

      {tab === 'analytics' ? (
        <EditorialCard className="p-8">
          <SectionEyebrow>Analytics</SectionEyebrow>
          <p className="mt-3 font-serif text-[15px] text-stone">
            Deeper metrics for this class live on{' '}
            <Link href="/teacher/analytics" className="landing-link text-terracotta">
              the analytics page
            </Link>
            .
          </p>
        </EditorialCard>
      ) : null}
    </div>
  );
}
