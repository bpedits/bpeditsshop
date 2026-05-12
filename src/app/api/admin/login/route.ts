import { NextResponse } from "next/server";
import { brand } from "@/lib/brand";
import {
  clientIpFromHeaders,
  generateSixDigitCode,
  hashCode,
  signValue,
  verifyPassword,
} from "@/lib/admin-auth";
import {
  appendAudit,
  createLoginCode,
  findUserByEmail,
  getOrCreateSessionSecret,
} from "@/lib/admin-store";
import { defaultFromAddress, isMailerConfigured, sendMail } from "@/lib/mailer";
import { renderEmail, emailValueBox } from "@/lib/mail-template";

const PENDING_COOKIE = "bp_admin_pending";
const CODE_TTL_SECONDS = 10 * 60;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }

  const o = (body || {}) as Record<string, unknown>;
  const email = String(o.email ?? "").trim().toLowerCase();
  const password = String(o.password ?? "");

  if (!email || !password) {
    return NextResponse.json({ ok: false, error: "Bitte E-Mail und Passwort angeben." }, { status: 400 });
  }

  const ip = clientIpFromHeaders(req.headers);
  const user = await findUserByEmail(email);

  // Konstantzeit-Falle: auch ohne User scrypt aufrufen, damit die Antwortzeit
  // keinen Aufschluss über die Existenz des Accounts gibt.
  const pwOk = user
    ? await verifyPassword(password, user.passwordHash)
    : await verifyPassword(password, "scrypt$32768$8$1$AAAA$AAAA").then(() => false);

  if (!user || !pwOk) {
    await appendAudit({
      tsIso: new Date().toISOString(),
      type: "auth.login.password_fail",
      actorEmail: email,
      ip,
      details: { reason: !user ? "no_user" : "bad_password" },
    });
    // Bewusst generische Meldung — keine Hinweise auf Existenz.
    return NextResponse.json(
      { ok: false, error: "E-Mail oder Passwort ist falsch." },
      { status: 401 },
    );
  }

  if (!isMailerConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Server-Mailversand ist nicht konfiguriert. Ohne SMTP kann der 2FA-Code nicht zugestellt werden.",
      },
      { status: 503 },
    );
  }

  const code = generateSixDigitCode();
  const codeRow = await createLoginCode({
    userId: user.id,
    codeHash: hashCode(code),
    ttlSeconds: CODE_TTL_SECONDS,
    ip,
  });

  // Code per Mail an die Admin-Adresse senden.
  const from = defaultFromAddress(brand.name);
  const content = `
    <p style="margin:0 0 16px;">Hallo ${escapeHtmlSimple(user.name || user.email)},</p>
    <p style="margin:0 0 16px;">
      jemand versucht gerade, sich in den Admin-Bereich von ${brand.name} einzuloggen.
      Ihr Einmal-Code lautet:
    </p>
    ${emailValueBox({ label: "Einmal-Code (10 Minuten gültig)", value: code, mono: true })}
    <p style="margin:18px 0 0;font-size:13px;color:#555;">
      Geben Sie den Code im Browser ein, um den Login abzuschließen. Wenn Sie das nicht waren,
      ignorieren Sie diese E-Mail — der Code läuft automatisch ab. Anfrage-IP: ${escapeHtmlSimple(ip || "unbekannt")}.
    </p>
  `;

  const html = renderEmail({
    preheader: "Einmal-Code für den Admin-Bereich",
    eyebrow: "Admin-Login",
    contentHtml: content,
  });

  const result = await sendMail({
    from,
    to: [user.email],
    subject: `Ihr Admin-Login-Code: ${code}`,
    html,
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: `Code-Versand fehlgeschlagen: ${result.error}` },
      { status: 502 },
    );
  }

  await appendAudit({
    tsIso: new Date().toISOString(),
    type: "auth.login.code_sent",
    actorUserId: user.id,
    actorEmail: user.email,
    ip,
  });

  // Kurzlebigen Pending-Cookie setzen, der nur die Code-ID signiert enthält.
  const secret = await getOrCreateSessionSecret();
  const pendingValue = signValue(codeRow.id, secret);

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: PENDING_COOKIE,
    value: pendingValue,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CODE_TTL_SECONDS,
  });
  return res;
}

function escapeHtmlSimple(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
