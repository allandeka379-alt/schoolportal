import { ChartBar, ExecPageHeader, HMStatusBadge, KPICard } from '@/components/headmaster/primitives';
import { INITIATIVES, KEY_RESULTS, OBJECTIVES } from '@/lib/mock/headmaster-extras';

/**
 * Strategic Goals & OKRs — §11.
 *
 * Everything here is about teaching, learning, and pastoral quality.
 * Finance, plant, enrolment live elsewhere.
 */
export default function StrategicGoalsPage() {
  const complete = OBJECTIVES.filter((o) => o.state === 'complete').length;
  const onTrack = OBJECTIVES.filter((o) => o.state === 'on-track').length;
  const atRisk = OBJECTIVES.filter((o) => o.state === 'at-risk').length;

  return (
    <div className="space-y-8">
      <ExecPageHeader
        eyebrow="Strategic goals · quarterly"
        title="Are we on course academically?"
        subtitle="Annual academic objectives · weekly SLT check-ins · quarterly Board review"
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KPICard label="Objectives set" value={OBJECTIVES.length.toString()} deltaLabel="FY 2025–26" />
        <KPICard label="Complete"       value={complete.toString()}          deltaLabel="ahead of schedule" trend="up" />
        <KPICard label="On track"        value={onTrack.toString()}           deltaLabel="weekly check-ins" />
        <KPICard label="At risk"         value={atRisk.toString()}            deltaLabel="needs discussion" trend="down" />
      </div>

      {/* Objective progress */}
      <section className="rounded border border-sand bg-white">
        <div className="border-b border-sand px-6 py-4">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
            Objective completion · Q2 checkpoint
          </p>
          <p className="mt-1 font-sans text-[13px] text-stone">
            Tracked toward end-of-year · per-objective owner visible
          </p>
        </div>
        <ul className="divide-y divide-sand-light">
          {OBJECTIVES.map((o) => (
            <li key={o.id} className="px-6 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-sans text-[14px] font-medium text-ink">{o.title}</p>
                  <p className="mt-0.5 font-sans text-[12px] text-stone">
                    {o.sub} · owner {o.owner}
                  </p>
                </div>
                <HMStatusBadge
                  state={
                    o.state === 'complete'
                      ? 'complete'
                      : o.state === 'on-track'
                      ? 'on-track'
                      : 'at-risk'
                  }
                />
                <span className="w-16 text-right font-mono text-[13px] tabular-nums text-ink">
                  {o.progressPercent}%
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-sm bg-sand">
                <div
                  className={[
                    'h-full transition-all duration-300 ease-out-soft',
                    o.state === 'complete'
                      ? 'bg-[#4F3E99]'
                      : o.state === 'on-track'
                      ? 'bg-ok'
                      : 'bg-danger',
                  ].join(' ')}
                  style={{ width: `${o.progressPercent}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Key results table */}
      <section className="rounded border border-sand bg-white">
        <div className="border-b border-sand px-6 py-4">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
            Key results · Q2 2026
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="bg-sand-light/40 text-left">
                <th className="px-6 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Key result
                </th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Target
                </th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Current
                </th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {KEY_RESULTS.map((kr) => (
                <tr key={kr.label} className="border-t border-sand-light">
                  <td className="px-6 py-3 font-sans font-medium text-ink">{kr.label}</td>
                  <td className="px-4 py-3 font-mono text-[13px] tabular-nums text-stone">{kr.target}</td>
                  <td className="px-4 py-3 font-mono text-[13px] tabular-nums text-ink">{kr.current}</td>
                  <td className="px-4 py-3">
                    <HMStatusBadge state={kr.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Initiatives */}
      <section className="rounded border border-sand bg-white">
        <div className="border-b border-sand px-6 py-4">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
            Major academic initiatives
          </p>
          <p className="mt-1 font-sans text-[13px] text-stone">
            Curricular redesigns, new programme launches, pedagogical experiments
          </p>
        </div>
        <div className="space-y-1 px-6 py-5">
          {INITIATIVES.map((i) => (
            <ChartBar
              key={i.name}
              label={`${i.name} — ${i.owner}`}
              value={i.percent}
              tone={
                i.status === 'Active'
                  ? 'default'
                  : i.status === 'Planning'
                  ? 'warn'
                  : i.status === 'Early stage'
                  ? 'warn'
                  : 'good'
              }
              sub={`${i.percent}% · ${i.status}`}
            />
          ))}
        </div>
        <div className="border-t border-sand bg-sand-light/40 px-6 py-3">
          <p className="font-sans text-[12px] text-stone">
            Financial and construction elements of these initiatives, where relevant, live in the
            Business Manager&rsquo;s system — not here.
          </p>
        </div>
      </section>
    </div>
  );
}
