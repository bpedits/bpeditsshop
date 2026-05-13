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
  path: "/versand",
  title: "Versand & Lieferung",
  description: `${brand.name}: Versand und Lieferkette für Forschungsmaterialien — Übergabe ans Institut, Kältekette, Zoll, Dokumentation und B2B-Logistikrahmen (${brand.city}).`,
  keywords: ["Versand", "Lieferung", "Kältekette", "Forschungslogistik", "EU Versand"],
  category: "business",
});

const NAV = [
  { href: "#einordnung", label: "Einordnung" },
  { href: "#rollen", label: "Rollenmodell" },
  { href: "#bestellfluss", label: "Bestellfluss" },
  { href: "#kaeltekette", label: "Kältekette" },
  { href: "#verpackung", label: "Verpackung" },
  { href: "#zoll", label: "Zoll & Export" },
  { href: "#empfang", label: "Empfang" },
  { href: "#tracking", label: "Tracking" },
  { href: "#dokumente", label: "Dokumente" },
  { href: "#stoerungen", label: "Störungen" },
] as const;

export default function VersandPage() {
  return (
    <InstitutionalHubLayout
      eyebrow="Logistik & institutionelle Übergabe"
      title="Versand, Lieferung & Lieferkettenkontrolle"
      lede={
        <p>
          Diese Seite beschreibt, wie <strong className="font-medium text-foreground">professionelle Forschungslogistik</strong>{" "}
          typischerweise aufgebaut ist — von der Bestellfreigabe bis zur dokumentierten Übergabe im Labor. Konkrete
          SLAs, Kurierverträge und Zollentscheidungen sind <strong className="font-medium text-foreground">produkt- und routingabhängig</strong>{" "}
          und gehören in Ihre vertraglichen Unterlagen.
        </p>
      }
      chips={[
        "B2B / Institut",
        "Kältekette",
        "Zoll & Export",
        "RUO-Kontext",
        "QA-Übergabe",
        "Eskalation",
      ]}
      navItems={NAV}
      navAriaLabel="Schnellnavigation Versand & Lieferung"
      asideNavAriaLabel="Abschnitte Versand & Lieferung"
      asideFooter={
        <>
          <div className="rounded-2xl border border-tint/20 bg-tint/[0.06] p-4">
            <p className="text-[13px] font-semibold text-foreground">Konditionen &amp; Vertrag</p>
            <p className="mt-1 text-[12px] leading-relaxed text-muted">
              Verbindliche Liefer- und Zahlungsbedingungen finden sich unter Rechtlichem Rahmen — nicht auf dieser
              Orientierungsseite.
            </p>
            <Link
              href="/zahlung-versand"
              className="mt-3 inline-flex min-h-10 w-full touch-manipulation items-center justify-center rounded-full bg-tint px-4 text-[13px] font-semibold text-white transition hover:opacity-92"
            >
              Lieferung &amp; Konditionen
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
        <p className="text-[14px] font-semibold text-foreground">Systemgedanke</p>
        <p className="mt-2 text-[14px] leading-relaxed text-muted sm:text-[15px]">
          Gute Lieferketten sind <strong className="font-medium text-foreground">messbar und revisionssicher</strong>:{" "}
          definierte Verantwortliche, klare Schnittstellen zwischen Versanddienst und Empfang, dokumentierte Temperaturen
          (falls relevant) und nachvollziehbare Kommunikationswege bei Abweichungen. So reduzieren Sie
          Stabilitätsrisiken und wiederholte Rückfragen zwischen Einkauf und QA.
        </p>
      </div>

      <div className="max-w-3xl">
        <ResearchUseNotice variant="shop" idSuffix="versand-hub" />
      </div>

      <InstitutionalSectionCard id="einordnung" eyebrow="01 · Rahmen" title="Einordnung: was diese Seite leistet — und was nicht">
        <p>
          Die Seite ersetzt <strong className="font-medium text-foreground">keine Incoterms-Erklärung</strong>, kein
          Zollgutachten und keine produktspezifische Gefahrgutklassifikation. Sie dient als{" "}
          <strong className="font-medium text-foreground">Checkliste und Sprachregelung</strong>, damit Institute,
          Einkauf und Logistik dieselben Erwartungen teilen, bevor eine konkrete Sendung gebucht wird.
        </p>
        <ul className="list-disc space-y-2 pl-5 marker:text-tint/80">
          <li>Abgrenzung: Marketingversprechen vs. vertraglich zugesicherter Leistungsumfang</li>
          <li>Transparenz: welche Daten Sie dem Empfänger vorab mitgeben (Tracking, SDS, Temperaturprotokoll)</li>
          <li>RUO: Lieferung an qualifizierte Empfänger — nicht an Endverbraucheradressen ohne Prüfung</li>
        </ul>
      </InstitutionalSectionCard>

      <InstitutionalSectionCard id="rollen" eyebrow="02 · Organisation" title="Rollenmodell: wer trägt was?">
        <p>
          In B2B-Forschung verschwimmen Verantwortlichkeiten leicht. Ein klares Modell verhindert, dass Temperatur- oder
          Zollthemen „zwischen den Stühlen“ landen.
        </p>
        <ul className="list-disc space-y-2 pl-5 marker:text-tint/80">
          <li>
            <strong className="font-medium text-foreground">Auftraggeber / Versender:</strong> korrekte Daten auf
            Handelsrechnung und Packliste, Exportkontrolle soweit anwendbar, Auswahl geeigneter Transportart.
          </li>
          <li>
            <strong className="font-medium text-foreground">Carrier / Frachtführer:</strong> tatsächliche Durchführung,
            Scan-Ereignisse, ggf. aktive Kühlung oder passive Kühlmittel — gemäß gebuchter Produktklasse.
          </li>
          <li>
            <strong className="font-medium text-foreground">Zoll / Broker (falls involviert):</strong> Einreichung
            und Klassifikation — abhängig von Zielland und Produkt.
          </li>
          <li>
            <strong className="font-medium text-foreground">Empfang / QA am Institut:</strong> sachgemäße Annahme,
            Quarantäne nach internem SOP, Freigabe in das Lager oder Ablehnung mit dokumentierter Begründung.
          </li>
        </ul>
      </InstitutionalSectionCard>

      <InstitutionalSectionCard id="bestellfluss" eyebrow="03 · Prozess" title="Bestellfluss vom Commit bis zur Versandfreigabe">
        <p>
          Vor dem Label-Druck sollten fünf Punkte „grün“ sein: Adresse und Annahmebedingungen, regulatorische
          Einordnung (RUO), Zahlungs- oder Freigabestatus, Packvorgaben (z. B. Dry Ice ja/nein) und eindeutige
          Ansprechpartner bei Verzögerung.
        </p>
        <ol className="list-decimal space-y-2 pl-5 marker:font-semibold marker:text-tint">
          <li>Technische Freigabe der SKU (Spezifikation, Lagerort, Mindesthaltbarkeit falls relevant)</li>
          <li>Logistik-Fenster und Empfangszeiten am Zielort (inkl. Feiertage und Campus-Zugang)</li>
          <li>Versicherungs- und Haftungsgrenzen gegenüber dem Carrier abstimmen</li>
          <li>Dokumentenpaket: CoA/SDS wie vereinbart — nicht „unterwegs improvisieren“</li>
          <li>Eskalationsmatrix: wer wird bei &gt; X Stunden Verzögerung informiert?</li>
        </ol>
      </InstitutionalSectionCard>

      <InstitutionalSectionCard id="kaeltekette" eyebrow="04 · Temperatur" title="Kältekette: Planung, Monitoring, Ausnahmen">
        <p>
          Temperaturgeführte Sendungen leben von <strong className="font-medium text-foreground">Soll-Ist-Transparenz</strong>.
          Definieren Sie, ob Logger rückläufig ausgelesen werden müssen, ob Fotodokumentation bei äußerer Beschädigung
          Standard ist und wie QA bei einem Bruch der Kette entscheidet.
        </p>
        <ul className="list-disc space-y-2 pl-5 marker:text-tint/80">
          <li>Sollprofil (z. B. 2–8 °C) vs. tatsächlich gemessene Kurve — wer interpretiert Abweichungen?</li>
          <li>Passive Kühlung: Packstück-Dimensionierung und saisonale Extremtemperaturen am Hub</li>
          <li>„Soft“ Verzögerungen (Wochenendlager): dokumentierte Freigabe oder automatische Eskalation</li>
        </ul>
      </InstitutionalSectionCard>

      <InstitutionalSectionCard id="verpackung" eyebrow="05 · Physical" title="Verpackung, Kennzeichnung und Erstöffnung">
        <p>
          Institute erwarten lesbare Kennzeichnung: SKU, Charge (falls mitgeliefert), Gefahrenpiktogramme, stabile
          Primärverpackung und eine sekundäre Schicht, die Feuchtigkeit und Stoß abfängt.
        </p>
        <ul className="list-disc space-y-2 pl-5 marker:text-tint/80">
          <li>RUO-Hinweis sichtbar auf äußerer Verpackung, konsistent mit Produktbescheinigung</li>
          <li>Intakte Siegel: QA kann bei Bruch sofort sperren, ohne Diskussion über „ob noch ok“</li>
          <li>Entsorgung von Kühlmitteln / Dry Ice: Hinweise für Empfangspersonal (Arbeitssicherheit)</li>
        </ul>
      </InstitutionalSectionCard>

      <InstitutionalSectionCard id="zoll" eyebrow="06 · Grenze" title="Zoll, Exportkontrolle und Zielland-Logik">
        <p>
          Zölle, Verbote und Meldepflichten ändern sich. Ihre Website sollte deshalb{" "}
          <strong className="font-medium text-foreground">Prinzipien</strong> nennen, aber keine automatisierten
          Zollentscheidungen simulieren. Seriös wirkt ein Verweis auf fallweise Prüfung und schriftliche Freigabe.
        </p>
        <ul className="list-disc space-y-2 pl-5 marker:text-tint/80">
          <li>Dual-Use und branchenspezifische Listen — nur mit Fachrecht abstimmen</li>
          <li>HS-Code und Warenbeschreibung: konsistent über Angebot, Rechnung und Packliste</li>
          <li>Incoterms und Versicherung: wer trägt Verlust ab welchem Ereignis?</li>
        </ul>
      </InstitutionalSectionCard>

      <InstitutionalSectionCard id="empfang" eyebrow="07 · Institut" title="Empfang, Quarantäne und Freigabe ins Laborlager">
        <p>
          Der teuerste Fehler ist oft nicht der Transport — sondern eine Annahme ohne Kapazität oder ohne
          temperaturkontrolliertes Zwischenlager. Definieren Sie Pufferzeiten und klare „Stop“-Kriterien.
        </p>
        <ul className="list-disc space-y-2 pl-5 marker:text-tint/80">
          <li>Zeitfenster und Substitute-Empfänger bei Urlaub / Krankheit</li>
          <li>Quarantäne-Labeling bis CoA-Plausibilisierung abgeschlossen ist</li>
          <li>Übergabe an interne Peptide-/Substanzverwaltung mit eindeutiger Lager-ID</li>
        </ul>
      </InstitutionalSectionCard>

      <InstitutionalSectionCard id="tracking" eyebrow="08 · Transparenz" title="Tracking, Statusseiten und Eskalations-SLA">
        <p>
          Institute mögen proaktive Information mehr als reaktives Feuerlöschen. Ein einheitlicher Kanal (Ticket,
          E-Mail-Queue, Statusportal) reduziert Doppelarbeit zwischen Einkauf und Labor.
        </p>
        <ul className="list-disc space-y-2 pl-5 marker:text-tint/80">
          <li>Carrier-Events in menschenlesbare Statusmeldungen übersetzen (Pickup, Export, Zoll, Zustellung)</li>
          <li>Interne Eskalationsstufen: z. B. &gt; 6 h ohne Scan, &gt; 24 h Zollstopp, Temperaturverletzung</li>
          <li>Dokumentation für spätere CAPA oder Lieferantenbewertung</li>
        </ul>
      </InstitutionalSectionCard>

      <InstitutionalSectionCard id="dokumente" eyebrow="09 · Revision" title="Dokumente, die Logistik und QA verbinden">
        <p>
          Revisionssicherheit bedeutet: dieselbe Sendung kann Monate später noch erklärt werden — inklusive Wer hat
          welche Version des CoA akzeptiert und welche Temperaturkurve vorlag.
        </p>
        <ul className="list-disc space-y-2 pl-5 marker:text-tint/80">
          <li>Lieferschein / Packliste mit Chargebezug</li>
          <li>Temperaturprotokoll oder Logger-Export (falls zutreffend)</li>
          <li>Kommunikationslog bei Sonderfreigaben („use under deviation“ — nur wenn rechtlich sauber)</li>
        </ul>
      </InstitutionalSectionCard>

      <InstitutionalSectionCard id="stoerungen" eyebrow="10 · Betrieb" title="Störungen, Reklamationen und kontinuierliche Verbesserung">
        <p>
          Jede ernsthafte Lieferkette hat einen dokumentierten Reklamationspfad: wer entscheidet, ob Ersatz, Rückerstattung
          oder analytische Nachfassung sinnvoll ist — und wie schnell QA ein OOS-ähnliches Ereignis meldet.
        </p>
        <ul className="list-disc space-y-2 pl-5 marker:text-tint/80">
          <li>Fotopflicht, Retention von Proben / Restmengen bis zur Klärung</li>
          <li>Root-Cause zwischen Verpackung, Carrier und Umladehäfen trennen</li>
          <li>Lessons Learned in Pack-Design und Routing einfließen lassen</li>
        </ul>
      </InstitutionalSectionCard>

      <InstitutionalCtaBar
        text={
          <>
            Konkrete Lieferfenster, Incoterms und Sonderfälle klären wir institutionell — mit Ansprechpartner und
            Dokumentenpaket.
          </>
        }
        primary={{ href: "/anfrage", label: "Institutionelle Anfrage" }}
        secondary={{ href: "/qualitaet-labor", label: "Qualität & Labor" }}
      />
    </InstitutionalHubLayout>
  );
}
