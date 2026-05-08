import Link from "next/link";
import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { SuccessRedirect } from "./success-redirect";

export const metadata: Metadata = {
  title: "Zahlung bestätigt",
  description: `${brand.name}: Stripe-Checkout abgeschlossen.`,
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ session_id?: string }> };

export default async function CheckoutErfolgPage({ searchParams }: Props) {
  const sp = await searchParams;
  const sessionId = sp.session_id;

  return (
    <div className="mx-auto max-w-lg page-gutter-x py-12 sm:py-16 md:py-20">
      <SuccessRedirect to="/" afterMs={2500} />
      <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-tint">Checkout</p>
      <h1 className="mt-2 text-[24px] font-semibold tracking-tight text-foreground sm:text-[28px]">
        Zahlung eingeleitet
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-muted">
        Vielen Dank — Stripe hat die Zahlung angenommen. Rückfragen zu Lieferung und Dokumentation laufen wie gewohnt
        über Ihre hinterlegten Kontaktdaten und unsere B2B-Prozesse.
      </p>
      {sessionId ? (
        <p className="mt-4 break-all rounded-lg border border-black/[0.08] bg-surface px-3 py-2 font-mono text-[11px] text-muted">
          Session-ID: {sessionId}
        </p>
      ) : null}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full bg-tint px-6 text-[14px] font-semibold text-white transition hover:opacity-92"
        >
          Zur Startseite
        </Link>
        <Link
          href="/anfrage"
          className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full border border-black/[0.12] bg-white px-6 text-[14px] font-medium text-foreground transition hover:bg-black/[0.03]"
        >
          Anfrage / Lieferung
        </Link>
      </div>
      <p className="mt-8 text-[12px] leading-relaxed text-muted">
        {brand.name}: Research-Use-Only (RUO), nur professionelle Forschung — siehe{" "}
        <Link href="/forschungsbedingungen-b2b" className="font-medium text-tint hover:underline">
          B2B-Forschungsbedingungen
        </Link>
        .
      </p>
    </div>
  );
}
