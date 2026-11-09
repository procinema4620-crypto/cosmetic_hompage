"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProduct } from "@/lib/products";

type Lines = Record<string, number>;

interface CartCtx {
  lines: Lines;
  count: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "maison-verde-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<Lines>({});
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, ready]);

  const add = useCallback((slug: string, qty = 1) => {
    setLines((l) => ({ ...l, [slug]: Math.min(10, (l[slug] ?? 0) + qty) }));
    setOpen(true);
  }, []);
  const setQty = useCallback((slug: string, qty: number) => {
    setLines((l) => {
      const next = { ...l };
      if (qty <= 0) delete next[slug];
      else next[slug] = Math.min(10, qty);
      return next;
    });
  }, []);
  const remove = useCallback((slug: string) => setQty(slug, 0), [setQty]);
  const clear = useCallback(() => setLines({}), []);

  const value = useMemo<CartCtx>(() => {
    let count = 0;
    let total = 0;
    for (const [slug, q] of Object.entries(lines)) {
      const p = getProduct(slug);
      if (!p) continue;
      count += q;
      total += p.price * q;
    }
    return { lines, count, total, open, setOpen, add, setQty, remove, clear };
  }, [lines, open, add, setQty, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}
