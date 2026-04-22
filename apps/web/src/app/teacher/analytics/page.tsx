import Link from 'next/link';
import { AlertTriangle, ArrowRight, TrendingDown, TrendingUp } from 'lucide-react';

import { EditorialAvatar, EditorialCard, SectionEyebrow, TrendArrow } from '@/components/student/primitives';
import { ClassChip, TeacherPageHeader } from '@/components/teacher/primitives';
import { EARLY_WARNING, TEACHER_CLASSES } from '@/lib/mock/teacher-extras';

/**
 * Analytics & Early Warning — §14.
 *
 * Four class-level KPI cards; mark-distribution histogram; trend over time;
 * Early Warning list (subject teacher's most useful automated feature).
 */
export default function AnalyticsPage() {
  const cls = TEACHER_CLASSES[0]!;
  const distribution = [4, 9, 10, 7, 2]; // A, B, C, D, E counts
  const gradeLabels = ['A', 'B', 'C', 'D', 'E'];
  const trend = [62, 65, 68, 72, 74, 76, 76, 78];

  return (
    <div className="space-y-8">
      <TeacherPageHeader
        eyebrow="Analytics"
        title="How the class is actually doing,"
        accent="not just the average."
        subtitle="Early Warning is the useful bit. It exists to surface students before the parent-teacher meeting, not during it."
      />

      {/* Class selector (simplified to one for demo) */}
      <div className="flex flex-wrap items-center gap-2">
        <ClassChip form={cls.form} stream={cls.stream} subjectName={cls.subjectName} subjectTone={cls.subjectTone} />
        <span className="font-sans text-[12px] text-stone">· Term 2, 2026</span>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Average" value={`${cls.averagePercent}%`} hint="+2 vs mid-term" trend="up" />
        <Kpi label="Attendance" value={`${cls.attendancePercent}%`} hint="On target" trend="flat" />
        <Kpi label="Submission rate" value={`${cls.submissionPercent}%`} hint="−4 vs last term" trend="down" />
        <Kpi
          label="At risk"
          value={EARLY_WARNING.length.toString()}
          hint="see list below"
          trend="down"
          danger
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Distribution histogram */}
        <EditorialCard className="overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b border-sand px-6 py-4">
            <SectionEyebrow>Mark distribution</SectionEyebrow>
            <span className="font-sans text-[12px] text-stone">Last assessment · Test 2</span>
          </div>
          <div className="p-6">
            <div className="flex h-44 items-end gap-3">
              {distribution.map((c, i) => {
                const pct = (c / Math.max(...distribution)) * 100;
                return (
                  <div key={gradeLabels[i]} className="flex flex-1 flex-col items-center gap-2">
                    <span className="font-mono text-[12px] tabular-nums text-stone">{c}</span>
                    <div
                      className="w-full rounded-t bg-earth/70 transition-all hover:bg-terracotta"
                      style={{ height: `${pct}%` }}
                    />
                    <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                      {gradeLabels[i]}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 font-serif text-[13px] text-stone">
              The cohort is bunched in the middle bands — no bimodal split. Distribution suggests
              the ceiling of Grade A is reachable if we tighten exam-condition pace.
            </p>
          </div>
        </EditorialCard>

        {/* Trend over time */}
        <EditorialCard className="overflow-hidden">
          <div className="border-b border-sand px-6 py-4">
            <SectionEyebrow>Trend over time</SectionEyebrow>
            <p className="mt-1 font-sans text-[12px] text-stone">Class average · last 3 terms</p>
          </div>
          <div className="p-6">
            <svg viewBox="0 0 280 140" className="h-44 w-full" aria-label="Trend chart">
              <defs>
                <linearGradient id="trendG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#C65D3D" stopOpacity="0.3" />
                  <stop offset="1" stopColor="#C65D3D" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Gridlines */}
              {[0, 25, 50, 75, 100].map((y) => (
                <line
                  key={y}
                  x1="0"
                  x2="280"
                  y1={140 - (y / 100) * 120}
                  y2={140 - (y / 100) * 120}
                  stroke="#E8DCC4"
                  strokeDasharray={y === 0 ? '0' : '2 2'}
                />
              ))}
              {/* Line */}
              <polyline
                fill="none"
                stroke="#C65D3D"
                strokeWidth="2"
                points={trend
                  .map((v, i) => `${(i / (trend.length - 1)) * 280},${140 - (v / 100) * 120}`)
                  .join(' ')}
              />
              {/* Area under */}
              <polygon
                fill="url(#trendG)"
                points={`0,140 ${trend
                  .map((v, i) => `${(i / (trend.length - 1)) * 280},${140 - (v / 100) * 120}`)
                  .join(' ')} 280,140`}
              />
              {/* Points */}
              {trend.map((v, i) => (
                <circle
                  key={i}
                  cx={(i / (trend.length - 1)) * 280}
                  cy={140 - (v / 100) * 120}
                  r="3"
                  fill="#FAF5EB"
                  stroke="#C65D3D"
                  strokeWidth="1.5"
                />
              ))}
            </svg>
            <p className="mt-3 font-sans text-[11px] text-stone">
              T1 → T2 improvement: +8 points. Tightening held through mid-term.
            </p>
          </div>
        </EditorialCard>
      </div>

      {/* Early-warning list */}
      <EditorialCard className="overflow-hidden border-t-[3px] border-t-terracotta">
        <div className="flex items-center justify-between border-b border-sand px-6 py-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-terracotta" strokeWidth={1.5} aria-hidden />
            <SectionEyebrow>Early warning</SectionEyebrow>
          </div>
          <span className="font-sans text-[12px] text-stone">
            Visible to subject teacher, form teacher, HOD, deputy head
          </span>
        </div>
        <ul className="divide-y divide-sand-light">
          {EARLY_WARNING.map((w) => (
            <li key={w.studentId} className="flex flex-wrap items-center gap-4 px-6 py-4">
              <EditorialAvatar name={w.studentName} size="md" tone="terracotta" />
              <div className="min-w-0 flex-1">
                <p className="font-sans font-semibold text-ink">{w.studentName}</p>
                <p className="mt-0.5 flex items-center gap-2 font-sans text-[12px] text-stone">
                  {w.trigger === 'mark-drop' ? (
                    <TrendingDown className="h-3.5 w-3.5 text-danger" strokeWidth={1.5} aria-hidden />
                  ) : w.trigger === 'attendance-drop' ? (
                    <TrendingDown className="h-3.5 w-3.5 text-ochre" strokeWidth={1.5} aria-hidden />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5 text-ochre" strokeWidth={1.5} aria-hidden />
                  )}
                  {w.triggerDetail}
                </p>
              </div>
              <div className="text-right">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-earth">
                  Suggested
                </p>
                <p className="mt-0.5 font-sans text-[13px] text-ink">{w.suggestedAction}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex h-8 items-center rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
                >
                  Acknowledge
                </button>
                <Link
                  href="/teacher/messages"
                  className="inline-flex h-8 items-center gap-1 rounded bg-terracotta px-3 font-sans text-[12px] font-semibold text-cream hover:bg-terracotta-hover"
                >
                  Message parent
                  <ArrowRight className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </EditorialCard>
    </div>
  );
}

function Kpi({
  label,
  value,
  hint,
  trend,
  danger,
}: {
  label: string;
  value: string;
  hint: string;
  trend: 'up' | 'flat' | 'down';
  danger?: boolean;
}) {
  const icon =
    trend === 'up' ? (
      <TrendingUp className="h-4 w-4 text-ok" strokeWidth={1.5} aria-hidden />
    ) : trend === 'down' ? (
      <TrendingDown className="h-4 w-4 text-danger" strokeWidth={1.5} aria-hidden />
    ) : (
      <TrendArrow direction="flat" />
    );
  return (
    <EditorialCard className="px-5 py-4">
      <div className="flex items-center justify-between">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
          {label}
        </p>
        {icon}
      </div>
      <p
        className={[
          'mt-2 font-display text-[34px] leading-none tabular-nums',
          danger ? 'text-danger' : 'text-ink',
        ].join(' ')}
      >
        {value}
      </p>
      <p className="mt-1 font-sans text-[12px] text-stone">{hint}</p>
    </EditorialCard>
  );
}
