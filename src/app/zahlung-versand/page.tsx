import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { LegalProse } from "@/components/legal-prose";
import { LegalDisclaimer } from "@/components/legal-disclaimer";
import { buildPublicPageMetadata } from "@/lib/seo-page-meta";

export const metadata: Metadata = buildPublicPageMetadata({
  path: "/zahlung-versand",
  title: "Lieferung & Konditionen",
  description: `${brand.name}: Lieferung, Zahlungs- und Konditionsrahmen — institutionelle Anfragen, Prüfung vor Angebot, AGB-Verweis und Export/Compliance-Hinweise.`,
  keywords: ["Lieferung", "Zahlung", "Konditionen", "B2B Angebot", "Compliance"],
  category: "business",
});

export default function LieferungKonditionenPage() {
  return (
    <LegalProse title="Lieferung & Konditionen">
      <LegalDisclaimer />
      <p>
        Rahmen für {brand.name} unter {brand.domainDisplay}. Öffentlich sichtbar ist ein
        Forschungskatalog ohne direkten Kaufabschluss — kaufmännische Konditionen ergeben sich aus
        Angebot und Vertrag nach Prüfung.
      </p>
      <h2>Anfrage & Angebot</h2>
      <ul>
        <li>Institutionelle Anfragen über das vorgesehene Formular</li>
        <li>Interne Prüfung vor Angebotslegung (kein automatischer Verkauf)</li>
        <li>Zahlungsmodalitäten (z. B. Rechnung, Überweisung) nur nach vertraglicher Vereinbarung</li>
      </ul>
      <h2>Versand</h2>
      <p>
        Liefergebiet, Incoterms, Temperaturführung und Gefahrgut ergeben sich aus Angebot und
        Produktklasse. Öffentlich werden keine Versandpreise ausgewiesen. Verbindliche Regelungen zu Lieferung,
        Gefahrübergang, Rücksendung und Erstattung finden sich in den{" "}
        <Link href="/agb#agb-versand" className="font-medium text-tint underline">
          AGB (§ 5 und § 6)
        </Link>
        .
      </p>
      <h2>Export & Compliance</h2>
      <p>
        Import-, Export- und Dual-Use-Vorgaben sind von der bestellenden Organisation eigenverantwortlich zu
        prüfen und ggf. gemeinsam mit uns abzustimmen; maßgeblich sind anwendbare Verbote, Genehmigungen und
        Sanctions-Listen.
      </p>
    </LegalProse>
  );
}
