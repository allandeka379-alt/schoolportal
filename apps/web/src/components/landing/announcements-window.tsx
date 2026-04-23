import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

const PUBLIC_ANNOUNCEMENTS = [
  {
    urgent: true,
    date: '22 April 2026',
    source: 'Administrator',
    title: 'Term 2 opens Monday 5 May — registration 07:00',
    preview:
      'Full uniform is required. Boarders arrive Sunday 4 May between 14:00 and 17:00. Day scholars report to the main hall for assembly at 07:45.',
  },
  {
    urgent: false,
    date: '20 April 2026',
    source: 'Bursary',
    title: 'Term 2 fees now due · multiple payment options',
    preview:
      'Invoices have been issued. EcoCash, OneMoney, ZIPIT, and direct deposits to our CBZ account are supported through the portal.',
  },
  {
    urgent: false,
    date: '18 April 2026',
    source: 'Admissions',
    title: 'Open morning for Form 1 intake · Saturday 10 May',
    preview:
      'Prospective Form 1 parents are invited to visit between 09:00 and 12:00. RSVP through the portal or the admissions office.',
  },
];

export function AnnouncementsWindow() {
  return (
    <section
      id="announcements"
      aria-labelledby="announcements-heading"
      className="bg-surface py-16 sm:py-20"
    >
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-8">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-primary/15 bg-brand-primary/5 px-3 py-1 text-micro font-semibold uppercase tracking-[0.12em] text-brand-primary">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-primary" />
              Announcements
            </p>
            <h2 id="announcements-heading" className="text-h1 text-ink">
              What the school is saying,{' '}
              <span className="text-gradient-brand">openly.</span>
            </h2>
          </div>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 text-small font-semibold text-brand-primary hover:text-brand-primary/80"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>

        <ul className="mt-6 space-y-3">
          {PUBLIC_ANNOUNCEMENTS.map((a) => (
            <li key={a.title}>
              <Link
                href="/sign-in"
                className={[
                  'hover-lift group block rounded-lg border bg-card p-5 transition-colors',
                  a.urgent
                    ? 'border-t-[3px] border-t-danger border-x-line border-b-line'
                    : 'border-line',
                ].join(' ')}
              >
                <p className="flex flex-wrap items-center gap-3 text-micro font-semibold uppercase tracking-[0.12em]">
                  {a.urgent ? <Badge tone="danger">Urgent</Badge> : <Badge tone="brand">Notice</Badge>}
                  <span className="text-muted">· {a.date}</span>
                  <span className="text-muted">· {a.source}</span>
                </p>
                <h3 className="mt-3 text-h2 text-ink transition-colors group-hover:text-brand-primary">
                  {a.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-body text-muted">
                  {a.preview}{' '}
                  <span className="font-semibold text-brand-primary">Read more →</span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
