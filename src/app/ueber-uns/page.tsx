import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { LegalDisclaimer } from "@/components/legal-disclaimer";
import {
  InstitutionalCtaBar,
  InstitutionalHubLayout,
  InstitutionalSectionCard,
} from "@/components/institutional-hub";
import { ResearchUseNotice } from "@/components/research-use-notice";
import { buildPublicPageMetadata } from "@/lib/seo-page-meta";

export const metadata: Metadata = buildPublicPageMetadata({
  path: "/ueber-uns",
  title: "Über uns",
  description: `${brand.name} in ${brand.city}: Profil, Operating Model für B2B-Forschung, Governance, Qualität, Logistik und verantwortungsvoller Umgang mit RUO-Materialien.`,
  keywords: ["Über uns", "Unternehmen", "B2B Peptide", "Forschungsbeschaffung"],
  category: "business",
});

const NAV = [
  { href: "#profil", label: "Profil & Auftrag" },
  { href: "#zielgruppen", label: "Zielgruppen" },
  { href: "#operating", label: "Operating Model" },
  { href: "#werte", label: "Werte & Prinzipien" },
  { href: "#governance", label: "Governance" },
  { href: "#qualitaet", label: "Qualität" },
  { href: "#region", label: "Region & Netzwerk" },
  { href: "#transparenz", label: "Transparenz" },
  { href: "#verantwortung", label: "Verantwortung" },
  { href: "#zusammenarbeit", label: "Zusammenarbeit" },
] as const;

export default function AboutPage() {
  return (
    <InstitutionalHubLayout
      eyebrow="Unternehmen · Forschungsbeschaffung"
      title={`Über ${brand.name}`}
      lede={
        <p>
          {brand.name} richtet sich an{" "}
          <strong className="font-medium text-foreground">Einkauf, QA, Laborleitung und Projektverantwortliche</strong>,
          die reproduzierbare Ergebnisse brauchen und dafür klare Produktinformationen, nachvollziehbare Dokumentation
          und einen sachlichen Umgang mit sensiblen Materialien erwarten. Die folgenden Abschnitte ordnen{" "}
          <strong className="font-medium text-foreground">Rolle, Prozesse und Grenzen</strong> ein — ohne Marketing zu
          ersetzen, was vertraglich oder regulatorisch bei Ihnen vor Ort liegt.
        </p>
      }
      chips={[
        "B2B / RUO",
        "Operating Model",
        "Dokumentation",
        "Datenschutz",
        "QA-Orientierung",
        "EU-Kontext",
      ]}
      navItems={NAV}
      navAriaLabel="Schnellnavigation Über uns"
      asideNavAriaLabel="Abschnitte Über uns"
      asideFooter={
        <>
          <div className="rounded-2xl border border-tint/20 bg-tint/[0.06] p-4">
            <p className="text-[13px] font-semibold text-foreground">Direkter Draht</p>
            <p className="mt-1 text-[12px] leading-relaxed text-muted">
              Technische Rückfragen, institutionelle Anfragen oder Dokumentationsbedarf — zentral über {brand.name}.
            </p>
            <Link
              href="/kontakt"
              className="mt-3 inline-flex min-h-10 w-full touch-manipulation items-center justify-center rounded-full bg-tint px-4 text-[13px] font-semibold text-white transition hover:opacity-92"
            >
              Kontakt
            </Link>
            <Link
              href="/anfrage"
              className="mt-2 inline-flex min-h-10 w-full touch-manipulation items-center justify-center rounded-full border border-black/[0.12] bg-white px-4 text-[13px] font-medium text-foreground transition hover:bg-black/[0.03]"
            >
              Institutionelle Anfrage
            </Link>
          </div>
          <Link href="/hilfe" className="block text-center text-[13px] font-medium text-tint hover:underline">
            Hilfe &amp; FAQ
          </Link>
        </>
      }
    >
      <LegalDisclaimer />

      <div className="rounded-2xl border border-tint/15 bg-gradient-to-br from-tint/[0.06] via-white to-surface-pearl/50 px-5 py-5 sm:px-6 sm:py-6">
        <p className="text-[14px] font-semibold text-foreground">Komplexität mit Absicht</p>
        <p className="mt-2 text-[14px] leading-relaxed text-muted sm:text-[15px]">
          Forschungsbeschaffung ist selten „ein Klick“. Sie verbindet{" "}
          <strong className="font-medium text-foreground">Spezifikation, Ethik, Logistik, Zoll, Datenschutz und
            interne Freigaben</strong>. Diese Seite macht diese Dimensionen sichtbar — damit Ihre Gremien schneller
          entscheiden können, ohne dass wir Ansprüche ersetzen, die nur in Vertrag, CoA und Ihrem Compliance-Handbuch
          stehen dürfen.
        </p>
      </div>

      <div className="max-w-3xl">
        <ResearchUseNotice variant="shop" idSuffix="about-hub" />
      </div>

      <InstitutionalSectionCard id="profil" eyebrow="01 · Identität" title="Profil & Auftrag">
        <p>
          Wir positionieren {brand.name} als{" "}
          <strong className="font-medium text-foreground">Spezialist für charakterisierte Forschungsmaterialien</strong>{" "}
          und begleitendes Laborzubehör im institutionellen Kontext — mit Fokus auf{" "}
          <strong className="font-medium text-foreground">Klarheit der Kennzeichnung</strong>, konsistente
          Produktkommunikation im Katalog und einem Bestellweg, der typischerweise über{" "}
          <strong className="font-medium text-foreground">interne Freigaben</strong> und dokumentierte Übergaben im
          Labor läuft.
        </p>
        <p>
          Unser Auftrag endet dort, wo{" "}
          <strong className="font-medium text-foreground">medizinische Indikation, klinische Anwendung oder
            Patientenkommunikation</strong> beginnt: {brand.name} adressiert{" "}
          <strong className="font-medium text-foreground">Research Use Only (RUO)</strong> und vergleichbare
          Rahmen — nicht Therapie, nicht Diagnostik am Patienten, keine Heilversprechen.
        </p>
      </InstitutionalSectionCard>

      <InstitutionalSectionCard id="zielgruppen" eyebrow="02 · Markt" title="Zielgruppen & Anwendungskontext">
        <p>
          Typische Bezugsorganisationen sind{" "}
          <strong className="font-medium text-foreground">Universitätsinstitute, öffentliche Forschungseinrichtungen,
            Biotech- und Pharma-F&amp;E</strong> sowie spezialisierte CROs. Entscheidend ist weniger die Branche als
          die <strong className="font-medium text-foreground">interne Governance</strong>: definierte
          Substanzverwalter, freigegebene Lagerorte, nachvollziehbare Chargenführung und klare Verantwortliche für
          Import und Gefahrstoffmanagement.
        </p>
        <ul className="list-disc space-y-2 pl-5 marker:text-tint/80">
          <li>
            <strong className="text-foreground">Einkauf / Beschaffung:</strong> technische Spezifikation, Lieferantenfragebogen,
            Währung und Incoterms — abgestimmt auf Ihre Rahmenverträge.
          </li>
          <li>
            <strong className="text-foreground">QA / Regulatory Affairs:</strong> Erwartung an CoA, Methodenreferenzen,
            Stabilitätsargumentation und RUO-Kennzeichnung entlang Ihrer SOPs.
          </li>
          <li>
            <strong className="text-foreground">Labor / Operations:</strong> reproduzierbare Arbeitspakete, klare
            Dosierungseinheiten, sichere Handhabung und dokumentierte Übergabe vom Wareneingang in die interne
            Substanzdatenbank.
          </li>
        </ul>
      </InstitutionalSectionCard>

      <InstitutionalSectionCard id="operating" eyebrow="03 · Prozesse" title="Operating Model: vom Katalog zur Übergabe">
        <p>
          Das öffentliche Sortiment dient der{" "}
          <strong className="font-medium text-foreground">technischen Orientierung</strong> — Mengen, Packstufen und
          Referenzpreise sind so dargestellt, dass Projekte kalkulierbar werden. Verbindliche Konditionen, Zahlungswege
          und ggf. <strong className="font-medium text-foreground">Exportkontrollprüfungen</strong> folgen dem üblichen
          B2B-Standard: Abstimmung, Dokumentation, Freigabe — keine anonymen Sofortkäufe ohne institutionellen Kontext.
        </p>
        <ol className="list-decimal space-y-2 pl-5 marker:font-semibold marker:text-tint">
          <li>
            <strong className="text-foreground">Exploration:</strong> Katalog, Spezifikationsfelder, Querverweise zu
            Qualität &amp; Versand.
          </li>
          <li>
            <strong className="text-foreground">Intent:</strong> Warenkorb als internes Arbeitspaket; institutionelle
            Anfrage oder Kontakt für abweichende Mengen, Dokumentpakete oder Sonderfragen.
          </li>
          <li>
            <strong className="text-foreground">Alignment:</strong> Klärung von Lieferfenster, Dokumentationsumfang
            (z. B. CoA je Charge) und Empfangslogistik — eng mit Ihrem QA-Prozess verzahnt.
          </li>
          <li>
            <strong className="text-foreground">Fulfillment &amp; Übergabe:</strong> Transport nach Vereinbarung,
            dokumentierte Übergabe an Ihre interne Peptide- bzw. Substanzverwaltung.
          </li>
        </ol>
        <p>
          Details zu Logistik, Kältekette und Störfall-Eskalation finden Sie unter{" "}
          <Link href="/versand" className="font-medium text-tint hover:underline">
            Versand &amp; Lieferung
          </Link>
          ; Zahlungs- und Vertragsrahmen unter{" "}
          <Link href="/zahlung-versand" className="font-medium text-tint hover:underline">
            Zahlung &amp; Versand
          </Link>.
        </p>
      </InstitutionalSectionCard>

      <InstitutionalSectionCard id="werte" eyebrow="04 · Kultur" title="Werte & Entscheidungsprinzipien">
        <p>
          Unsere internen Leitplanken sind bewusst{" "}
          <strong className="font-medium text-foreground">operational formuliert</strong> — damit sie in Konfliktfällen
          (Lieferverzug, Spezifikationsabweichung, Datenschutzvorgang) nicht kollidieren mit Marketing-Sprache.
        </p>
        <ul className="list-disc space-y-2 pl-5 marker:text-tint/80">
          <li>
            <strong className="text-foreground">Klarheit:</strong> eindeutige Produkt- und Packungsinformationen,
            konsistente Begriffe im Katalog, sichtbare rechtliche Rahmenbedingungen.
          </li>
          <li>
            <strong className="text-foreground">Vertraulichkeit:</strong> wirtschaftlicher und personenbezogener
            Datenschutz entlang DSGVO und betrieblicher TOMs — siehe{" "}
            <Link href="/datenschutz" className="font-medium text-tint hover:underline">
              Datenschutz
            </Link>.
          </li>
          <li>
            <strong className="text-foreground">Sachlichkeit:</strong> keine Übertreibung analytischer oder
            klinischer Relevanz; Trennung von „typischer Erwartung“ und zugesicherter Leistung.
          </li>
          <li>
            <strong className="text-foreground">Resilienz:</strong> dokumentierte Kommunikationswege bei Abweichungen;
            Priorität auf Revisionssicherheit statt schneller, undokumentierter Workarounds.
          </li>
        </ul>
      </InstitutionalSectionCard>

      <InstitutionalSectionCard id="governance" eyebrow="05 · Compliance" title="Governance, Ethik & regulatorische Grenzen">
        <p>
          Jede Organisation trägt die{" "}
          <strong className="font-medium text-foreground">Endverantwortung für Import, Lagerung, interne
            Weiterverwendung und Entsorgung</strong>. {brand.name} unterstützt durch transparente Produktkommunikation
          und dokumentationsfähige Prozesse — ersetzt aber keine behördliche Einordnung Ihrer konkreten Versuchsansätze.
        </p>
        <ul className="list-disc space-y-2 pl-5 marker:text-tint/80">
          <li>RUO-Kennzeichnung und Forschungsbedingungen als verbindlicher Orientierungsrahmen im Shop.</li>
          <li>Keine Beratung zu Indikation, Dosierung am Menschen oder Off-Label-Kontexten.</li>
          <li>
            Abgleich mit <strong className="text-foreground">internen SOPs</strong> zu Gefahrstoffen, Biosecurity und
            dual-use-relevanten Listen liegt beim bestellenden Institut.
          </li>
        </ul>
        <p>
          Rechtliche Hub-Seite:{" "}
          <Link href="/rechtliches" className="font-medium text-tint hover:underline">
            Rechtliches
          </Link>
          {" · "}
          <Link href="/forschungsbedingungen-b2b" className="font-medium text-tint hover:underline">
            Forschungsbedingungen B2B
          </Link>
          .
        </p>
      </InstitutionalSectionCard>

      <InstitutionalSectionCard id="qualitaet" eyebrow="06 · Qualitätssystem" title="Qualität, Spezifikation & Dokumentation">
        <p>
          Qualität in der Forschungsbeschaffung ist{" "}
          <strong className="font-medium text-foreground">ein System aus Spezifikation, analytischer Belastbarkeit,
            Stabilitätsargumentation und Lieferkettenkontrolle</strong>. Wir sprechen diese Dimensionen explizit an —
          damit Ihr QA-Review nicht im Leeren läuft, wenn eine neue Charge im Wareneingang landet.
        </p>
        <p>
          Vertiefung mit Prüfpunkten für Einkauf und Labor:{" "}
          <Link href="/qualitaet-labor" className="font-medium text-tint hover:underline">
            Qualität &amp; Labor
          </Link>
          .
        </p>
      </InstitutionalSectionCard>

      <InstitutionalSectionCard id="region" eyebrow="07 · Standortlogik" title="Region, EU-Kontext & Liefernetzwerk">
        <p>
          Der Name {brand.name} spiegelt{" "}
          <strong className="font-medium text-foreground">europäische Herkunft und Nähe zu etablierten
            Forschungsclustern</strong> wider — nicht zuletzt im deutschsprachigen Raum mit dichter
          Universitätslandschaft und starker Life-Science-Infrastruktur. Operativ bedeutet das: Ausrichtung auf{" "}
          <strong className="font-medium text-foreground">B2B-Prozesse, dokumentierte Übergaben und
            EU-typische Erwartungen</strong> an Datenschutz und Produktsicherheit — konkrete Routing- und
          Zolldetails bleiben produkt- und vertragsspezifisch.
        </p>
        <p>
          Für grenzüberschreitende Sendungen gelten zusätzlich{" "}
          <strong className="font-medium text-foreground">Importeur-Rollen, Zollwerte und SDS-Pflichten</strong> auf
          Institutsseite; wir empfehlen, diese früh mit Ihrer Logistik und dem Gefahrstoffmanagement zu verzahnen.
        </p>
      </InstitutionalSectionCard>

      <InstitutionalSectionCard id="transparenz" eyebrow="08 · Informationsarchitektur" title="Transparenz & Kommunikation">
        <p>
          Transparenz heißt für uns:{" "}
          <strong className="font-medium text-foreground">nachvollziehbare Hierarchie von Informationen</strong> — was
          im Katalog steht, was in Anhängen (CoA, SDS) steht und was erst in der bilateralen Abstimmung festgelegt wird.
          Redundanzen zwischen Shop, Hilfe-Center und institutionellen Seiten sind bewusst minimiert; stattdessen
          verweisen wir dort, wo Tiefe sonst Lesbarkeit kostet.
        </p>
        <ul className="list-disc space-y-2 pl-5 marker:text-tint/80">
          <li>Klare Trennung: Marketing-Oberfläche vs. prüfbare technische Aussagen.</li>
          <li>FAQ und Kontakt als Eskalationspfad, nicht als Ersatz für vertragliche Regelungen.</li>
          <li>Cookie- und Einwilligungslogik dokumentiert unter Cookies &amp; Tracking.</li>
        </ul>
        <p>
          <Link href="/cookies" className="font-medium text-tint hover:underline">
            Cookies
          </Link>
          {" · "}
          <Link href="/impressum" className="font-medium text-tint hover:underline">
            Impressum
          </Link>
          .
        </p>
      </InstitutionalSectionCard>

      <InstitutionalSectionCard id="verantwortung" eyebrow="09 · Gesellschaft" title="Verantwortung jenseits des Produkts">
        <p>
          Peptide und verwandte Forschungsbausteine können missbräuchlich diskutiert oder fehlinterpretiert werden. Wir
          vermeiden{" "}
          <strong className="font-medium text-foreground">sensationelle Darstellung</strong> zugunsten sachlicher,
          kontextgebundener Fachkommunikation. Gleichzeitig investieren wir in{" "}
          <strong className="font-medium text-foreground">verständliche Rechtstexte und Barriere-Reduktion</strong>{" "}
          (Lesbarkeit, Struktur), wo das ohne inhaltliche Aufweichung möglich ist — siehe{" "}
          <Link href="/barrierefreiheit" className="font-medium text-tint hover:underline">
            Barrierefreiheit
          </Link>.
        </p>
      </InstitutionalSectionCard>

      <InstitutionalSectionCard id="zusammenarbeit" eyebrow="10 · Partnerschaft" title="Wie eine Zusammenarbeit wächst">
        <p>
          Langfristige Partnerschaften entstehen, wenn{" "}
          <strong className="font-medium text-foreground">wiederholte Bestellungen dieselbe Qualitätssprache</strong>{" "}
          tragen: konsistente SKU-Logik, vorhersehbare Dokumentationspakete und verlässliche Reaktion auf
          Abweichungen. Wenn Ihr Institut Sonderanforderungen hat (z. B. wiederkehrende QA-Fragebögen), lohnt sich ein
          früher <strong className="font-medium text-foreground">Alignment-Call</strong> — nicht erst im
          Eskalationsfall.
        </p>
        <p>
          Startpunkt:{" "}
          <Link href="/shop" className="font-medium text-tint hover:underline">
            Katalog
          </Link>
          ,{" "}
          <Link href="/anfrage" className="font-medium text-tint hover:underline">
            Institutionelle Anfrage
          </Link>{" "}
          oder{" "}
          <Link href="/kontakt" className="font-medium text-tint hover:underline">
            Kontakt
          </Link>.
        </p>
      </InstitutionalSectionCard>

      <InstitutionalCtaBar
        text={
          <>
            Tiefe im Katalog, Klarheit in Qualität &amp; Logistik — nächster Schritt über{" "}
            <Link href="/anfrage" className="font-medium text-tint hover:underline">
              institutionelle Anfrage
            </Link>{" "}
            oder direkten{" "}
            <Link href="/kontakt" className="font-medium text-tint hover:underline">
              Kontakt
            </Link>.
          </>
        }
        primary={{ href: "/shop", label: "Zum Katalog" }}
        secondary={{ href: "/qualitaet-labor", label: "Qualität & Labor" }}
      />
    </InstitutionalHubLayout>
  );
}
