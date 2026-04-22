import { ExecPageHeader, KPICard, Sparkline } from '@/components/headmaster/primitives';
import {
  AT_RISK_MONTHLY,
  AT_RISK_RIBBON,
  AT_RISK_ROWS,
  FT_LOAD,
} from '@/lib/mock/headmaster-extras';

/**
 * At-Risk Register — §07.
 *
 * Private list. Access logged. No export without DSL + Deputy co-auth.
 * Students appear because their pattern has changed, not because of
 * judgment about who they are.
 */
export default function AtRiskPage() {
  return (
    <div className="space-y-8">
      <ExecPageHeader
        eyebrow="At-risk register"
        title="Students whose pattern has changed for the worse."
        subtitle="Private · every drill-down logged · export requires DSL + Deputy co-authorisation"
      />

      {/* Ribbon */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KPICard label="On register"      value={AT_RISK_RIBBON.onRegister.toString()} deltaLabel={`down from ${AT_RISK_RIBBON.previous}`} trend="down-good" />
        <KPICard label="New this week"    value={AT_RISK_RIBBON.newThisWeek.toString()} deltaLabel="monitor" />
        <KPICard label="Cumulative"       value={AT_RISK_RIBBON.cumulative.toString()}  deltaLabel="multi-trigger" />
        <KPICard label="Recovered (30d)"  value={AT_RISK_RIBBON.recovered30d.toString()} deltaLabel="off register" trend="up" />
      </div>

      {/* Register table */}
      <section className="rounded border border-sand bg-white">
        <div className="flex items-center justify-between border-b border-sand px-6 py-4">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
            Active register
          </p>
          <span className="font-sans text-[12px] text-stone">
            Headmaster communicates via form teacher / Deputy / DSL — not directly to students
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="bg-sand-light/40 text-left">
                <th className="px-6 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">Student</th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">Form</th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">Trigger(s)</th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">Since</th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">Owner</th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">Status</th>
                <th className="w-56 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {AT_RISK_ROWS.map((r) => (
                <tr key={r.id} className="border-t border-sand-light hover:bg-sand-light/40">
                  <td className="px-6 py-3 font-sans font-medium text-ink">
                    {r.studentName}
                    {r.cumulative ? (
                      <span className="ml-2 inline-flex items-center rounded-sm bg-[#FBEBEA] px-1.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-danger">
                        Cumulative
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 font-sans text-[13px] text-stone">{r.form}</td>
                  <td className="px-4 py-3 font-serif text-[13px] text-ink">{r.trigger}</td>
                  <td className="px-4 py-3 font-sans text-[13px] text-stone">{r.since}</td>
                  <td className="px-4 py-3 font-sans text-[13px] text-stone">
                    {r.owner} <span className="text-stone">({r.ownerRole})</span>
                  </td>
                  <td className="px-4 py-3">
                    {r.underReview ? (
                      <span className="inline-flex items-center rounded-sm bg-[#FDF4E3] px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#92650B]">
                        under review
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-sm bg-sand-light px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                        monitoring
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button className="inline-flex h-8 items-center rounded border border-sand bg-white px-2.5 font-sans text-[11px] font-medium text-earth hover:bg-sand-light">
                        Open
                      </button>
                      <button className="inline-flex h-8 items-center rounded border border-sand bg-white px-2.5 font-sans text-[11px] font-medium text-earth hover:bg-sand-light">
                        Brief FT
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Monthly trend */}
      <section className="rounded border border-sand bg-white p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
              At-risk register — monthly trend
            </p>
            <p className="mt-1 font-sans text-[13px] text-stone">
              Active count at month-end · last 12 months
            </p>
          </div>
          <Sparkline values={AT_RISK_MONTHLY.map((m) => m.count)} width={320} height={80} />
        </div>
        <div className="mt-5 flex items-end gap-1">
          {AT_RISK_MONTHLY.map((m) => {
            const max = Math.max(...AT_RISK_MONTHLY.map((x) => x.count));
            const h = (m.count / max) * 80;
            return (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                <span className="font-mono text-[11px] tabular-nums text-stone">{m.count}</span>
                <div
                  className={`w-full rounded-t transition-all hover:bg-terracotta ${m.month.startsWith('Apr 2026') ? 'bg-terracotta' : 'bg-earth/70'}`}
                  style={{ height: `${h}px` }}
                />
                <span className="text-[10px] text-stone">{m.month.split(' ')[0]}</span>
              </div>
            );
          })}
        </div>
        <p className="mt-5 font-serif text-[13px] leading-relaxed text-stone">
          Mid-term spikes (May–Jun, Oct–Nov) reflect assessment-heavy periods. Post-break lows
          (Aug, Dec) reflect the fresh-start effect. Term-start elevation (Jan, Feb) reflects
          settling-in challenges. Current level is within seasonal expectation.
        </p>
      </section>

      {/* Form teacher load */}
      <section className="rounded border border-sand bg-white">
        <div className="border-b border-sand px-6 py-4">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
            Form-teacher pastoral load
          </p>
          <p className="mt-1 font-sans text-[13px] text-stone">
            Redistribute or support before burnout
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="bg-sand-light/40 text-left">
                <th className="px-6 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">Form teacher</th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">Form</th>
                <th className="px-4 py-3 text-right font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">At-risk</th>
                <th className="px-4 py-3 text-right font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">Under review</th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">Notes</th>
              </tr>
            </thead>
            <tbody>
              {FT_LOAD.map((r) => (
                <tr key={r.ft} className="border-t border-sand-light">
                  <td className="px-6 py-3 font-sans font-medium text-ink">{r.ft}</td>
                  <td className="px-4 py-3 font-sans text-[13px] text-stone">{r.form}</td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-ink">{r.atRisk}</td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-stone">{r.underReview}</td>
                  <td className="px-4 py-3 font-serif text-[13px] text-stone">
                    {r.notes ? r.notes : <span className="text-stone/60">—</span>}
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
