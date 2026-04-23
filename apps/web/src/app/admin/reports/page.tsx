'use client';

import { useMemo, useState } from 'react';
import {
  BarChart3,
  ClipboardList,
  Download,
  FileText,
  GraduationCap,
  Landmark,
  PiggyBank,
} from 'lucide-react';

import {
  ADMIN_REPORTS,
  type AdminReport,
  type ReportCategory,
} from '@/lib/mock/school';

/**
 * Admin reports — compliance, board, operational, academic.
 *
 * Three columns: KPI summary across the top; the report catalogue filtered
 * by category; a highlight strip for the report that's due next.
 */

const CATEGORY_ICON: Record<ReportCategory, React.ReactNode> = {
  STATUTORY: <Landmark className="h-4 w-4" strokeWidth={1.5} aria-hidden />,
  BOARD: <PiggyBank className="h-4 w-4" strokeWidth={1.5} aria-hidden />,
  OPERATIONAL: <ClipboardList className="h-4 w-4" strokeWidth={1.5} aria-hidden />,
  ACADEMIC: <GraduationCap className="h-4 w-4" strokeWidth={1.5} aria-hidden />,
};

const CATEGORY_LABEL: Record<ReportCategory, string> = {
  STATUTORY: 'Statutory',
  BOARD: 'Board',
  OPERATIONAL: 'Operational',
  ACADEMIC: 'Academic',
};

export default function ReportsPage() {
  const [category, setCategory] = useState<ReportCategory | 'ALL'>('ALL');

  const filtered = useMemo(
    () =>
      category === 'ALL'
        ? ADMIN_REPORTS
        : ADMIN_REPORTS.filter((r) => r.category === category),
    [category],
  );

  const counts = useMemo(() => {
    const c: Record<ReportCategory, number> = {
      STATUTORY: 0,
      BOARD: 0,
      OPERATIONAL: 0,
      ACADEMIC: 0,
    };
    ADMIN_REPORTS.forEach((r) => {
      c[r.category] += 1;
    });
    return c;
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <p
          className="font-mono text-[11px] font-medium uppercase tracking-[0.18em]"
          style={{ color: 'rgb(var(--accent))' }}
        >
          Compliance · Reports
        </p>
        <h1 className="mt-2 font-display text-[clamp(1.75rem,3vw,2.25rem)] font-medium tracking-tight text-obsidian">
          The reports that leave this office.
        </h1>
        <p className="mt-2 max-w-[78ch] font-sans text-[14px] text-slate">
          Statutory returns to the Ministry · board pack for the monthly meeting · operational
          reports for the Headmaster · academic reports for form teachers and parents. Every report
          is available as PDF <em>and</em> Excel — no format lock-in.
        </p>
      </header>

      {/* Summary tiles */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <SummaryTile
          label="Collected · Term 2"
          value="$184,320"
          sub="62% of target · $296,000 remaining"
        />
        <SummaryTile
          label="Generated this month"
          value="47"
          sub="12 statutory · 35 operational"
        />
        <SummaryTile
          label="Report-card approvals"
          value="18"
          sub="At form-teacher stage"
          tone="warning"
        />
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap items-center gap-2 rounded-md border border-mist bg-snow p-2">
        <button
          type="button"
          onClick={() => setCategory('ALL')}
          className={[
            'inline-flex h-9 items-center gap-2 rounded-md px-3 font-mono text-[11px] font-medium uppercase tracking-[0.1em] transition-colors',
            category === 'ALL' ? 'bg-obsidian text-snow' : 'text-slate hover:bg-fog',
          ].join(' ')}
        >
          All
          <span className="rounded-sm bg-snow/10 px-1.5 py-0.5 font-mono text-[10px] tabular-nums">
            {ADMIN_REPORTS.length}
          </span>
        </button>
        {(Object.keys(CATEGORY_LABEL) as ReportCategory[]).map((c) => {
          const active = category === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={[
                'inline-flex h-9 items-center gap-2 rounded-md px-3 font-mono text-[11px] font-medium uppercase tracking-[0.1em] transition-colors',
                active ? 'bg-obsidian text-snow' : 'text-slate hover:bg-fog',
              ].join(' ')}
            >
              {CATEGORY_ICON[c]}
              {CATEGORY_LABEL[c]}
              <span
                className={[
                  'rounded-sm px-1.5 py-0.5 font-mono text-[10px] tabular-nums',
                  active ? 'bg-snow/10 text-snow' : 'bg-fog text-steel',
                ].join(' ')}
              >
                {counts[c]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Report catalogue */}
      <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filtered.map((r) => (
          <ReportCard key={r.id} report={r} />
        ))}
      </ul>

      {/* Spec footer */}
      <aside className="rounded-md border border-mist bg-fog/50 p-5">
        <p
          className="font-mono text-[11px] font-medium uppercase tracking-[0.18em]"
          style={{ color: 'rgb(var(--accent))' }}
        >
          Report engine
        </p>
        <p className="mt-2 max-w-[84ch] font-sans text-[13px] leading-relaxed text-slate">
          Reports run against the live fixture/DB with a frozen timestamp so each regeneration is
          reproducible. Every export carries a SHA-256 footer so regulators can verify authenticity.
          Custom reports can be composed via the academic office — turnaround is 72 hours.
        </p>
      </aside>
    </div>
  );
}

function SummaryTile({
  label,
  value,
  sub,
  tone = 'default',
}: {
  label: string;
  value: string;
  sub: string;
  tone?: 'default' | 'warning';
}) {
  const border =
    tone === 'warning' ? 'border-t-[3px] border-t-signal-warning' : 'border-t-[3px] border-t-mist';
  return (
    <div className={`rounded-md border border-mist bg-snow p-5 ${border}`}>
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-slate">
        {label}
      </p>
      <p className="mt-2 font-display text-[28px] font-medium leading-none text-obsidian tabular-nums">
        {value}
      </p>
      <p className="mt-2 font-sans text-[12px] text-steel">{sub}</p>
    </div>
  );
}

function ReportCard({ report }: { report: AdminReport }) {
  return (
    <li className="group rounded-md border border-mist bg-snow p-5 transition-shadow duration-200 ease-out-soft hover:shadow-e2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1 rounded-sm bg-fog px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-slate"
          >
            {CATEGORY_ICON[report.category]}
            {CATEGORY_LABEL[report.category]}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-steel">
            {report.cadence}
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-steel">
          {report.format}
        </span>
      </div>

      <h3 className="mt-4 font-display text-[17px] font-medium leading-snug tracking-tight text-obsidian">
        {report.name}
      </h3>
      <p className="mt-2 font-sans text-[13px] leading-relaxed text-slate">
        {report.description}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-mist pt-3">
        <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-steel">
          Owner: <span className="text-obsidian">{report.owner}</span> · Updated{' '}
          {new Date(report.updatedAt).toLocaleDateString('en-ZW', {
            day: 'numeric',
            month: 'short',
          })}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Open report"
            className="rounded-md border border-mist bg-snow p-1.5 text-slate transition-colors hover:bg-fog hover:text-obsidian"
          >
            <FileText className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Download"
            className="rounded-md border border-mist bg-snow p-1.5 text-slate transition-colors hover:bg-fog hover:text-obsidian"
          >
            <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Open analytics"
            className="rounded-md border border-mist bg-snow p-1.5 text-slate transition-colors hover:bg-fog hover:text-obsidian"
          >
            <BarChart3 className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </li>
  );
}
