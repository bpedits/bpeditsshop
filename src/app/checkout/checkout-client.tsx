"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useCartSnapshot } from "@/hooks/use-cart-snapshot";
import {
  cartReferenceSubtotal,
  clearCart,
  formatCartForInquiry,
  removeCartLine,
  setCartLineQty,
  writePromoCode,
} from "@/lib/cart-storage";
import type { CartLine } from "@/lib/cart-storage";
import { getHomeBestsellers } from "@/lib/bestseller-config";
import { allProducts } from "@/lib/product-catalog";
import type { Product } from "@/lib/product-types";
import { CheckoutRuoDialog } from "@/components/checkout-ruo-dialog";
import { ProductCard } from "@/components/product-card";
import { QuantityStepper } from "@/components/quantity-stepper";
import { formatReferenceEur } from "@/lib/reference-price";
import { DE_BUNDESLAND_OPTIONS, EUROPE_SHIPPING_COUNTRY_OPTIONS, parseShippingAddress } from "@/lib/shipping-address";

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
  const router = useRouter();
  const { lines, count, promoCode } = useCartSnapshot();
  const subtotal = useMemo(() => cartReferenceSubtotal(lines), [lines]);
  const inquiryPreview = useMemo(() => formatCartForInquiry(lines), [lines]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const [hrb, setHrb] = useState("");
  const [note, setNote] = useState("");
  const [countryCode, setCountryCode] = useState("DE");
  const [bundeslandCode, setBundeslandCode] = useState("");
  const [regionOther, setRegionOther] = useState("");
  const [streetLine1, setStreetLine1] = useState("");
  const [streetLine2, setStreetLine2] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [promoDraft, setPromoDraft] = useState("");
  const [promoTouched, setPromoTouched] = useState(false);

  const submitBankOrder = useCallback(async () => {
    setError(null);

    const emailT = email.trim();
    const nameT = `${firstName.trim()} ${lastName.trim()}`.trim();
    const shippingPayload =
      countryCode.trim().toUpperCase() === "DE"
        ? {
            countryCode: "DE" as const,
            bundeslandCode: bundeslandCode.trim(),
            postalCode: postalCode.trim(),
            city: city.trim(),
            streetLine1: streetLine1.trim(),
            streetLine2: streetLine2.trim(),
          }
        : {
            countryCode: countryCode.trim().toUpperCase(),
            region: regionOther.trim(),
            postalCode: postalCode.trim(),
            city: city.trim(),
            streetLine1: streetLine1.trim(),
            streetLine2: streetLine2.trim(),
          };

    if (!emailT || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailT)) {
      setError("Bitte eine gültige E-Mail-Adresse eingeben.");
      return;
    }
    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      setError("Bitte Vor- und Nachname angeben (mindestens je 2 Zeichen).");
      return;
    }
    const shipCheck = parseShippingAddress(shippingPayload);
    if (!shipCheck.ok) {
      setError(shipCheck.error);
      return;
    }

    setBusy(true);
    try {
      const promo = (promoTouched ? promoDraft : promoCode).trim();
      const res = await fetch("/api/bank-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailT,
          name: nameT,
          company: company.trim(),
          taxNumber: taxNumber.trim(),
          hrb: hrb.trim(),
          note: note.trim(),
          promoCode: promo,
          shipping: shippingPayload,
          lines,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        redirectTo?: string;
      };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const to = typeof data.redirectTo === "string" ? data.redirectTo : "/checkout/erfolg";
      writePromoCode("");
      clearCart();
      router.push(to);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bestellung konnte nicht gesendet werden.");
      setBusy(false);
    }
  }, [
    lines,
    email,
    firstName,
    lastName,
    company,
    taxNumber,
    hrb,
    note,
    countryCode,
    bundeslandCode,
    regionOther,
    streetLine1,
    streetLine2,
    postalCode,
    city,
    promoCode,
    promoDraft,
    promoTouched,
    router,
  ]);

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
          Einrichtung. Zahlung per <strong className="font-medium text-foreground">Banküberweisung</strong>; Sie
          erhalten die Bankdaten und Bestellübersicht per E-Mail.
        </p>

        <ul className="mt-6 flex flex-col gap-3 sm:mt-8 sm:gap-3">
          {lines.map((l) => (
            <CartLineRow key={l.sku} line={l} />
          ))}
        </ul>

        <form
          name="checkout"
          method="post"
          action="#"
          autoComplete="on"
          onSubmit={(e) => {
            e.preventDefault();
            if (busy) return;
            void submitBankOrder();
          }}
          className="mt-6 space-y-4 rounded-xl border border-black/[0.07] bg-gradient-to-br from-tint/[0.05] via-white to-surface-pearl/40 px-4 py-4 sm:px-5 sm:py-5"
        >
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
          </div>

          <div className="grid gap-3 border-t border-black/[0.06] pt-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">E-Mail (Pflicht)</span>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                inputMode="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="next"
                required
                aria-required="true"
                className="mt-1.5 h-11 w-full rounded-lg border border-black/[0.12] bg-white px-3 text-[14px] text-foreground outline-none ring-tint focus:ring-2"
                placeholder="name@einrichtung.de"
              />
            </label>
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Vorname (Pflicht)</span>
              <input
                type="text"
                name="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
                autoCapitalize="words"
                enterKeyHint="next"
                required
                aria-required="true"
                className="mt-1.5 h-11 w-full rounded-lg border border-black/[0.12] bg-white px-3 text-[14px] text-foreground outline-none ring-tint focus:ring-2"
                placeholder="Vorname"
              />
            </label>
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Nachname (Pflicht)</span>
              <input
                type="text"
                name="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="family-name"
                autoCapitalize="words"
                enterKeyHint="next"
                required
                aria-required="true"
                className="mt-1.5 h-11 w-full rounded-lg border border-black/[0.12] bg-white px-3 text-[14px] text-foreground outline-none ring-tint focus:ring-2"
                placeholder="Nachname"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Einrichtung / Firma</span>
              <input
                type="text"
                name="organization"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                autoComplete="organization"
                autoCapitalize="words"
                enterKeyHint="next"
                className="mt-1.5 h-11 w-full rounded-lg border border-black/[0.12] bg-white px-3 text-[14px] text-foreground outline-none ring-tint focus:ring-2"
                placeholder="optional"
              />
            </label>
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Steuernummer (optional)</span>
              <input
                type="text"
                name="tax-number"
                value={taxNumber}
                onChange={(e) => setTaxNumber(e.target.value)}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                enterKeyHint="next"
                className="mt-1.5 h-11 w-full rounded-lg border border-black/[0.12] bg-white px-3 text-[14px] text-foreground outline-none ring-tint focus:ring-2"
                placeholder="falls zutreffend"
              />
            </label>
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">HRB (optional)</span>
              <input
                type="text"
                name="hrb"
                value={hrb}
                onChange={(e) => setHrb(e.target.value)}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                enterKeyHint="next"
                className="mt-1.5 h-11 w-full rounded-lg border border-black/[0.12] bg-white px-3 text-[14px] text-foreground outline-none ring-tint focus:ring-2"
                placeholder="Handelsregister, z. B. HRB …"
              />
            </label>
          </div>

          <fieldset className="rounded-xl border border-black/[0.08] bg-white/80 px-3 py-3 sm:px-4 sm:py-4">
            <legend className="px-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-foreground">
              Lieferadresse (Pflicht)
            </legend>
            <p className="mt-1 text-[12px] leading-relaxed text-muted">
              Lieferung in die <strong className="font-medium text-foreground">europäischen Länder</strong>, die in der
              Liste stehen. Bitte Land und vollständige Anschrift angeben — bei Deutschland zusätzlich das Bundesland.
            </p>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Lieferland (Pflicht)</span>
                <select
                  name="shipping-country"
                  value={countryCode}
                  onChange={(e) => {
                    setCountryCode(e.target.value);
                    setBundeslandCode("");
                    setRegionOther("");
                  }}
                  className="mt-1.5 h-11 w-full rounded-lg border border-black/[0.12] bg-white px-3 text-[14px] text-foreground outline-none ring-tint focus:ring-2"
                  autoComplete="shipping country"
                  required
                  aria-required="true"
                >
                  {EUROPE_SHIPPING_COUNTRY_OPTIONS.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
              {countryCode === "DE" ? (
                <label className="block sm:col-span-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                    Bundesland (Pflicht)
                  </span>
                  <select
                    name="address-level1"
                    value={bundeslandCode}
                    onChange={(e) => setBundeslandCode(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-lg border border-black/[0.12] bg-white px-3 text-[14px] text-foreground outline-none ring-tint focus:ring-2"
                    autoComplete="shipping address-level1"
                    required
                    aria-required="true"
                  >
                    <option value="">Bitte wählen …</option>
                    {DE_BUNDESLAND_OPTIONS.map((b) => (
                      <option key={b.code} value={b.code}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <label className="block sm:col-span-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                    Region / Kanton / Provinz (optional)
                  </span>
                  <input
                    type="text"
                    name="shipping-region"
                    value={regionOther}
                    onChange={(e) => setRegionOther(e.target.value)}
                    autoComplete="shipping address-level1"
                    autoCapitalize="words"
                    enterKeyHint="next"
                    className="mt-1.5 h-11 w-full rounded-lg border border-black/[0.12] bg-white px-3 text-[14px] text-foreground outline-none ring-tint focus:ring-2"
                    placeholder="falls auf dem Paket nötig"
                  />
                </label>
              )}
              <label className="block sm:col-span-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Straße, Hausnummer</span>
                <input
                  type="text"
                  name="address-line1"
                  value={streetLine1}
                  onChange={(e) => setStreetLine1(e.target.value)}
                  autoComplete="shipping address-line1"
                  autoCapitalize="words"
                  enterKeyHint="next"
                  required
                  aria-required="true"
                  className="mt-1.5 h-11 w-full rounded-lg border border-black/[0.12] bg-white px-3 text-[14px] text-foreground outline-none ring-tint focus:ring-2"
                  placeholder="z. B. Musterstraße 12"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                  Adresszusatz (optional)
                </span>
                <input
                  type="text"
                  name="address-line2"
                  value={streetLine2}
                  onChange={(e) => setStreetLine2(e.target.value)}
                  autoComplete="shipping address-line2"
                  autoCapitalize="words"
                  enterKeyHint="next"
                  className="mt-1.5 h-11 w-full rounded-lg border border-black/[0.12] bg-white px-3 text-[14px] text-foreground outline-none ring-tint focus:ring-2"
                  placeholder="Etage, Gebäude, Abteilung …"
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                  {countryCode === "DE" ? "PLZ" : "PLZ / Postcode"}
                </span>
                <input
                  type="text"
                  name="postal-code"
                  value={postalCode}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (countryCode === "DE") {
                      setPostalCode(v.replace(/\D/g, "").slice(0, 5));
                    } else {
                      setPostalCode(v.replace(/[^A-Za-z0-9\s\-]/g, "").slice(0, 16));
                    }
                  }}
                  autoComplete="shipping postal-code"
                  inputMode={countryCode === "DE" ? "numeric" : "text"}
                  pattern={countryCode === "DE" ? "[0-9]{5}" : undefined}
                  maxLength={countryCode === "DE" ? 5 : 16}
                  enterKeyHint="next"
                  required
                  aria-required="true"
                  className="mt-1.5 h-11 w-full rounded-lg border border-black/[0.12] bg-white px-3 text-[14px] text-foreground outline-none ring-tint focus:ring-2"
                  placeholder={countryCode === "DE" ? "z. B. 85055" : "z. B. 1010, SW1A 1AA"}
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Ort</span>
                <input
                  type="text"
                  name="address-level2"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  autoComplete="shipping address-level2"
                  autoCapitalize="words"
                  enterKeyHint="next"
                  required
                  aria-required="true"
                  className="mt-1.5 h-11 w-full rounded-lg border border-black/[0.12] bg-white px-3 text-[14px] text-foreground outline-none ring-tint focus:ring-2"
                  placeholder="z. B. Ingolstadt"
                />
              </label>
            </div>
          </fieldset>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Nachricht (optional)</span>
              <textarea
                name="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                autoComplete="off"
                className="mt-1.5 w-full resize-y rounded-lg border border-black/[0.12] bg-white px-3 py-2 text-[14px] text-foreground outline-none ring-tint focus:ring-2"
                placeholder="Lieferhinweise, interne Bestellnummer, …"
              />
            </label>
          </div>

          <div className="rounded-xl border border-black/[0.08] bg-white px-3 py-2">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              Rabattcode / Vermerk (optional)
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                name="promo-code"
                value={promoTouched ? promoDraft : promoCode}
                onChange={(e) => {
                  setPromoTouched(true);
                  setPromoDraft(e.target.value);
                }}
                placeholder="wird in der E-Mail mitgeschickt"
                className="h-10 w-full rounded-lg border border-black/[0.12] bg-white px-3 text-[14px] text-foreground outline-none ring-tint placeholder:text-muted focus:ring-2"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
              />
              <button
                type="button"
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-black/[0.06] px-3 text-[13px] font-medium text-foreground transition hover:bg-black/[0.09]"
                onClick={() => {
                  const v = (promoTouched ? promoDraft : promoCode).trim();
                  writePromoCode(v);
                  setPromoDraft(v);
                  setPromoTouched(true);
                }}
              >
                Merken
              </button>
            </div>
            {promoCode ? (
              <p className="mt-2 text-[12px] text-muted">
                Aktiv: <span className="font-mono font-semibold text-foreground">{promoCode}</span>
                <button
                  type="button"
                  className="ml-2 rounded-md px-2 py-1 text-[12px] font-medium text-tint hover:underline"
                  onClick={() => {
                    writePromoCode("");
                    setPromoDraft("");
                    setPromoTouched(false);
                  }}
                >
                  Entfernen
                </button>
              </p>
            ) : (
              <p className="mt-2 text-[12px] text-muted">Wird bei der manuellen Prüfung berücksichtigt, sofern gültig.</p>
            )}
          </div>

          {error ? (
            <p
              className="rounded-lg border border-[#b00020]/20 bg-[#b00020]/[0.06] px-3 py-2 text-[13px] text-[#7a0000]"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <p className="flex items-start gap-2 rounded-lg bg-black/[0.03] px-3 py-2 text-[12px] leading-relaxed text-muted">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 size-3.5 shrink-0 text-foreground/70"
              aria-hidden="true"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
            <span>
              Die Bestätigung kommt direkt per E-Mail an die oben angegebene Adresse. Sollte sie nicht im{" "}
              <strong className="font-medium text-foreground">Posteingang</strong> auftauchen, schauen Sie bitte einmal
              in den <strong className="font-medium text-foreground">Spam-/Junk-Ordner</strong> — gerade bei
              Erstkontakten landet sie dort manchmal.
            </span>
          </p>

          <button
            type="submit"
            disabled={busy}
            className="inline-flex min-h-11 w-full touch-manipulation items-center justify-center rounded-full bg-tint px-6 text-[14px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(0,102,204,0.35)] transition hover:opacity-92 disabled:opacity-50"
          >
            {busy ? "Wird gesendet …" : "Bestellung per Banküberweisung absenden"}
          </button>

          <Link
            href="/anfrage?checkout=1"
            className="inline-flex min-h-10 w-full touch-manipulation items-center justify-center rounded-full border border-black/[0.12] bg-white px-6 text-[13px] font-medium text-foreground transition hover:bg-black/[0.03]"
          >
            Stattdessen nur Anfrage
          </Link>

          <p className="text-[11px] leading-relaxed text-muted">
            Positionen und Summen werden <strong className="font-medium text-foreground">serverseitig</strong> mit dem
            Katalog abgeglichen. Mit Absenden bestätigen Sie erneut, dass Sie{" "}
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
        </form>

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
