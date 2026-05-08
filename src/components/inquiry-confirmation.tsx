"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { brand } from "@/lib/brand";
import { FormSuccessCelebration } from "@/components/form-success-celebration";

export function InquiryConfirmation() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref")?.trim() || "";

  return (
    <div className="rounded-[22px] border border-black/[0.07] bg-white px-6 py-8 shadow-[0_12px_44px_-24px_rgba(0,0,0,0.12)] sm:px-10 sm:py-10">
      <FormSuccessCelebration
        eyebrow="Pending Review"
        title="Ihre Anfrage ist eingegangen"
        detail={
          ref ? (
            <p className="font-mono text-[13px] text-muted">
              Referenz{" "}
              <span className="rounded-lg bg-black/[0.04] px-2 py-1 text-foreground">{ref}</span>
            </p>
          ) : null
        }
      >
        <p>
          Wir prüfen institutionelle Anfragen vor dem nächsten Schritt. Bei Rückfragen nutzen wir Ihre{" "}
          <strong className="font-medium text-foreground">geschäftliche E-Mail</strong>.
        </p>
        <p className="rounded-xl border border-tint/15 bg-tint/[0.05] px-3.5 py-3 text-[13px]">
          Wenn der Server für Transaktions-Mail eingerichtet ist, erhalten Sie zusätzlich eine{" "}
          <strong className="font-medium text-foreground">kurze Bestätigung</strong> in Ihr Postfach (bitte Spam-Ordner
          prüfen). Unabhängig davon bleibt diese Seite Ihre Eingangsbestätigung.
        </p>
        <p className="text-[13px]">
          <span className="font-medium text-foreground">Hinweis:</span> Es erfolgt kein automatischer Verkauf und keine
          automatische Rechnung auf dieser Domain.
        </p>
      </FormSuccessCelebration>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
        <Link
          href="/shop"
          className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full bg-tint px-7 text-[14px] font-semibold text-white shadow-[0_8px_28px_-10px_rgba(0,102,204,0.45)] transition hover:opacity-92 motion-safe:active:scale-[0.98] motion-reduce:active:scale-100"
        >
          Zum Katalog
        </Link>
        <Link
          href="/kontakt"
          className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full border border-black/[0.12] bg-fill-secondary px-7 text-[14px] font-medium text-foreground transition-colors hover:bg-fill-secondary-pressed"
        >
          Kontakt
        </Link>
      </div>

      <p className="mt-10 text-center text-[12px] text-muted">
        {brand.name} · {brand.email}
      </p>
    </div>
  );
}
