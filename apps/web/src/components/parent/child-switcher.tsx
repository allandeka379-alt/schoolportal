'use client';

import { useState } from 'react';
import { Check, ChevronDown, Users } from 'lucide-react';

import { EditorialAvatar } from '@/components/student/primitives';
import { PARENT_CHILDREN, type ParentChild } from '@/lib/mock/parent-extras';

import { ChildColourDot } from './primitives';

/**
 * Child switcher — §03.
 *
 * Sits at the top of every parent-portal page. Everything below is scoped to
 * the selected child. Switching is instant and state-preserving.
 *
 * Single-child parents see a header-only treatment (no dropdown control).
 */
export function ChildSwitcher({
  selectedId,
  onSelect,
  onSelectAll,
  showAllOption,
  allSelected,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
  onSelectAll?: () => void;
  showAllOption?: boolean;
  allSelected?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selected = PARENT_CHILDREN.find((c) => c.id === selectedId) ?? PARENT_CHILDREN[0]!;

  // Single-child household — no switcher, just the header.
  if (PARENT_CHILDREN.length === 1) {
    return (
      <HeaderBlock child={selected} />
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="group flex w-full items-center gap-3 rounded border border-sand bg-white px-3 py-2.5 text-left transition-colors hover:border-terracotta hover:bg-sand-light/40"
      >
        {allSelected ? (
          <>
            <span
              aria-hidden
              className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-full bg-sand-light text-earth"
            >
              <Users className="h-4 w-4" strokeWidth={1.5} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-stone">
                Viewing
              </span>
              <span className="block truncate font-display text-[15px] text-ink">
                All children
              </span>
            </span>
          </>
        ) : (
          <>
            <ChildColourDot tone={selected.colourTone} />
            <EditorialAvatar
              name={`${selected.firstName} ${selected.lastName}`}
              size="sm"
              tone={selected.colourTone === 'earth' ? 'sand' : 'terracotta'}
            />
            <span className="min-w-0 flex-1">
              <span className="block font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-stone">
                Viewing
              </span>
              <span className="block truncate font-display text-[15px] text-ink">
                {selected.firstName} {selected.lastName}
              </span>
              <span className="block truncate font-sans text-[11px] text-stone">
                {selected.form}
              </span>
            </span>
          </>
        )}
        <ChevronDown
          className={`h-4 w-4 flex-none text-stone transition-transform ${open ? 'rotate-180' : ''}`}
          strokeWidth={1.5}
          aria-hidden
        />
      </button>

      {open ? (
        <>
          <div aria-hidden onClick={() => setOpen(false)} className="fixed inset-0 z-40" />
          <ul
            role="listbox"
            className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded border border-sand bg-white shadow-e2"
          >
            {PARENT_CHILDREN.map((c) => {
              const active = !allSelected && c.id === selectedId;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      onSelect(c.id);
                      setOpen(false);
                    }}
                    className={[
                      'flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors',
                      active ? 'bg-sand-light/70' : 'hover:bg-sand-light/40',
                    ].join(' ')}
                  >
                    <ChildColourDot tone={c.colourTone} />
                    <EditorialAvatar
                      name={`${c.firstName} ${c.lastName}`}
                      size="sm"
                      tone={c.colourTone === 'earth' ? 'sand' : 'terracotta'}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block font-sans text-[14px] font-medium text-ink">
                        {c.firstName}
                      </span>
                      <span className="block font-sans text-[11px] text-stone">{c.form}</span>
                    </span>
                    {c.attentionItems > 0 ? (
                      <span className="inline-flex h-5 items-center rounded-full bg-terracotta px-1.5 font-sans text-[10px] font-semibold text-cream">
                        {c.attentionItems}
                      </span>
                    ) : null}
                    {active ? (
                      <Check className="h-4 w-4 text-terracotta" strokeWidth={1.5} aria-hidden />
                    ) : null}
                  </button>
                </li>
              );
            })}
            {showAllOption ? (
              <li className="border-t border-sand-light">
                <button
                  type="button"
                  onClick={() => {
                    onSelectAll?.();
                    setOpen(false);
                  }}
                  className={[
                    'flex w-full items-center gap-3 px-3 py-2.5 text-left font-sans text-[13px] transition-colors',
                    allSelected
                      ? 'bg-sand-light/70 font-medium text-ink'
                      : 'text-earth hover:bg-sand-light/40',
                  ].join(' ')}
                >
                  <Users className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                  All children
                  {allSelected ? (
                    <Check className="ml-auto h-4 w-4 text-terracotta" strokeWidth={1.5} aria-hidden />
                  ) : null}
                </button>
              </li>
            ) : null}
          </ul>
        </>
      ) : null}
    </div>
  );
}

function HeaderBlock({ child }: { child: ParentChild }) {
  return (
    <div className="flex items-center gap-3 rounded border border-sand bg-white px-3 py-2.5">
      <EditorialAvatar name={`${child.firstName} ${child.lastName}`} size="md" tone="terracotta" />
      <div className="min-w-0 flex-1">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-stone">
          Viewing
        </p>
        <p className="truncate font-display text-[15px] text-ink">
          {child.firstName} {child.lastName}
        </p>
        <p className="truncate font-sans text-[11px] text-stone">{child.form}</p>
      </div>
    </div>
  );
}
