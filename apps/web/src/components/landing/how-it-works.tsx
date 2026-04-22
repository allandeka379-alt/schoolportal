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
 * How it works — §10 of the spec.
 *
 * Four columns on desktop, connected by a 1px dotted horizontal rule in
 * Sand that runs behind the numerals. The connector is a CSS-only line —
 * no SVG, no image. Hidden below 768px, steps then stack.
 */
export function HowItWorks() {
  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="bg-cream py-20 md:py-28"
    >
      <div className="hha-wrap text-center">
        <p className="hha-eyebrow">How it works</p>
        <h2
          id="how-it-works-heading"
          className="mx-auto mt-4 max-w-[640px] font-display text-[clamp(2rem,4vw,2.75rem)] leading-tight text-ink"
        >
          Four steps. Then you are{' '}
          <span className="italic font-light text-terracotta">home.</span>
        </h2>

        <div className="relative mx-auto mt-16 md:mt-20">
          {/* Dotted connector — behind the numerals, horizontally centred on them */}
          <div
            aria-hidden
            className="absolute left-[10%] right-[10%] top-7 hidden border-t border-dashed border-sand md:block"
          />

          <ol className="relative grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-6">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} as="li" delayMs={i * 120} className="relative">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-sand bg-cream font-display text-[20px] italic font-light text-terracotta">
                  {step.n}
                </div>
                <h3 className="mt-6 font-display text-heading-md font-normal text-ink">
                  {step.title}
                </h3>
                <p className="mx-auto mt-3 max-w-[220px] font-serif text-body-base text-stone">
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
