"use client";

import { useEffect, useRef, useState } from "react";
import { addToCart } from "@/lib/cart-storage";

type Props = {
  sku: string;
  productName: string;
  productSlug: string;
  packLabel: string;
  listPriceEur: number;
  className?: string;
  /** `primary`: Produktseite — voller Konversions-CTA. `outline`: Karten & sekundär. */
  variant?: "outline" | "primary";
  /** Menge für diese Aktion (Staffel-Referenzpreis im Warenkorb). */
  qty?: number;
};

function IconCheck({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 12.5l4 4 8-9"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AddToCartButton({
  sku,
  productName,
  productSlug,
  packLabel,
  listPriceEur,
  className = "",
  variant = "outline",
  qty = 1,
}: Props) {
  const [done, setDone] = useState(false);
  const [ringKey, setRingKey] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  function onClick() {
    addToCart({ sku, productName, productSlug, packLabel, listPriceEur, qty });
    setRingKey((k) => k + 1);
    setDone(true);
    if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setDone(false);
      timeoutRef.current = null;
    }, 1800);
  }

  const base =
    variant === "primary"
      ? "inline-flex w-full touch-manipulation items-center justify-center rounded-full bg-tint px-6 text-[17px] font-semibold tracking-tight text-white shadow-[0_8px_28px_-8px_rgba(0,102,204,0.45)] transition-[opacity,box-shadow] hover:opacity-95 active:opacity-90 sm:text-[18px]"
      : "inline-flex w-full touch-manipulation items-center justify-center rounded-xl border border-black/[0.12] bg-white px-3 text-[13px] font-medium text-foreground transition-[border-color,background-color] hover:bg-black/[0.03] sm:min-h-9";

  const heights =
    variant === "primary" ? "min-h-[56px] sm:min-h-14" : "min-h-10";

  const doneAnim =
    "motion-safe:animate-[bp-cart-added_0.55s_cubic-bezier(0.34,1.35,0.64,1)_both] motion-reduce:animate-none";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative overflow-hidden ${base} ${heights} ${done ? doneAnim : ""} ${className}`.trim()}
    >
      {ringKey > 0 ? (
        <span
          key={ringKey}
          className="pointer-events-none absolute inset-0 rounded-[inherit] motion-safe:animate-[bp-cart-ring-out_0.65s_ease-out_both] motion-reduce:animate-none"
          aria-hidden
        />
      ) : null}

      <span className="relative z-[1] inline-flex min-h-[1.35em] w-full items-center justify-center">
        <span
          className={`inline-flex items-center justify-center gap-2 transition-[opacity,transform] duration-200 ease-out ${
            done ? "pointer-events-none scale-95 opacity-0" : "scale-100 opacity-100"
          }`}
        >
          In den Warenkorb
        </span>
        <span
          className={`absolute inset-0 inline-flex items-center justify-center gap-2 transition-[opacity,transform] duration-220 ease-out ${
            done ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
          }`}
          aria-live="polite"
        >
          <IconCheck
            className={
              variant === "primary"
                ? "size-[1.25rem] shrink-0 text-white motion-safe:animate-[bp-qty-pop_0.45s_cubic-bezier(0.34,1.2,0.64,1)_both] motion-reduce:animate-none"
                : "size-[1.05rem] shrink-0 text-tint motion-safe:animate-[bp-qty-pop_0.45s_cubic-bezier(0.34,1.2,0.64,1)_both] motion-reduce:animate-none"
            }
          />
          <span>Im Warenkorb</span>
        </span>
      </span>
    </button>
  );
}
