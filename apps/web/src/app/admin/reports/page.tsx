'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  Check,
  ClipboardList,
  Download,
  FileText,
  GraduationCap,
  Landmark,
  Loader2,
  PiggyBank,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  ADMIN_REPORTS,
  type AdminReport,
  type ReportCategory,
} from '@/lib/mock/school';

const CATEGORY_ICON: Record<ReportCategory, React.ReactNode> = {
  STATUTORY: <Landmark className="h-4 w-4" strokeWidth={1.75} aria-hidden />,
  BOARD: <PiggyBank className="h-4 w-4" strokeWidth={1.75} aria-hidden />,
  OPERATIONAL: <ClipboardList className="h-4 w-4" strokeWidth={1.75} aria-hidden />,
  ACADEMIC: <GraduationCap className="h-4 w-4" strokeWidth={1.75} aria-hidden />,
};

const CATEGORY_LABEL: Record<ReportCategory, string> = {
  STATUTORY: 'Statutory',
  BOARD: 'Board',
  OPERATIONAL: 'Operational',
  ACADEMIC: 'Academic',
};

export default function ReportsPage() {
  const [category, setCategory] = useState<ReportCategory | 'ALL'>('ALL');
  const [busy, setBusy] = useState<null | { id: string; kind: 'open' | 'download' | 'analytics' }>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  function run(report: AdminReport, kind: 'open' | 'download' | 'analytics') {
    setBusy({ id: report.id, kind });
    setTimeout(() => {
      setBusy(null);
      setToast(
        kind === 'open'
          ? `Opened ${report.name} in viewer`
          : kind === 'download'
          ? `Downloaded ${report.name} (${report.format})`
          : `Analytics for ${report.name} — 6-month trend ready`,
      );
    }, 900);
  }

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
    <div className="space-y-8">
      {/* Header */}
      <header>
        <p className="text-small text-muted">Compliance · Reports</p>
        <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-ink">
          The reports that leave this office
        </h1>
        <p className="mt-2 max-w-[78ch] text-small text-muted">
          Statutory returns to the Ministry · board pack for the monthly meeting · operational
          reports for the Headmaster · academic reports for form teachers and parents. Every report
          is available as PDF <em>and</em> Excel — no format lock-in.
        </p>
      </header>

      {/* Summary tiles */}
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <KpiTile
          label="Collected · Term 2"
          value="USD 184,320"
          sub="62% of target · USD 296,000 remaining"
          tone="success"
        />
        <KpiTile
          label="Generated this month"
          value="47"
          sub="12 statutory · 35 operational"
        />
        <KpiTile
          label="Report-card approvals"
          value="18"
          sub="At form-teacher stage"
          tone="warning"
        />
      </ul>

      {/* Category tabs */}
      <div className="inline-flex flex-wrap items-center gap-1 rounded-full bg-surface p-1">
        <button
          type="button"
          onClick={() => setCategory('ALL')}
          className={[
            'inline-flex h-9 items-center gap-2 rounded-full px-4 text-small font-semibold transition-colors',
            category === 'ALL' ? 'bg-card text-ink shadow-card-sm' : 'text-muted hover:text-ink',
          ].join(' ')}
        >
          All
          <span
            className={[
              'rounded-full px-1.5 py-0.5 text-micro tabular-nums',
              category === 'ALL' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-card/60 text-muted',
            ].join(' ')}
          >
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
                'inline-flex h-9 items-center gap-2 rounded-full px-4 text-small font-semibold transition-colors',
                active ? 'bg-card text-ink shadow-card-sm' : 'text-muted hover:text-ink',
              ].join(' ')}
            >
              {CATEGORY_ICON[c]}
              {CATEGORY_LABEL[c]}
              <span
                className={[
                  'rounded-full px-1.5 py-0.5 text-micro tabular-nums',
                  active ? 'bg-brand-primary/10 text-brand-primary' : 'bg-card/60 text-muted',
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
          <ReportCard
            key={r.id}
            report={r}
            onOpen={() => run(r, 'open')}
            onDownload={() => run(r, 'download')}
            onAnalytics={() => run(r, 'analytics')}
            busyKind={busy?.id === r.id ? busy.kind : null}
          />
        ))}
      </ul>

      {/* Spec footer */}
      <aside className="rounded-lg border border-info/25 bg-info/[0.04] p-5">
        <p className="text-micro font-semibold uppercase tracking-[0.12em] text-info">
          Report engine
        </p>
        <p className="mt-2 max-w-[84ch] text-small leading-relaxed text-ink">
          Reports run against the live fixture/DB with a frozen timestamp so each regeneration is
          reproducible. Every export carries a SHA-256 footer so regulators can verify authenticity.
          Custom reports can be composed via the academic office — turnaround is 72 hours.
        </p>
      </aside>

      {toast ? (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-micro font-semibold text-white shadow-card-md"
        >
          <Check className="mr-1 inline-block h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          {toast}
        </div>
      ) : null}
    </div>
  );
}

function KpiTile({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone?: 'brand' | 'success' | 'warning';
}) {
  const valueColor =
    tone === 'warning' ? 'text-warning' : tone === 'success' ? 'text-success' : tone === 'brand' ? 'text-brand-primary' : 'text-ink';
  return (
    <li className="rounded-lg border border-line bg-card p-5 shadow-card-sm">
      <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className={`mt-2 text-h2 tabular-nums ${valueColor}`}>{value}</p>
      <p className="mt-1 text-micro text-muted">{sub}</p>
    </li>
  );
}

function ReportCard({
  report,
  onOpen,
  onDownload,
  onAnalytics,
  busyKind,
}: {
  report: AdminReport;
  onOpen: () => void;
  onDownload: () => void;
  onAnalytics: () => void;
  busyKind: 'open' | 'download' | 'analytics' | null;
}) {
  const categoryTone: Record<ReportCategory, 'brand' | 'success' | 'warning' | 'info'> = {
    STATUTORY: 'warning',
    BOARD: 'brand',
    OPERATIONAL: 'info',
    ACADEMIC: 'success',
  };
  return (
    <li className="hover-lift group rounded-lg border border-line bg-card p-5 shadow-card-sm transition-colors hover:border-brand-primary/30">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={categoryTone[report.category]} dot>
            <span className="inline-flex items-center gap-1">
              {CATEGORY_ICON[report.category]}
              {CATEGORY_LABEL[report.category]}
            </span>
          </Badge>
          <span className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
            {report.cadence}
          </span>
        </div>
        <span className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
          {report.format}
        </span>
      </div>

      <h3 className="mt-4 text-h3 leading-snug tracking-tight text-ink transition-colors group-hover:text-brand-primary">
        {report.name}
      </h3>
      <p className="mt-2 text-small leading-relaxed text-muted">{report.description}</p>

      <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
        <div className="text-micro text-muted">
          Owner: <span className="text-ink">{report.owner}</span> · Updated{' '}
          {new Date(report.updatedAt).toLocaleDateString('en-ZW', {
            day: 'numeric',
            month: 'short',
          })}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onOpen}
            disabled={busyKind !== null}
            aria-label="Open report"
            className="rounded-full p-2 text-muted transition-colors hover:bg-surface hover:text-ink disabled:opacity-60"
          >
            {busyKind === 'open' ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.75} />
            ) : (
              <FileText className="h-3.5 w-3.5" strokeWidth={1.75} />
            )}
          </button>
          <button
            type="button"
            onClick={onDownload}
            disabled={busyKind !== null}
            aria-label="Download"
            className="rounded-full p-2 text-muted transition-colors hover:bg-surface hover:text-ink disabled:opacity-60"
          >
            {busyKind === 'download' ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.75} />
            ) : (
              <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
            )}
          </button>
          <button
            type="button"
            onClick={onAnalytics}
            disabled={busyKind !== null}
            aria-label="Open analytics"
            className="rounded-full p-2 text-muted transition-colors hover:bg-surface hover:text-ink disabled:opacity-60"
          >
            {busyKind === 'analytics' ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.75} />
            ) : (
              <BarChart3 className="h-3.5 w-3.5" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>
    </li>
  );
}
