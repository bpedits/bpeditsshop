import type { Product } from "@/lib/product-types";
import { getHomeBestsellers } from "@/lib/bestseller-config";

/**
 * PDP-Vorschläge: zuerst gleiche Kategorie (Katalogreihenfolge), dann Bestseller, dann Rest — ohne aktuelles Produkt.
 */
export function suggestedProductsForPdp(current: Product, catalog: Product[], max = 8): Product[] {
  const out: Product[] = [];
  const seen = new Set<string>();

  const add = (p: Product) => {
    if (p.id === current.id || seen.has(p.id)) return;
    seen.add(p.id);
    out.push(p);
  };

  for (const p of catalog) {
    if (out.length >= max) break;
    if (p.category === current.category) add(p);
  }

  for (const p of getHomeBestsellers(catalog)) {
    if (out.length >= max) break;
    add(p);
  }

  for (const p of catalog) {
    if (out.length >= max) break;
    add(p);
  }

  return out.slice(0, max);
}
