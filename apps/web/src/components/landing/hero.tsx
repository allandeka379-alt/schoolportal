'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { HeroCarousel, type HeroSlide } from './hero-carousel';

/**
 * Landing hero.
 *
 * Full-bleed background photo softly washed toward white on the left so the
 * text always reads. The carousel rotates through five plain-spoken pitches,
 * one per role the portal serves.
 */

export function Hero() {
  const slides: HeroSlide[] = [
    {
      key: 'students',
      render: () => (
        <>
          <h1 className="text-display text-ink">
            <span className="block">One portal</span>
            <span className="block text-gradient-brand">for students.</span>
          </h1>
          <p className="mt-5 max-w-xl text-body text-muted sm:text-[18px] sm:leading-7">
            Assignments, grades, library, timetable and messages — everything a pupil needs for the
            term, in one place.
          </p>
        </>
      ),
    },
    {
      key: 'teachers',
      render: () => (
        <>
          <h1 className="text-display text-ink">
            <span className="block">Built for the way</span>
            <span className="block text-gradient-brand">teachers actually work.</span>
          </h1>
          <p className="mt-5 max-w-xl text-body text-muted sm:text-[18px] sm:leading-7">
            Gradebook, attendance, marking, lesson plans and end-of-term reports — a single console
            for every class the teacher runs.
          </p>
        </>
      ),
    },
    {
      key: 'fees',
      render: () => (
        <>
          <h1 className="text-display text-ink">
            <span className="block">Pay school fees,</span>
            <span className="block text-gradient-brand">your way.</span>
          </h1>
          <p className="mt-5 max-w-xl text-body text-muted sm:text-[18px] sm:leading-7">
            EcoCash, OneMoney, InnBucks, ZIPIT, bank transfer, Visa or Mastercard. Upload a bank
            slip if you prefer. Every payment gets a digital receipt.
          </p>
        </>
      ),
    },
    {
      key: 'parents',
      render: () => (
        <>
          <h1 className="text-display text-ink">
            <span className="block">Every child&apos;s progress,</span>
            <span className="block text-gradient-brand">live for parents.</span>
          </h1>
          <p className="mt-5 max-w-xl text-body text-muted sm:text-[18px] sm:leading-7">
            Marks, fees, attendance, announcements, reports and parent-teacher meetings — one
            account for the whole family.
          </p>
        </>
      ),
    },
    {
      key: 'admin',
      render: () => (
        <>
          <h1 className="text-display text-ink">
            <span className="block">Run the whole school</span>
            <span className="block text-gradient-brand">from one dashboard.</span>
          </h1>
          <p className="mt-5 max-w-xl text-body text-muted sm:text-[18px] sm:leading-7">
            Enrolment, academics, fees, staff and attendance — monitored by the bursar and the
            headmaster at a glance.
          </p>
        </>
      ),
    },
  ];

  return (
    <section id="top" className="relative isolate overflow-hidden pt-[64px]">
      {/* Background photo — Junior High School students, Masvingo */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        <Image
          src="/landing/jhs-students.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_30%]"
        />
        {/* Soft left-to-right wash so the text is always readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/10" />
        {/* Top + bottom fades that blend the photo into the page */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-surface" />
        {/* Subtle grain for the print-feel */}
        <div className="absolute inset-0 bg-grain opacity-40 mix-blend-multiply" />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-5 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-14 lg:pb-28 lg:pt-20">
        <div className="max-w-2xl">
          <HeroCarousel slides={slides} intervalMs={6500} />

          <div className="mt-10 flex flex-wrap items-center gap-3">
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
        </div>
      </div>
    </section>
  );
}
