type Props = {
  title: string;
  /** Optional: Anker für Verlinkung innerhalb der Seite */
  id?: string;
  children: React.ReactNode;
};

/**
 * Hervorgehobener Abschnitt auf Rechtsseiten (heller Kasten auf hellem Grund).
 */
export function LegalSectionCard({ title, id, children }: Props) {
  const headingId = id ? `${id}-heading` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="rounded-xl border border-black/[0.08] bg-white p-4 text-[14px] leading-relaxed text-muted shadow-sm sm:p-5"
    >
      <h3 id={headingId} className="!mt-0 text-[14px] font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      <div className="mt-3 space-y-3 [&_strong]:font-medium [&_strong]:text-foreground">{children}</div>
    </section>
  );
}
