import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  CreditCard,
  GraduationCap,
  LineChart,
  MessageSquare,
  NotebookPen,
  Users,
} from 'lucide-react';

/**
 * Services grid — 8 tiles describing what the portal does. Designed as a
 * responsive card grid (1 / 2 / 3 / 4 columns at sm / md / lg / xl). Each
 * tile links to the part of the portal that does that thing (signed-in
 * users land in the right place; signed-out users fall into /sign-in).
 */

const SERVICES = [
  {
    icon: NotebookPen,
    title: 'Set &amp; submit assignments',
    body: 'Teachers release work, students submit, marking happens — all without a single sheet of paper leaving the staff room.',
    href: '/sign-in?next=/student/assignments',
  },
  {
    icon: LineChart,
    title: 'Track academic progress',
    body: 'Per-subject trends over six terms. Students see their own progress; parents see their children; administrators see the whole school.',
    href: '/sign-in?next=/student/grades',
  },
  {
    icon: CreditCard,
    title: 'Pay fees any way',
    body: 'EcoCash, OneMoney, InnBucks, ZIPIT, CBZ, Stanbic, Steward and ZB — the rails Zimbabwean families actually use.',
    href: '/sign-in?next=/parent/fees',
  },
  {
    icon: MessageSquare,
    title: 'Message teachers',
    body: 'Moderated, logged, and only during school hours. Template replies in Shona and Ndebele. No phone-number trading.',
    href: '/sign-in?next=/parent/messages',
  },
  {
    icon: BookOpen,
    title: 'Digital library',
    body: 'Past papers, lesson recordings, textbooks and worksheets. Bookmark anything for offline access from a boarding room.',
    href: '/sign-in?next=/student/library',
  },
  {
    icon: CalendarCheck,
    title: 'Attendance &amp; timetable',
    body: 'Period-level register, heatmap view, "explain an absence" in one tap. Planned absences go in with 24-hour notice.',
    href: '/sign-in?next=/student/timetable',
  },
  {
    icon: GraduationCap,
    title: 'End-of-term reports',
    body: 'Report cards signed by form teacher and administrator, released as watermarked PDFs, compared side-by-side across terms.',
    href: '/sign-in?next=/parent/reports',
  },
  {
    icon: Users,
    title: 'Administrator oversight',
    body: 'One dashboard across students, teachers, fees and academic performance. Click any row, see the story.',
    href: '/sign-in?next=/headmaster',
  },
];

export function ServicesGrid() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative border-t border-line bg-card py-16 sm:py-20"
    >
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-primary/15 bg-brand-primary/5 px-3 py-1 text-micro font-semibold uppercase tracking-[0.12em] text-brand-primary">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-primary" />
              What it does
            </p>
            <h2 id="services-heading" className="text-h1 text-ink">
              Every workflow a school runs on,{' '}
              <span className="text-gradient-brand">in one portal.</span>
            </h2>
            <p className="mt-3 text-body text-muted sm:text-[17px] sm:leading-7">
              Eight things the portal does well. Click any of them to sign in straight to that part
              of the product — the portal will route you to your role.
            </p>
          </div>
        </div>

        <ul className="stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <li key={s.title}>
                <Link
                  href={s.href}
                  className="hover-lift group relative flex h-full flex-col gap-3 rounded-lg border border-line bg-card p-5 transition-colors"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-primary/10 text-brand-primary transition-colors group-hover:bg-brand-primary group-hover:text-white">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <h3
                    className="text-h3 text-ink"
                    dangerouslySetInnerHTML={{ __html: s.title }}
                  />
                  <p
                    className="text-small text-muted"
                    dangerouslySetInnerHTML={{ __html: s.body }}
                  />
                  <span className="mt-auto inline-flex items-center gap-1 text-small font-semibold text-brand-primary">
                    Open
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
