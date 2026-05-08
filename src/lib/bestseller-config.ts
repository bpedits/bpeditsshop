import type { Product } from "@/lib/product-types";

/**
 * Reihenfolge der Bestseller auf der Startseite (Slugs wie im gebauten Katalog).
 * Bei Datenänderungen ggf. anpassen — fehlende Slugs werden übersprungen.
 */
export const BESTSELLER_SLUG_ORDER: readonly string[] = [
  "bpc",
  "tb",
  "semaglutide",
  "tirzepatide",
  "mots-c",
  "igf-1-lr3",
  "epithalon",
  "ipamorelin",
];

export function getHomeBestsellers(products: Product[]): Product[] {
  const order = new Map(BESTSELLER_SLUG_ORDER.map((s, i) => [s, i]));
  return products
    .filter((p) => p.bestseller)
    .sort((a, b) => (order.get(a.slug) ?? 999) - (order.get(b.slug) ?? 999));
}
