import { NextResponse } from "next/server";
import { brand } from "@/lib/brand";
import { getStripe } from "@/lib/stripe-server";
import {
  defaultFromAddress,
  escapeHtml,
  isResendConfigured,
  sendResendEmail,
} from "@/lib/resend-send";

function formatMoneyEurFromCents(amount: number | null | undefined): string {
  if (typeof amount !== "number" || !Number.isFinite(amount)) return "—";
  const eur = amount / 100;
  return eur.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
}

function lineRows(items: Array<{ name: string; qty: number; unit?: number | null; total?: number | null }>) {
  const rows = items
    .map((l) => {
      const qty = l.qty > 0 ? l.qty : 1;
      const unit = formatMoneyEurFromCents(l.unit);
      const total = formatMoneyEurFromCents(l.total);
      return `<tr>
        <td style="padding:10px 12px;border-top:1px solid #e5e5ea;">${escapeHtml(l.name)}</td>
        <td style="padding:10px 12px;border-top:1px solid #e5e5ea;text-align:right;white-space:nowrap;">${qty}</td>
        <td style="padding:10px 12px;border-top:1px solid #e5e5ea;text-align:right;white-space:nowrap;">${unit}</td>
        <td style="padding:10px 12px;border-top:1px solid #e5e5ea;text-align:right;white-space:nowrap;">${total}</td>
      </tr>`;
    })
    .join("");

  return `<table style="width:100%;border-collapse:collapse;margin-top:14px;">
    <thead>
      <tr>
        <th style="text-align:left;padding:10px 12px;border-bottom:1px solid #e5e5ea;">Artikel</th>
        <th style="text-align:right;padding:10px 12px;border-bottom:1px solid #e5e5ea;">Menge</th>
        <th style="text-align:right;padding:10px 12px;border-bottom:1px solid #e5e5ea;">Einzel</th>
        <th style="text-align:right;padding:10px 12px;border-bottom:1px solid #e5e5ea;">Summe</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function addressBlock(a?: {
  line1?: string | null;
  line2?: string | null;
  postal_code?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
} | null): string {
  if (!a) return "—";
  const lines = [a.line1, a.line2, [a.postal_code, a.city].filter(Boolean).join(" "), a.state, a.country]
    .filter((x) => Boolean(x && String(x).trim()))
    .map((x) => escapeHtml(String(x)));
  return lines.length ? lines.join("<br/>") : "—";
}

export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ ok: false, error: "Stripe nicht konfiguriert." }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!sig || !whSecret) {
    return NextResponse.json(
      { ok: false, error: "Webhook nicht konfiguriert (STRIPE_WEBHOOK_SECRET / stripe-signature)." },
      { status: 400 },
    );
  }

  const body = await req.text();

  let event: import("stripe").Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, whSecret);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const session = event.data.object as import("stripe").Stripe.Checkout.Session;

  const full = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ["line_items.data.price.product", "payment_intent"],
  });

  const customerEmail = full.customer_details?.email ?? full.customer_email ?? null;
  if (!customerEmail) {
    return NextResponse.json({ ok: true, sent: false, reason: "missing_email" });
  }

  if (!isResendConfigured()) {
    return NextResponse.json({ ok: true, sent: false, reason: "resend_not_configured" });
  }

  const from = defaultFromAddress(brand.name);
  const orderNo = full.id;
  const customerName = full.customer_details?.name ?? "";
  const phone = full.customer_details?.phone ?? "";
  const billing = addressBlock(full.customer_details?.address ?? null);
  const total = formatMoneyEurFromCents(full.amount_total);

  const items =
    full.line_items?.data?.map((li) => ({
      name: li.description || "Artikel",
      qty: li.quantity ?? 1,
      unit: li.price?.unit_amount ?? null,
      total: typeof li.amount_total === "number" ? li.amount_total : null,
    })) ?? [];

  const itemsHtml = items.length ? lineRows(items) : "";

  const customerHtml = `
    <div style="font-family:system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.5;color:#111;">
      <p>Hallo${customerName ? ` ${escapeHtml(customerName)}` : ""},</p>
      <p>vielen Dank für Ihre Bestellung bei <strong>${escapeHtml(brand.name)}</strong>.</p>
      <p style="margin:16px 0;padding:12px 14px;background:#f5f5f7;border-radius:12px;">
        <strong>Bestellreferenz:</strong> ${escapeHtml(orderNo)}<br/>
        <strong>Gesamt:</strong> ${escapeHtml(total)}
      </p>
      ${itemsHtml}
      <h3 style="margin:18px 0 8px;font-size:14px;">Rechnungsdaten</h3>
      <p style="margin:0;color:#333;">${billing}</p>
      ${phone ? `<p style="margin:8px 0 0;color:#333;"><strong>Telefon:</strong> ${escapeHtml(phone)}</p>` : ""}
      <p style="margin-top:22px;font-size:13px;color:#636366;">
        ${escapeHtml(brand.legalName)} · <a href="${escapeHtml(brand.origin)}">${escapeHtml(brand.domainDisplay)}</a>
      </p>
    </div>
  `;

  const teamHtml = `
    <div style="font-family:system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.5;color:#111;">
      <h2 style="margin:0 0 12px;font-size:16px;">Neue bezahlte Bestellung</h2>
      <p><strong>Ref:</strong> ${escapeHtml(orderNo)}</p>
      <p><strong>E-Mail:</strong> ${escapeHtml(customerEmail)}</p>
      ${customerName ? `<p><strong>Name:</strong> ${escapeHtml(customerName)}</p>` : ""}
      ${phone ? `<p><strong>Telefon:</strong> ${escapeHtml(phone)}</p>` : ""}
      <p><strong>Gesamt:</strong> ${escapeHtml(total)}</p>
      <h3 style="margin:16px 0 8px;font-size:14px;">Rechnungsadresse</h3>
      <p style="margin:0;">${billing}</p>
      ${itemsHtml}
    </div>
  `;

  const [toCustomer, toTeam] = await Promise.all([
    sendResendEmail({
      from,
      to: [customerEmail],
      replyTo: brand.email,
      subject: `Bestellbestätigung — ${brand.name}`,
      html: customerHtml,
    }),
    sendResendEmail({
      from,
      to: [brand.contactFormInboxEmail],
      replyTo: brand.email,
      subject: `[Bestellung] ${orderNo} · ${customerEmail} · ${total}`,
      html: teamHtml,
    }),
  ]);

  return NextResponse.json({ ok: true, sent: toCustomer && toTeam });
}

