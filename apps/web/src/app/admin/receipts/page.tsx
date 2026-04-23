'use client';

import { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  Printer,
  Receipt as ReceiptIcon,
  Search,
  XCircle,
} from 'lucide-react';

import {
  RECEIPTS,
  RECEIPTS_KPIS,
  type ReceiptMethod,
  type ReceiptStatus,
  type SchoolReceipt,
} from '@/lib/mock/school';

/**
 * Receipts — Admin.
 *
 * Every reconciled or verified payment produces a digital receipt with a
 * unique reference. Reconciled-against-statement line is traceable through
 * the audit log; "Failed" receipts are back on the parent's desk.
 */

const STATUS_TONE: Record<ReceiptStatus, string> = {
  RECONCILED: 'bg-signal-success/10 text-signal-success',
  VERIFIED: 'bg-signal-warning/10 text-signal-warning',
  PENDING: 'bg-fog text-slate',
  FAILED: 'bg-signal-error/10 text-signal-error',
};

const METHOD_TAG: Record<ReceiptMethod, string> = {
  'CBZ Transfer': 'CBZ',
  'Stanbic Slip': 'Stanbic',
  'ZB Slip': 'ZB',
  'Steward Slip': 'Steward',
  EcoCash: 'EcoCash',
  OneMoney: 'OneMoney',
  InnBucks: 'InnBucks',
  ZIPIT: 'ZIPIT',
  Cash: 'Cash',
  Card: 'Card',
};

export default function ReceiptsPage() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReceiptStatus | 'ALL'>('ALL');
  const [selected, setSelected] = useState<SchoolReceipt | null>(RECEIPTS[0] ?? null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RECEIPTS.filter((r) => {
      if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
      if (!q) return true;
      return (
        r.ref.toLowerCase().includes(q) ||
        r.studentName.toLowerCase().includes(q) ||
        r.invoiceRef.toLowerCase().includes(q) ||
        r.method.toLowerCase().includes(q)
      );
    });
  }, [query, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <p
          className="font-mono text-[11px] font-medium uppercase tracking-[0.18em]"
          style={{ color: 'rgb(var(--accent))' }}
        >
          Finance · Receipts
        </p>
        <h1 className="mt-2 font-display text-[clamp(1.75rem,3vw,2.25rem)] font-medium tracking-tight text-obsidian">
          Every payment, receipted.
        </h1>
        <p className="mt-2 max-w-[72ch] font-sans text-[14px] text-slate">
          Every method — bank slip, EcoCash, OneMoney, ZIPIT, cash, card — produces a unique,
          attributable, immutable receipt. Reconciled lines are traceable back to the bank statement.
        </p>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard
          label="Reconciled (7 days)"
          value={`$${RECEIPTS_KPIS.last7DaysAmount.toLocaleString('en-ZW')}`}
          sub={`${RECEIPTS_KPIS.last7DaysCount} receipts · all methods`}
        />
        <KpiCard
          label="Awaiting statement"
          value={String(RECEIPTS_KPIS.pendingReconcile)}
          sub="Verified · auto-reconciled at 06:00"
          tone="warning"
        />
        <KpiCard
          label="Failed"
          value={String(RECEIPTS_KPIS.failedCount)}
          sub="Returned to parent for reupload"
          tone="error"
        />
        <KpiCard label="Avg ref→recon" value="2h 14m" sub="–34 min vs last week" tone="accent" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-md border border-mist bg-snow p-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-steel"
            strokeWidth={1.5}
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by reference, student, invoice or method…"
            className="h-10 w-full rounded-md border border-mist bg-snow pl-9 pr-3 font-sans text-[13px] text-obsidian placeholder-steel focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-1 rounded-md border border-mist bg-fog p-0.5 font-mono text-[11px] font-medium uppercase tracking-[0.1em]">
          {(['ALL', 'RECONCILED', 'VERIFIED', 'FAILED'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={[
                'rounded-sm px-2.5 py-1 transition-colors',
                statusFilter === s ? 'bg-obsidian text-snow' : 'text-slate hover:text-obsidian',
              ].join(' ')}
            >
              {s.toLowerCase()}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-md border border-mist bg-snow px-3 font-sans text-[13px] font-medium text-slate hover:bg-fog"
        >
          <Filter className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          More filters
        </button>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-md border border-mist bg-snow px-3 font-sans text-[13px] font-medium text-slate hover:bg-fog"
        >
          <Download className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          Export CSV
        </button>
      </div>

      {/* Main grid: receipts table + detail drawer */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="xl:col-span-2">
          <div className="overflow-hidden rounded-md border border-mist bg-snow">
            <div className="flex items-center justify-between border-b border-mist px-5 py-3">
              <p className="font-sans text-[13px] font-medium text-obsidian">
                {filtered.length} receipts
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-steel">
                Click a row to inspect
              </p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-mist bg-fog/50">
                  <th className="px-4 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-slate">
                    Reference
                  </th>
                  <th className="px-4 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-slate">
                    Student
                  </th>
                  <th className="px-4 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-slate">
                    Method
                  </th>
                  <th className="px-4 py-2.5 text-right font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-slate">
                    Amount
                  </th>
                  <th className="px-4 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-slate">
                    Status
                  </th>
                  <th className="px-4 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-slate">
                    When
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const active = selected?.id === r.id;
                  return (
                    <tr
                      key={r.id}
                      onClick={() => setSelected(r)}
                      className={[
                        'cursor-pointer border-b border-mist/60 transition-colors',
                        active ? 'bg-fog' : 'hover:bg-fog/60',
                      ].join(' ')}
                    >
                      <td className="px-4 py-3">
                        <p className="font-mono text-[12px] text-obsidian">{r.ref}</p>
                        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-steel">
                          {r.invoiceRef}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-sans text-[13px] font-medium text-obsidian">
                          {r.studentName}
                        </p>
                        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-steel">
                          {r.form}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-sm bg-fog px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-slate">
                          {METHOD_TAG[r.method]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <p className="font-mono text-[13px] tabular-nums text-obsidian">
                          ${r.amount.toLocaleString('en-ZW')}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={[
                            'inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em]',
                            STATUS_TONE[r.status],
                          ].join(' ')}
                        >
                          {r.status.toLowerCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.08em] text-steel">
                        {new Date(r.issuedAt).toLocaleString('en-ZW', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Detail drawer */}
        <section className="xl:col-span-1">
          {selected ? <ReceiptDetail receipt={selected} /> : <DetailPlaceholder />}
        </section>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  tone = 'default',
}: {
  label: string;
  value: string;
  sub: string;
  tone?: 'default' | 'accent' | 'warning' | 'error';
}) {
  const border =
    tone === 'accent'
      ? 'border-t-[3px] border-t-[rgb(var(--accent))]'
      : tone === 'warning'
      ? 'border-t-[3px] border-t-signal-warning'
      : tone === 'error'
      ? 'border-t-[3px] border-t-signal-error'
      : 'border-t-[3px] border-t-mist';
  return (
    <div className={`rounded-md border border-mist bg-snow p-4 ${border}`}>
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-slate">
        {label}
      </p>
      <p className="mt-2 font-display text-[26px] font-medium leading-none text-obsidian tabular-nums">
        {value}
      </p>
      <p className="mt-2 font-sans text-[12px] text-steel">{sub}</p>
    </div>
  );
}

function ReceiptDetail({ receipt }: { receipt: SchoolReceipt }) {
  const reconciled = receipt.status === 'RECONCILED';
  return (
    <article className="overflow-hidden rounded-md border border-mist bg-snow">
      <div className="flex items-center justify-between border-b border-mist px-5 py-4">
        <div>
          <p
            className="font-mono text-[11px] font-medium uppercase tracking-[0.14em]"
            style={{ color: 'rgb(var(--accent))' }}
          >
            Receipt
          </p>
          <p className="font-mono text-[14px] text-obsidian">{receipt.ref}</p>
        </div>
        <span
          className={[
            'inline-flex items-center gap-1 rounded-sm px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em]',
            STATUS_TONE[receipt.status],
          ].join(' ')}
        >
          {reconciled ? (
            <CheckCircle2 className="h-3 w-3" strokeWidth={2} aria-hidden />
          ) : receipt.status === 'FAILED' ? (
            <XCircle className="h-3 w-3" strokeWidth={2} aria-hidden />
          ) : (
            <Clock className="h-3 w-3" strokeWidth={2} aria-hidden />
          )}
          {receipt.status.toLowerCase()}
        </span>
      </div>

      <div className="px-5 py-5">
        {/* Figure */}
        <div className="flex items-end justify-between border-b border-mist pb-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel">Amount</p>
            <p className="mt-1 font-display text-[36px] font-medium leading-none text-obsidian tabular-nums">
              ${receipt.amount.toLocaleString('en-ZW')}
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-steel">
              {receipt.currency}
            </p>
          </div>
          <ReceiptIcon
            className="h-10 w-10 text-mist"
            strokeWidth={1}
            aria-hidden
          />
        </div>

        {/* Detail rows */}
        <dl className="mt-4 space-y-3 font-sans text-[13px]">
          <Row label="Student" value={receipt.studentName} sub={receipt.form} />
          <Row label="Invoice" value={receipt.invoiceRef} mono />
          <Row label="Method" value={receipt.method} />
          <Row
            label="Issued"
            value={new Date(receipt.issuedAt).toLocaleString('en-ZW', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
            sub={`by ${receipt.issuedBy}`}
          />
          {receipt.slipId ? (
            <Row label="Slip" value={receipt.slipId} mono />
          ) : null}
          {receipt.notes ? (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel">Notes</p>
              <p className="mt-1 font-sans text-[13px] text-slate">{receipt.notes}</p>
            </div>
          ) : null}
        </dl>

        {/* Actions */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-mist bg-snow px-3 font-sans text-[13px] font-medium text-slate hover:bg-fog"
          >
            <Download className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
            PDF
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-mist bg-snow px-3 font-sans text-[13px] font-medium text-slate hover:bg-fog"
          >
            <Printer className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
            Print
          </button>
          {receipt.slipId ? (
            <a
              href={`/admin/slips?slip=${receipt.slipId}`}
              className="ml-auto inline-flex items-center gap-1 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-obsidian hover:opacity-70"
            >
              Open slip
              <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} aria-hidden />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function Row({
  label,
  value,
  sub,
  mono,
}: {
  label: string;
  value: string;
  sub?: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel">{label}</dt>
      <dd className="text-right">
        <span
          className={[
            'font-medium text-obsidian',
            mono ? 'font-mono text-[12px]' : 'font-sans text-[13px]',
          ].join(' ')}
        >
          {value}
        </span>
        {sub ? (
          <span className="block font-mono text-[11px] uppercase tracking-[0.08em] text-steel">
            {sub}
          </span>
        ) : null}
      </dd>
    </div>
  );
}

function DetailPlaceholder() {
  return (
    <div className="flex h-full items-center justify-center rounded-md border border-dashed border-mist bg-snow p-10 text-center">
      <div>
        <ReceiptIcon className="mx-auto h-10 w-10 text-mist" strokeWidth={1} aria-hidden />
        <p className="mt-3 font-sans text-[14px] text-slate">
          Select a receipt to inspect
        </p>
      </div>
    </div>
  );
}
