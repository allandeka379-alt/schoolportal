'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  FileDown,
  Loader2,
  Receipt,
  Upload,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/student/progress-ring';
import { PAYMENTS } from '@/lib/mock/fixtures';
import { FEES_SUMMARY } from '@/lib/mock/student-extras';
import { PaymentFlowModal } from '@/components/payments/payment-flow-modal';
import { buildGenericDoc, downloadPdf } from '@/lib/pdf/generate';

const PAYMENT_METHODS = [
  {
    name: 'EcoCash',
    settle: 'Real-time',
    tone: 'success' as const,
    sub: 'Econet',
    logo: '/payments/ecocash.png',
    logoBg: 'bg-white',
  },
  {
    name: 'OneMoney',
    settle: 'Real-time',
    tone: 'info' as const,
    sub: 'NetOne',
    logo: '/payments/onemoney.png',
    logoBg: 'bg-white',
  },
  {
    name: 'InnBucks',
    settle: 'Real-time',
    tone: 'warning' as const,
    sub: 'Innscor',
    logo: '/payments/innbucks.svg',
    logoBg: 'bg-white',
  },
  {
    name: 'ZIPIT',
    settle: 'Instant',
    tone: 'brand' as const,
    sub: 'ZimSwitch',
    logo: '/payments/zimswitch.jpg',
    logoBg: 'bg-white',
  },
  {
    name: 'Bank transfer',
    settle: 'Same-day',
    tone: 'info' as const,
    sub: 'CBZ · Stanbic · ZB',
    logo: '/payments/bank-transfer.svg',
    logoBg: 'bg-white',
  },
  {
    name: 'Visa / Mastercard',
    settle: 'Real-time',
    tone: 'gold' as const,
    sub: 'International',
    logo: '/payments/card-brands.svg',
    logoBg: 'bg-white',
  },
  {
    name: 'Upload bank slip',
    settle: 'Reconciled',
    tone: 'brand' as const,
    sub: 'Manual deposit',
    logo: '',
    logoBg: 'bg-brand-primary/10',
  },
];

interface LocalReceipt {
  reference: string;
  method: string;
  amount: string;
  when: string;
}

export default function FeesPage() {
  const payments = PAYMENTS.filter((p) => p.studentId === 's-farai');
  const totalDue = Number(FEES_SUMMARY.totalDue.replace(/,/g, ''));
  const baseOutstanding = Number(FEES_SUMMARY.outstanding.replace(/,/g, ''));
  const basePaid = Number(FEES_SUMMARY.paid.replace(/,/g, ''));

  const [paidBumper, setPaidBumper] = useState(0);
  const [recentReceipts, setRecentReceipts] = useState<LocalReceipt[]>([]);
  const [payOpen, setPayOpen] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const currentPaid = basePaid + paidBumper;
  const currentOutstanding = Math.max(0, baseOutstanding - paidBumper);
  const paidPct = totalDue > 0 ? Math.round((currentPaid / totalDue) * 100) : 0;
  const isPaid = currentOutstanding <= 0 || FEES_SUMMARY.status === 'PAID';

  function openPayment() {
    setPayOpen(true);
  }

  function onPaymentComplete(detail: { method: string; amount: string; reference: string }) {
    const amt = Number(detail.amount) || 0;
    setPaidBumper((p) => p + amt);
    setRecentReceipts((curr) => [
      {
        reference: detail.reference,
        method: detail.method,
        amount: detail.amount,
        when: new Date().toLocaleString('en-ZW', {
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
      ...curr,
    ]);
    setToast(`Payment received · ${detail.reference}`);
  }

  function downloadStatement() {
    setDownloading('statement');
    setTimeout(() => {
      downloadPdf(
        `JHS-Statement-Farai-Moyo-${new Date().getFullYear()}.pdf`,
        buildGenericDoc({
          title: 'Student fees statement',
          eyebrow: 'JHS · Bursary',
          subtitle: FEES_SUMMARY.termLabel,
          fields: [
            { label: 'Student', value: 'Farai Moyo · Form 4A' },
            { label: 'Total invoiced', value: `${FEES_SUMMARY.currency} ${FEES_SUMMARY.totalDue}` },
            { label: 'Paid', value: `${FEES_SUMMARY.currency} ${currentPaid.toLocaleString('en-ZW')}` },
            {
              label: 'Outstanding',
              value: `${FEES_SUMMARY.currency} ${currentOutstanding.toFixed(2)}`,
            },
          ],
          lines: FEES_SUMMARY.breakdown.map((b) => ({
            label: b.label,
            value: `${FEES_SUMMARY.currency} ${b.balance}`,
          })),
          footer: 'Watermarked with your student login. For any queries, bursary@jhs.ac.zw',
        }),
      );
      setDownloading(null);
      setDownloaded((s) => new Set(s).add('statement'));
      setToast('Statement downloaded');
    }, 700);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <p className="text-small text-muted">Invoice · history · all payment methods</p>
        <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-ink">
          Fees · {FEES_SUMMARY.termLabel}
        </h1>
      </header>

      {/* Pay-now alert card */}
      <section
        className={[
          'rounded-lg border p-5 shadow-card-sm',
          isPaid
            ? 'border-success/25 bg-success/[0.04]'
            : 'border-warning/25 bg-warning/[0.04]',
        ].join(' ')}
      >
        <div className="flex flex-wrap items-center gap-5">
          <span
            className={[
              'inline-flex h-14 w-14 flex-none items-center justify-center rounded-full bg-white shadow-card-sm',
              isPaid ? 'text-success' : 'text-warning',
            ].join(' ')}
          >
            {isPaid ? (
              <CheckCircle2 className="h-7 w-7" strokeWidth={1.75} aria-hidden />
            ) : (
              <CreditCard className="h-7 w-7" strokeWidth={1.75} aria-hidden />
            )}
          </span>
          <div className="min-w-0 flex-1">
            {isPaid ? (
              <>
                <p className="text-h3 text-ink">Settled in full this term.</p>
                <p className="mt-1 text-small text-muted">
                  Thank you — a copy of every receipt has been emailed to your parents.
                </p>
              </>
            ) : (
              <>
                <p className="text-small text-muted">Outstanding this term</p>
                <div className="mt-1 flex items-baseline gap-3">
                  <span className="text-small font-semibold text-muted">
                    {FEES_SUMMARY.currency}
                  </span>
                  <span className="text-[2rem] font-bold leading-none tabular-nums text-ink">
                    {currentOutstanding.toLocaleString('en-ZW', { minimumFractionDigits: 2 })}
                  </span>
                  <Badge tone="warning" dot>
                    Due by Fri 9 May
                  </Badge>
                </div>
                <p className="mt-2 text-small text-muted">
                  {paidPct}% of term paid · {FEES_SUMMARY.currency}{' '}
                  {currentPaid.toLocaleString('en-ZW')} so far
                </p>
              </>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={downloadStatement}
              disabled={downloading === 'statement'}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface disabled:opacity-60"
            >
              {downloading === 'statement' ? (
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} aria-hidden />
              ) : downloaded.has('statement') ? (
                <Check className="h-4 w-4 text-success" strokeWidth={2} aria-hidden />
              ) : (
                <FileDown className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              )}
              {downloading === 'statement' ? 'Preparing…' : 'Statement'}
            </button>
            <button
              type="button"
              onClick={openPayment}
              disabled={isPaid}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-primary px-5 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md disabled:opacity-50"
            >
              {isPaid ? 'Paid in full' : 'Pay now'}
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </button>
          </div>
        </div>
      </section>

      {/* KPI tiles */}
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiTile
          label="Total invoiced"
          value={`${FEES_SUMMARY.currency} ${FEES_SUMMARY.totalDue}`}
          sub={FEES_SUMMARY.termLabel}
          tone="brand"
        />
        <KpiTile
          label="Paid"
          value={`${FEES_SUMMARY.currency} ${currentPaid.toLocaleString('en-ZW')}`}
          sub={`${paidPct}% of the term`}
          tone="success"
          ring={paidPct}
        />
        <KpiTile
          label="Outstanding"
          value={`${FEES_SUMMARY.currency} ${currentOutstanding.toFixed(2)}`}
          sub={isPaid ? 'Paid up' : 'Due 9 May'}
          tone={isPaid ? 'success' : 'warning'}
        />
      </ul>

      {/* Payment methods */}
      <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
        <header className="border-b border-line px-5 py-3.5">
          <h2 className="text-small font-semibold text-ink">Payment methods</h2>
          <p className="text-micro text-muted">
            Seven options, one workflow — mobile money and ZIPIT clear in real time
          </p>
        </header>
        <ul className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3 xl:grid-cols-4">
          {PAYMENT_METHODS.map((m) => {
            const isUpload = m.name === 'Upload bank slip';
            return (
              <li key={m.name}>
                <button
                  type="button"
                  onClick={openPayment}
                  className="hover-lift group flex h-full w-full flex-col items-start gap-2 rounded-lg border border-line bg-card p-4 text-left transition-colors hover:border-brand-primary/30"
                >
                  <span
                    className={`inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-md border border-line ${m.logoBg}`}
                  >
                    {isUpload ? (
                      <Upload
                        className="h-5 w-5 text-brand-primary"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                    ) : (
                      <Image
                        src={m.logo}
                        alt={m.name}
                        width={96}
                        height={64}
                        className="max-h-full max-w-full object-contain p-1"
                        unoptimized
                      />
                    )}
                  </span>
                  <p className="text-small font-semibold text-ink">{m.name}</p>
                  <p className="text-micro text-muted">{m.sub}</p>
                  <Badge tone={m.tone === 'gold' ? 'gold' : m.tone} dot>
                    {m.settle}
                  </Badge>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Breakdown */}
      <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
        <header className="border-b border-line px-5 py-3.5">
          <h2 className="text-small font-semibold text-ink">Breakdown</h2>
          <p className="text-micro text-muted">Line-by-line invoice · current term</p>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-small">
            <thead>
              <tr className="bg-surface/60 text-left">
                <th className="px-5 py-3 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  Item
                </th>
                <th className="px-4 py-3 text-right text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  Due
                </th>
                <th className="px-4 py-3 text-right text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  Paid
                </th>
                <th className="px-4 py-3 text-right text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody>
              {FEES_SUMMARY.breakdown.map((row) => (
                <tr key={row.label} className="border-t border-line">
                  <td className="px-5 py-3 font-semibold text-ink">{row.label}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-ink">
                    {FEES_SUMMARY.currency} {row.due}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted">
                    {FEES_SUMMARY.currency} {row.paid}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums text-ink">
                    {FEES_SUMMARY.currency} {row.balance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Payment history */}
      <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
        <header className="border-b border-line px-5 py-3.5">
          <h2 className="text-small font-semibold text-ink">Payment history</h2>
          <p className="text-micro text-muted">
            {payments.length + recentReceipts.length} transactions on file
          </p>
        </header>
        <ul className="divide-y divide-line">
          {recentReceipts.map((r) => (
            <li
              key={r.reference}
              className="flex items-center gap-4 bg-success/[0.03] px-5 py-4"
            >
              <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-md bg-success/10 text-success">
                <Receipt className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-small font-semibold capitalize text-ink">
                  {r.method}
                </p>
                <p className="font-mono text-micro text-muted">{r.reference}</p>
              </div>
              <span className="text-small font-bold tabular-nums text-ink">
                {FEES_SUMMARY.currency} {Number(r.amount).toFixed(2)}
              </span>
              <Badge tone="success" dot>
                reconciled
              </Badge>
              <span className="hidden w-24 text-right text-micro text-muted sm:inline">
                {r.when}
              </span>
            </li>
          ))}
          {payments.map((p) => {
            const tone: 'success' | 'info' | 'warning' =
              p.status === 'RECONCILED'
                ? 'success'
                : p.status === 'VERIFIED'
                ? 'info'
                : 'warning';
            return (
              <li key={p.id} className="flex items-center gap-4 px-5 py-4">
                <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-md bg-success/10 text-success">
                  <Receipt className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-small font-semibold text-ink">{p.method}</p>
                  <p className="font-mono text-micro text-muted">{p.reference}</p>
                </div>
                <span className="text-small font-bold tabular-nums text-ink">
                  {FEES_SUMMARY.currency} {p.amount}
                </span>
                <Badge tone={tone} dot>
                  {p.status.replace('_', ' ').toLowerCase()}
                </Badge>
                <span className="hidden w-24 text-right text-micro text-muted sm:inline">
                  {new Date(p.paidAt).toLocaleDateString('en-ZW', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <PaymentFlowModal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        amount={currentOutstanding.toFixed(2)}
        label={`Farai Moyo · ${FEES_SUMMARY.termLabel}`}
        onComplete={onPaymentComplete}
      />

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
  ring,
}: {
  label: string;
  value: string;
  sub: string;
  tone: 'brand' | 'success' | 'warning';
  ring?: number;
}) {
  return (
    <li className="rounded-lg border border-line bg-card p-5 shadow-card-sm">
      <div className="flex items-center justify-between">
        <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
        {ring !== undefined ? (
          <ProgressRing
            value={ring}
            size={44}
            stroke={5}
            tone={tone === 'warning' ? 'warning' : tone === 'success' ? 'success' : 'brand'}
          />
        ) : null}
      </div>
      <p className="mt-3 text-h2 tabular-nums text-ink">{value}</p>
      <p className="mt-1 text-micro text-muted">{sub}</p>
    </li>
  );
}
