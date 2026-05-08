import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "B2B-Forschungsbedingungen",
  description: `Rahmen für institutionelle Anfragen und RUO-Lieferungen — ${brand.name}.`,
};

export default function B2BResearchTermsPage() {
  return (
    <div className="mx-auto max-w-3xl page-gutter-x py-10 sm:py-14 md:py-16">
      <h1 className="text-[32px] font-semibold leading-tight tracking-tight text-foreground sm:text-[40px]">
        B2B-Forschungsbedingungen
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-muted">
        Rahmenvereinbarung für Forschungskontexte bei {brand.name} — gilt für institutionelle und B2B-Abnehmer
        im Zusammenhang mit RUO-Materialien, soweit nicht schriftlich anders vereinbart.
      </p>

      <ol className="mt-10 list-decimal space-y-4 pl-5 text-[15px] leading-relaxed text-muted">
        <li>
          <strong className="text-foreground">Zielgruppe:</strong> ausschließlich professionelle
          Forschungseinrichtungen und deren bevollmächtigte Einkaufsorganisationen.
        </li>
        <li>
          <strong className="text-foreground">Verwendung:</strong> Produkte sind für{" "}
          <strong className="text-foreground">in-vitro-Laborforschung</strong> und vergleichbare
          technische Arbeiten vorgesehen — nicht zur Anwendung am Menschen oder Tier, nicht diagnostisch,
          nicht therapeutisch, nicht kosmetisch, nicht ernährungs- oder lifestylebezogen.
        </li>
        <li>
          <strong className="text-foreground">Kein Verbrauchervertrieb:</strong> Weiterverkauf an
          Endverbraucher ist untersagt.
        </li>
        <li>
          <strong className="text-foreground">Anfragen:</strong> Ein Angebot entsteht erst nach
          interner Prüfung (<em>Pending Review</em>). Kein automatischer Vertragsschluss über das
          Formular.
        </li>
        <li>
          <strong className="text-foreground">Dokumentation:</strong> CoA/SDS werden nur bereitgestellt,
          soweit fachlich und rechtlich möglich; Spezifikationen können chargenabhängig sein.
        </li>
        <li>
          <strong className="text-foreground">Compliance:</strong> Import-, Export- und
          Dual-Use-Vorschriften liegen in der Verantwortung der bestellenden Organisation, soweit
          anwendbar.
        </li>
      </ol>
    </div>
  );
}
