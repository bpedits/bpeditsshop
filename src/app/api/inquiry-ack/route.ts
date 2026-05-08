import { NextResponse } from "next/server";
import { brand } from "@/lib/brand";
import { defaultFromAddress, escapeHtml, isResendConfigured, sendResendEmail } from "@/lib/resend-send";

function validEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

/**
 * Optional: Bestätigungs-Mail an die geschäftliche E-Mail nach institutioneller Anfrage.
 * Formspree / externes Backend liefert die eigentliche Leitung — dies ist nur ein freundlicher Ack an den Absender.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const o = body as Record<string, unknown>;
  const email = String(o.email ?? "").trim().slice(0, 320);
  const ref = String(o.ref ?? "").trim().slice(0, 80);

  if (!email || !validEmail(email)) {
    return NextResponse.json({ ok: false, error: "Ungültige E-Mail." }, { status: 400 });
  }

  if (!isResendConfigured()) {
    return NextResponse.json({ ok: true, sent: false });
  }

  const from = defaultFromAddress(brand.name);
  const refLine = ref ? `<p style="margin:16px 0;padding:12px 14px;background:#f5f5f7;border-radius:12px;"><strong>Ihre Referenz:</strong> ${escapeHtml(ref)}</p>` : "";

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.5;color:#1a1a1a;">
      <p>Hallo,</p>
      <p>vielen Dank für Ihre <strong>institutionelle Anfrage</strong> bei ${escapeHtml(brand.name)}.</p>
      <p>Wir haben Ihre Angaben zur Prüfung erhalten (${escapeHtml(brand.domainDisplay)}). Es erfolgt keine automatische Auftragsbestätigung — Status: <strong>Pending Review</strong>.</p>
      ${refLine}
      <p style="color:#555;">Bei Rückfragen nutzen wir Ihre angegebene geschäftliche E-Mail.</p>
      <p style="margin-top:24px;font-size:13px;color:#636366;">${escapeHtml(brand.legalName)}</p>
    </div>
  `;

  const ok = await sendResendEmail({
    from,
    to: [email],
    replyTo: brand.email,
    subject: `Anfrage eingegangen — ${brand.name}`,
    html,
  });

  if (!ok) {
    return NextResponse.json({ ok: false, sent: false }, { status: 502 });
  }
  return NextResponse.json({ ok: true, sent: true });
}
