/**
 * Liest `public/images/products/*` und schreibt `src/lib/product-images-manifest.json`.
 * Dateiname ohne Endung = Produkt-Slug (wie in der URL /shop/{slug}).
 *
 *   npm run catalog:images
 *
 * Bevorzugte Reihenfolge bei mehreren Dateien gleichen Slugs: webp > png > jpg > jpeg
 */
import { readdirSync, writeFileSync } from "node:fs";
import { basename, extname, join } from "node:path";

const ROOT = process.cwd();
const DIR = join(ROOT, "public", "images", "products");
const OUT = join(ROOT, "src", "lib", "product-images-manifest.json");

const ORDER = [".webp", ".png", ".jpg", ".jpeg"] as const;

function rank(ext: string): number {
  const i = ORDER.indexOf(ext.toLowerCase() as (typeof ORDER)[number]);
  return i === -1 ? 99 : i;
}

function main() {
  let entries: string[] = [];
  try {
    entries = readdirSync(DIR);
  } catch {
    writeFileSync(OUT, "{}\n", "utf8");
    console.log("OK: keine Produktbilder (Ordner fehlt oder leer) → leeres Manifest.");
    return;
  }

  const best = new Map<string, { ext: string; file: string }>();

  for (const file of entries) {
    if (file.startsWith(".")) continue;
    const ext = extname(file);
    if (!ext || rank(ext) === 99) continue;
    const slug = basename(file, ext);
    if (!slug) continue;
    const cur = best.get(slug);
    if (!cur || rank(ext) < rank(cur.ext)) {
      best.set(slug, { ext, file });
    }
  }

  const manifest: Record<string, string> = {};
  for (const [slug, { file }] of best) {
    manifest[slug] = `/images/products/${file}`;
  }

  writeFileSync(OUT, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log(`OK: ${OUT} (${Object.keys(manifest).length} Produktbilder)`);
}

main();
