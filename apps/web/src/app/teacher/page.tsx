import Link from 'next/link';
import { ArrowRight, BookOpen, FileEdit, Megaphone, MessageSquare, Users } from 'lucide-react';

import { EditorialCard, SectionEyebrow } from '@/components/student/primitives';
import { AttentionRow, ClassChip, TeacherStatusPill, TeacherTag } from '@/components/teacher/primitives';
import {
  ATTENTION_ITEMS,
  greetingFor,
  MARKING_QUEUE,
  ME_TEACHER,
  TEACHER_CLASSES,
  TEACHER_TODAY,
  TOTAL_STUDENTS_TAUGHT,
} from '@/lib/mock/teacher-extras';

/**
 * Teacher console — §05 of the spec.
 *
 * Four zones:
 *   1. Greeting         — title + surname, day, subject, lesson count
 *   2. Attention Today  — prioritised action list (terracotta top border)
 *   3. Today's Lessons  — schedule with "Take register" inline
 *   4. Marking Queue    — 3 most urgent
 * Plus three secondary tiles: Messages / Classes / Announcements.
 */
export default function TeacherConsole() {
  const greeting = greetingFor();
  const now = new Date();
  const weekday = now.toLocaleDateString('en-ZW', { weekday: 'long' });
  const dateLabel = now.toLocaleDateString('en-ZW', { day: 'numeric', month: 'long' });
  const lessonsToday = TEACHER_TODAY.filter((l) => l.classId !== undefined).length;
  const classAverage = Math.round(
    TEACHER_CLASSES.reduce((sum, c) => sum + c.averagePercent, 0) / TEACHER_CLASSES.length,
  );

  return (
    <div className="space-y-8">
      {/* Zone 1 — Greeting */}
      <section className="rounded border border-sand bg-sand-light px-6 py-8 md:px-10 md:py-10">
        <p className="hha-eyebrow-earth">{greeting}</p>
        <h1 className="mt-3 flex flex-wrap items-center gap-3 font-display text-[clamp(2rem,4vw,2.75rem)] leading-tight text-ink">
          {greeting}, {ME_TEACHER.title} {ME_TEACHER.lastName}
          <span className="text-terracotta">.</span>
          {ME_TEACHER.isFormTeacher ? <TeacherTag label="FT" /> : null}
          {ME_TEACHER.isHod ? <TeacherTag label="HOD" tone="terracotta" /> : null}
        </h1>
        <p className="mt-3 font-serif text-body-lg text-stone">
          {weekday}, {dateLabel} · {ME_TEACHER.subject} · {lessonsToday} lessons today
        </p>
      </section>

      {/* Zone 2 — Attention today */}
      <EditorialCard className="overflow-hidden border-t-[3px] border-t-terracotta">
        <div className="flex items-center justify-between px-6 py-4 border-b border-sand">
          <SectionEyebrow>Attention today</SectionEyebrow>
          <span className="font-sans text-[12px] text-stone">
            Cleared items drop off automatically
          </span>
        </div>
        {ATTENTION_ITEMS.length === 0 ? (
          <p className="px-6 py-10 text-center font-serif text-[15px] text-stone">
            No outstanding actions. Have a clear morning.
          </p>
        ) : (
          <ul>
            {ATTENTION_ITEMS.map((item) => (
              <li key={item.id}>
                <AttentionRow
                  tone={item.tone}
                  label={item.label}
                  detail={item.detail}
                  href={item.href}
                />
              </li>
            ))}
          </ul>
        )}
      </EditorialCard>

      {/* Zones 3 + 4 side by side */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Zone 3 — Today's lessons */}
        <EditorialCard className="overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b border-sand px-6 py-4">
            <SectionEyebrow>Today&rsquo;s lessons</SectionEyebrow>
            <span className="font-sans text-[12px] text-stone">
              {TEACHER_TODAY.length} scheduled
            </span>
          </div>
          <ul className="divide-y divide-sand-light">
            {TEACHER_TODAY.map((lesson) => {
              const cls = TEACHER_CLASSES.find((c) => c.id === lesson.classId);
              return (
                <li
                  key={lesson.id}
                  className={`relative flex items-center gap-4 px-6 py-4 ${
                    lesson.isCurrent ? 'bg-sand-light/60' : ''
                  }`}
                >
                  {lesson.isCurrent ? (
                    <span
                      aria-hidden
                      className="absolute inset-y-2 left-0 w-[2px] rounded-r-sm bg-terracotta"
                    />
                  ) : null}
                  <span className="w-14 flex-none font-mono text-[13px] tabular-nums text-stone">
                    {lesson.start}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {cls ? (
                        <ClassChip
                          form={cls.form}
                          stream={cls.stream}
                          subjectTone={cls.subjectTone}
                        />
                      ) : null}
                      <span className="font-sans text-[12px] text-stone">Room {lesson.room}</span>
                    </div>
                    <p className="mt-1 font-serif text-[15px] text-ink">{lesson.topic}</p>
                  </div>
                  {!lesson.registerTaken ? (
                    <Link
                      href="/teacher/attendance"
                      className="inline-flex h-8 items-center rounded bg-terracotta px-3 font-sans text-[12px] font-semibold text-cream hover:bg-terracotta-hover"
                    >
                      Take register
                    </Link>
                  ) : (
                    <span className="font-sans text-[12px] text-ok">✓ register taken</span>
                  )}
                </li>
              );
            })}
          </ul>
        </EditorialCard>

        {/* Zone 4 — Marking queue */}
        <EditorialCard className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-sand px-6 py-4">
            <SectionEyebrow>Marking queue</SectionEyebrow>
            <Link
              href="/teacher/assignments"
              className="landing-link font-sans text-[12px] font-medium text-terracotta"
            >
              Open queue
              <ArrowRight className="h-3 w-3" strokeWidth={1.5} aria-hidden />
            </Link>
          </div>
          <ul className="divide-y divide-sand-light">
            {MARKING_QUEUE.map((q) => {
              const pct = (q.submitted / q.total) * 100;
              return (
                <li key={q.assignmentId}>
                  <Link
                    href={`/teacher/marking/${q.assignmentId}`}
                    className="group block px-5 py-4 hover:bg-sand-light/40"
                  >
                    <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                      {q.classLabel}
                    </p>
                    <p className="mt-1 truncate font-display text-[16px] leading-snug text-ink group-hover:text-earth">
                      {q.title}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`font-sans text-[12px] font-medium ${
                          q.overdue ? 'text-danger' : 'text-stone'
                        }`}
                      >
                        {q.submitted} of {q.total} submitted · {q.dueLabel}
                      </span>
                      {q.status === 'marked-pending-release' ? (
                        <TeacherStatusPill state="marked" />
                      ) : null}
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-sand">
                      <div
                        className="h-full bg-terracotta"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </EditorialCard>
      </div>

      {/* Secondary tiles */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SecondaryTile
          href="/teacher/messages"
          eyebrow="Messages"
          icon={<MessageSquare className="h-5 w-5 text-earth" strokeWidth={1.5} aria-hidden />}
          value="10"
          line="3 parent · 5 student · 2 staff"
          valueColour="text-ink"
        />
        <SecondaryTile
          href="/teacher/classes"
          eyebrow="My classes"
          icon={<Users className="h-5 w-5 text-earth" strokeWidth={1.5} aria-hidden />}
          value={`${TEACHER_CLASSES.length}`}
          line={`${TOTAL_STUDENTS_TAUGHT} students · average ${classAverage}%`}
          valueColour="text-ink"
        />
        <SecondaryTile
          href="/teacher/messages"
          eyebrow="Announcements"
          icon={<Megaphone className="h-5 w-5 text-earth" strokeWidth={1.5} aria-hidden />}
          value="2"
          line="Staff noticeboard · HOD updates"
          valueColour="text-ink"
        />
      </div>
    </div>
  );
}

function SecondaryTile({
  href,
  eyebrow,
  icon,
  value,
  line,
  valueColour,
}: {
  href: string;
  eyebrow: string;
  icon: React.ReactNode;
  value: string;
  line: string;
  valueColour: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded border border-sand bg-white p-5 transition-all duration-200 ease-out-soft hover:-translate-y-px hover:shadow-e2"
    >
      <div className="flex items-center justify-between">
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
        {icon}
      </div>
      <p className={`mt-2 font-display text-[40px] leading-none tabular-nums ${valueColour}`}>
        {value}
      </p>
      <p className="mt-2 font-sans text-[13px] text-stone">{line}</p>
    </Link>
  );
}
