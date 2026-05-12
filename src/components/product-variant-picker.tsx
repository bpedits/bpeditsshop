"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Product } from "@/lib/product-types";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { AnimatedReferencePrice } from "@/components/animated-reference-price";
import { QuantityStepper } from "@/components/quantity-stepper";
import { VolumeInstitutionBulk } from "@/components/volume-institution-bulk";
import { buildDoseChips, parseDoseFromPack } from "@/lib/product-dose";
import { displayPackForShop } from "@/lib/product-pack-display";
import { formatReferenceEur } from "@/lib/reference-price";
import { effectiveReferencePerVial } from "@/lib/volume-price-tiers";

function pickVariant(product: Product, skuParam: string | null) {
  const q = skuParam?.trim().toUpperCase();
  if (q) {
    const v = product.variants.find((x) => x.sku.toUpperCase() === q);
    if (v) return v;
  }
  const chips = buildDoseChips(product);
  return chips[0]!.variant;
}

/** Sekundär: institutionelle Anfrage — nach dem Warenkorb-CTA. */
const secondaryAnfrageClass =
  "inline-flex min-h-[54px] w-full touch-manipulation items-center justify-center rounded-full border-2 border-black/[0.1] bg-white px-6 text-[16px] font-semibold text-foreground transition hover:border-black/[0.16] hover:bg-black/[0.02] active:opacity-95 sm:min-h-[52px] sm:text-[15px]";

type Props = { product: Product };

export function ProductVariantPicker({ product }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [qty, setQty] = useState(1);

  const chips = useMemo(() => buildDoseChips(product), [product]);

  const selected = useMemo(() => pickVariant(product, searchParams.get("sku")), [product, searchParams]);

  useEffect(() => {
    setQty(1);
  }, [selected.sku]);

  const setSku = useCallback(
    (sku: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("sku", sku);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const anfrageHref = `/anfrage?sku=${encodeURIComponent(selected.sku)}`;

  if (product.variants.length === 1) {
    const v = product.variants[0]!;
    const eff = effectiveReferencePerVial(qty, v);
    return (
      <div className="space-y-5">
        <div className="rounded-2xl border border-black/[0.06] bg-gradient-to-b from-white to-surface-pearl/80 px-5 py-6 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.04] sm:px-6 sm:py-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">Einzelvariante</p>
          <p className="mt-2 text-[16px] leading-snug text-muted sm:text-[17px]">{displayPackForShop(v.pack)}</p>
          <p className="mt-1 font-mono text-[13px] text-muted">Artikel-Nr. {v.catalogNo}</p>
          <p className="mt-2.5 font-mono text-[15px] font-medium text-foreground sm:text-[16px]">SKU: {v.sku}</p>
          <AnimatedReferencePrice className="mt-4" perVialEur={eff} qty={qty} />
          <div className="mt-5 border-t border-black/[0.06] pt-5">
            <QuantityStepper qty={qty} onQty={setQty} />
          </div>
          <div className="mt-4">
            <VolumeInstitutionBulk variant={v} qty={qty} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AddToCartButton
            variant="primary"
            sku={v.sku}
            productName={product.name}
            productSlug={product.slug}
            packLabel={displayPackForShop(v.pack)}
            listPriceEur={v.listPriceEur}
            qty={qty}
          />
          <Link href={anfrageHref} className={secondaryAnfrageClass}>
            Stattdessen Anfrage
          </Link>
        </div>
        <p className="text-[14px] leading-relaxed text-muted sm:text-[15px]">
          Referenzpreis <span className="font-semibold text-foreground">pro Vial</span>.{" "}
          <span className="font-medium text-foreground">Zuerst in den Warenkorb</span> — im{" "}
          <Link href="/checkout" className="font-medium text-tint hover:underline">
            Warenkorb
          </Link>{" "}
          optional per Banküberweisung bestellen oder für eine{" "}
          <Link href={anfrageHref} className="font-medium text-tint hover:underline">
            institutionelle Anfrage
          </Link>{" "}
          vormerken.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-black/[0.07] bg-gradient-to-b from-tint/[0.07] via-white to-surface-pearl/60 p-4 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.04] sm:p-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">Dosierung (mg / ml)</p>
            <p className="mt-1 text-[14px] leading-snug text-muted sm:hidden">Nach links wischen für alle Stufen</p>
          </div>
          <span className="shrink-0 rounded-full bg-black/[0.05] px-2.5 py-1 text-[12px] font-semibold tabular-nums text-muted">
            {product.variants.length} Stufen
          </span>
        </div>

        <div className="relative mt-4">
          <div
            className="-mx-1 flex gap-2.5 overflow-x-auto overscroll-x-contain px-1 pb-2 pt-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden"
            role="radiogroup"
            aria-label="Dosierung wählen — Preis pro Vial"
          >
            {chips.map(({ variant: v, doseLabel }) => {
              const on = v.sku === selected.sku;
              const hasMgMl = parseDoseFromPack(v.pack) !== null;
              return (
                <button
                  key={v.sku}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  title={
                    hasMgMl
                      ? `${doseLabel} — ${displayPackForShop(v.pack)}`
                      : `${displayPackForShop(v.pack)} (${v.sku})`
                  }
                  onClick={() => setSku(v.sku)}
                  className={`flex min-h-[56px] min-w-[5.75rem] shrink-0 snap-center touch-manipulation flex-col justify-center rounded-2xl border-2 px-4 py-3 text-left transition motion-safe:active:scale-[0.98] sm:min-h-12 sm:min-w-0 sm:px-4 sm:py-2.5 ${
                    on
                      ? "border-tint bg-white shadow-[0_6px_20px_-6px_rgba(0,102,204,0.35)] ring-2 ring-tint/25"
                      : "border-black/[0.08] bg-white/90 hover:border-tint/35 hover:bg-white"
                  }`}
                >
                  <span className="text-[17px] font-semibold tabular-nums leading-none tracking-tight text-foreground sm:text-[16px]">
                    {doseLabel}
                  </span>
                  {!hasMgMl ? (
                    <span className="mt-1 block max-w-[9rem] truncate text-[12px] font-medium text-muted">{v.sku}</span>
                  ) : null}
                  <span className="mt-2 text-[14px] font-semibold tabular-nums text-muted">
                    {formatReferenceEur(v.listPriceEur)}{" "}
                    <span className="text-[11px] font-medium text-muted/90">/ Vial</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-black/[0.06] bg-white px-4 py-5 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.08)] sm:px-6 sm:py-6">
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">Auswahl · Packung</p>
        <p className="mt-2 font-mono text-[15px] font-medium text-foreground sm:text-[16px]">SKU: {selected.sku}</p>
        <p className="mt-1 font-mono text-[13px] text-muted">Artikel-Nr. {selected.catalogNo}</p>
        <p className="mt-2.5 text-[17px] leading-relaxed text-muted sm:text-[18px]">
          {displayPackForShop(selected.pack)}
        </p>
        <AnimatedReferencePrice className="mt-5" perVialEur={effectiveReferencePerVial(qty, selected)} qty={qty} />
        <div className="mt-5 border-t border-black/[0.06] pt-5">
          <QuantityStepper qty={qty} onQty={setQty} />
        </div>
        <div className="mt-4">
          <VolumeInstitutionBulk variant={selected} qty={qty} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <AddToCartButton
          variant="primary"
          sku={selected.sku}
          productName={product.name}
          productSlug={product.slug}
          packLabel={displayPackForShop(selected.pack)}
          listPriceEur={selected.listPriceEur}
          qty={qty}
        />
        <Link href={`/anfrage?sku=${encodeURIComponent(selected.sku)}`} className={secondaryAnfrageClass}>
          Stattdessen Anfrage
        </Link>
      </div>
      <p className="text-center text-[14px] leading-relaxed text-muted sm:text-left sm:text-[15px]">
        Referenzpreis <span className="font-semibold text-foreground">pro Vial</span>.{" "}
        <span className="font-semibold text-foreground">Zuerst in den Warenkorb</span> — im{" "}
        <Link href="/checkout" className="font-medium text-tint hover:underline">
          Warenkorb
        </Link>{" "}
        optional per Banküberweisung bestellen oder Positionen für eine spätere{" "}
        <Link href={`/anfrage?sku=${encodeURIComponent(selected.sku)}`} className="font-medium text-tint hover:underline">
          institutionelle Anfrage
        </Link>{" "}
        bündeln.
      </p>
    </div>
  );
}
