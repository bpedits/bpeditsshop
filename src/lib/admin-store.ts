/**
 * Server-only: Daten-Layer für den Admin-Bereich auf Supabase.
 *
 * Schema: `shop.users`, `shop.sessions`, `shop.login_codes`,
 *         `shop.order_status`, `shop.audit_log`.
 *
 * Public-API ist 100% kompatibel zur vorherigen Datei-Implementierung — alle
 * Aufrufer (Routen, Pages, Setup-Script) bleiben unverändert.
 *
 * Das Session-Geheimnis (HMAC-Schlüssel) liegt weiterhin auf der Maschine
 * unter `.data/admin/secret` bzw. in `ADMIN_SESSION_SECRET`. Es muss persistent
 * sein, soll aber nicht über DB-Backups verteilt werden.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase-server";

// ---------------------------------------------------------------------------
// Session-Secret (HMAC-Schlüssel) — bleibt lokal/ENV, nicht in DB
// ---------------------------------------------------------------------------

function adminLocalDir(): string {
  return (
    process.env.ADMIN_DATA_DIR?.trim() ||
    path.join(process.cwd(), ".data", "admin")
  );
}

async function ensureDir(p: string): Promise<void> {
  await fs.mkdir(p, { recursive: true });
}

export async function getOrCreateSessionSecret(): Promise<string> {
  const fromEnv = process.env.ADMIN_SESSION_SECRET?.trim();
  if (fromEnv && fromEnv.length >= 32) return fromEnv;

  const file = path.join(adminLocalDir(), "secret");
  try {
    const existing = (await fs.readFile(file, "utf8")).trim();
    if (existing.length >= 32) return existing;
  } catch {
    // wird erzeugt
  }
  await ensureDir(adminLocalDir());
  const generated = randomBytes(48).toString("hex");
  await fs.writeFile(file, generated, "utf8");
  return generated;
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAtIso: string;
  lastLoginIso?: string;
};

type UserRow = {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  created_at: string;
  last_login_at: string | null;
};

function toUser(r: UserRow): AdminUser {
  return {
    id: r.id,
    email: r.email,
    name: r.name,
    passwordHash: r.password_hash,
    createdAtIso: r.created_at,
    lastLoginIso: r.last_login_at ?? undefined,
  };
}

export async function listUsers(): Promise<AdminUser[]> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from("users").select("*").order("created_at", { ascending: true });
  if (error) throw new Error(`users list: ${error.message}`);
  return (data ?? []).map((r) => toUser(r as UserRow));
}

export async function findUserByEmail(emailRaw: string): Promise<AdminUser | null> {
  const email = emailRaw.trim().toLowerCase();
  if (!email) return null;
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from("users").select("*").ilike("email", email).maybeSingle();
  if (error) throw new Error(`users findByEmail: ${error.message}`);
  return data ? toUser(data as UserRow) : null;
}

export async function findUserById(id: string): Promise<AdminUser | null> {
  if (!id) return null;
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from("users").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`users findById: ${error.message}`);
  return data ? toUser(data as UserRow) : null;
}

export async function upsertUser(user: AdminUser): Promise<void> {
  const sb = getSupabaseAdmin();
  const { error } = await sb.from("users").upsert(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      password_hash: user.passwordHash,
      created_at: user.createdAtIso,
      last_login_at: user.lastLoginIso ?? null,
    },
    { onConflict: "id" },
  );
  if (error) throw new Error(`users upsert: ${error.message}`);
}

export async function deleteUser(id: string): Promise<void> {
  const sb = getSupabaseAdmin();
  const { error } = await sb.from("users").delete().eq("id", id);
  if (error) throw new Error(`users delete: ${error.message}`);
}

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

export type Session = {
  id: string;
  userId: string;
  createdAtIso: string;
  expiresAtIso: string;
  userAgent?: string;
  ip?: string;
};

type SessionRow = {
  id: string;
  user_id: string;
  created_at: string;
  expires_at: string;
  user_agent: string | null;
  ip: string | null;
};

function toSession(r: SessionRow): Session {
  return {
    id: r.id,
    userId: r.user_id,
    createdAtIso: r.created_at,
    expiresAtIso: r.expires_at,
    userAgent: r.user_agent ?? undefined,
    ip: r.ip ?? undefined,
  };
}

export async function createSession(input: {
  userId: string;
  ttlSeconds: number;
  userAgent?: string;
  ip?: string;
}): Promise<Session> {
  const id = randomBytes(24).toString("hex");
  const now = new Date();
  const expires = new Date(now.getTime() + input.ttlSeconds * 1000);
  const sb = getSupabaseAdmin();
  const { error } = await sb.from("sessions").insert({
    id,
    user_id: input.userId,
    created_at: now.toISOString(),
    expires_at: expires.toISOString(),
    user_agent: input.userAgent?.slice(0, 200) ?? null,
    ip: input.ip?.slice(0, 64) ?? null,
  });
  if (error) throw new Error(`sessions insert: ${error.message}`);
  return {
    id,
    userId: input.userId,
    createdAtIso: now.toISOString(),
    expiresAtIso: expires.toISOString(),
    userAgent: input.userAgent,
    ip: input.ip,
  };
}

export async function getSession(id: string): Promise<Session | null> {
  if (!id) return null;
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from("sessions").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`sessions get: ${error.message}`);
  if (!data) return null;
  const session = toSession(data as SessionRow);
  if (Date.parse(session.expiresAtIso) <= Date.now()) {
    // abgelaufen → opportunistisch löschen
    await sb.from("sessions").delete().eq("id", id);
    return null;
  }
  return session;
}

export async function deleteSession(id: string): Promise<void> {
  const sb = getSupabaseAdmin();
  const { error } = await sb.from("sessions").delete().eq("id", id);
  if (error) throw new Error(`sessions delete: ${error.message}`);
}

// ---------------------------------------------------------------------------
// 2FA-Login-Codes
// ---------------------------------------------------------------------------

export type LoginCode = {
  id: string;
  userId: string;
  codeHash: string;
  expiresAtIso: string;
  attempts: number;
  consumed: boolean;
  ip?: string;
};

type LoginCodeRow = {
  id: string;
  user_id: string;
  code_hash: string;
  expires_at: string;
  attempts: number;
  consumed: boolean;
  ip: string | null;
};

function toCode(r: LoginCodeRow): LoginCode {
  return {
    id: r.id,
    userId: r.user_id,
    codeHash: r.code_hash,
    expiresAtIso: r.expires_at,
    attempts: r.attempts,
    consumed: r.consumed,
    ip: r.ip ?? undefined,
  };
}

export async function createLoginCode(input: {
  userId: string;
  codeHash: string;
  ttlSeconds: number;
  ip?: string;
}): Promise<LoginCode> {
  const id = randomBytes(16).toString("hex");
  const expires = new Date(Date.now() + input.ttlSeconds * 1000);
  const sb = getSupabaseAdmin();
  const { error } = await sb.from("login_codes").insert({
    id,
    user_id: input.userId,
    code_hash: input.codeHash,
    expires_at: expires.toISOString(),
    attempts: 0,
    consumed: false,
    ip: input.ip?.slice(0, 64) ?? null,
  });
  if (error) throw new Error(`login_codes insert: ${error.message}`);
  return {
    id,
    userId: input.userId,
    codeHash: input.codeHash,
    expiresAtIso: expires.toISOString(),
    attempts: 0,
    consumed: false,
    ip: input.ip,
  };
}

export async function findLoginCode(id: string): Promise<LoginCode | null> {
  if (!id) return null;
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from("login_codes").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`login_codes get: ${error.message}`);
  return data ? toCode(data as LoginCodeRow) : null;
}

export async function updateLoginCode(code: LoginCode): Promise<void> {
  const sb = getSupabaseAdmin();
  const { error } = await sb
    .from("login_codes")
    .update({ attempts: code.attempts, consumed: code.consumed })
    .eq("id", code.id);
  if (error) throw new Error(`login_codes update: ${error.message}`);
}

// ---------------------------------------------------------------------------
// Order-Status & interne Notizen
// ---------------------------------------------------------------------------

export type OrderStatus = "open" | "paid" | "shipped" | "cancelled";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  open: "Offen",
  paid: "Bezahlt",
  shipped: "Verschickt",
  cancelled: "Storniert",
};

export type OrderStatusRecord = {
  orderRef: string;
  status: OrderStatus;
  updatedAtIso: string;
  updatedByUserId?: string;
  internalNote?: string;
};

type OrderStatusRow = {
  order_ref: string;
  status: OrderStatus;
  internal_note: string | null;
  updated_at: string;
  updated_by_user_id: string | null;
};

function toStatus(r: OrderStatusRow): OrderStatusRecord {
  return {
    orderRef: r.order_ref,
    status: r.status,
    updatedAtIso: r.updated_at,
    updatedByUserId: r.updated_by_user_id ?? undefined,
    internalNote: r.internal_note ?? undefined,
  };
}

export async function readOrderStatus(orderRef: string): Promise<OrderStatusRecord | null> {
  if (!/^BP-[A-Z0-9-]+$/i.test(orderRef)) return null;
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from("order_status").select("*").eq("order_ref", orderRef).maybeSingle();
  if (error) throw new Error(`order_status get: ${error.message}`);
  return data ? toStatus(data as OrderStatusRow) : null;
}

export async function writeOrderStatus(rec: OrderStatusRecord): Promise<void> {
  const sb = getSupabaseAdmin();
  const { error } = await sb.from("order_status").upsert(
    {
      order_ref: rec.orderRef,
      status: rec.status,
      internal_note: rec.internalNote ?? null,
      updated_at: rec.updatedAtIso,
      updated_by_user_id: rec.updatedByUserId ?? null,
    },
    { onConflict: "order_ref" },
  );
  if (error) throw new Error(`order_status upsert: ${error.message}`);
}

/**
 * Liest alle Status-Sätze auf einmal — sinnvoll für Listen-Seiten.
 */
export async function readAllOrderStatuses(): Promise<Map<string, OrderStatusRecord>> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from("order_status").select("*");
  if (error) throw new Error(`order_status list: ${error.message}`);
  const map = new Map<string, OrderStatusRecord>();
  for (const row of (data ?? []) as OrderStatusRow[]) {
    map.set(row.order_ref, toStatus(row));
  }
  return map;
}

// ---------------------------------------------------------------------------
// Audit-Log
// ---------------------------------------------------------------------------

export type AuditEvent = {
  tsIso: string;
  actorUserId?: string;
  actorEmail?: string;
  type:
    | "auth.login.password_ok"
    | "auth.login.password_fail"
    | "auth.login.code_sent"
    | "auth.login.code_ok"
    | "auth.login.code_fail"
    | "auth.logout"
    | "order.status_changed"
    | "order.note_changed"
    | "order.resend_email"
    | "user.created"
    | "user.deleted";
  details?: Record<string, unknown>;
  ip?: string;
};

type AuditRow = {
  ts: string;
  actor_user_id: string | null;
  actor_email: string | null;
  type: AuditEvent["type"];
  details: Record<string, unknown> | null;
  ip: string | null;
};

export async function appendAudit(ev: AuditEvent): Promise<void> {
  const sb = getSupabaseAdmin();
  const { error } = await sb.from("audit_log").insert({
    ts: ev.tsIso,
    actor_user_id: ev.actorUserId ?? null,
    actor_email: ev.actorEmail ?? null,
    type: ev.type,
    details: ev.details ?? null,
    ip: ev.ip ?? null,
  });
  // Audit-Fehler dürfen den eigentlichen Flow nicht blockieren.
  if (error) console.error("audit_log insert:", error.message);
}

export async function readRecentAudit(limit = 100): Promise<AuditEvent[]> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from("audit_log")
    .select("*")
    .order("ts", { ascending: false })
    .limit(limit);
  if (error) throw new Error(`audit_log list: ${error.message}`);
  return (data ?? []).map((r) => {
    const row = r as AuditRow;
    return {
      tsIso: row.ts,
      actorUserId: row.actor_user_id ?? undefined,
      actorEmail: row.actor_email ?? undefined,
      type: row.type,
      details: row.details ?? undefined,
      ip: row.ip ?? undefined,
    };
  });
}

// ---------------------------------------------------------------------------
// Util — alle Order-Refs auflisten (für CSV-Export, etc.)
// ---------------------------------------------------------------------------

export async function listAllOrderRefs(): Promise<string[]> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from("orders").select("order_ref").order("created_at", { ascending: false });
  if (error) throw new Error(`orders refs: ${error.message}`);
  return (data ?? []).map((r) => (r as { order_ref: string }).order_ref);
}
