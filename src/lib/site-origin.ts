import { brand } from "@/lib/brand";

/** Kanonische Basis-URL für Metadata, Sitemap, JSON-LD — vorrangig `NEXT_PUBLIC_SITE_URL`, sonst `brand.origin`. */
export function siteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) return raw.replace(/\/+$/, "");
  return brand.origin;
}
