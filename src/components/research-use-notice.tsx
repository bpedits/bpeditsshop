import Link from "next/link";

type Variant = "shop" | "full";

const heading = "Research Use Only (RUO) · B2B-Forschung";

/**
 * Wiederkehrende Offenlegung: Labor/Universität, kein Verbrauch, keine Ausnahmen für Human/Vet/Kosmetik usw.
 * Text mit Rechtsberatung final abstimmen.
 */
export function ResearchUseNotice({ variant, idSuffix = variant }: { variant: Variant; idSuffix?: string }) {
  const isCompact = variant === "shop";

  return (
    <aside
      className={`rounded-2xl border border-black/[0.08] bg-canvas-parchment/90 ${
        isCompact ? "px-4 py-3.5 sm:px-5 sm:py-4" : "px-4 py-4 sm:px-5 sm:py-4"
      }`}
      aria-labelledby={`ruo-notice-${idSuffix}`}
    >
      <p id={`ruo-notice-${idSuffix}`} className="text-[11px] font-semibold uppercase tracking-[0.12em] text-tint">
        {heading}
      </p>

      {isCompact ? (
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          Katalog und Warenkorb richten sich an{" "}
          <strong className="font-medium text-foreground">Hochschulen, Forschungsinstitute und Unternehmen mit geeignetem Laborbetrieb</strong>
          . Kein Verkauf an Privatpersonen / Endverbraucher. Materialien{" "}
          <strong className="font-medium text-foreground">ausschließlich für professionelle in-vitro-Forschung und Laborzwecke</strong>
          —{" "}
          <strong className="font-medium text-foreground">nicht</strong> zur Anwendung am Menschen oder Tier, nicht als
          Arzneimittel, nicht kosmetisch, nicht diagnostisch, nicht als Lebensmittel oder Nahrungsergänzung.{" "}
          <Link href="/forschungsbedingungen-b2b" className="font-medium text-tint hover:underline">
            Forschungsbedingungen (B2B)
          </Link>
          .
        </p>
      ) : (
        <div className="mt-2 space-y-2 text-[12px] leading-relaxed text-muted sm:text-[13px]">
          <p>
            <strong className="font-medium text-foreground">Wer darf bestellen / anfragen?</strong> Nur im Rahmen einer
            nachweisbaren <strong className="font-medium text-foreground">institutionellen Einrichtung</strong> mit
            Labor (z.&nbsp;B. Universität, Forschungsinstitut, reguliertes Unternehmenslabor). Der öffentliche Katalog
            dient der <strong className="font-medium text-foreground">Information und Zusammenstellung</strong> —
            verbindliche Abgabe, Freigabe und Logistik erfolgen nach Prüfung Ihrer Einrichtung und der geltenden
            Vorschriften.
          </p>
          <p>
            <strong className="font-medium text-foreground">Zulässige Verwendung (ohne Ausnahme für Verbraucherzwecke):</strong>{" "}
            ausschließlich <strong className="font-medium text-foreground">professionelle Forschung in vitro / im Labor</strong>
            . <strong className="font-medium text-foreground">Ausgeschlossen</strong> — jede Anwendung am lebenden Menschen
            oder Tier, jede diagnostische, therapeutische, präventive oder kosmetische Nutzung, jede In-vivo-Anwendung am
            Menschen/Tier, jeder Verzehr bzw. jede „Selbstversuch“-Idee, jede Weitergabe an Dritte ohne gleichwertigen
            Forschungsrahmen. <strong className="font-medium text-foreground">Kein Verbraucherschutz-Kauf:</strong>{" "}
            keine Widerrufs-„Kulanz“ für Endverbraucherprodukte; es handelt sich nicht um Lifestyle- oder Wellnessware.
          </p>
          <p>
            <strong className="font-medium text-foreground">Zahlung / Warenkorb:</strong> Eine Referenz-Zahlung (z.&nbsp;B.
            Stripe) oder ein Warenkorb ersetzen <strong className="font-medium text-foreground">keine</strong> rechtliche
            Einordnung Ihrer Nutzung und entbinden nicht von den Forschungsbedingungen.{" "}
            <Link href="/forschungsbedingungen-b2b" className="font-medium text-tint hover:underline">
              B2B-Forschungsbedingungen
            </Link>
            ,{" "}
            <Link href="/sicherheit-vertraulichkeit" className="font-medium text-tint hover:underline">
              Sicherheit &amp; Vertraulichkeit
            </Link>
            ,{" "}
            <Link href="/datenschutz" className="font-medium text-tint hover:underline">
              Datenschutz
            </Link>
            .
          </p>
        </div>
      )}
    </aside>
  );
}
