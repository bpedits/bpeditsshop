import Link from "next/link";
import { brand } from "@/lib/brand";
import { headerNav } from "@/lib/navigation";
import { LogoPlaceholder } from "@/components/logo-placeholder";
import { HeaderCartLink } from "@/components/header-cart-link";
import { HeaderSearch } from "@/components/header-search";
import { SiteHeaderMobileNav } from "@/components/site-header-mobile";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.08] bg-surface/80 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-surface/65">
      <div className="mx-auto flex min-h-[52px] max-w-[1200px] items-center gap-1.5 py-1.5 page-gutter-x sm:min-h-14 sm:gap-3 md:gap-4">
        <div className="min-w-0 shrink">
          <Link href="/" className="flex min-w-0 items-center" aria-label={`Zur Startseite – ${brand.name}`}>
            <LogoPlaceholder />
          </Link>
        </div>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-0 overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] md:flex md:gap-0.5 [&::-webkit-scrollbar]:hidden"
          aria-label="Hauptnavigation"
        >
          {headerNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 shrink-0 touch-manipulation items-center justify-center rounded-full px-2 text-[12px] font-normal text-muted transition hover:bg-black/[0.04] hover:text-foreground lg:px-2.5 lg:text-[13px]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mx-1 hidden min-w-0 max-w-[200px] shrink-0 md:mx-2 md:block md:max-w-[220px] xl:max-w-[260px]">
          <HeaderSearch />
        </div>

        <div className="min-w-0 flex-1 md:hidden" aria-hidden />

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <HeaderCartLink />
          <div className="md:hidden">
            <SiteHeaderMobileNav items={headerNav} />
          </div>
        </div>

        <div className="shrink-0">
          <Link
            href="/anfrage"
            className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full bg-tint px-3 text-[12px] font-semibold text-white transition hover:opacity-92 motion-safe:active:scale-[0.98] sm:min-h-11 sm:px-5 sm:text-sm"
          >
            <span className="sm:hidden">Anfrage</span>
            <span className="hidden sm:inline">Institutionelle Anfrage</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
