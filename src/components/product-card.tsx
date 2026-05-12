"use client";

import Link from "next/link";
import type { Product } from "@/lib/products";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { displayPackForShop } from "@/lib/product-pack-display";
import { formatReferenceEur } from "@/lib/reference-price";
import { getVolumeTiersForVariant, nextCheaperTier, unitsUntilNextTier } from "@/lib/volume-price-tiers";
import { ProductPlaceholder } from "@/components/product-placeholder";

type Props = { product: Product };

function cardDetailLine(product: Product): string {
  if (product.variants.length > 1) {
    return `${product.variants.length} Ausführungen — Dosierung (mg/ml) auf der Produktseite wählbar.`;
  }
  return displayPackForShop(product.variants[0]!.pack);
}

/**
 * Katalog-Karten: übersichtlich, mit Packung/SKU und Kurzkontext — ohne Bild-Dosierungs-Leiste.
 */
export function ProductCard({ product }: Props) {
  const defaultVariant = product.variants.find((v) => v.sku === product.sku) ?? product.variants[0]!;
  const tiers = getVolumeTiersForVariant(defaultVariant);
  const untilNext = unitsUntilNextTier(1, tiers);
  const nextTier = nextCheaperTier(1, tiers);
  const bulkHint =
    untilNext !== null && untilNext > 0 && nextTier
      ? { until: untilNext, fromQty: nextTier.minQty }
      : null;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-surface transition-[box-shadow,transform] duration-200 hover:border-black/[0.1] hover:shadow-[0_8px_28px_-16px_rgba(0,0,0,0.12)] motion-safe:hover:-translate-y-px motion-reduce:hover:translate-y-0">
      <Link
        href={`/shop/${product.slug}`}
        className="relative block overflow-hidden rounded-t-2xl bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tint focus-visible:ring-offset-2"
      >
        {product.bestseller ? (
          <span className="pointer-events-none absolute left-2 top-2 z-[1] rounded-full bg-tint/95 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm sm:left-2.5 sm:top-2.5 sm:text-[10px]">
            Bestseller
          </span>
        ) : null}
        <ProductPlaceholder
          product={product}
          className="transition duration-300 ease-out motion-reduce:transition-none group-hover:scale-[1.02] motion-reduce:group-hover:scale-100"
        />
      </Link>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-3 sm:px-4 sm:pb-4 sm:pt-3.5">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <p className="truncate text-[10px] font-medium uppercase tracking-[0.08em] text-muted sm:text-[11px]">
            {product.category}
          </p>
          <span className="shrink-0 rounded-md bg-black/[0.05] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-muted sm:text-[10px]">
            RUO
          </span>
        </div>
        <Link
          href={`/shop/${product.slug}`}
          className="mt-1.5 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tint/35 focus-visible:ring-offset-1"
        >
          <h2 className="text-[15px] font-semibold leading-snug tracking-tight text-foreground line-clamp-2 sm:text-[16px] group-hover:text-tint/90">
            {product.name}
          </h2>
        </Link>

        <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-muted sm:text-[13px]">{cardDetailLine(product)}</p>
        <p className="mt-1 font-mono text-[10px] tabular-nums text-muted/80 sm:text-[11px]">
          Kat.-Nr. {product.catalogNo}
        </p>
        <p className="mt-1.5 font-mono text-[11px] tabular-nums text-muted/90 sm:text-[12px]">SKU {defaultVariant.sku}</p>

        {typeof product.listPriceEur === "number" ? (
          <p className="mt-2 text-[14px] font-semibold tabular-nums text-foreground">
            {product.variants.length > 1 ? (
              <>
                ab {formatReferenceEur(product.listPriceEur)}
                <span className="ml-1 font-normal text-muted">· Referenz</span>
              </>
            ) : (
              <>
                {formatReferenceEur(product.listPriceEur)}
                <span className="ml-1 font-normal text-muted">· Referenz</span>
              </>
            )}
          </p>
        ) : null}
        {bulkHint ? (
          <p className="mt-1.5 text-[11px] leading-snug text-muted sm:text-[12px]">
            Noch {bulkHint.until} Vial{bulkHint.until === 1 ? "" : "s"} bis günstigere Referenzstaffel (ab{" "}
            {bulkHint.fromQty} Vials).
          </p>
        ) : null}

        <div className="mt-auto space-y-2 pt-4">
          <div className="flex gap-2">
            <Link
              href={`/shop/${product.slug}`}
              className="inline-flex min-h-10 flex-1 touch-manipulation items-center justify-center rounded-xl border border-black/[0.1] bg-white px-2 text-[13px] font-medium text-foreground transition-colors hover:bg-black/[0.03] sm:min-h-9 sm:text-[13px]"
            >
              Details
            </Link>
            <Link
              href={`/anfrage?sku=${encodeURIComponent(defaultVariant.sku)}`}
              className="inline-flex min-h-10 flex-1 touch-manipulation items-center justify-center rounded-xl bg-tint px-2 text-[13px] font-medium text-white transition hover:opacity-94 sm:min-h-9"
            >
              Anfrage
            </Link>
          </div>
          <AddToCartButton
            sku={defaultVariant.sku}
            productName={product.name}
            productSlug={product.slug}
            packLabel={displayPackForShop(defaultVariant.pack)}
            listPriceEur={defaultVariant.listPriceEur}
          />
        </div>
      </div>
    </article>
  );
}
