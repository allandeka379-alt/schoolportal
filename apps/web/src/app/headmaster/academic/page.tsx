import { Sparkline, ChartBar, ExecPageHeader, HeatCell, KPICard } from '@/components/headmaster/primitives';
import {
  COHORT_TREND,
  FORM_AVERAGES,
  HEATMAP_CLASSES,
  HEATMAP_DATA,
  HEATMAP_FORM,
  HEATMAP_SUBJECTS,
  SUBJECT_AVERAGES,
} from '@/lib/mock/headmaster-extras';

/**
 * Administrator · Academic.
 *
 * Whole-school picture of teaching and learning. No cohort language —
 * "whole school" / "year group" / "this term" instead. Four blocks:
 *   1. KPI ribbon
 *   2. Subject averages ordered descending (vs 3-year baseline)
 *   3. Form 4 subject heatmap (class × subject)
 *   4. Six-term school trend line
 */
export default function AcademicPage() {
  const bestSubjects = [...SUBJECT_AVERAGES].slice(0, 3);
  const concernSubjects = [...SUBJECT_AVERAGES]
    .filter((s) => s.avg < s.threeYear - 1)
    .sort((a, b) => a.avg - b.avg);
  const schoolAverage = COHORT_TREND.at(-1)?.avg ?? 76.2;
  const schoolAverageFrom = COHORT_TREND[0]?.avg ?? 70.2;

  return (
    <div className="space-y-8">
      <ExecPageHeader
        eyebrow="Academic"
        title="Teaching and learning"
        subtitle="Whole-school performance by subject, year group, and class · Term 2, 2026"
      />

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        {['Term 2', 'All year groups', 'All streams', 'All subjects'].map((l) => (
          <button
            key={l}
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
          >
            {l}
          </button>
        ))}
      </div>

      {/* KPI ribbon */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KPICard
          label="School average"
          value={`${schoolAverage.toFixed(1)}%`}
          deltaLabel="+1.4 vs last term"
          trend="up"
        />
        <KPICard label="vs National (ZIMSEC)" value="+2.1" deltaLabel="points above" trend="up" />
        <KPICard label="Pass rate" value="84%" deltaLabel="+0.9 pp" trend="up" />
        <KPICard
          label="Students of concern"
          value="18"
          deltaLabel="down from 24"
          trend="down-good"
        />
      </div>

      {/* Subject averages */}
      <section className="rounded border border-sand bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand px-6 py-4">
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
              Subject averages · Term 2, 2026
            </p>
            <p className="mt-1 font-sans text-[13px] text-stone">
              Sorted descending · colour-coded against the 3-year average for each subject
            </p>
          </div>
          <div className="flex items-center gap-3 font-sans text-[11px] text-stone">
            <LegendDot colour="bg-ok" label="Meeting or exceeding" />
            <LegendDot colour="bg-ochre" label="Within 3pp below" />
            <LegendDot colour="bg-danger" label="More than 3pp below" />
          </div>
        </div>
        <div className="space-y-1 px-6 py-5">
          {SUBJECT_AVERAGES.map((s) => {
            const delta = s.avg - s.threeYear;
            const tone = delta >= 0 ? 'good' : delta >= -3 ? 'warn' : 'danger';
            return (
              <ChartBar
                key={s.code}
                label={s.name}
                value={s.avg}
                tone={tone}
                sub={`${s.avg.toFixed(1)}%`}
              />
            );
          })}
        </div>
      </section>

      {/* Highlights + concerns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded border border-sand bg-white">
          <div className="border-b border-sand px-6 py-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
              Trending up
            </p>
          </div>
          <ul className="divide-y divide-sand-light">
            {bestSubjects.map((s) => (
              <li key={s.code} className="flex items-center justify-between px-6 py-3">
                <span className="font-sans text-[14px] font-medium text-ink">{s.name}</span>
                <span className="font-mono text-[14px] tabular-nums text-ok">
                  {s.avg.toFixed(1)}%{' '}
                  <span className="text-[12px] text-stone">
                    · +{(s.avg - s.threeYear).toFixed(1)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded border border-sand bg-white">
          <div className="border-b border-sand px-6 py-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
              Of concern
            </p>
          </div>
          {concernSubjects.length === 0 ? (
            <p className="px-6 py-8 text-center font-serif text-[15px] text-stone">
              Every subject tracking at or above its 3-year average.
            </p>
          ) : (
            <ul className="divide-y divide-sand-light">
              {concernSubjects.map((s) => (
                <li key={s.code} className="flex items-center justify-between px-6 py-3">
                  <span className="font-sans text-[14px] font-medium text-ink">{s.name}</span>
                  <span className="font-mono text-[14px] tabular-nums text-danger">
                    {s.avg.toFixed(1)}%{' '}
                    <span className="text-[12px] text-stone">
                      · {(s.avg - s.threeYear).toFixed(1)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Year group performance */}
      <section className="rounded border border-sand bg-white">
        <div className="border-b border-sand px-6 py-4">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
            Performance by year group
          </p>
          <p className="mt-1 font-sans text-[13px] text-stone">
            Forms 1 through 6 · current term
          </p>
        </div>
        <div className="space-y-1 px-6 py-5">
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
      </section>

      {/* Form 4 heatmap */}
      <section className="rounded border border-sand bg-white">
        <div className="border-b border-sand px-6 py-4">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
            {HEATMAP_FORM} · subject × class heatmap
          </p>
          <p className="mt-1 font-sans text-[13px] text-stone">
            Each cell is that class&rsquo;s average for the subject this term
          </p>
        </div>
        <div className="overflow-x-auto px-6 py-5">
          <table className="w-full text-[13px]">
            <thead>
              <tr>
                <th className="pr-3 text-left font-mono text-[11px] uppercase tracking-[0.14em] text-stone" />
                {HEATMAP_SUBJECTS.map((s) => (
                  <th
                    key={s}
                    className="px-1 py-2 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-stone"
                  >
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HEATMAP_CLASSES.map((cls, i) => (
                <tr key={cls}>
                  <td className="pr-3 text-left font-sans text-[12px] font-semibold text-ink">
                    {HEATMAP_FORM} {cls}
                  </td>
                  {HEATMAP_SUBJECTS.map((_, j) => (
                    <td key={j} className="p-1">
                      <HeatCell value={HEATMAP_DATA[i]![j]!} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Whole-school trend */}
      <section className="rounded border border-sand bg-white p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
              Whole-school trend · six terms
            </p>
            <p className="mt-1 font-sans text-[13px] text-stone">
              Moving average across all forms
            </p>
            <p className="mt-4 font-display text-[clamp(2rem,3vw,2.5rem)] leading-none tabular-nums text-ink">
              {schoolAverage.toFixed(1)}%
            </p>
            <p className="mt-2 font-sans text-[13px] text-stone">
              up {(schoolAverage - schoolAverageFrom).toFixed(1)} points over six terms
            </p>
          </div>
          <Sparkline values={COHORT_TREND.map((c) => c.avg)} width={300} height={96} />
        </div>
      </section>

      <aside className="rounded border border-sand bg-sand-light/60 px-6 py-4">
        <p className="font-sans text-[12px] text-stone">
          National data last updated November 2025 (ZIMSEC publication cycle). Regional
          independent-schools benchmarks available on request.
        </p>
      </aside>
    </div>
  );
}

function LegendDot({ colour, label }: { colour: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-1.5 w-1.5 rounded-full ${colour}`} aria-hidden />
      {label}
    </span>
  );
}
