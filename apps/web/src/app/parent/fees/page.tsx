'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Download,
  FileText,
  HandCoins,
  Loader2,
  Upload,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/student/progress-ring';
import { EditorialAvatar } from '@/components/student/primitives';
import { PaymentFlowModal } from '@/components/payments/payment-flow-modal';
import {
  FAMILY_FEES,
  FAMILY_FEES_SUMMARY,
  PARENT_CHILDREN,
  PAYMENT_HISTORY,
  sumChildFees,
} from '@/lib/mock/parent-extras';
import { buildGenericDoc, downloadPdf } from '@/lib/pdf/generate';

/**
 * Parent fees — card-dense redesign.
 *
 *   - Pay-now alert card (success/warning tinted)
 *   - KPI tile row (Total / Paid / Discount / Outstanding) with ring on Paid
 *   - Per-child expandable cards
 *   - Payment methods grid with coloured icon tiles
 *   - Payment history list
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

interface LocalReceipt {
  reference: string;
  method: string;
  amount: string;
  when: string;
  label: string;
}

export default function ParentFeesPage() {
  const [expanded, setExpanded] = useState<string | null>('s-tanaka');
  const [payOpen, setPayOpen] = useState(false);
  const [payAmount, setPayAmount] = useState<string>('');
  const [payLabel, setPayLabel] = useState<string>(
    'Junior High School · family fees',
  );
  const [paidBumper, setPaidBumper] = useState(0);
  const [recentReceipts, setRecentReceipts] = useState<LocalReceipt[]>([]);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<Set<string>>(new Set());
  const [planOpen, setPlanOpen] = useState<null | { childId: string; childName: string }>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const anyOutstanding = FAMILY_FEES_SUMMARY.outstanding - paidBumper > 0;
  const currentPaid = FAMILY_FEES_SUMMARY.paid + paidBumper;
  const currentOutstanding = Math.max(0, FAMILY_FEES_SUMMARY.outstanding - paidBumper);
  const paidPct =
    FAMILY_FEES_SUMMARY.due > 0
      ? Math.round((currentPaid / FAMILY_FEES_SUMMARY.due) * 100)
      : 0;

  function openPayAll() {
    setPayAmount(currentOutstanding.toFixed(2));
    setPayLabel('Junior High School · family fees');
    setPayOpen(true);
  }

  function openPayChild(childId: string, childName: string, amount: number) {
    setPayAmount(amount.toFixed(2));
    setPayLabel(`${childName} · Term 2 balance`);
    setPayOpen(true);
  }

  function handlePaymentComplete(detail: { method: string; amount: string; reference: string }) {
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
        label: payLabel,
      },
      ...curr,
    ]);
    setToast(`Payment received · ${detail.reference}`);
  }

  function simulateDownload(id: string, label: string) {
    setDownloading(id);
    setTimeout(() => {
      setDownloading(null);
      // Dispatch to a real PDF generator by id prefix
      try {
        if (id === 'statement-term2') {
          const rows = FAMILY_FEES.flatMap((cf) => {
            const child = PARENT_CHILDREN.find((c) => c.id === cf.childId)!;
            const s = sumChildFees(cf);
            return [
              { label: `${child.firstName} ${child.lastName} · Tuition`, value: `USD ${s.due.toFixed(2)}` },
              { label: `${child.firstName} ${child.lastName} · Paid`, value: `-USD ${s.paid.toFixed(2)}` },
              { label: `${child.firstName} ${child.lastName} · Balance`, value: `USD ${s.outstanding.toFixed(2)}` },
            ];
          });
          downloadPdf(
            `JHS-Statement-Term2-${new Date().getFullYear()}.pdf`,
            buildGenericDoc({
              title: 'Term 2 fees statement',
              eyebrow: 'JHS · Bursary',
              subtitle: `Issued ${new Date().toLocaleDateString('en-ZW', { day: 'numeric', month: 'long', year: 'numeric' })}`,
              fields: [
                { label: 'Family', value: 'Moyo' },
                {
                  label: 'Outstanding',
                  value: `USD ${currentOutstanding.toLocaleString('en-ZW', { minimumFractionDigits: 2 })}`,
                },
                { label: 'Paid this term', value: `USD ${currentPaid.toLocaleString('en-ZW')}` },
              ],
              lines: rows,
              footer: 'Watermarked with your parent login. For any queries, bursary@jhs.ac.zw',
            }),
          );
        } else if (id === 'payment-export') {
          const rows = [
            ...recentReceipts.map((r) => ({
              label: `${r.when} · ${r.method} · ${r.label}`,
              value: `USD ${Number(r.amount).toFixed(2)}`,
            })),
            ...PAYMENT_HISTORY.map((p) => ({
              label: `${p.when} · ${p.method} · ${p.child}`,
              value: `USD ${p.amount.toFixed(2)}`,
            })),
          ];
          downloadPdf(
            `JHS-Payment-History-${new Date().getFullYear()}.pdf`,
            buildGenericDoc({
              title: 'Payment history',
              eyebrow: 'JHS · Bursary',
              subtitle: 'Every payment across the family',
              lines: rows,
              footer: 'Digitally signed export. Every receipt references the bank settlement that cleared it.',
            }),
          );
        } else if (id.startsWith('r-')) {
          const ref = id.replace(/^r-/, '');
          const r = recentReceipts.find((x) => x.reference === ref);
          if (r) {
            downloadPdf(
              `JHS-Receipt-${ref}.pdf`,
              buildGenericDoc({
                title: `Receipt ${ref}`,
                eyebrow: 'JHS · Bursary',
                subtitle: `Issued ${r.when}`,
                fields: [
                  { label: 'Payer', value: 'Sekai Moyo' },
                  { label: 'Method', value: r.method.replace(/^./, (c) => c.toUpperCase()) },
                  { label: 'For', value: r.label },
                  { label: 'Amount', value: `USD ${Number(r.amount).toFixed(2)}` },
                  { label: 'Reference', value: ref },
                ],
                body: 'This receipt is an auto-generated acknowledgement of a payment reconciled against our bank statement. It serves as proof of settlement.',
                footer: 'For verification call +263 242 123 456 or email bursary@jhs.ac.zw',
              }),
            );
          }
        } else if (id.startsWith('h-')) {
          const pid = id.replace(/^h-/, '');
          const p = PAYMENT_HISTORY.find((x) => x.id === pid);
          if (p) {
            downloadPdf(
              `JHS-Receipt-${p.reference}.pdf`,
              buildGenericDoc({
                title: `Receipt ${p.reference}`,
                eyebrow: 'JHS · Bursary',
                subtitle: `Issued ${p.when}`,
                fields: [
                  { label: 'Payer', value: 'Sekai Moyo' },
                  { label: 'Method', value: p.method },
                  { label: 'Child', value: p.child },
                  { label: 'Amount', value: `USD ${p.amount.toFixed(2)}` },
                  { label: 'Reference', value: p.reference },
                ],
                body: 'This receipt is an auto-generated acknowledgement of a payment reconciled against our bank statement. It serves as proof of settlement.',
                footer: 'For verification call +263 242 123 456 or email bursary@jhs.ac.zw',
              }),
            );
          }
        }
      } catch {
        /* swallow — fall through to the toast so the UI still feels responsive */
      }
      setDownloaded((curr) => {
        const next = new Set(curr);
        next.add(id);
        return next;
      });
      setToast(`Downloaded "${label}"`);
    }, 700);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-small text-muted">Fees · family total</p>
          <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-ink">
            Term 2 2026, across all children
          </h1>
          <p className="mt-2 text-small text-muted">
            Pay the family total, split automatically, or direct to a specific child.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => simulateDownload('statement-term2', 'Term 2 2026 statement')}
            disabled={downloading === 'statement-term2'}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface disabled:opacity-60"
          >
            {downloading === 'statement-term2' ? (
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} aria-hidden />
            ) : downloaded.has('statement-term2') ? (
              <Check className="h-4 w-4 text-success" strokeWidth={2} aria-hidden />
            ) : (
              <Download className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            )}
            {downloading === 'statement-term2' ? 'Preparing…' : 'Statement'}
          </button>
          <button
            type="button"
            onClick={openPayAll}
            disabled={currentOutstanding <= 0}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-primary px-5 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md disabled:opacity-50"
          >
            {currentOutstanding <= 0 ? 'Paid in full' : 'Pay now'}
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </button>
        </div>
      </header>

      {/* Pay-now card */}
      <section
        className={[
          'rounded-lg border p-5 shadow-card-sm',
          anyOutstanding
            ? 'border-warning/25 bg-warning/[0.04]'
            : 'border-success/25 bg-success/[0.04]',
        ].join(' ')}
      >
        <div className="flex flex-wrap items-center gap-5">
          <span
            className={[
              'inline-flex h-14 w-14 flex-none items-center justify-center rounded-full bg-white shadow-card-sm',
              anyOutstanding ? 'text-warning' : 'text-success',
            ].join(' ')}
          >
            {anyOutstanding ? (
              <CreditCard className="h-7 w-7" strokeWidth={1.75} aria-hidden />
            ) : (
              <CheckCircle2 className="h-7 w-7" strokeWidth={1.75} aria-hidden />
            )}
          </span>
          <div className="min-w-0 flex-1">
            {anyOutstanding ? (
              <>
                <p className="text-small text-muted">Family outstanding this term</p>
                <div className="mt-1 flex items-baseline gap-3">
                  <span className="text-small font-semibold text-muted">USD</span>
                  <span className="text-[2rem] font-bold leading-none tabular-nums text-ink">
                    {currentOutstanding.toLocaleString('en-ZW', { minimumFractionDigits: 2 })}
                  </span>
                  <Badge tone="warning" dot>
                    Due Fri 9 May
                  </Badge>
                </div>
                <p className="mt-2 text-small text-muted">
                  {paidPct}% of the family invoice is paid · USD{' '}
                  {currentPaid.toLocaleString('en-ZW')} so far
                </p>
              </>
            ) : (
              <>
                <p className="text-h3 text-ink">Family fees settled in full.</p>
                <p className="mt-1 text-small text-muted">
                  Every receipt has been emailed to you — no action needed this term.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* KPI tiles */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiTile
          label="Total fees"
          value={`USD ${FAMILY_FEES_SUMMARY.due.toLocaleString('en-ZW')}`}
          sub="Term 2"
        />
        <KpiTile
          label="Paid"
          value={`USD ${currentPaid.toLocaleString('en-ZW')}`}
          sub={`${paidPct}% of total`}
          tone="success"
          ring={paidPct}
        />
        <KpiTile
          label="Sibling discount"
          value={`USD ${FAMILY_FEES_SUMMARY.discount.toFixed(2)}`}
          sub="5% per sibling"
        />
        <KpiTile
          label="Outstanding"
          value={`USD ${currentOutstanding.toFixed(2)}`}
          sub={anyOutstanding ? 'Due 9 May' : 'All settled'}
          tone={anyOutstanding ? 'warning' : 'success'}
        />
      </ul>

      {/* Per-child breakdown */}
      <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
        <header className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <div>
            <h2 className="text-small font-semibold text-ink">Per child</h2>
            <p className="text-micro text-muted">Expand a child to see line items</p>
          </div>
          <span className="text-micro text-muted">{FAMILY_FEES.length} children</span>
        </header>
        <ul className="divide-y divide-line">
          {FAMILY_FEES.map((cf) => {
            const child = PARENT_CHILDREN.find((c) => c.id === cf.childId)!;
            const s = sumChildFees(cf);
            const isOpen = expanded === cf.childId;
            const statusTone: 'success' | 'warning' | 'danger' =
              s.outstanding === 0 ? 'success' : s.paid > 0 ? 'warning' : 'danger';
            const statusLabel =
              s.outstanding === 0 ? 'Paid' : s.paid > 0 ? 'Part-paid' : 'Outstanding';
            const childPaidPct = s.due > 0 ? Math.round((s.paid / s.due) * 100) : 0;
            return (
              <li key={cf.childId}>
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : cf.childId)}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-surface/60"
                  aria-expanded={isOpen}
                >
                  <EditorialAvatar
                    name={`${child.firstName} ${child.lastName}`}
                    size="md"
                    tone={child.colourTone === 'earth' ? 'sand' : 'terracotta'}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-small font-semibold text-ink">
                      {child.firstName} {child.lastName}
                    </p>
                    <p className="text-micro text-muted">
                      {child.form} · {child.boardingStatus}
                    </p>
                  </div>
                  <div className="hidden items-center gap-5 md:flex">
                    <NumberBlock label="Due" value={s.due} />
                    <NumberBlock label="Paid" value={s.paid} tone="success" />
                    <NumberBlock
                      label="Balance"
                      value={s.outstanding}
                      tone={s.outstanding > 0 ? 'warning' : 'success'}
                    />
                  </div>
                  <Badge tone={statusTone} dot>
                    {statusLabel}
                  </Badge>
                  <ChevronDown
                    className={`h-4 w-4 flex-none text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </button>

                {isOpen ? (
                  <div className="border-t border-line bg-surface/40">
                    <div className="overflow-x-auto">
                      <table className="w-full text-small">
                        <thead>
                          <tr className="text-left">
                            <th className="px-5 py-2.5 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                              Line item
                            </th>
                            <th className="px-4 py-2.5 text-right text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                              Due
                            </th>
                            <th className="px-4 py-2.5 text-right text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                              Paid
                            </th>
                            <th className="px-4 py-2.5 text-right text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                              Balance
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {cf.lines.map((l) => (
                            <tr key={l.label} className="border-t border-line">
                              <td className="px-5 py-2.5 text-ink">{l.label}</td>
                              <td className="px-4 py-2.5 text-right tabular-nums text-ink">
                                USD {l.due.toFixed(2)}
                              </td>
                              <td className="px-4 py-2.5 text-right tabular-nums text-muted">
                                USD {l.paid.toFixed(2)}
                              </td>
                              <td
                                className={`px-4 py-2.5 text-right tabular-nums ${
                                  l.due - l.paid > 0 ? 'font-semibold text-warning' : 'text-muted'
                                }`}
                              >
                                USD {(l.due - l.paid).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                          {cf.siblingDiscount > 0 ? (
                            <tr className="border-t border-line bg-brand-primary/5">
                              <td className="px-5 py-2.5 text-small italic text-brand-primary">
                                Sibling discount ({cf.siblingDiscount}%)
                              </td>
                              <td
                                colSpan={3}
                                className="px-4 py-2.5 text-right tabular-nums text-brand-primary"
                              >
                                − USD {s.discountAmt.toFixed(2)}
                              </td>
                            </tr>
                          ) : null}
                          <tr className="border-t border-line bg-surface/60">
                            <td className="px-5 py-3 text-small font-semibold text-ink">Balance</td>
                            <td
                              colSpan={3}
                              className="px-4 py-3 text-right tabular-nums font-semibold text-ink"
                            >
                              USD {s.outstanding.toFixed(2)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3">
                      <div className="flex items-center gap-3">
                        <ProgressRing
                          value={childPaidPct}
                          size={36}
                          stroke={4}
                          tone={s.outstanding === 0 ? 'success' : 'brand'}
                        />
                        <div>
                          <p className="text-small font-semibold text-ink">
                            {childPaidPct}% paid
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              setPlanOpen({
                                childId: child.id,
                                childName: `${child.firstName} ${child.lastName}`,
                              })
                            }
                            className="inline-flex items-center gap-1 text-micro font-semibold text-muted transition-colors hover:text-ink"
                          >
                            <HandCoins className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                            Request payment plan
                          </button>
                        </div>
                      </div>
                      {s.outstanding > 0 ? (
                        <button
                          type="button"
                          onClick={() =>
                            openPayChild(
                              child.id,
                              `${child.firstName} ${child.lastName}`,
                              s.outstanding,
                            )
                          }
                          className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-primary px-4 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md"
                        >
                          Pay {child.firstName}&rsquo;s balance
                          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                        </button>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

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
              </div>
            );
            return (
              <li key={m.name}>
                {isUpload ? (
                  <Link href="/parent/fees/upload" className="block h-full">
                    {inner}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={openPayAll}
                    className="block h-full w-full text-left"
                  >
                    {inner}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Payment history */}
      <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
        <header className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <div>
            <h2 className="text-small font-semibold text-ink">Payment history</h2>
            <p className="text-micro text-muted">
              {PAYMENT_HISTORY.length + recentReceipts.length} transactions on file
            </p>
          </div>
          <button
            type="button"
            onClick={() => simulateDownload('payment-export', 'Payment history export')}
            disabled={downloading === 'payment-export'}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-card px-4 text-micro font-semibold text-ink transition-colors hover:bg-surface disabled:opacity-60"
          >
            {downloading === 'payment-export' ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.75} aria-hidden />
            ) : downloaded.has('payment-export') ? (
              <Check className="h-3.5 w-3.5 text-success" strokeWidth={2} aria-hidden />
            ) : (
              <Download className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            )}
            {downloading === 'payment-export' ? 'Exporting…' : 'Export'}
          </button>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-small">
            <thead>
              <tr className="bg-surface/60 text-left">
                <th className="px-5 py-3 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  Date
                </th>
                <th className="px-4 py-3 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  Method
                </th>
                <th className="px-4 py-3 text-right text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  Amount
                </th>
                <th className="px-4 py-3 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  Child
                </th>
                <th className="px-4 py-3 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  Reference
                </th>
                <th className="px-4 py-3 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  Status
                </th>
                <th className="w-12 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {recentReceipts.map((r) => (
                <tr key={r.reference} className="border-t border-line bg-success/[0.03]">
                  <td className="px-5 py-3 text-micro text-muted">{r.when}</td>
                  <td className="px-4 py-3 font-semibold capitalize text-ink">{r.method}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-ink">
                    USD {Number(r.amount).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-ink">{r.label}</td>
                  <td className="px-4 py-3 font-mono text-micro text-muted">{r.reference}</td>
                  <td className="px-4 py-3">
                    <Badge tone="success" dot>
                      reconciled
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => simulateDownload(`r-${r.reference}`, `Receipt ${r.reference}`)}
                      disabled={downloading === `r-${r.reference}`}
                      className="rounded-full p-1.5 text-muted transition-colors hover:bg-surface hover:text-ink disabled:opacity-50"
                      aria-label="Download receipt"
                    >
                      {downloading === `r-${r.reference}` ? (
                        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                      ) : downloaded.has(`r-${r.reference}`) ? (
                        <Check className="h-4 w-4 text-success" strokeWidth={2} />
                      ) : (
                        <FileText className="h-4 w-4" strokeWidth={1.75} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
              {PAYMENT_HISTORY.map((p) => (
                <tr key={p.id} className="border-t border-line">
                  <td className="px-5 py-3 text-micro text-muted">{p.when}</td>
                  <td className="px-4 py-3 font-semibold text-ink">{p.method}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-ink">
                    USD {p.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-ink">{p.child}</td>
                  <td className="px-4 py-3 font-mono text-micro text-muted">{p.reference}</td>
                  <td className="px-4 py-3">
                    <Badge tone="success" dot>
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => simulateDownload(`h-${p.id}`, `Receipt ${p.reference}`)}
                      disabled={downloading === `h-${p.id}`}
                      className="rounded-full p-1.5 text-muted transition-colors hover:bg-surface hover:text-ink disabled:opacity-50"
                      aria-label="Download receipt"
                    >
                      {downloading === `h-${p.id}` ? (
                        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                      ) : downloaded.has(`h-${p.id}`) ? (
                        <Check className="h-4 w-4 text-success" strokeWidth={2} />
                      ) : (
                        <FileText className="h-4 w-4" strokeWidth={1.75} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <PaymentFlowModal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        amount={payAmount}
        label={payLabel}
        onComplete={handlePaymentComplete}
      />

      {planOpen ? (
        <PaymentPlanModal
          childName={planOpen.childName}
          onClose={() => setPlanOpen(null)}
          onSubmit={(detail) => {
            setPlanOpen(null);
            setToast(
              `Payment plan requested · ${detail.installments} installments — bursar will confirm within 24h`,
            );
          }}
        />
      ) : null}

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

function PaymentPlanModal({
  childName,
  onClose,
  onSubmit,
}: {
  childName: string;
  onClose: () => void;
  onSubmit: (detail: { installments: number; firstDate: string; notes: string }) => void;
}) {
  const [installments, setInstallments] = useState(3);
  const [firstDate, setFirstDate] = useState('');
  const [notes, setNotes] = useState('');
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          if (!firstDate) return;
          onSubmit({ installments, firstDate, notes: notes.trim() });
        }}
        className="flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-lg border border-line bg-card shadow-card-md"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <div>
            <p className="text-micro font-semibold uppercase tracking-[0.12em] text-brand-primary">
              Request payment plan
            </p>
            <h2 className="text-h3 text-ink">{childName}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-muted transition-colors hover:bg-surface hover:text-ink"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
        <div className="space-y-4 p-6">
          <label className="block">
            <span className="mb-2 block text-micro font-semibold uppercase tracking-[0.12em] text-muted">
              Split into
            </span>
            <select
              value={installments}
              onChange={(e) => setInstallments(Number(e.target.value))}
              className="h-11 w-full rounded-md border border-line bg-card px-3 text-small text-ink focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            >
              <option value={2}>2 installments (50% + 50%)</option>
              <option value={3}>3 installments (monthly)</option>
              <option value={4}>4 installments (weekly)</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-micro font-semibold uppercase tracking-[0.12em] text-muted">
              First payment date
            </span>
            <input
              type="date"
              required
              value={firstDate}
              onChange={(e) => setFirstDate(e.target.value)}
              className="h-11 w-full rounded-md border border-line bg-card px-3 text-small text-ink focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-micro font-semibold uppercase tracking-[0.12em] text-muted">
              Notes for the bursar (optional)
            </span>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Context on income timing or hardship — stays confidential."
              className="w-full rounded-md border border-line bg-card p-3 text-small text-ink placeholder:text-muted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </label>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-line bg-card px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-primary px-4 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md"
          >
            Send request
          </button>
        </div>
      </form>
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
  sub?: string;
  tone?: 'brand' | 'success' | 'warning';
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
      {sub ? <p className="mt-1 text-micro text-muted">{sub}</p> : null}
    </li>
  );
}

function NumberBlock({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: 'success' | 'warning';
}) {
  const colour = tone === 'warning' ? 'text-warning' : tone === 'success' ? 'text-success' : 'text-ink';
  return (
    <div className="text-right">
      <p className="text-micro font-semibold uppercase tracking-[0.1em] text-muted">{label}</p>
      <p className={`text-small font-semibold tabular-nums ${colour}`}>USD {value.toFixed(2)}</p>
    </div>
  );
}
