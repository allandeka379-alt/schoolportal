import { CountUp, type CountUpFormat } from './count-up';

/**
 * Numbers band — §09 of the spec.
 *
 * A single full-bleed stripe in Earth. Four statistics, vertical Ochre
 * hairline separators, tabular-nums Fraunces 72px numerals. Count-up on
 * intersection; staggered 80ms each. Percentage and comma appear at final
 * value only.
 *
 * Note: format is passed as a string enum rather than a function, because
 * this module runs as a server component and functions cannot cross the
 * server → client boundary.
 */
const STATS: readonly {
  value: number;
  format: CountUpFormat;
  label: string;
}[] = [
  { value: 1240, format: 'thousands', label: 'Learners' },
  { value: 68, format: 'integer', label: 'Educators' },
  { value: 39, format: 'integer', label: 'Years' },
  { value: 94, format: 'percent', label: 'Pass rate' },
];

export function NumbersBand() {
  return (
    <section
      aria-labelledby="numbers-heading"
      className="relative bg-earth text-cream"
      style={{
        backgroundImage:
          'linear-gradient(180deg, #5C3A1E 0%, #4E2F17 100%)',
      }}
    >
      <div className="hha-wrap py-14 md:py-20">
        <h2 id="numbers-heading" className="sr-only">
          The school in numbers
        </h2>
        <ul className="grid grid-cols-2 gap-y-10 md:grid-cols-4 md:gap-y-0">
          {STATS.map((stat, i) => (
            <li
              key={stat.label}
              className={[
                'flex flex-col items-center text-center md:border-l md:border-ochre/25 md:first:border-l-0',
                'px-4',
              ].join(' ')}
            >
              <span className="font-display text-[clamp(3rem,7vw,4.5rem)] leading-none font-light tabular-nums text-cream">
                <CountUp value={stat.value} format={stat.format} delayMs={i * 80} />
              </span>
              <span className="mt-4 font-sans text-[12px] font-semibold uppercase tracking-[0.28em] text-ochre">
                {stat.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
