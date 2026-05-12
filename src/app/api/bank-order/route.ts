import { NextResponse } from "next/server";
import { brand } from "@/lib/brand";
import { getBankTransferConfig } from "@/lib/bank-transfer-config";
import { cartTotalEur, validateCartForPayment } from "@/lib/checkout-validate";
import { defaultFromAddress, isMailerConfigured, sendMail } from "@/lib/mailer";
import { saveOrder, type StoredOrder } from "@/lib/order-store";
import { formatReferenceEur } from "@/lib/reference-price";
import { DE_BUNDESLAND_OPTIONS, parseShippingAddress } from "@/lib/shipping-address";
import {
  buildCustomerOrderEmailHtml,
  buildTeamOrderEmailHtml,
} from "@/lib/order-email-content";
import { randomBytes } from "node:crypto";

const MAX = { name: 200, company: 200, note: 4000, promo: 64 };

function validEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function clip(s: string, max: number): string {
  const t = s.trim();
  return t.length > max ? t.slice(0, max) : t;
}

function newOrderRef(): string {
  const t = Date.now().toString(36).toUpperCase();
  const r = randomBytes(3).toString("hex").toUpperCase();
  return `BP-${t}-${r}`;
}

export async function POST(req: Request) {
  const bank = getBankTransferConfig();
  if (!bank) {
    return NextResponse.json(
      {
        ok: false as const,
        error:
          "Banküberweisung ist auf dem Server noch nicht konfiguriert (BANK_ACCOUNT_HOLDER, BANK_IBAN).",
      },
      { status: 503 },
    );
  }

  if (!isMailerConfigured()) {
    return NextResponse.json(
      {
        ok: false as const,
        error:
          "E-Mail-Versand ist nicht konfiguriert (SMTP_HOST/SMTP_USER/SMTP_PASS). Ohne automatische Mail können wir die Bestellung leider nicht annehmen. Bitte kontaktieren Sie uns direkt.",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false as const, error: "Ungültige Anfrage." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false as const, error: "Ungültige Anfrage." }, { status: 400 });
  }

  const o = body as Record<string, unknown>;
  const email = clip(String(o.email ?? ""), 320);
  const name = clip(String(o.name ?? ""), MAX.name);
  const company = clip(String(o.company ?? ""), MAX.company);
  const note = clip(String(o.note ?? ""), MAX.note);
  const promoCode = clip(String(o.promoCode ?? ""), MAX.promo);

  if (!email || !validEmail(email)) {
    return NextResponse.json(
      { ok: false as const, error: "Bitte eine gültige E-Mail-Adresse angeben." },
      { status: 400 },
    );
  }

  if (!name || name.length < 2) {
    return NextResponse.json(
      { ok: false as const, error: "Bitte Ihren vollständigen Namen angeben (mindestens 2 Zeichen)." },
      { status: 400 },
    );
  }

  const shippingParsed = parseShippingAddress(o.shipping);
  if (!shippingParsed.ok) {
    return NextResponse.json({ ok: false as const, error: shippingParsed.error }, { status: 400 });
  }
  const shipping = shippingParsed.address;

  const validated = validateCartForPayment(o.lines);
  if (!validated.ok) {
    return NextResponse.json({ ok: false as const, error: validated.error }, { status: 400 });
  }

  const { lines } = validated;
  const total = cartTotalEur(lines);
  const totalStr = formatReferenceEur(total);
  const orderRef = newOrderRef();

  // Erfolgs-URL bevorzugt aus dem Origin/Host der eingehenden Anfrage bauen,
  // damit lokal getestete Mails auf localhost zeigen und Production auf die echte Domain.
  function resolveSiteUrl(): string {
    const origin = req.headers.get("origin")?.trim();
    if (origin) return origin.replace(/\/$/, "");
    const host = req.headers.get("host")?.trim();
    if (host) {
      const proto = process.env.NODE_ENV === "production" ? "https" : "http";
      return `${proto}://${host}`;
    }
    return process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") || brand.origin;
  }
  const siteUrl = resolveSiteUrl();

  const bundeslandLabel =
    DE_BUNDESLAND_OPTIONS.find((b) => b.code === shipping.bundeslandCode)?.label ||
    shipping.bundeslandCode;

  const order: StoredOrder = {
    orderRef,
    createdAtIso: new Date().toISOString(),
    email,
    name,
    company: company || undefined,
    note: note || undefined,
    promoCode: promoCode || undefined,
    shipping: {
      countryCode: "DE",
      bundeslandCode: shipping.bundeslandCode,
      bundeslandLabel,
      streetLine1: shipping.streetLine1,
      streetLine2: shipping.streetLine2 || undefined,
      postalCode: shipping.postalCode,
      city: shipping.city,
    },
    lines: lines.map((l) => ({
      sku: l.sku,
      productSlug: l.productSlug,
      productName: l.productName,
      packLabel: l.packLabel,
      qty: l.qty,
      listPriceEur: l.listPriceEur,
    })),
    totalEur: total,
    bankSnapshot: {
      accountHolder: bank.accountHolder,
      iban: bank.iban,
      bic: bank.bic,
      institution: bank.institution || undefined,
    },
  };

  // Persistente Speicherung — bevor Mails verschickt werden, damit der Online-Link funktioniert.
  try {
    await saveOrder(order);
  } catch (err) {
    console.error("[bank-order] saveOrder fehlgeschlagen:", err);
    // Speichern darf den Mailversand nicht blockieren.
  }

  const customerHtml = buildCustomerOrderEmailHtml(order, {
    siteUrl,
    extraBankNote: bank.extraNote,
  });
  const teamHtml = buildTeamOrderEmailHtml(order);

  const from = defaultFromAddress(brand.name);
  const subjectCustomer = `Ihre Bestellung ${orderRef} bei ${brand.name}`;
  const subjectTeam = `[Bank] ${orderRef} · ${totalStr} · ${email}`;

  const [toCustomer, toTeam] = await Promise.all([
    sendMail({
      from,
      to: [email],
      replyTo: brand.email,
      subject: subjectCustomer,
      html: customerHtml,
    }),
    sendMail({
      from,
      to: [brand.orderNotificationEmail],
      replyTo: email,
      subject: subjectTeam,
      html: teamHtml,
    }),
  ]);

  if (!toCustomer.ok || !toTeam.ok) {
    const parts: string[] = [];
    if (!toCustomer.ok) parts.push(`Kunden-Mail: ${toCustomer.error}`);
    if (!toTeam.ok) parts.push(`Team-Mail: ${toTeam.error}`);
    return NextResponse.json(
      {
        ok: false as const,
        error: `E-Mail-Versand fehlgeschlagen (${parts.join(" · ")}). Bitte prüfen Sie die SMTP-Konfiguration (SMTP_HOST/USER/PASS, ggf. App-Passwort) oder versuchen Sie es später erneut.`,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true as const,
    orderRef,
    redirectTo: `/checkout/erfolg?order=${encodeURIComponent(orderRef)}`,
  });
}
