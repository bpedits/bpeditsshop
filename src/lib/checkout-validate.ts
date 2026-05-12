import type { CartLine } from "@/lib/cart-storage";
import { allProducts } from "@/lib/product-catalog";
import { displayPackForShop } from "@/lib/product-pack-display";
import { effectiveReferencePerVial } from "@/lib/volume-price-tiers";

const MAX_LINES = 40;
const MAX_QTY = 999;

function findVariantBySku(sku: string) {
  const q = sku.trim().toUpperCase();
  for (const product of allProducts) {
    const variant = product.variants.find((v) => v.sku.toUpperCase() === q);
    if (variant) return { product, variant };
  }
  return null;
}

/**
 * Warenkorb für Zahlung / Bestellung: nur serverseitige Katalogpreise, Mengen begrenzt.
 */
export function validateCartForPayment(
  raw: unknown,
): { ok: true; lines: CartLine[] } | { ok: false; error: string } {
  if (!Array.isArray(raw)) {
    return { ok: false, error: "Ungültiger Warenkorb." };
  }
  if (raw.length === 0) {
    return { ok: false, error: "Warenkorb ist leer." };
  }

  const qtyBySkuUpper = new Map<string, number>();
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const o = row as Record<string, unknown>;
    const sku = String(o.sku ?? "").trim();
    if (!sku) continue;
    const q = Math.min(MAX_QTY, Math.max(1, Math.floor(Number(o.qty)) || 1));
    const k = sku.toUpperCase();
    qtyBySkuUpper.set(k, (qtyBySkuUpper.get(k) ?? 0) + q);
  }

  if (qtyBySkuUpper.size > MAX_LINES) {
    return { ok: false, error: `Maximal ${MAX_LINES} verschiedene SKUs.` };
  }

  const out: CartLine[] = [];
  for (const [skuUpper, qty] of qtyBySkuUpper) {
    const found = findVariantBySku(skuUpper);
    if (!found) {
      return { ok: false, error: `Unbekannte SKU: ${skuUpper}` };
    }

    const serverEur = effectiveReferencePerVial(qty, found.variant);
    if (!Number.isFinite(serverEur) || serverEur <= 0) {
      return { ok: false, error: `Kein gültiger Preis für ${found.variant.sku}.` };
    }

    out.push({
      sku: found.variant.sku,
      productName: found.product.name,
      productSlug: found.product.slug,
      packLabel: displayPackForShop(found.variant.pack),
      listPriceEur: serverEur,
      qty,
    });
  }

  if (out.length === 0) {
    return { ok: false, error: "Keine gültigen Positionen." };
  }

  return { ok: true, lines: out };
}

export function cartTotalEur(lines: CartLine[]): number {
  return lines.reduce((s, l) => s + l.listPriceEur * l.qty, 0);
}
