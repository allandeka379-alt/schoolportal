import Link from 'next/link';
import { ArrowRight, Banknote, CreditCard, FileDown, Smartphone, Upload } from 'lucide-react';

import { INVOICES, PAYMENTS } from '@/lib/mock/fixtures';
import { FEES_SUMMARY } from '@/lib/mock/student-extras';

import { EditorialCard, SectionEyebrow, StatusPill } from '@/components/student/primitives';

const PAYMENT_METHODS = [
  { name: 'EcoCash', icon: Smartphone, settle: 'Real-time' },
  { name: 'OneMoney', icon: Smartphone, settle: 'Real-time' },
  { name: 'InnBucks', icon: Smartphone, settle: 'Real-time' },
  { name: 'ZIPIT', icon: Banknote, settle: 'Instant' },
  { name: 'CBZ / Stanbic / ZB', icon: Banknote, settle: 'Same-day' },
  { name: 'Visa / Mastercard', icon: CreditCard, settle: 'Real-time' },
  { name: 'Upload slip', icon: Upload, settle: 'Reconciled' },
];

/**
 * Fees — §11 of the spec (student view is informational; full pay flow shared
 * with the parent portal).
 */
export default function FeesPage() {
  const invoices = INVOICES.filter((i) => i.studentId === 's-farai');
  const payments = PAYMENTS.filter((p) => p.studentId === 's-farai');

  return (
    <div className="space-y-8">
      <header>
        <SectionEyebrow>Fees</SectionEyebrow>
        <h1 className="mt-2 font-display text-[clamp(1.75rem,3vw,2.25rem)] text-ink">
          {FEES_SUMMARY.termLabel}
          <span className="text-terracotta">.</span>
        </h1>
      </header>

      {/* Summary tiles */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryStat label="Total due" value={FEES_SUMMARY.totalDue} tone="neutral" />
        <SummaryStat label="Paid" value={FEES_SUMMARY.paid} tone="ok" />
        <SummaryStat label="Outstanding" value={FEES_SUMMARY.outstanding} tone={FEES_SUMMARY.status === 'PAID' ? 'ok' : 'warn'} />
      </div>

      {/* Pay now */}
      <EditorialCard className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
        <div className="flex items-center gap-3">
          <StatusPill state={FEES_SUMMARY.status === 'PAID' ? 'paid' : 'partial'} />
          <p className="font-serif text-[15px] text-stone">
            Due by <span className="text-ink">Friday 9 May</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="btn-ghost"
          >
            <FileDown className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            Statement
          </button>
          <Link href="#" className="btn-terracotta">
            Pay now
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          </Link>
        </div>
      </EditorialCard>

      {/* Payment methods */}
      <EditorialCard>
        <div className="border-b border-sand px-6 py-4">
          <SectionEyebrow>Payment methods</SectionEyebrow>
          <p className="mt-1 font-sans text-[13px] text-stone">
            Seven options, one workflow. Mobile money and ZIPIT settle in real time.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3 lg:grid-cols-4">
          {PAYMENT_METHODS.map((m) => {
            const Icon = m.icon;
            return (
              <li
                key={m.name}
                className="group flex flex-col gap-2 rounded border border-sand bg-sand-light/40 px-4 py-3 transition-all hover:border-terracotta hover:bg-sand-light"
              >
                <Icon className="h-5 w-5 text-earth" strokeWidth={1.5} aria-hidden />
                <p className="font-sans text-[13px] font-semibold text-ink">{m.name}</p>
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                  {m.settle}
                </p>
              </li>
            );
          })}
        </ul>
      </EditorialCard>

      {/* Breakdown */}
      <EditorialCard className="overflow-hidden">
        <div className="border-b border-sand px-6 py-4">
          <SectionEyebrow>Breakdown</SectionEyebrow>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="bg-sand-light/40">
                <th className="px-6 py-3 text-left font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Item
                </th>
                <th className="px-4 py-3 text-right font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Due
                </th>
                <th className="px-4 py-3 text-right font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Paid
                </th>
                <th className="px-4 py-3 text-right font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody>
              {FEES_SUMMARY.breakdown.map((row) => (
                <tr key={row.label} className="border-t border-sand-light">
                  <td className="px-6 py-3 font-sans font-medium text-ink">{row.label}</td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-ink">
                    {FEES_SUMMARY.currency} {row.due}
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-stone">
                    {FEES_SUMMARY.currency} {row.paid}
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums font-semibold text-ink">
                    {FEES_SUMMARY.currency} {row.balance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </EditorialCard>

      {/* Payment history */}
      <EditorialCard className="overflow-hidden">
        <div className="border-b border-sand px-6 py-4">
          <SectionEyebrow>Payment history</SectionEyebrow>
        </div>
        <ul className="divide-y divide-sand-light">
          {payments.map((p) => (
            <li key={p.id} className="flex items-center gap-4 px-6 py-4">
              <div className="min-w-0 flex-1">
                <p className="font-sans font-medium text-ink">{p.method}</p>
                <p className="mt-0.5 font-mono text-[12px] text-stone">{p.reference}</p>
              </div>
              <span className="font-mono tabular-nums text-ink">USD {p.amount}</span>
              <StatusPill state={p.status === 'RECONCILED' ? 'verified' : 'pending'}>
                {p.status.toLowerCase().replace('_', ' ')}
              </StatusPill>
              <span className="w-24 text-right font-sans text-[12px] text-stone">
                {new Date(p.paidAt).toLocaleDateString('en-ZW', { day: 'numeric', month: 'short' })}
              </span>
            </li>
          ))}
        </ul>
      </EditorialCard>
    </div>
  );
}

function SummaryStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'neutral' | 'ok' | 'warn';
}) {
  const colour = tone === 'ok' ? 'text-ok' : tone === 'warn' ? 'text-danger' : 'text-ink';
  return (
    <EditorialCard className="px-6 py-6">
      <p className="hha-eyebrow-earth">{label}</p>
      <p className={`mt-2 font-display text-[42px] leading-none tabular-nums ${colour}`}>
        <span className="text-[18px] text-stone">{FEES_SUMMARY.currency} </span>
        {value}
      </p>
    </EditorialCard>
  );
}
