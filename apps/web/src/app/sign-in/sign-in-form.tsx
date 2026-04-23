'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';

import { signInAction } from '@/lib/auth/actions';

interface Props {
  next?: string;
  initialError?: string;
}

const DEMO_PASSWORD = 'JHS!Portal2026';

export function SignInForm({ next, initialError }: Props) {
  const [error, setError] = useState<string | undefined>(initialError);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, startTransition] = useTransition();

  const formRef = useRef<HTMLFormElement | null>(null);

  // Wire the "Use" buttons on the demo-accounts list in the parent page.
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const btn = target.closest('[data-sign-in-fill]') as HTMLButtonElement | null;
      if (!btn) return;
      const addr = btn.getAttribute('data-sign-in-fill');
      if (!addr) return;
      setEmail(addr);
      setPassword(DEMO_PASSWORD);
      setError(undefined);
      // Focus the submit button so the parent can hit Enter immediately.
      setTimeout(() => {
        const submit = formRef.current?.querySelector<HTMLButtonElement>(
          'button[type="submit"]',
        );
        submit?.focus();
      }, 0);
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError(undefined);
    startTransition(async () => {
      const result = await signInAction(form);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form
      ref={formRef}
      id="sign-in-form"
      className="space-y-5"
      onSubmit={onSubmit}
      noValidate
      autoComplete="on"
    >
      {error ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-md border border-danger/30 bg-danger/[0.05] px-4 py-3"
        >
          <AlertCircle
            className="mt-0.5 h-4 w-4 flex-none text-danger"
            strokeWidth={1.75}
            aria-hidden
          />
          <div>
            <p className="text-small font-semibold text-danger">We could not sign you in</p>
            <p className="mt-0.5 text-micro text-danger/80">{error}</p>
          </div>
        </div>
      ) : null}

      <input type="hidden" name="next" value={next ?? ''} />

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-micro font-semibold uppercase tracking-[0.12em] text-muted"
        >
          Email address
        </label>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            strokeWidth={1.75}
            aria-hidden
          />
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@jhs.ac.zw"
            required
            className="h-11 w-full rounded-md border border-line bg-card pl-9 pr-3 text-small text-ink placeholder:text-muted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <label
            htmlFor="password"
            className="text-micro font-semibold uppercase tracking-[0.12em] text-muted"
          >
            Password
          </label>
          <a
            href="#"
            className="text-micro font-semibold text-brand-primary underline-offset-4 hover:underline"
          >
            Forgot your password?
          </a>
        </div>
        <div className="relative">
          <Lock
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            strokeWidth={1.75}
            aria-hidden
          />
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="••••••••••••"
            required
            className="h-11 w-full rounded-md border border-line bg-card pl-9 pr-10 text-small text-ink placeholder:text-muted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-2 text-muted transition-colors hover:bg-surface hover:text-ink"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" strokeWidth={1.75} />
            ) : (
              <Eye className="h-4 w-4" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>

      {/* Remember + 2FA hint */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="inline-flex cursor-pointer select-none items-center gap-2 text-small text-ink">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-line accent-brand-primary"
          />
          Keep me signed in on this device
        </label>
        <span className="text-micro text-muted">Staff accounts require 2FA</span>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-primary text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md disabled:opacity-60"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} aria-hidden />
        ) : null}
        {isPending ? 'Signing in…' : 'Sign in'}
        {!isPending ? (
          <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        ) : null}
      </button>
    </form>
  );
}
