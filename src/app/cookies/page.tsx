import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { LegalProse } from "@/components/legal-prose";
import { LegalDisclaimer } from "@/components/legal-disclaimer";
import { CONSENT_STORAGE_KEY } from "@/lib/cookie-consent";
import { CART_STORAGE_KEY } from "@/lib/cart-storage";
import { ResearchUseNotice } from "@/components/research-use-notice";

export const metadata: Metadata = {
  title: "Cookie-Hinweis",
  description: `Informationen zu Cookies, Einwilligung und lokaler Speicherung bei ${brand.name}.`,
};

export default function CookiesPage() {
  return (
    <LegalProse title="Cookie- und Speicherhinweis">
      <LegalDisclaimer />
      <p>
        {brand.legalName} unterscheidet auf dieser Website zwischen{" "}
        <strong>unbedingt erforderlicher</strong> Speicherung (Betrieb, Sicherheit, Warenkorb) und{" "}
        <strong>optionalen</strong> Kategorien (Statistik, Marketing), die nur nach Ihrer Einwilligung
        im Banner aktiviert werden dürfen. Technische Umsetzung über{" "}
        <code className="rounded bg-black/[0.06] px-1 font-mono text-[13px]">{CONSENT_STORAGE_KEY}</code>{" "}
        (Local Storage, JSON). Bitte die vollständige{" "}
        <a href="/datenschutz" className="font-medium text-tint hover:underline">
          Datenschutzerklärung
        </a>{" "}
        mit Ihrer Rechtsberatung final abstimmen.
      </p>

      <h2>Forschung, Einrichtungen &amp; unzulässige Nutzung (Offenlegung)</h2>
      <p className="text-[14px] leading-relaxed text-muted">
        Die Cookie-Einwilligung betrifft Endgeräte-Speicherung für Statistik/Marketing. Unabhängig davon
        gilt für alle Katalog- und Bestellvorgänge der folgende <strong>Forschungsrahmen</strong> — bitte
        mit Ihrer Compliance abstimmen:
      </p>
      <div className="my-6 max-w-3xl">
        <ResearchUseNotice variant="full" idSuffix="cookies-legal" />
      </div>

      <h2 id="einstellungen">1. Ihre Einstellungen ändern</h2>
      <p>
        Über <strong>„Cookie-Einstellungen“</strong> im Seitenfuß öffnen Sie das Einwilligungsfenster
        erneut und können Statistik/Marketing ab- oder zuschalten. Speichern setzt den Zeitstempel neu.
      </p>

      <h2>2. Unbedingt erforderlich (keine Einwilligung)</h2>
      <p>
        Dazu zählen z. B. serverseitige Logfiles beim Hosting (siehe Datenschutz), sicherheitsrelevante
        Vorgänge sowie die <strong>Warenkorb-Zusammenstellung</strong> im Browser (
        <code className="rounded bg-black/[0.06] px-1 font-mono text-[13px]">{CART_STORAGE_KEY}</code>
        ). Ohne diese Speicherung ist der Katalog-Warenkorb technisch nicht nutzbar.
      </p>
      <p>
        Der <strong>RUO-Hinweis</strong> kann einmalig geschlossen und in Local Storage gemerkt werden —
        kein Tracking personenbezogener Profile; Zweck: Pflichtinformation Research Use Only.
      </p>

      <h2>3. Statistik (nur nach Einwilligung)</h2>
      <p>
        Reichweitenmessung (z. B. Webanalyse) wird <strong>erst geladen/gestartet</strong>, wenn Sie im
        Banner „Statistik“ akzeptieren oder „Alle akzeptieren“ wählen. Vorher findet keine entsprechende
        Verarbeitung durch uns vorgesehene Tools statt (Konfiguration im Code:{" "}
        <code className="rounded bg-black/[0.06] px-1 font-mono text-[13px]">ConsentRuntime</code>
        ). Welches Produkt Sie einbinden (GA4, Matomo, Plausible, …), welche Daten fließen und ob
        Auftragsverarbeitung vorliegt, muss dokumentiert und vertraglich geregelt werden.
      </p>

      <h2>4. Marketing (nur nach Einwilligung)</h2>
      <p>
        Remarketing, Conversion-Pixel o. Ä. setzen wir <strong>nicht</strong> ohne ausdrückliche
        Einwilligung in dieser Kategorie ein. Rechtsgrundlage wäre dann Art. 6 Abs. 1 lit. a DSGVO i. V.
        m. den Anforderungen an wirksame Einwilligung (freiwillig, informiert, granular, widerruflich).
      </p>

      <h2>5. Rechtlicher Rahmen (Kurzüberblick, keine Rechtsberatung)</h2>
      <p>
        In Deutschland ist für nicht notwendige Zugriffe/Speicherungen auf Endgeräten u. a. das{" "}
        <strong>TTDSG</strong> (Telekommunikation-Telemedien-Datenschutz-Gesetz) relevant; parallel
        gelten die Vorgaben der <strong>DSGVO</strong> (Transparenz, Zweckbindung, Datenminimierung,
        Rechtsgrundlagen). „So viele Daten wie möglich“ ist rechtlich in der Regel{" "}
        <strong>nicht</strong> Ziel — es braucht jeweils konkrete Zwecke, dokumentierte Speicherdauer
        und ggf. AV-Verträge mit Dienstleistern.
      </p>

      <h2>6. Speicherdauer (lokal)</h2>
      <p>
        Einwilligungsdaten bleiben, bis Sie sie im Banner widerrufen oder den Browser-Speicher leeren.
        Warenkorbdaten bleiben, bis Sie den Warenkorb leeren oder den Eintrag löschen.
      </p>
    </LegalProse>
  );
}
