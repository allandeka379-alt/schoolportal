'use client';

import { useState, type ReactNode } from 'react';

import { HeadmasterSidebar } from './sidebar';
import { HeadmasterTopBar } from './top-bar';

/**
 * Administrator portal shell.
 *
 * Obsidian 260px sidebar, 64px top bar with breadcrumbs + command palette +
 * security chip + alerts bell, chart-dense executive workspace below.
 */
export function HeadmasterShell({
  accountName,
  children,
}: {
  accountName: string;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface text-ink">
      <div className="flex min-h-screen">
        <HeadmasterSidebar
          accountName={accountName}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <HeadmasterTopBar onOpenMobileNav={() => setMobileOpen(true)} />
          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
            <div className="mx-auto w-full max-w-[1320px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
