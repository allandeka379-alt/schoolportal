import { ChartBar, ExecPageHeader, KPICard } from '@/components/headmaster/primitives';
import { APPRAISAL_COMPLETION, LEARNING_WALKS, TEACHING_KPIS } from '@/lib/mock/headmaster-extras';

/**
 * Teaching Quality & Staff Performance — §08.
 *
 * Multiple imperfect signals — the Headmaster's judgment is through
 * conversation. The portal surfaces patterns.
 */
export default function TeachingQualityPage() {
  const complete = LEARNING_WALKS.filter((w) => w.status === 'complete');
  const scheduled = LEARNING_WALKS.filter((w) => w.status === 'scheduled');

  return (
    <div className="space-y-8">
      <ExecPageHeader
        eyebrow="Teaching quality"
        title="Patterns, surfaced in the service of conversation."
        subtitle="The portal surfaces signals. A dashboard cannot appraise a teacher — only a professional, supportive, face-to-face dialogue can."
      />

      {/* KPI ribbon */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {TEACHING_KPIS.map((k) => (
          <KPICard key={k.label} label={k.label} value={k.value} deltaLabel={k.sub} trend={k.trend} />
        ))}
      </div>

      {/* Appraisal completion */}
      <section className="rounded border border-sand bg-white">
        <div className="border-b border-sand px-6 py-4">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
            Appraisal completion by department
          </p>
          <p className="mt-1 font-sans text-[13px] text-stone">
            Cycle 2025–26 · 68 staff across 11 departments
          </p>
        </div>
        <div className="space-y-1 px-6 py-5">
          {APPRAISAL_COMPLETION.map((d) => (
            <ChartBar
              key={d.dept}
              label={d.dept}
              value={(d.complete / d.total) * 100}
              tone={d.complete === d.total ? 'good' : d.complete >= d.total * 0.8 ? 'default' : 'warn'}
              sub={`${d.complete}/${d.total}`}
            />
          ))}
        </div>
        <div className="border-t border-sand bg-sand-light/40 px-6 py-3">
          <p className="font-sans text-[12px] text-stone">
            Arts flagged for conversation — HOD may need support to catch up the cycle. Appraisal
            documents are confidential; you see completion status only unless a file is flagged
            for your review.
          </p>
        </div>
      </section>

      {/* Learning walks */}
      <section className="rounded border border-sand bg-white">
        <div className="flex items-center justify-between border-b border-sand px-6 py-4">
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
              Learning walks · Term 2
            </p>
            <p className="mt-1 font-sans text-[13px] text-stone">
              18 planned · {complete.length} completed · {scheduled.length} scheduled this week
            </p>
          </div>
          <button
            type="button"
            className="btn-terracotta"
          >
            Schedule a walk
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="bg-sand-light/40 text-left">
                <th className="px-6 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">Walk</th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">Class</th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">Teacher</th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">Observer</th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">Date</th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">Status</th>
              </tr>
            </thead>
            <tbody>
              {LEARNING_WALKS.map((w) => (
                <tr key={w.id} className="border-t border-sand-light">
                  <td className="px-6 py-3 font-mono text-[12px] text-stone">{w.id}</td>
                  <td className="px-4 py-3 font-sans font-medium text-ink">{w.className}</td>
                  <td className="px-4 py-3 font-sans text-[13px] text-stone">{w.teacher}</td>
                  <td className="px-4 py-3 font-sans text-[13px] text-stone">{w.observer}</td>
                  <td className="px-4 py-3 font-sans text-[13px] text-stone">{w.date}</td>
                  <td className="px-4 py-3">
                    {w.status === 'complete' ? (
                      <span className="inline-flex items-center rounded-sm bg-[#E6F0E9] px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-ok">
                        complete — note written
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-sm bg-[#FDF4E3] px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#92650B]">
                        scheduled
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CPD investment */}
      <section className="rounded border border-sand bg-white p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
              CPD investment
            </p>
            <h2 className="mt-1 font-display text-[24px] text-ink">
              1,640 of 2,720 hours delivered
            </h2>
            <p className="mt-1 font-sans text-[13px] text-stone">
              Annual target 40 hours per teacher · 91% on track
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-[clamp(2.5rem,4vw,3.5rem)] leading-none tabular-nums text-ink">
              91%
            </p>
            <p className="mt-1 font-sans text-[12px] text-stone">
              on target
            </p>
          </div>
        </div>
        <div className="mt-6 h-3 overflow-hidden rounded-sm bg-sand">
          <div className="h-full bg-earth" style={{ width: '60%' }} />
        </div>
        <p className="mt-4 font-serif text-[13px] leading-relaxed text-stone">
          Individual CPD logs are confidential — you see aggregate completion, not specific
          training attended. Peer observation as a category is specifically encouraged and
          counts toward the annual target.
        </p>
      </section>

      {/* Principle reminder */}
      <aside className="rounded border-l-[3px] border-terracotta bg-sand-light/70 px-6 py-4">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-terracotta">
          The teaching quality principle
        </p>
        <p className="mt-2 font-serif text-[15px] leading-relaxed text-ink">
          The portal surfaces patterns. The Headmaster makes judgments through conversation. A
          dashboard cannot appraise a teacher; only a professional, supportive, face-to-face
          dialogue can.
        </p>
      </aside>
    </div>
  );
}
