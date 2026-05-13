import type { Product } from "@/lib/product-types";

/**
 * Reihenfolge der Bestseller auf der Startseite (Slugs wie im gebauten Katalog).
 * Bei Datenänderungen ggf. anpassen — fehlende Slugs werden übersprungen.
 */
/** Reihenfolge = gewünschte Darstellung auf der Startseite (RUO-Kernsortiment). */
export const BESTSELLER_SLUG_ORDER: readonly string[] = [
  "retatrutide",
  "ghk-cu",
  "glow",
  "bpc",
  "cjc5-ipa5",
  "bac-water",
  "mt-2",
  "tesamorelin",
];

export function getHomeBestsellers(products: Product[]): Product[] {
  const order = new Map(BESTSELLER_SLUG_ORDER.map((s, i) => [s, i]));
  return products
    .filter((p) => p.bestseller)
    .sort((a, b) => (order.get(a.slug) ?? 999) - (order.get(b.slug) ?? 999));
}
