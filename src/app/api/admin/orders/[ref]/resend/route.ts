import { NextResponse } from "next/server";
import { brand } from "@/lib/brand";
import { getBankTransferConfig } from "@/lib/bank-transfer-config";
import { clientIpFromHeaders } from "@/lib/admin-auth";
import { getAdminContext } from "@/lib/admin-session";
import { appendAudit } from "@/lib/admin-store";
import { defaultFromAddress, isMailerConfigured, sendMail } from "@/lib/mailer";
import { readOrder } from "@/lib/order-store";
import { buildCustomerOrderEmailHtml } from "@/lib/order-email-content";

export async function POST(req: Request, ctx: { params: Promise<{ ref: string }> }) {
  const admin = await getAdminContext();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Nicht angemeldet." }, { status: 401 });
  }

  if (!isMailerConfigured()) {
    return NextResponse.json(
      { ok: false, error: "SMTP ist nicht konfiguriert." },
      { status: 503 },
    );
  }

  const { ref } = await ctx.params;
  const orderRef = decodeURIComponent(ref || "");
  const order = await readOrder(orderRef);
  if (!order) {
    return NextResponse.json({ ok: false, error: "Bestellung nicht gefunden." }, { status: 404 });
  }

  const bank = getBankTransferConfig();
  const extraBankNote = bank?.extraNote;

  // Optional: andere Empfänger-Adresse mitgeben (Body), sonst Original-Adresse aus Order.
  let overrideTo: string | undefined;
  try {
    const body = (await req.json()) as Record<string, unknown> | null;
    if (body && typeof body.to === "string") {
      const t = body.to.trim();
      if (t && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) overrideTo = t;
    }
  } catch {
    // body optional
  }

  const siteUrl =
    req.headers.get("origin")?.trim().replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ||
    brand.origin;

  const html = buildCustomerOrderEmailHtml(order, {
    siteUrl,
    extraBankNote,
    resendMarker: true,
  });

  const to = overrideTo || order.email;
  const result = await sendMail({
    from: defaultFromAddress(brand.name),
    to: [to],
    replyTo: brand.email,
    subject: `Ihre Bestellung ${order.orderRef} bei ${brand.name} (erneut zugesandt)`,
    html,
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: `Versand fehlgeschlagen: ${result.error}` },
      { status: 502 },
    );
  }

  await appendAudit({
    tsIso: new Date().toISOString(),
    type: "order.resend_email",
    actorUserId: admin.user.id,
    actorEmail: admin.user.email,
    ip: clientIpFromHeaders(req.headers),
    details: { orderRef, to },
  });

  return NextResponse.json({ ok: true, to });
}
