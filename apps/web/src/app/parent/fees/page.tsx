'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Banknote,
  ChevronDown,
  CreditCard,
  Download,
  FileText,
  HandCoins,
  Smartphone,
  Upload,
} from 'lucide-react';

import { EditorialAvatar, EditorialCard, SectionEyebrow } from '@/components/student/primitives';
import { ChildColourDot, ParentPageHeader, ParentStatusPill } from '@/components/parent/primitives';
import {
  FAMILY_FEES,
  FAMILY_FEES_SUMMARY,
  PARENT_CHILDREN,
  PAYMENT_HISTORY,
  sumChildFees,
} from '@/lib/mock/parent-extras';

/**
 * Parent fees — §08, §15.
 *
 *   - Family total band
 *   - Per-child expandable sections with line items
 *   - Payment methods grid (EcoCash / OneMoney / InnBucks / ZIPIT / Bank /
 *     Card / Upload slip)
 *   - Payment history
 *   - Request-payment-plan affordance when outstanding
 */
export default function ParentFeesPage() {
  const [expanded, setExpanded] = useState<string | null>('s-tanaka');

  const anyOutstanding = FAMILY_FEES_SUMMARY.outstanding > 0;

  return (
    <div className="space-y-8">
      <ParentPageHeader
        eyebrow="Fees · family total"
        title="Term 2 2026,"
        accent="across all children."
        subtitle="Pay the family total, split automatically, or direct to a specific child."
        right={
          <>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-earth hover:bg-sand-light"
            >
              <Download className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              Statement
            </button>
            <button type="button" className="btn-terracotta">
              Pay now
            </button>
          </>
        }
      />

      {/* Family total */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <SummaryCard
          label="Total fees"
          value={`USD ${FAMILY_FEES_SUMMARY.due.toLocaleString('en-ZW')}`}
        />
        <SummaryCard
          label="Paid"
          value={`USD ${FAMILY_FEES_SUMMARY.paid.toLocaleString('en-ZW')}`}
          tone="ok"
        />
        <SummaryCard
          label="Sibling discount"
          value={`USD ${FAMILY_FEES_SUMMARY.discount.toFixed(2)}`}
          tone="neutral"
          sub="5% per sibling"
        />
        <SummaryCard
          label="Outstanding"
          value={`USD ${FAMILY_FEES_SUMMARY.outstanding.toFixed(2)}`}
          tone={anyOutstanding ? 'warn' : 'ok'}
          sub={anyOutstanding ? 'Due Friday 9 May' : 'All settled'}
        />
      </div>

      {/* Per-child breakdown */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <SectionEyebrow>Per child</SectionEyebrow>
          <span className="font-sans text-[12px] text-stone">
            Expand a child to see line items
          </span>
        </div>
        <ul className="space-y-3">
          {FAMILY_FEES.map((cf) => {
            const child = PARENT_CHILDREN.find((c) => c.id === cf.childId)!;
            const s = sumChildFees(cf);
            const isOpen = expanded === cf.childId;
            const statusState =
              s.outstanding === 0
                ? 'paid'
                : s.paid > 0
                ? 'partial'
                : 'overdue';
            return (
              <li key={cf.childId}>
                <EditorialCard className="overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : cf.childId)}
                    className="flex w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-sand-light/40"
                    aria-expanded={isOpen}
                  >
                    <ChildColourDot tone={child.colourTone} />
                    <EditorialAvatar
                      name={`${child.firstName} ${child.lastName}`}
                      size="md"
                      tone={child.colourTone === 'earth' ? 'sand' : 'terracotta'}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-[18px] text-ink">
                        {child.firstName} {child.lastName}
                      </p>
                      <p className="font-sans text-[12px] text-stone">
                        {child.form} · {child.boardingStatus}
                      </p>
                    </div>
                    <div className="hidden items-center gap-6 md:flex">
                      <Number label="Due" value={s.due} />
                      <Number label="Paid" value={s.paid} />
                      <Number
                        label="Balance"
                        value={s.outstanding}
                        tone={s.outstanding > 0 ? 'warn' : 'ok'}
                      />
                    </div>
                    <ParentStatusPill state={statusState} />
                    <ChevronDown
                      className={`h-4 w-4 flex-none text-stone transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </button>

                  {isOpen ? (
                    <div className="border-t border-sand bg-sand-light/30">
                      <table className="w-full text-[14px]">
                        <thead>
                          <tr className="text-left">
                            <th className="px-6 py-2.5 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                              Line item
                            </th>
                            <th className="px-4 py-2.5 text-right font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                              Due
                            </th>
                            <th className="px-4 py-2.5 text-right font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                              Paid
                            </th>
                            <th className="px-4 py-2.5 text-right font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                              Balance
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {cf.lines.map((l) => (
                            <tr key={l.label} className="border-t border-sand-light">
                              <td className="px-6 py-2.5 font-sans text-[13px] text-ink">{l.label}</td>
                              <td className="px-4 py-2.5 text-right font-mono tabular-nums text-ink">
                                USD {l.due.toFixed(2)}
                              </td>
                              <td className="px-4 py-2.5 text-right font-mono tabular-nums text-stone">
                                USD {l.paid.toFixed(2)}
                              </td>
                              <td
                                className={`px-4 py-2.5 text-right font-mono tabular-nums ${
                                  l.due - l.paid > 0 ? 'text-warn font-medium' : 'text-stone'
                                }`}
                              >
                                USD {(l.due - l.paid).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                          {cf.siblingDiscount > 0 ? (
                            <tr className="border-t border-sand-light bg-sand-light/60">
                              <td className="px-6 py-2.5 font-sans text-[13px] italic text-earth">
                                Sibling discount ({cf.siblingDiscount}%)
                              </td>
                              <td
                                colSpan={3}
                                className="px-4 py-2.5 text-right font-mono tabular-nums text-earth"
                              >
                                − USD {s.discountAmt.toFixed(2)}
                              </td>
                            </tr>
                          ) : null}
                          <tr className="border-t border-sand bg-sand-light/40">
                            <td className="px-6 py-3 font-sans text-[13px] font-semibold text-ink">
                              Balance
                            </td>
                            <td colSpan={3} className="px-4 py-3 text-right font-mono tabular-nums font-semibold text-ink">
                              USD {s.outstanding.toFixed(2)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="flex items-center justify-between border-t border-sand px-6 py-3">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 font-sans text-[12px] font-medium text-stone hover:text-earth"
                        >
                          <HandCoins className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                          Request payment plan
                        </button>
                        {s.outstanding > 0 ? (
                          <button
                            type="button"
                            className="inline-flex h-9 items-center rounded bg-terracotta px-4 font-sans text-[12px] font-semibold text-cream hover:bg-terracotta-hover"
                          >
                            Pay {child.firstName}&rsquo;s balance
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </EditorialCard>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Payment methods */}
      <EditorialCard>
        <div className="border-b border-sand px-6 py-4">
          <SectionEyebrow>Payment methods</SectionEyebrow>
          <p className="mt-1 font-sans text-[13px] text-stone">
            Seven options, one workflow. Mobile money and ZIPIT clear in real time.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3 lg:grid-cols-4">
          <Method icon={Smartphone} label="EcoCash" settle="Real-time" />
          <Method icon={Smartphone} label="OneMoney" settle="Real-time" />
          <Method icon={Smartphone} label="InnBucks" settle="Real-time" />
          <Method icon={Banknote} label="ZIPIT" settle="Instant" />
          <Method icon={Banknote} label="CBZ / Stanbic / ZB" settle="Same-day" />
          <Method icon={CreditCard} label="Visa / Mastercard" settle="Real-time" />
          <Method icon={Upload} label="Upload slip" settle="Reconciled" featured href="/parent/fees/upload" />
        </ul>
      </EditorialCard>

      {/* Payment history */}
      <EditorialCard className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-sand px-6 py-4">
          <SectionEyebrow>Payment history</SectionEyebrow>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
          >
            <Download className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
            Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="bg-sand-light/40 text-left">
                <th className="px-6 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Date
                </th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Method
                </th>
                <th className="px-4 py-3 text-right font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Amount
                </th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Child
                </th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Reference
                </th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Status
                </th>
                <th className="w-12 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {PAYMENT_HISTORY.map((p) => (
                <tr key={p.id} className="border-t border-sand-light">
                  <td className="px-6 py-3 font-sans text-[13px] text-stone">{p.when}</td>
                  <td className="px-4 py-3 font-sans font-medium text-ink">{p.method}</td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-ink">
                    USD {p.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 font-sans text-[13px] text-ink">{p.child}</td>
                  <td className="px-4 py-3 font-mono text-[12px] text-stone">{p.reference}</td>
                  <td className="px-4 py-3">
                    <ParentStatusPill state="paid">{p.status}</ParentStatusPill>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      className="rounded p-1.5 text-stone hover:bg-sand hover:text-ink"
                      aria-label="Download receipt"
                    >
                      <FileText className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </EditorialCard>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone,
  sub,
}: {
  label: string;
  value: string;
  tone?: 'ok' | 'warn' | 'neutral';
  sub?: string;
}) {
  const colour = tone === 'ok' ? 'text-ok' : tone === 'warn' ? 'text-danger' : 'text-ink';
  return (
    <EditorialCard className="px-5 py-4">
      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
        {label}
      </p>
      <p className={`mt-1 font-display text-[26px] leading-none tabular-nums ${colour}`}>{value}</p>
      {sub ? <p className="mt-1 font-sans text-[11px] text-stone">{sub}</p> : null}
    </EditorialCard>
  );
}

function Number({ label, value, tone }: { label: string; value: number; tone?: 'ok' | 'warn' }) {
  const colour = tone === 'warn' ? 'text-danger' : tone === 'ok' ? 'text-ok' : 'text-ink';
  return (
    <div className="text-right">
      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
        {label}
      </p>
      <p className={`font-mono text-[14px] tabular-nums ${colour}`}>
        USD {value.toFixed(2)}
      </p>
    </div>
  );
}

function Method({
  icon: Icon,
  label,
  settle,
  featured,
  href,
}: {
  icon: typeof Banknote;
  label: string;
  settle: string;
  featured?: boolean;
  href?: string;
}) {
  const inner = (
    <>
      <Icon className="h-5 w-5 text-earth" strokeWidth={1.5} aria-hidden />
      <p className="font-sans text-[13px] font-semibold text-ink">{label}</p>
      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
        {settle}
      </p>
    </>
  );
  const className = [
    'group flex flex-col gap-2 rounded border px-4 py-3 transition-all hover:-translate-y-px',
    featured
      ? 'border-terracotta/60 bg-sand-light'
      : 'border-sand bg-sand-light/40 hover:border-terracotta',
  ].join(' ');
  return (
    <li className="list-none">
      {href ? (
        <Link href={href} className={className}>
          {inner}
        </Link>
      ) : (
        <div className={className}>{inner}</div>
      )}
    </li>
  );
}
