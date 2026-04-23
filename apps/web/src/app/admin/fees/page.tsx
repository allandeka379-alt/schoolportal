'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, Download, Filter, Loader2, Search } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { INVOICES, STUDENTS } from '@/lib/mock/fixtures';
import { downloadBlob } from '@/lib/pdf/generate';

export default function AdminFeesPage() {
  const [query, setQuery] = useState('');
  const [formFilter, setFormFilter] = useState('All forms');
  const [statusFilter, setStatusFilter] = useState('Any status');
  const [nudged, setNudged] = useState<Set<string>>(new Set());
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const baseRows = useMemo(
    () =>
      STUDENTS.map((s, i) => {
        const invoice = INVOICES[i % INVOICES.length]!;
        const outstanding = (i * 37) % 2 === 0 ? invoice.balance : '0.00';
        return {
          student: s,
          invoice,
          outstanding,
          status: outstanding === '0.00' ? 'PAID' : 'PARTIAL',
        };
      }),
    [],
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return baseRows.filter((r) => {
      if (q) {
        const hay = `${r.student.firstName} ${r.student.lastName} ${r.student.admissionNo}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (formFilter !== 'All forms' && r.student.form !== formFilter) return false;
      if (statusFilter === 'Paid' && r.status !== 'PAID') return false;
      if (statusFilter === 'Partially paid' && r.status !== 'PARTIAL') return false;
      if (statusFilter === 'Overdue' && r.status === 'PAID') return false;
      return true;
    });
  }, [baseRows, query, formFilter, statusFilter]);

  const paidCount = rows.filter((r) => r.status === 'PAID').length;
  const partialCount = rows.filter((r) => r.status === 'PARTIAL').length;
  const outstandingSum = rows.reduce((s, r) => s + Number(r.outstanding), 0);

  function nudge(studentId: string, name: string) {
    setNudged((curr) => {
      const next = new Set(curr);
      next.add(studentId);
      return next;
    });
    setToast(`Gentle nudge sent to ${name}'s parent · SMS + in-app`);
  }

  function exportLedger() {
    setExporting(true);
    setTimeout(() => {
      const header = 'Student,AdmissionNo,Form,Invoice,Total,Balance,Status\n';
      const body = rows
        .map(
          (r) =>
            `"${r.student.firstName} ${r.student.lastName}","${r.student.admissionNo}","${r.student.form} ${r.student.stream}","${r.invoice.invoiceNumber}","${r.invoice.subtotal}","${r.outstanding}","${r.status}"`,
        )
        .join('\n');
      const bytes = new TextEncoder().encode(header + body + '\n');
      downloadBlob(bytes, `HHA-Fees-Ledger-${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv');
      setExporting(false);
      setToast(`Exported ${rows.length} rows to CSV`);
    }, 600);
  }

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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 w-full rounded-full border border-line bg-card pl-9 pr-3 text-small text-ink placeholder:text-muted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            placeholder="Search by student name or admission number…"
          />
        </div>
        <select
          value={formFilter}
          onChange={(e) => setFormFilter(e.target.value)}
          className="h-11 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
        >
          <option>All forms</option>
          <option>Form 1</option>
          <option>Form 2</option>
          <option>Form 3</option>
          <option>Form 4</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-11 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
        >
          <option>Any status</option>
          <option>Paid</option>
          <option>Partially paid</option>
          <option>Overdue</option>
        </select>
        <button
          type="button"
          onClick={() => setToast('Advanced filters — currency, invoice date range, house — coming soon')}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface"
        >
          <Filter className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          More filters
        </button>
        <button
          type="button"
          onClick={exportLedger}
          disabled={exporting}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-primary px-5 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md disabled:opacity-60"
        >
          {exporting ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} aria-hidden />
          ) : (
            <Download className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          )}
          {exporting ? 'Exporting…' : 'Export'}
        </button>
      </div>

      {/* Ledger */}
      <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
        <header className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <h2 className="text-small font-semibold text-ink">Term 2 2026</h2>
          <p className="text-micro text-muted">
            Showing {rows.length} of {baseRows.length} students
          </p>
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
                    ) : nudged.has(r.student.id) ? (
                      <span className="inline-flex items-center gap-1 text-micro font-semibold text-success">
                        <Check className="h-3 w-3" strokeWidth={2} aria-hidden />
                        Nudged
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          nudge(r.student.id, `${r.student.firstName} ${r.student.lastName}`)
                        }
                        className="text-micro font-semibold text-brand-primary transition-colors hover:underline underline-offset-4"
                      >
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
