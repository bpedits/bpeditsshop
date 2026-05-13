import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { FaqSection } from "@/components/faq-section";
import { buildPublicPageMetadata } from "@/lib/seo-page-meta";

export const metadata: Metadata = buildPublicPageMetadata({
  path: "/hilfe",
  title: "Hilfe & FAQ",
  description: `Hilfe und FAQ zu ${brand.name}: Bestellung, Banküberweisung, Lieferung Europa, RUO-Hinweise, Datenschutz und institutionelle Anfragen.`,
  keywords: ["FAQ", "Hilfe", "Bestellung", "Banküberweisung", "RUO Fragen"],
  category: "reference",
});

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl page-gutter-x py-10 sm:py-14 md:py-16">
      <h1 className="text-[32px] font-semibold leading-tight tracking-tight text-foreground sm:text-[40px]">
        Hilfe &amp; FAQ
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-muted">
        Antworten auf typische Fragen rund um {brand.name}. Für individuelle Fälle nutzen Sie bitte
        die{" "}
        <Link href="/kontakt" className="font-medium text-tint hover:underline">
          Kontaktseite
        </Link>
        .
      </p>
      <div className="mt-10">
        <FaqSection />
      </div>
    </div>
  );
}
