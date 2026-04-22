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
 * Footer — v2.0.
 *
 * Obsidian surface, Fog text, accent section eyebrows. Brand column, four
 * nav columns, a motto ribbon in Space Grotesk medium, bottom rail.
 */
export function LandingFooter() {
  return (
    <footer className="bg-obsidian text-fog">
      <div className="hha-wrap py-16 md:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <LandingCrest size={40} variant="cream" />
              <span className="leading-tight">
                <span
                  className="block font-mono text-[11px] font-medium uppercase tracking-[0.18em]"
                  style={{ color: 'rgb(var(--accent))' }}
                >
                  Harare Heritage Academy
                </span>
                <span className="block font-display text-[18px] font-medium text-snow">
                  HHA Portal
                </span>
              </span>
            </div>
            <p className="mt-6 max-w-xs font-sans text-[13px] leading-relaxed text-steel">
              &ldquo;Tinobata Nzira Yekuziva.&rdquo;
            </p>
          </div>

          {/* Nav columns */}
          {COLS.map((col) => (
            <div key={col.heading}>
              <p
                className="font-mono text-[11px] font-medium uppercase tracking-[0.18em]"
                style={{ color: 'rgb(var(--accent))' }}
              >
                {col.heading}
              </p>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="font-sans text-[14px] text-fog transition-colors hover:text-snow hover:underline hover:underline-offset-4"
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
      <div className="border-y border-graphite py-5 text-center">
        <p
          className="font-display text-[22px] font-medium tracking-tight"
          style={{ color: 'rgb(var(--accent))' }}
        >
          Tinobata Nzira Yekuziva — we hold the path of knowledge.
        </p>
      </div>

      {/* Bottom rail */}
      <div className="hha-wrap flex flex-wrap items-center justify-between gap-4 py-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-steel">
          © 2026 Harare Heritage Academy · v2.0
        </p>
        <div
          role="radiogroup"
          aria-label="Language"
          className="flex items-center gap-1 font-mono text-[11px] font-medium uppercase tracking-[0.1em]"
        >
          {(['EN', 'SN', 'ND'] as const).map((code, i) => (
            <span key={code} className="flex items-center gap-1">
              {i > 0 ? <span className="text-graphite">·</span> : null}
              <span
                className={
                  code === 'EN' ? 'text-snow' : 'text-steel hover:text-snow'
                }
              >
                {code}
              </span>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4 text-steel">
          <Link href="#" aria-label="Facebook" className="hover:text-snow">
            <Facebook className="h-4 w-4" strokeWidth={1.5} />
          </Link>
          <Link href="#" aria-label="Instagram" className="hover:text-snow">
            <Instagram className="h-4 w-4" strokeWidth={1.5} />
          </Link>
          <Link href="#" aria-label="LinkedIn" className="hover:text-snow">
            <Linkedin className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
