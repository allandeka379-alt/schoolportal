import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Download,
  FileText,
} from 'lucide-react';

import {
  ASSIGNMENTS_FOR_FARAI,
  GRADEBOOK_FARAI,
  RESOURCES,
  SUBJECTS,
  type DemoAssignment,
  type GradebookRow,
} from '@/lib/mock/fixtures';
import { subjectNameByCode } from '@/lib/mock/student-extras';

import {
  EditorialCard,
  SectionEyebrow,
  StatusPill,
  TrendArrow,
} from '@/components/student/primitives';

/**
 * Grade detail — per-subject deep-dive.
 *
 * Layered view: big headline (current total, grade, position trend),
 * component breakdown, history chart, recent assessments, teacher's
 * comment, linked revision resources.
 */

interface PageProps {
  params: { subjectCode: string };
}

export default function SubjectGradePage({ params }: PageProps) {
  const code = params.subjectCode.toUpperCase();
  const row = GRADEBOOK_FARAI.find((r) => r.subjectCode === code);
  if (!row) return notFound();

  const subject = SUBJECTS.find((s) => s.code === code);
  const relatedAssignments = ASSIGNMENTS_FOR_FARAI.filter((a) => a.subjectCode === code);
  const relatedResources = RESOURCES.filter((r) => r.subjectCode === code);

  // Synthesise a per-assessment history so the deep-dive has shape.
  const history = buildHistory(row);
  const comment = TEACHER_COMMENT[row.subjectCode] ?? defaultComment(row);

  return (
    <div className="space-y-8">
      {/* Back link + header */}
      <div>
        <Link
          href="/student/grades"
          className="inline-flex items-center gap-2 font-sans text-[12px] font-medium text-earth hover:text-terracotta"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          All grades
        </Link>

        <header className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">
              {row.subjectCode}
            </p>
            <h1 className="mt-1 font-display text-[clamp(1.75rem,3vw,2.5rem)] text-ink">
              {row.subjectName}
            </h1>
            <p className="mt-2 font-sans text-[13px] text-stone">
              Teacher: {subject?.teacher ?? 'HHA faculty'} · Term 2, 2026
            </p>
          </div>
          <Link
            href={`/student/messages?teacher=${encodeURIComponent(subject?.teacher ?? '')}`}
            className="btn-terracotta"
          >
            Message teacher
          </Link>
        </header>
      </div>

      {/* Headline band */}
      <div className="grid grid-cols-1 gap-6 rounded border border-sand bg-sand-light px-6 py-8 md:grid-cols-4 md:px-10">
        <div className="md:col-span-2">
          <p className="hha-eyebrow-earth">Current total</p>
          <div className="mt-3 flex items-end gap-3">
            <p className="font-display text-[clamp(3.5rem,6vw,5.5rem)] leading-none text-ink tabular-nums">
              {row.total}
              <span className="text-[28px] text-stone">%</span>
            </p>
            <TrendArrow direction={row.trend === 'up' ? 'up' : row.trend === 'down' ? 'down' : 'flat'} />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span
              className={[
                'rounded-sm px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em]',
                gradeSurface(row.grade),
              ].join(' ')}
            >
              Grade {row.grade}
            </span>
            <span className="font-sans text-[12px] text-stone">
              Position {row.position} of 32
            </span>
          </div>
        </div>

        <ComponentStat label="Continuous" value={row.continuous} sub="40% weight" />
        <ComponentStat label="Mid-term" value={row.midterm} sub="20% weight" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* History + breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <EditorialCard className="overflow-hidden">
            <div className="border-b border-sand px-6 py-4">
              <SectionEyebrow>This term · assessment history</SectionEyebrow>
              <p className="mt-1 font-sans text-[13px] text-stone">
                {history.length} assessments so far · weighted total {row.total}%
              </p>
            </div>
            <ul className="divide-y divide-sand-light">
              {history.map((h) => (
                <li key={h.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[15px] text-ink">{h.label}</p>
                    <p className="mt-0.5 font-sans text-[12px] text-stone">
                      {h.kind} · {h.date} · weight {h.weight}%
                    </p>
                  </div>
                  <p className="flex-none font-mono tabular-nums text-[15px] text-ink">
                    {h.score}
                    <span className="text-stone text-[12px]"> / {h.max}</span>
                  </p>
                  <span className="flex-none font-mono tabular-nums text-[13px] text-stone">
                    {((h.score / h.max) * 100).toFixed(0)}%
                  </span>
                </li>
              ))}
            </ul>
          </EditorialCard>

          {/* Trend chart */}
          <EditorialCard>
            <div className="border-b border-sand px-6 py-4">
              <SectionEyebrow>Six-term trend</SectionEyebrow>
              <p className="mt-1 font-sans text-[13px] text-stone">
                Your average over the last six terms · steady improvement
              </p>
            </div>
            <div className="p-6">
              <TrendChart data={TERM_TREND[row.subjectCode] ?? defaultTrend(row.total)} />
            </div>
          </EditorialCard>

          {/* Related assignments */}
          {relatedAssignments.length > 0 ? (
            <EditorialCard>
              <div className="flex items-center justify-between border-b border-sand px-6 py-4">
                <SectionEyebrow>Related assignments</SectionEyebrow>
                <Link
                  href="/student/assignments"
                  className="font-sans text-[12px] font-medium text-earth hover:text-terracotta"
                >
                  All
                </Link>
              </div>
              <ul className="divide-y divide-sand-light">
                {relatedAssignments.slice(0, 4).map((a) => (
                  <li key={a.id}>
                    <Link
                      href={`/student/assignments/${a.id}`}
                      className="flex items-center gap-3 px-6 py-4 hover:bg-sand-light/40"
                    >
                      <FileText className="h-4 w-4 flex-none text-earth" strokeWidth={1.5} aria-hidden />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-sans text-[14px] text-ink">{a.title}</p>
                        <p className="font-sans text-[12px] text-stone">
                          {a.teacher} ·{' '}
                          {new Date(a.dueAt).toLocaleDateString('en-ZW', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </p>
                      </div>
                      <StatusPill state={statePillFor(a)} />
                      <ChevronRight className="h-4 w-4 flex-none text-stone" strokeWidth={1.5} aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </EditorialCard>
          ) : null}
        </div>

        {/* Side column */}
        <div className="space-y-6">
          {/* Teacher comment */}
          <EditorialCard className="p-6">
            <SectionEyebrow>Teacher comment</SectionEyebrow>
            <blockquote className="mt-3 font-serif text-[16px] leading-relaxed text-ink">
              {comment}
            </blockquote>
            <p className="mt-3 font-sans text-[12px] text-stone">
              — {subject?.teacher ?? 'HHA faculty'}
            </p>
          </EditorialCard>

          {/* Revision resources */}
          {relatedResources.length > 0 ? (
            <EditorialCard>
              <div className="flex items-center justify-between border-b border-sand px-6 py-4">
                <SectionEyebrow>Revision</SectionEyebrow>
                <Link
                  href={`/student/library?subject=${row.subjectCode}`}
                  className="font-sans text-[12px] font-medium text-earth hover:text-terracotta"
                >
                  Library
                </Link>
              </div>
              <ul className="divide-y divide-sand-light">
                {relatedResources.slice(0, 3).map((r) => (
                  <li key={r.id}>
                    <Link
                      href="/student/library"
                      className="flex items-start gap-3 px-6 py-4 hover:bg-sand-light/40"
                    >
                      <div className="flex h-9 w-9 flex-none items-center justify-center rounded bg-sand-light">
                        <BookOpen className="h-4 w-4 text-earth" strokeWidth={1.5} aria-hidden />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-sans text-[13px] text-ink">{r.title}</p>
                        <p className="mt-0.5 font-sans text-[11px] text-stone">
                          {r.kind} · {r.size ?? r.duration}
                        </p>
                      </div>
                      <Download className="h-4 w-4 flex-none text-stone" strokeWidth={1.5} aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </EditorialCard>
          ) : null}

          {/* Predicted grade */}
          <EditorialCard className="p-6">
            <SectionEyebrow>Prediction</SectionEyebrow>
            <p className="mt-2 font-sans text-[13px] text-stone">
              At the current trajectory, you are predicted to finish the year at
            </p>
            <p className="mt-3 font-display text-[36px] leading-none text-ink tabular-nums">
              {Math.min(row.total + 3, 98)}
              <span className="text-[16px] text-stone">% · Grade {bumpGrade(row.grade)}</span>
            </p>
            <p className="mt-3 font-sans text-[12px] text-stone">
              Keep up with assignments and attend the Saturday revision session to push this higher.
            </p>
          </EditorialCard>
        </div>
      </div>
    </div>
  );
}

function ComponentStat({
  label,
  value,
  sub,
}: {
  label: string;
  value: number;
  sub: string;
}) {
  return (
    <div>
      <p className="hha-eyebrow-earth">{label}</p>
      <p className="mt-3 font-display text-[40px] leading-none text-ink tabular-nums">
        {value}
        <span className="text-[16px] text-stone">%</span>
      </p>
      <p className="mt-2 font-sans text-[11px] uppercase tracking-[0.12em] text-stone">
        {sub}
      </p>
    </div>
  );
}

function TrendChart({ data }: { data: { term: string; score: number }[] }) {
  const max = Math.max(...data.map((d) => d.score));
  const min = Math.min(...data.map((d) => d.score));
  const height = 120;
  const width = 480;
  const step = width / (data.length - 1);
  const y = (s: number) => {
    const range = Math.max(max - min, 10);
    return height - ((s - min) / range) * (height - 20) - 10;
  };

  const pathPoints = data.map((d, i) => `${i * step},${y(d.score)}`).join(' ');

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-32 w-full">
        <polyline
          fill="none"
          stroke="rgb(var(--accent))"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          points={pathPoints}
        />
        {data.map((d, i) => (
          <circle
            key={d.term}
            cx={i * step}
            cy={y(d.score)}
            r={3.5}
            fill="rgb(var(--accent))"
          />
        ))}
      </svg>
      <ul className="mt-3 grid grid-cols-6 gap-1 font-mono text-[11px] uppercase tracking-[0.08em] text-stone">
        {data.map((d, i) => (
          <li
            key={d.term}
            className={[
              'flex flex-col items-center',
              i === data.length - 1 ? 'font-semibold text-ink' : '',
            ].join(' ')}
          >
            <span className="font-sans tabular-nums">{d.score}%</span>
            <span>{d.term}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Helper data + helpers                                               */
/* ------------------------------------------------------------------ */

function gradeSurface(grade: string): string {
  return grade === 'A'
    ? 'bg-[#EBE8F5] text-[#4F3E99]'
    : grade === 'B'
    ? 'bg-sand-light text-earth'
    : grade === 'C'
    ? 'bg-[#FDF4E3] text-[#92650B]'
    : 'bg-[#FBEBEA] text-[#B0362A]';
}

function bumpGrade(g: string): string {
  if (g === 'C') return 'B';
  if (g === 'B') return 'A';
  return g;
}

function statePillFor(a: DemoAssignment) {
  return a.status === 'RETURNED'
    ? 'marked'
    : a.status === 'SUBMITTED'
    ? 'submitted'
    : a.status === 'LATE'
    ? 'overdue'
    : 'pending';
}

function buildHistory(row: GradebookRow) {
  return [
    { id: 'h1', label: 'Baseline test', kind: 'Assessment', date: 'Week 1', score: Math.round(row.continuous - 4), max: 100, weight: 5 },
    { id: 'h2', label: 'Worksheet 1', kind: 'Class work', date: 'Week 2', score: Math.round(row.continuous - 2), max: 100, weight: 8 },
    { id: 'h3', label: 'Worksheet 3', kind: 'Class work', date: 'Week 3', score: Math.round(row.continuous + 2), max: 100, weight: 8 },
    { id: 'h4', label: 'Mid-term paper', kind: 'Examination', date: 'Week 4', score: row.midterm, max: 100, weight: 20 },
    { id: 'h5', label: 'Worksheet 5', kind: 'Class work', date: 'Week 5', score: Math.round((row.continuous + row.midterm) / 2), max: 100, weight: 8 },
  ];
}

const TEACHER_COMMENT: Record<string, string> = {
  MATH:
    'Farai, your quadratics technique has sharpened. Completing the square comes naturally now. Push harder on multi-step word problems — the marks on Worksheet 5 suggest you can.',
  ENGL:
    'Strong voice in your creative writing. For the next paper, tighten introductions and vary sentence length in the argument essays.',
  CHEM:
    'Your practical write-ups have slipped — particularly the discussion section. Book a lunchtime slot and we will go through the last two together.',
};

const TERM_TREND: Record<string, { term: string; score: number }[]> = {
  MATH: [
    { term: 'T3 2024', score: 58 },
    { term: 'T1 2025', score: 62 },
    { term: 'T2 2025', score: 65 },
    { term: 'T3 2025', score: 68 },
    { term: 'T1 2026', score: 72 },
    { term: 'T2 2026', score: 70 },
  ],
  ENGL: [
    { term: 'T3 2024', score: 68 },
    { term: 'T1 2025', score: 72 },
    { term: 'T2 2025', score: 74 },
    { term: 'T3 2025', score: 76 },
    { term: 'T1 2026', score: 79 },
    { term: 'T2 2026', score: 80 },
  ],
  CHEM: [
    { term: 'T3 2024', score: 66 },
    { term: 'T1 2025', score: 68 },
    { term: 'T2 2025', score: 66 },
    { term: 'T3 2025', score: 63 },
    { term: 'T1 2026', score: 62 },
    { term: 'T2 2026', score: 61 },
  ],
};

function defaultTrend(current: number) {
  const offsets = [-8, -6, -4, -2, -1, 0];
  return offsets.map((o, i) => ({
    term: ['T3 2024', 'T1 2025', 'T2 2025', 'T3 2025', 'T1 2026', 'T2 2026'][i]!,
    score: Math.max(40, Math.min(98, current + o)),
  }));
}

function defaultComment(row: GradebookRow) {
  if (row.trend === 'up') {
    return `Real progress in ${row.subjectName.toLowerCase()}. Keep the momentum through mid-term.`;
  }
  if (row.trend === 'down') {
    return `${row.subjectName} needs attention — book a session with your subject teacher.`;
  }
  return `Solid and steady in ${row.subjectName.toLowerCase()}. A small push could tip this into the next grade band.`;
}
