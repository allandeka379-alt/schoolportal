/**
 * Live-stats strip under the hero. Four headline figures with subtle
 * pulsing indicators to suggest "these update as the school does".
 */

const STATS = [
  { value: '1,240', unit: 'learners',        label: 'Enrolled this term' },
  { value: '98%',   unit: 'present today',   label: 'Morning register · whole school' },
  { value: '84%',   unit: 'pass rate',       label: 'Term 2 assessments · Forms 1–6' },
  { value: '$184k', unit: 'collected',       label: '62% of Term 2 fee target' },
];

export function LiveStatsStrip() {
  return (
    <section
      aria-label="Live school statistics"
      className="border-y border-line bg-surface"
    >
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-0 px-5 py-6 sm:px-8 sm:py-7 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={[
              'relative flex flex-col gap-1 py-3',
              i > 0 ? 'pl-5 sm:pl-6 lg:pl-8' : 'pl-0',
              i < STATS.length - 1
                ? 'lg:border-r lg:border-line'
                : '',
            ].join(' ')}
          >
            <div className="flex items-baseline gap-2">
              <span className="text-h2 text-ink tabular-nums">{s.value}</span>
              <span className="relative inline-flex h-2 w-2 items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-success/25 animate-pulse" aria-hidden />
                <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-success" />
              </span>
              <span className="text-small font-medium text-muted">{s.unit}</span>
            </div>
            <p className="text-micro text-muted">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
