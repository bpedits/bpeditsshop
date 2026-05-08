import Link from "next/link";

const steps = [
  {
    step: "01",
    title: "Spezifikation",
    text: "Reinheit, Darreichungsform und RUO‑Kontext sauber beschrieben.",
    Icon: IconSpec,
    staggerClass: "lg:translate-y-0",
  },
  {
    step: "02",
    title: "Dokumentation",
    text: "CoA & Chargendaten dort, wo ihr sie fachlich und rechtlich absichern.",
    Icon: IconDoc,
    staggerClass: "lg:translate-y-6",
  },
  {
    step: "03",
    title: "Lagerung",
    text: "Kühl, trocken, lichtgeschützt — stabile Ketten dokumentieren.",
    Icon: IconStorage,
    staggerClass: "lg:translate-y-2",
  },
  {
    step: "04",
    title: "Versand",
    text: "Schützende Verpackung, Tracking; Rückfragen schnell und sachlich.",
    Icon: IconShip,
    staggerClass: "lg:translate-y-8",
  },
] as const;

function IconSpec({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 4h11v14a2 2 0 0 1-2 2H8V4ZM6 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v16Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path d="M11 9h5M11 13h5M11 17h4" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}

function IconDoc({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 3h9l3 3v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path d="M15 3v4h4M9 12h8M9 16h8" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}

function IconStorage({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 16V8l7-4 7 4v8l-7 4-7-4Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path d="M12 22V12M5 16l7 4 7-4" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
      <circle cx="12" cy="8.5" r="1.1" fill="currentColor" />
    </svg>
  );
}

function IconShip({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 8h13l2 10H6L4 8Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path d="M6 18h-.5a2 2 0 1 1 4 0H12M17 13h4l-2 9H6" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
      <path d="M17 8V5h-8M7 22h13" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}

function FlowRibbon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 800 120" fill="none" aria-hidden preserveAspectRatio="none">
      <path
        d="M40 72 C 200 20, 400 120, 600 64 S 720 48, 760 56"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        className="text-primary/18"
      />
      <path
        d="M40 78 C 210 28, 410 126, 610 70 S 725 54, 760 62"
        stroke="url(#bp-quality-chain-ribbon)"
        strokeWidth="0.75"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        opacity="0.9"
      />
      <defs>
        <linearGradient id="bp-quality-chain-ribbon" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
          <stop offset="45%" stopColor="var(--primary)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function QualityChainSection() {
  return (
    <section className="relative overflow-hidden border-y border-black/[0.06] bg-gradient-to-b from-canvas-parchment via-surface-pearl/40 to-surface">
      <div
        className="pointer-events-none absolute -left-1/4 top-0 h-[min(70vw,520px)] w-[min(90vw,720px)] rounded-full bg-primary/[0.055] blur-3xl motion-reduce:opacity-40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-1/5 bottom-0 h-[min(55vw,420px)] w-[min(75vw,560px)] rounded-full bg-primary/[0.04] blur-3xl motion-reduce:opacity-40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] motion-reduce:opacity-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.045) 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-[1200px] page-gutter-x py-14 sm:py-16 md:py-20">
        <div className="flex flex-col gap-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-16 xl:gap-20">
          <header className="relative lg:col-span-4 lg:sticky lg:top-28 lg:self-start motion-safe:bp-reveal">
            <div className="absolute -left-6 -top-4 hidden font-mono text-[clamp(5rem,14vw,9rem)] font-bold leading-none tracking-tighter text-foreground/[0.04] select-none sm:block lg:-left-4 lg:-top-6">
              01→04
            </div>
            <p className="relative flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-muted">
              <span
                className="inline-flex size-1.5 rounded-full bg-tint motion-safe:animate-pulse"
                aria-hidden
              />
              Ablauf
            </p>
            <h2 className="relative mt-3 text-[clamp(1.65rem,4.2vw,2.35rem)] font-semibold leading-[1.08] tracking-tight text-foreground">
              <span className="block">Von Spezifikation</span>
              <span className="mt-1 block bg-gradient-to-r from-tint via-primary-focus to-tint bg-clip-text text-transparent">
                bis Lieferung
              </span>
            </h2>
            <p className="relative mt-5 max-w-sm text-[16px] leading-relaxed text-muted sm:text-[15px]">
              Ein roter Faden für Einkauf und QA — weniger Rückfragen, klarere Erwartungen, eine Kette, die man
              erklären kann.
            </p>
            <div className="relative mt-8 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <Link
                href="/qualitaet-labor"
                className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full bg-tint px-6 text-[14px] font-semibold text-white shadow-[0_8px_28px_-8px_rgba(0,102,204,0.55)] transition hover:opacity-92 motion-safe:active:scale-[0.98] motion-safe:hover:-translate-y-0.5 motion-safe:duration-200"
              >
                Qualität & Labor
              </Link>
              <Link
                href="/anfrage"
                className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full border border-black/[0.08] bg-surface/80 px-6 text-[14px] font-medium text-foreground backdrop-blur-sm transition-colors hover:border-tint/25 hover:bg-surface motion-safe:hover:-translate-y-0.5 motion-safe:duration-200"
              >
                Anfragen
              </Link>
            </div>
          </header>

          <div className="lg:col-span-8">
            {/* Mobil & Tablet */}
            <ol className="relative lg:hidden" aria-label="Ablauf in vier Schritten">
              <div
                className="absolute bottom-10 left-[19px] top-10 w-px bg-gradient-to-b from-transparent via-tint/25 to-transparent"
                aria-hidden
              />
              {steps.map((s, i) => (
                <li
                  key={s.step}
                  className="group relative flex gap-4 pb-11 last:pb-0 motion-safe:bp-reveal"
                  style={{ animationDelay: `${80 + i * 70}ms` }}
                >
                  <div className="relative z-10 flex shrink-0 flex-col items-center">
                    <span className="relative flex size-11 items-center justify-center rounded-2xl bg-surface shadow-[0_4px_24px_-8px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.07] motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105">
                      <span
                        className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-tint/12 via-transparent to-transparent opacity-80 motion-safe:transition-opacity motion-safe:group-hover:opacity-100"
                        aria-hidden
                      />
                      <s.Icon className="relative size-5 text-tint" />
                    </span>
                  </div>
                  <article className="min-w-0 flex-1 rounded-[22px] border border-black/[0.07] bg-surface/95 p-5 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.14)] backdrop-blur-sm motion-safe:transition-[box-shadow,transform] motion-safe:duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:shadow-[0_20px_48px_-28px_rgba(0,102,204,0.18)]">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-[17px] font-semibold tracking-tight text-foreground">{s.title}</h3>
                      <span className="shrink-0 rounded-md bg-tint/[0.08] px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-tint">
                        {s.step}
                      </span>
                    </div>
                    <p className="mt-2 border-l-2 border-tint/25 pl-3 text-[14px] leading-relaxed text-muted">
                      {s.text}
                    </p>
                  </article>
                </li>
              ))}
            </ol>

            {/* Desktop */}
            <div className="relative hidden lg:block">
              <FlowRibbon className="pointer-events-none absolute -top-2 left-0 right-0 h-24 w-full text-inherit" />
              <ol className="relative grid grid-cols-4 gap-5 pt-4" aria-label="Ablauf in vier Schritten">
                {steps.map((s, i) => (
                  <li
                    key={`d-${s.step}`}
                    className={`group relative flex flex-col motion-safe:bp-reveal motion-safe:transition-transform motion-safe:duration-500 ${s.staggerClass}`}
                    style={{ animationDelay: `${120 + i * 90}ms` }}
                  >
                    <div className="relative z-10 mx-auto mb-5 flex size-[3.75rem] items-center justify-center">
                      <span
                        className="absolute inset-0 rounded-[1.35rem] bg-gradient-to-br from-tint/20 via-primary-focus/10 to-transparent opacity-90 blur-md motion-safe:transition-opacity motion-safe:duration-300 motion-safe:group-hover:opacity-100"
                        aria-hidden
                      />
                      <span className="relative flex size-[3.75rem] rotate-3 items-center justify-center rounded-[1.25rem] bg-gradient-to-b from-surface to-surface-pearl shadow-[0_8px_28px_-10px_rgba(0,0,0,0.18)] ring-1 ring-black/[0.08] motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:rotate-0 motion-safe:group-hover:scale-[1.04]">
                        <s.Icon className="size-6 text-tint" />
                      </span>
                    </div>
                    <div className="rounded-[1.35rem] bg-gradient-to-br from-tint/14 via-transparent to-primary/10 p-px shadow-[0_1px_0_rgba(255,255,255,0.65)_inset] motion-safe:transition-shadow motion-safe:duration-300 motion-safe:group-hover:shadow-[0_12px_40px_-18px_rgba(0,102,204,0.22)]">
                      <article className="flex h-full min-h-[11.5rem] flex-col rounded-[1.28rem] bg-surface/95 px-4 pb-5 pt-5 text-center backdrop-blur-sm">
                        <span className="mx-auto inline-flex rounded-full border border-tint/15 bg-tint/[0.07] px-2.5 py-0.5 font-mono text-[10px] font-semibold tabular-nums tracking-[0.12em] text-tint">
                          {s.step}
                        </span>
                        <h3 className="mt-3 text-[16px] font-semibold tracking-tight text-foreground">{s.title}</h3>
                        <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted">{s.text}</p>
                      </article>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
