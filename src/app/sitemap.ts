import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";
import { siteOrigin } from "@/lib/site-origin";

export const dynamic = "force-static";

const staticPaths = [
  "/",
  "/shop",
  "/anfrage",
  "/forschungsbedingungen-b2b",
  "/impressum",
  "/datenschutz",
  "/agb",
  "/widerruf",
  "/zahlung-versand",
  "/versand",
  "/ueber-uns",
  "/kontakt",
  "/hilfe",
  "/cookies",
  "/sicherheit-vertraulichkeit",
  "/qualitaet-labor",
  "/rechtliches",
  "/barrierefreiheit",
  "/affiliate",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteOrigin();
  const lastMod = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${base}${path}`,
    lastModified: lastMod,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/shop" ? 0.9 : 0.6,
  }));

  const products = await getProducts();

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${base}/shop/${p.slug}`,
    lastModified: lastMod,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...productEntries];
}
