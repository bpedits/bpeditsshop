import type { ReactNode } from "react";
import Link from "next/link";

export type InstitutionalNavItem = { readonly href: string; readonly label: string };

const motionHero =
  "motion-safe:animate-[bp-fade-up_0.55s_ease-out_both] motion-reduce:animate-none";

/** Abschnittskarten für lange Informationsseiten (B2B / RUO). */
export function InstitutionalSectionCard({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <article
      id={id}
      className="scroll-mt-28 rounded-2xl border border-black/[0.07] bg-white px-5 py-6 shadow-[0_4px_28px_-18px_rgba(0,0,0,0.1)] motion-safe:transition-shadow motion-safe:duration-300 hover:shadow-[0_8px_36px_-20px_rgba(0,0,0,0.12)] sm:px-6 sm:py-7"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-tint">{eyebrow}</p>
      <h2 className="mt-2 text-[20px] font-semibold tracking-tight text-foreground sm:text-[22px]">{title}</h2>
      <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-muted sm:text-[15px]">{children}</div>
    </article>
  );
}

/** Hero + zweispaltiges Raster mit Sticky-TOC (Desktop) und Pill-Navigation (Mobil). */
export function InstitutionalHubLayout({
  eyebrow,
  title,
  lede,
  chips,
  navItems,
  navAriaLabel,
  asideNavAriaLabel,
  children,
  asideFooter,
}: {
  eyebrow: string;
  title: string;
  lede: ReactNode;
  chips?: readonly string[];
  navItems: readonly InstitutionalNavItem[];
  navAriaLabel: string;
  asideNavAriaLabel: string;
  children: ReactNode;
  /** Sticky-Spalte: zusätzliche Karten unter der TOC */
  asideFooter?: ReactNode;
}) {
  return (
    <div className="border-b border-black/[0.05] bg-gradient-to-b from-surface via-canvas-parchment/35 to-canvas-parchment">
      <div className="mx-auto max-w-[1200px] page-gutter-x pb-16 pt-10 sm:pb-20 sm:pt-14 md:pb-24 md:pt-16">
        <header className={`max-w-3xl ${motionHero}`}>
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-tint">{eyebrow}</p>
          <h1 className="mt-2 text-[clamp(1.75rem,4.5vw,2.75rem)] font-semibold leading-[1.08] tracking-tight text-foreground">
            {title}
          </h1>
          <div className="mt-4 text-[16px] leading-relaxed text-muted sm:text-[17px]">{lede}</div>
          {chips && chips.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Schwerpunkte">
              {chips.map((label) => (
                <li
                  key={label}
                  className="rounded-full border border-black/[0.08] bg-white/90 px-3 py-1.5 text-[12px] font-medium text-foreground shadow-sm motion-safe:transition-transform motion-safe:duration-200 hover:-translate-y-px motion-reduce:hover:translate-y-0"
                >
                  {label}
                </li>
              ))}
            </ul>
          ) : null}
        </header>

        <div
          className={`relative isolate mt-10 overflow-hidden rounded-[22px] border border-black/[0.06] bg-gradient-to-br from-tint/[0.12] via-surface-pearl/80 to-white shadow-[0_12px_40px_-24px_rgba(0,0,0,0.12)] sm:mt-12 ${motionHero}`}
          aria-hidden
        >
          <div className="pointer-events-none absolute -right-20 -top-24 size-[280px] rounded-full bg-tint/[0.08] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 size-[220px] rounded-full bg-surface-pearl blur-2xl" />
          <div className="relative px-5 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12">
            <p className="max-w-xl text-[14px] leading-relaxed text-muted sm:text-[15px]">
              Strukturierte Orientierung für <strong className="font-medium text-foreground">Einkauf, QA und Betrieb</strong>
              — mit klarer Trennung zwischen kommuniziertem Rahmen und vertraglich festgelegten Konditionen.
            </p>
          </div>
        </div>

        <nav className="mt-8 lg:hidden" aria-label={navAriaLabel}>
          <ul className="-mx-1 flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {navItems.map((item) => (
              <li key={item.href} className="shrink-0">
                <a
                  href={item.href}
                  className="inline-flex min-h-10 touch-manipulation items-center rounded-full border border-black/[0.1] bg-white px-3.5 py-2 text-[12px] font-medium text-foreground shadow-sm transition hover:border-tint/30"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 lg:mt-12 lg:grid lg:grid-cols-[minmax(0,1fr)_200px] lg:items-start lg:gap-12 xl:grid-cols-[minmax(0,1fr)_220px] xl:gap-16">
          <div className="min-w-0 space-y-8 lg:space-y-10">{children}</div>

          <aside className="mt-10 hidden lg:mt-0 lg:block">
            <div className="sticky top-28 space-y-5">
              <nav
                className="rounded-2xl border border-black/[0.07] bg-white/95 p-4 shadow-sm backdrop-blur-sm"
                aria-label={asideNavAriaLabel}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Auf dieser Seite</p>
                <ul className="mt-3 max-h-[min(70vh,520px)] space-y-1 overflow-y-auto overscroll-y-contain border-t border-black/[0.06] pt-3 [-ms-overflow-style:none] [scrollbar-width:thin]">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className="block rounded-lg px-2 py-1.5 text-[13px] text-muted transition hover:bg-black/[0.04] hover:text-foreground"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              {asideFooter}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export function InstitutionalCtaBar({
  text,
  primary,
  secondary,
}: {
  text: ReactNode;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-black/[0.08] bg-canvas-parchment/80 px-5 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6">
      <p className="text-[14px] leading-relaxed text-muted">{text}</p>
      <div className="flex flex-wrap gap-2 sm:justify-end">
        <Link
          href={primary.href}
          className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full bg-tint px-5 text-[14px] font-semibold text-white transition hover:opacity-92"
        >
          {primary.label}
        </Link>
        {secondary ? (
          <Link
            href={secondary.href}
            className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full border border-black/[0.12] bg-white px-5 text-[14px] font-medium text-foreground transition hover:bg-black/[0.03]"
          >
            {secondary.label}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
