'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  Loader2,
  Printer,
  Receipt as ReceiptIcon,
  Search,
  XCircle,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  RECEIPTS,
  RECEIPTS_KPIS,
  type ReceiptMethod,
  type ReceiptStatus,
  type SchoolReceipt,
} from '@/lib/mock/school';
import { buildGenericDoc, downloadBlob, downloadPdf } from '@/lib/pdf/generate';

const STATUS_TONE: Record<ReceiptStatus, 'success' | 'warning' | 'neutral' | 'danger'> = {
  RECONCILED: 'success',
  VERIFIED: 'warning',
  PENDING: 'neutral',
  FAILED: 'danger',
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
  const [busy, setBusy] = useState<null | 'csv' | 'pdf' | 'print' | 'filters'>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  function exportCsv() {
    setBusy('csv');
    setTimeout(() => {
      const header = 'Reference,Student,Form,Method,Amount,Currency,Status,Issued\n';
      const body = filtered
        .map(
          (r) =>
            `${r.ref},${r.studentName},${r.form},${r.method},${r.amount},${r.currency},${r.status},${r.issuedAt}`,
        )
        .join('\n');
      const bytes = new TextEncoder().encode(header + body);
      downloadBlob(bytes, `HHA-Receipts-${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv');
      setBusy(null);
      setToast(`Exported ${filtered.length} receipts to CSV`);
    }, 600);
  }

  function downloadReceiptPdf() {
    if (!selected) return;
    setBusy('pdf');
    setTimeout(() => {
      downloadPdf(
        `HHA-Receipt-${selected.ref}.pdf`,
        buildGenericDoc({
          title: `Receipt ${selected.ref}`,
          eyebrow: 'HHA · Bursary',
          subtitle: `Issued ${new Date(selected.issuedAt).toLocaleString('en-ZW', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}`,
          fields: [
            { label: 'Student', value: `${selected.studentName} · ${selected.form}` },
            { label: 'Method', value: selected.method },
            { label: 'Invoice', value: selected.invoiceRef },
            { label: 'Amount', value: `${selected.currency} ${selected.amount.toLocaleString('en-ZW')}` },
            { label: 'Status', value: selected.status.toLowerCase() },
            { label: 'Issued by', value: selected.issuedBy },
          ],
          body: selected.notes ?? 'Digitally-signed receipt. Reconciled against the bank statement.',
          footer: 'For verification call +263 242 123 456 or email bursary@hha.ac.zw',
        }),
      );
      setBusy(null);
      setToast(`Downloaded ${selected.ref}.pdf`);
    }, 600);
  }

  function printReceipt() {
    if (!selected) return;
    setBusy('print');
    setTimeout(() => {
      // In a browser, the best we can do from JS is open the print dialog on
      // a new window containing the receipt. For the demo, trigger the
      // native print on this tab so the user sees the OS dialog.
      try {
        window.print();
      } catch {
        /* noop */
      }
      setBusy(null);
      setToast(`Sent ${selected.ref} to the default printer`);
    }, 500);
  }

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
    <div className="space-y-8">
      {/* Header */}
      <header>
        <p className="text-small text-muted">Finance · receipts</p>
        <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-ink">
          Every payment, receipted
        </h1>
        <p className="mt-2 max-w-[72ch] text-small text-muted">
          Every method — bank slip, EcoCash, OneMoney, ZIPIT, cash, card — produces a unique,
          attributable, immutable receipt. Reconciled lines are traceable back to the bank statement.
        </p>
      </header>

      {/* KPIs */}
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiTile
          label="Reconciled (7 days)"
          value={`USD ${RECEIPTS_KPIS.last7DaysAmount.toLocaleString('en-ZW')}`}
          sub={`${RECEIPTS_KPIS.last7DaysCount} receipts · all methods`}
          tone="success"
        />
        <KpiTile
          label="Awaiting statement"
          value={String(RECEIPTS_KPIS.pendingReconcile)}
          sub="Verified · auto-reconciled at 06:00"
          tone="warning"
        />
        <KpiTile
          label="Failed"
          value={String(RECEIPTS_KPIS.failedCount)}
          sub="Returned to parent for reupload"
          tone="danger"
        />
        <KpiTile label="Avg ref→recon" value="2h 14m" sub="–34 min vs last week" tone="brand" />
      </ul>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-line bg-card p-3 shadow-card-sm">
        <div className="relative min-w-[220px] flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            strokeWidth={1.75}
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by reference, student, invoice or method…"
            className="h-10 w-full rounded-full border border-line bg-surface/40 pl-9 pr-3 text-small text-ink placeholder:text-muted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
        </div>
        <div className="inline-flex items-center gap-1 rounded-full bg-surface p-1">
          {(['ALL', 'RECONCILED', 'VERIFIED', 'FAILED'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={[
                'rounded-full px-3 py-1 text-micro font-semibold transition-colors',
                statusFilter === s ? 'bg-card text-ink shadow-card-sm' : 'text-muted hover:text-ink',
              ].join(' ')}
            >
              {s.toLowerCase()}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setToast('More filters are on the way — currency, amount band, class')}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-card px-3 text-micro font-semibold text-ink transition-colors hover:bg-surface"
        >
          <Filter className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
          More filters
        </button>
        <button
          type="button"
          onClick={exportCsv}
          disabled={busy === 'csv'}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-card px-3 text-micro font-semibold text-ink transition-colors hover:bg-surface disabled:opacity-60"
        >
          {busy === 'csv' ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.75} aria-hidden />
          ) : (
            <Download className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
          )}
          {busy === 'csv' ? 'Exporting…' : 'Export CSV'}
        </button>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="xl:col-span-2">
          <div className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
            <header className="flex items-center justify-between border-b border-line px-5 py-3.5">
              <p className="text-small font-semibold text-ink">{filtered.length} receipts</p>
              <p className="text-micro text-muted">Click a row to inspect</p>
            </header>
            <div className="overflow-x-auto">
              <table className="w-full text-small">
                <thead>
                  <tr className="border-b border-line bg-surface/60 text-left">
                    <th className="px-4 py-2.5 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                      Reference
                    </th>
                    <th className="px-4 py-2.5 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                      Student
                    </th>
                    <th className="px-4 py-2.5 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                      Method
                    </th>
                    <th className="px-4 py-2.5 text-right text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                      Amount
                    </th>
                    <th className="px-4 py-2.5 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                      Status
                    </th>
                    <th className="px-4 py-2.5 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                      When
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => {
                    const activeRow = selected?.id === r.id;
                    return (
                      <tr
                        key={r.id}
                        onClick={() => setSelected(r)}
                        className={[
                          'cursor-pointer border-b border-line/60 transition-colors',
                          activeRow ? 'bg-brand-primary/[0.06]' : 'hover:bg-surface/40',
                        ].join(' ')}
                      >
                        <td className="px-4 py-3">
                          <p className="font-mono text-micro text-ink">{r.ref}</p>
                          <p className="font-mono text-micro uppercase tracking-[0.08em] text-muted">
                            {r.invoiceRef}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-small font-semibold text-ink">{r.studentName}</p>
                          <p className="font-mono text-micro uppercase tracking-[0.08em] text-muted">
                            {r.form}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge tone="neutral">{METHOD_TAG[r.method]}</Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <p className="text-small font-bold tabular-nums text-ink">
                            USD {r.amount.toLocaleString('en-ZW')}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge tone={STATUS_TONE[r.status]} dot>
                            {r.status.toLowerCase()}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-micro text-muted">
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
          </div>
        </section>

        <section className="xl:col-span-1">
          {selected ? (
            <ReceiptDetail
              receipt={selected}
              onDownload={downloadReceiptPdf}
              onPrint={printReceipt}
              busy={busy === 'pdf' ? 'pdf' : busy === 'print' ? 'print' : null}
            />
          ) : (
            <DetailPlaceholder />
          )}
        </section>
      </div>

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
  tone?: 'brand' | 'success' | 'warning' | 'danger';
}) {
  const valueColor =
    tone === 'warning'
      ? 'text-warning'
      : tone === 'success'
      ? 'text-success'
      : tone === 'danger'
      ? 'text-danger'
      : tone === 'brand'
      ? 'text-brand-primary'
      : 'text-ink';
  return (
    <li className="rounded-lg border border-line bg-card p-5 shadow-card-sm">
      <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className={`mt-2 text-h2 tabular-nums ${valueColor}`}>{value}</p>
      <p className="mt-1 text-micro text-muted">{sub}</p>
    </li>
  );
}

function ReceiptDetail({
  receipt,
  onDownload,
  onPrint,
  busy,
}: {
  receipt: SchoolReceipt;
  onDownload: () => void;
  onPrint: () => void;
  busy: 'pdf' | 'print' | null;
}) {
  const reconciled = receipt.status === 'RECONCILED';
  return (
    <article className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div>
          <p className="text-micro font-semibold uppercase tracking-[0.12em] text-brand-primary">
            Receipt
          </p>
          <p className="mt-1 font-mono text-small text-ink">{receipt.ref}</p>
        </div>
        <Badge tone={STATUS_TONE[receipt.status]} dot>
          {reconciled ? (
            <CheckCircle2 className="mr-1 inline-block h-3 w-3" strokeWidth={2} aria-hidden />
          ) : receipt.status === 'FAILED' ? (
            <XCircle className="mr-1 inline-block h-3 w-3" strokeWidth={2} aria-hidden />
          ) : (
            <Clock className="mr-1 inline-block h-3 w-3" strokeWidth={2} aria-hidden />
          )}
          {receipt.status.toLowerCase()}
        </Badge>
      </div>

      <div className="px-5 py-5">
        <div className="flex items-end justify-between border-b border-line pb-4">
          <div>
            <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">Amount</p>
            <p className="mt-1 text-[2.25rem] font-bold leading-none tabular-nums text-ink">
              USD {receipt.amount.toLocaleString('en-ZW')}
            </p>
            <p className="mt-1 text-micro uppercase tracking-[0.1em] text-muted">
              {receipt.currency}
            </p>
          </div>
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-brand-primary/10 text-brand-primary">
            <ReceiptIcon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
          </span>
        </div>

        <dl className="mt-4 space-y-3 text-small">
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
          {receipt.slipId ? <Row label="Slip" value={receipt.slipId} mono /> : null}
          {receipt.notes ? (
            <div>
              <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">Notes</p>
              <p className="mt-1 text-small text-ink">{receipt.notes}</p>
            </div>
          ) : null}
        </dl>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onDownload}
            disabled={busy === 'pdf'}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-card px-3 text-micro font-semibold text-ink transition-colors hover:bg-surface disabled:opacity-60"
          >
            {busy === 'pdf' ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.75} aria-hidden />
            ) : (
              <Download className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            )}
            {busy === 'pdf' ? 'Preparing…' : 'PDF'}
          </button>
          <button
            type="button"
            onClick={onPrint}
            disabled={busy === 'print'}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-card px-3 text-micro font-semibold text-ink transition-colors hover:bg-surface disabled:opacity-60"
          >
            {busy === 'print' ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.75} aria-hidden />
            ) : (
              <Printer className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            )}
            {busy === 'print' ? 'Sending…' : 'Print'}
          </button>
          {receipt.slipId ? (
            <a
              href={`/admin/slips?slip=${receipt.slipId}`}
              className="ml-auto inline-flex items-center gap-1 text-micro font-semibold text-brand-primary transition-colors hover:underline underline-offset-4"
            >
              Open slip
              <ArrowUpRight className="h-3 w-3" strokeWidth={1.75} aria-hidden />
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
      <dt className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">{label}</dt>
      <dd className="text-right">
        <span
          className={[
            'font-semibold text-ink',
            mono ? 'font-mono text-micro' : 'text-small',
          ].join(' ')}
        >
          {value}
        </span>
        {sub ? (
          <span className="block font-mono text-micro uppercase tracking-[0.08em] text-muted">
            {sub}
          </span>
        ) : null}
      </dd>
    </div>
  );
}

function DetailPlaceholder() {
  return (
    <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-line bg-card p-10 text-center">
      <div>
        <ReceiptIcon className="mx-auto h-10 w-10 text-muted" strokeWidth={1.25} aria-hidden />
        <p className="mt-3 text-small text-muted">Select a receipt to inspect</p>
      </div>
    </div>
  );
}
