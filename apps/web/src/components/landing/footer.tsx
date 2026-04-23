import Link from 'next/link';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

import { Logo } from '@/components/ui/logo';

const COLS = [
  {
    heading: 'Portal',
    links: [
      { label: 'Student',       href: '/sign-in?role=student' },
      { label: 'Teacher',       href: '/sign-in?role=teacher' },
      { label: 'Parent',        href: '/sign-in?role=parent' },
      { label: 'Administrator', href: '/sign-in?role=headmaster' },
      { label: 'Bursary',       href: '/sign-in?role=admin' },
    ],
  },
  {
    heading: 'School',
    links: [
      { label: 'About HHA',     href: '#about' },
      { label: 'Academics',     href: '#services' },
      { label: 'Admissions',    href: '#admissions' },
      { label: 'Alumni',        href: '#alumni' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Help centre',   href: '#support' },
      { label: 'Contact us',    href: '#contact' },
      { label: 'Accessibility', href: '#accessibility' },
      { label: 'Privacy',       href: '#privacy' },
    ],
  },
  {
    heading: 'Contact',
    links: [
      { label: '+263 242 123 456',        href: 'tel:+263242123456' },
      { label: 'info@hha.ac.zw',          href: 'mailto:info@hha.ac.zw' },
      { label: '42 Samora Avenue, Harare',href: '#location' },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="bg-card">
      {/* Main columns */}
      <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Logo size={36} showText variant="on-light" />
            <p className="mt-5 max-w-xs text-small text-muted">
              Software for the academic life of Harare Heritage Academy — students, teachers,
              parents, administrators, one portal.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.heading}>
              <p className="text-micro font-semibold uppercase tracking-[0.14em] text-brand-primary">
                {col.heading}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-small text-muted transition-colors hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Motto ribbon */}
      <div className="border-y border-line bg-surface/60 py-5 text-center">
        <p className="text-small font-semibold tracking-tight text-brand-primary">
          Tinobata Nzira Yekuziva — we hold the path of knowledge.
        </p>
      </div>

      {/* Bottom rail */}
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-5 py-5 sm:px-8">
        <p className="text-micro text-muted">
          © 2026 Harare Heritage Academy · All rights reserved
        </p>
        <div className="flex items-center gap-3 text-muted">
          <Link href="#" aria-label="Facebook" className="transition-colors hover:text-brand-primary">
            <Facebook className="h-4 w-4" strokeWidth={1.5} />
          </Link>
          <Link href="#" aria-label="Instagram" className="transition-colors hover:text-brand-primary">
            <Instagram className="h-4 w-4" strokeWidth={1.5} />
          </Link>
          <Link href="#" aria-label="LinkedIn" className="transition-colors hover:text-brand-primary">
            <Linkedin className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
