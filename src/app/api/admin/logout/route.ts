import { NextResponse } from "next/server";
import { verifySigned } from "@/lib/admin-auth";
import { SESSION_COOKIE } from "@/lib/admin-session";
import { appendAudit, deleteSession, getOrCreateSessionSecret, getSession, findUserById } from "@/lib/admin-store";

export async function POST(req: Request) {
  const raw = req.headers.get("cookie") ?? "";
  const match = raw
    .split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith(`${SESSION_COOKIE}=`));
  const value = match ? decodeURIComponent(match.slice(SESSION_COOKIE.length + 1)) : "";

  if (value) {
    const secret = await getOrCreateSessionSecret();
    const sid = verifySigned(value, secret);
    if (sid) {
      const sess = await getSession(sid);
      const user = sess ? await findUserById(sess.userId) : null;
      await deleteSession(sid);
      await appendAudit({
        tsIso: new Date().toISOString(),
        type: "auth.logout",
        actorUserId: user?.id,
        actorEmail: user?.email,
      });
    }
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
