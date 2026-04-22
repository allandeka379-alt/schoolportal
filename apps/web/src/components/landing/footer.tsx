import Link from 'next/link';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

import { LandingCrest } from './crest';

const COLS = [
  {
    heading: 'Portal',
    links: [
      { label: 'Student sign-in', href: '/sign-in?role=student' },
      { label: 'Teacher sign-in', href: '/sign-in?role=teacher' },
      { label: 'Parent sign-in', href: '/sign-in?role=parent' },
      { label: 'Admin', href: '/sign-in' },
    ],
  },
  {
    heading: 'School',
    links: [
      { label: 'About HHA', href: '#about' },
      { label: 'Academics', href: '#academics' },
      { label: 'Admissions', href: '#admissions' },
      { label: 'Alumni', href: '#alumni' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Help centre', href: '#help' },
      { label: 'Contact us', href: '#contact' },
      { label: 'Accessibility', href: '#accessibility' },
      { label: 'Privacy', href: '#privacy' },
    ],
  },
  {
    heading: 'Contact',
    links: [
      { label: '+263 242 123 456', href: 'tel:+263242123456' },
      { label: 'info@hha.ac.zw', href: 'mailto:info@hha.ac.zw' },
      { label: '42 Samora Avenue, Harare', href: '#location' },
    ],
  },
] as const;

/**
 * Footer — §14 of the spec.
 *
 * Ink-soft surface, Sand text, Ochre section headers. Five columns on
 * desktop (brand + four nav cols), stacking to 3 then 2 on mobile.
 * Followed by a motto ribbon in Fraunces italic Ochre, then a bottom rail.
 */
export function LandingFooter() {
  return (
    <footer className="bg-ink-soft text-sand">
      <div className="hha-wrap py-16 md:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <LandingCrest size={40} variant="cream" />
              <span className="font-display text-[20px] leading-tight text-cream">
                Harare Heritage
                <br />
                <span className="italic font-light text-sand">Academy</span>
              </span>
            </div>
            <p className="mt-6 max-w-xs font-serif text-[14px] italic leading-relaxed text-sand/70">
              &ldquo;Tinobata Nzira Yekuziva.&rdquo;
            </p>
          </div>

          {/* Nav columns */}
          {COLS.map((col) => (
            <div key={col.heading}>
              <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.2em] text-ochre">
                {col.heading}
              </p>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="font-sans text-[14px] text-sand transition-colors hover:text-cream hover:underline hover:underline-offset-4"
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
      <div className="border-y border-earth/60 py-5 text-center">
        <p className="font-display text-[22px] italic font-light text-ochre">
          Tinobata Nzira Yekuziva — we hold the path of knowledge.
        </p>
      </div>

      {/* Bottom rail */}
      <div className="hha-wrap flex flex-wrap items-center justify-between gap-4 py-6">
        <p className="font-sans text-[13px] text-stone">
          © 2026 Harare Heritage Academy. All rights reserved.
        </p>
        <div
          role="radiogroup"
          aria-label="Language"
          className="flex items-center gap-1 font-sans text-[12px] font-medium"
        >
          {(['EN', 'SN', 'ND'] as const).map((code, i) => (
            <span key={code} className="flex items-center gap-1">
              {i > 0 ? <span className="text-earth">·</span> : null}
              <span
                className={
                  code === 'EN' ? 'text-cream' : 'text-stone hover:text-cream'
                }
              >
                {code}
              </span>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4 text-sand">
          <Link href="#" aria-label="Facebook" className="hover:text-cream">
            <Facebook className="h-4 w-4" strokeWidth={1.5} />
          </Link>
          <Link href="#" aria-label="Instagram" className="hover:text-cream">
            <Instagram className="h-4 w-4" strokeWidth={1.5} />
          </Link>
          <Link href="#" aria-label="LinkedIn" className="hover:text-cream">
            <Linkedin className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
