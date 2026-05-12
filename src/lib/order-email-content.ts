/**
 * Server-only: einheitliche HTML-Inhalte für Bestell-Mails (Kunde + Team).
 *
 * Wird sowohl von `/api/bank-order` (Erstversand) als auch von
 * `/api/admin/orders/[ref]/resend` (Neuversand) verwendet.
 */
import { brand } from "@/lib/brand";
import { escapeHtml } from "@/lib/escape-html";
import { formatIbanGroups } from "@/lib/bank-transfer-config";
import { emailButton, emailValueBox, renderEmail } from "@/lib/mail-template";
import { formatReferenceEur } from "@/lib/reference-price";
import { formatShippingBlockHtml } from "@/lib/shipping-address";
import type { StoredOrder } from "@/lib/order-store";

function lineTableHtml(lines: StoredOrder["lines"]): string {
  const rows = lines
    .map((l) => {
      const unit = formatReferenceEur(l.listPriceEur);
      const sum = formatReferenceEur(l.listPriceEur * l.qty);
      const pack = l.packLabel ? ` (${escapeHtml(l.packLabel)})` : "";
      return `<tr>
        <td style="padding:10px 12px;border-top:1px solid #e5e5ea;">${escapeHtml(l.productName)}${pack}<br/><span style="font-size:12px;color:#666;">${escapeHtml(l.sku)}</span></td>
        <td style="padding:10px 12px;border-top:1px solid #e5e5ea;text-align:right;">${l.qty}</td>
        <td style="padding:10px 12px;border-top:1px solid #e5e5ea;text-align:right;white-space:nowrap;">${escapeHtml(unit)}</td>
        <td style="padding:10px 12px;border-top:1px solid #e5e5ea;text-align:right;white-space:nowrap;">${escapeHtml(sum)}</td>
      </tr>`;
    })
    .join("");

  return `<table style="width:100%;border-collapse:collapse;margin-top:12px;font-size:14px;">
    <thead>
      <tr>
        <th style="text-align:left;padding:10px 12px;border-bottom:1px solid #e5e5ea;">Artikel</th>
        <th style="text-align:right;padding:10px 12px;border-bottom:1px solid #e5e5ea;">Menge</th>
        <th style="text-align:right;padding:10px 12px;border-bottom:1px solid #e5e5ea;">Referenz / Vial</th>
        <th style="text-align:right;padding:10px 12px;border-bottom:1px solid #e5e5ea;">Zeile</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;
}

export type BuildEmailOptions = {
  /** Origin der Webseite, z. B. `http://localhost:43000` oder `https://bavaria-peptides.com`. */
  siteUrl: string;
  /** Zusatzhinweis aus BANK_PAYMENT_NOTE (optional). */
  extraBankNote?: string;
  /** Setzt einen "[Erneut versandt]"-Hinweis oben in die Kunden-Mail. */
  resendMarker?: boolean;
};

export function buildCustomerOrderEmailHtml(order: StoredOrder, opts: BuildEmailOptions): string {
  const totalStr = formatReferenceEur(order.totalEur);
  const successUrl = `${opts.siteUrl}/checkout/erfolg?order=${encodeURIComponent(order.orderRef)}`;
  const ibanDisplay = formatIbanGroups(order.bankSnapshot.iban);

  const valueBoxes = [
    emailValueBox({ label: "Verwendungszweck", value: order.orderRef, mono: true }),
    emailValueBox({ label: "Empfänger", value: order.bankSnapshot.accountHolder }),
    emailValueBox({ label: "IBAN", value: ibanDisplay, mono: true }),
    emailValueBox({ label: "BIC", value: order.bankSnapshot.bic, mono: true }),
    order.bankSnapshot.institution
      ? emailValueBox({ label: "Bank", value: order.bankSnapshot.institution })
      : "",
    emailValueBox({ label: "Betrag (Referenz EUR)", value: totalStr, mono: true }),
  ].join("");

  const ctaButton = emailButton({ href: successUrl, label: "Bestellung online öffnen" });

  const bankBlock = `
    <div style="margin:20px 0 6px;padding:16px 16px 12px;background:#f7f7f9;border-radius:14px;">
      <p style="margin:0 0 4px;font-weight:600;font-size:15px;color:#1a1a1a;">Bankverbindung für die Überweisung</p>
      <p style="margin:0 0 12px;font-size:13px;line-height:1.55;color:#636366;">
        Sie können jeden Wert direkt kopieren. Tippen Sie auf dem Handy lange auf den Wert und wählen Sie "Kopieren". Am Rechner einfach den Wert markieren und Strg C bzw. Cmd C drücken. Über den Button oben kommen Sie zur Bestellseite, dort kopieren Sie jeden Wert mit einem Klick.
      </p>
      ${valueBoxes}
      ${opts.extraBankNote ? `<p style="margin:10px 4px 6px;font-size:12px;color:#636366;">${escapeHtml(opts.extraBankNote)}</p>` : ""}
    </div>
  `;

  const shippingHtml = formatShippingBlockHtml({
    countryCode: "DE",
    bundeslandCode: order.shipping.bundeslandCode,
    streetLine1: order.shipping.streetLine1,
    streetLine2: order.shipping.streetLine2 ?? "",
    postalCode: order.shipping.postalCode,
    city: order.shipping.city,
  });

  const resendBanner = opts.resendMarker
    ? `<p style="margin:0 0 14px;padding:10px 14px;background:#fffbea;border:1px solid #f1e4a4;border-radius:8px;font-size:13px;color:#5a4a00;">Hinweis: Diese E-Mail wurde Ihnen erneut zugesandt (Ursprung: ${escapeHtml(new Date(order.createdAtIso).toLocaleString("de-DE", { timeZone: "Europe/Berlin" }))}).</p>`
    : "";

  const content = `
    ${resendBanner}
    <p class="body-text" style="margin:0 0 14px;">Hallo${order.name ? ` ${escapeHtml(order.name)}` : ""},</p>
    <p class="body-text" style="margin:0 0 14px;">Ihre Bestellung ist bei uns angekommen. Sobald Ihre Zahlung auf unserem Konto eingegangen ist, prüfen wir die Unterlagen und versenden die Ware.</p>
    <p class="body-text" style="margin:0 0 14px;">Wichtig: Bitte verwenden Sie bei der Überweisung genau den unten angegebenen Verwendungszweck. Sonst können wir die Zahlung Ihrer Bestellung nicht zuordnen.</p>
    ${ctaButton}
    ${bankBlock}
    ${shippingHtml}
    ${lineTableHtml(order.lines)}
    <p class="body-text" style="margin:18px 0 0;font-size:16px;"><strong>Summe (Referenz):</strong> ${escapeHtml(totalStr)}</p>
    ${order.promoCode ? `<p style="margin:10px 0 0;font-size:13px;color:#636366;">Vermerkter Rabattcode: <strong>${escapeHtml(order.promoCode)}</strong>. Wir berücksichtigen ihn bei der manuellen Prüfung, sofern er gültig ist.</p>` : ""}
    ${order.note ? `<p style="margin:18px 0 8px;"><strong>Ihre Nachricht an uns:</strong></p><pre style="white-space:pre-wrap;font-family:inherit;background:#fafafa;padding:12px 14px;border-radius:8px;font-size:13px;margin:0;">${escapeHtml(order.note)}</pre>` : ""}
    <p class="body-text" style="margin:22px 0 0;">Bei Fragen einfach auf diese Mail antworten. Viele Grüße,<br/>Ihr Team von ${escapeHtml(brand.name)}</p>
  `;

  return renderEmail({
    preheader: `Ihre Bestellung ${order.orderRef} ist eingegangen. Bankdaten und Verwendungszweck im Anhang.`,
    eyebrow: opts.resendMarker ? "Bestellung erneut zugesandt" : "Bestellung eingegangen",
    contentHtml: content,
  });
}

export function buildTeamOrderEmailHtml(order: StoredOrder): string {
  const totalStr = formatReferenceEur(order.totalEur);
  const ibanDisplay = formatIbanGroups(order.bankSnapshot.iban);

  const shippingHtml = formatShippingBlockHtml({
    countryCode: "DE",
    bundeslandCode: order.shipping.bundeslandCode,
    streetLine1: order.shipping.streetLine1,
    streetLine2: order.shipping.streetLine2 ?? "",
    postalCode: order.shipping.postalCode,
    city: order.shipping.city,
  });

  const bankBlock = `
    <div style="margin:20px 0;padding:16px 18px;background:#f7f7f9;border-radius:12px;font-size:14px;line-height:1.6;">
      <p style="margin:0 0 8px;font-weight:600;font-size:14px;">Bankdaten (für Abgleich)</p>
      <p style="margin:0;"><strong>Empfänger:</strong> ${escapeHtml(order.bankSnapshot.accountHolder)}</p>
      <p style="margin:6px 0 0;"><strong>IBAN:</strong> <span style="font-family:'SFMono-Regular',Consolas,Menlo,monospace;">${escapeHtml(ibanDisplay)}</span></p>
      <p style="margin:6px 0 0;"><strong>BIC:</strong> <span style="font-family:'SFMono-Regular',Consolas,Menlo,monospace;">${escapeHtml(order.bankSnapshot.bic)}</span></p>
      ${order.bankSnapshot.institution ? `<p style="margin:6px 0 0;"><strong>Bank:</strong> ${escapeHtml(order.bankSnapshot.institution)}</p>` : ""}
      <p style="margin:8px 0 0;padding-top:8px;border-top:1px solid #ececf0;"><strong>Verwendungszweck:</strong> <span style="font-family:'SFMono-Regular',Consolas,Menlo,monospace;font-weight:600;">${escapeHtml(order.orderRef)}</span></p>
      <p style="margin:6px 0 0;"><strong>Betrag (Referenz):</strong> ${escapeHtml(totalStr)}</p>
    </div>
  `;

  const content = `
    <h2 class="h1" style="margin:0 0 14px;font-size:18px;">Neue Banküberweisungs-Bestellung</h2>
    <p style="margin:0 0 6px;"><strong>Bestellnummer:</strong> <span style="font-family:'SFMono-Regular',Consolas,Menlo,monospace;">${escapeHtml(order.orderRef)}</span></p>
    <p style="margin:0 0 6px;"><strong>Kunde:</strong> ${escapeHtml(order.name)} &lt;${escapeHtml(order.email)}&gt;</p>
    ${order.company ? `<p style="margin:0 0 6px;"><strong>Firma:</strong> ${escapeHtml(order.company)}</p>` : ""}
    ${shippingHtml}
    <p style="margin:8px 0 0;"><strong>Summe (Referenz):</strong> ${escapeHtml(totalStr)}</p>
    ${order.promoCode ? `<p style="margin:6px 0 0;"><strong>Vermerk / Code:</strong> ${escapeHtml(order.promoCode)}</p>` : ""}
    ${order.note ? `<p style="margin:14px 0 6px;"><strong>Notiz:</strong></p><pre style="white-space:pre-wrap;font-family:inherit;margin:0 0 12px;">${escapeHtml(order.note)}</pre>` : ""}
    <hr style="border:none;border-top:1px solid #ececf0;margin:18px 0;" />
    ${lineTableHtml(order.lines)}
    ${bankBlock}
  `;

  return renderEmail({
    preheader: `${order.orderRef} · ${totalStr} · ${order.email}`,
    eyebrow: "Neue Bestellung",
    contentHtml: content,
  });
}
