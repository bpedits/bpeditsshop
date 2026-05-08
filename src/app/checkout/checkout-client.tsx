"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { useCartSnapshot } from "@/hooks/use-cart-snapshot";
import {
  cartReferenceSubtotal,
  formatCartForInquiry,
  removeCartLine,
  setCartLineQty,
} from "@/lib/cart-storage";
import type { CartLine } from "@/lib/cart-storage";
import { getHomeBestsellers } from "@/lib/bestseller-config";
import { allProducts } from "@/lib/product-catalog";
import type { Product } from "@/lib/product-types";
import { CheckoutRuoDialog } from "@/components/checkout-ruo-dialog";
import { ProductCard } from "@/components/product-card";
import { QuantityStepper } from "@/components/quantity-stepper";
import { formatReferenceEur } from "@/lib/reference-price";

function productTouchesCartSkus(product: Product, cartSkus: Set<string>): boolean {
  return product.variants.some((v) => cartSkus.has(v.sku.toUpperCase()));
}

/** Bis zu `max` Produkte: Bestseller zuerst, dann Katalog — ohne SKUs, die schon im Warenkorb sind. */
function recommendationsForCart(lines: CartLine[], max = 4): Product[] {
  const inCart = new Set(lines.map((l) => l.sku.toUpperCase()));
  const fromBests = getHomeBestsellers(allProducts).filter((p) => !productTouchesCartSkus(p, inCart));
  const out: Product[] = [...fromBests];
  const seen = new Set(out.map((p) => p.id));
  for (const p of allProducts) {
    if (out.length >= max) break;
    if (seen.has(p.id)) continue;
    if (productTouchesCartSkus(p, inCart)) continue;
    out.push(p);
    seen.add(p.id);
  }
  return out.slice(0, max);
}

function AlsoInteresting({ lines }: { lines: CartLine[] }) {
  const picks = useMemo(() => recommendationsForCart(lines, 8), [lines]);
  if (picks.length === 0) return null;
  return (
    <section
      className="mt-10 w-full border-t border-black/[0.06] pt-10 sm:mt-14 sm:pt-16"
      aria-labelledby="checkout-also-heading"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <h2
          id="checkout-also-heading"
          className="text-[22px] font-semibold tracking-tight text-foreground sm:text-[26px]"
        >
          Das könnte auch interessant sein
        </h2>
        <p className="text-[14px] text-muted sm:max-w-md sm:text-right">
          Wie auf der Startseite — häufig angefragte Referenzartikel; Dosierungen und Details auf der Produktseite.
        </p>
      </div>
      <ul className="mt-6 grid grid-cols-2 gap-4 sm:mt-8 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {picks.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
      <Link
        href="/shop"
        className="mt-8 inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full bg-fill-secondary px-6 text-[14px] font-medium text-foreground transition-colors hover:bg-fill-secondary-pressed"
      >
        Zum gesamten Katalog
      </Link>
    </section>
  );
}

function CartLineRow({ line }: { line: CartLine }) {
  const lineTotal = line.listPriceEur * line.qty;
  return (
    <li className="rounded-xl border border-black/[0.08] bg-white px-3 py-3 shadow-sm transition hover:border-black/[0.12] sm:px-4 sm:py-3.5">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1">
          <Link
            href={`/shop/${line.productSlug}`}
            className="text-[15px] font-semibold leading-snug tracking-tight text-foreground transition-colors hover:text-tint sm:text-[16px]"
          >
            {line.productName}
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center rounded-md bg-black/[0.04] px-1.5 py-0.5 font-mono text-[10px] font-medium tabular-nums text-muted sm:text-[11px]">
              {line.sku}
            </span>
            {line.packLabel ? (
              <span className="text-[11px] font-medium uppercase tracking-[0.05em] text-muted">{line.packLabel}</span>
            ) : null}
          </div>
          <p className="mt-1 text-[12px] tabular-nums text-muted">
            {formatReferenceEur(line.listPriceEur)}
            <span className="mx-1 text-black/25">·</span>
            Referenz / Vial
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.06] pt-2.5 sm:w-auto sm:shrink-0 sm:flex-nowrap sm:border-t-0 sm:pt-0">
          <QuantityStepper
            variant="cart"
            qty={line.qty}
            onQty={(n) => setCartLineQty(line.sku, n)}
            ariaLabel={`Menge für ${line.productName}, ${line.sku}`}
          />
          <p className="min-w-[4.25rem] text-right text-[15px] font-semibold tabular-nums text-foreground sm:min-w-[5rem] sm:text-[16px]">
            {formatReferenceEur(lineTotal)}
          </p>
          <button
            type="button"
            onClick={() => removeCartLine(line.sku)}
            className="touch-manipulation rounded-lg px-2 py-1 text-[12px] font-medium text-muted transition hover:bg-black/[0.05] hover:text-foreground"
          >
            Entfernen
          </button>
        </div>
      </div>
    </li>
  );
}

export function CheckoutClient() {
  const { lines, count } = useCartSnapshot();
  const subtotal = useMemo(() => cartReferenceSubtotal(lines), [lines]);
  const inquiryPreview = useMemo(() => formatCartForInquiry(lines), [lines]);
  const [payBusy, setPayBusy] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const startStripeCheckout = useCallback(async () => {
    setPayBusy(true);
    setPayError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines }),
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      if (!data.url) {
        throw new Error("Keine Checkout-URL erhalten.");
      }
      window.location.href = data.url;
    } catch (e) {
      setPayError(e instanceof Error ? e.message : "Zahlung konnte nicht gestartet werden.");
      setPayBusy(false);
    }
  }, [lines]);

  if (lines.length === 0) {
    return (
      <>
        <CheckoutRuoDialog />
        <div className="mx-auto max-w-md rounded-[24px] border border-black/[0.06] bg-gradient-to-b from-white to-surface-pearl/60 px-6 py-14 text-center shadow-[0_8px_40px_-28px_rgba(0,0,0,0.12)] sm:px-10">
          <p className="text-[18px] font-semibold tracking-tight text-foreground">Ihr Warenkorb ist leer</p>
          <p className="mt-3 text-[14px] leading-relaxed text-muted">
            Artikel im Katalog mit „In den Warenkorb“ hinzufügen — oder direkt eine{" "}
            <Link href="/anfrage" className="font-medium text-tint hover:underline">
              Anfrage
            </Link>{" "}
            stellen.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex min-h-12 touch-manipulation items-center justify-center rounded-full bg-tint px-10 text-[15px] font-semibold text-white shadow-[0_8px_28px_-8px_rgba(0,102,204,0.4)] transition hover:opacity-92"
          >
            Zum Katalog
          </Link>
        </div>
        <AlsoInteresting lines={[]} />
      </>
    );
  }

  return (
    <>
      <CheckoutRuoDialog />
      <div className="mx-auto max-w-[720px]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Checkout</p>
        <h1 className="mt-2 text-[24px] font-semibold tracking-tight text-foreground sm:text-[28px]">Warenkorb</h1>
        <p className="mt-3 max-w-[34rem] text-[14px] leading-relaxed text-muted sm:text-[15px]">
          Referenzpreise (EUR / Vial) zur Orientierung — verbindliche Konditionen und Verfügbarkeit nach Prüfung Ihrer
          Einrichtung.
        </p>

        <ul className="mt-6 flex flex-col gap-3 sm:mt-8 sm:gap-3">
          {lines.map((l) => (
            <CartLineRow key={l.sku} line={l} />
          ))}
        </ul>

        <div className="mt-6 space-y-4 rounded-xl border border-black/[0.07] bg-gradient-to-br from-tint/[0.05] via-white to-surface-pearl/40 px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                {count} {count === 1 ? "Position" : "Positionen"}
              </p>
              <p className="mt-0.5 text-[10px] text-muted">Summe (Katalog · EUR)</p>
              <p className="mt-0.5 text-[22px] font-semibold tabular-nums tracking-tight text-foreground sm:text-[24px]">
                {formatReferenceEur(subtotal)}
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[220px]">
              <button
                type="button"
                disabled={payBusy}
                onClick={() => void startStripeCheckout()}
                className="inline-flex min-h-11 w-full touch-manipulation items-center justify-center rounded-full bg-[#635bff] px-6 text-[14px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(99,91,255,0.45)] transition hover:opacity-92 disabled:opacity-50"
              >
                {payBusy ? "Weiterleitung …" : "Mit Stripe bezahlen"}
              </button>
              <Link
                href="/anfrage?checkout=1"
                className="inline-flex min-h-10 w-full touch-manipulation items-center justify-center rounded-full border border-black/[0.12] bg-white px-6 text-[13px] font-medium text-foreground transition hover:bg-black/[0.03]"
              >
                Stattdessen nur Anfrage
              </Link>
            </div>
          </div>
          {payError ? (
            <p className="rounded-lg border border-[#b00020]/20 bg-[#b00020]/[0.06] px-3 py-2 text-[13px] text-[#7a0000]" role="alert">
              {payError}
            </p>
          ) : null}
          <p className="text-[11px] leading-relaxed text-muted">
            Zahlung über <strong className="font-medium text-foreground">Stripe Checkout</strong> (Karte u. a.). Preise
            werden serverseitig mit dem Katalog abgeglichen. Mit Fortfahren bestätigen Sie erneut, dass Sie{" "}
            <strong className="font-medium text-foreground">nicht</strong> als Verbraucher handeln und Materialien{" "}
            <strong className="font-medium text-foreground">ausschließlich für professionelle Labor-/in-vitro-Forschung</strong>{" "}
            in einer geeigneten Einrichtung einsetzen —{" "}
            <strong className="font-medium text-foreground">ohne</strong> Anwendung am Menschen/Tier und{" "}
            <strong className="font-medium text-foreground">ohne</strong> Wellness-, Kosmetik- oder
            Selbstversuchs-Irrtümer. RUO/B2B-Prüfung und Versand bleiben unabhängig von der Zahlung — siehe{" "}
            <Link href="/forschungsbedingungen-b2b" className="font-medium text-tint hover:underline">
              Forschungsbedingungen
            </Link>
            .
          </p>
        </div>

        {inquiryPreview ? (
          <details className="mt-6 rounded-xl border border-black/[0.06] bg-white px-3 py-2.5 shadow-sm sm:px-4 sm:py-3">
            <summary className="cursor-pointer text-[13px] font-medium text-foreground">
              Vorschau für das Anfrageformular
            </summary>
            <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-black/[0.03] p-2.5 font-sans text-[11px] leading-relaxed text-muted">
              {inquiryPreview}
            </pre>
          </details>
        ) : null}
      </div>
      <AlsoInteresting lines={lines} />
    </>
  );
}
