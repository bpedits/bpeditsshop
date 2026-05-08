import { allProducts } from "@/lib/product-catalog";
import type { Product, ProductVariant, VolumePriceTier } from "@/lib/product-types";

export type { VolumePriceTier } from "@/lib/product-types";

/** Standard-Referenzstaffel für institutionelle Mengen (ohne verbindliches Angebot). */
export function defaultResearchVolumeTiers(unitListPrice: number): VolumePriceTier[] {
  const r = (n: number) => Math.round(n * 100) / 100;
  const u = Math.max(0.01, unitListPrice);
  return [
    { minQty: 1, listPriceEur: r(u) },
    { minQty: 10, listPriceEur: r(u * 0.97) },
    { minQty: 25, listPriceEur: r(u * 0.94) },
    { minQty: 50, listPriceEur: r(u * 0.9) },
  ];
}

export function getVolumeTiersForVariant(v: ProductVariant): VolumePriceTier[] {
  if (v.volumeTiers && v.volumeTiers.length > 0) {
    return [...v.volumeTiers].sort((a, b) => a.minQty - b.minQty);
  }
  return defaultResearchVolumeTiers(v.listPriceEur);
}

/** Aktive Staffel: höchste Schwelle mit minQty ≤ qty. */
export function activeTierForQty(qty: number, tiers: VolumePriceTier[]): VolumePriceTier {
  const s = [...tiers].sort((a, b) => a.minQty - b.minQty);
  let cur = s[0]!;
  for (const t of s) {
    if (qty >= t.minQty) cur = t;
  }
  return cur;
}

/** Nächste günstigere Staffel (höhere minQty), sofern vorhanden. */
export function nextCheaperTier(qty: number, tiers: VolumePriceTier[]): VolumePriceTier | null {
  const s = [...tiers].sort((a, b) => a.minQty - b.minQty);
  const active = activeTierForQty(qty, tiers);
  const next = s.find((t) => t.minQty > qty && t.listPriceEur < active.listPriceEur);
  return next ?? null;
}

export function unitsUntilNextTier(qty: number, tiers: VolumePriceTier[]): number | null {
  const next = nextCheaperTier(qty, tiers);
  if (!next) return null;
  return Math.max(0, next.minQty - qty);
}

export function effectiveReferencePerVial(qty: number, v: ProductVariant): number {
  const q = Math.min(999, Math.max(1, Math.floor(qty)));
  return activeTierForQty(q, getVolumeTiersForVariant(v)).listPriceEur;
}

export function findVariantBySku(sku: string): { product: Product; variant: ProductVariant } | null {
  const q = sku.trim().toUpperCase();
  for (const p of allProducts) {
    const v = p.variants.find((x) => x.sku.toUpperCase() === q);
    if (v) return { product: p, variant: v };
  }
  return null;
}

export function effectiveReferencePerVialForSku(sku: string, qty: number): number | null {
  const hit = findVariantBySku(sku);
  if (!hit) return null;
  return effectiveReferencePerVial(qty, hit.variant);
}
