import Link from "next/link";
import { CookieSettingsLink } from "@/components/cookie-settings-link";
import { SiteFooterDisclaimers } from "@/components/site-footer-disclaimers";
import { brand } from "@/lib/brand";
import { footerLegal, footerService } from "@/lib/navigation";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-hairline bg-canvas-parchment">
      <div className="mx-auto max-w-[1200px] page-gutter-x py-10 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className="text-[15px] font-semibold tracking-tight text-foreground">{brand.legalName}</p>
            <p className="mt-2 text-[14px] leading-relaxed text-foreground">
              Forschungsmaterialien (RUO) für Institute und Unternehmen mit Laborbetrieb. Öffentlicher
              Katalog mit technischen Daten — Angebote ausschließlich nach institutioneller Prüfung.
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-muted">
              Verbindliche Anbieterangaben siehe Impressum. Bei inhaltlichen Rückfragen zu Rechtstexten
              kontaktieren Sie uns unter der angegebenen E-Mail.
            </p>
            <p className="mt-3 text-[12px] text-muted">
              <a href={brand.origin} className="text-tint hover:underline">
                {brand.origin}
              </a>
              <br />
              <a href={`mailto:${brand.email}`} className="text-tint hover:underline">
                {brand.email}
              </a>
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Service</p>
            <nav className="mt-3 flex flex-col gap-2" aria-label="Service">
              {footerService.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[13px] text-muted transition hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="sm:col-span-2 lg:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Rechtliches</p>
            <nav className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Rechtliches">
              <Link href="/rechtliches" className="text-[13px] font-medium text-foreground hover:underline">
                Übersicht Rechtliches
              </Link>
              <CookieSettingsLink className="text-[13px] font-medium text-tint hover:underline" />
              {footerLegal.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[13px] text-muted transition hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <SiteFooterDisclaimers />

        <p className="mt-12 border-t border-hairline pt-8 text-[11px] leading-relaxed text-muted">
          © {new Date().getFullYear()} {brand.name} · B2B-Forschungskatalog (RUO) ·{" "}
          <span className="text-ink-muted-48">Nur für professionelle Forschung — nicht zur Anwendung am Menschen oder Tier.</span>
        </p>
      </div>
    </footer>
  );
}
