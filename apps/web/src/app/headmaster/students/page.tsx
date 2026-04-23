import Link from 'next/link';
import { AlertTriangle, ArrowUpRight, Eye, MessageSquare, UserCog } from 'lucide-react';

import { ChartBar, ExecPageHeader, KPICard } from '@/components/headmaster/primitives';
import {
  AT_RISK_MONTHLY,
  AT_RISK_RIBBON,
  AT_RISK_ROWS,
  FORM_AVERAGES,
  FT_LOAD,
  SCHOOL_STATE,
} from '@/lib/mock/headmaster-extras';

/**
 * Administrator · Students.
 *
 * Single destination for monitoring students across the school. Combines:
 *   - Attendance snapshot (today)
 *   - Performance by year group (ChartBar)
 *   - 12-month at-risk trend (bar chart)
 *   - At-risk register with owner + trigger + status
 *   - Form-teacher workload distribution
 */
export default function StudentsPage() {
  const attendancePct = SCHOOL_STATE.attendancePercent;
  const enrolment = SCHOOL_STATE.learnersTotal;
  const present = SCHOOL_STATE.learnersPresent;
  const absent = enrolment - present;

  return (
    <div className="space-y-8">
      <ExecPageHeader
        eyebrow="Students"
        title="Student monitoring"
        subtitle={`${enrolment.toLocaleString('en-ZW')} learners enrolled · ${present.toLocaleString(
          'en-ZW',
        )} present today (${attendancePct}%) · ${AT_RISK_RIBBON.onRegister} on the at-risk register.`}
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KPICard
          label="Enrolment"
          value={enrolment.toLocaleString('en-ZW')}
          deltaLabel="+14 new this term"
          trend="up"
        />
        <KPICard
          label="Present today"
          value={`${attendancePct}%`}
          deltaLabel={`${absent} absent / leave`}
          trend="flat"
        />
        <KPICard
          label="At-risk register"
          value={String(AT_RISK_RIBBON.onRegister)}
          deltaLabel={`down from ${AT_RISK_RIBBON.previous} last term`}
          trend="down-good"
        />
        <KPICard
          label="Recovered (30d)"
          value={String(AT_RISK_RIBBON.recovered30d)}
          deltaLabel="returned to above-threshold"
          trend="up"
        />
      </div>

      {/* Two-column — Performance by year group + at-risk monthly */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Panel className="lg:col-span-3" title="Performance by year group" sub="Term 2, 2026">
          <div className="space-y-1 pt-2">
            {FORM_AVERAGES.map((f) => (
              <ChartBar
                key={f.form}
                label={f.form}
                value={f.avg}
                tone={f.avg >= 78 ? 'good' : f.avg >= 72 ? 'default' : 'warn'}
                sub={`${f.avg.toFixed(1)}%`}
              />
            ))}
          </div>
          <div className="mt-5 rounded bg-sand-light/60 p-3 font-sans text-[12px] text-stone">
            Form 3 is 3.6pts below the school average; expect increased support from Deputy Head
            (Academic). Form 6 leads the school this term.
          </div>
        </Panel>

        <Panel className="lg:col-span-2" title="At-risk · 12-month trend" sub="Current month highlighted">
          <div className="mt-2 grid h-40 grid-cols-12 items-end gap-1">
            {AT_RISK_MONTHLY.map((m, i) => {
              const max = Math.max(...AT_RISK_MONTHLY.map((x) => x.count));
              const h = (m.count / max) * 100;
              const isLast = i === AT_RISK_MONTHLY.length - 1;
              return (
                <div key={m.month} className="flex flex-col items-center gap-1">
                  <span className="font-mono text-[10px] tabular-nums text-stone">{m.count}</span>
                  <div
                    className={[
                      'w-full rounded-t transition-all',
                      isLast ? 'bg-terracotta' : 'bg-earth/60',
                    ].join(' ')}
                    style={{ height: `${h}%` }}
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
          <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-sand pt-4 text-center">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone">Now</dt>
              <dd className="mt-1 font-display text-[22px] tabular-nums text-ink">
                {AT_RISK_RIBBON.onRegister}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone">New</dt>
              <dd className="mt-1 font-display text-[22px] tabular-nums text-danger">
                {AT_RISK_RIBBON.newThisWeek}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
                Cumulative
              </dt>
              <dd className="mt-1 font-display text-[22px] tabular-nums text-ink">
                {AT_RISK_RIBBON.cumulative}
              </dd>
            </div>
          </dl>
        </Panel>
      </div>

      {/* At-risk register */}
      <Panel title="At-risk register" sub={`${AT_RISK_ROWS.length} students · owned by form teacher or DSL`}>
        <div className="-mx-5 overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-sand-light/40 text-left">
                <th className="px-5 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Student
                </th>
                <th className="px-3 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Form
                </th>
                <th className="px-3 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Trigger
                </th>
                <th className="px-3 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Since
                </th>
                <th className="px-3 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Owner
                </th>
                <th className="px-3 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Status
                </th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody>
              {AT_RISK_ROWS.map((r) => (
                <tr key={r.id} className="border-t border-sand-light">
                  <td className="px-5 py-3 font-sans font-medium text-ink">
                    {r.studentName}
                    {r.cumulative ? (
                      <span className="ml-2 rounded-sm bg-[#FBEBEA] px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#B0362A]">
                        cumulative
                      </span>
                    ) : null}
                  </td>
                  <td className="px-3 py-3 font-mono tabular-nums text-stone">{r.form}</td>
                  <td className="px-3 py-3 font-sans text-ink">{r.trigger}</td>
                  <td className="px-3 py-3 font-mono text-[12px] tabular-nums text-stone">{r.since}</td>
                  <td className="px-3 py-3">
                    <span className="font-sans text-ink">{r.owner}</span>
                    <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.08em] text-stone">
                      {r.ownerRole}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    {r.underReview ? (
                      <span className="inline-flex items-center rounded-sm bg-[#FDF4E3] px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#92650B]">
                        under review
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-sm bg-sand px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-earth">
                        monitoring
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        aria-label="View case"
                        className="rounded p-1.5 text-stone hover:bg-sand hover:text-ink"
                      >
                        <Eye className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                      <button
                        type="button"
                        aria-label="Message owner"
                        className="rounded p-1.5 text-stone hover:bg-sand hover:text-ink"
                      >
                        <MessageSquare className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* FT load */}
      <Panel
        title="Form-teacher workload"
        sub="Where is the pastoral load concentrated?"
        href="/headmaster/teachers"
        hrefLabel="Open teachers"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-sand-light/40 text-left">
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Form teacher
                </th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Form
                </th>
                <th className="px-4 py-3 text-right font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  On register
                </th>
                <th className="px-4 py-3 text-right font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Under review
                </th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Distribution
                </th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Note
                </th>
              </tr>
            </thead>
            <tbody>
              {FT_LOAD.map((row) => {
                const load = row.atRisk + row.underReview;
                const max = Math.max(...FT_LOAD.map((x) => x.atRisk + x.underReview));
                const pct = (load / max) * 100;
                return (
                  <tr key={row.ft} className="border-t border-sand-light">
                    <td className="px-4 py-3 font-sans font-medium text-ink">{row.ft}</td>
                    <td className="px-4 py-3 font-mono tabular-nums text-stone">{row.form}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-ink">
                      {row.atRisk}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-ink">
                      {row.underReview}
                    </td>
                    <td className="px-4 py-3 w-[36%] min-w-[160px]">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-sand">
                        <div
                          className={[
                            'h-full rounded-full',
                            load >= 5 ? 'bg-danger' : load >= 3 ? 'bg-ochre' : 'bg-earth',
                          ].join(' ')}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-sans text-[12px] text-stone">
                      {row.notes || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Methodology aside */}
      <aside className="rounded border border-sand bg-sand-light/60 px-6 py-5">
        <p className="flex items-center gap-2 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
          <AlertTriangle className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          How a student gets on the register
        </p>
        <p className="mt-2 max-w-[80ch] font-serif text-[15px] leading-relaxed text-ink">
          A student joins the at-risk register when one of four triggers fires: an average drop
          exceeding 10 points over three consecutive assessments, attendance below 80%, three
          consecutive non-submissions, or a parent or staff concern. The form teacher owns the case
          by default; safeguarding concerns transfer to the DSL immediately.
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
