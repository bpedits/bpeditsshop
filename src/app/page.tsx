import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getHomeBestsellers } from "@/lib/bestseller-config";
import { HomeHero } from "@/components/home-hero";
import { HomeInstitutionRating } from "@/components/home-institution-rating";
import { ProductCard } from "@/components/product-card";
import { QualityChainSection } from "@/components/quality-chain-section";
import { ShopProductGrid } from "@/components/shop-product-grid";
import { TrustStrip } from "@/components/trust-strip";
import { brand } from "@/lib/brand";
import { seoGlobalKeywords, seoHomeDescription, seoSiteTagline } from "@/lib/seo-defaults";
import { siteOrigin } from "@/lib/site-origin";
import { getProducts } from "@/lib/products";

const homeCanonical = siteOrigin();

export const metadata: Metadata = {
  title: "Peptide & Forschungsmaterialien (RUO)",
  description: seoHomeDescription,
  keywords: [...seoGlobalKeywords],
  alternates: {
    canonical: homeCanonical,
    languages: {
      "de-DE": homeCanonical,
      "x-default": homeCanonical,
    },
  },
  openGraph: {
    url: homeCanonical,
    title: `${brand.name} — Peptide & Forschungsmaterialien (RUO)`,
    description: seoSiteTagline,
  },
  twitter: {
    title: `${brand.name} — Forschungskatalog & Institution`,
    description: seoSiteTagline,
  },
};

export default async function HomePage() {
  const catalog = await getProducts();
  const bestsellers = getHomeBestsellers(catalog);
  const hasProducts = catalog.length > 0;

  return (
    <div>
      <HomeHero />
      <HomeInstitutionRating />

      {hasProducts && bestsellers.length > 0 ? (
        <section className="mx-auto max-w-[1200px] page-gutter-x pb-10 pt-12 sm:pb-12 sm:pt-16 md:pb-14 md:pt-20">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <h2 className="text-[22px] font-semibold tracking-tight text-foreground sm:text-[26px]">Bestseller</h2>
            <p className="text-[14px] text-muted sm:max-w-md sm:text-right">
              Häufig angefragte Referenzartikel — Dosierungen und Details auf der Produktseite.
            </p>
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-4 sm:mt-8 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {bestsellers.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section
        className={`mx-auto max-w-[1200px] page-gutter-x pb-12 sm:pb-16 md:pb-20 ${
          hasProducts && bestsellers.length > 0
            ? "border-t border-black/[0.06] pt-12 sm:pt-16"
            : "py-12 sm:py-16 md:py-20"
        }`}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-[22px] font-semibold tracking-tight text-foreground sm:text-[26px]">Katalog</h2>
            <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-muted sm:text-[15px]">
              {hasProducts
                ? "Alle Artikel mit Suche, Kategorie und Sortierung — derselbe Inhalt wie unter /shop."
                : "Der öffentliche Katalog wird derzeit ohne Einzelartikel gepflegt."}
            </p>
          </div>
          {!hasProducts ? (
            <Link
              href="/anfrage"
              className="shrink-0 self-start text-[15px] font-normal text-tint hover:opacity-80 sm:self-auto"
            >
              Anfrage stellen
            </Link>
          ) : null}
        </div>

        <div className="mt-8 sm:mt-10">
          {hasProducts ? (
            <Suspense
              fallback={
                <div
                  className="min-h-[240px] rounded-[22px] border border-black/[0.06] bg-gradient-to-b from-surface-pearl/40 to-transparent"
                  aria-hidden
                />
              }
            >
              <ShopProductGrid products={catalog} />
            </Suspense>
          ) : (
            <div className="rounded-[20px] border border-black/[0.06] bg-surface px-5 py-10 text-center sm:px-8">
              <p className="text-[15px] leading-relaxed text-muted">
                Bedarf und Spezifikation klären wir gerne direkt mit Ihrer Einrichtung.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/anfrage"
                  className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full bg-tint px-6 text-[14px] font-semibold text-white transition hover:opacity-92"
                >
                  Anfrage
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full bg-fill-secondary px-6 text-[14px] font-medium text-foreground transition-colors hover:bg-fill-secondary-pressed"
                >
                  Zum Katalog
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <TrustStrip />

      <QualityChainSection />
    </div>
  );
}
