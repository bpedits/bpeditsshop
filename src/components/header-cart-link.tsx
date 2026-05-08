"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCartSnapshot } from "@/hooks/use-cart-snapshot";

export function HeaderCartLink() {
  const { count } = useCartSnapshot();
  const prev = useRef<number | null>(null);
  const [badgeBump, setBadgeBump] = useState(0);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (prev.current !== null && count > prev.current) {
      setBadgeBump((b) => b + 1);
      setShake(true);
      const t = window.setTimeout(() => setShake(false), 520);
      prev.current = count;
      return () => window.clearTimeout(t);
    }
    prev.current = count;
    return undefined;
  }, [count]);

  return (
    <Link
      href="/checkout"
      className={`relative inline-flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-full border border-black/[0.08] bg-white text-[13px] font-medium text-foreground transition hover:bg-black/[0.04] sm:min-h-11 sm:min-w-11 ${
        shake
          ? "motion-safe:animate-[bp-cart-added_0.5s_cubic-bezier(0.34,1.35,0.64,1)_both] motion-reduce:animate-none"
          : ""
      }`}
      aria-label={count > 0 ? `Warenkorb, ${count} Positionen` : "Warenkorb"}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path
          d="M6 6h15l-1.5 9h-12L6 6Zm0 0L5 3H2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM17 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
          fill="currentColor"
        />
      </svg>
      {count > 0 ? (
        <span
          key={badgeBump}
          className="absolute -right-0.5 -top-0.5 flex min-w-[1.125rem] items-center justify-center rounded-full bg-tint px-1 text-[10px] font-bold leading-none text-white motion-safe:animate-[bp-cart-badge-bounce_0.55s_cubic-bezier(0.34,1.35,0.64,1)_both] motion-reduce:animate-none"
        >
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
