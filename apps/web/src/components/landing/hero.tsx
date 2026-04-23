'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpenCheck,
  CalendarClock,
  CreditCard,
  FileBadge2,
  LineChart,
  MessageSquare,
  NotebookPen,
  QrCode,
  Users,
} from 'lucide-react';

import { HeroCarousel, type HeroSlide } from './hero-carousel';
import { RotatingText } from './rotating-text';

/**
 * Landing hero.
 *
 * Full-bleed background photo (softly washed toward white on the left so the
 * text always reads), with a carousel that rotates through five pitches —
 * one per primary workflow the portal supports. A pair of CTAs sit below.
 *
 * Payment rails referenced on the "Pay" slide are drawn with Lucide icons
 * only, so the site ships without any payment-logo assets.
 */

const SUBJECTS = [
  'Mathematics',
  'English',
  'Shona',
  'Chemistry',
  'Physics',
  'Biology',
  'History',
  'Geography',
];

const PAYMENT_RAILS = ['EcoCash', 'OneMoney', 'InnBucks', 'ZIPIT', 'CBZ', 'Stanbic', 'Steward'];

export function Hero() {
  const slides: HeroSlide[] = [
    {
      key: 'learn',
      render: () => (
        <>
          <h1 className="text-display text-ink">
            One portal for{' '}
            <span className="block text-gradient-brand sm:inline">
              <RotatingText phrases={SUBJECTS} intervalMs={1600} className="min-h-[1em]" />
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-body text-muted sm:text-[18px] sm:leading-7">
            Assignments, marks, reports, library and timetable — all in one place, all term long.
            Built for how students at Harare Heritage Academy actually study.
          </p>
          <ChipRow
            items={[
              { icon: <NotebookPen className="h-3.5 w-3.5" />,  label: 'Submit assignments' },
              { icon: <BookOpenCheck className="h-3.5 w-3.5" />,label: 'Live grades' },
              { icon: <CalendarClock className="h-3.5 w-3.5" />,label: 'Weekly timetable' },
              { icon: <LineChart className="h-3.5 w-3.5" />,    label: 'Subject trends' },
            ]}
          />
        </>
      ),
    },
    {
      key: 'teach',
      render: () => (
        <>
          <h1 className="text-display text-ink">
            <span className="block">Marking Sunday evenings,</span>
            <span className="block text-gradient-brand">returned by Monday morning.</span>
          </h1>
          <p className="mt-5 max-w-xl text-body text-muted sm:text-[18px] sm:leading-7">
            PDF annotation, rubric scoring, audio feedback, Shona comment bank — the teacher&apos;s
            marking console knows how HHA actually marks work.
          </p>
          <ChipRow
            items={[
              { icon: <NotebookPen className="h-3.5 w-3.5" />,   label: 'Annotate PDFs' },
              { icon: <BookOpenCheck className="h-3.5 w-3.5" />, label: 'Rubric scoring' },
              { icon: <MessageSquare className="h-3.5 w-3.5" />, label: 'Audio feedback' },
              { icon: <LineChart className="h-3.5 w-3.5" />,     label: 'Gradebook' },
            ]}
          />
        </>
      ),
    },
    {
      key: 'pay',
      render: () => (
        <>
          <h1 className="text-display text-ink">
            Pay school fees with{' '}
            <span className="block text-gradient-brand sm:inline">
              <RotatingText phrases={PAYMENT_RAILS} intervalMs={1200} className="min-h-[1em]" />
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-body text-muted sm:text-[18px] sm:leading-7">
            EcoCash, OneMoney, InnBucks and every major bank are accepted here. Bank slips scan,
            parse, reconcile against the statement and issue a receipt — all by themselves.
          </p>
          <ChipRow
            items={[
              { icon: <CreditCard className="h-3.5 w-3.5" />, label: 'Mobile money' },
              { icon: <CreditCard className="h-3.5 w-3.5" />, label: 'Bank transfer' },
              { icon: <FileBadge2 className="h-3.5 w-3.5" />, label: 'Auto-reconcile slip' },
              { icon: <QrCode className="h-3.5 w-3.5" />,     label: 'Digital receipt' },
            ]}
          />
        </>
      ),
    },
    {
      key: 'parents',
      render: () => (
        <>
          <h1 className="text-display text-ink">
            <span className="block">Every mark, every fee, every notice —</span>
            <span className="block text-gradient-brand">the day the school releases it.</span>
          </h1>
          <p className="mt-5 max-w-xl text-body text-muted sm:text-[18px] sm:leading-7">
            One account, multiple children. Message teachers in the school&apos;s moderated channel,
            acknowledge announcements, book parent-teacher slots.
          </p>
          <ChipRow
            items={[
              { icon: <Users className="h-3.5 w-3.5" />,         label: 'Multi-child switcher' },
              { icon: <CalendarClock className="h-3.5 w-3.5" />, label: 'Book a meeting' },
              { icon: <MessageSquare className="h-3.5 w-3.5" />, label: 'Message teachers' },
              { icon: <FileBadge2 className="h-3.5 w-3.5" />,    label: 'Signed reports' },
            ]}
          />
        </>
      ),
    },
    {
      key: 'admin',
      render: () => (
        <>
          <h1 className="text-display text-ink">
            <span className="block">Monitor the school,</span>
            <span className="block text-gradient-brand">from one page.</span>
          </h1>
          <p className="mt-5 max-w-xl text-body text-muted sm:text-[18px] sm:leading-7">
            Administrators see students, teachers, fees and academic performance at a glance. Drill
            down when something looks off; delegate when it does not.
          </p>
          <ChipRow
            items={[
              { icon: <LineChart className="h-3.5 w-3.5" />,     label: 'KPIs at a glance' },
              { icon: <CalendarClock className="h-3.5 w-3.5" />, label: 'Attendance today' },
              { icon: <CreditCard className="h-3.5 w-3.5" />,    label: 'Fees live' },
              { icon: <Users className="h-3.5 w-3.5" />,         label: 'Form-teacher load' },
            ]}
          />
        </>
      ),
    },
  ];

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden pt-[64px]"
    >
      {/* Background photo — students in a class-like setting */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        <Image
          src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920&q=75&auto=format&fit=crop"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/92 to-white/25" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-surface" />
        <div className="absolute inset-0 bg-grain opacity-40 mix-blend-multiply" />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-5 pb-12 pt-8 sm:px-8 sm:pb-16 sm:pt-12 lg:pb-24 lg:pt-16">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-primary/15 bg-white/80 px-3 py-1 text-micro font-semibold uppercase tracking-[0.12em] text-brand-primary backdrop-blur-sm">
            <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-brand-primary" />
            Harare Heritage Academy · Est. 1987
          </div>

          <HeroCarousel slides={slides} intervalMs={6500} />

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/sign-in"
              className="inline-flex h-14 items-center gap-2 rounded-full bg-brand-primary px-8 text-body font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md"
            >
              Open my portal
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#services"
              className="inline-flex h-14 items-center gap-2 rounded-full border border-brand-primary/40 bg-transparent px-7 text-body font-semibold text-brand-primary transition hover:bg-brand-primary/10"
            >
              See what it does
            </Link>
          </div>

          <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-micro text-muted">
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
              ZDPA-compliant
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
              TLS · AES-256
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
              Works on a basic smartphone
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

function ChipRow({
  items,
}: {
  items: { icon: React.ReactNode; label: string }[];
}) {
  return (
    <ul className="mt-6 flex flex-wrap items-center gap-2">
      {items.map((it) => (
        <li
          key={it.label}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/90 px-3 py-1.5 text-small font-medium text-ink shadow-card-sm backdrop-blur-sm"
        >
          <span className="text-brand-primary" aria-hidden>
            {it.icon}
          </span>
          {it.label}
        </li>
      ))}
    </ul>
  );
}
