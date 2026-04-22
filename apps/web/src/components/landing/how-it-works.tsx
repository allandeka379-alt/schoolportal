import { Reveal } from './reveal';

const STEPS = [
  {
    n: '01',
    title: 'Sign in',
    body: 'With the credentials from your welcome email.',
  },
  {
    n: '02',
    title: 'See your world',
    body: 'A dashboard shaped to your role — nothing extra.',
  },
  {
    n: '03',
    title: 'Do the work',
    body: 'Submit, mark, pay, read, message. One portal.',
  },
  {
    n: '04',
    title: 'Stay informed',
    body: 'Announcements and updates arrive as they happen.',
  },
] as const;

/**
 * How it works — v2.0.
 *
 * Four columns on desktop with a Mist dashed connector running behind
 * the numerals.
 */
export function HowItWorks() {
  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="bg-snow py-20 md:py-28"
    >
      <div className="hha-wrap text-center">
        <p
          className="font-mono text-[11px] font-medium uppercase tracking-[0.18em]"
          style={{ color: 'rgb(var(--accent))' }}
        >
          How it works
        </p>
        <h2
          id="how-it-works-heading"
          className="mx-auto mt-4 max-w-[640px] font-display text-[clamp(2rem,4vw,2.75rem)] font-medium leading-tight tracking-tight text-obsidian"
        >
          Four steps. Then you are{' '}
          <span style={{ color: 'rgb(var(--accent))' }}>home.</span>
        </h2>

        <div className="relative mx-auto mt-16 md:mt-20">
          <div
            aria-hidden
            className="absolute left-[10%] right-[10%] top-7 hidden border-t border-dashed border-mist md:block"
          />

          <ol className="relative grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-6">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} as="li" delayMs={i * 120} className="relative">
                <div
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-mist bg-snow font-mono text-[13px] font-medium uppercase tracking-[0.1em]"
                  style={{ color: 'rgb(var(--accent))' }}
                >
                  {step.n}
                </div>
                <h3 className="mt-6 font-display text-[20px] font-medium tracking-tight text-obsidian">
                  {step.title}
                </h3>
                <p className="mx-auto mt-3 max-w-[220px] font-sans text-[14px] leading-relaxed text-slate">
                  {step.body}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
