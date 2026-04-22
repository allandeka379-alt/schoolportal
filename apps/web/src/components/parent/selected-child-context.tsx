'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { PARENT_CHILDREN, type ParentChild } from '@/lib/mock/parent-extras';

/**
 * Shares the currently-selected child across the whole parent portal via
 * a React context + localStorage. Pages read it to scope their content.
 *
 * "All children" mode is only used on the dashboard and aggregate views.
 */
interface Ctx {
  selectedId: string;
  selectedChild: ParentChild;
  allSelected: boolean;
  setSelectedId: (id: string) => void;
  setAllSelected: (on: boolean) => void;
}

const ChildCtx = createContext<Ctx | null>(null);

const STORAGE_KEY = 'hha_parent_selected_child';

export function SelectedChildProvider({ children }: { children: ReactNode }) {
  const [selectedId, setSelectedIdState] = useState<string>(PARENT_CHILDREN[0]!.id);
  const [allSelected, setAllSelected] = useState(false);

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw && PARENT_CHILDREN.some((c) => c.id === raw)) setSelectedIdState(raw);
  }, []);

  function setSelectedId(id: string) {
    setSelectedIdState(id);
    setAllSelected(false);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // ignore quota errors
    }
  }

  const selectedChild = useMemo(
    () => PARENT_CHILDREN.find((c) => c.id === selectedId) ?? PARENT_CHILDREN[0]!,
    [selectedId],
  );

  const value: Ctx = {
    selectedId,
    selectedChild,
    allSelected,
    setSelectedId,
    setAllSelected: (on) => {
      setAllSelected(on);
    },
  };

  return <ChildCtx.Provider value={value}>{children}</ChildCtx.Provider>;
}

export function useSelectedChild(): Ctx {
  const v = useContext(ChildCtx);
  if (!v) throw new Error('useSelectedChild must be used inside <SelectedChildProvider>');
  return v;
}
