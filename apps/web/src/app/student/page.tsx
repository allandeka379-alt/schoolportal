import Link from 'next/link';
import { ArrowRight, Flame, Heart } from 'lucide-react';

import { currentAccount } from '@/lib/auth/session';
import { ASSIGNMENTS_FOR_FARAI } from '@/lib/mock/fixtures';
import {
  CURRENT_TERM,
  dueLabel,
  FEES_SUMMARY,
  greetingFor,
  ME_STUDENT,
  RECENT_MARKS,
  STUDENT_ANNOUNCEMENTS,
  subjectNameByCode,
  TODAY_SLOTS,
} from '@/lib/mock/student-extras';

import {
  EditorialCard,
  SectionEyebrow,
  StatusPill,
  StudentEmptyState,
} from '@/components/student/primitives';

/**
 * Dashboard — §05 of the spec.
 *
 * Answers four questions in the first glance (before any scroll):
 *   1. What is due?       (Zone 2 — Due Soon)
 *   2. What is new?       (Zone 4 — Announcements)
 *   3. How am I doing?    (Zone 5 — Recent Marks)
 *   4. What is today?     (Zone 3 — Today's timetable)
 *
 * Plus Zone 1 (Welcome Hero) and Zone 6 (Fees at a Glance).
 */
export default async function StudentDashboard() {
  const account = await currentAccount();
  const firstName = account?.firstName ?? ME_STUDENT.firstName;

  const greeting = greetingFor();
  const now = new Date();
  const weekday = now.toLocaleDateString('en-ZW', { weekday: 'long' });
  const dateLabel = now.toLocaleDateString('en-ZW', { day: 'numeric', month: 'long' });
  const isBirthday = false; // would compare ME_STUDENT.dateOfBirth

  // Next three assignments that aren't marked/returned.
  const dueSoon = ASSIGNMENTS_FOR_FARAI.filter(
    (a) => a.status === 'OPEN' || a.status === 'LATE',
  )
    .slice()
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
    .slice(0, 3);

  const announcements = STUDENT_ANNOUNCEMENTS.slice(0, 2);

  return (
    <div className="space-y-8">
      {/* Zone 1 — Welcome Hero */}
      <section className="rounded border border-sand bg-sand-light px-6 py-8 md:px-10 md:py-10">
        <p className="hha-eyebrow-earth">
          {greeting}
        </p>
        <h1 className="mt-3 font-display text-[clamp(2rem,4vw,2.75rem)] leading-tight text-ink">
          {greeting}, {firstName}
          {isBirthday ? (
            <Heart className="ml-3 inline-block h-6 w-6 fill-terracotta text-terracotta" aria-label="birthday" />
          ) : (
            <span className="text-terracotta">.</span>
          )}
        </h1>
        <p className="mt-3 font-serif text-body-lg text-stone">
          {weekday}, {dateLabel} · {ME_STUDENT.form} {ME_STUDENT.stream} · {CURRENT_TERM.label} · Week {CURRENT_TERM.weekNumber}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-6 text-[13px] text-stone">
          <span className="inline-flex items-center gap-2">
            <Flame className="h-4 w-4 text-ochre" strokeWidth={1.5} aria-hidden />
            <span className="font-medium text-ink">14-day</span> study streak
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="font-medium text-ink">Savanna House</span> · 3 points this week
          </span>
          {CURRENT_TERM.classPositionOptedIn ? (
            <span className="inline-flex items-center gap-2">
              <span className="font-medium text-ink">{CURRENT_TERM.classPosition} of {CURRENT_TERM.classSize}</span> in class
            </span>
          ) : null}
        </div>
      </section>

      {/* Main grid — 3 cols on desktop.
          Left (2 cols): Due Soon + Announcements + Recent Marks
          Right (1 col): Today + Fees + Quiet Room */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Zone 2 — Due Soon */}
          <EditorialCard className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-sand px-6 py-4">
              <SectionEyebrow>Due soon</SectionEyebrow>
              <Link
                href="/student/assignments"
                className="landing-link font-sans text-[13px] font-medium text-terracotta"
              >
                View all assignments
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              </Link>
            </div>
            {dueSoon.length === 0 ? (
              <StudentEmptyState
                heading="Nothing due right now. Well done."
                body="Your assignment page is clear. Check back tomorrow."
              />
            ) : (
              <ul className="divide-y divide-sand-light">
                {dueSoon.map((a) => {
                  const due = dueLabel(a.dueAt);
                  return (
                    <li key={a.id}>
                      <Link
                        href={`/student/assignments/${a.id}`}
                        className="group flex items-center gap-5 px-6 py-5 transition-colors hover:bg-sand-light/40"
                      >
                        <DueBar tone={due.tone} />
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-[18px] leading-snug text-ink group-hover:text-earth">
                            {a.title}
                          </p>
                          <p className="mt-1 font-sans text-[13px] text-stone">
                            {subjectNameByCode(a.subjectCode)} · {a.teacher}
                          </p>
                        </div>
                        <div className="flex-none text-right">
                          <DueTag tone={due.tone} label={due.label} />
                        </div>
                        <ArrowRight
                          className="h-4 w-4 flex-none text-stone transition-transform group-hover:translate-x-1 group-hover:text-terracotta"
                          strokeWidth={1.5}
                          aria-hidden
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </EditorialCard>

          {/* Zone 4 — Announcements */}
          <EditorialCard className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-sand px-6 py-4">
              <SectionEyebrow>Announcements</SectionEyebrow>
              <Link
                href="/student/announcements"
                className="landing-link font-sans text-[13px] font-medium text-terracotta"
              >
                View all announcements
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              </Link>
            </div>
            <ul className="divide-y divide-sand-light">
              {announcements.map((a) => (
                <li
                  key={a.id}
                  className={`relative px-6 py-5 ${
                    a.pinned ? 'border-t-[3px] border-terracotta bg-sand-light/40' : ''
                  }`}
                >
                  <p className="flex items-center gap-2 font-sans text-[11px] font-semibold uppercase tracking-[0.16em]">
                    {a.category === 'Urgent' ? (
                      <span className="rounded-sm bg-terracotta px-1.5 py-0.5 text-cream">URGENT</span>
                    ) : (
                      <span className="text-earth">{a.category.toUpperCase()}</span>
                    )}
                    <span className="text-stone">· {a.publishedAgo} · {a.author}</span>
                  </p>
                  <h3 className="mt-2 font-display text-[20px] leading-snug text-ink">{a.title}</h3>
                  <p className="mt-1 line-clamp-2 font-serif text-[15px] text-stone">
                    {a.body}
                  </p>
                </li>
              ))}
            </ul>
          </EditorialCard>

          {/* Zone 5 — Recent Marks */}
          <EditorialCard className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-sand px-6 py-4">
              <SectionEyebrow>Recent marks</SectionEyebrow>
              <Link
                href="/student/grades"
                className="landing-link font-sans text-[13px] font-medium text-terracotta"
              >
                View all grades
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              </Link>
            </div>
            <ul className="divide-y divide-sand-light">
              {RECENT_MARKS.map((m) => {
                const pct = (m.mark / m.outOf) * 100;
                const tone = pct >= 80 ? 'text-ok' : pct >= 50 ? 'text-ink' : 'text-warn';
                return (
                  <li key={m.id} className="flex items-center justify-between gap-4 px-6 py-5">
                    <div className="min-w-0 flex-1">
                      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                        {m.subjectName}
                      </p>
                      <p className="mt-1 truncate font-display text-[17px] text-ink">{m.title}</p>
                      <p className="mt-0.5 font-sans text-[12px] text-stone">returned {m.returnedAgo}</p>
                    </div>
                    <div className="flex-none text-right">
                      <span className={`font-display text-[28px] tabular-nums leading-none ${tone}`}>
                        {m.mark}
                      </span>
                      <span className="font-sans text-[13px] text-stone"> /{m.outOf}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </EditorialCard>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Zone 3 — Today */}
          <EditorialCard className="overflow-hidden">
            <div className="border-b border-sand px-6 py-4">
              <SectionEyebrow>Today</SectionEyebrow>
              <p className="mt-1 font-sans text-[13px] text-stone">{weekday}, {dateLabel}</p>
            </div>
            {TODAY_SLOTS.length === 0 ? (
              <StudentEmptyState
                heading="No classes today."
                body="Enjoy your Saturday."
              />
            ) : (
              <ul className="divide-y divide-sand-light">
                {TODAY_SLOTS.map((s) => (
                  <li
                    key={s.start}
                    className={`relative flex items-center gap-3 px-6 py-3 ${
                      s.current ? 'bg-sand-light/60' : ''
                    }`}
                  >
                    {s.current ? (
                      <span
                        aria-hidden
                        className="absolute inset-y-2 left-0 w-[2px] rounded-r-sm bg-terracotta"
                      />
                    ) : null}
                    <span className="w-14 flex-none font-mono text-[13px] tabular-nums text-stone">
                      {s.start}
                    </span>
                    <div className="min-w-0 flex-1">
                      {s.kind === 'class' ? (
                        <>
                          <p className="font-display text-[16px] text-ink">{s.subject}</p>
                          <p className="font-sans text-[12px] text-stone">
                            {[s.teacher, s.room].filter(Boolean).join(' · ')}
                          </p>
                        </>
                      ) : (
                        <p className="font-serif italic text-[15px] text-stone">{s.subject}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </EditorialCard>

          {/* Zone 6 — Fees at a Glance */}
          <EditorialCard className="overflow-hidden">
            <div className="border-b border-sand px-6 py-4">
              <SectionEyebrow>Fees at a glance</SectionEyebrow>
            </div>
            <div className="px-6 py-5">
              {FEES_SUMMARY.status === 'PAID' ? (
                <>
                  <p className="font-display text-[22px] text-ink">Paid in full this term.</p>
                  <div className="mt-3">
                    <StatusPill state="paid" />
                  </div>
                </>
              ) : (
                <>
                  <p className="font-sans text-[12px] uppercase tracking-[0.16em] text-stone">
                    You owe this term
                  </p>
                  <p className="mt-1 font-display text-[38px] leading-none text-ink tabular-nums">
                    <span className="text-[22px] text-stone">{FEES_SUMMARY.currency} </span>
                    {FEES_SUMMARY.outstanding}
                  </p>
                  <div className="mt-3">
                    <StatusPill state={FEES_SUMMARY.status === 'PARTIAL' ? 'partial' : 'outstanding'} />
                  </div>
                </>
              )}
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href="/student/fees"
                  className="inline-flex h-10 items-center justify-center rounded bg-terracotta px-4 font-sans text-[13px] font-semibold text-cream hover:bg-terracotta-hover"
                >
                  {FEES_SUMMARY.status === 'PAID' ? 'View history' : 'Pay now'}
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                </Link>
              </div>
            </div>
          </EditorialCard>

          {/* Quiet Room — well-being channel */}
          <EditorialCard className="bg-sand-light/70">
            <div className="px-6 py-5">
              <SectionEyebrow>The quiet room</SectionEyebrow>
              <p className="mt-2 font-serif text-[14px] leading-relaxed text-stone">
                If you&rsquo;d like to speak to the school counsellor in confidence, you can leave a
                message anonymously.
              </p>
              <Link
                href="#"
                className="mt-3 landing-link inline-flex font-sans text-[13px] font-medium text-terracotta"
              >
                Open the Quiet Room
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              </Link>
            </div>
          </EditorialCard>
        </div>
      </div>
    </div>
  );
}

function DueBar({ tone }: { tone: 'due-today' | 'soon' | 'later' | 'overdue' }) {
  const bg = {
    'overdue': 'bg-danger',
    'due-today': 'bg-terracotta',
    soon: 'bg-ochre',
    later: 'bg-earth/40',
  }[tone];
  return <span className={`block h-12 w-[3px] rounded-full ${bg}`} aria-hidden />;
}

function DueTag({ tone, label }: { tone: 'due-today' | 'soon' | 'later' | 'overdue'; label: string }) {
  const classes = {
    overdue: 'text-danger',
    'due-today': 'text-terracotta',
    soon: 'text-ochre',
    later: 'text-stone',
  }[tone];
  return (
    <span className={`font-sans text-[13px] font-medium ${classes}`}>{label}</span>
  );
}
