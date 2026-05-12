import { NextResponse } from "next/server";
import { clientIpFromHeaders, compareCode, signValue, verifySigned } from "@/lib/admin-auth";
import {
  appendAudit,
  createSession,
  findLoginCode,
  findUserById,
  getOrCreateSessionSecret,
  updateLoginCode,
  upsertUser,
} from "@/lib/admin-store";
import { SESSION_COOKIE, SESSION_TTL_SECONDS } from "@/lib/admin-session";

const PENDING_COOKIE = "bp_admin_pending";
const MAX_ATTEMPTS = 5;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }

  const o = (body || {}) as Record<string, unknown>;
  const code = String(o.code ?? "").replace(/\D/g, "").slice(0, 6);
  if (code.length !== 6) {
    return NextResponse.json({ ok: false, error: "Bitte den 6-stelligen Code eingeben." }, { status: 400 });
  }

  const pendingCookie = req.headers.get("cookie") ?? "";
  const pendingMatch = pendingCookie
    .split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith(`${PENDING_COOKIE}=`));
  const pendingRaw = pendingMatch ? decodeURIComponent(pendingMatch.slice(PENDING_COOKIE.length + 1)) : "";
  const secret = await getOrCreateSessionSecret();
  const codeId = pendingRaw ? verifySigned(pendingRaw, secret) : null;

  if (!codeId) {
    return NextResponse.json(
      { ok: false, error: "Sitzung abgelaufen. Bitte erneut mit Passwort einloggen." },
      { status: 400 },
    );
  }

  const row = await findLoginCode(codeId);
  const ip = clientIpFromHeaders(req.headers);

  if (!row || row.consumed || Date.parse(row.expiresAtIso) <= Date.now()) {
    return NextResponse.json(
      { ok: false, error: "Code ist nicht mehr gültig. Bitte erneut anfordern." },
      { status: 400 },
    );
  }

  if (row.attempts >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { ok: false, error: "Zu viele Fehlversuche. Bitte erneut mit Passwort einloggen." },
      { status: 429 },
    );
  }

  const ok = compareCode(code, row.codeHash);
  row.attempts += 1;

  if (!ok) {
    await updateLoginCode(row);
    await appendAudit({
      tsIso: new Date().toISOString(),
      type: "auth.login.code_fail",
      actorUserId: row.userId,
      ip,
    });
    const left = Math.max(0, MAX_ATTEMPTS - row.attempts);
    return NextResponse.json(
      {
        ok: false,
        error: `Code ist falsch. Noch ${left} Versuch${left === 1 ? "" : "e"}.`,
      },
      { status: 401 },
    );
  }

  row.consumed = true;
  await updateLoginCode(row);

  const user = await findUserById(row.userId);
  if (!user) {
    return NextResponse.json(
      { ok: false, error: "Benutzer wurde inzwischen entfernt. Bitte neu einloggen." },
      { status: 401 },
    );
  }

  user.lastLoginIso = new Date().toISOString();
  await upsertUser(user);

  const session = await createSession({
    userId: user.id,
    ttlSeconds: SESSION_TTL_SECONDS,
    userAgent: req.headers.get("user-agent") || undefined,
    ip,
  });

  await appendAudit({
    tsIso: new Date().toISOString(),
    type: "auth.login.code_ok",
    actorUserId: user.id,
    actorEmail: user.email,
    ip,
  });

  const signedSession = signValue(session.id, secret);

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: SESSION_COOKIE,
    value: signedSession,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  res.cookies.set({
    name: PENDING_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
