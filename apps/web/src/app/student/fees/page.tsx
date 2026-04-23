import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  FileDown,
  Receipt,
  Upload,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/student/progress-ring';
import { PAYMENTS } from '@/lib/mock/fixtures';
import { FEES_SUMMARY } from '@/lib/mock/student-extras';

/**
 * Student fees — card-dense redesign.
 *
 * Informational view. The full payment flow lives in the parent portal.
 *   • Pay-now alert card (or paid success card) at the top
 *   • 3 KPI tiles (Total / Paid / Outstanding) with a ring on the main one
 *   • Payment methods grid — 7 coloured tiles
 *   • Breakdown table + payment history, each a bordered card
 */

const PAYMENT_METHODS = [
  {
    name: 'EcoCash',
    settle: 'Real-time',
    tone: 'success' as const,
    sub: 'Econet',
    logo: '/payments/ecocash.png',
    logoBg: 'bg-[#E10600]',
  },
  {
    name: 'OneMoney',
    settle: 'Real-time',
    tone: 'info' as const,
    sub: 'NetOne',
    logo: '/payments/onemoney.png',
    logoBg: 'bg-[#FFD800]',
  },
  {
    name: 'InnBucks',
    settle: 'Real-time',
    tone: 'warning' as const,
    sub: 'Innscor',
    logo: '/payments/innbucks.svg',
    logoBg: 'bg-[#0B6B3A]',
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

export default function FeesPage() {
  const payments = PAYMENTS.filter((p) => p.studentId === 's-farai');
  const totalDue = Number(FEES_SUMMARY.totalDue.replace(/,/g, ''));
  const paid = Number(FEES_SUMMARY.paid.replace(/,/g, ''));
  const paidPct = totalDue > 0 ? Math.round((paid / totalDue) * 100) : 0;
  const isPaid = FEES_SUMMARY.status === 'PAID';

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <p className="text-small text-muted">Invoice · history · all payment methods</p>
        <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-ink">
          Fees · {FEES_SUMMARY.termLabel}
        </h1>
      </header>

      {/* Pay-now card (civic alert style) */}
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
                  Thank you — we&rsquo;ll email a copy of every receipt to your parents.
                </p>
              </>
            ) : (
              <>
                <p className="text-small text-muted">Outstanding this term</p>
                <div className="mt-1 flex items-baseline gap-3">
                  <span className="text-small font-semibold text-muted">{FEES_SUMMARY.currency}</span>
                  <span className="text-[2rem] font-bold leading-none tabular-nums text-ink">
                    {FEES_SUMMARY.outstanding}
                  </span>
                  <Badge tone="warning" dot>Due by Fri 9 May</Badge>
                </div>
                <p className="mt-2 text-small text-muted">
                  {paidPct}% of term paid · {FEES_SUMMARY.currency} {FEES_SUMMARY.paid} so far
                </p>
              </>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface"
            >
              <FileDown className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              Statement
            </button>
            <Link
              href="/parent/fees"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-primary px-5 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md"
            >
              {isPaid ? 'View history' : 'Pay now'}
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </Link>
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
          value={`${FEES_SUMMARY.currency} ${FEES_SUMMARY.paid}`}
          sub={`${paidPct}% of the term`}
          tone="success"
          ring={paidPct}
        />
        <KpiTile
          label="Outstanding"
          value={`${FEES_SUMMARY.currency} ${FEES_SUMMARY.outstanding}`}
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
            const inner = (
              <div className="hover-lift group flex h-full flex-col gap-2 rounded-lg border border-line bg-card p-4 transition-colors hover:border-brand-primary/30">
                <span
                  className={`inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-md border border-line ${m.logoBg}`}
                >
                  {isUpload ? (
                    <Upload className="h-5 w-5 text-brand-primary" strokeWidth={1.75} aria-hidden />
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
              </div>
            );
            return (
              <li key={m.name}>
                {isUpload ? (
                  <Link href="/parent/fees/upload" className="block h-full">
                    {inner}
                  </Link>
                ) : (
                  <Link href="/parent/fees" className="block h-full">
                    {inner}
                  </Link>
                )}
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
          <p className="text-micro text-muted">{payments.length} transactions on file</p>
        </header>
        <ul className="divide-y divide-line">
          {payments.map((p) => {
            const tone: 'success' | 'info' | 'warning' =
              p.status === 'RECONCILED' ? 'success' : p.status === 'VERIFIED' ? 'info' : 'warning';
            return (
              <li key={p.id} className="flex items-center gap-4 px-5 py-4">
                <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-md bg-success/10 text-success">
                  <Receipt className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-small font-semibold text-ink">{p.method}</p>
                  <p className="text-micro font-mono text-muted">{p.reference}</p>
                </div>
                <span className="text-small font-bold tabular-nums text-ink">
                  {FEES_SUMMARY.currency} {p.amount}
                </span>
                <Badge tone={tone} dot>
                  {p.status.replace('_', ' ').toLowerCase()}
                </Badge>
                <span className="hidden w-24 text-right text-micro text-muted sm:inline">
                  {new Date(p.paidAt).toLocaleDateString('en-ZW', { day: 'numeric', month: 'short' })}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
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
