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
 * Announcements window — v2.0.
 *
 * Three most-recent public announcements on a Snow surface. Urgent rows
 * carry a 3px accent top border and Fog fill.
 */
export function AnnouncementsWindow() {
  return (
    <section
      id="announcements"
      aria-labelledby="announcements-heading"
      aria-live="polite"
      className="bg-snow py-20 md:py-28"
    >
      <div className="hha-wrap">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-mist pb-8">
          <div>
            <p
              className="font-mono text-[11px] font-medium uppercase tracking-[0.18em]"
              style={{ color: 'rgb(var(--accent))' }}
            >
              Announcements
            </p>
            <h2
              id="announcements-heading"
              className="mt-3 font-display text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-tight tracking-tight text-obsidian"
            >
              What the school is saying,{' '}
              <span style={{ color: 'rgb(var(--accent))' }}>openly.</span>
            </h2>
          </div>
          <Link
            href="#"
            className="inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-obsidian hover:opacity-70"
          >
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
                  'group block border-b border-mist transition-colors hover:bg-fog',
                  a.urgent ? 'bg-fog/50' : '',
                ].join(' ')}
                style={a.urgent ? { borderTop: '3px solid rgb(var(--accent))' } : undefined}
              >
                <div className="hha-wrap -mx-0 px-0 py-6 md:py-8">
                  <p className="flex flex-wrap items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em]">
                    {a.urgent ? (
                      <span
                        className="inline-flex items-center rounded-sm px-2 py-0.5 text-snow"
                        style={{ backgroundColor: 'rgb(var(--accent))' }}
                      >
                        Urgent
                      </span>
                    ) : (
                      <span className="text-slate">Notice</span>
                    )}
                    <span className="text-steel">·</span>
                    <span className="text-steel">{a.date}</span>
                    <span className="text-steel">·</span>
                    <span className="text-steel">{a.source}</span>
                  </p>
                  <h3 className="mt-3 font-display text-[24px] md:text-[26px] font-medium leading-snug tracking-tight text-obsidian transition-colors group-hover:text-slate">
                    {a.title}
                  </h3>
                  <p className="mt-2 line-clamp-1 font-sans text-[15px] leading-relaxed text-slate">
                    {a.preview}{' '}
                    <span
                      className="font-mono text-[11px] font-medium uppercase tracking-[0.14em]"
                      style={{ color: 'rgb(var(--accent))' }}
                    >
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
