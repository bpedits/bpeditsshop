import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { LegalDisclaimer } from "@/components/legal-disclaimer";
import { LegalProse } from "@/components/legal-prose";

export const metadata: Metadata = {
  title: "AGB",
};

export default function AgbPage() {
  return (
    <LegalProse title="Allgemeine Geschäftsbedingungen (AGB)">
      <LegalDisclaimer />
      <h2>§ 1 Geltungsbereich</h2>
      <p>
        (1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend „AGB“) gelten für alle Verträge zwischen der{" "}
        {brand.legalName} (nachfolgend „Verkäufer“) und dem Kunden über die im Onlineshop unter{" "}
        {brand.domainDisplay} dargestellten Waren.
      </p>
      <p>
        (2) Verbraucher im Sinne dieser AGB ist jede natürliche Person, die ein Rechtsgeschäft zu Zwecken abschließt,
        die überwiegend weder ihrer gewerblichen noch ihrer selbständigen beruflichen Tätigkeit zugerechnet werden
        können.
      </p>
      <h2>§ 2 Vertragsschluss</h2>
      <p>
        (1) Die Darstellung der Waren im Onlineshop stellt kein rechtsbindendes Angebot dar, sondern eine
        Aufforderung zur Abgabe einer Bestellung bzw. Angebotsanfrage im jeweiligen Bestell-/Checkout-Prozess.
      </p>
      <p>
        (2) Mit Abgabe der Bestellung gibt der Kunde ein verbindliches Angebot ab. Der Verkäufer kann das Angebot
        annehmen, indem er die Bestellung in Textform bestätigt, eine Rechnung stellt oder die Ware ausliefert.
      </p>
      <h2>§ 3 Preise und Versandkosten</h2>
      <p>
        (1) Im Shop ausgewiesene Beträge sind Referenzpreise in EUR zur Orientierung; sie können je nach Ausführung,
        Menge und Vereinbarung abweichen. Verbindliche Preise ergeben sich aus Auftragsbestätigung oder Rechnung.
        Als Kleinunternehmer im Sinne von § 19 UStG geben wir keine gesonderte Umsatzsteuer aus — siehe Impressum.
      </p>
      <p>(2) Versandkosten werden, soweit anfallend, gesondert ausgewiesen und sind vom Kunden zusätzlich zu tragen.</p>
      <h2>§ 4 Zahlung</h2>
      <p>
        Zahlung kann soweit freigeschaltet über Stripe Checkout (z.&nbsp;B. Kartenzahlung) erfolgen;
        Einzelheiten sind im Checkout angegeben. Abweichende Vereinbarungen sind schriftlich oder in Textform
        möglich (z.&nbsp;B. institutionelle Anfrage ohne sofortige Online-Zahlung).
      </p>
      <h2>§ 5 Lieferung</h2>
      <p>
        Liefergebiet, Lieferzeit und Teillieferungen sind im Onlineshop beschrieben oder werden nach Vertragsschluss in
        der Auftragsbestätigung oder auf sonstige Weise in Textform mitgeteilt.
      </p>
      <h2>§ 6 Eigentumsvorbehalt</h2>
      <p>
        Bis zur vollständigen Bezahlung behält sich der Verkäufer das Eigentum an der gelieferten Ware vor, soweit dies
        rechtlich zulässig ist.
      </p>
      <h2>§ 7 Gewährleistung</h2>
      <p>
        Es gelten die gesetzlichen Gewährleistungsrechte. Gegenüber Unternehmern gelten die dortigen gesetzlichen
        Besonderheiten.
      </p>
      <h2>§ 8 Haftung</h2>
      <p>
        (1) Der Verkäufer haftet unbeschränkt nach Maßgabe gesetzlicher Vorschriften, soweit diese zwingend angeordnet
        sind (insbesondere bei Verletzung von Leben, Körper oder Gesundheit sowie bei grober Fahrlässigkeit oder
        Vorsatz).
      </p>
      <p>
        (2) Im Übrigen haftet der Verkäufer bei einfacher Fahrlässigkeit nur bei Verletzung einer wesentlichen
        Vertragspflicht und begrenzt auf den typischerweise vorhersehbaren Schaden, soweit gesetzlich zulässig.
      </p>
      <h2>§ 9 Streitbeilegung / Online-Streitbeilegung</h2>
      <p>
        Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit:{" "}
        <a href="https://ec.europa.eu/consumers/odr/" rel="noopener noreferrer">
          https://ec.europa.eu/consumers/odr/
        </a>
        . Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
        teilzunehmen.
      </p>
      <h2>§ 10 Schlussbestimmungen</h2>
      <p>
        Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts, soweit zwingendes
        Verbraucherschutzrecht nicht entgegensteht.
      </p>
      <p>
        Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen
        Regelungen unberührt (Salvatorische Klausel).
      </p>
    </LegalProse>
  );
}
