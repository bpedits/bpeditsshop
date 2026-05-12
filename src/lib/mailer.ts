/**
 * Server-only: transaktionaler Mail-Versand über SMTP (nodemailer).
 *
 * ENV:
 *   SMTP_HOST    z. B. smtp.zoho.eu (Free) / smtppro.zoho.eu (Mail Lite/Pro)
 *   SMTP_PORT    465 (SSL) oder 587 (STARTTLS) — Default 465
 *   SMTP_SECURE  optional: "true" für 465, "false" für 587 — sonst aus Port abgeleitet
 *   SMTP_USER    volle Absender-Adresse, z. B. info@bavaria-peptides.com
 *   SMTP_PASS    App-spezifisches Passwort (Zoho: Sicherheit → App-Passwörter)
 *   SMTP_FROM    optional: Anzeige-Absender, z. B. "Bavaria Peptides <info@bavaria-peptides.com>"
 *                Wenn leer: fällt auf SMTP_USER zurück.
 */
import nodemailer, { type Transporter } from "nodemailer";
import { escapeHtml } from "@/lib/escape-html";

export type MailSendResult = { ok: true } | { ok: false; error: string };

function clipError(s: string, max = 400): string {
  const t = s.trim();
  return t.length > max ? `${t.slice(0, max)}…` : t;
}

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
};

function readSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  const portRaw = process.env.SMTP_PORT?.trim();
  const port = portRaw ? Number.parseInt(portRaw, 10) : 465;
  if (!Number.isFinite(port) || port <= 0) return null;

  const secureRaw = process.env.SMTP_SECURE?.trim().toLowerCase();
  const secure =
    secureRaw === "true" ? true : secureRaw === "false" ? false : port === 465;

  return { host, port, secure, user, pass };
}

export function isMailerConfigured(): boolean {
  return readSmtpConfig() !== null;
}

let transporter: Transporter | null = null;
let transporterKey = "";

function getTransporter(cfg: SmtpConfig): Transporter {
  const key = `${cfg.host}|${cfg.port}|${cfg.secure}|${cfg.user}`;
  if (transporter && transporterKey === key) return transporter;
  transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: { user: cfg.user, pass: cfg.pass },
    pool: true,
    maxConnections: 3,
    maxMessages: 50,
  });
  transporterKey = key;
  return transporter;
}

/** Sehr einfache HTML→Text-Konvertierung als Fallback. Wirkt sich positiv aufs Spam-Scoring aus,
 *  weil multipart/alternative von vielen Providern bevorzugt wird. */
function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?(p|div|tr|li|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function sendMail(opts: {
  from: string;
  to: string[];
  replyTo?: string;
  subject: string;
  html: string;
  /** Optional: Plaintext-Alternative. Wird sonst automatisch aus dem HTML generiert. */
  text?: string;
}): Promise<MailSendResult> {
  const cfg = readSmtpConfig();
  if (!cfg) {
    return {
      ok: false,
      error:
        "SMTP nicht konfiguriert (SMTP_HOST, SMTP_USER, SMTP_PASS erforderlich).",
    };
  }

  try {
    const tx = getTransporter(cfg);
    await tx.sendMail({
      from: opts.from,
      to: opts.to.join(", "),
      ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
      subject: opts.subject,
      html: opts.html,
      text: opts.text ?? htmlToText(opts.html),
    });
    return { ok: true };
  } catch (err) {
    const raw = err instanceof Error ? err.message : String(err);
    const detail = clipError(raw);
    console.error("[mailer] SMTP-Versand fehlgeschlagen:", detail);
    return { ok: false, error: detail };
  }
}

export function defaultFromAddress(fallbackBrandName: string): string {
  const raw = process.env.SMTP_FROM?.trim();
  if (raw) return raw;
  const user = process.env.SMTP_USER?.trim();
  if (user) return `${fallbackBrandName} <${user}>`;
  return fallbackBrandName;
}

export { escapeHtml };

