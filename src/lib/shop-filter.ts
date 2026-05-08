import type { Product } from "@/lib/product-types";

export type ShopSortId =
  | "catalog"
  | "relevance"
  | "name-asc"
  | "name-desc"
  | "sku-asc"
  | "sku-desc"
  | "price-asc"
  | "price-desc";

function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

function variantSearchBlob(p: Product): string {
  return p.variants.map((v) => `${v.sku} ${v.pack}`).join(" ");
}

function relevanceScore(p: Product, queryNorm: string): number {
  if (!queryNorm) return 0;
  const name = normalizeText(p.name);
  const short = normalizeText(p.shortDescription);
  const cat = normalizeText(p.category);
  const desc = normalizeText(p.description);
  const slug = normalizeText(p.slug);
  const sku = normalizeText(p.sku);
  const variantSkus = normalizeText(variantSearchBlob(p));
  const cas = p.casNumber ? normalizeText(p.casNumber) : "";
  let score = 0;
  if (variantSkus.includes(queryNorm)) score += 18;
  if (sku.includes(queryNorm)) score += 16;
  if (name.includes(queryNorm)) score += 14;
  if (name.startsWith(queryNorm)) score += 5;
  if (short.includes(queryNorm)) score += 7;
  if (slug.includes(queryNorm)) score += 6;
  if (cat.includes(queryNorm)) score += 4;
  if (desc.includes(queryNorm)) score += 2;
  if (cas.includes(queryNorm)) score += 8;
  return score;
}

export function filterShopProducts(
  catalog: Product[],
  opts: {
    query: string;
    category: string | null;
    sort: ShopSortId;
  },
): Product[] {
  const queryNorm = normalizeText(opts.query.trim());
  const hasQuery = queryNorm.length > 0;

  const orderIndex = new Map(catalog.map((p, i) => [p.id, i]));

  let list = [...catalog];
  if (opts.category) list = list.filter((p) => p.category === opts.category);
  if (hasQuery) {
    list = list.filter((p) => {
      const hay = normalizeText(
        `${p.name} ${p.shortDescription} ${p.category} ${p.description} ${p.slug} ${p.sku} ${variantSearchBlob(p)} ${p.casNumber ?? ""} ${p.molecularFormula ?? ""}`,
      );
      return hay.includes(queryNorm);
    });
  }

  const out = [...list];

  const byCatalog = () =>
    out.sort((a, b) => (orderIndex.get(a.id) ?? 0) - (orderIndex.get(b.id) ?? 0));

  switch (opts.sort) {
    case "relevance":
      if (hasQuery) {
        out.sort(
          (a, b) =>
            relevanceScore(b, queryNorm) - relevanceScore(a, queryNorm) ||
            (orderIndex.get(a.id) ?? 0) - (orderIndex.get(b.id) ?? 0),
        );
      } else {
        byCatalog();
      }
      break;
    case "name-asc":
      out.sort((a, b) => a.name.localeCompare(b.name, "de") || (orderIndex.get(a.id) ?? 0) - (orderIndex.get(b.id) ?? 0));
      break;
    case "name-desc":
      out.sort((a, b) => b.name.localeCompare(a.name, "de") || (orderIndex.get(a.id) ?? 0) - (orderIndex.get(b.id) ?? 0));
      break;
    case "sku-asc":
      out.sort((a, b) => a.sku.localeCompare(b.sku, "de") || (orderIndex.get(a.id) ?? 0) - (orderIndex.get(b.id) ?? 0));
      break;
    case "sku-desc":
      out.sort((a, b) => b.sku.localeCompare(a.sku, "de") || (orderIndex.get(a.id) ?? 0) - (orderIndex.get(b.id) ?? 0));
      break;
    case "price-asc":
      out.sort((a, b) => {
        const pa = a.listPriceEur ?? Number.POSITIVE_INFINITY;
        const pb = b.listPriceEur ?? Number.POSITIVE_INFINITY;
        return pa - pb || (orderIndex.get(a.id) ?? 0) - (orderIndex.get(b.id) ?? 0);
      });
      break;
    case "price-desc":
      out.sort((a, b) => {
        const pa = a.listPriceEur ?? Number.NEGATIVE_INFINITY;
        const pb = b.listPriceEur ?? Number.NEGATIVE_INFINITY;
        return pb - pa || (orderIndex.get(a.id) ?? 0) - (orderIndex.get(b.id) ?? 0);
      });
      break;
    case "catalog":
    default:
      byCatalog();
      break;
  }

  return out;
}

export const shopSortOptions: { id: ShopSortId; label: string }[] = [
  { id: "catalog", label: "Katalogreihenfolge" },
  { id: "relevance", label: "Beste Treffer (bei Suche)" },
  { id: "sku-asc", label: "SKU A–Z" },
  { id: "sku-desc", label: "SKU Z–A" },
  { id: "name-asc", label: "Name A–Z" },
  { id: "name-desc", label: "Name Z–A" },
  { id: "price-asc", label: "Preis aufsteigend (EUR)" },
  { id: "price-desc", label: "Preis absteigend (EUR)" },
];
