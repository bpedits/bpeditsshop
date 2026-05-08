"use client";

import { useEffect, useState } from "react";
import { cartLineCount, readCartLines, readPromoCode, subscribeCart, type CartLine } from "@/lib/cart-storage";

/** Stabile leere Liste — nicht pro Render `[]` neu allokieren. */
const EMPTY_LINES: CartLine[] = [];

/**
 * Warenkorb aus `localStorage`: erst nach Mount lesen (Hydration),
 * dann bei Änderungen per `subscribeCart` aktualisieren.
 */
export function useCartSnapshot(): { lines: CartLine[]; count: number; promoCode: string } {
  const [mounted, setMounted] = useState(false);
  const [lines, setLines] = useState<CartLine[]>(EMPTY_LINES);
  const [promoCode, setPromoCode] = useState("");

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  useEffect(() => {
    if (!mounted) return;
    function sync() {
      setLines(readCartLines());
      setPromoCode(readPromoCode());
    }
    sync();
    return subscribeCart(sync);
  }, [mounted]);

  return { lines, count: cartLineCount(lines), promoCode };
}
