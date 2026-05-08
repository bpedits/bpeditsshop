import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { footerLegal } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Rechtliches",
  description: `Alle rechtlichen Informationen und Service-Seiten von ${brand.name} im Überblick.`,
};

export default function LegalHubPage() {
  return (
    <div className="mx-auto max-w-3xl page-gutter-x py-10 sm:py-14 md:py-16">
      <h1 className="text-[26px] font-semibold leading-tight tracking-tight text-foreground sm:text-[32px] md:text-[40px]">
        Rechtliches
      </h1>
      <p className="mt-4 text-[14px] leading-relaxed text-muted sm:text-[15px]">
        Zentrale Übersicht der rechtlichen und serviceorientierten Seiten für {brand.name}.
      </p>
      <ul className="mt-10 divide-y divide-black/[0.06] rounded-[22px] border border-black/[0.06] bg-white">
        {footerLegal.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex min-h-12 items-center justify-between gap-4 px-4 py-3.5 text-[15px] font-medium text-foreground transition hover:bg-surface sm:px-5 sm:py-3"
            >
              {item.label}
              <span className="text-muted" aria-hidden>
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
