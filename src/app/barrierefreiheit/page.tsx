import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { LegalProse } from "@/components/legal-prose";
import { LegalDisclaimer } from "@/components/legal-disclaimer";
import { buildPublicPageMetadata } from "@/lib/seo-page-meta";

export const metadata: Metadata = buildPublicPageMetadata({
  path: "/barrierefreiheit",
  title: "Barrierefreiheit",
  description: `Barrierefreiheitserklärung für ${brand.domainDisplay}: WCAG/BITV-Orientierung, Feedback-Kanal und geplante Verbesserungen.`,
  keywords: ["Barrierefreiheit", "WCAG", "BITV", "Zugänglichkeit Website"],
  category: "legal",
});

export default function AccessibilityPage() {
  return (
    <LegalProse title="Erklärung zur Barrierefreiheit">
      <LegalDisclaimer />
      <p>
        {brand.legalName} bemüht sich, die Website unter {brand.domainDisplay} nach den für uns
        einschlägigen Barrierefreiheits-Anforderungen (u.&nbsp;a. BITV&nbsp;2.0 / WCAG&nbsp;2.1, soweit
        anwendbar) möglichst zugänglich zu gestalten.
      </p>
      <h2>Stand der Vereinbarkeit mit den Anforderungen</h2>
      <p>
        Aufgrund der aktuellen Entwicklungsphase kann die Website teilweise noch nicht vollständig
        barrierefrei sein. Geplante Maßnahmen: Kontraste, Fokuszustände, Tastaturbedienbarkeit,
        semantische Überschriften und Alternativtexte für Bilder.
      </p>
      <h2>Kontakt bei Barrieren</h2>
      <p>
        Wenn Sie Barrieren feststellen, schreiben Sie uns bitte an{" "}
        <a href={`mailto:${brand.email}`}>{brand.email}</a>. Wir prüfen Ihr Feedback und
        priorisieren technische Nachbesserungen.
      </p>
      <h2>Schlichtungsverfahren</h2>
      <p>
        Soweit hierfür eine zuständige Einrichtung existiert oder künftig benannt wird, verweisen wir in
        einer Aktualisierung dieser Erklärung auf Kontaktdaten und Verfahrenswege.
      </p>
      <p>
        <Link href="/kontakt">Zur Kontaktseite</Link>
      </p>
    </LegalProse>
  );
}
