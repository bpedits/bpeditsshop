import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { FaqSection } from "@/components/faq-section";

export const metadata: Metadata = {
  title: "Hilfe & FAQ",
  description: `Häufige Fragen zu Bestellung, Lieferung, Zahlung und Datenschutz bei ${brand.name}.`,
};

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
