import {
  ChartBar,
  ExecPageHeader,
  HeatCell,
  KPICard,
} from '@/components/headmaster/primitives';
import {
  HEATMAP_CLASSES,
  HEATMAP_DATA,
  HEATMAP_FORM,
  HEATMAP_SUBJECTS,
  MATHS_CLASSES,
  MATHS_DEPARTMENT,
} from '@/lib/mock/headmaster-extras';

/**
 * Subjects & Classes — §06.
 *
 * The heatmap is the single strongest element. Rows reveal class-wide
 * strengths; columns reveal subject-wide strengths. Outliers (sage cell
 * in a red row) flag teacher-specific effects worth understanding.
 */
export default function SubjectsPage() {
  return (
    <div className="space-y-8">
      <ExecPageHeader
        eyebrow="Subjects & classes"
        title="Where the work is strongest, where it is struggling."
        subtitle="Each cell is one class in one subject · click to drill"
      />

      {/* Heatmap */}
      <section className="rounded border border-sand bg-white">
        <div className="flex items-center justify-between border-b border-sand px-6 py-4">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
            {HEATMAP_FORM} × subject
          </p>
          <div className="flex items-center gap-3 font-sans text-[10px] text-stone">
            {[
              { bg: 'bg-[#2F7D4E] text-cream', label: '85%+' },
              { bg: 'bg-[#8DB98A]', label: '75–84%' },
              { bg: 'bg-[#D9C07A]', label: '70–74%' },
              { bg: 'bg-[#E5A475]', label: '65–69%' },
              { bg: 'bg-[#C85549] text-cream', label: 'below 65' },
            ].map((l) => (
              <span key={l.label} className="inline-flex items-center gap-1">
                <span className={`inline-block h-3 w-3 rounded-sm ${l.bg.split(' ')[0]}`} aria-hidden />
                {l.label}
              </span>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto p-6">
          <table className="w-full text-[12px]">
            <thead>
              <tr>
                <th className="w-20" />
                {HEATMAP_SUBJECTS.map((s) => (
                  <th
                    key={s}
                    className="px-2 py-2 text-center font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone"
                  >
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HEATMAP_CLASSES.map((cls, rowIdx) => (
                <tr key={cls}>
                  <td className="w-20 pr-3 text-right font-sans text-[13px] font-medium text-ink">
                    {cls}
                  </td>
                  {HEATMAP_SUBJECTS.map((_, colIdx) => (
                    <td key={colIdx} className="px-1 py-1">
                      <HeatCell value={HEATMAP_DATA[rowIdx]?.[colIdx] ?? 0} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Insights (auto-read) */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Insight
          kind="row"
          title="4D broadly weaker across the board"
          body="Row average 69.9%. History and Physics are the weakest cells. Consider a streamed intervention."
        />
        <Insight
          kind="col"
          title="History consistently low across Form 4"
          body="Column average 67.8%. HOD Humanities has proposed a scheme-of-work redesign (awaiting your approval)."
        />
        <Insight
          kind="outlier"
          title="4E in Sciences — teacher effect"
          body="4E outperforms the cohort average by +6 in Biology and +8 in Physics. Mrs Dziva's practice may be worth capturing for peer observation."
        />
      </div>

      {/* Subject drill — Mathematics */}
      <section className="rounded border border-sand bg-white">
        <div className="border-b border-sand px-6 py-5">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
            Mathematics · whole school
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h2 className="font-display text-[24px] text-ink">Mathematics</h2>
            <span className="font-sans text-[13px] text-stone">
              Head of Dept: {MATHS_DEPARTMENT.hod} · {MATHS_DEPARTMENT.teacherCount} teachers ·{' '}
              {MATHS_DEPARTMENT.classCount} classes
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 border-b border-sand px-6 py-5 md:grid-cols-4">
          <KPICard
            label="Subject average"
            value={`${MATHS_DEPARTMENT.subjectAvg}%`}
            deltaLabel={`+${MATHS_DEPARTMENT.trendDelta}`}
            trend="up"
          />
          <KPICard label="Pass rate" value={`${MATHS_DEPARTMENT.passRate}%`} deltaLabel="+2 pp" trend="up" />
          <KPICard label="Classes" value={`${MATHS_DEPARTMENT.classCount}`} deltaLabel="Forms 1–6" />
          <KPICard label="At-risk in subject" value={`${MATHS_DEPARTMENT.atRiskInSubject}`} deltaLabel="— flagged" />
        </div>
        <div className="space-y-1 px-6 py-5">
          <p className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">
            Mathematics — all classes, current term
          </p>
          {MATHS_CLASSES.map((c) => (
            <ChartBar
              key={c.label}
              label={`${c.label} · ${c.teacher}`}
              value={c.avg}
              tone={c.avg >= 78 ? 'good' : c.avg >= 72 ? 'default' : 'warn'}
              sub={`${c.avg.toFixed(1)}%`}
            />
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-sand px-6 py-4">
          <p className="font-sans text-[12px] text-stone">
            Bars name the class and the teacher · each is one-tap actionable
          </p>
          <div className="flex gap-2">
            <button className="inline-flex h-9 items-center rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light">
              Schedule a learning walk
            </button>
            <button className="inline-flex h-9 items-center rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light">
              Message the HOD
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Insight({
  kind,
  title,
  body,
}: {
  kind: 'row' | 'col' | 'outlier';
  title: string;
  body: string;
}) {
  const tone = {
    row:     'border-l-terracotta',
    col:     'border-l-ochre',
    outlier: 'border-l-ok',
  }[kind];
  return (
    <div className={`rounded border border-sand bg-white p-4 border-l-[3px] ${tone}`}>
      <p className="font-sans text-[13px] font-semibold text-ink">{title}</p>
      <p className="mt-1 font-serif text-[13px] leading-relaxed text-stone">{body}</p>
    </div>
  );
}
