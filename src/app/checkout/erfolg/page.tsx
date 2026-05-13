import Link from "next/link";
import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { formatIbanGroups, getBankTransferConfig } from "@/lib/bank-transfer-config";
import { CopyField } from "@/components/copy-field";
import { readOrder } from "@/lib/order-store";
import { formatReferenceEur } from "@/lib/reference-price";
import { buildPublicPageMetadata } from "@/lib/seo-page-meta";

export const metadata: Metadata = buildPublicPageMetadata({
  path: "/checkout/erfolg",
  title: "Bestellung eingegangen",
  description: `${brand.name}: Bestellung eingegangen — Banküberweisung, Verwendungszweck und nächste Schritte.`,
  keywords: ["Bestellbestätigung", "Banküberweisung"],
  robots: { index: false, follow: false },
});

// Diese Seite spiegelt eine konkrete (gespeicherte) Bestellung — niemals statisch cachen.
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ order?: string }> };

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("de-DE", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Europe/Berlin",
    });
  } catch {
    return iso;
  }
}

export default async function CheckoutErfolgPage({ searchParams }: Props) {
  const sp = await searchParams;
  const orderRef = sp.order?.trim() || null;
  const order = orderRef ? await readOrder(orderRef) : null;

  // Bank-Snapshot der Bestellung verwenden, wenn vorhanden — sonst aktuelle ENV-Bankdaten.
  const liveBank = getBankTransferConfig();
  const bank = order?.bankSnapshot
    ? {
        accountHolder: order.bankSnapshot.accountHolder,
        iban: order.bankSnapshot.iban,
        bic: order.bankSnapshot.bic,
        institution: order.bankSnapshot.institution,
      }
    : liveBank
      ? {
          accountHolder: liveBank.accountHolder,
          iban: liveBank.iban,
          bic: liveBank.bic,
          institution: liveBank.institution,
        }
      : null;

  return (
    <div className="mx-auto max-w-2xl page-gutter-x py-12 sm:py-16 md:py-20">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-tint/10 text-tint">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-tint">Bestellung eingegangen</p>
      <h1 className="mt-2 text-[26px] font-semibold tracking-tight text-foreground sm:text-[30px]">
        Ihre Bestellung ist bei uns angekommen
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-muted">
        Sie haben gleich eine E-Mail mit der Übersicht und den Bankdaten in Ihrem Postfach. Sollte sie nicht im
        Posteingang erscheinen, schauen Sie bitte auch im Spam-Ordner nach. Sobald die Zahlung bei uns eingegangen
        ist, prüfen wir die Unterlagen und versenden die Ware.
      </p>

      {orderRef ? (
        <div className="mt-6">
          <CopyField
            label="Verwendungszweck (Bestellnummer)"
            display={orderRef}
            mono
            variant="prominent"
            ariaLabel="Bestellnummer kopieren"
          />
          {order ? (
            <p className="mt-2 px-1 text-[12px] text-muted">
              Eingegangen am {formatDate(order.createdAtIso)}.
            </p>
          ) : null}
        </div>
      ) : null}

      {orderRef && bank ? (
        <div className="mt-4 rounded-xl border border-black/[0.08] bg-white p-3 shadow-sm sm:p-4">
          <p className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-foreground">
            Bankdaten — tippen zum Kopieren
          </p>
          <div className="grid gap-2">
            <CopyField
              label="Empfänger"
              display={bank.accountHolder}
              ariaLabel="Empfänger kopieren"
            />
            <CopyField
              label="IBAN"
              display={formatIbanGroups(bank.iban)}
              copyValue={bank.iban.replace(/\s+/g, "")}
              mono
              ariaLabel="IBAN kopieren"
            />
            <CopyField
              label="BIC"
              display={bank.bic}
              mono
              ariaLabel="BIC kopieren"
            />
            {bank.institution ? (
              <CopyField
                label="Bank"
                display={bank.institution}
                ariaLabel="Bank-Name kopieren"
              />
            ) : null}
            {order ? (
              <CopyField
                label="Betrag"
                display={`${formatReferenceEur(order.totalEur)}`}
                copyValue={order.totalEur.toFixed(2)}
                mono
                ariaLabel="Betrag kopieren"
              />
            ) : null}
          </div>
        </div>
      ) : null}

      {order ? (
        <>
          <section className="mt-8 rounded-xl border border-black/[0.08] bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-[14px] font-semibold tracking-tight text-foreground">Bestellte Artikel</h2>
            <ul className="mt-3 divide-y divide-black/[0.06]">
              {order.lines.map((l) => (
                <li key={l.sku} className="flex items-start justify-between gap-3 py-3 text-[14px]">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">
                      {l.productName}
                      {l.packLabel ? <span className="text-muted"> · {l.packLabel}</span> : null}
                    </p>
                    <p className="mt-0.5 text-[12px] text-muted">SKU {l.sku}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-foreground">
                      {l.qty} × {formatReferenceEur(l.listPriceEur)}
                    </p>
                    <p className="mt-0.5 text-[12px] text-muted">{formatReferenceEur(l.listPriceEur * l.qty)}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between border-t border-black/[0.08] pt-3 text-[14px]">
              <span className="font-semibold text-foreground">Gesamt</span>
              <span className="font-semibold text-foreground">{formatReferenceEur(order.totalEur)}</span>
            </div>
            {order.promoCode ? (
              <p className="mt-2 text-[12px] text-muted">Rabattcode hinterlegt: {order.promoCode}</p>
            ) : null}
          </section>

          <section className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-black/[0.08] bg-white p-4 text-[13px] leading-relaxed shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-foreground">Kontakt</p>
              <p className="mt-2 font-medium text-foreground">{order.name}</p>
              {order.company ? <p className="text-muted">{order.company}</p> : null}
              {order.taxNumber ? <p className="text-muted">Steuernummer: {order.taxNumber}</p> : null}
              {order.hrb ? <p className="text-muted">HRB: {order.hrb}</p> : null}
              <p className="text-muted">{order.email}</p>
            </div>
            <div className="rounded-xl border border-black/[0.08] bg-white p-4 text-[13px] leading-relaxed shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-foreground">
                Lieferadresse
              </p>
              <p className="mt-2 text-foreground">{order.shipping.streetLine1}</p>
              {order.shipping.streetLine2 ? (
                <p className="text-muted">{order.shipping.streetLine2}</p>
              ) : null}
              <p className="text-muted">
                {order.shipping.postalCode} {order.shipping.city}
              </p>
              <p className="text-muted">
                {order.shipping.countryCode === "DE"
                  ? `${order.shipping.bundeslandLabel} · ${order.shipping.countryLabel}`
                  : order.shipping.bundeslandLabel
                    ? `${order.shipping.bundeslandLabel} · ${order.shipping.countryLabel}`
                    : order.shipping.countryLabel}
              </p>
            </div>
          </section>

          {order.note ? (
            <section className="mt-4 rounded-xl border border-black/[0.08] bg-white p-4 text-[13px] leading-relaxed shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-foreground">Ihre Notiz</p>
              <p className="mt-2 whitespace-pre-wrap text-muted">{order.note}</p>
            </section>
          ) : null}
        </>
      ) : orderRef ? (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-[13px] text-amber-900">
          Wir können zu dieser Bestellnummer keine Detailansicht anzeigen — vermutlich ist der Link auf einem anderen
          Server entstanden oder die Daten sind nicht mehr verfügbar. Die Bankdaten oben gelten unverändert. Falls
          etwas unklar ist, schreiben Sie uns gerne unter{" "}
          <a href={`mailto:${brand.email}`} className="font-medium underline">
            {brand.email}
          </a>
          .
        </div>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex min-h-12 touch-manipulation items-center justify-center rounded-full bg-tint px-7 text-[15px] font-semibold text-white shadow-[0_8px_28px_-8px_rgba(0,102,204,0.4)] transition hover:opacity-92"
        >
          Zurück zur Website
        </Link>
        <Link
          href="/shop"
          className="inline-flex min-h-12 touch-manipulation items-center justify-center rounded-full border border-black/[0.12] bg-white px-7 text-[14px] font-medium text-foreground transition hover:bg-black/[0.03]"
        >
          Weiter im Katalog stöbern
        </Link>
      </div>
      <p className="mt-10 text-[12px] leading-relaxed text-muted">
        {brand.name}: Research-Use-Only (RUO), nur professionelle Forschung — siehe{" "}
        <Link href="/forschungsbedingungen-b2b" className="font-medium text-tint hover:underline">
          B2B-Forschungsbedingungen
        </Link>
        .
      </p>
    </div>
  );
}
