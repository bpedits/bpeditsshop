import { NextResponse } from "next/server";
import { brand } from "@/lib/brand";
import { defaultFromAddress, escapeHtml, isResendConfigured, sendResendEmail } from "@/lib/resend-send";

const MAX = { name: 200, subject: 300, message: 8000 };

function validEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function clip(s: string, max: number): string {
  const t = s.trim();
  return t.length > max ? t.slice(0, max) : t;
}

export async function POST(req: Request) {
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
  const subject = clip(String(o.subject ?? ""), MAX.subject);
  const message = clip(String(o.message ?? ""), MAX.message);

  if (!email || !validEmail(email)) {
    return NextResponse.json({ ok: false as const, error: "Bitte eine gültige E-Mail-Adresse angeben." }, { status: 400 });
  }
  if (!message) {
    return NextResponse.json({ ok: false as const, error: "Bitte eine Nachricht eingeben." }, { status: 400 });
  }

  const safeSubject = subject || `Kontakt ${brand.domainDisplay}`;
  const from = defaultFromAddress(brand.name);

  let confirmationSent = false;

  if (isResendConfigured()) {
    const userHtml = `
      <div style="font-family:system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.5;color:#1a1a1a;">
        <p>Hallo${name ? ` ${escapeHtml(name)}` : ""},</p>
        <p>vielen Dank für Ihre Nachricht an <strong>${escapeHtml(brand.name)}</strong>. Wir haben Ihre Anfrage erhalten.</p>
        <p style="margin:16px 0;padding:12px 14px;background:#f5f5f7;border-radius:12px;"><strong>Ihre Referenz:</strong> Kontaktformular · ${escapeHtml(new Date().toISOString())}</p>
        <p style="color:#555;">Sie erhalten keine automatische Kopie des Textes — aus Datenschutzgründen wiederholen wir den Inhalt nicht per E-Mail. Unser Team meldet sich bei Ihnen unter dieser Adresse, sofern ein Rückversand angezeigt ist.</p>
        <p style="margin-top:24px;font-size:13px;color:#636366;">${escapeHtml(brand.legalName)} · <a href="${escapeHtml(brand.origin)}">${escapeHtml(brand.domainDisplay)}</a></p>
      </div>
    `;

    const teamHtml = `
      <div style="font-family:system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.5;color:#111;">
        <h2 style="margin:0 0 12px;font-size:16px;">Neue Kontaktnachricht</h2>
        <p><strong>Von:</strong> ${escapeHtml(name || "—")} &lt;${escapeHtml(email)}&gt;</p>
        <p><strong>Betreff:</strong> ${escapeHtml(safeSubject)}</p>
        <hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0;" />
        <pre style="white-space:pre-wrap;font-family:inherit;margin:0;">${escapeHtml(message)}</pre>
      </div>
    `;

    const [toUser, toTeam] = await Promise.all([
      sendResendEmail({
        from,
        to: [email],
        replyTo: email,
        subject: `Bestätigung: Nachricht eingegangen — ${brand.name}`,
        html: userHtml,
      }),
      sendResendEmail({
        from,
        to: [brand.contactFormInboxEmail],
        replyTo: email,
        subject: `[Kontakt] ${safeSubject}`,
        html: teamHtml,
      }),
    ]);

    confirmationSent = toUser && toTeam;
    if (!confirmationSent) {
      return NextResponse.json(
        {
          ok: false as const,
          error: "E-Mail-Versand fehlgeschlagen. Bitte später erneut versuchen oder direkt per E-Mail kontaktieren.",
        },
        { status: 502 },
      );
    }

    const mailQuery = `?subject=${encodeURIComponent(safeSubject)}&body=${encodeURIComponent(message)}`;
    return NextResponse.json({
      ok: true as const,
      confirmationSent: true,
      mailtoFallback: `mailto:${brand.contactFormInboxEmail}${mailQuery}`,
    });
  }

  const mailQuery = `?subject=${encodeURIComponent(safeSubject)}&body=${encodeURIComponent(
    `Von: ${name ? `${name} <${email}>` : email}\n\n${message}`,
  )}`;
  return NextResponse.json({
    ok: true as const,
    confirmationSent: false,
    mailtoFallback: `mailto:${brand.contactFormInboxEmail}${mailQuery}`,
  });
}
