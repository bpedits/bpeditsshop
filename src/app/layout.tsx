import type { Metadata, Viewport } from "next";
import "./globals.css";
import { JsonLd } from "@/components/json-ld";
import { brand } from "@/lib/brand";
import { organizationAndWebsiteGraph } from "@/lib/json-ld-schema";
import { seoHomeDescription, seoSiteTagline } from "@/lib/seo-defaults";
import { siteOrigin } from "@/lib/site-origin";
import { ConsentRuntime } from "@/components/consent-runtime";
import { CookieBanner } from "@/components/cookie-banner";
import { PreFooterCta } from "@/components/pre-footer-cta";
import { RumoBanner } from "@/components/rumo-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export async function generateMetadata(): Promise<Metadata> {
  const base = siteOrigin();
  const google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
  const yandex = process.env.NEXT_PUBLIC_YANDEX_VERIFICATION?.trim();
  const bing = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim();

  return {
    metadataBase: new URL(base),
    title: { default: brand.name, template: `%s · ${brand.name}` },
    applicationName: brand.name,
    description: seoHomeDescription,
    creator: brand.name,
    publisher: brand.legalName,
    category: "science",
    referrer: "strict-origin-when-cross-origin",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "de_DE",
      url: base,
      siteName: brand.name,
      title: brand.name,
      description: seoSiteTagline,
    },
    twitter: {
      card: "summary_large_image",
      title: brand.name,
      description: seoSiteTagline,
    },
    icons: {
      icon: [{ url: "/favicon.png", type: "image/png" }],
      apple: [{ url: "/favicon.png" }],
    },
    verification: {
      ...(google ? { google } : {}),
      ...(yandex ? { yandex } : {}),
      ...(bing ? { other: { "msvalidate.01": bing } } : {}),
    },
    other: {
      "geo.region": "DE-BY",
      "geo.placename": brand.city,
      /* Ingolstadt (Stadtmitte, grob) — bei Bedarf verfeinern */
      "geo.position": "48.7631;11.4250",
      ICBM: "48.7631, 11.4250",
      distribution: "global",
      rating: "general",
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfa" },
    { media: "(prefers-color-scheme: dark)", color: "#1d1d1f" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="flex min-h-dvh flex-col font-sans text-foreground antialiased">
        <JsonLd data={organizationAndWebsiteGraph()} />
        <RumoBanner />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <PreFooterCta />
        <SiteFooter />
        <ConsentRuntime />
        <CookieBanner />
      </body>
    </html>
  );
}
