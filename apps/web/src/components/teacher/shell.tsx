'use client';

import { useState, type ReactNode } from 'react';

import { TeacherSidebar } from './sidebar';
import { TeacherTopBar } from './top-bar';

/**
 * Teacher portal shell — composes the 260px editorial sidebar, 64px top
 * utility bar, and the main workspace area.
 *
 * Spec reference: §03 Global UI Patterns.
 */
export function TeacherShell({
  accountName,
  accountMeta,
  isHod,
  isFormTeacher,
  children,
}: {
  accountName: string;
  accountMeta: string;
  isHod?: boolean;
  isFormTeacher?: boolean;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface text-ink">
      <div className="flex min-h-screen">
        <TeacherSidebar
          accountName={accountName}
          accountMeta={accountMeta}
          isHod={isHod}
          isFormTeacher={isFormTeacher}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <TeacherTopBar onOpenMobileNav={() => setMobileOpen(true)} />
          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
            <div className="mx-auto w-full max-w-[1280px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
