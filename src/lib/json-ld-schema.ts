import type { Product } from "@/lib/product-types";
import { brand } from "@/lib/brand";
import { siteOrigin } from "@/lib/site-origin";

type JsonLdThing = Record<string, unknown>;

/** Organization + WebSite (Publisher, GEO über PostalAddress). */
export function organizationAndWebsiteGraph(): JsonLdThing {
  const origin = siteOrigin();
  const orgId = `${origin}/#organization`;
  const webId = `${origin}/#website`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: brand.name,
        legalName: brand.legalName,
        url: origin,
        logo: `${origin}/logo.png`,
        email: brand.email,
        ...(brand.phoneDisplay.trim() ? { telephone: brand.phoneDisplay } : {}),
        address: {
          "@type": "PostalAddress",
          streetAddress: brand.addressLine1,
          postalCode: brand.zip,
          addressLocality: brand.city,
          addressCountry: "DE",
        },
        areaServed: ["DE", "EU"],
      },
      {
        "@type": "WebSite",
        "@id": webId,
        url: origin,
        name: brand.name,
        description: seoPlainSiteDescription(),
        inLanguage: "de-DE",
        publisher: { "@id": orgId },
      },
    ],
  };
}

function seoPlainSiteDescription(): string {
  return `${brand.name}: Forschungsmaterialien (RUO), Katalog und institutionelle Anfrage — ${brand.city}, Deutschland.`;
}

/** Produktseite: informativ ohne Preis-Snippets (kein Offer → keine irreführenden Rich Results). */
export function productJsonLd(product: Product, slug: string): JsonLdThing {
  const origin = siteOrigin();
  const url = `${origin}/shop/${slug}`;
  const props: object[] = [];
  if (product.casNumber) {
    props.push({
      "@type": "PropertyValue",
      name: "CAS-Registry-Nummer",
      value: product.casNumber,
    });
  }
  if (product.molecularFormula) {
    props.push({
      "@type": "PropertyValue",
      name: "Summenformel",
      value: product.molecularFormula,
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    sku: product.sku,
    category: product.category,
    url,
    brand: {
      "@type": "Brand",
      name: brand.name,
    },
    ...(props.length > 0 ? { additionalProperty: props } : {}),
  };
}

export function breadcrumbJsonLd(items: readonly { name: string; path: string }[]): JsonLdThing {
  const origin = siteOrigin();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${origin}${item.path}`,
    })),
  };
}
