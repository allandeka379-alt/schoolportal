'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Download,
  FileText,
  HandCoins,
  Smartphone,
  Upload,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/student/progress-ring';
import { EditorialAvatar } from '@/components/student/primitives';
import {
  FAMILY_FEES,
  FAMILY_FEES_SUMMARY,
  PARENT_CHILDREN,
  PAYMENT_HISTORY,
  sumChildFees,
} from '@/lib/mock/parent-extras';

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
  { name: 'EcoCash', icon: Smartphone, settle: 'Real-time', tone: 'success' },
  { name: 'OneMoney', icon: Smartphone, settle: 'Real-time', tone: 'info' },
  { name: 'InnBucks', icon: Smartphone, settle: 'Real-time', tone: 'warning' },
  { name: 'ZIPIT', icon: Banknote, settle: 'Instant', tone: 'brand' },
  { name: 'CBZ / Stanbic / ZB', icon: Banknote, settle: 'Same-day', tone: 'info' },
  { name: 'Visa / Mastercard', icon: CreditCard, settle: 'Real-time', tone: 'gold' },
  { name: 'Upload slip', icon: Upload, settle: 'Reconciled', tone: 'brand' },
] as const;

const TONE_STYLES: Record<'brand' | 'success' | 'info' | 'warning' | 'gold', string> = {
  brand: 'bg-brand-primary/10 text-brand-primary',
  success: 'bg-success/10 text-success',
  info: 'bg-info/10 text-info',
  warning: 'bg-warning/10 text-warning',
  gold: 'bg-brand-accent/15 text-brand-accent',
};

export default function ParentFeesPage() {
  const [expanded, setExpanded] = useState<string | null>('s-tanaka');

  const anyOutstanding = FAMILY_FEES_SUMMARY.outstanding > 0;
  const paidPct =
    FAMILY_FEES_SUMMARY.due > 0
      ? Math.round((FAMILY_FEES_SUMMARY.paid / FAMILY_FEES_SUMMARY.due) * 100)
      : 0;

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
            className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface"
          >
            <Download className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            Statement
          </button>
          <button
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-primary px-5 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md"
          >
            Pay now
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
                    {FAMILY_FEES_SUMMARY.outstanding.toLocaleString('en-ZW', { minimumFractionDigits: 2 })}
                  </span>
                  <Badge tone="warning" dot>
                    Due Fri 9 May
                  </Badge>
                </div>
                <p className="mt-2 text-small text-muted">
                  {paidPct}% of the family invoice is paid · USD{' '}
                  {FAMILY_FEES_SUMMARY.paid.toLocaleString('en-ZW')} so far
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
          value={`USD ${FAMILY_FEES_SUMMARY.paid.toLocaleString('en-ZW')}`}
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
          value={`USD ${FAMILY_FEES_SUMMARY.outstanding.toFixed(2)}`}
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
                            className="inline-flex items-center gap-1 text-micro font-semibold text-muted hover:text-ink"
                          >
                            <HandCoins className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                            Request payment plan
                          </button>
                        </div>
                      </div>
                      {s.outstanding > 0 ? (
                        <button
                          type="button"
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
            const Icon = m.icon;
            const isUpload = m.name === 'Upload slip';
            const inner = (
              <div className="hover-lift group flex h-full flex-col gap-2 rounded-lg border border-line bg-card p-4 transition-colors hover:border-brand-primary/30">
                <span
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-md ${
                    TONE_STYLES[m.tone as keyof typeof TONE_STYLES]
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </span>
                <p className="text-small font-semibold text-ink">{m.name}</p>
                <Badge
                  tone={
                    m.tone === 'gold'
                      ? 'gold'
                      : m.tone === 'warning'
                      ? 'warning'
                      : m.tone === 'info'
                      ? 'info'
                      : m.tone === 'success'
                      ? 'success'
                      : 'brand'
                  }
                  dot
                >
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
                  inner
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
            <p className="text-micro text-muted">{PAYMENT_HISTORY.length} transactions on file</p>
          </div>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-card px-4 text-micro font-semibold text-ink transition-colors hover:bg-surface"
          >
            <Download className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            Export
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
                      className="rounded-full p-1.5 text-muted transition-colors hover:bg-surface hover:text-ink"
                      aria-label="Download receipt"
                    >
                      <FileText className="h-4 w-4" strokeWidth={1.75} />
                    </button>
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
