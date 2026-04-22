import { Reveal } from './reveal';

const VOICES = [
  {
    quote:
      'I stopped keeping assignments in three different notebooks. Everything is in one place, and I can see exactly what is due and what I have done.',
    name: 'Farai M.',
    role: 'Student, Form 3',
    initials: 'FM',
    tone: 'heritage',
  },
  {
    quote:
      'Sunday evenings are mine again. Marking, feedback, and reports all happen through the portal — my comment bank in Shona is particularly useful.',
    name: 'Mrs Dziva',
    role: 'Senior Teacher, Mathematics',
    initials: 'MD',
    tone: 'savanna',
  },
  {
    quote:
      'I paid Term 2 fees through EcoCash on a Sunday evening. The receipt came through in thirty seconds. My days of calling the bursary are over.',
    name: 'Sekai Moyo',
    role: 'Parent of two HHA learners',
    initials: 'SM',
    tone: 'msasa',
  },
] as const;

/**
 * Voices — §11 of the spec.
 *
 * Three testimonial cards. Each opens with a large Fraunces italic
 * apostrophe in Terracotta, followed by a 2-3 line quotation. Portrait
 * is a circular 56px avatar with a Sand hairline.
 */
export function Voices() {
  return (
    <section
      aria-labelledby="voices-heading"
      className="border-t border-sand bg-sand-light py-20 md:py-28"
    >
      <div className="hha-wrap">
        <div className="mb-14 text-center md:mb-20">
          <p className="hha-eyebrow">Voices of the school</p>
          <h2
            id="voices-heading"
            className="mx-auto mt-4 max-w-[640px] font-display text-[clamp(2rem,4vw,2.75rem)] leading-tight text-ink"
          >
            Not testimonials.{' '}
            <span className="italic font-light text-terracotta">Evidence.</span>
          </h2>
        </div>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {VOICES.map((v, i) => (
            <Reveal key={v.name} as="li" delayMs={i * 120}>
              <article className="relative h-full rounded border border-sand bg-cream p-8 md:p-10">
                <span
                  aria-hidden
                  className="absolute left-8 top-2 font-display text-[64px] italic font-light leading-none text-terracotta"
                >
                  &ldquo;
                </span>
                <blockquote className="mt-10 font-display text-[20px] italic font-light leading-[1.5] text-ink">
                  {v.quote}
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-3">
                  <span
                    className="flex h-14 w-14 flex-none items-center justify-center rounded-full border border-sand bg-sand-light font-sans text-sm font-semibold text-earth"
                    aria-hidden
                  >
                    {v.initials}
                  </span>
                  <span className="flex flex-col">
                    <span className="font-sans text-[15px] font-semibold text-ink">
                      {v.name}
                    </span>
                    <span className="font-sans text-[13px] text-stone">{v.role}</span>
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
