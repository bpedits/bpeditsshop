import { brand } from "@/lib/brand";

/** Kurzer Transparenz-Hinweis auf Rechtsseiten (kein Vorlagen-Disclaimer). */
export function LegalDisclaimer() {
  return (
    <aside className="mb-8 rounded-[18px] border border-black/[0.08] bg-black/[0.03] p-4 text-[13px] leading-relaxed text-muted sm:p-5">
      <strong className="font-medium text-foreground">Stand:</strong>{" "}
      {new Date().toLocaleDateString("de-DE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}{" "}
      · {brand.name}. Soweit sich gesetzliche oder fachliche Rahmen ändern, passen wir diese Darstellung an.
    </aside>
  );
}
