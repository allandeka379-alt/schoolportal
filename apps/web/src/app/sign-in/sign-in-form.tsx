'use client';

import { useState, useTransition } from 'react';

import { Alert, Button, Input, Label } from '@hha/ui';

import { signInAction } from '@/lib/auth/actions';

interface Props {
  next?: string;
  initialError?: string;
}

export function SignInForm({ next, initialError }: Props) {
  const [error, setError] = useState<string | undefined>(initialError);
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError(undefined);
    startTransition(async () => {
      const result = await signInAction(form);
      if (result?.error) setError(result.error);
    });
  }

  function fill(email: string) {
    const form = document.getElementById('sign-in-form') as HTMLFormElement | null;
    if (!form) return;
    (form.elements.namedItem('email') as HTMLInputElement).value = email;
    (form.elements.namedItem('password') as HTMLInputElement).value = 'HHA!Portal2026';
  }

  return (
    <form id="sign-in-form" className="space-y-5" onSubmit={onSubmit} noValidate>
      {error ? (
        <Alert tone="danger" title="We could not sign you in">
          {error}
        </Alert>
      ) : null}

      <input type="hidden" name="next" value={next ?? ''} />

      <div>
        <Label htmlFor="email" required>
          Email address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@hha.ac.zw"
          required
        />
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <Label htmlFor="password" required>
            Password
          </Label>
          <a
            href="#"
            className="text-xs text-heritage-700 underline-offset-4 hover:underline"
          >
            Forgot your password?
          </a>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••••••"
          required
        />
      </div>

      <Button type="submit" loading={isPending} fullWidth>
        Sign in
      </Button>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-granite-200">
        <button
          type="button"
          onClick={() => fill('student@hha.ac.zw')}
          className="text-xs text-granite-600 hover:text-heritage-800 text-left"
        >
          ↪ Quick-fill student
        </button>
        <button
          type="button"
          onClick={() => fill('teacher@hha.ac.zw')}
          className="text-xs text-granite-600 hover:text-heritage-800 text-left"
        >
          ↪ Quick-fill teacher
        </button>
        <button
          type="button"
          onClick={() => fill('parent@hha.ac.zw')}
          className="text-xs text-granite-600 hover:text-heritage-800 text-left"
        >
          ↪ Quick-fill parent
        </button>
        <button
          type="button"
          onClick={() => fill('bursar@hha.ac.zw')}
          className="text-xs text-granite-600 hover:text-heritage-800 text-left"
        >
          ↪ Quick-fill bursar
        </button>
      </div>
    </form>
  );
}
