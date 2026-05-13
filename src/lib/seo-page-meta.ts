import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { seoGlobalKeywords } from "@/lib/seo-defaults";
import { siteOrigin } from "@/lib/site-origin";

/** Default-OG-Bild (Next.js `opengraph-image.tsx`). */
export const SEO_OG_IMAGE_PATH = "/opengraph-image";

function baseUrl(): string {
  return siteOrigin().replace(/\/+$/, "");
}

/** Kanonische URL ohne trailing slash am Domain-Root, mit Pfad. */
export function canonicalUrlForPath(path: string): string {
  const base = baseUrl();
  if (!path || path === "/") return base;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export type BuildPageSeoInput = {
  path: string;
  /** Kurztitel (wird mit „· {brand}“ in OG/Twitter ergänzt). */
  title: string;
  /** Meta-Description (ca. 120–165 Zeichen empfohlen). */
  description: string;
  /** Optional: kürzerer OG-/Card-Text; sonst = description */
  socialDescription?: string;
  keywords?: readonly string[];
  robots?: Metadata["robots"];
  category?: Metadata["category"];
};

/**
 * Einheitliche Meta-Tags: canonical, hreflang, OG, Twitter, Keywords, Autor.
 * Für KI-/Suchmaschinen-Kontext: konsistente Sprache, klare Titel, stabile URLs.
 */
export function buildPublicPageMetadata(opts: BuildPageSeoInput): Metadata {
  const url = canonicalUrlForPath(opts.path);
  const base = baseUrl();
  const ogImageUrl = `${base}${SEO_OG_IMAGE_PATH}`;
  const socialDesc = (opts.socialDescription ?? opts.description).trim();

  const merged = [...(opts.keywords ?? []), ...seoGlobalKeywords]
    .map((s) => String(s).trim())
    .filter(Boolean);
  const keywords = [...new Set(merged)].slice(0, 42);

  const fullSocialTitle = `${opts.title} · ${brand.name}`;

  return {
    title: opts.title,
    description: opts.description.trim(),
    keywords,
    ...(opts.category ? { category: opts.category } : {}),
    authors: [{ name: brand.legalName, url: base }],
    applicationName: brand.name,
    alternates: {
      canonical: url,
      languages: {
        "de-DE": url,
        "x-default": url,
      },
    },
    robots:
      opts.robots ?? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      },
    openGraph: {
      type: "website",
      locale: "de_DE",
      url,
      siteName: brand.name,
      title: fullSocialTitle,
      description: socialDesc,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${brand.name} — ${opts.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullSocialTitle,
      description: socialDesc,
      images: [ogImageUrl],
    },
    other: {
      "geo.region": "DE-BY",
      "geo.placename": brand.city,
    },
  };
}
