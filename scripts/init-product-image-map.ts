/**
 * Legt `public/images/products/_slug-to-file.map.json` an (alle Katalog-Slugs → leerer String).
 * Danach pro Zeile den echten Dateinamen eintragen, z. B. "hf_20260512_....png".
 *
 * Existiert die Datei schon, wird nicht überschrieben.
 *
 *   npm run catalog:images:init-map
 */
import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { allProducts } from "@/lib/product-catalog";

const DIR = join(process.cwd(), "public", "images", "products");
const OUT = join(DIR, "_slug-to-file.map.json");

function main() {
  if (existsSync(OUT)) {
    console.log(`Überspringe: ${OUT} existiert bereits.`);
    return;
  }
  const slugs = [...new Set(allProducts.map((p) => p.slug))].sort();
  const obj: Record<string, string> = {};
  for (const s of slugs) obj[s] = "";
  writeFileSync(OUT, JSON.stringify(obj, null, 2) + "\n", "utf8");
  console.log(`OK: ${OUT} mit ${slugs.length} Slugs angelegt — bitte Dateinamen eintragen und npm run catalog:images ausführen.`);
}

main();
