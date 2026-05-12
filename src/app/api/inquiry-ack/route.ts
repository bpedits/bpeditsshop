import { NextResponse } from "next/server";
import { brand } from "@/lib/brand";
import { defaultFromAddress, escapeHtml, isMailerConfigured, sendMail } from "@/lib/mailer";
import { renderEmail } from "@/lib/mail-template";

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

  if (!isMailerConfigured()) {
    return NextResponse.json({ ok: true, sent: false });
  }

  const from = defaultFromAddress(brand.name);
  const refLine = ref
    ? `<div style="margin:16px 0;padding:12px 16px;background:#f5f5f7;border-radius:12px;font-size:14px;"><strong>Ihre Referenz:</strong> <span style="font-family:'SFMono-Regular',Consolas,Menlo,monospace;">${escapeHtml(ref)}</span></div>`
    : "";

  const content = `
    <p style="margin:0 0 14px;">Hallo,</p>
    <p style="margin:0 0 14px;">Ihre institutionelle Anfrage ist bei uns eingegangen. Wir prüfen Ihre Angaben in den nächsten Werktagen.</p>
    <p style="margin:0 0 14px;">Eine automatische Auftragsbestätigung gibt es bei dieser Art der Anfrage nicht. Status: <strong>Pending Review</strong>.</p>
    ${refLine}
    <p style="margin:14px 0 0;color:#636366;font-size:13px;">Bei Rückfragen schreiben wir Ihnen unter Ihrer angegebenen geschäftlichen E-Mail.</p>
    <p style="margin:18px 0 0;">Viele Grüße,<br/>Ihr Team von ${escapeHtml(brand.name)}</p>
  `;

  const html = renderEmail({
    preheader: `Ihre Anfrage ist bei ${brand.name} angekommen.`,
    eyebrow: "Anfrage erhalten",
    contentHtml: content,
  });

  const sent = await sendMail({
    from,
    to: [email],
    replyTo: brand.email,
    subject: `Ihre Anfrage ist angekommen, ${brand.name}`,
    html,
  });

  if (!sent.ok) {
    return NextResponse.json({ ok: false, sent: false, error: sent.error }, { status: 502 });
  }
  return NextResponse.json({ ok: true, sent: true });
}
