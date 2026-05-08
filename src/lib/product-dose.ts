import type { Product, ProductVariant } from "@/lib/product-types";

/** Erste Dosis/Menge: „10mg × …“, „10ml × …“, „1000mg × …“ */
const DOSE_IN_PACK = /(\d+(?:\.\d+)?)\s*(mg|ml|mL|ML|Mg|µg|mcg|ug)\b/i;

export function parseDoseFromPack(pack: string): { doseLabel: string; sortValue: number } | null {
  const m = pack.match(DOSE_IN_PACK);
  if (!m) return null;
  const n = parseFloat(m[1]!);
  if (Number.isNaN(n)) return null;
  let unit = m[2]!.toLowerCase();
  if (unit === "ug") unit = "µg";
  if (unit === "mcg") unit = "µg";
  const doseLabel = `${m[1]} ${unit}`;
  return { doseLabel, sortValue: n };
}

export type DoseChip = {
  variant: ProductVariant;
  doseLabel: string;
  sortValue: number;
};

/** Sortierte Varianten für Picker & Bild-Leiste (mg/ml zuerst numerisch). */
export function buildDoseChips(product: Product): DoseChip[] {
  const raw = product.variants.map((v) => {
    const parsed = parseDoseFromPack(v.pack);
    return {
      variant: v,
      doseLabel: parsed?.doseLabel ?? v.sku,
      sortValue: parsed?.sortValue ?? Number.MAX_SAFE_INTEGER,
    };
  });
  const allHaveDose = raw.every((r) => parseDoseFromPack(r.variant.pack) !== null);
  raw.sort((a, b) =>
    allHaveDose
      ? a.sortValue - b.sortValue || a.variant.sku.localeCompare(b.variant.sku)
      : a.variant.sku.localeCompare(b.variant.sku),
  );
  return raw;
}

/** Kurzlabels für die optische mg-Leiste auf dem Bild (max. `max` + Rest als +n). */
export function getDoseStripMeta(
  product: Product,
  max = 5,
): { visible: { label: string; eur: number }[]; more: number } {
  if (product.variants.length === 0) {
    return { visible: [], more: 0 };
  }
  const chips = buildDoseChips(product);
  const items = chips.map((c) => ({ label: c.doseLabel, eur: c.variant.listPriceEur }));
  if (items.length <= max) {
    return { visible: items, more: 0 };
  }
  return { visible: items.slice(0, max), more: items.length - max };
}
