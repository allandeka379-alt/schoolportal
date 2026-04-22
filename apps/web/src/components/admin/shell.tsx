'use client';

import { useState, type ReactNode } from 'react';

import { AdminSidebar } from './sidebar';
import { AdminTopBar } from './top-bar';

/**
 * Admin back-office shell — v2.0.
 *
 * Obsidian 260px sidebar + 64px snow top bar. Amber accent via the
 * `portal-admin` scope class so every descendant's --accent resolves to
 * the bursar amber.
 */
export function AdminShell({
  accountName,
  accountMeta,
  children,
}: {
  accountName: string;
  accountMeta: string;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="portal-admin min-h-screen bg-snow">
      <div className="flex min-h-screen">
        <AdminSidebar
          accountName={accountName}
          accountMeta={accountMeta}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopBar onOpenMobileNav={() => setMobileOpen(true)} />
          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
            <div className="mx-auto w-full max-w-[1320px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
