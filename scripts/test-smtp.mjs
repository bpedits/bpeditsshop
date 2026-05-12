/**
 * Direkter SMTP-Smoke-Test (keine Next.js-Route nötig).
 * Liest SMTP_* aus .env.local und schickt 1 Testmail an SMTP_USER (= dich selbst).
 *
 * Aufruf:  node scripts/test-smtp.mjs
 *      oder npm run test:smtp
 * Optional: TO=meine@adresse.de node scripts/test-smtp.mjs
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createTransport } from "nodemailer";

async function loadDotEnvLocal() {
  const file = path.resolve(process.cwd(), ".env.local");
  try {
    const txt = await readFile(file, "utf8");
    for (const raw of txt.split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq === -1) continue;
      const k = line.slice(0, eq).trim();
      let v = line.slice(eq + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      if (!(k in process.env)) process.env[k] = v;
    }
  } catch (err) {
    if (err && err.code !== "ENOENT") throw err;
  }
}

await loadDotEnvLocal();

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT || 465);
const secureRaw = (process.env.SMTP_SECURE || "").toLowerCase();
const secure = secureRaw === "true" ? true : secureRaw === "false" ? false : port === 465;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.SMTP_FROM || user;
const to = process.env.TO || user;

if (!host || !user || !pass) {
  console.error("Fehlt: SMTP_HOST, SMTP_USER oder SMTP_PASS in .env.local");
  process.exit(1);
}

console.log(`> SMTP: ${host}:${port} (secure=${secure}) als ${user}`);
console.log(`> Empfänger: ${to}`);

const tx = createTransport({
  host,
  port,
  secure,
  auth: { user, pass },
});

try {
  console.log("> Verifiziere Verbindung …");
  await tx.verify();
  console.log("  OK — Anmeldung gültig.");

  console.log("> Sende Testmail …");
  const info = await tx.sendMail({
    from,
    to,
    subject: "SMTP-Test · Bavaria Peptides Shop",
    text: "Wenn du diese Mail siehst, funktioniert der SMTP-Versand über Zoho.",
    html: '<p>Wenn du diese Mail siehst, funktioniert der <strong>SMTP-Versand über Zoho</strong>.</p><p style="color:#666;font-size:13px;">Bavaria Peptides Shop · Smoke-Test</p>',
  });

  console.log("  OK — gesendet:", info.messageId);
  console.log("  Response:", info.response);
  process.exit(0);
} catch (err) {
  console.error("\nFEHLER:");
  console.error(err && err.message ? err.message : err);
  if (err && err.code) console.error("Code:", err.code);
  if (err && err.response) console.error("Server:", err.response);
  process.exit(1);
}
