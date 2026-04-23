import Link from 'next/link';
import { AlertTriangle, ArrowUpRight, Banknote, Download } from 'lucide-react';

import { ChartBar, ExecPageHeader, KPICard } from '@/components/headmaster/primitives';

/**
 * Administrator · Fees.
 *
 * Fees-monitoring dashboard. Read-only from the Administrator's side —
 * the bursar runs the operations, this page answers three questions:
 *   1. How much has been collected and how much is outstanding?
 *   2. Where is it coming from (methods + banks)?
 *   3. Who is behind and by how long (ageing + top debtors)?
 */

// These figures tie back to the mock school.ts data. In a real API build
// these would come from the bursar's module via an aggregated endpoint.
const TARGET = 480_320;
const COLLECTED = 184_320;
const OUTSTANDING = TARGET - COLLECTED;

const DAILY_COLLECTION: readonly { date: string; amount: number }[] = [
  { date: '08 Apr', amount: 6_200 },
  { date: '09 Apr', amount: 9_800 },
  { date: '10 Apr', amount: 11_400 },
  { date: '11 Apr', amount: 7_900 },
  { date: '14 Apr', amount: 13_100 },
  { date: '15 Apr', amount: 12_500 },
  { date: '16 Apr', amount: 17_850 },
  { date: '17 Apr', amount: 9_400 },
  { date: '18 Apr', amount: 14_200 },
  { date: '21 Apr', amount: 19_500 },
  { date: '22 Apr', amount: 22_470 },
];

const BY_METHOD: readonly { label: string; amount: number; color: string }[] = [
  { label: 'EcoCash',  amount: 46_200, color: 'bg-earth' },
  { label: 'OneMoney', amount: 22_800, color: 'bg-earth/80' },
  { label: 'InnBucks', amount: 15_200, color: 'bg-earth/60' },
  { label: 'ZIPIT',    amount: 12_460, color: 'bg-ochre' },
  { label: 'CBZ transfer',     amount: 41_500, color: 'bg-[#30527A]' },
  { label: 'Stanbic slip',     amount: 19_300, color: 'bg-[#30527A]/80' },
  { label: 'ZB / Steward slip',amount: 17_060, color: 'bg-[#30527A]/60' },
  { label: 'Cash / card',      amount: 9_800,  color: 'bg-stone' },
];

const AGEING: readonly { bucket: string; invoices: number; amount: number; pct: number }[] = [
  { bucket: '0–7 days',   invoices: 112, amount: 68_420, pct: 62 },
  { bucket: '8–30 days',  invoices: 48,  amount: 29_120, pct: 26 },
  { bucket: '31–60 days', invoices: 16,  amount:  8_800, pct: 8  },
  { bucket: 'Over 60 days', invoices: 9, amount:  4_420, pct: 4  },
];

const BY_FORM: readonly { form: string; invoiced: number; collected: number }[] = [
  { form: 'Form 1', invoiced: 68_000, collected: 34_300 },
  { form: 'Form 2', invoiced: 72_800, collected: 40_900 },
  { form: 'Form 3', invoiced: 78_400, collected: 27_600 },
  { form: 'Form 4', invoiced: 84_000, collected: 38_700 },
  { form: 'Form 5', invoiced: 80_400, collected: 22_800 },
  { form: 'Form 6', invoiced: 96_720, collected: 20_020 },
];

const TOP_DEBTORS: readonly {
  id: string;
  student: string;
  form: string;
  outstanding: number;
  daysOverdue: number;
  lastContact: string;
}[] = [
  { id: 'd1', student: 'Rudo Mutasa',      form: '3 Blue',  outstanding: 1_650, daysOverdue: 72, lastContact: 'SMS 12 Apr' },
  { id: 'd2', student: 'Tinashe Ncube',    form: '3 Blue',  outstanding: 1_450, daysOverdue: 68, lastContact: 'Call 10 Apr' },
  { id: 'd3', student: 'Mazvita Ruzive',   form: '4A',       outstanding:   980, daysOverdue: 61, lastContact: 'SMS 16 Apr' },
  { id: 'd4', student: 'Tapiwa Ndlovu',    form: '4A',       outstanding:   850, daysOverdue: 44, lastContact: 'Letter 14 Apr' },
  { id: 'd5', student: 'Kundai Mashingaidze', form: '4A',    outstanding:   720, daysOverdue: 34, lastContact: 'Email 18 Apr' },
  { id: 'd6', student: 'Anesu Matanhire',  form: '4A',       outstanding:   450, daysOverdue: 22, lastContact: 'SMS 21 Apr' },
];

export default function FeesPage() {
  const collectionRate = Math.round((COLLECTED / TARGET) * 100);
  const sumByMethod = BY_METHOD.reduce((s, m) => s + m.amount, 0);
  const totalByForm = BY_FORM.reduce(
    (acc, f) => ({
      invoiced: acc.invoiced + f.invoiced,
      collected: acc.collected + f.collected,
    }),
    { invoiced: 0, collected: 0 },
  );
  const dailyMax = Math.max(...DAILY_COLLECTION.map((d) => d.amount));
  const fmt = (n: number) => `$${n.toLocaleString('en-ZW')}`;

  return (
    <div className="space-y-8">
      <ExecPageHeader
        eyebrow="Fees"
        title="Fees monitoring"
        subtitle={`Term 2, 2026 · ${fmt(COLLECTED)} collected of ${fmt(
          TARGET,
        )} target · ${collectionRate}% collection rate`}
        right={
          <Link
            href="/admin/fees"
            className="inline-flex h-10 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-earth hover:bg-sand-light"
          >
            Open bursar ledger
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          </Link>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KPICard
          label="Total invoiced"
          value={fmt(TARGET)}
          deltaLabel="Term 2 · full enrolment"
          trend="flat"
        />
        <KPICard
          label="Collected"
          value={fmt(COLLECTED)}
          deltaLabel={`${collectionRate}% of target`}
          trend="up"
        />
        <KPICard
          label="Outstanding"
          value={fmt(OUTSTANDING)}
          deltaLabel={`${AGEING[3]!.invoices} invoices over 60 days`}
          trend="down"
        />
        <KPICard
          label="Avg days to settle"
          value="18"
          deltaLabel="−4 vs last term"
          trend="down-good"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Daily collection bar chart */}
        <Panel
          className="lg:col-span-3"
          title="Daily collection · last 14 days"
          sub="All methods combined · weekends skipped"
        >
          <div className="mt-2 flex items-end gap-2" style={{ height: 180 }}>
            {DAILY_COLLECTION.map((d, i) => {
              const h = (d.amount / dailyMax) * 100;
              const isLast = i === DAILY_COLLECTION.length - 1;
              return (
                <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                  <span className="font-mono text-[10px] tabular-nums text-stone">
                    ${(d.amount / 1000).toFixed(0)}k
                  </span>
                  <div
                    className={[
                      'w-full rounded-t',
                      isLast ? 'bg-terracotta' : 'bg-earth/60',
                    ].join(' ')}
                    style={{ height: `${h}%` }}
                    aria-label={`${d.date}: $${d.amount}`}
                  />
                  <span className="font-mono text-[10px] tabular-nums text-stone">{d.date}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 rounded bg-sand-light/60 p-3 font-sans text-[12px] text-stone">
            Collection accelerated mid-term as the first-instalment deadline approached. The 22 Apr
            peak is the largest single-day volume this term ($22.5k), driven by the Form 4 parent
            evening reminder.
          </div>
        </Panel>

        {/* By method */}
        <Panel className="lg:col-span-2" title="By method" sub="Term 2 · share of collections">
          <ul className="space-y-2 pt-2">
            {BY_METHOD.map((m) => {
              const pct = Math.round((m.amount / sumByMethod) * 100);
              return (
                <li key={m.label}>
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-[13px] text-ink">{m.label}</span>
                    <span className="font-mono text-[12px] tabular-nums text-stone">
                      {fmt(m.amount)}{' '}
                      <span className="text-[11px] text-stone">({pct}%)</span>
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-sand">
                    <div
                      className={['h-full rounded-full', m.color].join(' ')}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 font-sans text-[12px] text-stone">
            Mobile money combined is the largest channel (51%). Bank transfers and slips (43%)
            still matter for boarders and rural families without smartphones.
          </p>
        </Panel>
      </div>

      {/* Ageing receivables + by form */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Ageing receivables" sub="As at today · $ outstanding">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-sand-light/40 text-left">
                  <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                    Bucket
                  </th>
                  <th className="px-4 py-3 text-right font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                    Invoices
                  </th>
                  <th className="px-4 py-3 text-right font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                    Outstanding
                  </th>
                  <th className="px-4 py-3 text-right font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                    % of outstanding
                  </th>
                  <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                    Share
                  </th>
                </tr>
              </thead>
              <tbody>
                {AGEING.map((a) => {
                  const tone =
                    a.bucket === '0–7 days'
                      ? 'bg-ok'
                      : a.bucket === '8–30 days'
                      ? 'bg-earth'
                      : a.bucket === '31–60 days'
                      ? 'bg-ochre'
                      : 'bg-danger';
                  return (
                    <tr key={a.bucket} className="border-t border-sand-light">
                      <td className="px-4 py-3 font-sans font-medium text-ink">{a.bucket}</td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-ink">
                        {a.invoices}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-ink">
                        {fmt(a.amount)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-stone">
                        {a.pct}%
                      </td>
                      <td className="w-[40%] min-w-[150px] px-4 py-3">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-sand">
                          <div
                            className={['h-full rounded-full', tone].join(' ')}
                            style={{ width: `${a.pct}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-4 flex items-start gap-2 rounded bg-[#FDF4E3] px-3 py-2 font-sans text-[12px] text-[#92650B]">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-none" strokeWidth={1.5} aria-hidden />
            Nine invoices sit past 60 days — a small number but concentrated across three
            families. The bursar has escalated to the Administrator for review.
          </p>
        </Panel>

        <Panel
          title="Collection by year group"
          sub={`$${(totalByForm.collected / 1000).toFixed(0)}k of $${(totalByForm.invoiced / 1000).toFixed(0)}k across all forms`}
        >
          <div className="space-y-1 pt-2">
            {BY_FORM.map((f) => {
              const pct = Math.round((f.collected / f.invoiced) * 100);
              return (
                <ChartBar
                  key={f.form}
                  label={f.form}
                  value={pct}
                  tone={pct >= 60 ? 'good' : pct >= 40 ? 'default' : 'warn'}
                  sub={`${pct}% · $${(f.collected / 1000).toFixed(0)}k`}
                />
              );
            })}
          </div>
          <p className="mt-4 font-sans text-[12px] text-stone">
            Form 6 trails at 21% — parent evening is scheduled for 10 May to address the gap.
          </p>
        </Panel>
      </div>

      {/* Top debtors */}
      <Panel
        title="Top debtors"
        sub="Highest outstanding balances · ordered by days overdue"
        href="/admin/fees"
        hrefLabel="Full ledger in bursary"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-sand-light/40 text-left">
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Student
                </th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Form
                </th>
                <th className="px-4 py-3 text-right font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Outstanding
                </th>
                <th className="px-4 py-3 text-right font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Days overdue
                </th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Last contact
                </th>
              </tr>
            </thead>
            <tbody>
              {TOP_DEBTORS.map((d) => {
                const tone =
                  d.daysOverdue >= 60
                    ? 'text-danger'
                    : d.daysOverdue >= 30
                    ? 'text-[#92650B]'
                    : 'text-ink';
                return (
                  <tr key={d.id} className="border-t border-sand-light">
                    <td className="px-4 py-3 font-sans font-medium text-ink">{d.student}</td>
                    <td className="px-4 py-3 font-mono tabular-nums text-stone">{d.form}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-ink">
                      {fmt(d.outstanding)}
                    </td>
                    <td className={['px-4 py-3 text-right font-mono tabular-nums', tone].join(' ')}>
                      {d.daysOverdue}
                    </td>
                    <td className="px-4 py-3 font-sans text-[12px] text-stone">{d.lastContact}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <aside className="rounded border border-sand bg-sand-light/60 px-6 py-5">
        <p className="flex items-center gap-2 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
          <Banknote className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          What the Administrator sees vs what the bursar runs
        </p>
        <p className="mt-2 max-w-[80ch] font-serif text-[15px] leading-relaxed text-ink">
          This page is monitoring-only. Issuing invoices, reviewing bank slips, reconciling against
          statements and writing receipts all happen in the bursar&rsquo;s module (
          <Link
            href="/admin/fees"
            className="text-terracotta underline underline-offset-4 hover:text-earth"
          >
            Bursar → Fees Ledger
          </Link>
          ). Waivers and exceptional extensions still require Administrator sign-off and appear
          as <Link href="/headmaster/alerts" className="text-terracotta underline underline-offset-4 hover:text-earth">decisions</Link>.
        </p>
      </aside>
    </div>
  );
}

function Panel({
  title,
  sub,
  href,
  hrefLabel,
  className,
  children,
}: {
  title: string;
  sub?: string;
  href?: string;
  hrefLabel?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={['rounded border border-sand bg-white p-5', className ?? ''].join(' ')}>
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-sand pb-3">
        <div>
          <h2 className="font-display text-[18px] tracking-tight text-ink">{title}</h2>
          {sub ? <p className="mt-0.5 font-sans text-[12px] text-stone">{sub}</p> : null}
        </div>
        {href && hrefLabel ? (
          <Link
            href={href}
            className="inline-flex items-center gap-1 font-sans text-[12px] font-medium text-terracotta hover:text-earth"
          >
            {hrefLabel}
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          </Link>
        ) : null}
      </header>
      <div className="pt-4">{children}</div>
    </section>
  );
}
