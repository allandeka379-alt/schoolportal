import Link from 'next/link';
import { ArrowUpRight, Calendar, CheckCircle2, Clock } from 'lucide-react';

import { ChartBar, ExecPageHeader, KPICard } from '@/components/headmaster/primitives';
import {
  APPRAISAL_COMPLETION,
  FT_LOAD,
  LEARNING_WALKS,
  MATHS_CLASSES,
  TEACHING_KPIS,
} from '@/lib/mock/headmaster-extras';

/**
 * Administrator · Teachers.
 *
 * The teacher-performance dashboard. One page, clear answers to:
 *   - How many staff, how many on leave?
 *   - Is CPD on track across the year?
 *   - Are we observing enough lessons?
 *   - Is appraisal progressing, by department?
 *   - Where are the outliers (best and worst teachers by class average)?
 */
export default function TeachersPage() {
  const kpis = TEACHING_KPIS; // 5 tiles already match the exec register
  const appraisalSchoolTotal = APPRAISAL_COMPLETION.reduce(
    (acc, d) => ({ c: acc.c + d.complete, t: acc.t + d.total }),
    { c: 0, t: 0 },
  );
  const appraisalPct = Math.round((appraisalSchoolTotal.c / appraisalSchoolTotal.t) * 100);

  const sortedClasses = [...MATHS_CLASSES].sort((a, b) => b.avg - a.avg);
  const highest = sortedClasses.slice(0, 3);
  const lowest = [...sortedClasses].reverse().slice(0, 3);

  return (
    <div className="space-y-8">
      <ExecPageHeader
        eyebrow="Teachers"
        title="Teacher performance"
        subtitle="Staffing, CPD, observation, appraisal — one page. Click any department to drill into class-level performance."
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {kpis.map((k) => (
          <KPICard
            key={k.label}
            label={k.label}
            value={k.value}
            deltaLabel={k.sub}
            trend={k.trend}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Appraisal completion by department */}
        <Panel
          className="lg:col-span-3"
          title="Appraisal completion by department"
          sub={`${appraisalSchoolTotal.c} of ${appraisalSchoolTotal.t} staff · ${appraisalPct}% school-wide`}
        >
          <div className="pt-2">
            {APPRAISAL_COMPLETION.map((d) => {
              const pct = Math.round((d.complete / d.total) * 100);
              return (
                <ChartBar
                  key={d.dept}
                  label={d.dept}
                  value={pct}
                  tone={pct === 100 ? 'complete' : pct >= 80 ? 'good' : 'warn'}
                  sub={`${d.complete}/${d.total}`}
                />
              );
            })}
          </div>
          <div className="mt-5 rounded bg-sand-light/60 p-3 font-sans text-[12px] text-stone">
            Four departments sit below 90% — each has at least one appraisal interview outstanding.
            Deputy Head (Academic) to follow up this week.
          </div>
        </Panel>

        {/* CPD + walks progress */}
        <Panel className="lg:col-span-2" title="CPD · walks · observation" sub="This term">
          <div className="space-y-5 pt-2">
            <div>
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                CPD hours delivered
              </p>
              <p className="mt-1 font-display text-[28px] leading-none tabular-nums text-ink">
                1,640 <span className="text-[14px] text-stone">/ 2,720</span>
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-sand">
                <div className="h-full rounded-full bg-earth" style={{ width: `${(1640 / 2720) * 100}%` }} />
              </div>
            </div>
            <div>
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                Learning walks completed
              </p>
              <p className="mt-1 font-display text-[28px] leading-none tabular-nums text-ink">
                23 <span className="text-[14px] text-stone">/ 40</span>
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-sand">
                <div className="h-full rounded-full bg-ochre" style={{ width: `${(23 / 40) * 100}%` }} />
              </div>
            </div>
            <div>
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                Peer-observation participation
              </p>
              <p className="mt-1 font-display text-[28px] leading-none tabular-nums text-ink">
                74% <span className="text-[14px] text-stone">of 68 staff</span>
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-sand">
                <div className="h-full rounded-full bg-earth" style={{ width: `74%` }} />
              </div>
            </div>
          </div>
        </Panel>
      </div>

      {/* Learning walk schedule */}
      <Panel title="Learning walk schedule" sub="Upcoming and recently completed">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-sand-light/40 text-left">
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Walk #
                </th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Class
                </th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Teacher
                </th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Observer
                </th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  When
                </th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {LEARNING_WALKS.map((w) => (
                <tr key={w.id} className="border-t border-sand-light">
                  <td className="px-4 py-3 font-mono text-[12px] tabular-nums text-stone">
                    {w.id}
                  </td>
                  <td className="px-4 py-3 font-sans font-medium text-ink">{w.className}</td>
                  <td className="px-4 py-3 font-sans text-ink">{w.teacher}</td>
                  <td className="px-4 py-3 font-sans text-stone">{w.observer}</td>
                  <td className="px-4 py-3 font-sans text-[12px] text-stone">{w.date}</td>
                  <td className="px-4 py-3">
                    {w.status === 'complete' ? (
                      <span className="inline-flex items-center gap-1 rounded-sm bg-[#E6F0E9] px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2F7D4E]">
                        <CheckCircle2 className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                        complete
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-sm bg-sand-light px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-earth">
                        <Clock className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                        scheduled
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Class-level performance — best/worst */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Highest-performing classes" sub="Mathematics department — Term 2">
          <ol className="space-y-3 pt-2">
            {highest.map((c, i) => (
              <li
                key={c.label}
                className="flex items-center gap-3 rounded border border-sand bg-cream/40 px-4 py-3"
              >
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-sand-light font-mono text-[13px] font-semibold text-earth">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="font-sans font-medium text-ink">{c.label}</p>
                  <p className="font-sans text-[12px] text-stone">{c.teacher}</p>
                </div>
                <span className="font-display text-[22px] tabular-nums text-ok">
                  {c.avg.toFixed(1)}%
                </span>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="Needs attention" sub="Classes below the department mean">
          <ol className="space-y-3 pt-2">
            {lowest.map((c, i) => (
              <li
                key={c.label}
                className="flex items-center gap-3 rounded border border-sand bg-cream/40 px-4 py-3"
              >
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#FBEBEA] font-mono text-[13px] font-semibold text-[#B0362A]">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="font-sans font-medium text-ink">{c.label}</p>
                  <p className="font-sans text-[12px] text-stone">{c.teacher}</p>
                </div>
                <span className="font-display text-[22px] tabular-nums text-danger">
                  {c.avg.toFixed(1)}%
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-4 rounded bg-sand-light/60 p-3 font-sans text-[12px] text-stone">
            A single class average sitting 5+ points below the departmental mean triggers a
            learning-walk review. The Deputy Head (Academic) owns the follow-up.
          </p>
        </Panel>
      </div>

      {/* FT load shortcut */}
      <Panel
        title="Form-teacher workload"
        sub="Pastoral load by form teacher"
        href="/headmaster/students"
        hrefLabel="Full register"
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
                  At-risk
                </th>
                <th className="px-4 py-3 text-right font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Under review
                </th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Distribution
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
                    <td className="px-4 py-3 w-[40%] min-w-[160px]">
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
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
