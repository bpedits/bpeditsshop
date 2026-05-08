import { institutionalPillars } from "@/lib/institutional-copy";

/** Startseite: drei sachliche Stützen — Vertrauen ohne Schnörkel. */
export function InstitutionalPillars() {
  return (
    <section className="border-b border-hairline bg-background">
      <div className="mx-auto max-w-[1200px] page-gutter-x py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-tint">Institutioneller Rahmen</p>
          <h2 className="mt-2 text-[22px] font-semibold tracking-tight text-foreground sm:text-[26px]">
            Seriös einkaufen — ohne Schnellkauf-Druck
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            Für Forschungseinrichtungen und Laborbetriebe, die klare Prozesse erwarten.
          </p>
        </div>
        <ul className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-5">
          {institutionalPillars.map((item) => (
            <li
              key={item.title}
              className="rounded-[18px] border border-hairline bg-surface px-5 py-5 sm:px-6 sm:py-6"
            >
              <p className="text-[15px] font-semibold tracking-tight text-foreground">{item.title}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
