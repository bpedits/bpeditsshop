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

export const metadata: Metadata = {
  title: "Partnerprogramm",
  description: `${brand.name}: Partner- und Affiliate-System für institutionelle Multiplikatoren — Attribution, Compliance (RUO), Onboarding und faire Incentives im B2B-Rahmen.`,
};

const NAV = [
  { href: "#system", label: "Systemüberblick" },
  { href: "#partner", label: "Partnerprofile" },
  { href: "#journey", label: "Customer Journey" },
  { href: "#attribution", label: "Attribution" },
  { href: "#compliance", label: "Compliance" },
  { href: "#incentives", label: "Incentives" },
  { href: "#onboarding", label: "Onboarding" },
  { href: "#reporting", label: "Reporting" },
  { href: "#ausschluesse", label: "Ausschlüsse" },
  { href: "#bewerbung", label: "Bewerbung" },
] as const;

export default function AffiliatePage() {
  return (
    <InstitutionalHubLayout
      eyebrow="Partnerökonomie · B2B"
      title="Partnerprogramm: Rahmen, Attribution & Compliance"
      lede={
        <p>
          Ein durchdachtes Partnerprogramm im Forschungsumfeld belohnt{" "}
          <strong className="font-medium text-foreground">qualifizierte Vermittlung</strong> — nicht Klickzahlen um
          jeden Preis. Diese Seite skizziert ein{" "}
          <strong className="font-medium text-foreground">modulares System</strong>: Zielgruppen, nachvollziehbare
          Zuordnung (Attribution), RUO-konforme Inhalte, Prüfprozesse und saubere Datenverarbeitung. Verträge,
          Prozentsätze und Ausschlusslisten finalisieren Sie mit Ihrer Rechtsberatung.
        </p>
      }
      chips={[
        "Institutionell",
        "Attribution",
        "RUO-konform",
        "DSGVO / Cookies",
        "Review-Pflicht",
        "Transparenz",
      ]}
      navItems={NAV}
      navAriaLabel="Schnellnavigation Partnerprogramm"
      asideNavAriaLabel="Abschnitte Partnerprogramm"
      asideFooter={
        <>
          <div className="rounded-2xl border border-black/[0.08] bg-white/95 p-4 shadow-sm">
            <p className="text-[13px] font-semibold text-foreground">Kurz bewerben</p>
            <p className="mt-1 text-[12px] leading-relaxed text-muted">
              Nutzen Sie das Anfrageformular mit dem Hinweis <span className="font-mono text-[11px]">Partnerprogramm</span>{" "}
              — Ansprechpartner, Plattform, Zielgruppe und Nachweise kurz beschreiben.
            </p>
            <Link
              href="/anfrage"
              className="mt-3 inline-flex min-h-10 w-full touch-manipulation items-center justify-center rounded-full border border-tint/30 bg-tint/[0.08] px-4 text-[13px] font-semibold text-tint transition hover:bg-tint/15"
            >
              Zur Anfrage
            </Link>
          </div>
          <div className="rounded-2xl border border-black/[0.07] bg-surface-pearl/60 p-4">
            <p className="text-[12px] font-semibold text-foreground">Daten &amp; Einwilligung</p>
            <p className="mt-1 text-[12px] leading-relaxed text-muted">
              Tracking und Remarketing nur im Rahmen Ihrer Cookie- und Einwilligungslogik.
            </p>
            <div className="mt-2 flex flex-col gap-1.5 text-[12px] font-medium text-tint">
              <Link href="/datenschutz" className="hover:underline">
                Datenschutz
              </Link>
              <Link href="/cookies" className="hover:underline">
                Cookie-Hinweis
              </Link>
            </div>
          </div>
        </>
      }
    >
      <LegalDisclaimer />

      <div className="rounded-2xl border border-tint/15 bg-gradient-to-br from-tint/[0.06] via-white to-surface-pearl/50 px-5 py-5 sm:px-6 sm:py-6">
        <p className="text-[14px] font-semibold text-foreground">Designprinzip: „Institution first“</p>
        <p className="mt-2 text-[14px] leading-relaxed text-muted sm:text-[15px]">
          Partner sind <strong className="font-medium text-foreground">Multiplikatoren mit Verantwortung</strong>: Sie
          empfehlen Materialien für professionelle Forschung. Das System priorisiert daher{" "}
          <strong className="font-medium text-foreground">Nachweisbarkeit, Zielgruppenpassung und inhaltliche Korrektheit</strong>{" "}
          über virale Reichweite. So bleibt das Programm erklärbar gegenüber QA, Einkauf und Aufsichtsinstanzen.
        </p>
      </div>

      <div className="max-w-3xl">
        <ResearchUseNotice variant="shop" idSuffix="affiliate-hub" />
      </div>

      <InstitutionalSectionCard id="system" eyebrow="01 · Architektur" title="Systemüberblick: Module, die zusammenspielen">
        <p>
          Stabil funktionierende Partnerprogramme trennen klar zwischen{" "}
          <strong className="font-medium text-foreground">Akquise</strong>,{" "}
          <strong className="font-medium text-foreground">Zuordnung</strong>,{" "}
          <strong className="font-medium text-foreground">Auszahlung</strong> und{" "}
          <strong className="font-medium text-foreground">Compliance-Monitoring</strong>. Jede Schicht sollte auditierbar
          sein (Wer hat welchen Partner wann freigeschaltet?).
        </p>
        <ul className="list-disc space-y-2 pl-5 marker:text-tint/80">
          <li>Partner-CRM: Status (beworben, geprüft, aktiv, pausiert, beendet)</li>
          <li>Tracking-Schicht: first-party wo möglich; Third-Party nur mit Rechtsgrundlage</li>
          <li>Abrechnung: Monats- oder Quartalszyklen mit eindeutiger Transaktions-ID</li>
          <li>Content-Governance: vorab freigegebene Claims und verbotene Formulierungen</li>
        </ul>
      </InstitutionalSectionCard>

      <InstitutionalSectionCard id="partner" eyebrow="02 · Zielgruppe" title="Partnerprofile: wer passt — und wer nicht?">
        <p>
          Typische Multiplikatoren: <strong className="font-medium text-foreground">Hochschulgruppen</strong>,{" "}
          <strong className="font-medium text-foreground">Forschungsverbünde</strong>,{" "}
          <strong className="font-medium text-foreground">Fachverlage</strong> mit B2B-Leserschaft oder Anbieter von
          Laborinfrastruktur mit nachweislicher Instituts-URL. Jeder Partner sollte eine{" "}
          <strong className="font-medium text-foreground">verifizierbare Identität</strong> und eine nachvollziehbare
          Zielgruppe haben.
        </p>
        <ul className="list-disc space-y-2 pl-5 marker:text-tint/80">
          <li>Mindestkriterien: Impressum, inhaltliche Passform zu RUO, kein D2C-„Wellness“-Framing</li>
          <li>Sanctions / PEP-Checks wo sinnvoll (mit Datenschutz und Zweckbindung)</li>
          <li>Sub-Publisher nur mit ausdrücklicher schriftlicher Zustimmung und gleichen Compliance-Standards</li>
        </ul>
      </InstitutionalSectionCard>

      <InstitutionalSectionCard id="journey" eyebrow="03 · Funnel" title="Customer Journey: vom Klick zur institutionellen Bestellung">
        <p>
          B2B-Journeys sind länger und oft nicht-linear. Ihr System sollte deshalb{" "}
          <strong className="font-medium text-foreground">Touchpoints über Wochen</strong> abbilden können — ohne
          automatisch jede Zwischenaktion als „Conversion“ zu werten.
        </p>
        <ol className="list-decimal space-y-2 pl-5 marker:font-semibold marker:text-tint">
          <li>Information: technische Daten, RUO-Kontext, Anfrage- oder Checkout-Einstieg</li>
          <li>Evaluation: interne Abstimmung bei Einkauf / QA (häufig parallel zur Website)</li>
          <li>Commit: Warenkorb, Anfrage oder formale Bestellung — hier brauchen Sie eindeutige Zuordnungsregeln</li>
          <li>Onboarding beim Institut: Lieferadresse, Empfang, Dokumente</li>
        </ol>
      </InstitutionalSectionCard>

      <InstitutionalSectionCard id="attribution" eyebrow="04 · Messlogik" title="Attribution: fair zuordnen ohne Grauzonen">
        <p>
          Wählen Sie ein Modell, das zu Ihrer durchschnittlichen Verkaufszykluslänge passt — und dokumentieren Sie es
          im Partnervertrag. Häufige Varianten (nur als Orientierung, keine Empfehlung im Rechtssinne):
        </p>
        <ul className="list-disc space-y-2 pl-5 marker:text-tint/80">
          <li>
            <strong className="font-medium text-foreground">Last-touch</strong> innerhalb eines definierten
            Attribution-Fensters (z. B. 30–90 Tage) — einfach erklärbar, kann frühe Influencer benachteiligen.
          </li>
          <li>
            <strong className="font-medium text-foreground">First-touch</strong> für Awareness-schwere Märkte — kann
            Abschluss-Partner benachteiligen; oft mit Gewichtung kombiniert.
          </li>
          <li>
            <strong className="font-medium text-foreground">Server-seitige Zuordnung</strong> (z. B. eindeutiger
            Rabatt- oder Empfehlungscode pro Institut) reduziert Cookie-Abhängigkeit — besonders in Fachnetzwerken
            beliebt.
          </li>
        </ul>
        <p className="text-[14px] text-muted">
          Technisch: Parameter in URLs, first-party Storage, oder geschlossene Plattform-Login — jeweils mit
          Transparenz in der Datenschutzerklärung und Cookie-Banner-Logik.
        </p>
      </InstitutionalSectionCard>

      <InstitutionalSectionCard id="compliance" eyebrow="05 · Regeln" title="Compliance: Inhalte, Claims und Tracking">
        <p>
          Partner dürfen keine Heilsversprechen transportieren und keine Anwendung am Menschen/Tier implizieren.
          Verlinkte Landingpages sollten <strong className="font-medium text-foreground">RUO-konsequent</strong> sein
          — inklusive Alters- und Zweckhinweisen, die auch im Checkout stehen.
        </p>
        <ul className="list-disc space-y-2 pl-5 marker:text-tint/80">
          <li>Blacklist für Wörter, Bilder und Vergleiche (auch in Social-Snippets)</li>
          <li>Pflicht-Kurzschulung oder Partner-Guide vor Freischaltung</li>
          <li>Stichproben-Audits aktiver Publisher (z. B. quartalsweise)</li>
        </ul>
      </InstitutionalSectionCard>

      <InstitutionalSectionCard id="incentives" eyebrow="06 · Anreize" title="Incentives: Staffeln, Caps und Transparenz">
        <p>
          Institutionelle Partner erwarten klare, vorhersehbare Regeln: wann zählt eine Vermittlung, was passiert bei
          Stornierung oder Teilrückerstattung, gibt es ein jährliches Cap pro Partner?
        </p>
        <ul className="list-disc space-y-2 pl-5 marker:text-tint/80">
          <li>Staffeln nach validiertem Umsatz oder nach bestätigter Auslieferung (operativ sauberer)</li>
          <li>Negative Keywords / Markenschutz: keine bezahlten Ads auf Ihre Marke durch Partner ohne Freigabe</li>
          <li>Self-referrals und Mitarbeiter-Beziehungen explizit regeln</li>
        </ul>
      </InstitutionalSectionCard>

      <InstitutionalSectionCard id="onboarding" eyebrow="07 · Prozess" title="Onboarding: Prüfung, Vertrag, technische Freigabe">
        <p>
          Ein mehrstufiges Onboarding reduziert spätere Kündigungen und Reputationsschäden: Inhalte prüfen, Tracking testen,
          Test-Conversion durchspielen, dann Freigabe mit Zeitstempel und Verantwortlichem.
        </p>
        <ol className="list-decimal space-y-2 pl-5 marker:font-semibold marker:text-tint">
          <li>KYC-light: Domain, Impressum, redaktionelle Verantwortliche</li>
          <li>Vertrag: Attribution, Laufzeit, Kündigung, Haftung für Partnerinhalte</li>
          <li>Technik: Partner-ID, Tracking-Parameter, ggf. separate Landingpages je Kampagne</li>
        </ol>
      </InstitutionalSectionCard>

      <InstitutionalSectionCard id="reporting" eyebrow="08 · Daten" title="Reporting, Auszahlung und Streitbeilegung">
        <p>
          Partnerportale sollten Rohdaten und aggregierte KPIs trennen — damit Nachfragen zu einzelnen Orders schnell
          beantwortet werden können, ohne interne Systeme offenzulegen.
        </p>
        <ul className="list-disc space-y-2 pl-5 marker:text-tint/80">
          <li>Export CSV/Excel mit eindeutiger Transaktions-ID und Status (pending / approved / paid)</li>
          <li>Dispute-Fenster: z. B. 14 Tage bevor Provision „locked“ wird</li>
          <li>Steuerliche Einordnung (Reverse charge, US W-8BEN etc.) mit Steuerberater klären</li>
        </ul>
      </InstitutionalSectionCard>

      <InstitutionalSectionCard id="ausschluesse" eyebrow="09 · Risiko" title="Ausschlüsse, Pausierung und harte Stopps">
        <p>
          Definieren Sie Ereignisse, die zu sofortiger Sperrung führen: irreführende Gesundheitsclaims, Umgehung des
          Checkout-Hinweises, Trademark-Bidding, oder Verkauf an nicht qualifizierte Zielgruppen.
        </p>
        <ul className="list-disc space-y-2 pl-5 marker:text-tint/80">
          <li>Graduierte Maßnahmen: Warnung → begrenzte Sichtbarkeit → vollständige Kündigung</li>
          <li>Blacklist geteilter Sub-Publisher über mehrere Programme hinweg (intern dokumentieren)</li>
        </ul>
      </InstitutionalSectionCard>

      <InstitutionalSectionCard id="bewerbung" eyebrow="10 · Kontakt" title="Bewerbung und nächste Schritte">
        <p>
          Wenn Sie das Programm aktiv betreiben, hinterlegen Sie hier ein dediziertes Formular oder verweisen Sie auf die
          institutionelle Anfrage mit klarer Betreffzeile. Intern sollten Marketing, Legal und Finance dieselbe
          Versionsnummer des Partner-PDFs referenzieren.
        </p>
        <p className="text-[14px] text-muted">
          Betreff-Vorschlag: <span className="font-mono text-[13px] text-foreground">Partnerprogramm — [Organisation]</span>
        </p>
      </InstitutionalSectionCard>

      <InstitutionalCtaBar
        text={
          <>
            Partnerprogramm technisch oder vertraglich aufsetzen? Starten Sie mit einer strukturierten Anfrage — wir
            ordnen Sie intern dem richtigen Prozess zu.
          </>
        }
        primary={{ href: "/anfrage", label: "Institutionelle Anfrage" }}
        secondary={{ href: "/versand", label: "Versand & Lieferung" }}
      />
    </InstitutionalHubLayout>
  );
}
