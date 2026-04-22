import { Clock, Lock, ShieldCheck, Wallet } from 'lucide-react';

const MARKS = [
  {
    icon: ShieldCheck,
    title: 'Data Protection Act',
    subtitle: 'Compliant with [Chapter 11:24]',
  },
  {
    icon: Lock,
    title: 'Encryption',
    subtitle: 'TLS in transit · AES-256 at rest',
  },
  {
    icon: Wallet,
    title: 'Paynow Verified',
    subtitle: 'Secure local payment rail',
  },
  {
    icon: Clock,
    title: 'Support',
    subtitle: 'Mon–Fri · 07:00 – 18:00 CAT',
  },
] as const;

/**
 * Trust & security — §13 of the spec.
 *
 * A thin strip of four marks. Icons in 1.5px Lucide stroke / Earth; titles
 * in Inter 15/600 Ink; subtitles in Source Serif italic 14 Stone.
 */
export function TrustSecurity() {
  return (
    <section
      id="support"
      aria-label="Trust and security"
      className="border-y border-sand bg-cream py-12 md:py-14"
    >
      <div className="hha-wrap">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {MARKS.map((m) => {
            const Icon = m.icon;
            return (
              <li key={m.title} className="flex items-start gap-4">
                <Icon
                  className="h-6 w-6 flex-none text-earth"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <div>
                  <p className="font-sans text-[15px] font-semibold text-ink">
                    {m.title}
                  </p>
                  <p className="mt-1 font-serif text-[14px] italic text-stone">
                    {m.subtitle}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
