import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Reveal } from './reveal';

const PUBLIC_ANNOUNCEMENTS = [
  {
    urgent: true,
    date: '22 April 2026',
    source: "Headmaster's Office",
    title: 'Term 2 opens Monday 5 May — registration 07:00 sharp',
    preview:
      'Full uniform is required. Boarders should arrive on Sunday 4 May between 14:00 and 17:00. Day scholars report to the main hall for assembly at 07:45.',
  },
  {
    urgent: false,
    date: '20 April 2026',
    source: 'Bursary',
    title: 'Term 2 fees now due — multiple payment options available',
    preview:
      'Invoices have been issued. EcoCash, OneMoney, ZIPIT, and direct bank deposits to our CBZ account are supported through the portal.',
  },
  {
    urgent: false,
    date: '18 April 2026',
    source: 'Admissions',
    title: 'Open morning for Form 1 intake — Saturday 10 May',
    preview:
      'Prospective Form 1 parents are warmly invited to visit the academy between 09:00 and 12:00. RSVP through the portal or the admissions office.',
  },
] as const;

/**
 * Announcements window — §12 of the spec.
 *
 * Three most-recent public announcements. Urgent rows carry a 3px Terracotta
 * top border and a Sand-Light fill. Each row is a full server-rendered link,
 * works without JavaScript, and is indexed by search engines.
 */
export function AnnouncementsWindow() {
  return (
    <section
      id="announcements"
      aria-labelledby="announcements-heading"
      aria-live="polite"
      className="bg-cream py-20 md:py-28"
    >
      <div className="hha-wrap">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-sand pb-8">
          <div>
            <p className="hha-eyebrow">Announcements</p>
            <h2
              id="announcements-heading"
              className="mt-3 font-display text-heading-lg font-normal text-ink"
            >
              What the school is saying,{' '}
              <span className="italic font-light text-terracotta">openly.</span>
            </h2>
          </div>
          <Link href="#" className="landing-link font-sans text-sm font-medium">
            View all announcements
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          </Link>
        </div>

        <ul>
          {PUBLIC_ANNOUNCEMENTS.map((a, i) => (
            <Reveal key={a.title} as="li" delayMs={i * 80}>
              <Link
                href="#"
                className={[
                  'group block border-b border-sand transition-colors hover:bg-sand-light',
                  a.urgent ? 'border-t-[3px] border-t-terracotta bg-sand-light/50' : '',
                ].join(' ')}
              >
                <div className="hha-wrap -mx-0 px-0 py-6 md:py-8">
                  <p className="flex items-center gap-3 font-sans text-[11px] font-semibold uppercase tracking-[0.18em]">
                    {a.urgent ? (
                      <span className="inline-flex items-center rounded bg-terracotta px-2 py-0.5 text-cream">
                        Urgent
                      </span>
                    ) : (
                      <span className="text-earth">Notice</span>
                    )}
                    <span className="text-stone">·</span>
                    <span className="text-stone">{a.date}</span>
                    <span className="text-stone">·</span>
                    <span className="text-stone">{a.source}</span>
                  </p>
                  <h3 className="mt-3 font-display text-[24px] md:text-[26px] font-normal leading-snug text-ink transition-colors group-hover:text-earth">
                    {a.title}
                  </h3>
                  <p className="mt-2 line-clamp-1 font-serif text-body-base text-stone">
                    {a.preview}{' '}
                    <span className="font-sans text-sm font-medium text-terracotta">
                      Read more →
                    </span>
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
