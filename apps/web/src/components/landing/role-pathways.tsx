import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Reveal } from './reveal';

const ROLES = [
  {
    number: '01',
    name: 'Student',
    href: '/sign-in?role=student',
    lines: [
      'Assignments. Marks. Digital library.',
      'Fees at a glance. Timetable.',
      'Everything you need for the term.',
    ],
  },
  {
    number: '02',
    name: 'Teacher',
    href: '/sign-in?role=teacher',
    lines: [
      'Classes, marking, reports.',
      'Lesson plans and resources.',
      'Parent messaging without numbers.',
    ],
  },
  {
    number: '03',
    name: 'Parent',
    href: '/sign-in?role=parent',
    lines: [
      "Your child's progress, as it happens.",
      'Fees. Announcements.',
      'Direct messaging to teachers.',
    ],
  },
] as const;

/**
 * Role pathways — §07 of the spec.
 *
 * Three cards on Sand-Light fills with a serif italic numeral top-left.
 * Entire card is a link; the "Enter →" affordance lives inside for clarity.
 * On hover: Level-2 shadow, numeral shifts Terracotta → Earth, a 2px
 * Terracotta bottom border draws left-to-right over 320ms.
 */
export function RolePathways() {
  return (
    <section
      id="pathways"
      aria-labelledby="pathways-heading"
      className="py-20 md:py-24"
    >
      <div className="hha-wrap">
        <h2 id="pathways-heading" className="sr-only">
          Role pathways
        </h2>
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
          {ROLES.map((r, i) => (
            <Reveal key={r.number} as="li" delayMs={i * 80}>
              <Link
                href={r.href}
                className="group relative block h-full min-h-[280px] overflow-hidden landing-card p-8 md:p-12"
              >
                <span className="font-display text-[40px] italic font-light leading-none text-terracotta transition-colors duration-300 ease-out-soft group-hover:text-earth">
                  {r.number}
                </span>
                <h3 className="mt-6 font-display text-[28px] font-normal text-ink">
                  {r.name}
                </h3>
                <ul className="mt-5 space-y-1.5">
                  {r.lines.map((line) => (
                    <li
                      key={line}
                      className="font-serif text-[17px] leading-snug text-stone"
                    >
                      <span className="mr-2 text-sand">—</span>
                      {line}
                    </li>
                  ))}
                </ul>
                <span className="mt-8 inline-flex items-center gap-1.5 font-sans text-sm font-medium text-terracotta">
                  Enter
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 ease-out-soft group-hover:translate-x-1"
                    aria-hidden
                    strokeWidth={1.5}
                  />
                </span>
                {/* Draw-in bottom border on hover */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-terracotta transition-transform duration-[320ms] ease-out-soft group-hover:scale-x-100"
                />
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
