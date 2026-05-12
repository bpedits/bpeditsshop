/**
 * Server-only: Helper für Sessions in Server-Components & Route-Handlern.
 *
 * Liefert die aktuell eingeloggte Person aus dem signierten Cookie. Die Middleware
 * macht eine schnelle Vorab-Prüfung der Cookie-Signatur; hier (in Pages/APIs)
 * wird zusätzlich der Session-Eintrag aus dem Store gelesen.
 */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySigned } from "@/lib/admin-auth";
import {
  type AdminUser,
  type Session,
  findUserById,
  getOrCreateSessionSecret,
  getSession,
} from "@/lib/admin-store";

export const SESSION_COOKIE = "bp_admin_sess";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 Tage

export type AdminContext = {
  user: AdminUser;
  session: Session;
};

export async function getAdminContext(): Promise<AdminContext | null> {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  const secret = await getOrCreateSessionSecret();
  const sessionId = verifySigned(raw, secret);
  if (!sessionId) return null;

  const session = await getSession(sessionId);
  if (!session) return null;

  const user = await findUserById(session.userId);
  if (!user) return null;

  return { user, session };
}

/** Wirft einen Redirect auf /admin/login, falls niemand eingeloggt ist. */
export async function requireAdmin(): Promise<AdminContext> {
  const ctx = await getAdminContext();
  if (!ctx) redirect("/admin/login");
  return ctx;
}
