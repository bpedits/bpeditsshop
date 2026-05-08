"use client";

import type { FormEvent } from "react";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  className?: string;
  /** Nach Navigation (z. B. Mobilmenü schließen). */
  onNavigate?: () => void;
  /** Kompakter Block fürs Drawer. */
  variant?: "header" | "drawer";
};

export function HeaderSearch({ className = "", onNavigate, variant = "header" }: Props) {
  const router = useRouter();
  const [value, setValue] = useState("");

  const submit = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      const q = value.trim();
      router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
      onNavigate?.();
    },
    [value, router, onNavigate],
  );

  const isDrawer = variant === "drawer";

  return (
    <form
      onSubmit={submit}
      className={`flex items-center gap-1.5 ${isDrawer ? "w-full flex-col gap-2 sm:flex-row" : ""} ${className}`.trim()}
      role="search"
      aria-label="Katalog durchsuchen"
    >
      <div className={`relative ${isDrawer ? "w-full" : "min-w-0 max-w-[220px] xl:max-w-[260px]"}`}>
        <label htmlFor="header-search-q" className="sr-only">
          Suche im Katalog
        </label>
        <input
          id="header-search-q"
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          placeholder="Katalog …"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`min-h-10 w-full rounded-full border border-black/[0.1] bg-black/[0.03] py-2 pl-4 pr-10 text-[14px] text-foreground outline-none transition placeholder:text-muted/70 focus:border-tint focus:bg-white focus:ring-2 focus:ring-tint/15 ${
            isDrawer ? "min-h-12 text-[16px]" : ""
          }`}
        />
        <button
          type="submit"
          className="absolute right-1 top-1/2 flex size-8 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full text-muted transition hover:bg-black/[0.06] hover:text-foreground"
          aria-label="Suchen"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm10 2-4.35-4.35"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      {isDrawer ? (
        <button
          type="submit"
          className="min-h-12 w-full touch-manipulation rounded-full bg-tint px-4 text-[15px] font-semibold text-white transition hover:opacity-92 sm:w-auto sm:min-w-[120px]"
        >
          Suchen
        </button>
      ) : null}
    </form>
  );
}
