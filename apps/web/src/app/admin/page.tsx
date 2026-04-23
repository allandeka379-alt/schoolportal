import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  CheckCircle2,
  FileSearch,
  ShieldCheck,
  TrendingUp,
  Users,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/student/progress-ring';
import { SLIPS, STUDENTS } from '@/lib/mock/fixtures';

/**
 * Admin (bursar) overview — card-dense redesign.
 *
 *   - KPI tile row (Enrolment / Fees collected / Slip queue / On-time)
 *   - Info alert card
 *   - Two-column body: chart + ageing table | slip queue + security
 */
export default function AdminOverview() {
  const pendingSlips = SLIPS.filter(
    (s) => s.status !== 'RECONCILED' && s.status !== 'FAILED',
  ).length;
  const collected = 184320;
  const target = 297290;
  const collectedPct = Math.round((collected / target) * 100);

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <p className="text-small text-muted">Admin · bursary overview</p>
        <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-ink">
          Today at Harare Heritage Academy
        </h1>
        <p className="mt-2 text-small text-muted">
          Statements imported at 06:00 · 18 payments auto-matched overnight.
        </p>
      </header>

      {/* KPI tiles */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiTile
          icon={Users}
          iconTone="brand"
          label="Enrolment"
          value="428"
          sub="+14 vs last term"
        />
        <KpiTile
          icon={Banknote}
          iconTone="success"
          label="Fees collected"
          value={`USD ${collected.toLocaleString('en-ZW')}`}
          sub={`${collectedPct}% of Term 2 target`}
          ring={collectedPct}
          ringTone="success"
        />
        <KpiTile
          icon={FileSearch}
          iconTone="warning"
          label="Slip queue"
          value={String(pendingSlips)}
          sub="Avg resolution 2h 14m"
        />
        <KpiTile
          icon={TrendingUp}
          iconTone="info"
          label="On-time rate"
          value="74%"
          sub="+6 pts vs Term 1"
        />
      </ul>

      {/* Info alert */}
      <section className="flex flex-wrap items-start gap-3 rounded-lg border border-info/25 bg-info/[0.04] p-4 shadow-card-sm">
        <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white text-info">
          <FileSearch className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </span>
        <div>
          <p className="text-small font-semibold text-ink">Statement import complete</p>
          <p className="mt-0.5 text-small text-muted">
            CBZ · Stanbic · ZB · Steward statements imported at 06:00. Reconciliation engine matched
            18 payments automatically overnight.
          </p>
        </div>
      </section>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Chart card */}
          <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
            <header className="flex items-center justify-between border-b border-line px-5 py-3.5">
              <h2 className="text-small font-semibold text-ink">
                Fees collected — last 14 days
              </h2>
              <Link
                href="/admin/fees"
                className="inline-flex items-center gap-1 text-micro font-semibold text-brand-primary transition-colors hover:underline underline-offset-4"
              >
                Open ledger
                <ArrowRight className="h-3 w-3" strokeWidth={2} aria-hidden />
              </Link>
            </header>
            <div className="p-5">
              <div className="flex h-40 items-end gap-1.5">
                {[30, 42, 26, 55, 68, 38, 72, 60, 48, 84, 92, 70, 88, 96].map((v, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t bg-brand-primary transition-all hover:bg-brand-primary/80"
                      style={{ height: `${v}%` }}
                    />
                    <span className="text-micro text-muted">
                      {new Date(Date.now() - (13 - i) * 86400000).getDate()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-3 gap-4">
                <SplitBlock
                  label="Mobile money"
                  amount="USD 84,200"
                  pct="46%"
                  tone="success"
                />
                <SplitBlock label="EFT / slip" amount="USD 78,100" pct="42%" tone="brand" />
                <SplitBlock label="Cash / card" amount="USD 22,020" pct="12%" tone="info" />
              </div>
            </div>
          </section>

          {/* Ageing table */}
          <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
            <header className="flex items-center justify-between border-b border-line px-5 py-3.5">
              <h2 className="text-small font-semibold text-ink">Ageing receivables</h2>
              <span className="text-micro text-muted">As at today</span>
            </header>
            <div className="overflow-x-auto">
              <table className="w-full text-small">
                <thead>
                  <tr className="bg-surface/60 text-left">
                    <th className="px-5 py-3 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                      Bucket
                    </th>
                    <th className="px-4 py-3 text-right text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                      Invoices
                    </th>
                    <th className="px-4 py-3 text-right text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-right text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                      Share
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { bucket: '0–7 days', invoices: 112, amount: '68,420.00', pct: 62, tone: 'success' as const },
                    { bucket: '8–30 days', invoices: 48, amount: '29,120.00', pct: 26, tone: 'brand' as const },
                    { bucket: '31–60 days', invoices: 16, amount: '8,800.00', pct: 8, tone: 'warning' as const },
                    { bucket: 'Over 60 days', invoices: 9, amount: '4,420.00', pct: 4, tone: 'danger' as const },
                  ].map((row) => (
                    <tr key={row.bucket} className="border-t border-line">
                      <td className="px-5 py-3">
                        <Badge tone={row.tone} dot>
                          {row.bucket}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-ink">{row.invoices}</td>
                      <td className="px-4 py-3 text-right font-semibold tabular-nums text-ink">
                        USD {row.amount}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-muted">{row.pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          {/* Slip queue */}
          <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
            <header className="flex items-center justify-between border-b border-line px-5 py-3.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-warning/10 text-warning">
                  <FileSearch className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </span>
                <h2 className="text-small font-semibold text-ink">Slip queue</h2>
              </div>
              <Badge tone="warning" dot>
                {pendingSlips} pending
              </Badge>
            </header>
            <ul className="divide-y divide-line">
              {SLIPS.slice(0, 4).map((slip) => {
                const student = STUDENTS.find((s) => s.id === slip.studentId);
                const tone: 'success' | 'danger' | 'info' =
                  slip.status === 'RECONCILED'
                    ? 'success'
                    : slip.status === 'FAILED' || slip.status === 'MANUAL_REVIEW'
                    ? 'danger'
                    : 'info';
                return (
                  <li key={slip.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-small font-semibold text-ink">
                        {student ? `${student.firstName} ${student.lastName}` : slip.studentId}
                      </p>
                      <p className="text-micro text-muted">
                        {slip.detectedBank ?? 'Bank detecting…'} · {slip.uploadedBy}
                      </p>
                    </div>
                    <Badge tone={tone} dot>
                      {slip.status.replace('_', ' ').toLowerCase()}
                    </Badge>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-line p-3">
              <Link
                href="/admin/slips"
                className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-full border border-line bg-card text-small font-semibold text-ink transition-colors hover:bg-surface"
              >
                Open full queue
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              </Link>
            </div>
          </section>

          {/* Security */}
          <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
            <header className="flex items-center gap-2 border-b border-line px-5 py-3.5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-success/10 text-success">
                <ShieldCheck className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </span>
              <h2 className="text-small font-semibold text-ink">Security</h2>
            </header>
            <ul className="space-y-2 p-5 text-small">
              <li className="flex items-center gap-2 text-ink">
                <CheckCircle2 className="h-4 w-4 text-success" strokeWidth={1.75} aria-hidden />
                All staff have 2FA
              </li>
              <li className="flex items-center gap-2 text-ink">
                <CheckCircle2 className="h-4 w-4 text-success" strokeWidth={1.75} aria-hidden />
                Last backup: 04:00
              </li>
              <li className="flex items-center gap-2 text-ink">
                <CheckCircle2 className="h-4 w-4 text-success" strokeWidth={1.75} aria-hidden />
                TLS · AES-256 at rest
              </li>
              <li className="flex items-center gap-2 text-warning">
                <AlertTriangle className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                2 password resets pending
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function KpiTile({
  icon: Icon,
  iconTone,
  label,
  value,
  sub,
  ring,
  ringTone,
}: {
  icon: React.ElementType;
  iconTone: 'brand' | 'success' | 'warning' | 'info';
  label: string;
  value: string;
  sub?: string;
  ring?: number;
  ringTone?: 'success' | 'brand' | 'warning' | 'danger';
}) {
  const iconBg: Record<typeof iconTone, string> = {
    brand: 'bg-brand-primary/10 text-brand-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-info/10 text-info',
  };
  return (
    <li className="rounded-lg border border-line bg-card p-5 shadow-card-sm">
      <div className="flex items-center justify-between">
        <span className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${iconBg[iconTone]}`}>
          <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </span>
        {ring !== undefined && ringTone ? (
          <ProgressRing value={ring} size={36} stroke={4} tone={ringTone} />
        ) : null}
      </div>
      <p className="mt-3 text-micro font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-1 text-h2 tabular-nums text-ink">{value}</p>
      {sub ? <p className="mt-1 text-micro text-muted">{sub}</p> : null}
    </li>
  );
}

function SplitBlock({
  label,
  amount,
  pct,
  tone,
}: {
  label: string;
  amount: string;
  pct: string;
  tone: 'success' | 'brand' | 'info';
}) {
  return (
    <div>
      <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-1 text-small font-bold tabular-nums text-ink">{amount}</p>
      <Badge tone={tone} dot>
        {pct} of total
      </Badge>
    </div>
  );
}
