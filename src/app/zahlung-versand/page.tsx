import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { LegalProse } from "@/components/legal-prose";
import { LegalDisclaimer } from "@/components/legal-disclaimer";

export const metadata: Metadata = {
  title: "Lieferung & Konditionen",
};

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
        Produktklasse. Öffentlich werden keine Versandpreise ausgewiesen.
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
