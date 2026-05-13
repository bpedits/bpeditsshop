import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { InstitutionalCtaBar, InstitutionalSectionCard } from "@/components/institutional-hub";
import { QualityChainSection } from "@/components/quality-chain-section";
import { ResearchUseNotice } from "@/components/research-use-notice";
import { buildPublicPageMetadata } from "@/lib/seo-page-meta";

export const metadata: Metadata = buildPublicPageMetadata({
  path: "/qualitaet-labor",
  title: "Qualität & Labor",
  description: `${brand.name}: Qualität, Spezifikation, CoA, Chargenrückverfolgung, Analytik, Stabilität und QMS-Orientierung für RUO-Forschungsmaterialien.`,
  keywords: ["Qualität", "CoA", "Laborqualität", "Chargenrückverfolgung", "RUO Qualität"],
  category: "science",
});

/** Labor/Maschine (Querformat) — auf allen Viewports, inkl. Handy (kein separates Dokumenten-Motiv). */
const QUALITY_HERO_IMG =
  "/images/hf_20260430_153235_a5b7f242-9e27-4085-a994-ad3de4773df1.png";

const HERO_W = 5504;
const HERO_H = 3072;

const navItems = [
  { href: "#einordnung", label: "Einordnung" },
  { href: "#ruo", label: "RUO" },
  { href: "#dokumentation", label: "CoA & Charge" },
  { href: "#analytik", label: "Analytik" },
  { href: "#stabilitaet", label: "Stabilität" },
  { href: "#logistik", label: "Logistik" },
  { href: "#qms", label: "QMS & Lieferanten" },
  { href: "#support", label: "Support" },
] as const;

export default function QualityPage() {
  return (
    <div className="border-b border-black/[0.05] bg-gradient-to-b from-surface via-canvas-parchment/30 to-canvas-parchment">
      <div className="mx-auto max-w-[1200px] page-gutter-x pb-16 pt-10 sm:pb-20 sm:pt-14 md:pb-24 md:pt-16">
        <header className="max-w-3xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-tint">Qualitätssystem · Labor</p>
          <h1 className="mt-2 text-[clamp(1.75rem,4.5vw,2.75rem)] font-semibold leading-[1.08] tracking-tight text-foreground">
            Qualität &amp; Labor
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-muted sm:text-[17px]">
            Orientierung für <strong className="font-medium text-foreground">Einkauf, QA und Laborleitung</strong>{" "}
            — wie Forschungsorganisationen Informationen erwarten: nachvollziehbare Spezifikation, belastbare
            Dokumentation, kontrollierte Lagerung und transporttaugliche Übergabe. Konkrete Zertifikate und
            Laborbezeichnungen nur nennen, wenn Sie sie belegen können.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Schwerpunkte">
            {["Spezifikation", "CoA / Charge", "Methodik", "Stabilität", "Kältekette", "Revisionssicherheit"].map(
              (label) => (
                <li
                  key={label}
                  className="rounded-full border border-black/[0.08] bg-white/90 px-3 py-1.5 text-[12px] font-medium text-foreground shadow-sm"
                >
                  {label}
                </li>
              ),
            )}
          </ul>
        </header>

        <figure className="relative isolate mt-10 overflow-hidden rounded-[22px] border border-black/[0.06] bg-[#ececee] shadow-[0_12px_40px_-24px_rgba(0,0,0,0.12)] sm:mt-12">
          <div className="relative aspect-[5504/3072] max-h-[min(42vh,380px)] w-full overflow-hidden sm:max-h-[min(46vh,420px)] md:max-h-[min(42vh,420px)]">
            <img
              src={QUALITY_HERO_IMG}
              alt=""
              width={HERO_W}
              height={HERO_H}
              sizes="(min-width: 768px) 1200px, 100vw"
              className="absolute inset-0 h-full w-full object-cover object-[42%_50%] sm:object-[44%_50%] md:object-[46%_50%]"
              fetchPriority="high"
            />
          </div>
          <figcaption className="sr-only">Illustratives Motiv zu Laborqualität und Forschungskontext</figcaption>
        </figure>

        <nav
          className="mt-8 lg:hidden"
          aria-label="Schnellnavigation Qualität & Labor"
        >
          <ul className="-mx-1 flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {navItems.map((item) => (
              <li key={item.href} className="shrink-0">
                <a
                  href={item.href}
                  className="inline-flex min-h-10 touch-manipulation items-center rounded-full border border-black/[0.1] bg-white px-3.5 py-2 text-[12px] font-medium text-foreground shadow-sm transition hover:border-tint/30"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 lg:mt-12 lg:grid lg:grid-cols-[minmax(0,1fr)_200px] lg:items-start lg:gap-12 xl:grid-cols-[minmax(0,1fr)_220px] xl:gap-16">
          <div className="min-w-0 space-y-8 lg:space-y-10">
            <div className="rounded-2xl border border-tint/15 bg-gradient-to-br from-tint/[0.06] via-white to-surface-pearl/50 px-5 py-5 sm:px-6 sm:py-6">
              <p className="text-[14px] font-semibold text-foreground">Hinweis zur Darstellung</p>
              <p className="mt-2 text-[14px] leading-relaxed text-muted sm:text-[15px]">
                Die folgenden Abschnitte beschreiben <strong className="font-medium text-foreground">übliche Erwartungen</strong>{" "}
                in B2B-Forschungsbeschaffung — keine stillschweigende Garantie einzelner Kennzahlen. Passen Sie Texte an
                Ihre echten Prozesse, Drittlabore und Zertifikate an und lassen Sie sie rechtlich prüfen, bevor Sie sie
                veröffentlichen.
              </p>
            </div>

            <div className="max-w-3xl">
              <ResearchUseNotice variant="shop" idSuffix="quality-lab" />
            </div>

            <InstitutionalSectionCard id="einordnung" eyebrow="01 · Rahmen" title="Einordnung für institutionelle Partner">
              <p>
                Forschungsmaterialien werden typischerweise über{" "}
                <strong className="font-medium text-foreground">technische Datenblätter</strong>,{" "}
                <strong className="font-medium text-foreground">CoA je Charge</strong> und klare{" "}
                <strong className="font-medium text-foreground">RUO-Kennzeichnung</strong> entschieden. Ihre Seite
                sollte dieselbe Klarheit bieten wie ein Lieferanten-DMF oder technisches Paket — nur in verkürzter,
                webtauglicher Form.
              </p>
              <ul className="list-disc space-y-2 pl-5 marker:text-tint/80">
                <li>Einheitliche Benennung von Reinheit, Darreichungsform und Referenzmethoden</li>
                <li>Nachvollziehbare Versionsstände von Spezifikation und CoA</li>
                <li>Transparente Grenzen: was geliefert wird vs. was ausgeschlossen ist (z. B. Human-/Vet-Anwendung)</li>
              </ul>
            </InstitutionalSectionCard>

            <InstitutionalSectionCard id="ruo" eyebrow="02 · Regulatorik" title="Research Use Only (RUO)">
              <p>
                RUO bedeutet: Material für <strong className="font-medium text-foreground">professionelle Forschung</strong>
                , nicht für diagnostische, therapeutische oder Verbraucherzwecke. Kommunikation und Checkout müssen das
                konsistent unterstützen — inklusive Alters- und Zweckprüfungen in Ihrem Anfrageprozess (rechtlich
                abstimmen).
              </p>
              <ul className="list-disc space-y-2 pl-5 marker:text-tint/80">
                <li>Klare Trennung von Wellness-, Lifestyle- oder „Biohacker“-Kommunikation</li>
                <li>Dokumentierte Freigabe institutioneller Besteller / Laborverantwortlicher</li>
                <li>Abstimmung mit Ihren B2B-Forschungsbedingungen und Exportkontrollen je Zielmarkt</li>
              </ul>
            </InstitutionalSectionCard>

            <InstitutionalSectionCard id="dokumentation" eyebrow="03 · Nachweis" title="CoA, SDS und Chargenrückverfolgung">
              <p>
                Ein <strong className="font-medium text-foreground">Certificate of Analysis</strong> pro Charge ist
                Standard; Inhalte richten sich nach Spezifikation (z. B. Reinheit per HPLC, Identität per MS je nach
                Peptid). <strong className="font-medium text-foreground">SDS</strong> und Gefahrenhinweise ergänzen den
                Laboralltag.
              </p>
              <ul className="list-disc space-y-2 pl-5 marker:text-tint/80">
                <li>Chargebezogene Archivierung und Abruf für Reklamationen / OOS-Nachfass</li>
                <li>Revisionssichere Ablage (Wer hat wann welche Version freigegeben?)</li>
                <li>Keine überzogenen Marketing-Superlative dort, wo Messdaten stehen sollten</li>
              </ul>
            </InstitutionalSectionCard>

            <InstitutionalSectionCard id="analytik" eyebrow="04 · Labor" title="Analytik, Methodenvalidierung und OOS">
              <p>
                Institute vergleichen Chargen über Jahre. Deshalb sind{" "}
                <strong className="font-medium text-foreground">stabil referenzierte Methoden</strong>, klare
                System-Suitability und dokumentierte Änderungen wichtiger als „höchste Reinheit“ ohne Kontext.
              </p>
              <ul className="list-disc space-y-2 pl-5 marker:text-tint/80">
                <li>Versionierte SOPs für kritische Analysen; nachvollziehbare Kalibrier- und QC-Spur</li>
                <li>OOS / OOT-Prozesse: transparente Eskalation statt „stiller“ Neubewertung</li>
                <li>Externe Prüflabore: Qualifizierung, Ringversuche oder Audit-Trail je nach Partneranforderung</li>
              </ul>
            </InstitutionalSectionCard>

            <InstitutionalSectionCard id="stabilitaet" eyebrow="05 · Produkt" title="Stabilität, Licht und Feuchte">
              <p>
                Lyophilisate reagieren auf Licht, Feuchte und unsachgemäße Rekonstitution. Professionelle Pakete
                enthalten <strong className="font-medium text-foreground">Lagerungsempfehlungen</strong>,{" "}
                <strong className="font-medium text-foreground">Gebrauchshinweise nach dem Öffnen</strong> und ggf.
                Stabilitätsaussagen im Rahmen Ihrer Datenlage (branchenübliche ICH-orientierte Referenzrahmen — rechtlich
                prüfen).
              </p>
            </InstitutionalSectionCard>

            <InstitutionalSectionCard id="logistik" eyebrow="06 · Kette" title="Kältekette, Transport und Zoll">
              <p>
                Temperaturführung (z. B. 2–8 °C), Monitoring und dokumentierte Übergaben reduzieren
                Stabilitätsrisiken. <strong className="font-medium text-foreground">Gefahrgut</strong>,{" "}
                <strong className="font-medium text-foreground">Biostoffe</strong> und zollrechtliche Einordnung sind
                produkt- und routing-spezifisch — nur kommunizieren, was verbindlich geprüft ist.
              </p>
              <ul className="list-disc space-y-2 pl-5 marker:text-tint/80">
                <li>Annahmehinweise für Empfang im Institut (Zeitfenster, Quarantäne, Eskalation)</li>
                <li>Retouren- und Verderb-Policy klar mit QA/Einkauf abstimmen</li>
              </ul>
            </InstitutionalSectionCard>

            <InstitutionalSectionCard id="qms" eyebrow="07 · System" title="QMS, Change Control und Lieferantenqualifizierung">
              <p>
                Viele Partner erwarten ein dokumentiertes{" "}
                <strong className="font-medium text-foreground">Qualitätsmanagementsystem</strong> (z. B. ISO 9001) oder
                branchenspezifische Audits. Zertifikate nur zeigen, wenn gültig und zum Leistungsumfang passend.
              </p>
              <ul className="list-disc space-y-2 pl-5 marker:text-tint/80">
                <li>Change Control für Spezifikation, Herkunft der Rohstoffe, analytische Methoden</li>
                <li>Lieferanten- und Dienstleisterqualifizierung inkl. Auftragsdatenverarbeitung (DPA)</li>
                <li>CAPA-Schleifen und Management-Review — sichtbar im Kern, nicht als Marketing-Floskeln</li>
              </ul>
            </InstitutionalSectionCard>

            <InstitutionalSectionCard id="support" eyebrow="08 · Ansprechpartner" title="Support, der QA und Einkauf entlastet">
              <p>
                Kurze Reaktionszeiten für <strong className="font-medium text-foreground">technische Rückfragen</strong>
                , klare Eskalationswege bei Abweichungen und eine sachliche Dokumentation zu Chargen erhöhen Vertrauen
                spürbar — besonders wenn mehrere Institute dieselbe SKU beziehen.
              </p>
            </InstitutionalSectionCard>

            <InstitutionalCtaBar
              text={
                <>
                  Technische Tiefe im Katalog, verbindliche Konditionen über{" "}
                  <Link href="/anfrage" className="font-medium text-tint hover:underline">
                    Anfrage
                  </Link>{" "}
                  oder interne Freigabe.
                </>
              }
              primary={{ href: "/shop", label: "Zum Katalog" }}
              secondary={{ href: "/forschungsbedingungen-b2b", label: "Forschungsbedingungen" }}
            />
          </div>

          <aside className="mt-10 hidden lg:mt-0 lg:block">
            <div className="sticky top-28 space-y-5">
              <nav
                className="rounded-2xl border border-black/[0.07] bg-white/95 p-4 shadow-sm backdrop-blur-sm"
                aria-label="Abschnitte Qualität & Labor"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Auf dieser Seite</p>
                <ul className="mt-3 space-y-1.5 border-t border-black/[0.06] pt-3">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className="block rounded-lg px-2 py-1.5 text-[13px] text-muted transition hover:bg-black/[0.04] hover:text-foreground"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="rounded-2xl border border-tint/20 bg-tint/[0.06] p-4">
                <p className="text-[13px] font-semibold text-foreground">Dokumentation &amp; Belege</p>
                <p className="mt-1 text-[12px] leading-relaxed text-muted">
                  Beispiel-CoA, Spezifikationsentwürfe oder QA-Fragebögen — über {brand.name} anfragen.
                </p>
                <Link
                  href="/anfrage"
                  className="mt-3 inline-flex min-h-10 w-full touch-manipulation items-center justify-center rounded-full bg-tint px-4 text-[13px] font-semibold text-white transition hover:opacity-92"
                >
                  Institutionelle Anfrage
                </Link>
              </div>
              <Link href="/hilfe" className="block text-center text-[13px] font-medium text-tint hover:underline">
                FAQ &amp; Hilfe
              </Link>
            </div>
          </aside>
        </div>
      </div>

      <QualityChainSection />
    </div>
  );
}
