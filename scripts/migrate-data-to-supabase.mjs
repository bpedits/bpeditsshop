#!/usr/bin/env node
/**
 * Einmaliges Migrations-Script: kopiert bestehende JSON-Daten unter `.data/`
 * in das Supabase-Schema `shop`.
 *
 * Kopiert: orders, order_status, users, audit_log (JSONL).
 * Sessions/Login-Codes werden bewusst nicht migriert — sind kurzlebig.
 *
 * Aufruf:
 *   node ./scripts/migrate-data-to-supabase.mjs
 *
 * Idempotent: upsert-basiert, kann mehrmals laufen.
 */
import { promises as fs } from "node:fs";
import path from "node:path";

async function loadDotEnvLocal() {
  for (const rel of [".env.local", ".env"]) {
    const f = path.join(process.cwd(), rel);
    try {
      const txt = await fs.readFile(f, "utf8");
      for (const raw of txt.split(/\r?\n/)) {
        const line = raw.trim();
        if (!line || line.startsWith("#")) continue;
        const eq = line.indexOf("=");
        if (eq < 1) continue;
        const k = line.slice(0, eq).trim();
        let v = line.slice(eq + 1).trim();
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
        if (!(k in process.env)) process.env[k] = v;
      }
    } catch {}
  }
}

async function readJsonOr(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}

async function listJsonFilesIn(dir) {
  try {
    const entries = await fs.readdir(dir);
    return entries.filter((f) => f.endsWith(".json"));
  } catch {
    return [];
  }
}

async function main() {
  await loadDotEnvLocal();
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (!url || !key) {
    console.error("Supabase ist nicht konfiguriert (.env.local).");
    process.exit(1);
  }

  const { createClient } = await import("@supabase/supabase-js");
  const sb = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: "shop" },
  });

  const dataDir = process.env.DATA_DIR?.trim() || path.join(process.cwd(), ".data");
  const orderDir = process.env.ORDER_STORE_DIR?.trim() || path.join(dataDir, "orders");
  const statusDir = process.env.ORDER_STATUS_DIR?.trim() || path.join(dataDir, "order-status");
  const adminDir = process.env.ADMIN_DATA_DIR?.trim() || path.join(dataDir, "admin");

  let counts = { orders: 0, orderLines: 0, statuses: 0, users: 0, audit: 0 };

  // -------- Orders + Order-Lines --------
  const orderFiles = await listJsonFilesIn(orderDir);
  for (const f of orderFiles) {
    const order = await readJsonOr(path.join(orderDir, f), null);
    if (!order || !order.orderRef) continue;
    const orderRow = {
      order_ref: order.orderRef,
      created_at: order.createdAtIso,
      email: order.email,
      name: order.name,
      company: order.company ?? null,
      tax_number: order.taxNumber ?? null,
      hrb: order.hrb ?? null,
      note: order.note ?? null,
      promo_code: order.promoCode ?? null,
      shipping_country: order.shipping?.countryCode || "DE",
      shipping_bundesland_code: order.shipping?.bundeslandCode,
      shipping_bundesland_label: order.shipping?.bundeslandLabel,
      shipping_street_line1: order.shipping?.streetLine1,
      shipping_street_line2: order.shipping?.streetLine2 ?? null,
      shipping_postal_code: order.shipping?.postalCode,
      shipping_city: order.shipping?.city,
      total_eur: order.totalEur,
      bank_account_holder: order.bankSnapshot?.accountHolder,
      bank_iban: order.bankSnapshot?.iban,
      bank_bic: order.bankSnapshot?.bic,
      bank_institution: order.bankSnapshot?.institution ?? null,
    };
    const { error: e1 } = await sb.from("orders").upsert(orderRow, { onConflict: "order_ref" });
    if (e1) {
      console.warn(`SKIP order ${order.orderRef}: ${e1.message}`);
      continue;
    }
    counts.orders++;

    await sb.from("order_lines").delete().eq("order_ref", order.orderRef);
    if (Array.isArray(order.lines) && order.lines.length) {
      const lineRows = order.lines.map((l) => ({
        order_ref: order.orderRef,
        sku: l.sku,
        product_slug: l.productSlug,
        product_name: l.productName,
        pack_label: l.packLabel,
        qty: l.qty,
        list_price_eur: l.listPriceEur,
      }));
      const { error: e2 } = await sb.from("order_lines").insert(lineRows);
      if (e2) console.warn(`Lines-Fehler ${order.orderRef}: ${e2.message}`);
      else counts.orderLines += lineRows.length;
    }
  }

  // -------- Order-Status --------
  const statusFiles = await listJsonFilesIn(statusDir);
  for (const f of statusFiles) {
    const rec = await readJsonOr(path.join(statusDir, f), null);
    if (!rec || !rec.orderRef) continue;
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
    if (error) console.warn(`SKIP status ${rec.orderRef}: ${error.message}`);
    else counts.statuses++;
  }

  // -------- Users --------
  const users = await readJsonOr(path.join(adminDir, "users.json"), []);
  for (const u of users) {
    if (!u || !u.id) continue;
    const { error } = await sb.from("users").upsert(
      {
        id: u.id,
        email: u.email,
        name: u.name,
        password_hash: u.passwordHash,
        created_at: u.createdAtIso,
        last_login_at: u.lastLoginIso ?? null,
      },
      { onConflict: "id" },
    );
    if (error) console.warn(`SKIP user ${u.email}: ${error.message}`);
    else counts.users++;
  }

  // -------- Audit-Log --------
  try {
    const txt = await fs.readFile(path.join(adminDir, "audit.log"), "utf8");
    const lines = txt.split(/\r?\n/).filter(Boolean);
    if (lines.length) {
      const rows = [];
      for (const l of lines) {
        try {
          const ev = JSON.parse(l);
          rows.push({
            ts: ev.tsIso,
            actor_user_id: ev.actorUserId ?? null,
            actor_email: ev.actorEmail ?? null,
            type: ev.type,
            details: ev.details ?? null,
            ip: ev.ip ?? null,
          });
        } catch {}
      }
      if (rows.length) {
        const { error } = await sb.from("audit_log").insert(rows);
        if (error) console.warn(`Audit-Insert: ${error.message}`);
        else counts.audit = rows.length;
      }
    }
  } catch {}

  console.log("\nMigration fertig:");
  console.log(`  Bestellungen        : ${counts.orders}`);
  console.log(`    Positionen        : ${counts.orderLines}`);
  console.log(`  Status-Sätze        : ${counts.statuses}`);
  console.log(`  Benutzer            : ${counts.users}`);
  console.log(`  Audit-Events        : ${counts.audit}`);
  console.log("\nFalls Sessions/Login-Codes in der DB fehlen: einfach neu einloggen — kurzlebig, kein Verlust.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
