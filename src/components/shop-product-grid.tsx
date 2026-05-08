"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/product-types";
import { ProductCard } from "@/components/product-card";
import { filterShopProducts, shopSortOptions, type ShopSortId } from "@/lib/shop-filter";

function SortChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
      <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Props = { products: Product[] };

export function ShopProductGrid({ products: catalog }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const categories = useMemo(
    () => [...new Set(catalog.map((p) => p.category))].sort((a, b) => a.localeCompare(b, "de")),
    [catalog],
  );

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<ShopSortId>("catalog");

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    setQuery(q);
  }, [searchParams]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      const fromUrl = (searchParams.get("q") ?? "").trim();
      if (fromUrl === query.trim()) return;
      const params = new URLSearchParams(searchParams.toString());
      if (query.trim()) params.set("q", query.trim());
      else params.delete("q");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, 420);
    return () => window.clearTimeout(t);
  }, [query, pathname, router, searchParams]);

  const filtered = useMemo(
    () => filterShopProducts(catalog, { query, category, sort }),
    [catalog, query, category, sort],
  );

  const hasActiveFilters = query.trim() !== "" || category !== null || sort !== "catalog";

  function resetFilters() {
    setQuery("");
    setCategory(null);
    setSort("catalog");
    router.replace(pathname, { scroll: false });
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-4">
        <div className="relative min-w-0 flex-1">
          <label htmlFor="shop-search" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted sm:sr-only">
            Suche
          </label>
          <input
            id="shop-search"
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            placeholder="SKU, Name, Stoff …"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[48px] w-full rounded-xl border border-black/[0.07] bg-white py-3 pl-3.5 pr-11 text-[16px] text-foreground outline-none transition placeholder:text-muted/65 focus:border-tint focus:ring-2 focus:ring-tint/18 sm:min-h-10 sm:py-2 sm:pr-10 sm:text-[15px]"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-1/2 flex size-11 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full text-[18px] leading-none text-muted transition hover:bg-black/[0.06] hover:text-foreground sm:right-2 sm:size-9 sm:text-[15px]"
              aria-label="Suche leeren"
            >
              ×
            </button>
          ) : null}
        </div>
        <div className="flex w-full shrink-0 flex-col gap-1.5 sm:w-[min(100%,260px)] sm:max-w-none">
          <label htmlFor="shop-sort" className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            Sortierung
          </label>
          <div className="relative isolate w-full">
            <select
              id="shop-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as ShopSortId)}
              className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-black/[0.07] bg-white py-2 pl-3 pr-10 text-[16px] text-foreground outline-none transition-colors hover:bg-black/[0.02] focus:border-tint focus:ring-2 focus:ring-tint/18 sm:h-10 sm:pl-3 sm:text-[14px]"
            >
              {shopSortOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
            <SortChevronIcon className="pointer-events-none absolute right-3 top-1/2 size-[18px] -translate-y-1/2 text-muted" />
          </div>
        </div>
      </div>

      <div className="mt-5 sm:mt-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Kategorie</p>
        <div className="-mx-4 mt-2.5 px-4 sm:mx-0 sm:px-0">
          <div
            className="flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain pb-3 pt-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden"
            aria-label="Kategorie filtern"
          >
            <button
              type="button"
              onClick={() => setCategory(null)}
              className={`shrink-0 snap-start touch-manipulation rounded-full px-3.5 py-2 text-[13px] font-medium transition sm:min-h-8 sm:px-3 sm:py-1.5 sm:text-[13px] ${
                category === null
                  ? "bg-foreground text-white shadow-md"
                  : "bg-white text-muted shadow-sm ring-1 ring-black/[0.08] hover:bg-surface active:scale-[0.98]"
              }`}
            >
              Alle
            </button>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`max-w-[min(100vw-4rem,280px)] shrink-0 snap-start touch-manipulation truncate rounded-full px-3.5 py-2 text-left text-[13px] font-medium transition sm:max-w-none sm:min-h-8 sm:px-3 sm:py-1.5 sm:text-[13px] ${
                  category === c
                    ? "bg-foreground text-white shadow-md"
                    : "bg-white text-muted shadow-sm ring-1 ring-black/[0.08] hover:bg-surface active:scale-[0.98]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3">
        <p className="text-[14px] text-muted sm:text-[13px]" role="status" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "Eintrag" : "Einträge"}
          {category ? ` · „${category}“` : ""}
          {query.trim() ? ` · Suche „${query.trim()}“` : ""}
        </p>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={resetFilters}
            className="touch-manipulation text-[13px] font-medium text-tint hover:underline"
          >
            Filter zurücksetzen
          </button>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-[22px] border border-dashed border-black/[0.12] bg-white px-6 py-14 text-center">
          <p className="text-[16px] font-medium text-foreground">Keine Treffer</p>
          <p className="mt-2 text-[14px] text-muted">Passe Suche oder Kategorie an.</p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-6 inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full bg-tint px-6 text-[14px] font-medium text-white transition hover:opacity-92"
          >
            Alle Filter zurücksetzen
          </button>
        </div>
      ) : (
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-4 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
          {filtered.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
