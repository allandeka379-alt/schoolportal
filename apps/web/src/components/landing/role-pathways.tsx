import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Reveal } from './reveal';

type Accent = 'indigo' | 'emerald' | 'coral';

const ROLES: readonly {
  number: string;
  name: string;
  href: string;
  accent: Accent;
  lines: readonly string[];
}[] = [
  {
    number: '01',
    name: 'Student',
    href: '/sign-in?role=student',
    accent: 'indigo',
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
    accent: 'emerald',
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
    accent: 'coral',
    lines: [
      "Your child's progress, as it happens.",
      'Fees. Announcements.',
      'Direct messaging to teachers.',
    ],
  },
];

const ACCENT_RGB: Record<Accent, string> = {
  indigo: '91 92 255',
  emerald: '0 179 126',
  coral: '255 91 122',
};

/**
 * Role pathways — v2.0.
 *
 * Three cards on Snow fills with a mono numeral top-left tinted to the
 * role's accent colour. Whole card is a Link; a 2px accent border draws
 * left→right on hover.
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
                className="group relative block h-full min-h-[280px] overflow-hidden rounded-md border border-mist bg-snow p-8 transition-shadow duration-200 ease-out-soft hover:shadow-e2 md:p-12"
              >
                <span
                  className="font-mono text-[13px] font-medium uppercase tracking-[0.2em]"
                  style={{ color: `rgb(${ACCENT_RGB[r.accent]})` }}
                >
                  {r.number} · {r.accent}
                </span>
                <h3 className="mt-6 font-display text-[28px] font-medium leading-tight tracking-tight text-obsidian">
                  {r.name}
                </h3>
                <ul className="mt-5 space-y-1.5">
                  {r.lines.map((line) => (
                    <li
                      key={line}
                      className="flex items-start gap-3 font-sans text-[15px] leading-snug text-slate"
                    >
                      <span
                        aria-hidden
                        className="mt-2.5 h-1 w-1 flex-none rounded-full"
                        style={{ backgroundColor: `rgb(${ACCENT_RGB[r.accent]})` }}
                      />
                      {line}
                    </li>
                  ))}
                </ul>
                <span
                  className="mt-8 inline-flex items-center gap-1.5 font-sans text-sm font-medium"
                  style={{ color: `rgb(${ACCENT_RGB[r.accent]})` }}
                >
                  Enter
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 ease-out-soft group-hover:translate-x-1"
                    aria-hidden
                    strokeWidth={1.5}
                  />
                </span>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition-transform duration-[320ms] ease-out-soft group-hover:scale-x-100"
                  style={{ backgroundColor: `rgb(${ACCENT_RGB[r.accent]})` }}
                />
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
