import { Reveal } from './reveal';

const VOICES = [
  {
    quote:
      'I stopped keeping assignments in three different notebooks. Everything is in one place, and I can see exactly what is due and what I have done.',
    name: 'Farai M.',
    role: 'Student, Form 3',
    initials: 'FM',
    accent: 'indigo' as const,
  },
  {
    quote:
      'Sunday evenings are mine again. Marking, feedback, and reports all happen through the portal — my comment bank in Shona is particularly useful.',
    name: 'Mrs Dziva',
    role: 'Senior Teacher, Mathematics',
    initials: 'MD',
    accent: 'emerald' as const,
  },
  {
    quote:
      'I paid Term 2 fees through EcoCash on a Sunday evening. The receipt came through in thirty seconds. My days of calling the bursary are over.',
    name: 'Sekai Moyo',
    role: 'Parent of twoJHS learners',
    initials: 'SM',
    accent: 'coral' as const,
  },
] as const;

const ACCENT_RGB = {
  indigo: '91 92 255',
  emerald: '0 179 126',
  coral: '255 91 122',
} as const;

/**
 * Voices — v2.0.
 *
 * Three testimonial cards on Fog. Large accent-coloured opening mark,
 * followed by the quotation in Space Grotesk medium.
 */
export function Voices() {
  return (
    <section
      aria-labelledby="voices-heading"
      className="border-t border-mist bg-fog py-20 md:py-28"
    >
      <div className="hha-wrap">
        <div className="mb-14 text-center md:mb-20">
          <p
            className="font-mono text-[11px] font-medium uppercase tracking-[0.18em]"
            style={{ color: 'rgb(var(--accent))' }}
          >
            Voices of the school
          </p>
          <h2
            id="voices-heading"
            className="mx-auto mt-4 max-w-[640px] font-display text-[clamp(2rem,4vw,2.75rem)] font-medium leading-tight tracking-tight text-obsidian"
          >
            Not testimonials.{' '}
            <span style={{ color: 'rgb(var(--accent))' }}>Evidence.</span>
          </h2>
        </div>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {VOICES.map((v, i) => (
            <Reveal key={v.name} as="li" delayMs={i * 120}>
              <article className="relative h-full rounded-md border border-mist bg-snow p-8 md:p-10">
                <span
                  aria-hidden
                  className="absolute left-8 top-2 font-display text-[64px] font-medium leading-none"
                  style={{ color: `rgb(${ACCENT_RGB[v.accent]})` }}
                >
                  &ldquo;
                </span>
                <blockquote className="mt-10 font-display text-[20px] font-medium leading-[1.5] tracking-tight text-obsidian">
                  {v.quote}
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-3">
                  <span
                    className="flex h-14 w-14 flex-none items-center justify-center rounded-full border border-mist bg-fog font-mono text-[13px] font-medium uppercase tracking-[0.08em] text-obsidian"
                    aria-hidden
                  >
                    {v.initials}
                  </span>
                  <span className="flex flex-col">
                    <span className="font-sans text-[15px] font-medium text-obsidian">
                      {v.name}
                    </span>
                    <span
                      className="font-mono text-[11px] uppercase tracking-[0.1em]"
                      style={{ color: `rgb(${ACCENT_RGB[v.accent]})` }}
                    >
                      {v.role}
                    </span>
                  </span>
                </figcaption>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
