/**
 * Standard-Motiv, wenn kein produktspezifisches Bild unter `public/images/products/` liegt.
 * Datei: `public/images/…`
 */
import manifestJson from "./product-images-manifest.json";

export const PRODUCT_CATALOG_IMAGE_SRC =
  "/images/hf_20260508_010542_d4d84468-62c2-4881-a64e-6d8a81a245a0.png" as const;

export const PRODUCT_CATALOG_IMAGE_WIDTH = 4096;
export const PRODUCT_CATALOG_IMAGE_HEIGHT = 4096;

const manifest = manifestJson as Record<string, string>;

/** Öffentliche URL zum Produktbild — Slug muss Dateiname in `public/images/products/` entsprechen. */
export function getProductCatalogImageSrc(slug: string): string {
  const p = manifest[slug];
  return typeof p === "string" && p.length > 0 ? p : PRODUCT_CATALOG_IMAGE_SRC;
}
