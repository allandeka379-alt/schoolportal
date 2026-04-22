import { Sparkline, ChartBar, ExecPageHeader, KPICard } from '@/components/headmaster/primitives';
import { COHORT_TREND, FORM_AVERAGES, SUBJECT_AVERAGES } from '@/lib/mock/headmaster-extras';

/**
 * Academic Intelligence — §05.
 *
 * Whole-school teaching & learning picture. KPI ribbon, subject-performance
 * matrix sorted descending, per-form-per-class drill, benchmarks strip,
 * longitudinal cohort tracking.
 */
export default function AcademicIntelligencePage() {
  const bestSubjects = [...SUBJECT_AVERAGES].slice(0, 3);
  const concernSubjects = [...SUBJECT_AVERAGES]
    .filter((s) => s.avg < s.threeYear - 1)
    .sort((a, b) => a.avg - b.avg);

  return (
    <div className="space-y-8">
      <ExecPageHeader
        eyebrow="Academic Intelligence · whole school"
        title="How is teaching and learning?"
        subtitle="Term 2, 2026 · benchmarks refresh annually with ZIMSEC publication"
      />

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        {['Term 2', 'All forms', 'All streams', 'All subjects'].map((l) => (
          <button
            key={l}
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
          >
            {l}
          </button>
        ))}
      </div>

      {/* KPI ribbon — academic health */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KPICard label="Cohort average" value="76.2%" deltaLabel="+1.4 vs last term" trend="up" />
        <KPICard label="vs National"  value="+2.1" deltaLabel="points (ZIMSEC)" trend="up" />
        <KPICard label="Pass rate"    value="84%" deltaLabel="+0.9 pp" trend="up" />
        <KPICard label="At-risk"      value="18" deltaLabel="down from 24" trend="down-good" />
      </div>

      {/* Subject averages */}
      <section className="rounded border border-sand bg-white">
        <div className="flex items-center justify-between border-b border-sand px-6 py-4">
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
              Subject averages — Term 2, 2026
            </p>
            <p className="mt-1 font-sans text-[13px] text-stone">
              Sorted descending · colour-coded against 3-year average for each subject
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
                  {s.avg.toFixed(1)}% <span className="text-[12px] text-stone">· +{(s.avg - s.threeYear).toFixed(1)}</span>
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
          <ul className="divide-y divide-sand-light">
            {concernSubjects.map((s) => (
              <li key={s.code} className="flex items-center justify-between px-6 py-3">
                <span className="font-sans text-[14px] font-medium text-ink">{s.name}</span>
                <span className="font-mono text-[14px] tabular-nums text-danger">
                  {s.avg.toFixed(1)}% <span className="text-[12px] text-stone">· {(s.avg - s.threeYear).toFixed(1)}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Form 4 by class */}
      <section className="rounded border border-sand bg-white">
        <div className="border-b border-sand px-6 py-4">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
            Form 4 — by class
          </p>
          <p className="mt-1 font-sans text-[13px] text-stone">
            Highlights classes needing attention
          </p>
        </div>
        <div className="space-y-1 px-6 py-5">
          {[
            { label: '4A (Mathematics stream)', value: 80.2, tone: 'good' as const },
            { label: '4B (Mathematics stream)', value: 73.1, tone: 'warn' as const },
            { label: '4C (Commerce stream)',    value: 75.4, tone: 'default' as const },
            { label: '4D (Arts stream)',        value: 71.0, tone: 'warn' as const },
            { label: '4E (Science stream)',     value: 79.3, tone: 'good' as const },
          ].map((c) => (
            <ChartBar key={c.label} label={c.label} value={c.value} tone={c.tone} sub={`${c.value.toFixed(1)}%`} />
          ))}
        </div>
      </section>

      {/* Cohort tracking */}
      <section className="rounded border border-sand bg-white p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
              Longitudinal cohort — Form 1 intake of 2024
            </p>
            <p className="mt-1 font-sans text-[13px] text-stone">
              Following this cohort through every term since admission
            </p>
            <p className="mt-4 font-display text-[clamp(2rem,3vw,2.5rem)] leading-none tabular-nums text-ink">
              {COHORT_TREND.at(-1)?.avg.toFixed(1)}%
            </p>
            <p className="mt-2 font-sans text-[13px] text-stone">
              up {((COHORT_TREND.at(-1)?.avg ?? 0) - (COHORT_TREND[0]?.avg ?? 0)).toFixed(1)} points over six terms · no inflection points
            </p>
          </div>
          <Sparkline values={COHORT_TREND.map((c) => c.avg)} width={300} height={96} />
        </div>
      </section>

      <aside className="rounded border border-sand bg-sand-light/60 px-6 py-4">
        <p className="font-sans text-[12px] text-stone">
          National data last updated November 2025 (ZIMSEC publication cycle). Regional independent-schools
          aggregated anonymised data available on request for per-subject comparisons.
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
