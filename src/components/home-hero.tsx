import Link from "next/link";
import { brand } from "@/lib/brand";

/**
 * Hero-Assets in `public/images/` (PNG, volle Auflösung):
 * - Desktop (Quer): 5504 × 3072
 * - Mobil (Hoch): 3072 × 5504
 *
 * Bei `output: "export"` + `images.unoptimized` werden die Dateien 1:1 ausgeliefert —
 * die PNGs sind groß (~14 MB je); für Produktion ggf. komprimierte JPG/WebP-Varianten
 * mit gleichen Maßen oder `srcSet` ergänzen.
 */
const HERO_DESKTOP = "/images/hf_20260430_040857_3dcf1809-2544-4cb5-bd73-8e184a4dac95.png";
const HERO_MOBILE = "/images/hf_20260430_040022_14409c43-e7de-489b-875a-61b74ceadd13.png";

const HERO_DESKTOP_W = 5504;
const HERO_DESKTOP_H = 3072;
const HERO_MOBILE_W = 3072;
const HERO_MOBILE_H = 5504;

/** Startseiten-Hero: Fotohintergrund (mobil/desktop), Text im freien Bildbereich. */
export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#ececee]">
      <div className="pointer-events-none absolute inset-0 select-none" aria-hidden>
        <picture>
          <source
            media="(min-width: 768px)"
            type="image/png"
            srcSet={HERO_DESKTOP}
            width={HERO_DESKTOP_W}
            height={HERO_DESKTOP_H}
          />
          <img
            src={HERO_MOBILE}
            alt=""
            width={HERO_MOBILE_W}
            height={HERO_MOBILE_H}
            sizes="100vw"
            className="h-full w-full object-cover object-[50%_38%] md:object-left md:object-center"
            fetchPriority="high"
          />
        </picture>
      </div>

      <div className="relative mx-auto flex min-h-[min(95vh,880px)] max-w-[1200px] flex-col justify-start page-gutter-x pt-16 pb-24 sm:min-h-[min(90vh,820px)] sm:pt-24 sm:pb-28 md:min-h-[min(85vh,760px)] md:justify-center md:py-32 lg:min-h-[720px] lg:py-36">
        <div className="mx-auto max-w-[22rem] text-center sm:max-w-xl md:mx-0 md:max-w-[min(26rem,46%)] md:text-left">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">
            {brand.name}
          </p>

          <h1 className="mt-5 text-balance text-[34px] font-semibold leading-[1.07] tracking-[-0.022em] text-foreground sm:mt-6 sm:text-[44px] sm:leading-[1.05] md:text-[48px] md:leading-[1.04]">
            Forschungskatalog für Institute und Labor
          </h1>

          <p className="mx-auto mt-6 max-w-[19rem] text-[17px] font-normal leading-[1.5] text-muted sm:mt-7 sm:max-w-[26rem] sm:text-[19px] sm:leading-[1.45] md:mx-0">
            Technische Übersicht für professionelle Forschung. Angebote auf Anfrage.
          </p>

          <div className="mx-auto mt-10 flex max-w-xs flex-col gap-3 sm:mt-12 sm:max-w-none sm:flex-row sm:justify-center sm:gap-3 md:mx-0 md:justify-start">
            <Link
              href="/shop"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-tint px-9 text-[17px] font-normal text-white transition-opacity hover:opacity-90 motion-safe:active:scale-[0.98] sm:min-h-11 sm:px-8 sm:text-[16px]"
            >
              Katalog
            </Link>
            <Link
              href="/anfrage"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-fill-secondary px-9 text-[17px] font-normal text-foreground transition-colors hover:bg-fill-secondary-pressed sm:min-h-11 sm:px-8 sm:text-[16px]"
            >
              Anfrage
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
