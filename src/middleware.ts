import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge-kompatible Vorab-Prüfung für /admin/*.
 *
 * Hier nur die minimale Hürde: existiert ein Session-Cookie überhaupt?
 * Wenn nicht → direkt auf /admin/login umleiten und das ?next= mitschicken,
 * damit nach dem Login wieder zur ursprünglichen Seite gesprungen wird.
 *
 * Die richtige Auth-Prüfung (Cookie-Signatur, Session im Store, User existiert)
 * findet in jeder Admin-Seite via `requireAdmin()` aus `src/lib/admin-session.ts`
 * statt — Server Components haben dort vollen Node-Zugriff.
 */

const SESSION_COOKIE = "bp_admin_sess";

const PUBLIC_ADMIN_PATHS = new Set<string>([
  "/admin/login",
  "/admin/verify",
]);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Nur /admin/* schützen. APIs prüfen selbst (sehen ggf. JSON-Antworten vor).
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (PUBLIC_ADMIN_PATHS.has(pathname)) return NextResponse.next();

  const hasSession = !!req.cookies.get(SESSION_COOKIE)?.value;
  if (hasSession) return NextResponse.next();

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.search = "";
  if (pathname !== "/admin") {
    loginUrl.searchParams.set("next", pathname + req.nextUrl.search);
  }
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
