import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { LegalDisclaimer } from "@/components/legal-disclaimer";
import { LegalProse } from "@/components/legal-prose";
import { buildPublicPageMetadata } from "@/lib/seo-page-meta";

export const metadata: Metadata = buildPublicPageMetadata({
  path: "/datenschutz",
  title: "Datenschutz",
  description: `Datenschutzerklärung (DSGVO) von ${brand.name}: Verantwortliche Stelle, Zwecke der Verarbeitung, Rechte der Betroffenen, Cookies und Kontakt.`,
  keywords: ["Datenschutz", "DSGVO", "Privacy", "Personenbezogene Daten", brand.name],
  category: "legal",
});

export default function DatenschutzPage() {
  return (
    <LegalProse title="Datenschutzerklärung">
      <LegalDisclaimer />
      <h2>1. Verantwortliche Stelle</h2>
      <p>
        Verantwortlich im Sinne der Datenschutz-Grundverordnung (DSGVO) ist die {brand.legalName},{" "}
        {brand.addressLine1}, {brand.zip} {brand.city}, {brand.country}, E-Mail: {brand.email}.
      </p>
      <h2>2. Allgemeines zur Datenverarbeitung</h2>
      <p>
        Wir verarbeiten personenbezogene Daten nur im erforderlichen Umfang zur Bereitstellung dieser Website, zur
        Kommunikation und zur Durchführung von Anfragen bzw. Verträgen. Eine Verarbeitung erfolgt auf Grundlage einer
        wirksamen Einwilligung, zur Vertragserfüllung oder -anbahnung oder auf Grundlage eines berechtigten Interesses,
        soweit die DSGVO dies vorsieht.
      </p>
      <h2>3. Hosting und Server-Logfiles</h2>
      <p>
        Beim Aufruf dieser Website können technisch erforderliche Daten (z.&nbsp;B. IP-Adresse, Zeitstempel,
        aufgerufene Ressource, User-Agent) beim Hosting-Provider verarbeitet werden. Rechtsgrundlage ist in der Regel
        Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an sicherem und stabilem Betrieb) bzw. bei
        Vertragsbeziehungen Art. 6 Abs. 1 lit. b DSGVO.
      </p>
      <h2>4. Kontaktaufnahme</h2>
      <p>
        Wenn Sie uns per E-Mail ({brand.email}) kontaktieren oder das Kontaktformular nutzen, verarbeiten wir Ihre
        Angaben zur Bearbeitung der Nachricht. Übermittlungen aus dem Kontaktformular werden per E-Mail an die dafür
        vorgesehene Eingangsadresse geleitet ({brand.contactFormInboxEmail}). Rechtsgrundlage ist Art. 6 Abs. 1 lit. b
        bzw. lit. f DSGVO.
      </p>
      <h2>5. Institutionelle Anfragen</h2>
      <p>
        Daten aus dem Anfrageformular für institutionelle Anfragen werden zur Prüfung, Angebotserstellung und
        Kontaktaufnahme verarbeitet. Sofern Sie ein externes Formular-Backend nutzen, gelten dort zusätzlich die
        Hinweise des jeweiligen Anbieters; bei ausschließlich interner Verarbeitung dokumentieren wir Zweck und
        Aufbewahrung intern.
      </p>
      <h2>6. Cookies, Local Storage und Einwilligung (TTDSG / DSGVO)</h2>
      <p>
        Wir unterscheiden zwischen <strong>unbedingt erforderlichen</strong> Speichervorgängen (z.&nbsp;B.
        Warenkorb-Zusammenstellung im Browser, technische Sicherheit, Anzeige gesetzlicher Hinweise) und{" "}
        <strong>optionalen</strong> Kategorien <em>Statistik</em> sowie <em>Marketing</em>. Letztere werden auf dieser
        Website nur aktiviert, wenn Sie im Einwilligungsdialog ausdrücklich zustimmen oder dort getrennt anhaken — siehe
        auch{" "}
        <a href="/cookies" className="font-medium text-tint hover:underline">
          Cookie- und Speicherhinweis
        </a>
        . Sie können Ihre Auswahl über „Cookie-Einstellungen“ im Fußbereich jederzeit mit Wirkung für die Zukunft
        ändern.
      </p>
      <p>
        Rechtsgrundlage: Unbedingt erforderliche Vorgänge ggf. Art. 6 Abs. 1 lit. b DSGVO (Vertrag/Anbahnung) oder lit. f
        DSGVO (sicherer Betrieb); Statistik und Marketing nur bei wirksamer Einwilligung gemäß Art. 6 Abs. 1 lit. a
        DSGVO i. V. m. TTDSG § 25 Abs. 1 bei Zugriff auf Endgeräteinformationen.
      </p>
      <h2>7. Ihre Rechte</h2>
      <p>Sie haben im Rahmen der DSGVO u.&nbsp;a. Rechte auf:</p>
      <ul>
        <li>Auskunft (Art. 15 DSGVO)</li>
        <li>Berichtigung (Art. 16 DSGVO)</li>
        <li>Löschung (Art. 17 DSGVO)</li>
        <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
        <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
        <li>Widerspruch (Art. 21 DSGVO)</li>
        <li>Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO)</li>
      </ul>
      <h2>8. Speicherdauer</h2>
      <p>
        Wir löschen personenbezogene Daten, sobald der Zweck entfällt und keine gesetzlichen Aufbewahrungspflichten
        entgegenstehen.
      </p>
    </LegalProse>
  );
}
