import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { LegalDisclaimer } from "@/components/legal-disclaimer";
import { LegalProse } from "@/components/legal-prose";
import { LegalSectionCard } from "@/components/legal-section-card";
import { buildPublicPageMetadata } from "@/lib/seo-page-meta";

export const metadata: Metadata = buildPublicPageMetadata({
  path: "/agb",
  title: "AGB",
  description: `Allgemeine Geschäftsbedingungen (AGB) von ${brand.name}: Vertragsschluss, Preise, Zahlung, Lieferung Europa, Widerruf/Rückgabe mit Eingangsprüfung, Gewährleistung und Haftung.`,
  keywords: ["AGB", "Geschäftsbedingungen", "Rückgabe", "Widerruf", "Versand", "Zahlung"],
  category: "legal",
});

export default function AgbPage() {
  return (
    <LegalProse title="Allgemeine Geschäftsbedingungen (AGB)">
      <LegalDisclaimer />
      <h2>§ 1 Geltungsbereich und Vertragsgegenstand</h2>
      <p>
        (1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend „AGB“) gelten für alle Verträge und vertraglichen
        Anbahnungen zwischen der {brand.legalName} (nachfolgend „Verkäufer“) und dem Kunden über die im Onlineshop unter{" "}
        {brand.domainDisplay} dargestellten Waren und Leistungen, soweit nicht ausdrücklich etwas anderes vereinbart
        ist.
      </p>
      <p>
        (2) <strong>Verbraucher</strong> im Sinne dieser AGB ist jede natürliche Person, die ein Rechtsgeschäft zu
        Zwecken abschließt, die überwiegend weder ihrer gewerblichen noch ihrer selbständigen beruflichen Tätigkeit
        zugerechnet werden können. <strong>Unternehmer</strong> ist eine natürliche oder juristische Person oder eine
        rechtsfähige Personengesellschaft, die bei Abschluss eines Rechtsgeschäfts in Ausübung ihrer gewerblichen oder
        selbständigen beruflichen Tätigkeit handelt.
      </p>
      <p>
        (3) Die im Shop angebotenen Waren sind als Forschungs-/Referenzmaterialien (RUO) für den professionellen
        Labor-/in-vitro-Bereich bestimmt. Der Kunde erklärt mit Bestellung bzw. Anfrage, die Ware nur in geeigneten
        Einrichtungen und im Rahmen geltender Regeln zu verwenden. Missbräuchliche oder rechtswidrige Verwendungen sind
        ausgeschlossen; der Verkäufer ist berechtigt, solche Bestellungen abzulehnen oder nicht auszuführen.
      </p>
      <p>
        (4) Abweichende, entgegenstehende oder ergänzende Allgemeine Geschäftsbedingungen des Kunden werden nicht
        Vertragsbestandteil, es sei denn, ihrer Geltung wird ausdrücklich schriftlich oder in Textform zugestimmt.
      </p>
      <p>
        (5) Es gilt die gesonderte{" "}
        <Link href="/widerruf" className="font-medium text-tint underline">
          Widerrufsbelehrung
        </Link>{" "}
        für Verbraucher im Fernabsatz, soweit diese Anwendung findet. Im Übrigen gehen diese AGB vor, soweit die
        Widerrufsbelehrung nicht zwingend etwas anderes vorschreibt.
      </p>

      <h2>§ 2 Angebotsstellung und Vertragsschluss</h2>
      <p>
        (1) Die Darstellung der Waren im Onlineshop stellt kein rechtsbindendes Angebot im Sinne von § 145 BGB dar,
        sondern eine unverbindliche Aufforderung zur Abgabe einer Bestellung bzw. Angebotsanfrage (Katalog-/Referenz-
        Darstellung).
      </p>
      <p>
        (2) Mit Absenden der Bestellung im Checkout bzw. mit Abgabe einer vergleichbaren Anfrage gibt der Kunde ein
        verbindliches Angebot ab. Der Verkäufer kann dieses annehmen, insbesondere durch Auftragsbestätigung in Textform,
        Rechnungsstellung, Zahlungsaufforderung mit konkretem Leistungsinhalt oder durch Auslieferung der Ware.
      </p>
      <p>
        (3) Der Verkäufer ist berechtigt, Bestellungen aus sachlichen Gründen (z.&nbsp;B. Zweifel an der
        Berechtigung/Bestimmung, rechtliche oder logistische Hindernisse, fehlende Verfügbarkeit) abzulehnen oder nur
        teilweise anzunehmen. In diesem Fall wird der Kunde informiert; bereits geleistete Zahlungen werden auf
        Antrag zurückgewährt, soweit nichts anderes vereinbart ist.
      </p>

      <h2>§ 3 Preise, Steuern und Versandkosten (Überblick)</h2>
      <p>
        (1) Im Shop ausgewiesene Beträge sind Referenzpreise in EUR zur Orientierung; sie können je nach Ausführung,
        Menge, Rabatten und individueller Vereinbarung abweichen. <strong>Verbindliche Preise</strong> ergeben sich
        aus Auftragsbestätigung, Rechnung oder — bei sofortiger Erfüllung — aus der Leistungsmitteilung im Rahmen der
        Bestellabwicklung.
      </p>
      <p>
        (2) {brand.vatNotice} Einzelheiten siehe Impressum.
      </p>
      <p>
        (3) Versandkosten, Lieferwege und Gefahrübergang sind in <strong>§ 5</strong> geregelt. Etwaige Sonderkosten
        (Express, Nachnahme, Zollformalitäten im Bestimmungsland) werden vorab angezeigt oder gesondert mitgeteilt,
        soweit zumutbar.
      </p>

      <h2>§ 4 Zahlung</h2>
      <p>
        (1) Zahlung erfolgt vorbehaltlich gesonderter Vereinbarung insbesondere per <strong>Vorkasse /
        Banküberweisung</strong>. Bankdaten und Verwendungszweck werden im Checkout bzw. per E-Mail mitgeteilt.
      </p>
      <p>
        (2) Der Verkäufer ist berechtigt, die Ausführung von Leistungen von der Einhaltung angemessener
        Zahlungs-/Sicherungsbedingungen abhängig zu machen, insbesondere bei Erstgeschäften oder höheren Warenwerten.
      </p>
      <p>
        (3) Der Kunde trägt alle durch seine Zahlungsweise verursachten Gebühren (z.&nbsp;B. Bankspesen), soweit nicht
        ausdrücklich etwas anderes vereinbart ist.
      </p>

      <h2>§ 5 Lieferung, Versand, Gefahrübergang und Annahme</h2>
      <p>
        (1) Liefergebiet und verfügbare Versandarten ergeben sich aus der Darstellung im Checkout zum Zeitpunkt der
        Bestellung. Teillieferungen sind zulässig, soweit sie für den Kunden zumutbar sind; etwaige Mehrkosten trägt der
        Verkäufer nur, wenn nichts anderes vereinbart ist.
      </p>

      <div className="not-prose mt-4 space-y-4">
        <LegalSectionCard title="Liefergebiet und Adressdaten" id="agb-liefergebiet">
          <p>
            Der Kunde ist verpflichtet, eine vollständige und zustellfähige Lieferadresse anzugeben. Änderungen der
            Adresse teilt der Kunde unverzüglich mit. Mehrkosten durch fehlerhafte oder unvollständige Angaben trägt der
            Kunde, soweit gesetzlich zulässig.
          </p>
        </LegalSectionCard>
        <LegalSectionCard title="Lieferzeit und Verfügbarkeit" id="agb-lieferzeit">
          <p>
            Lieferzeiten sind, sofern angegeben, unverbindliche Richtwerte, sofern nicht ausdrücklich eine feste
            Lieferzeit zugesagt wurde. Verzögerungen durch höhere Gewalt, behördliche Maßnahmen, Streiks, Logistik- oder
            Zollvorgänge im Bestimmungsland berechtigen nicht ohne weiteres zur Schadensersatzpflicht des Verkäufers;
            der Kunde wird informiert, soweit zumutbar.
          </p>
        </LegalSectionCard>
        <LegalSectionCard title="Versandkosten, Verpackung und Gefahrübergang" id="agb-versand">
          <p>
            Versandkosten werden, soweit anfallend, mitgeteilt und sind vom Kunden zu tragen, es sei denn, eine
            kostenfreie Lieferung wurde ausdrücklich zugesagt.
          </p>
          <p>
            Die <strong>Gefahr des zufälligen Untergangs und der zufälligen Verschlechterung</strong> der Ware geht auf
            den Kunden über, sobald die Ware dem Transporteur übergeben wurde oder der Kunde in Annahmeverzug geraten
            ist. Dies entspricht der gesetzlichen Regelung, soweit nicht zwingendes Verbraucherschutzrecht entgegensteht.
          </p>
        </LegalSectionCard>
      </div>

      <h2>§ 6 Widerrufsrecht (Verbraucher), freiwillige Rücknahme und Erstattung</h2>
      <p>
        (1) Verbrauchern steht ein gesetzliches Widerrufsrecht zu, soweit die gesetzlichen Voraussetzungen erfüllt sind
        und keine gesetzlichen Ausnahmen greifen. Einzelheiten — Frist, Musterformular — finden sich in der{" "}
        <Link href="/widerruf" className="font-medium text-tint underline">
          Widerrufsbelehrung
        </Link>
        .
      </p>
      <p>
        (2) <strong>Unternehmern</strong> steht grundsätzlich <strong>kein Widerrufsrecht</strong> nach den für
        Verbraucher geltenden Fernabsatzregeln zu; etwaige Rücknahmen erfolgen ausschließlich nach gesonderter
        schriftlicher oder textlicher Vereinbarung und unter den dort vereinbarten Voraussetzungen.
      </p>

      <div className="not-prose mt-4 space-y-4">
        <LegalSectionCard title="Rücksendung nur nach vorheriger Anmeldung" id="agb-ruecksendung-anmeldung">
          <p>
            Eine Rücksendung von Ware ist dem Verkäufer <strong>vorab in Textform</strong> (E-Mail genügt) mit Angabe
            von Bestell-/Rechnungsbezug, Artikel und Grund anzuzeigen. Rücksendungen ohne vorherige Anmeldung können
            die Bearbeitung verzögern oder — soweit rechtlich zulässig — abgelehnt werden.
          </p>
          <p>
            Die Rücksendung hat an die im Impressum genannte Geschäftsadresse bzw. an eine vom Verkäufer mitgeteilte
            Retourenadresse zu erfolgen. Nicht freigegebene „Sammel-“ oder Drittadressen gelten nicht als Annahmeort.
          </p>
        </LegalSectionCard>
        <LegalSectionCard title="Eingangsprüfung vor Verifizierung und Erstattung" id="agb-eingangspruefung">
          <p>
            Nach Eingang zurückgesandter Ware führt der Verkäufer eine <strong>sachgerechte Eingangsprüfung</strong>
            durch. Diese umfasst insbesondere die Prüfung auf Vollständigkeit, Übereinstimmung mit der Bestellung,
            unversehrte Originalverpackung und Versiegelungen, Chargen-/Identifikationsmerkmale sowie — soweit
            erforderlich — dokumentierte Lagerung/Transportrisiken.
          </p>
          <p>
            Eine <strong>Rückerstattung oder Gutschrift</strong> erfolgt, sobald die Prüfung abgeschlossen ist und die
            Ware den vereinbarten bzw. gesetzlichen Anforderungen entspricht.{" "}
            <strong>Soweit ein Verbraucherwiderruf besteht</strong>, werden die gesetzlichen Fristen für die Rückzahlung
            eingehalten; die Prüfung dient der sachgerechten Feststellung, ob die Voraussetzungen für die Erstattung
            vorliegen und ob gesetzliche Ausschlüsse oder Minderungen greifen.
          </p>
          <p>
            Stellt die Prüfung fest, dass die Ware nicht vertragsgemäß zurückgesandt wurde (z.&nbsp;B. geöffnete oder
            beschädigte Versiegelung, fehlende Teile, Verwechslung, Verfall, unsachgemäße Kennzeichnung), ist der
            Verkäufer berechtigt, die Rücknahme abzulehnen, Teilerstattungen vorzusehen oder angemessene
            Bearbeitungs-/Prüfgebühren in Anspruch zu nehmen, <strong>soweit gesetzlich zulässig</strong>. Der Kunde wird
            hierüber in Textform informiert.
          </p>
        </LegalSectionCard>
        <LegalSectionCard title="Wertminderung und Rücksendekosten" id="agb-wertminderung">
          <p>
            Für eine durch die bestimmungsgemäße Prüfung der Ware nicht verursachte Wertminderung haftet der Kunde
            nach Maßgabe der gesetzlichen Vorgaben. Bei Widerruf durch Verbraucher trägt der Kunde die unmittelbaren
            Kosten der Rücksendung, es sei denn, die gelieferte Ware ist mangelhaft oder der Verkäufer hat die Kosten
            der Rücksendung übernommen; im Übrigen gelten die gesetzlichen Regelungen.
          </p>
        </LegalSectionCard>
      </div>

      <h2>§ 7 Eigentumsvorbehalt</h2>
      <p>
        Bis zur vollständigen Bezahlung behält sich der Verkäufer das Eigentum an der gelieferten Ware vor (gesetzlicher
        und vertraglicher Eigentumsvorbehalt), soweit rechtlich zulässig.
      </p>

      <h2>§ 8 Gewährleistung und Mängelrüge</h2>
      <p>
        (1) Es gelten die gesetzlichen Gewährleistungsrechte. Gegenüber Unternehmern gelten die gesetzlichen
        Besonderheiten, insbesondere hinsichtlich der Untersuchungs- und Rügeobliegenheit nach § 377 HGB, soweit
        anwendbar.
      </p>
      <p>
        (2) Offensichtliche Mängel sind unverzüglich, spätestens binnen 7 Kalendertagen nach Lieferung, in Textform zu
        rügen; bei verdeckten Mängeln beginnt die Frist mit der Entdeckung.
      </p>
      <p>
        (3) Hilft eine angemessene Nacherfüllung (Nachbesserung oder Ersatzlieferung) nicht, stehen dem Kunden die
        gesetzlichen Rechte zu, soweit nicht ausgeschlossen.
      </p>

      <h2>§ 9 Haftung</h2>
      <p>
        (1) Der Verkäufer haftet unbeschränkt nach Maßgabe gesetzlicher Vorschriften, soweit diese zwingend angeordnet
        sind (insbesondere bei Verletzung von Leben, Körper oder Gesundheit sowie bei Vorsatz und grober Fahrlässigkeit).
      </p>
      <p>
        (2) Im Übrigen haftet der Verkäufer bei einfacher Fahrlässigkeit nur bei Verletzung einer wesentlichen
        Vertragspflicht (Kardinalpflicht) und begrenzt auf den typischerweise vorhersehbaren Schaden, soweit gesetzlich
        zulässig. Eine weitergehende Haftung für mittelbare Schäden oder entgangenen Gewinn ist ausgeschlossen, soweit
        gesetzlich zulässig.
      </p>

      <h2>§ 10 Streitbeilegung / Online-Streitbeilegung</h2>
      <p>
        Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit:{" "}
        <a href="https://ec.europa.eu/consumers/odr/" rel="noopener noreferrer">
          https://ec.europa.eu/consumers/odr/
        </a>
        . Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
        teilzunehmen.
      </p>

      <h2>§ 11 Schlussbestimmungen</h2>
      <p>
        (1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts (CISG), soweit nicht
        zwingendes Verbraucherschutzrecht eines anderen Staates entgegensteht.
      </p>
      <p>
        (2) Gerichtsstand für Kaufleute, juristische Personen des öffentlichen Rechts oder öffentlich-rechtliche
        Sondervermögen ist — soweit zulässig — der Sitz des Verkäufers.
      </p>
      <p>
        (3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen
        Regelungen unberührt (Salvatorische Klausel). An die Stelle unwirksamer Regelungen tritt — soweit erforderlich —
        die gesetzlich zulässige wirtschaftlich nächstkommende Regelung.
      </p>
    </LegalProse>
  );
}
