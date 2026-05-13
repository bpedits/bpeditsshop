import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { brand } from "@/lib/brand";
import { buildPublicPageMetadata } from "@/lib/seo-page-meta";
import { getProducts } from "@/lib/products";
import { ResearchUseNotice } from "@/components/research-use-notice";
import { ShopProductGrid } from "@/components/shop-product-grid";

const shopDesc = `${brand.name}: Öffentlicher Forschungskatalog mit Suche, Kategorien und Referenzpreisen (EUR pro Vial) — institutionelle Konditionen und Freigaben auf Anfrage. RUO / Labor, ${brand.city}. Lieferung in ausgewählte europäische Länder.`;

export const metadata: Metadata = buildPublicPageMetadata({
  path: "/shop",
  title: "Katalog",
  description: shopDesc,
  socialDescription: `Peptide und Forschungsmaterialien im institutionellen Katalog — ${brand.city}, ${brand.country}.`,
  keywords: [
    "Forschungskatalog",
    "Peptide RUO",
    "RUO Katalog",
    "Referenzpreis EUR",
    "Shop Suche Peptide",
    "Katalogfilter",
  ],
  category: "science",
});

export default async function ShopPage() {
  const catalog = await getProducts();
  const categoryCount = new Set(catalog.map((p) => p.category)).size;
  const hasProducts = catalog.length > 0;

  return (
    <div className="mx-auto max-w-[1200px] page-gutter-x pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-6 sm:pb-16 sm:pt-12 md:py-16">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-[clamp(1.625rem,5vw,2.5rem)] font-semibold leading-tight tracking-tight text-foreground">
            Katalog
          </h1>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-muted sm:text-[15px]">
            {hasProducts
              ? `${categoryCount} Kategorien · technische Daten · auf Anfrage.`
              : "Artikel werden derzeit gepflegt — Anfragen sind weiterhin möglich."}
          </p>
          <div className="mt-5 max-w-3xl">
            <ResearchUseNotice variant="shop" idSuffix="shop-catalog" />
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
          <Link
            href="/anfrage"
            className="inline-flex min-h-[48px] w-full touch-manipulation items-center justify-center rounded-full bg-tint px-5 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(0,102,204,0.45)] transition hover:opacity-95 active:opacity-90 sm:w-auto sm:min-h-11 sm:text-[14px] sm:shadow-none"
          >
            Anfrage
          </Link>
          <Link
            href="/hilfe"
            className="inline-flex min-h-[48px] w-full touch-manipulation items-center justify-center rounded-full border border-black/[0.08] bg-fill-secondary px-5 text-[15px] font-medium text-foreground transition-colors hover:bg-fill-secondary-pressed active:bg-fill-secondary-pressed sm:w-auto sm:min-h-11 sm:border-0 sm:text-[14px]"
          >
            FAQ
          </Link>
        </div>
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
          <div className="rounded-[22px] border border-dashed border-black/[0.12] bg-canvas-parchment/40 px-6 py-14 text-center sm:px-10">
            <p className="text-[16px] font-medium text-foreground">Katalog in Vorbereitung</p>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">
              Es sind noch keine Artikel hinterlegt. Für institutionelle Anfragen oder Bedarf an konkreten SKUs
              erreichen Sie uns über das Formular.
            </p>
            <Link
              href="/anfrage"
              className="mt-6 inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full bg-tint px-6 text-[14px] font-semibold text-white transition hover:opacity-92"
            >
              Anfrage stellen
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
