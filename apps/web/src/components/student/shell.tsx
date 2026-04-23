'use client';

import { useState, type ReactNode } from 'react';

import { StudentSidebar } from './sidebar';
import { StudentTopBar } from './top-bar';

/**
 * Student portal shell — client-side wrapper that manages the mobile sidebar
 * open/closed state and composes the sidebar + top bar + main content area.
 *
 * Visual scaffold:
 *
 *   +---------+------------------------------+
 *   |         | top bar (64px)               |
 *   | sidebar +------------------------------+
 *   | (240)   |                              |
 *   |         | main (flexible)              |
 *   |         |                              |
 *   +---------+------------------------------+
 */
export function StudentShell({
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
    <div className="min-h-screen bg-surface text-ink">
      <div className="flex min-h-screen">
        <StudentSidebar
          accountName={accountName}
          accountMeta={accountMeta}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <StudentTopBar onOpenMobileNav={() => setMobileOpen(true)} />
          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
            <div className="mx-auto w-full max-w-[1200px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
