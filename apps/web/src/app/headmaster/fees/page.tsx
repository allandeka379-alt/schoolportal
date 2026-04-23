'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  Banknote,
  Check,
  Clock,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  X,
} from 'lucide-react';

import { ChartBar, ExecPageHeader, KPICard } from '@/components/headmaster/primitives';

/**
 * Administrator · Fees.
 *
 *   - Term selector (Term 2 / Term 1 / Last year)
 *   - Method chips click into a transactions drawer
 *   - Top-debtor rows click into a debtor drawer with contact + actions
 */

type Term = 'term-2-26' | 'term-1-26' | 'term-3-25';

const TERMS: Record<Term, { label: string; target: number; collected: number }> = {
  'term-2-26': { label: 'Term 2, 2026', target: 480_320, collected: 184_320 },
  'term-1-26': { label: 'Term 1, 2026', target: 472_100, collected: 461_980 },
  'term-3-25': { label: 'Term 3, 2025', target: 458_700, collected: 456_200 },
};

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

const BY_METHOD: readonly {
  label: string;
  amount: number;
  color: string;
  sample: { ref: string; student: string; amount: number; date: string }[];
}[] = [
  {
    label: 'EcoCash',
    amount: 46_200,
    color: 'bg-earth',
    sample: [
      { ref: 'EC-87321', student: 'Chipo Banda', amount: 1650, date: '22 Apr 08:14' },
      { ref: 'EC-87298', student: 'Farai Moyo', amount: 450, date: '20 Apr 15:47' },
      { ref: 'EC-87215', student: 'Tanaka Moyo', amount: 45, date: '19 Apr 07:05' },
    ],
  },
  {
    label: 'OneMoney',
    amount: 22_800,
    color: 'bg-earth/80',
    sample: [
      { ref: 'OM-4421', student: 'Ruvimbo Sibanda', amount: 1650, date: '21 Apr 10:15' },
      { ref: 'OM-4418', student: 'Thandi Nkomo', amount: 900, date: '18 Apr 14:02' },
    ],
  },
  { label: 'InnBucks', amount: 15_200, color: 'bg-earth/60', sample: [] },
  { label: 'ZIPIT', amount: 12_460, color: 'bg-ochre', sample: [] },
  {
    label: 'CBZ transfer',
    amount: 41_500,
    color: 'bg-[#30527A]',
    sample: [{ ref: 'CBZ-9002', student: 'Farai Moyo', amount: 800, date: '22 Apr 14:02' }],
  },
  { label: 'Stanbic slip', amount: 19_300, color: 'bg-[#30527A]/80', sample: [] },
  { label: 'ZB / Steward slip', amount: 17_060, color: 'bg-[#30527A]/60', sample: [] },
  { label: 'Cash / card', amount: 9_800, color: 'bg-stone', sample: [] },
];

const AGEING: readonly { bucket: string; invoices: number; amount: number; pct: number }[] = [
  { bucket: '0–7 days', invoices: 112, amount: 68_420, pct: 62 },
  { bucket: '8–30 days', invoices: 48, amount: 29_120, pct: 26 },
  { bucket: '31–60 days', invoices: 16, amount: 8_800, pct: 8 },
  { bucket: 'Over 60 days', invoices: 9, amount: 4_420, pct: 4 },
];

const BY_FORM: readonly { form: string; invoiced: number; collected: number }[] = [
  { form: 'Form 1', invoiced: 68_000, collected: 34_300 },
  { form: 'Form 2', invoiced: 72_800, collected: 40_900 },
  { form: 'Form 3', invoiced: 78_400, collected: 27_600 },
  { form: 'Form 4', invoiced: 84_000, collected: 38_700 },
  { form: 'Form 5', invoiced: 80_400, collected: 22_800 },
  { form: 'Form 6', invoiced: 96_720, collected: 20_020 },
];

interface Debtor {
  id: string;
  student: string;
  form: string;
  outstanding: number;
  daysOverdue: number;
  lastContact: string;
  parent: string;
  phone: string;
  email: string;
  invoices: { ref: string; term: string; amount: number; due: string }[];
}

const TOP_DEBTORS: readonly Debtor[] = [
  {
    id: 'd1',
    student: 'Rudo Mutasa',
    form: '3 Blue',
    outstanding: 1_650,
    daysOverdue: 72,
    lastContact: 'SMS 12 Apr',
    parent: 'Mrs Mutasa',
    phone: '+263 77 123 4477',
    email: 'mutasa.parent@example.com',
    invoices: [
      { ref: 'INV-2026-T1-R.MUTASA', term: 'Term 1 2026', amount: 1_650, due: '31 Jan 2026' },
    ],
  },
  {
    id: 'd2',
    student: 'Tinashe Ncube',
    form: '3 Blue',
    outstanding: 1_450,
    daysOverdue: 68,
    lastContact: 'Call 10 Apr',
    parent: 'Mr Ncube',
    phone: '+263 77 884 2194',
    email: 'ncube.parent@example.com',
    invoices: [
      { ref: 'INV-2026-T1-T.NCUBE', term: 'Term 1 2026', amount: 1_450, due: '31 Jan 2026' },
    ],
  },
  {
    id: 'd3',
    student: 'Mazvita Ruzive',
    form: '4A',
    outstanding: 980,
    daysOverdue: 61,
    lastContact: 'SMS 16 Apr',
    parent: 'Mrs Ruzive',
    phone: '+263 71 200 3382',
    email: 'ruzive.parent@example.com',
    invoices: [
      { ref: 'INV-2026-T2-M.RUZIVE', term: 'Term 2 2026', amount: 980, due: '14 Mar 2026' },
    ],
  },
  {
    id: 'd4',
    student: 'Tapiwa Ndlovu',
    form: '4A',
    outstanding: 850,
    daysOverdue: 44,
    lastContact: 'Letter 14 Apr',
    parent: 'Mrs Ndlovu',
    phone: '+263 78 455 7190',
    email: 'ndlovu.parent@example.com',
    invoices: [
      { ref: 'INV-2026-T2-T.NDLOVU', term: 'Term 2 2026', amount: 850, due: '30 Mar 2026' },
    ],
  },
  {
    id: 'd5',
    student: 'Kundai Mashingaidze',
    form: '4A',
    outstanding: 720,
    daysOverdue: 34,
    lastContact: 'Email 18 Apr',
    parent: 'Mr Mashingaidze',
    phone: '+263 77 334 2104',
    email: 'mashingaidze.parent@example.com',
    invoices: [
      { ref: 'INV-2026-T2-K.MASH', term: 'Term 2 2026', amount: 720, due: '01 Apr 2026' },
    ],
  },
  {
    id: 'd6',
    student: 'Anesu Matanhire',
    form: '4A',
    outstanding: 450,
    daysOverdue: 22,
    lastContact: 'SMS 21 Apr',
    parent: 'Mrs Matanhire',
    phone: '+263 77 988 5500',
    email: 'matanhire.parent@example.com',
    invoices: [
      { ref: 'INV-2026-T2-A.MAT', term: 'Term 2 2026', amount: 450, due: '06 Apr 2026' },
    ],
  },
];

type MethodTab = (typeof BY_METHOD)[number]['label'];

export default function FeesPage() {
  const [term, setTerm] = useState<Term>('term-2-26');
  const [methodDrawer, setMethodDrawer] = useState<MethodTab | null>(null);
  const [debtor, setDebtor] = useState<Debtor | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const termData = TERMS[term];
  const target = termData.target;
  const collected = termData.collected;
  const outstanding = target - collected;
  const collectionRate = Math.round((collected / target) * 100);
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

  const activeMethod = methodDrawer
    ? BY_METHOD.find((m) => m.label === methodDrawer) ?? null
    : null;

  return (
    <div className="space-y-8">
      <ExecPageHeader
        eyebrow="Fees"
        title="Fees monitoring"
        subtitle={`${termData.label} · ${fmt(collected)} collected of ${fmt(
          target,
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

      {/* Term selector */}
      <div className="flex items-center gap-2 rounded border border-sand bg-white p-1 font-sans text-[12px] font-medium w-fit">
        {(Object.keys(TERMS) as Term[]).map((k) => {
          const active = term === k;
          return (
            <button
              key={k}
              type="button"
              onClick={() => setTerm(k)}
              className={[
                'rounded-sm px-3 py-1.5 transition-colors',
                active ? 'bg-ink text-cream' : 'text-stone hover:text-ink',
              ].join(' ')}
            >
              {TERMS[k].label}
            </button>
          );
        })}
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KPICard
          label="Total invoiced"
          value={fmt(target)}
          deltaLabel={`${termData.label} · full enrolment`}
          trend="flat"
        />
        <KPICard
          label="Collected"
          value={fmt(collected)}
          deltaLabel={`${collectionRate}% of target`}
          trend="up"
        />
        <KPICard
          label="Outstanding"
          value={fmt(outstanding)}
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

        {/* By method — click to drill */}
        <Panel
          className="lg:col-span-2"
          title="By method"
          sub={`${termData.label} · click a row to inspect`}
        >
          <ul className="space-y-2 pt-2">
            {BY_METHOD.map((m) => {
              const pct = Math.round((m.amount / sumByMethod) * 100);
              return (
                <li key={m.label}>
                  <button
                    type="button"
                    onClick={() => setMethodDrawer(m.label)}
                    className="group w-full rounded px-1 py-1 text-left hover:bg-sand-light/50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-[13px] text-ink group-hover:text-earth">
                        {m.label}
                      </span>
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
                  </button>
                </li>
              );
            })}
          </ul>
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
            Nine invoices sit past 60 days — the bursar has escalated to the Administrator for
            review.
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
        sub="Click a row for full invoice history + parent contact"
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
                  <tr
                    key={d.id}
                    onClick={() => setDebtor(d)}
                    className="cursor-pointer border-t border-sand-light hover:bg-sand-light/40"
                  >
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
          ). Waivers and exceptional extensions still require Administrator sign-off and appear as{' '}
          <Link
            href="/headmaster/alerts"
            className="text-terracotta underline underline-offset-4 hover:text-earth"
          >
            decisions
          </Link>
          .
        </p>
      </aside>

      {activeMethod ? (
        <MethodDrawer
          method={activeMethod}
          totalCollected={sumByMethod}
          onClose={() => setMethodDrawer(null)}
          onExport={() => setToast(`Exporting ${activeMethod.label} transactions · CSV`)}
        />
      ) : null}

      {debtor ? (
        <DebtorDrawer
          debtor={debtor}
          onClose={() => setDebtor(null)}
          onAction={(msg) => setToast(msg)}
        />
      ) : null}

      {toast ? (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full bg-ink px-4 py-2 font-sans text-[12px] font-semibold text-cream shadow-e3"
        >
          <Check className="mr-1 inline-block h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          {toast}
        </div>
      ) : null}
    </div>
  );
}

function MethodDrawer({
  method,
  totalCollected,
  onClose,
  onExport,
}: {
  method: (typeof BY_METHOD)[number];
  totalCollected: number;
  onClose: () => void;
  onExport: () => void;
}) {
  const pct = ((method.amount / totalCollected) * 100).toFixed(1);
  const fmt = (n: number) => `$${n.toLocaleString('en-ZW')}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-stretch justify-end bg-ink/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-xl flex-col overflow-hidden bg-white shadow-e3"
      >
        <div className="flex items-start justify-between gap-3 border-b border-sand px-6 py-4">
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
              Method
            </p>
            <h2 className="mt-1 font-display text-[22px] text-ink">{method.label}</h2>
            <p className="mt-0.5 font-sans text-[13px] text-stone">
              {fmt(method.amount)} · {pct}% of collections this term
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-2 text-stone transition-colors hover:bg-sand-light hover:text-ink"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {method.sample.length === 0 ? (
            <div className="rounded border border-dashed border-sand px-6 py-10 text-center">
              <p className="font-sans text-[14px] text-ink">
                Sample transactions not in demo data.
              </p>
              <p className="mt-1 font-sans text-[13px] text-stone">
                Open the bursar ledger for the full list by method.
              </p>
            </div>
          ) : (
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-sand-light/40 text-left">
                  <th className="px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-stone">
                    Reference
                  </th>
                  <th className="px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-stone">
                    Student
                  </th>
                  <th className="px-4 py-2 text-right font-mono text-[11px] uppercase tracking-[0.12em] text-stone">
                    Amount
                  </th>
                  <th className="px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-stone">
                    When
                  </th>
                </tr>
              </thead>
              <tbody>
                {method.sample.map((s) => (
                  <tr key={s.ref} className="border-t border-sand-light">
                    <td className="px-4 py-3 font-mono text-[12px] text-ink">{s.ref}</td>
                    <td className="px-4 py-3 font-sans text-ink">{s.student}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-ink">
                      {fmt(s.amount)}
                    </td>
                    <td className="px-4 py-3 font-mono text-[12px] text-stone">{s.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-sand bg-white px-6 py-4">
          <Link
            href={`/admin/receipts?method=${encodeURIComponent(method.label)}`}
            className="inline-flex h-9 items-center gap-1 font-mono text-[12px] font-medium uppercase tracking-[0.1em] text-earth hover:text-terracotta"
          >
            Open in bursar
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          </Link>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onExport}
              className="inline-flex h-10 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-earth hover:bg-sand-light"
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-stone hover:bg-sand-light"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DebtorDrawer({
  debtor,
  onClose,
  onAction,
}: {
  debtor: Debtor;
  onClose: () => void;
  onAction: (msg: string) => void;
}) {
  const fmt = (n: number) => `$${n.toLocaleString('en-ZW')}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-stretch justify-end bg-ink/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-2xl flex-col overflow-hidden bg-white shadow-e3"
      >
        <div className="flex items-start justify-between gap-3 border-b border-sand px-6 py-4">
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
              Debtor case
            </p>
            <h2 className="mt-1 font-display text-[24px] text-ink">{debtor.student}</h2>
            <p className="mt-0.5 font-sans text-[13px] text-stone">
              Form {debtor.form} · Parent: {debtor.parent}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-2 text-stone transition-colors hover:bg-sand-light hover:text-ink"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Headline */}
          <div className="grid grid-cols-3 gap-4 rounded border border-sand bg-sand-light/50 p-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
                Outstanding
              </p>
              <p className="mt-1 font-display text-[28px] leading-none tabular-nums text-danger">
                {fmt(debtor.outstanding)}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
                Days overdue
              </p>
              <p className="mt-1 font-display text-[28px] leading-none tabular-nums text-ink">
                {debtor.daysOverdue}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
                Last contact
              </p>
              <p className="mt-1 font-sans text-[15px] text-ink">{debtor.lastContact}</p>
            </div>
          </div>

          {/* Invoice list */}
          <section className="rounded border border-sand bg-white p-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-earth">
              Outstanding invoices
            </p>
            <ul className="mt-3 divide-y divide-sand-light">
              {debtor.invoices.map((inv) => (
                <li key={inv.ref} className="flex items-center gap-3 py-3">
                  <FileText
                    className="h-4 w-4 flex-none text-earth"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[13px] text-ink">{inv.ref}</p>
                    <p className="font-sans text-[12px] text-stone">
                      {inv.term} · due {inv.due}
                    </p>
                  </div>
                  <span className="font-mono text-[14px] tabular-nums text-ink">
                    {fmt(inv.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Contact */}
          <section className="rounded border border-sand bg-white p-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-earth">
              Parent contact
            </p>
            <dl className="mt-3 space-y-2 font-sans text-[13px]">
              <div className="flex items-center justify-between">
                <dt className="text-stone">Name</dt>
                <dd className="text-ink">{debtor.parent}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-stone">Phone</dt>
                <dd className="font-mono text-ink">{debtor.phone}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-stone">Email</dt>
                <dd className="font-mono text-ink">{debtor.email}</dd>
              </div>
            </dl>
          </section>

          {/* Actions */}
          <section className="rounded border border-sand bg-white p-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-earth">
              Actions
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onAction(`SMS sent to ${debtor.parent}`)}
                className="inline-flex h-9 items-center gap-1.5 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
              >
                <MessageSquare className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                Send SMS reminder
              </button>
              <button
                type="button"
                onClick={() => onAction(`Email sent to ${debtor.email}`)}
                className="inline-flex h-9 items-center gap-1.5 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
              >
                <Mail className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                Send email
              </button>
              <button
                type="button"
                onClick={() => onAction(`Call logged · ${debtor.phone}`)}
                className="inline-flex h-9 items-center gap-1.5 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
              >
                <Phone className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                Log a call
              </button>
              <button
                type="button"
                onClick={() =>
                  onAction(`Payment plan draft queued for bursar · ${debtor.student}`)
                }
                className="inline-flex h-9 items-center gap-1.5 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
              >
                <Clock className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                Offer payment plan
              </button>
              <button
                type="button"
                onClick={() =>
                  onAction(`Waiver request raised for ${debtor.student} — pending review`)
                }
                className="inline-flex h-9 items-center gap-1.5 rounded border border-[#FDF4E3] bg-[#FDF4E3] px-3 font-sans text-[12px] font-medium text-[#92650B] hover:bg-[#F6EAD0]"
              >
                Escalate waiver decision
              </button>
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between border-t border-sand bg-white px-6 py-4">
          <p className="font-sans text-[12px] text-stone">
            Contact logs appear in the bursar audit trail within 5 minutes.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-earth hover:bg-sand-light"
          >
            Close
          </button>
        </div>
      </div>
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
