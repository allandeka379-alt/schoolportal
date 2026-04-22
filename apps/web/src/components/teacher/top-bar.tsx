'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  Bell,
  BookOpen,
  ChevronDown,
  Menu,
  MessageSquarePlus,
  Plus,
  Search,
  Upload,
  type LucideIcon,
} from 'lucide-react';

import { TEACHER_CLASSES, classLabel } from '@/lib/mock/teacher-extras';

import { TEACHER_NAV } from './sidebar';

const NOTIFICATIONS = [
  { id: 'tn1', title: "New message from Mr Ndlovu", preview: "Re: Tapiwa's declining marks", when: '10 min ago', unread: true },
  { id: 'tn2', title: '18 submissions arrived overnight', preview: 'Form 4A · Problem Set 7', when: '2 h ago', unread: true },
  { id: 'tn3', title: 'HOD flagged a report for revision', preview: 'Chipo Banda · term 2 comment', when: '4 h ago', unread: false },
  { id: 'tn4', title: 'Staff notice from Head', preview: 'Friday inset day — agenda attached.', when: 'yesterday', unread: false },
];

function humanise(seg: string): string {
  return seg.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildCrumbs(pathname: string): { label: string; href: string }[] {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length <= 1) return [];
  const crumbs: { label: string; href: string }[] = [{ label: 'Console', href: '/teacher' }];
  let cursor = '';
  for (let i = 0; i < parts.length; i += 1) {
    cursor += '/' + parts[i];
    if (i === 0) continue;
    const match = TEACHER_NAV.flatMap((g) => g.items).find((n) => n.href === cursor);
    crumbs.push({ label: match?.label ?? humanise(parts[i] ?? ''), href: cursor });
  }
  return crumbs;
}

export function TeacherTopBar({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const pathname = usePathname();
  const crumbs = useMemo(() => buildCrumbs(pathname), [pathname]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [classOpen, setClassOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(TEACHER_CLASSES[0]);

  const unread = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-sand bg-cream/92 px-4 backdrop-blur-[12px] md:px-6">
      <button
        type="button"
        onClick={onOpenMobileNav}
        className="flex h-10 w-10 items-center justify-center rounded text-stone transition-colors hover:bg-sand-light hover:text-ink lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" strokeWidth={1.5} />
      </button>

      {/* Class selector */}
      <div className="relative hidden md:block">
        <button
          type="button"
          onClick={() => {
            setClassOpen((v) => !v);
            setNotifOpen(false);
            setComposeOpen(false);
          }}
          className="inline-flex h-10 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-earth hover:bg-sand-light"
          aria-expanded={classOpen}
          aria-haspopup="listbox"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-ochre" aria-hidden />
          {selectedClass ? classLabel(selectedClass) : 'All classes'}
          <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
        </button>
        {classOpen ? (
          <>
            <div aria-hidden onClick={() => setClassOpen(false)} className="fixed inset-0 z-10" />
            <ul
              role="listbox"
              className="absolute left-0 top-full z-20 mt-1.5 w-64 overflow-hidden rounded border border-sand bg-white shadow-e2"
            >
              {TEACHER_CLASSES.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedClass(c);
                      setClassOpen(false);
                    }}
                    className={[
                      'flex w-full items-center justify-between px-4 py-2.5 text-left font-sans text-[13px] transition-colors hover:bg-sand-light/60',
                      selectedClass?.id === c.id ? 'bg-sand-light/80 font-medium text-ink' : 'text-stone',
                    ].join(' ')}
                  >
                    <span>{classLabel(c)}</span>
                    <span className="font-sans text-[11px] text-stone">
                      {c.averagePercent}% · {Math.max(c.studentIds.length, 28)} students
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
        {crumbs.length > 0 ? (
          <ol className="flex flex-wrap items-center gap-x-2 font-sans text-[13px] text-stone">
            {crumbs.map((c, i) => {
              const last = i === crumbs.length - 1;
              return (
                <li key={c.href} className="flex items-center gap-2">
                  {i > 0 ? <span className="text-sand">/</span> : null}
                  {last ? (
                    <span className="font-medium text-ink">{c.label}</span>
                  ) : (
                    <Link
                      href={c.href}
                      className="hover:text-ink hover:underline underline-offset-4"
                    >
                      {c.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        ) : null}
      </nav>

      {/* Search */}
      <div className="flex items-center gap-1">
        {searchOpen ? (
          <div className="flex items-center gap-2 rounded border border-sand bg-white pl-3 pr-1">
            <Search className="h-4 w-4 text-stone" strokeWidth={1.5} aria-hidden />
            <input
              autoFocus
              onBlur={() => setSearchOpen(false)}
              type="search"
              placeholder="Search students, assignments, resources…"
              className="h-9 w-72 border-0 bg-transparent text-[13px] text-ink focus:outline-none"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded text-stone transition-colors hover:bg-sand-light hover:text-ink"
            aria-label="Search"
          >
            <Search className="h-5 w-5" strokeWidth={1.5} />
          </button>
        )}

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotifOpen((v) => !v);
              setComposeOpen(false);
              setClassOpen(false);
            }}
            className="relative flex h-10 w-10 items-center justify-center rounded text-stone transition-colors hover:bg-sand-light hover:text-ink"
            aria-label={`Notifications — ${unread} unread`}
            aria-expanded={notifOpen}
          >
            <Bell className="h-5 w-5" strokeWidth={1.5} />
            {unread > 0 ? (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-terracotta" aria-hidden />
            ) : null}
          </button>
          {notifOpen ? <NotifPopover onClose={() => setNotifOpen(false)} /> : null}
        </div>

        {/* Quick compose */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setComposeOpen((v) => !v);
              setNotifOpen(false);
              setClassOpen(false);
            }}
            className="flex h-10 w-10 items-center justify-center rounded text-stone transition-colors hover:bg-sand-light hover:text-ink"
            aria-label="Compose"
            aria-expanded={composeOpen}
          >
            <Plus className="h-5 w-5" strokeWidth={1.5} />
          </button>
          {composeOpen ? (
            <div
              className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded border border-sand bg-white shadow-e2"
              role="menu"
            >
              <ComposeItem href="/teacher/assignments/new" icon={BookOpen} label="New assignment" />
              <ComposeItem href="/teacher/messages" icon={MessageSquarePlus} label="New message" />
              <ComposeItem href="/teacher/resources" icon={Upload} label="Upload resource" />
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function ComposeItem({ href, icon: Icon, label }: { href: string; icon: LucideIcon; label: string }) {
  return (
    <Link
      href={href}
      role="menuitem"
      className="flex w-full items-center gap-3 border-b border-sand-light px-4 py-3 text-left font-sans text-[14px] text-ink transition-colors last:border-0 hover:bg-sand-light/60"
    >
      <Icon className="h-4 w-4 text-earth" strokeWidth={1.5} aria-hidden />
      {label}
    </Link>
  );
}

function NotifPopover({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div aria-hidden onClick={onClose} className="fixed inset-0 z-10" />
      <div className="absolute right-0 top-full z-20 mt-2 w-[360px] overflow-hidden rounded border border-sand bg-white shadow-e2">
        <div className="flex items-center justify-between border-b border-sand px-4 py-3">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-earth">
            Notifications
          </p>
          <button type="button" className="font-sans text-[12px] text-stone hover:text-ink">
            Mark all as read
          </button>
        </div>
        <ul className="max-h-[420px] divide-y divide-sand-light overflow-y-auto">
          {NOTIFICATIONS.map((n) => (
            <li key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-sand-light/40">
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-sans text-[14px] text-ink">
                  <span className="truncate">{n.title}</span>
                  {n.unread ? <span aria-label="unread" className="h-1.5 w-1.5 flex-none rounded-full bg-terracotta" /> : null}
                </p>
                <p className="mt-0.5 truncate font-serif text-[13px] text-stone">{n.preview}</p>
                <p className="mt-1 font-sans text-[11px] text-stone">{n.when}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
