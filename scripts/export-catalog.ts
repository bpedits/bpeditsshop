/**
 * Schreibt `public/katalog/produktliste.csv` aus dem gebauten Katalog.
 *
 *   npm run catalog:export
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { getProductCatalogExportRows } from "@/lib/product-catalog";

function csvCell(s: string): string {
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const rows = getProductCatalogExportRows();
const header = [
  "Katalognummer",
  "Name",
  "Kategorie",
  "SKU",
  "Packung",
  "Referenz_EUR_pro_Vial",
  "Slug",
  "Shop_Pfad",
];

const lines = [
  header.join(","),
  ...rows.map((r) =>
    [
      csvCell(r.catalogNo),
      csvCell(r.name),
      csvCell(r.category),
      csvCell(r.sku),
      csvCell(r.pack),
      String(r.listPriceEur),
      csvCell(r.slug),
      csvCell(r.shopPath),
    ].join(","),
  ),
];

const outDir = join(process.cwd(), "public", "katalog");
const outFile = join(outDir, "produktliste.csv");
mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, lines.join("\n") + "\n", "utf8");
console.log(`OK: ${outFile} (${rows.length} Artikelzeilen)`);
