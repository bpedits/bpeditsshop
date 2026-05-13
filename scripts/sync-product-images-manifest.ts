/**
 * Baut `src/lib/product-images-manifest.json` für Produkt-Slugs.
 *
 * 1) Direkt: `public/images/products/{slug}.webp` (oder .png / .jpg)
 * 2) Zuordnung: `public/images/products/_slug-to-file.map.json`
 *    { "retatrutide": "hf_20260512_....png", "l-carnatine": "..." }
 *    Werte = exakter Dateiname im gleichen Ordner (für HF-/Export-Namen).
 *
 *   npm run catalog:images
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, extname, join } from "node:path";

import { allProducts } from "@/lib/product-catalog";

const ROOT = process.cwd();
const DIR = join(ROOT, "public", "images", "products");
const OUT = join(ROOT, "src", "lib", "product-images-manifest.json");
const MAP_NAME = "_slug-to-file.map.json";

const ORDER = [".webp", ".png", ".jpg", ".jpeg"] as const;

function rank(ext: string): number {
  const i = ORDER.indexOf(ext.toLowerCase() as (typeof ORDER)[number]);
  return i === -1 ? 99 : i;
}

function loadSlugFileMap(): Record<string, string> | null {
  const p = join(DIR, MAP_NAME);
  if (!existsSync(p)) return null;
  try {
    const raw = readFileSync(p, "utf8").trim();
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    console.warn(`WARN: ${MAP_NAME} konnte nicht gelesen werden (ungültiges JSON?).`);
    return null;
  }
}

function main() {
  const slugSet = new Set(allProducts.map((p) => p.slug));

  let entries: string[] = [];
  try {
    entries = readdirSync(DIR);
  } catch {
    writeFileSync(OUT, "{}\n", "utf8");
    console.log("OK: kein Ordner public/images/products → leeres Manifest.");
    return;
  }

  const manifest: Record<string, string> = {};
  const usedFiles = new Set<string>();

  // --- A) Slug = Dateiname (klassisch) ------------------------------------
  const best = new Map<string, { ext: string; file: string }>();
  for (const file of entries) {
    if (file.startsWith(".") || file === MAP_NAME) continue;
    const ext = extname(file);
    if (!ext || rank(ext) === 99) continue;
    const slug = basename(file, ext);
    if (!slug || slug.startsWith("_")) continue;
    if (!slugSet.has(slug)) continue;
    const cur = best.get(slug);
    if (!cur || rank(ext) < rank(cur.ext)) {
      best.set(slug, { ext, file });
    }
  }
  for (const [slug, { file }] of best) {
    manifest[slug] = `/images/products/${file}`;
    usedFiles.add(file);
  }

  // --- B) Map: Slug → beliebiger Dateiname --------------------------------
  const slugToFile = loadSlugFileMap();
  if (slugToFile) {
    for (const [slug, fileName] of Object.entries(slugToFile)) {
      if (!slugSet.has(slug)) {
        console.warn(`WARN: Unbekannter Slug in ${MAP_NAME}: "${slug}" (nicht im Katalog).`);
        continue;
      }
      const v = (fileName ?? "").trim();
      if (!v) continue;
      const abs = join(DIR, v);
      if (!existsSync(abs)) {
        console.warn(`WARN: ${MAP_NAME}: für "${slug}" fehlt die Datei "${v}".`);
        continue;
      }
      manifest[slug] = `/images/products/${v}`;
      usedFiles.add(v);
    }
  }

  writeFileSync(OUT, JSON.stringify(manifest, null, 2) + "\n", "utf8");

  // --- Report --------------------------------------------------------------
  const missing = [...slugSet].filter((s) => !manifest[s]);
  const orphans = entries.filter((f) => {
    if (f.startsWith(".") || f === MAP_NAME || f === ".gitkeep") return false;
    const ext = extname(f);
    if (!ext || rank(ext) === 99) return false;
    return !usedFiles.has(f);
  });

  console.log(`OK: ${OUT} (${Object.keys(manifest).length} von ${slugSet.size} Produkten mit Bild).`);
  if (missing.length) {
    console.log(`\nOhne Bild (${missing.length}):`);
    for (const s of missing.sort()) console.log(`  - ${s}`);
  }
  if (orphans.length) {
    console.log(`\nNicht zugeordnete Dateien (${orphans.length}) — in ${MAP_NAME} eintragen oder in {slug}.png umbenennen:`);
    for (const f of orphans.sort()) console.log(`  - ${f}`);
  }
  if (slugToFile === null && orphans.some((f) => f.startsWith("hf_"))) {
    console.log(
      `\nHinweis: Dateien wie "hf_....png" passen nicht automatisch zu einem Slug.\n` +
        `Lege ${MAP_NAME} an (siehe npm run catalog:images:init-map) und trage pro Slug den Dateinamen ein.`,
    );
  }
}

main();
