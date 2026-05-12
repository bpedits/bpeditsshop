import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { JsonLd } from "@/components/json-ld";
import { ProductImageDoseStrip } from "@/components/product-image-dose-strip";
import { ProductPlaceholder } from "@/components/product-placeholder";
import { ResearchUseNotice } from "@/components/research-use-notice";
import { ProductCard } from "@/components/product-card";
import { ProductVariantPicker } from "@/components/product-variant-picker";
import { brand } from "@/lib/brand";
import { allProducts } from "@/lib/product-catalog";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/json-ld-schema";
import { getProductBySlug } from "@/lib/products";
import { suggestedProductsForPdp } from "@/lib/product-suggestions";
import { getProductTrustLine } from "@/lib/product-trust";
import { siteOrigin } from "@/lib/site-origin";

type Props = { params: Promise<{ slug: string }> };

/** Nur bei leerem Katalog: technische Route für `output: "export"` (ohne verkäuflichen Artikel). */
const RESERVED_EMPTY_SLUG = "__katalog-leer";

export function generateStaticParams() {
  if (allProducts.length === 0) {
    return [{ slug: RESERVED_EMPTY_SLUG }];
  }
  return allProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const base = siteOrigin();
  if (allProducts.length === 0 && slug === RESERVED_EMPTY_SLUG) {
    return {
      title: "Katalog",
      description: "Katalog in Vorbereitung — Anfragen über das Formular.",
      robots: { index: false, follow: true },
    };
  }
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produkt" };

  const varHint =
    product.variants.length > 1 ? `${product.variants.length} Dosierungen · ` : "";
  const canonical = `${base}/shop/${slug}`;
  const description = `${varHint}${product.category} · RUO/Labor — SKU ${product.sku}.${product.casNumber ? ` CAS ${product.casNumber}.` : ""} Referenzpreis pro Vial — ${brand.name}, ${brand.city}.`;
  const keywords = [
    product.name,
    product.category,
    product.sku,
    ...(product.casNumber ? [`CAS ${product.casNumber}`] : []),
    "RUO",
    "Forschungsmaterial",
    brand.city,
  ];

  return {
    title: product.name,
    description,
    keywords,
    alternates: {
      canonical,
      languages: {
        "de-DE": canonical,
        "x-default": canonical,
      },
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: `${product.name} · ${brand.name}`,
      description,
      siteName: brand.name,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name}`,
      description,
    },
    robots: { index: true, follow: true },
  };
}

function SpecRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-black/[0.06] py-3.5 sm:grid-cols-[minmax(0,220px)_1fr] sm:items-baseline sm:gap-6 sm:py-4">
      <dt className="text-[13px] font-semibold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="text-[16px] leading-relaxed text-foreground sm:text-[17px]">{children}</dd>
    </div>
  );
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  if (allProducts.length === 0 && slug === RESERVED_EMPTY_SLUG) {
    return (
      <div className="mx-auto max-w-[1200px] page-gutter-x py-10 sm:py-14">
        <nav className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1 text-[13px] text-muted">
          <Link href="/shop" className="shrink-0 transition hover:text-foreground">
            Forschungskatalog
          </Link>
        </nav>
        <div className="mt-10 max-w-xl">
          <h1 className="text-[24px] font-semibold tracking-tight text-foreground sm:text-[28px]">Katalog in Vorbereitung</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            Es sind noch keine Artikel hinterlegt. Für Bedarf und Spezifikation erreichen Sie uns über das Anfrageformular.
          </p>
          <Link
            href="/anfrage"
            className="mt-8 inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full bg-tint px-6 text-[14px] font-semibold text-white transition hover:opacity-92"
          >
            Anfrage stellen
          </Link>
        </div>
      </div>
    );
  }

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const suggestions = suggestedProductsForPdp(product, allProducts, 8);

  const trust = getProductTrustLine(product);
  const docParts: string[] = [];
  if (product.documentation.coa) docParts.push("CoA");
  if (product.documentation.sds) docParts.push("SDS");
  const docLine = docParts.length ? docParts.join(" · ") : "Auf Anfrage / nicht zutreffend";

  return (
    <>
      <JsonLd data={productJsonLd(product, slug)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Startseite", path: "/" },
          { name: "Forschungskatalog", path: "/shop" },
          { name: product.name, path: `/shop/${slug}` },
        ])}
      />
      <div className="mx-auto max-w-[1200px] page-gutter-x py-6 pb-[max(2rem,env(safe-area-inset-bottom))] sm:py-14 sm:pb-14">
      <nav className="flex min-h-10 min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-[14px] text-muted sm:text-[15px]">
        <Link
          href="/shop"
          className="-m-1 shrink-0 rounded-lg p-1 transition hover:text-foreground active:bg-black/[0.04]"
        >
          Forschungskatalog
        </Link>
        <span className="shrink-0 text-black/25" aria-hidden>
          /
        </span>
        <span className="min-w-0 truncate text-[15px] font-semibold tracking-tight text-foreground sm:text-[16px]">
          {product.name}
        </span>
      </nav>

      <div className="mt-6 grid gap-8 sm:mt-10 sm:gap-10 lg:grid-cols-2 lg:gap-16 lg:items-start">
        <div className="relative overflow-hidden rounded-[20px] border border-black/[0.06] bg-surface shadow-[0_12px_48px_-28px_rgba(0,0,0,0.15)] lg:sticky lg:top-24">
        <ProductPlaceholder product={product} variant="hero" />
          <ProductImageDoseStrip product={product} />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted sm:text-[13px]">
              {product.category}
            </p>
            {product.variants.length > 1 ? (
              <span className="rounded-full bg-black/[0.06] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
                {product.variants.length} Dosierungen
              </span>
            ) : null}
            {trust ? (
              <span className="rounded-full bg-tint/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-tint">
                {trust}
              </span>
            ) : null}
          </div>
          <h1 className="mt-3 text-[clamp(1.75rem,5.8vw,2.65rem)] font-semibold leading-[1.12] tracking-[-0.02em] text-foreground">
            {product.name}
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-muted sm:mt-5 sm:text-[18px]">{product.shortDescription}</p>

          <div className="mt-8">
            <Suspense
              fallback={
                <div className="h-48 animate-pulse rounded-2xl bg-gradient-to-b from-black/[0.04] to-transparent" aria-hidden />
              }
            >
              <ProductVariantPicker product={product} />
            </Suspense>
            <p className="mt-5 text-[13px] leading-relaxed text-muted sm:mt-6 sm:text-[14px]">
              <span className="font-medium text-foreground">In den Warenkorb</span> legt die gewählte SKU fest — im{" "}
              <Link href="/checkout" className="font-medium text-tint hover:underline">
                Warenkorb
              </Link>{" "}
              optional Bestellung per Banküberweisung oder eine gebündelte{" "}
              <Link href="/anfrage" className="font-medium text-tint hover:underline">
                Anfrage
              </Link>
              . Verbindliche Konditionen nach institutioneller Prüfung (
              <span className="font-medium text-foreground">Pending Review</span>).
            </p>
            <div className="mt-6 min-w-0 sm:mt-7">
              <ResearchUseNotice variant="shop" idSuffix={`pdp-${product.slug}`} />
            </div>
          </div>

          <dl className="mt-8 rounded-2xl border border-black/[0.06] bg-surface px-4 py-1 shadow-[0_4px_24px_-16px_rgba(0,0,0,0.08)] sm:mt-10 sm:px-5">
            <SpecRow label="Ausführungen">
              {product.variants.length} SKU(s) — Referenzpreis <span className="font-medium text-foreground">pro Vial</span>;
              Dosierung oben wählbar.
            </SpecRow>
            <SpecRow label="CAS-Nummer">{product.casNumber ?? "— (nicht hinterlegt / nicht zutreffend)"}</SpecRow>
            <SpecRow label="Summenformel">{product.molecularFormula ?? "—"}</SpecRow>
            <SpecRow label="Molekulargewicht">{product.molecularWeight ?? "—"}</SpecRow>
            <SpecRow label="Reinheit">{product.purity}</SpecRow>
            <SpecRow label="Packung / Übersicht">{product.format}</SpecRow>
            <SpecRow label="Lagerung">{product.storageConditions}</SpecRow>
            <SpecRow label="Dokumentation verfügbar">{docLine}</SpecRow>
          </dl>

          <div className="mt-8 rounded-2xl border border-black/[0.06] bg-canvas-parchment/60 px-4 py-4 sm:px-5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-tint">Disclaimer</p>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              For professional laboratory research use only. Not for human or veterinary consumption. Not
              for diagnostic, therapeutic, cosmetic, nutritional, or personal use.
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-muted">
              Nur für professionelle Labor- und in-vitro-Forschung. Keine Anwendung am Menschen oder Tier.
              Keine diagnostische, therapeutische oder kosmetische Verwendung.
            </p>
          </div>

          <div className="mt-12 border-t border-black/[0.06] pt-10">
            <h2 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">Technische Beschreibung</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{product.description}</p>
            <p className="mt-4">
              <Link href="/qualitaet-labor" className="text-[13px] font-medium text-tint hover:underline">
                Qualität & Labor
              </Link>
            </p>
          </div>
        </div>
      </div>

      {suggestions.length > 0 ? (
        <section
          className="mt-14 border-t border-black/[0.06] pt-12 sm:mt-16 sm:pt-16"
          aria-labelledby="pdp-suggestions-heading"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <h2
              id="pdp-suggestions-heading"
              className="text-[22px] font-semibold tracking-tight text-foreground sm:text-[26px]"
            >
              Passende Artikel
            </h2>
            <p className="max-w-md text-[14px] text-muted sm:text-right">
              Aus derselben Kategorie und häufig angefragte Referenzprodukte — Dosierungen auf der jeweiligen Produktseite.
            </p>
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-4 sm:mt-8 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {suggestions.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
          <Link
            href="/shop"
            className="mt-8 inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full bg-fill-secondary px-6 text-[14px] font-medium text-foreground transition-colors hover:bg-fill-secondary-pressed"
          >
            Zum gesamten Katalog
          </Link>
        </section>
      ) : null}
      </div>
    </>
  );
}
