import { NextResponse } from "next/server";
import { brand } from "@/lib/brand";
import { defaultFromAddress, escapeHtml, isMailerConfigured, sendMail } from "@/lib/mailer";
import { renderEmail } from "@/lib/mail-template";

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

  if (isMailerConfigured()) {
    const userContent = `
      <p style="margin:0 0 14px;">Hallo${name ? ` ${escapeHtml(name)}` : ""},</p>
      <p style="margin:0 0 14px;">Ihre Nachricht ist bei uns angekommen. Wir lesen sie zeitnah und melden uns bei Ihnen unter dieser Adresse, falls eine Rückmeldung sinnvoll ist.</p>
      <div style="margin:16px 0;padding:12px 16px;background:#f5f5f7;border-radius:12px;font-size:14px;">
        <strong>Ihre Referenz:</strong> Kontaktformular vom <span style="font-family:'SFMono-Regular',Consolas,Menlo,monospace;">${escapeHtml(new Date().toISOString())}</span>
      </div>
      <p style="margin:0;color:#636366;font-size:13px;">Aus Datenschutzgründen schicken wir Ihren Nachrichtentext nicht automatisch zurück.</p>
      <p style="margin:18px 0 0;">Viele Grüße,<br/>Ihr Team von ${escapeHtml(brand.name)}</p>
    `;

    const teamContent = `
      <h2 style="margin:0 0 14px;font-size:18px;">Neue Kontaktnachricht</h2>
      <p style="margin:0 0 6px;"><strong>Von:</strong> ${escapeHtml(name || "ohne Namen")} &lt;${escapeHtml(email)}&gt;</p>
      <p style="margin:0 0 6px;"><strong>Betreff:</strong> ${escapeHtml(safeSubject)}</p>
      <hr style="border:none;border-top:1px solid #ececf0;margin:18px 0;" />
      <pre style="white-space:pre-wrap;font-family:inherit;margin:0;font-size:14px;line-height:1.55;">${escapeHtml(message)}</pre>
    `;

    const userHtml = renderEmail({
      preheader: `Ihre Nachricht ist bei ${brand.name} angekommen.`,
      eyebrow: "Nachricht erhalten",
      contentHtml: userContent,
    });
    const teamHtml = renderEmail({
      preheader: `Kontakt: ${safeSubject}`,
      eyebrow: "Kontaktformular",
      contentHtml: teamContent,
    });

    const [toUser, toTeam] = await Promise.all([
      sendMail({
        from,
        to: [email],
        replyTo: email,
        subject: `Ihre Nachricht ist angekommen, ${brand.name}`,
        html: userHtml,
      }),
      sendMail({
        from,
        to: [brand.contactFormInboxEmail],
        replyTo: email,
        subject: `[Kontakt] ${safeSubject}`,
        html: teamHtml,
      }),
    ]);

    confirmationSent = toUser.ok && toTeam.ok;
    if (!confirmationSent) {
      const parts: string[] = [];
      if (!toUser.ok) parts.push(`Bestätigung: ${toUser.error}`);
      if (!toTeam.ok) parts.push(`Team: ${toTeam.error}`);
      return NextResponse.json(
        {
          ok: false as const,
          error: `E-Mail-Versand fehlgeschlagen (${parts.join(" · ")}).`,
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
