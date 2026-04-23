/**
 * Four-step explainer. Each step is a card with a numbered badge.
 * Desktop: four across, joined by a dashed line behind the numbers.
 */

const STEPS = [
  {
    n: '01',
    title: 'Sign in',
    body: 'Use the credentials from your welcome email. Multi-factor auth for staff.',
  },
  {
    n: '02',
    title: 'See your world',
    body: 'A dashboard shaped to your role — nothing extra, nothing missing.',
  },
  {
    n: '03',
    title: 'Do the work',
    body: 'Submit, mark, pay, read, message — one portal, every workflow.',
  },
  {
    n: '04',
    title: 'Stay informed',
    body: 'Announcements and grades arrive as they happen. SMS backup on low bandwidth.',
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="bg-card py-16 sm:py-20"
    >
      <div className="mx-auto max-w-[1200px] px-5 text-center sm:px-8">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-primary/15 bg-brand-primary/5 px-3 py-1 text-micro font-semibold uppercase tracking-[0.12em] text-brand-primary">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-primary" />
          How it works
        </p>
        <h2
          id="how-it-works-heading"
          className="mx-auto max-w-[640px] text-h1 text-ink"
        >
          Four steps. Then you are{' '}
          <span className="text-gradient-brand">home.</span>
        </h2>

        <div className="relative mx-auto mt-14">
          <div
            aria-hidden
            className="absolute left-[10%] right-[10%] top-7 hidden border-t border-dashed border-line md:block"
          />
          <ol className="relative grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-6">
            {STEPS.map((step) => (
              <li key={step.n} className="relative">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-line bg-card text-h3 font-semibold text-brand-primary shadow-card-sm">
                  {step.n}
                </div>
                <h3 className="mt-5 text-h3 text-ink">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-[240px] text-small text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
