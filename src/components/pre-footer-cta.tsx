import Link from "next/link";
import { preFooterCta } from "@/lib/institutional-copy";

/** Dezenter, site-weiter Hinweis auf institutionelle Anfrage — Conversion ohne Banner-Lärm. */
export function PreFooterCta() {
  return (
    <aside className="border-t border-hairline bg-surface" aria-labelledby="pre-footer-cta-title">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 page-gutter-x py-8 sm:flex-row sm:items-center sm:justify-between sm:py-9">
        <div className="min-w-0 max-w-xl">
          <h2 id="pre-footer-cta-title" className="text-[17px] font-semibold tracking-tight text-foreground">
            {preFooterCta.title}
          </h2>
          <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{preFooterCta.body}</p>
        </div>
        <Link
          href={preFooterCta.href}
          className="inline-flex shrink-0 touch-manipulation items-center justify-center rounded-full bg-tint px-7 py-3 text-[15px] font-normal text-white transition-opacity hover:opacity-90 motion-safe:active:scale-[0.98] sm:px-8"
        >
          {preFooterCta.label}
        </Link>
      </div>
    </aside>
  );
}
