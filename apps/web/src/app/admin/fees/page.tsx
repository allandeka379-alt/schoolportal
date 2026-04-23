import { Download, Filter, Search } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { INVOICES, STUDENTS } from '@/lib/mock/fixtures';

export default function AdminFeesPage() {
  const rows = STUDENTS.map((s, i) => {
    const invoice = INVOICES[i % INVOICES.length]!;
    const outstanding = (i * 37) % 2 === 0 ? invoice.balance : '0.00';
    return {
      student: s,
      invoice,
      outstanding,
      status: outstanding === '0.00' ? 'PAID' : 'PARTIAL',
    };
  });

  const paidCount = rows.filter((r) => r.status === 'PAID').length;
  const partialCount = rows.filter((r) => r.status === 'PARTIAL').length;
  const outstandingSum = rows.reduce((s, r) => s + Number(r.outstanding), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <p className="text-small text-muted">Admin · fees ledger</p>
        <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-ink">
          Every invoice, every payment, live
        </h1>
        <p className="mt-2 text-small text-muted">
          Filter by class, method, outstanding amount, or ageing.
        </p>
      </header>

      {/* KPI tiles */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiTile label="Students" value={String(rows.length)} sub="Invoiced this term" />
        <KpiTile label="Paid" value={String(paidCount)} sub="Fully settled" tone="success" />
        <KpiTile
          label="Partially paid"
          value={String(partialCount)}
          sub="Outstanding balance"
          tone={partialCount > 0 ? 'warning' : 'success'}
        />
        <KpiTile
          label="Outstanding"
          value={`USD ${outstandingSum.toLocaleString('en-ZW', { minimumFractionDigits: 2 })}`}
          sub="Sum across students"
          tone={outstandingSum > 0 ? 'warning' : 'success'}
        />
      </ul>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-[240px] flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            strokeWidth={1.75}
            aria-hidden
          />
          <input
            className="h-11 w-full rounded-full border border-line bg-card pl-9 pr-3 text-small text-ink placeholder:text-muted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            placeholder="Search by student name or admission number…"
          />
        </div>
        <select className="h-11 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20">
          <option>All forms</option>
          <option>Form 1</option>
          <option>Form 2</option>
          <option>Form 3</option>
        </select>
        <select className="h-11 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20">
          <option>Any status</option>
          <option>Paid</option>
          <option>Partially paid</option>
          <option>Overdue</option>
        </select>
        <button className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface">
          <Filter className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          More filters
        </button>
        <button className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-primary px-5 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md">
          <Download className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          Export
        </button>
      </div>

      {/* Ledger */}
      <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
        <header className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <h2 className="text-small font-semibold text-ink">Term 2 2026</h2>
          <p className="text-micro text-muted">Showing {rows.length} of 428 students</p>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-small">
            <thead>
              <tr className="bg-surface/60 text-left">
                <th className="px-5 py-3 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  Student
                </th>
                <th className="px-4 py-3 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  Form
                </th>
                <th className="px-4 py-3 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  Invoice
                </th>
                <th className="px-4 py-3 text-right text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  Total
                </th>
                <th className="px-4 py-3 text-right text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  Balance
                </th>
                <th className="px-4 py-3 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  Reminder
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.student.id} className="border-t border-line hover:bg-surface/40">
                  <td className="px-5 py-3">
                    <div className="text-small font-semibold text-ink">
                      {r.student.firstName} {r.student.lastName}
                    </div>
                    <div className="font-mono text-micro text-muted">{r.student.admissionNo}</div>
                  </td>
                  <td className="px-4 py-3 text-small text-ink">
                    {r.student.form} {r.student.stream}
                  </td>
                  <td className="px-4 py-3 font-mono text-micro text-muted">
                    {r.invoice.invoiceNumber}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-ink">
                    USD {r.invoice.subtotal}
                  </td>
                  <td
                    className={[
                      'px-4 py-3 text-right tabular-nums font-semibold',
                      r.outstanding === '0.00' ? 'text-success' : 'text-warning',
                    ].join(' ')}
                  >
                    USD {r.outstanding}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={r.status === 'PAID' ? 'success' : 'warning'} dot>
                      {r.status === 'PAID' ? 'paid' : 'partial'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.status === 'PAID' ? (
                      <span className="text-micro text-muted">—</span>
                    ) : (
                      <button className="text-micro font-semibold text-brand-primary hover:underline underline-offset-4">
                        Gentle nudge
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
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
  sub?: string;
  tone?: 'brand' | 'success' | 'warning';
}) {
  const valueColor =
    tone === 'warning' ? 'text-warning' : tone === 'success' ? 'text-success' : tone === 'brand' ? 'text-brand-primary' : 'text-ink';
  return (
    <li className="rounded-lg border border-line bg-card p-5 shadow-card-sm">
      <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className={`mt-2 text-h2 tabular-nums ${valueColor}`}>{value}</p>
      {sub ? <p className="mt-1 text-micro text-muted">{sub}</p> : null}
    </li>
  );
}
