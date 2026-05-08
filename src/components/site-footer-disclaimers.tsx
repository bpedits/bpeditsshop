import Link from "next/link";
import { brand } from "@/lib/brand";

/**
 * Globale Kurz-Hinweise (TMG-/RUO-Kontext) — auf allen Seiten unter dem Haupt-Footer-Inhalt.
 * Ausführliche Paragrafen zusätzlich im Impressum.
 */
export function SiteFooterDisclaimers() {
  return (
    <div className="mt-10 rounded-2xl border border-black/[0.06] bg-black/[0.02] px-4 py-5 sm:mt-12 sm:px-5 sm:py-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
        Hinweise · Haftung · Forschungskontext (RUO)
      </p>
      <div className="mt-4 space-y-3 text-[11px] leading-relaxed text-muted sm:text-[12px] sm:leading-relaxed">
        <p>
          <strong className="font-medium text-foreground">Inhalte.</strong> Trotz sorgfältiger inhaltlicher
          Kontrolle übernehmen wir keine Haftung für die Richtigkeit, Vollständigkeit und Aktualität der
          bereitgestellten Informationen. Verbindliche Auskünfte zu Verfügbarkeit, Spezifikation und Konditionen
          ergeben sich nur im Einzelfall nach Prüfung Ihrer Anfrage.
        </p>
        <p>
          <strong className="font-medium text-foreground">Externe Links.</strong> Für Inhalte verlinkter
          fremder Websites sind ausschließlich deren Betreiber verantwortlich. Zum Zeitpunkt der Verlinkung
          waren uns keine Rechtsverletzungen bekannt.
        </p>
        <p>
          <strong className="font-medium text-foreground">Forschung (RUO).</strong> Angebote und technische
          Angaben richten sich an <strong className="font-medium text-foreground">professionelle</strong>{" "}
          Einrichtungen (Labor / in vitro). Keine Anwendung am Menschen oder Tier, keine therapeutische,
          diagnostische oder kosmetische Nutzung. Keine Heil-/Wirkversprechen. Keine ärztliche oder
          apothekerliche Beratung durch diese Website.
        </p>
        <p>
          <strong className="font-medium text-foreground">Preise · Katalog.</strong> Im öffentlichen Katalog
          genannte Beträge sind <strong className="font-medium text-foreground">Referenzpreise zur Orientierung</strong>
          {" "}(EUR pro angegebener Bezugsgröße, Staffeln möglich) —{" "}
          <strong className="font-medium text-foreground">keine</strong> rechtsbindende Aufforderung zur
          Abgabe eines Angebots; verbindliche Konditionen nach institutioneller oder vertraglicher Prüfung.
        </p>
        <p>
          <strong className="font-medium text-foreground">Urheberrecht.</strong> Texte, Darstellung und
          Mediennutzung dieser Website unterliegen dem Urheberrecht soweit nicht anders gekennzeichnet.
          Nutzungen außerhalb der Grenzen des Urheberrechts nur mit vorheriger Zustimmung von{" "}
          <span className="whitespace-nowrap">{brand.legalName}</span>.
        </p>
      </div>
      <p className="mt-4 border-t border-black/[0.06] pt-4 text-[11px] leading-relaxed text-muted sm:text-[12px]">
        Ausführlichere Darstellung u. a. zu TMG-/Inhalts-Haftung finden Sie im{" "}
        <Link href="/impressum" className="font-medium text-tint hover:underline">
          Impressum
        </Link>
        {" · "}
        <Link href="/rechtliches" className="font-medium text-tint hover:underline">
          Rechtliches
        </Link>
        {" · "}
        <Link href="/datenschutz" className="font-medium text-tint hover:underline">
          Datenschutz
        </Link>
        .
      </p>
    </div>
  );
}
