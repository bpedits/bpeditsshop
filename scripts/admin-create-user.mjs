#!/usr/bin/env node
/**
 * Legt einen Admin-Benutzer für den /admin-Bereich an (oder updated einen bestehenden).
 *
 * Aufruf:
 *   npm run admin:create-user -- --email "name@firma.de" --name "Vorname Nachname"
 *
 * Liest:
 *   - .env.local: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 *
 * Schreibt:
 *   - shop.users in der Supabase-Datenbank
 *   - falls noch nicht vorhanden: lokales Session-Secret unter .data/admin/secret
 */
import { promises as fs } from "node:fs";
import { randomBytes, scrypt as scryptCb } from "node:crypto";
import { promisify } from "node:util";
import path from "node:path";
import readline from "node:readline";

const scrypt = promisify(scryptCb);
const SCRYPT_N = 32768;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEYLEN = 64;
const SCRYPT_MAXMEM = 128 * 1024 * 1024;

// ---------------------------------------------------------------------------
// .env.local einlesen (für SUPABASE_*)
// ---------------------------------------------------------------------------

async function loadDotEnvLocal() {
  const candidates = [".env.local", ".env"];
  for (const rel of candidates) {
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
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
          v = v.slice(1, -1);
        }
        if (!(k in process.env)) process.env[k] = v;
      }
    } catch {
      // existiert nicht -> weiter
    }
  }
}

// ---------------------------------------------------------------------------
// Passwort-Eingabe (TTY versteckt; Pipe: ganzer Stream)
// ---------------------------------------------------------------------------

const pipedLines = [];
let pipedReady = null;

async function preloadPipedInput() {
  if (process.stdin.isTTY) return;
  if (pipedReady) return pipedReady;
  pipedReady = new Promise((resolve) => {
    let buf = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (buf += chunk));
    process.stdin.on("end", () => {
      for (const line of buf.split(/\r?\n/)) pipedLines.push(line);
      resolve();
    });
  });
  return pipedReady;
}

function readPasswordHidden(prompt) {
  const stdin = process.stdin;
  if (!stdin.isTTY) {
    process.stderr.write(prompt);
    const line = pipedLines.shift() ?? "";
    process.stderr.write("\n");
    return Promise.resolve(line);
  }

  return new Promise((resolve, reject) => {
    process.stdout.write(prompt);
    let value = "";
    const onData = (b) => {
      const ch = b.toString("utf8");
      if (ch === "\n" || ch === "\r" || ch === "\u0004") {
        stdin.removeListener("data", onData);
        if (stdin.isTTY) stdin.setRawMode(false);
        process.stdout.write("\n");
        resolve(value);
        return;
      }
      if (ch === "\u0003") {
        if (stdin.isTTY) stdin.setRawMode(false);
        reject(new Error("Abgebrochen."));
        return;
      }
      if (ch === "\u007f" || ch === "\b") value = value.slice(0, -1);
      else value += ch;
    };
    if (stdin.isTTY) stdin.setRawMode(true);
    stdin.on("data", onData);
  });
}

// ---------------------------------------------------------------------------
// Hash
// ---------------------------------------------------------------------------

async function hashPassword(plain) {
  const salt = randomBytes(16);
  const buf = await scrypt(plain.normalize("NFKC"), salt, SCRYPT_KEYLEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
    maxmem: SCRYPT_MAXMEM,
  });
  return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt.toString("base64")}$${buf.toString("base64")}`;
}

function parseArgs(argv) {
  const out = { email: "", name: "" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--email" && argv[i + 1]) out.email = argv[++i].trim().toLowerCase();
    else if (a === "--name" && argv[i + 1]) out.name = argv[++i].trim();
  }
  return out;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  await loadDotEnvLocal();
  await preloadPipedInput();

  const args = parseArgs(process.argv.slice(2));
  if (!args.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(args.email)) {
    console.error("Bitte gültige E-Mail mit --email angeben.");
    process.exit(1);
  }
  if (!args.name || args.name.length < 2) {
    console.error("Bitte einen Namen mit --name angeben (mindestens 2 Zeichen).");
    process.exit(1);
  }

  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (!url || !key) {
    console.error(
      "Supabase ist nicht konfiguriert.\n" +
        "Bitte NEXT_PUBLIC_SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY in .env.local setzen.",
    );
    process.exit(1);
  }

  const pwd = await readPasswordHidden("Passwort (versteckt, min. 8 Zeichen): ");
  if (pwd.length < 8) {
    console.error("Passwort ist zu kurz.");
    process.exit(1);
  }
  const confirm = await readPasswordHidden("Passwort wiederholen:           ");
  if (pwd !== confirm) {
    console.error("Passwörter stimmen nicht überein.");
    process.exit(1);
  }

  const passwordHash = await hashPassword(pwd);
  const nowIso = new Date().toISOString();

  const { createClient } = await import("@supabase/supabase-js");
  const sb = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: "shop" },
  });

  // Existiert User bereits?
  const { data: existing, error: e1 } = await sb
    .from("users")
    .select("*")
    .ilike("email", args.email)
    .maybeSingle();
  if (e1) {
    console.error("Lese-Fehler:", e1.message);
    process.exit(1);
  }

  if (existing) {
    const { error: eUpd } = await sb
      .from("users")
      .update({ name: args.name, password_hash: passwordHash })
      .eq("id", existing.id);
    if (eUpd) {
      console.error("Update-Fehler:", eUpd.message);
      process.exit(1);
    }
    console.log(`Passwort/Name aktualisiert: ${existing.email}`);
  } else {
    const id = randomBytes(8).toString("hex");
    const { error: eIns } = await sb.from("users").insert({
      id,
      email: args.email,
      name: args.name,
      password_hash: passwordHash,
      created_at: nowIso,
    });
    if (eIns) {
      console.error("Insert-Fehler:", eIns.message);
      process.exit(1);
    }
    console.log(`Benutzer angelegt: ${args.email}`);
  }

  // Session-Secret lokal anlegen, falls noch keines existiert.
  const adminDir = process.env.ADMIN_DATA_DIR?.trim() || path.join(process.cwd(), ".data", "admin");
  await fs.mkdir(adminDir, { recursive: true });
  const secretFile = path.join(adminDir, "secret");
  try {
    await fs.access(secretFile);
  } catch {
    const sec = randomBytes(48).toString("hex");
    await fs.writeFile(secretFile, sec, "utf8");
    console.log("Session-Secret unter .data/admin/secret angelegt (auto generiert).");
  }

  console.log("\nLogin testen:");
  console.log("  1. http://localhost:3000/admin/login");
  console.log("  2. E-Mail + Passwort");
  console.log(`  3. 6-stelligen Code aus der Mail an ${args.email}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
