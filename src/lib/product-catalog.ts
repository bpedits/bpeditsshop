import type { Product, ProductVariant } from "@/lib/product-types";
import { BESTSELLER_SLUG_ORDER } from "@/lib/bestseller-config";
import { researchDisclaimerShort } from "@/lib/brand";
import { displayPackForShop } from "@/lib/product-pack-display";
import { researchMetadataForProductName } from "@/lib/product-research-metadata";
import priceList from "@/lib/price-list-data.json";
import { formatReferenceEur } from "@/lib/reference-price";

type PriceRow = {
  sku: string;
  name: string;
  pack: string;
  eur: number;
  category: string;
};

function rp(base: Omit<Product, "description"> & { description: string }): Product {
  return {
    ...base,
    description: `${base.description.trim()} ${researchDisclaimerShort}`,
  };
}

/** Chemische Stammdaten aus internem Datenblatt — nur wo Lookup zum Preislisten-Namen passt. */
function mergeResearchMetadata(base: Product): Product {
  const m = researchMetadataForProductName(base.name);
  if (!m) return base;
  return {
    ...base,
    casNumber: m.casNumber ?? base.casNumber,
    molecularFormula: m.molecularFormula ?? base.molecularFormula,
    molecularWeight: m.molecularWeight ?? base.molecularWeight,
    storageConditions: m.storageConditions ?? base.storageConditions,
  };
}

const ACCENTS = [
  "#1d3a5c",
  "#2c5282",
  "#1a365d",
  "#2b6cb0",
  "#2c7a7b",
  "#553c9a",
  "#44337a",
  "#285e61",
] as const;

function accentFor(key: string): string {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return ACCENTS[h % ACCENTS.length] ?? "#1d3a5c";
}

function slugify(s: string): string {
  const t = s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return t || "item";
}

function documentationForCategory(category: string): { coa: boolean; sds: boolean } {
  if (category === "Rekonstitution RUO" || category === "Lösungen & Gebinde RUO") {
    return { coa: false, sds: true };
  }
  return { coa: true, sds: true };
}

function storageForCategory(category: string): string {
  if (category === "Rekonstitution RUO" || category === "Lösungen & Gebinde RUO") {
    return "2–8 °C bzw. Raumtemperatur gemäß Etikett; verschlossen lagern.";
  }
  return "−20 °C ± 5 °C, trocken, lichtgeschützt (sofern lyophilisiert — siehe CoA).";
}

function groupKey(row: PriceRow): string {
  return `${row.category}|||${row.name.trim()}`;
}

function buildProducts(rows: PriceRow[], usedSlugs: Set<string>): Product[] {
  const groups = new Map<string, PriceRow[]>();
  for (const row of rows) {
    const k = groupKey(row);
    const g = groups.get(k) ?? [];
    g.push(row);
    groups.set(k, g);
  }

  const out: Product[] = [];
  let idx = 0;
  let catalogSeq = 0;

  for (const [, groupRows] of groups) {
    groupRows.sort((a, b) => a.eur - b.eur || a.sku.localeCompare(b.sku, "de"));
    const first = groupRows[0]!;
    catalogSeq += 1;
    /** Eine Nummer pro Produkt — alle SKUs/Varianten (z. B. 5 mg und 10 mg) teilen dieselbe Kat.-Nr. */
    const catalogNo = `BPP-KAT-${String(catalogSeq).padStart(4, "0")}`;
    const variants: ProductVariant[] = groupRows.map((r) => ({
      sku: r.sku.trim(),
      pack: r.pack,
      listPriceEur: r.eur,
    }));
    const minEur = Math.min(...variants.map((v) => v.listPriceEur));
    const maxEur = Math.max(...variants.map((v) => v.listPriceEur));
    const name = first.name;
    const category = first.category;
    const docs = documentationForCategory(category);
    const id = `fam-${String(++idx).padStart(3, "0")}`;

    let slug = slugify(name);
    if (usedSlugs.has(slug)) {
      slug = `${slugify(name)}-${slugify(category).slice(0, 24)}`;
    }
    let n = 2;
    const baseSlug = slug;
    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${n}`;
      n++;
    }
    usedSlugs.add(slug);

    const nVar = variants.length;
    const shortDescription =
      nVar > 1
        ? `${nVar} Dosierungen (mg/ml) · ab ${formatReferenceEur(minEur)}${maxEur !== minEur ? ` – ${formatReferenceEur(maxEur)}` : ""} pro Vial · nur Labor / RUO (Disclaimer).`
        : `${displayPackForShop(variants[0]!.pack)} · ${formatReferenceEur(minEur)} pro Vial · nur Labor / RUO (Disclaimer).`;

    const formatSummary = variants.map((v) => `${v.sku}: ${displayPackForShop(v.pack)}`).join(" · ");

    out.push(
      mergeResearchMetadata(
        rp({
          id,
          slug,
          catalogNo,
          sku: variants[0]!.sku,
          name,
          shortDescription,
          description:
            nVar > 1
              ? `${nVar} Preislisten-Varianten (SKU / Dosierung); Referenz EUR jeweils pro Vial. Identität und Reinheit je Variante gemäß CoA / Spezifikation — nur für professionelle Forschung (RUO, Labor).`
              : `Ausführung gemäß Preisliste: ${displayPackForShop(variants[0]!.pack)}. Referenz EUR pro Vial. Nur für professionelle Forschung (RUO, Labor). Identität und Reinheit gemäß CoA / Spezifikation.`,
          category,
          accent: accentFor(name + category),
          casNumber: null,
          molecularFormula: null,
          molecularWeight: null,
          purity: "Gemäß CoA / Spezifikation (RUO)",
          format: formatSummary,
          storageConditions: storageForCategory(category),
          documentation: docs,
          variants,
          listPriceEur: minEur,
        }),
      ),
    );
  }

  return out;
}

function applyBestsellerFlags(products: Product[]): Product[] {
  const mark = new Set(BESTSELLER_SLUG_ORDER);
  return products.map((p) => (mark.has(p.slug) ? { ...p, bestseller: true } : p));
}

const rows = priceList as PriceRow[];
const usedSlugs = new Set<string>();

/** B2B-Katalog: Produktfamilien mit `variants[]` aus `price-list-data.json`. */
export const allProducts: Product[] = applyBestsellerFlags(
  rows.length === 0 ? [] : buildProducts(rows, usedSlugs),
);

/** Eine Zeile pro SKU für Exporte (CSV, Admin, Inventar). */
export type ProductCatalogExportRow = {
  catalogNo: string;
  name: string;
  category: string;
  sku: string;
  pack: string;
  listPriceEur: number;
  slug: string;
  shopPath: string;
};

export function getProductCatalogExportRows(): ProductCatalogExportRow[] {
  return allProducts.flatMap((p) =>
    p.variants.map((v) => ({
      catalogNo: p.catalogNo,
      name: p.name,
      category: p.category,
      sku: v.sku,
      pack: v.pack,
      listPriceEur: v.listPriceEur,
      slug: p.slug,
      shopPath: `/shop/${p.slug}?sku=${encodeURIComponent(v.sku)}`,
    })),
  );
}
