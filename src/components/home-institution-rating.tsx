"use client";

/**
 * Vertrauensanzeige — keine Verbraucherbewertungsplattform; mit Rechtsberatung / Nachweis ersetzen, falls Sie echte Daten zeigen.
 */
const RATING = 4.7;
const MAX = 5;

function StarRow() {
  return (
    <div className="flex items-center gap-0.5 text-amber-500" aria-hidden>
      {Array.from({ length: MAX }, (_, i) => (
        <svg key={i} className="size-[18px] drop-shadow-sm sm:size-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.7L12 16.9 6.8 19.4l1-5.7-4.2-4.1 5.8-.8L12 3.5z" />
        </svg>
      ))}
    </div>
  );
}

export function HomeInstitutionRating() {
  return (
    <section
      className="border-y border-black/[0.05] bg-gradient-to-b from-white via-surface-pearl/25 to-canvas-parchment/80"
      aria-labelledby="home-rating-heading"
    >
      <div className="mx-auto max-w-[1200px] page-gutter-x py-8 sm:py-10 md:py-12">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center motion-safe:animate-[bp-fade-up_0.65s_ease-out_both]">
          <span className="sr-only">
            Bewertung {RATING} von {MAX} Sternen, institutionelles Feedback
          </span>
          <p id="home-rating-heading" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            Institutionelles Feedback
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <StarRow />
            <p className="text-[28px] font-semibold tabular-nums tracking-tight text-foreground sm:text-[32px]">
              {RATING.toFixed(1)}
              <span className="ml-1.5 text-[15px] font-medium text-muted sm:text-[16px]">/ {MAX}</span>
            </p>
          </div>
          <p className="mt-3 max-w-md text-[14px] leading-relaxed text-muted sm:text-[15px]">
            Aggregierte Zufriedenheit aus <strong className="font-medium text-foreground">Einkauf &amp; Labor</strong>{" "}
            institutioneller Partner — nicht vergleichbar mit Endverbraucher-Shopbewertungen.
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-muted">
            Illustrative Darstellung — bitte durch verifizierbare Kennzahlen oder zertifizierte Umfragen ersetzen, wenn
            live.
          </p>
        </div>
      </div>
    </section>
  );
}
