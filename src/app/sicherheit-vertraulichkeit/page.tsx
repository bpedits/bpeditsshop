import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Sicherheit & Vertraulichkeit",
  description: `TLS, Datenminimierung und vertrauliche Abwicklung bei ${brand.name}.`,
};

export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-3xl page-gutter-x py-10 sm:py-14 md:py-16">
      <h1 className="text-[32px] font-semibold leading-tight tracking-tight text-foreground sm:text-[40px]">
        Sicherheit &amp; Vertraulichkeit
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-muted">
        Diese Seite beschreibt unser Sicherheits- und Vertraulichkeitsverständnis für den Betrieb von{" "}
        {brand.domainDisplay}. Konkrete technische Maßnahmen dokumentieren Sie intern (TOM) und in
        Ihrem Verzeichnis von Verarbeitungstätigkeiten.
      </p>

      <h2 className="mt-10 text-[20px] font-semibold text-foreground">Transportverschlüsselung</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">
        Die Website soll ausschließlich über <strong className="text-foreground">HTTPS</strong>{" "}
        ausgeliefert werden. Zertifikat und Serverkonfiguration sind beim Hosting-Anbieter zu
        pflegen und regelmäßig zu prüfen.
      </p>

      <h2 className="mt-10 text-[20px] font-semibold text-foreground">Datenminimierung</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">
        Wir erheben nur die Daten, die für Vertrag, Versand und gesetzliche Pflichten nötig sind.
        Marketingprofile und unnötige Tracking-Pixel sollten nur nach Einwilligung erfolgen.
      </p>

      <h2 className="mt-10 text-[20px] font-semibold text-foreground">Vertraulichkeit von Anfragen</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">
        Geschäftliche Anfragen und Bestellungen behandeln wir vertraulich. Eine{" "}
        <strong className="text-foreground">Geheimhaltungsvereinbarung (NDA)</strong> kann für
        B2B-Projekte separat vereinbart werden.
      </p>

      <h2 className="mt-10 text-[20px] font-semibold text-foreground">Meldekanal</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">
        Für sicherheitsrelevante Hinweise erreichen Sie uns unter{" "}
        <a href={`mailto:${brand.email}`} className="font-medium text-tint hover:underline">
          {brand.email}
        </a>
        . Bitte nutzen Sie — wo möglich — verschlüsselte Kommunikation.
      </p>

      <p className="mt-10 text-[15px] text-muted">
        <Link href="/datenschutz" className="font-medium text-tint hover:underline">
          Zur Datenschutzerklärung
        </Link>
        {" · "}
        <Link href="/kontakt" className="font-medium text-tint hover:underline">
          Kontakt
        </Link>
      </p>
    </div>
  );
}
