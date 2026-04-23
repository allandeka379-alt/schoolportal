import Link from 'next/link';
import {
  ArrowLeft,
  Briefcase,
  GraduationCap,
  LifeBuoy,
  Lock,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

import { Logo } from '@/components/ui/logo';

import { SignInForm } from './sign-in-form';

interface PageProps {
  searchParams?: Promise<{ next?: string; error?: string; role?: string }>;
}

interface DemoUser {
  key: 'student' | 'teacher' | 'parent' | 'admin' | 'headmaster';
  role: string;
  email: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  tone: 'brand' | 'gold' | 'info' | 'success' | 'warning';
  destination: string;
}

const DEMO_USERS: DemoUser[] = [
  {
    key: 'student',
    role: 'Student',
    email: 'student@hha.ac.zw',
    subtitle: 'Farai Moyo · Form 4A',
    description: 'Assignments, grades, library, timetable, messages.',
    icon: GraduationCap,
    tone: 'success',
    destination: '/student',
  },
  {
    key: 'teacher',
    role: 'Teacher',
    email: 'teacher@hha.ac.zw',
    subtitle: 'Mrs M. Dziva · Mathematics · Form Teacher 4A',
    description: 'Gradebook, attendance, marking, lesson plans, reports.',
    icon: Briefcase,
    tone: 'brand',
    destination: '/teacher',
  },
  {
    key: 'parent',
    role: 'Parent',
    email: 'parent@hha.ac.zw',
    subtitle: 'Mrs S. Moyo · 3 children',
    description: 'Fees, progress, reports, messages, calendar.',
    icon: Users,
    tone: 'info',
    destination: '/parent',
  },
  {
    key: 'admin',
    role: 'Bursar / Administrator',
    email: 'bursar@hha.ac.zw',
    subtitle: 'Fees · slip reconciliation · receipts',
    description: 'Ledger, bank-slip queue, receipts, audit log, announcements.',
    icon: LifeBuoy,
    tone: 'warning',
    destination: '/admin',
  },
  {
    key: 'headmaster',
    role: 'Headmaster',
    email: 'head@hha.ac.zw',
    subtitle: 'Mr T. Moyo · Whole-school oversight',
    description: 'Academic, fees, teachers, students, alerts.',
    icon: Sparkles,
    tone: 'gold',
    destination: '/headmaster',
  },
];

const DEMO_PASSWORD = 'HHA!Portal2026';

const TONE_BG: Record<DemoUser['tone'], string> = {
  brand: 'bg-brand-primary/10 text-brand-primary',
  gold: 'bg-brand-accent/15 text-brand-accent',
  info: 'bg-info/10 text-info',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
};

/**
 * Sign-in surface — standard split-screen login.
 *
 *   Left:  branded hero panel (crest, tagline, security badges, quote)
 *   Right: form card + demo accounts strip (all 5 roles incl. Headmaster)
 */
export default async function SignInPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};

  return (
    <main className="relative min-h-screen bg-surface">
      <div className="mx-auto grid min-h-screen w-full max-w-[1400px] grid-cols-1 lg:grid-cols-[1fr_minmax(460px,520px)]">
        {/* ─── Left: brand panel ─── */}
        <aside className="relative hidden overflow-hidden bg-brand-primary text-white lg:block">
          {/* decorative layers */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.15) 0%, transparent 45%)',
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, rgba(255,255,255,0.18) 0 1px, transparent 1px 18px)',
            }}
          />

          <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
            {/* Top — crest + link back */}
            <div className="flex items-center justify-between">
              <Logo size={40} showText variant="on-dark" asLink />
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-micro font-semibold text-white transition-colors hover:bg-white/15"
              >
                <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                Back to landing
              </Link>
            </div>

            {/* Middle — headline + quote */}
            <div className="mt-16 max-w-lg xl:mt-20">
              <p className="text-micro font-semibold uppercase tracking-[0.22em] text-white/75">
                Harare Heritage Academy
              </p>
              <h1 className="mt-3 text-[clamp(2rem,3.6vw,3rem)] font-bold leading-tight tracking-tight">
                One portal for every role at the school.
              </h1>
              <p className="mt-4 text-small leading-relaxed text-white/85">
                Students, teachers, parents, the bursar and the headmaster all sign in here. Your
                role decides what you see.
              </p>
              <blockquote className="mt-10 border-l-2 border-white/30 pl-4">
                <p className="text-small italic leading-relaxed text-white/90">
                  &ldquo;We built this so a parent in London can upload a bank slip, and the bursar
                  in Harare can reconcile it before the bell rings.&rdquo;
                </p>
                <footer className="mt-3 text-micro font-semibold uppercase tracking-[0.14em] text-white/70">
                  Mr T. Moyo · Headmaster
                </footer>
              </blockquote>
            </div>

            {/* Bottom — trust strip */}
            <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 text-micro text-white/85">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                TLS 1.3 · AES-256 at rest
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                Data Protection Act [Chapter 11:24]
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                2FA on every staff account
              </span>
            </div>
          </div>
        </aside>

        {/* ─── Right: form ─── */}
        <section className="relative flex flex-col justify-center overflow-hidden bg-card px-5 py-10 sm:px-10 sm:py-14 lg:py-20">
          {/* Mobile header — visible only below lg */}
          <header className="mb-8 flex items-center justify-between lg:hidden">
            <Logo size={32} showText asLink variant="on-light" />
            <Link
              href="/"
              className="text-small font-medium text-muted transition-colors hover:text-brand-primary"
            >
              ← Back
            </Link>
          </header>

          <div className="mx-auto w-full max-w-md">
            <div className="mb-7">
              <p className="inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-primary/5 px-3 py-1 text-micro font-semibold uppercase tracking-[0.12em] text-brand-primary">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-primary" />
                Secure sign-in
              </p>
              <h2 className="mt-3 text-h1 text-ink">Welcome back</h2>
              <p className="mt-1 text-small text-muted">
                Sign in with your HHA credentials. We&rsquo;ll route you to the right portal
                automatically.
              </p>
            </div>

            <SignInForm next={params.next} initialError={params.error} />

            {/* Divider */}
            <div className="my-8 flex items-center gap-3 text-micro font-semibold uppercase tracking-[0.12em] text-muted">
              <span className="h-px flex-1 bg-line" />
              Demo accounts
              <span className="h-px flex-1 bg-line" />
            </div>

            {/* Demo accounts — all 5 roles */}
            <div className="rounded-lg border border-line bg-surface/40 p-4">
              <p className="text-small text-ink">
                Every demo account uses the same password:{' '}
                <code className="rounded bg-card px-1.5 py-0.5 font-mono text-micro text-brand-primary shadow-card-sm">
                  {DEMO_PASSWORD}
                </code>
              </p>
              <ul className="mt-4 space-y-2">
                {DEMO_USERS.map((u) => {
                  const Icon = u.icon;
                  return (
                    <li key={u.email}>
                      <button
                        type="button"
                        data-sign-in-fill={u.email}
                        className="group flex w-full items-center gap-3 rounded-md border border-line bg-card p-3 text-left transition-colors hover:border-brand-primary/30 hover:bg-brand-primary/[0.03]"
                      >
                        <span
                          className={`inline-flex h-10 w-10 flex-none items-center justify-center rounded-md ${TONE_BG[u.tone]}`}
                        >
                          <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-small font-semibold text-ink">{u.role}</p>
                          <p className="truncate text-micro text-muted">{u.subtitle}</p>
                          <p className="mt-1 truncate text-micro text-muted">{u.email}</p>
                        </div>
                        <span className="rounded-full border border-line bg-card px-2.5 py-1 text-micro font-semibold text-brand-primary transition-colors group-hover:border-brand-primary/30 group-hover:bg-brand-primary/5">
                          Use
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <p className="mt-6 text-center text-micro text-muted">
              By signing in you accept the{' '}
              <Link href="#" className="font-semibold text-brand-primary hover:underline">
                acceptable use policy
              </Link>{' '}
              and the{' '}
              <Link href="#" className="font-semibold text-brand-primary hover:underline">
                privacy notice
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
