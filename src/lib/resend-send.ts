/**
 * Server-only: transactional mail via Resend HTTP API (kein zusätzliches npm-Paket).
 * ENV: RESEND_API_KEY · optional RESEND_FROM (z. B. "Bavaria Peptides <mail@verified-domain>")
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export async function sendResendEmail(opts: {
  from: string;
  to: string[];
  replyTo?: string;
  subject: string;
  html: string;
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return false;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: opts.from,
      to: opts.to,
      ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
      subject: opts.subject,
      html: opts.html,
    }),
  });

  return res.ok;
}

export function defaultFromAddress(fallbackBrandName: string): string {
  const raw = process.env.RESEND_FROM?.trim();
  if (raw) return raw;
  return `${fallbackBrandName} <onboarding@resend.dev>`;
}

export { escapeHtml };
