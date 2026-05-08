/**
 * Kernaussagen zu RUO, Dokumentation und Logistik — ohne Zertifikats-Marketing.
 */
export function TrustStrip() {
  const items = [
    {
      title: "CoA & Chargen",
      text: "Chargebezogene Dokumentation dort bereitstellen, wo Sie sie fachlich und rechtlich absichern.",
    },
    {
      title: "Research Use Only",
      text: "Klare Labor- und Forschungsausrichtung — keine Heilversprechen, keine Verbraucher-Wellness-Sprache.",
    },
    {
      title: "Lagerung & Versand",
      text: "Lyophilisate geschützt verpacken; bei Temperaturempfindlichkeit Kette und Optionen transparent benennen.",
    },
    {
      title: "Sachlicher Support",
      text: "Technische Rückfragen präzise beantworten — weniger Reibung zwischen Einkauf und QA.",
    },
  ];

  return (
    <section className="border-y border-hairline bg-surface">
      <div className="mx-auto max-w-[1200px] page-gutter-x py-8 sm:py-10 md:py-12">
        <h2 className="text-center text-[12px] font-semibold uppercase tracking-[0.14em] text-tint">
          Verlässlichkeit
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-[13px] leading-relaxed text-muted">
          Keine erfundenen Siegel — nur Orientierung, die Sie bei Bedarf belegen können.
        </p>
        <ul className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <li
              key={item.title}
              className="rounded-[18px] border border-hairline bg-surface px-4 py-4"
            >
              <p className="text-[14px] font-semibold tracking-tight text-foreground">{item.title}</p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-muted sm:text-[13px]">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
