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
    title: 'Paynow verified',
    subtitle: 'Secure local payment rail',
  },
  {
    icon: Clock,
    title: 'Support',
    subtitle: 'Mon–Fri · 07:00 – 18:00 CAT',
  },
];

export function TrustSecurity() {
  return (
    <section
      id="support"
      aria-label="Trust and security"
      className="border-y border-line bg-card py-10"
    >
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
          {MARKS.map((m) => {
            const Icon = m.icon;
            return (
              <li key={m.title} className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-md bg-brand-primary/10 text-brand-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                </span>
                <div>
                  <p className="text-small font-semibold text-ink">{m.title}</p>
                  <p className="mt-0.5 text-micro text-muted">{m.subtitle}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
