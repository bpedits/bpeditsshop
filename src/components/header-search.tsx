"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent, KeyboardEvent as ReactKeyboardEvent } from "react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { allProducts } from "@/lib/product-catalog";
import type { Product } from "@/lib/product-types";
import { filterShopProducts } from "@/lib/shop-filter";

const MAX_RESULTS = 6;

type Props = {
  className?: string;
  /** Nach Navigation (z. B. Mobilmenü schließen). */
  onNavigate?: () => void;
  /** Kompakter Block fürs Drawer. */
  variant?: "header" | "drawer";
};

function normalizeMatch(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

/** Trifft ungefähr — escaped die Query für Regex und matched case-/diacritics-insensitive. */
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  try {
    const re = new RegExp(`(${escapeRegex(q)})`, "ig");
    const parts = text.split(re);
    return (
      <>
        {parts.map((part, i) =>
          re.test(part) && normalizeMatch(part) === normalizeMatch(q) ? (
            <mark
              key={`${part}-${i}`}
              className="bg-tint/15 px-0.5 text-tint rounded-[3px] font-semibold"
            >
              {part}
            </mark>
          ) : (
            <span key={`${part}-${i}`}>{part}</span>
          ),
        )}
      </>
    );
  } catch {
    return <>{text}</>;
  }
}

function pickShortText(p: Product): string {
  if (p.shortDescription) return p.shortDescription;
  if (p.category) return p.category;
  return "";
}

export function HeaderSearch({ className = "", onNavigate, variant = "header" }: Props) {
  const router = useRouter();
  const listId = useId();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isDrawer = variant === "drawer";

  const results = useMemo<Product[]>(() => {
    const q = value.trim();
    if (q.length < 2) return [];
    return filterShopProducts(allProducts, {
      query: q,
      category: null,
      sort: "relevance",
    }).slice(0, MAX_RESULTS);
  }, [value]);

  const hasQuery = value.trim().length >= 1;
  const canShowResults = value.trim().length >= 2;
  const showDropdown = open && canShowResults;

  useEffect(() => {
    setActiveIdx(-1);
  }, [value]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      const el = containerRef.current;
      if (el && !el.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const navigateToProduct = useCallback(
    (p: Product) => {
      router.push(`/shop/${p.slug}`);
      setOpen(false);
      onNavigate?.();
    },
    [router, onNavigate],
  );

  const submit = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      if (showDropdown && activeIdx >= 0 && results[activeIdx]) {
        navigateToProduct(results[activeIdx]);
        return;
      }
      const q = value.trim();
      router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
      setOpen(false);
      onNavigate?.();
    },
    [value, activeIdx, results, router, onNavigate, navigateToProduct, showDropdown],
  );

  const onKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLInputElement>) => {
      if (!showDropdown && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
        if (canShowResults) setOpen(true);
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, -1));
      }
    },
    [results.length, showDropdown, canShowResults],
  );

  const clear = useCallback(() => {
    setValue("");
    setActiveIdx(-1);
    inputRef.current?.focus();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative ${isDrawer ? "w-full" : "min-w-0 max-w-[260px] xl:max-w-[300px] flex-1"} ${className}`.trim()}
    >
      <form onSubmit={submit} role="search" aria-label="Katalog durchsuchen" className="relative">
        <label htmlFor={`${listId}-input`} className="sr-only">
          Suche im Katalog
        </label>

        <span
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted/80"
          aria-hidden="true"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm10 2-4.35-4.35"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </span>

        <input
          ref={inputRef}
          id={`${listId}-input`}
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          spellCheck={false}
          placeholder="Peptide, SKU, CAS …"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (canShowResults) setOpen(true);
          }}
          onKeyDown={onKeyDown}
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          aria-controls={showDropdown ? `${listId}-listbox` : undefined}
          aria-activedescendant={
            showDropdown && activeIdx >= 0 ? `${listId}-opt-${activeIdx}` : undefined
          }
          className={[
            "h-10 w-full rounded-full border border-black/[0.08] bg-black/[0.04] pl-9 pr-9 text-[14px] text-foreground outline-none transition placeholder:text-muted/70",
            "focus:border-tint/40 focus:bg-white focus:ring-2 focus:ring-tint/15",
            isDrawer ? "h-12 text-[16px] pl-10 pr-10" : "",
          ].join(" ")}
        />

        {hasQuery ? (
          <button
            type="button"
            onClick={clear}
            aria-label="Suchfeld leeren"
            className="absolute right-1 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full text-muted transition hover:bg-black/[0.06] hover:text-foreground"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        ) : (
          <button
            type="submit"
            aria-label="Suchen"
            className="absolute right-1 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full text-muted transition hover:bg-black/[0.06] hover:text-foreground"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M9 18l6-6-6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </form>

      {showDropdown ? (
        <div
          id={`${listId}-listbox`}
          role="listbox"
          aria-label="Suchvorschläge"
          className={[
            "absolute z-50 mt-2 overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_18px_60px_-20px_rgba(0,0,0,0.25)]",
            isDrawer
              ? "left-0 right-0 w-full"
              : "left-1/2 w-[min(420px,92vw)] -translate-x-1/2 sm:left-auto sm:right-0 sm:w-[420px] sm:translate-x-0",
          ].join(" ")}
        >
          {results.length === 0 ? (
            <div className="px-4 py-5 text-[13px] leading-relaxed text-muted">
              <p className="font-medium text-foreground">Keine Treffer.</p>
              <p className="mt-1">
                Versuche es mit einem anderen Begriff — oder{" "}
                <Link
                  href="/shop"
                  onClick={() => {
                    setOpen(false);
                    onNavigate?.();
                  }}
                  className="font-medium text-tint hover:underline"
                >
                  zum vollständigen Katalog
                </Link>
                .
              </p>
            </div>
          ) : (
            <>
              <ul className="max-h-[60vh] overflow-y-auto py-1.5">
                {results.map((p, i) => {
                  const active = i === activeIdx;
                  const short = pickShortText(p);
                  return (
                    <li key={p.id} id={`${listId}-opt-${i}`} role="option" aria-selected={active}>
                      <Link
                        href={`/shop/${p.slug}`}
                        onMouseEnter={() => setActiveIdx(i)}
                        onClick={() => {
                          setOpen(false);
                          onNavigate?.();
                        }}
                        className={[
                          "flex items-start gap-3 px-3 py-2.5 transition",
                          active ? "bg-tint/[0.06]" : "hover:bg-black/[0.03]",
                        ].join(" ")}
                      >
                        <span
                          aria-hidden="true"
                          className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-fill-secondary text-[11px] font-semibold tracking-tight text-foreground"
                          style={{ background: p.accent || undefined }}
                        >
                          {p.name.slice(0, 2).toUpperCase()}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[14px] font-semibold leading-tight text-foreground">
                            <HighlightedText text={p.name} query={value} />
                          </span>
                          <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted">
                            <span className="font-mono">
                              <HighlightedText text={p.sku} query={value} />
                            </span>
                            {p.category ? (
                              <span className="opacity-70">·&nbsp;{p.category}</span>
                            ) : null}
                          </span>
                          {short ? (
                            <span className="mt-0.5 line-clamp-1 block text-[12px] leading-snug text-muted">
                              <HighlightedText text={short} query={value} />
                            </span>
                          ) : null}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link
                href={`/shop?q=${encodeURIComponent(value.trim())}`}
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
                className="flex items-center justify-between border-t border-black/[0.06] bg-black/[0.02] px-3 py-2.5 text-[12px] font-medium text-foreground transition hover:bg-black/[0.04]"
              >
                <span>
                  Alle Treffer ansehen
                  <span className="ml-1 text-muted">({value.trim()})</span>
                </span>
                <span className="text-tint" aria-hidden="true">
                  →
                </span>
              </Link>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
