'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Check, CheckCircle2, ChevronRight } from 'lucide-react';

import { ChartBar, ExecPageHeader, KPICard, Sparkline } from '@/components/headmaster/primitives';
import {
  AT_RISK_MONTHLY,
  AT_RISK_RIBBON,
  COHORT_TREND,
  FORM_AVERAGES,
  HEAD_ALERTS,
  SCHOOL_STATE,
  SUBJECT_AVERAGES,
  TEACHING_KPIS,
} from '@/lib/mock/headmaster-extras';

type Term = 'term-2-26' | 'term-1-26' | 'term-3-25';
const TERM_LABELS: Record<Term, string> = {
  'term-2-26': 'Term 2, 2026',
  'term-1-26': 'Term 1, 2026',
  'term-3-25': 'Term 3, 2025',
};

/**
 * Administrator · Overview.
 *
 * Interactive executive dashboard. Term filter nudges all figures.
 * Alerts strip supports inline acknowledge. Click-through to focus-area
 * pages via shortcut buttons.
 */
export default function OverviewPage() {
  const [term, setTerm] = useState<Term>('term-2-26');
  const [acked, setAcked] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const filterShift = useMemo(() => {
    if (term === 'term-1-26') return -1.2;
    if (term === 'term-3-25') return -2.1;
    return 0;
  }, [term]);

  const schoolAverage = (COHORT_TREND.at(-1)?.avg ?? 76.2) + filterShift;
  const schoolAverageFrom = COHORT_TREND[0]?.avg ?? 70.2;
  const passRate = Math.max(70, Math.min(92, 84 + filterShift));
  const feesCollected = term === 'term-2-26' ? 184_320 : term === 'term-1-26' ? 461_980 : 456_200;
  const feesTarget = term === 'term-2-26' ? 480_320 : term === 'term-1-26' ? 472_100 : 458_700;
  const feesCollectedPct = Math.round((feesCollected / feesTarget) * 100);
  const enrolment = SCHOOL_STATE.learnersTotal;
  const present = SCHOOL_STATE.learnersPresent;
  const teachingStaff = 68;
  const onLeave = 2;

  const visibleAlerts = HEAD_ALERTS.filter((a) => !acked.has(a.id));
  const urgentCount = visibleAlerts.filter((a) => a.urgent).length;

  function acknowledge(id: string) {
    setAcked((curr) => {
      const next = new Set(curr);
      next.add(id);
      return next;
    });
    setToast('Alert acknowledged');
  }

  function acknowledgeAll() {
    setAcked(new Set(HEAD_ALERTS.map((a) => a.id)));
    setToast('All alerts acknowledged');
  }

  return (
    <div className="space-y-8">
      <ExecPageHeader
        eyebrow={`${SCHOOL_STATE.dateLabel} · ${SCHOOL_STATE.termLabel}`}
        title="Overview"
        subtitle={`${present.toLocaleString('en-ZW')} of ${enrolment.toLocaleString(
          'en-ZW',
        )} learners present · ${SCHOOL_STATE.attendancePercent}%. School is ${SCHOOL_STATE.status}.`}
        right={
          <Link
            href="/headmaster/reports"
            className="inline-flex h-10 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-earth hover:bg-sand-light"
          >
            Open reports
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          </Link>
        }
      />

      {/* Term selector */}
      <div className="flex items-center gap-2 rounded border border-sand bg-white p-1 font-sans text-[12px] font-medium w-fit">
        {(Object.keys(TERM_LABELS) as Term[]).map((k) => {
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
              {TERM_LABELS[k]}
            </button>
          );
        })}
      </div>

      {/* Headline KPI row */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <KPICard
          label="Students · school average"
          value={`${schoolAverage.toFixed(1)}%`}
          deltaLabel={`+${(schoolAverage - schoolAverageFrom).toFixed(1)} pts over 6 terms`}
          trend="up"
          size="lg"
        />
        <KPICard
          label="Teachers · on duty today"
          value={`${teachingStaff - onLeave}/${teachingStaff}`}
          deltaLabel={`${onLeave} on leave · CPD 91% on track`}
          trend="flat"
          size="lg"
        />
        <KPICard
          label="Fees · collected"
          value={`$${(feesCollected / 1000).toFixed(0)}k`}
          deltaLabel={`${feesCollectedPct}% of $${(feesTarget / 1000).toFixed(0)}k target`}
          trend="up"
          size="lg"
        />
        <KPICard
          label="Pass rate · this term"
          value={`${passRate}%`}
          deltaLabel="+0.9 pp vs Term 1"
          trend="up"
          size="lg"
        />
      </div>

      {/* Chart grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel
          eyebrow="Students"
          title="Performance by year group"
          sub={`${TERM_LABELS[term]} · click-through for the full monitoring view`}
          href="/headmaster/students"
          hrefLabel="Open monitoring"
        >
          <div className="space-y-1 pt-3">
            {FORM_AVERAGES.map((f) => {
              const v = Math.max(50, Math.min(96, f.avg + filterShift));
              return (
                <ChartBar
                  key={f.form}
                  label={f.form}
                  value={v}
                  tone={v >= 78 ? 'good' : v >= 72 ? 'default' : 'warn'}
                  sub={`${v.toFixed(1)}%`}
                />
              );
            })}
          </div>
        </Panel>

        <Panel
          eyebrow="Academic"
          title="Whole-school trend"
          sub="Six-term moving average"
          href="/headmaster/academic"
          hrefLabel="Open academic"
        >
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="font-display text-[clamp(2.5rem,4vw,3.25rem)] leading-none tabular-nums text-ink">
                {schoolAverage.toFixed(1)}%
              </p>
              <p className="mt-2 font-sans text-[12px] text-stone">
                up from {schoolAverageFrom.toFixed(1)}% six terms ago
              </p>
            </div>
            <Sparkline
              values={COHORT_TREND.map((t) => t.avg + filterShift)}
              width={180}
              height={60}
            />
          </div>
          <ul className="mt-4 space-y-1.5 font-sans text-[12px]">
            {COHORT_TREND.map((t, i) => {
              const adj = t.avg + filterShift;
              const prev = COHORT_TREND[i - 1]?.avg;
              const delta = prev !== undefined ? adj - (prev + filterShift) : null;
              return (
                <li key={t.term} className="flex items-center justify-between">
                  <span className="text-stone">{t.term}</span>
                  <span className="font-mono tabular-nums text-ink">
                    {adj.toFixed(1)}%
                    {delta !== null ? (
                      <span
                        className={[
                          'ml-2 text-[11px]',
                          delta > 0 ? 'text-ok' : delta < 0 ? 'text-danger' : 'text-stone',
                        ].join(' ')}
                      >
                        {delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)}
                      </span>
                    ) : null}
                  </span>
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel
          eyebrow="Teachers"
          title="Quality of teaching"
          sub="CPD, walks, appraisal"
          href="/headmaster/teachers"
          hrefLabel="Open teachers"
        >
          <dl className="grid grid-cols-2 gap-4 pt-1">
            {TEACHING_KPIS.slice(0, 4).map((k) => (
              <div key={k.label}>
                <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-stone">
                  {k.label}
                </dt>
                <dd className="mt-1 font-display text-[26px] leading-none tabular-nums text-ink">
                  {k.value}
                </dd>
                <p className="mt-1 font-sans text-[11px] text-stone">{k.sub}</p>
              </div>
            ))}
          </dl>
          <div className="mt-5 border-t border-sand pt-3">
            <ChartBar label="CPD completion" value={91} tone="good" />
            <ChartBar label="Peer observation" value={74} tone="default" />
            <ChartBar label="Walks this term" value={18} max={40} tone="warn" sub="18 / 40" />
          </div>
        </Panel>

        <Panel
          eyebrow="Fees"
          title={`${TERM_LABELS[term].split(',')[0]} collection`}
          sub={`Target $${(feesTarget / 1000).toFixed(0)}k · all methods + banks`}
          href="/headmaster/fees"
          hrefLabel="Open fees"
        >
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="font-display text-[clamp(2.5rem,4vw,3.25rem)] leading-none tabular-nums text-ink">
                ${(feesCollected / 1000).toFixed(0)}k
              </p>
              <p className="mt-2 font-sans text-[12px] text-stone">
                {feesCollectedPct}% of target · $
                {((feesTarget - feesCollected) / 1000).toFixed(0)}k outstanding
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-stone">Target</p>
              <p className="font-mono text-[13px] tabular-nums text-ink">
                ${(feesTarget / 1000).toFixed(0)}k
              </p>
            </div>
          </div>
          <div className="mt-5">
            <ChartBar label="Mobile money" value={84} max={100} sub="46%" tone="default" />
            <ChartBar label="Bank transfer / slip" value={78} max={100} sub="42%" tone="default" />
            <ChartBar label="Cash / card" value={22} max={100} sub="12%" tone="default" />
          </div>
          <div className="mt-4 border-t border-sand pt-3 font-sans text-[12px] text-stone">
            Top outstanding: 9 invoices over 60 days · $4,420 on register
          </div>
        </Panel>
      </div>

      {/* At-risk + alerts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Panel
          className="lg:col-span-3"
          eyebrow="Students · attention"
          title="At-risk register"
          sub="12-month view · current month highlighted"
          href="/headmaster/students"
          hrefLabel="Open register"
        >
          <div className="mt-2 grid h-32 grid-cols-12 items-end gap-1">
            {AT_RISK_MONTHLY.map((m, i) => {
              const max = Math.max(...AT_RISK_MONTHLY.map((x) => x.count));
              const h = (m.count / max) * 100;
              const isLast = i === AT_RISK_MONTHLY.length - 1;
              return (
                <div key={m.month} className="relative flex flex-col items-center gap-1">
                  <span className="font-mono text-[10px] tabular-nums text-stone">{m.count}</span>
                  <div
                    className={[
                      'w-full rounded-t',
                      isLast ? 'bg-terracotta' : 'bg-earth/60',
                    ].join(' ')}
                    style={{ height: `${h}%` }}
                    aria-label={`${m.month}: ${m.count}`}
                  />
                </div>
              );
            })}
          </div>
          <ul className="mt-2 grid grid-cols-12 gap-1 font-mono text-[9px] uppercase tracking-[0.08em] text-stone">
            {AT_RISK_MONTHLY.map((m) => (
              <li key={m.month} className="truncate text-center">
                {m.month.split(' ')[0]}
              </li>
            ))}
          </ul>
          <dl className="mt-5 grid grid-cols-3 gap-4 border-t border-sand pt-4">
            <div>
              <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                On register now
              </dt>
              <dd className="mt-1 font-display text-[24px] tabular-nums text-ink">
                {AT_RISK_RIBBON.onRegister}
              </dd>
            </div>
            <div>
              <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                New this week
              </dt>
              <dd className="mt-1 font-display text-[24px] tabular-nums text-ink">
                {AT_RISK_RIBBON.newThisWeek}
              </dd>
            </div>
            <div>
              <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                Recovered (30d)
              </dt>
              <dd className="mt-1 font-display text-[24px] tabular-nums text-ok">
                {AT_RISK_RIBBON.recovered30d}
              </dd>
            </div>
          </dl>
        </Panel>

        <Panel
          className="lg:col-span-2"
          eyebrow="Alerts"
          title="Latest notifications"
          sub={`${urgentCount} urgent · ${visibleAlerts.length} open · acknowledge here to clear`}
          href="/headmaster/alerts"
          hrefLabel="Open alerts"
        >
          {visibleAlerts.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <CheckCircle2 className="h-8 w-8 text-ok" strokeWidth={1.5} aria-hidden />
              <p className="font-display text-[16px] text-ink">All clear.</p>
              <p className="font-sans text-[12px] text-stone">
                No open alerts. New ones will appear here.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-stone">
                  {urgentCount > 0 ? `${urgentCount} urgent` : 'No urgent items'}
                </span>
                <button
                  type="button"
                  onClick={acknowledgeAll}
                  className="font-mono text-[11px] uppercase tracking-[0.1em] text-earth hover:text-terracotta"
                >
                  Acknowledge all
                </button>
              </div>
              <ul className="-mx-1 divide-y divide-sand-light">
                {visibleAlerts.slice(0, 5).map((a) => (
                  <li key={a.id} className="group flex items-start gap-3 px-1 py-3">
                    <span
                      aria-hidden
                      className={[
                        'mt-1.5 h-2 w-2 flex-none rounded-full',
                        a.urgent ? 'bg-danger' : 'bg-earth',
                      ].join(' ')}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-sans text-[13px] text-ink">{a.message}</p>
                      <p className="mt-0.5 font-sans text-[11px] uppercase tracking-[0.1em] text-stone">
                        {a.category} · {a.ago}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Link
                        href={a.actionHref ?? '/headmaster/alerts'}
                        className="inline-flex h-7 items-center rounded border border-sand bg-white px-2 font-sans text-[11px] font-medium text-earth hover:bg-sand-light"
                      >
                        Open
                      </Link>
                      <button
                        type="button"
                        onClick={() => acknowledge(a.id)}
                        className="inline-flex h-7 items-center gap-1 rounded px-2 font-sans text-[11px] font-medium text-stone hover:text-ink"
                      >
                        <Check className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                        Ack
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Panel>
      </div>

      {/* Subject snapshot */}
      <Panel
        eyebrow="Academic · subjects"
        title="Subject averages · whole school"
        sub="Current term · compared against 3-year average"
        href="/headmaster/academic"
        hrefLabel="Open academic"
      >
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left">
              <th className="py-2 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                Subject
              </th>
              <th className="py-2 text-right font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                This term
              </th>
              <th className="py-2 text-right font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                3-year avg
              </th>
              <th className="py-2 text-right font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                Δ
              </th>
              <th className="py-2 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                Distribution
              </th>
            </tr>
          </thead>
          <tbody>
            {SUBJECT_AVERAGES.map((s) => {
              const adj = Math.max(50, Math.min(96, s.avg + filterShift));
              const delta = adj - s.threeYear;
              return (
                <tr key={s.code} className="border-t border-sand-light">
                  <td className="py-3">
                    <span className="font-sans font-medium text-ink">{s.name}</span>
                    <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.08em] text-stone">
                      {s.code}
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono tabular-nums text-ink">
                    {adj.toFixed(1)}%
                  </td>
                  <td className="py-3 text-right font-mono tabular-nums text-stone">
                    {s.threeYear.toFixed(1)}%
                  </td>
                  <td
                    className={[
                      'py-3 text-right font-mono tabular-nums',
                      delta > 0 ? 'text-ok' : delta < 0 ? 'text-danger' : 'text-stone',
                    ].join(' ')}
                  >
                    {delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)}
                  </td>
                  <td className="w-[40%] min-w-[160px] py-3">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-sand">
                      <div
                        className={[
                          'h-full rounded-full',
                          adj >= 78 ? 'bg-ok' : adj >= 72 ? 'bg-earth' : 'bg-ochre',
                        ].join(' ')}
                        style={{ width: `${adj}%` }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>

      {/* Morning brief */}
      <aside className="rounded border border-earth/30 bg-sand-light/70 px-6 py-5">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
          Morning brief · 07:00
        </p>
        <p className="mt-2 max-w-[80ch] font-serif text-[15px] leading-relaxed text-ink">
          Good morning. Two learning walks are scheduled today — Mrs Sithole in Mathematics 4B and
          Mr Ndaba in History 4A. Eighteen students sit on the at-risk register, two of them new
          this week. Term 2 fees sit at {feesCollectedPct}% of target; nine invoices are over 60
          days. Form 4 report cards remain pending your approval. Teacher on leave today: Ms
          Chikwangwana. School average holding at {schoolAverage.toFixed(1)}%; pass rate {passRate}%.
        </p>
      </aside>

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

function Panel({
  eyebrow,
  title,
  sub,
  href,
  hrefLabel,
  className,
  children,
}: {
  eyebrow?: string;
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
          {eyebrow ? (
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-earth">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-1 font-display text-[18px] tracking-tight text-ink">{title}</h2>
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
