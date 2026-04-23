import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  GraduationCap,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/student/progress-ring';
import { GRADEBOOK_FARAI } from '@/lib/mock/fixtures';
import { CURRENT_TERM } from '@/lib/mock/student-extras';

/**
 * Grades overview — card-dense redesign.
 *
 *   Header band with term, average, and class position stat cards
 *   Subject grid with ProgressRing + grade badge + trend icon
 *   Breakdown table that reads as a card
 */
export default function GradesOverviewPage() {
  const average = Math.round(
    GRADEBOOK_FARAI.reduce((sum, row) => sum + row.total, 0) / GRADEBOOK_FARAI.length,
  );
  const totalSubjects = GRADEBOOK_FARAI.length;
  const strongCount = GRADEBOOK_FARAI.filter((r) => r.total >= 80).length;
  const needsAttention = GRADEBOOK_FARAI.filter((r) => r.total < 60).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <p className="text-small text-muted">Your marks across every subject</p>
        <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-ink">
          Grades · {CURRENT_TERM.label}
        </h1>
      </header>

      {/* KPI tiles */}
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiTile
          label="Term average"
          value={`${average}%`}
          sub={`across ${totalSubjects} subjects`}
          icon={<GraduationCap className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
          tone="brand"
          ring={average}
        />
        <KpiTile
          label="Class position"
          value={
            CURRENT_TERM.classPositionOptedIn ? `${CURRENT_TERM.classPosition}` : '—'
          }
          sub={
            CURRENT_TERM.classPositionOptedIn
              ? `of ${CURRENT_TERM.classSize} students`
              : 'Opted out · Profile → Privacy'
          }
          icon={<TrendingUp className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
          tone="info"
        />
        <KpiTile
          label="Strong subjects"
          value={`${strongCount}`}
          sub="grade A · 80% and above"
          icon={<Badge tone="success">A</Badge>}
          tone="success"
        />
        <KpiTile
          label="Needs attention"
          value={`${needsAttention}`}
          sub={needsAttention === 0 ? 'nothing flagged · well done' : 'below 60%'}
          icon={<TrendingDown className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
          tone={needsAttention === 0 ? 'success' : 'warning'}
        />
      </ul>

      {/* Subject cards */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-h3 text-ink">Every subject</h2>
          <p className="text-small text-muted">Click a card to drill into the subject</p>
        </div>
        <ul className="stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {GRADEBOOK_FARAI.map((row) => {
            const ringTone: 'success' | 'brand' | 'warning' | 'danger' =
              row.total >= 80
                ? 'success'
                : row.total >= 65
                ? 'brand'
                : row.total >= 50
                ? 'warning'
                : 'danger';
            const gradeBadge: 'success' | 'info' | 'warning' | 'danger' =
              row.grade === 'A' ? 'success' : row.grade === 'B' ? 'info' : row.grade === 'C' ? 'warning' : 'danger';
            return (
              <li key={row.subjectCode}>
                <Link
                  href={`/student/grades/${row.subjectCode.toLowerCase()}`}
                  className="hover-lift group flex h-full flex-col gap-4 rounded-lg border border-line bg-card p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-2.5 py-0.5 text-micro font-semibold text-brand-primary">
                      <BookOpen className="h-3 w-3" strokeWidth={2} aria-hidden />
                      {row.subjectCode}
                    </div>
                    <ProgressRing value={row.total} tone={ringTone} size={56} stroke={5} />
                  </div>
                  <div>
                    <p className="text-small font-semibold text-ink group-hover:text-brand-primary">
                      {row.subjectName}
                    </p>
                    <p className="mt-0.5 text-micro text-muted">
                      Position {row.position} · CA {row.continuous}% · Mid {row.midterm}%
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-line pt-3">
                    <Badge tone={gradeBadge}>Grade {row.grade}</Badge>
                    <span className="inline-flex items-center gap-1 text-micro text-muted">
                      {row.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3 text-success" strokeWidth={2} aria-hidden />
                      ) : row.trend === 'down' ? (
                        <TrendingDown className="h-3 w-3 text-danger" strokeWidth={2} aria-hidden />
                      ) : null}
                      this term
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Breakdown table */}
      <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
        <header className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <div>
            <h2 className="text-small font-semibold text-ink">Component breakdown</h2>
            <p className="text-micro text-muted">Continuous 40% · Mid-term 20% · End-term 40%</p>
          </div>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-small">
            <thead>
              <tr className="bg-surface/60 text-left">
                <th className="px-5 py-3 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  Subject
                </th>
                <th className="px-4 py-3 text-right text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  CA
                </th>
                <th className="px-4 py-3 text-right text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  Mid
                </th>
                <th className="px-4 py-3 text-right text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  End
                </th>
                <th className="px-4 py-3 text-right text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  Total
                </th>
                <th className="px-4 py-3 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  Grade
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {GRADEBOOK_FARAI.map((row) => {
                const gradeBadge: 'success' | 'info' | 'warning' | 'danger' =
                  row.grade === 'A' ? 'success' : row.grade === 'B' ? 'info' : row.grade === 'C' ? 'warning' : 'danger';
                return (
                  <tr key={row.subjectCode} className="border-t border-line">
                    <td className="px-5 py-3">
                      <span className="text-small font-semibold text-ink">{row.subjectName}</span>
                      <span className="ml-2 text-micro text-muted">{row.subjectCode}</span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-ink">{row.continuous}%</td>
                    <td className="px-4 py-3 text-right tabular-nums text-ink">{row.midterm}%</td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted">
                      {row.endterm ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums text-ink">
                      {row.total}%
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={gradeBadge}>{row.grade}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/student/grades/${row.subjectCode.toLowerCase()}`}
                        aria-label={`Open ${row.subjectName}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-brand-primary"
                      >
                        <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Report card card */}
      <div className="rounded-lg border border-line bg-card p-5 shadow-card-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-micro font-semibold uppercase tracking-[0.12em] text-brand-primary">
              End-of-term report
            </p>
            <p className="mt-1 text-small text-ink">
              Releases after mid-term. Form teacher and administrator both sign off.
            </p>
          </div>
          <Link
            href="/parent/reports"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface px-4 text-small font-semibold text-ink transition-colors hover:bg-card"
          >
            View past reports
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}

function KpiTile({
  label,
  value,
  sub,
  icon,
  tone,
  ring,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  tone: 'brand' | 'success' | 'info' | 'warning' | 'danger';
  ring?: number;
}) {
  const toneStyles = {
    brand: 'bg-brand-primary/10 text-brand-primary',
    success: 'bg-success/10 text-success',
    info: 'bg-info/10 text-info',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
  }[tone];
  return (
    <li className="rounded-lg border border-line bg-card p-5 shadow-card-sm">
      <div className="flex items-center justify-between">
        <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
        {ring !== undefined ? (
          <ProgressRing value={ring} size={44} stroke={5} tone={tone === 'danger' ? 'danger' : tone === 'warning' ? 'warning' : tone === 'success' ? 'success' : 'brand'} />
        ) : (
          <span className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${toneStyles}`}>
            {icon}
          </span>
        )}
      </div>
      <p className="mt-3 text-h1 tabular-nums text-ink">{value}</p>
      <p className="mt-1 text-micro text-muted">{sub}</p>
    </li>
  );
}
