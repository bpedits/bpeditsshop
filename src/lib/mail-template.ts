/**
 * Gemeinsames HTML-Layout für alle Transaktionsmails:
 * - branded Header mit Logo + Marke
 * - Content-Slot
 * - Fußzeile mit Pflichtangaben (Impressum-Kurz, RUO-Hinweis)
 *
 * Bewusst Inline-Styles + Tabellen-Reste, damit es auch in Outlook,
 * Apple Mail, Gmail-Web und iOS Mail sauber rendert.
 */
import { brand } from "@/lib/brand";
import { escapeHtml } from "@/lib/escape-html";

const SITE_URL = (() => {
  const fromEnv = (process.env.NEXT_PUBLIC_SITE_URL || "").trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  return brand.origin;
})();

const LOGO_URL = `${SITE_URL}/logoganz.png`;

export type RenderEmailOptions = {
  /** Preview-Text (Preheader) — taucht in der Inbox-Vorschau auf. */
  preheader?: string;
  /** Optionaler kurzer Titel oben im Header (z. B. „Bestellung eingegangen"). */
  eyebrow?: string;
  /** Eigentlicher Mail-Inhalt als HTML (bereits escaped, soweit nötig). */
  contentHtml: string;
};

/**
 * Großer Call-to-Action-Button im E-Mail-Body.
 * Funktioniert in Outlook (VML-Fallback nicht nötig, weil rounded-rectangle reicht).
 */
export function emailButton(opts: { href: string; label: string }): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:18px 0;">
    <tr>
      <td align="center" style="border-radius:9999px;background:#0066cc;">
        <a href="${escapeHtml(opts.href)}"
           style="display:inline-block;padding:14px 26px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;font-weight:600;line-height:1;color:#ffffff;text-decoration:none;border-radius:9999px;background:#0066cc;">
          ${escapeHtml(opts.label)}
        </a>
      </td>
    </tr>
  </table>`;
}

/**
 * Statischer „Wert-Block" für E-Mails: Label + großer monospace Wert in eigener Box.
 * Bewusst KEIN Pseudo-Button — JS läuft in Mails nicht. Auf Mobile reicht
 * Lange-Drücken auf den Wert für „Kopieren". Echte 1-Klick-Copy-Buttons
 * gibt es auf der verlinkten Bestellseite.
 */
export function emailValueBox(opts: { label: string; value: string; mono?: boolean }): string {
  const valueStyle = opts.mono
    ? "font-family:'SFMono-Regular',Consolas,Menlo,monospace;font-size:16px;letter-spacing:0;"
    : "font-size:15px;";
  return `<div style="margin:8px 0;padding:12px 14px;background:#ffffff;border:1px solid #ececf0;border-radius:10px;">
    <div style="font-size:10px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:#8e8e93;line-height:1.2;margin-bottom:6px;">${escapeHtml(opts.label)}</div>
    <div style="color:#1a1a1a;font-weight:600;word-break:break-all;line-height:1.4;${valueStyle}">${escapeHtml(opts.value)}</div>
  </div>`;
}

export function renderEmail(opts: RenderEmailOptions): string {
  const preheader = opts.preheader ?? "";
  const eyebrow = opts.eyebrow ?? "";

  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light only" />
<meta name="supported-color-schemes" content="light" />
<title>${escapeHtml(brand.name)}</title>
<style>
  body { margin:0; padding:0; background:#f5f5f7; -webkit-font-smoothing:antialiased; }
  a { color:#0066cc; text-decoration:none; }
  img { -ms-interpolation-mode:bicubic; }
  table { border-collapse:collapse; }

  /* Phones */
  @media (max-width:600px) {
    .container { width:100% !important; border-radius:12px !important; }
    .px { padding-left:18px !important; padding-right:18px !important; }
    .logo-img { width:140px !important; max-width:140px !important; height:auto !important; }
    .h1 { font-size:20px !important; line-height:1.3 !important; }
    .body-text { font-size:15px !important; line-height:1.55 !important; }
  }

  /* Sehr schmale Geräte */
  @media (max-width:380px) {
    .px { padding-left:14px !important; padding-right:14px !important; }
    .logo-img { width:120px !important; max-width:120px !important; }
  }

  /* Dark-Mode-Hinweis */
  @media (prefers-color-scheme: dark) {
    /* Wir bleiben bewusst hell — viele Mail-Clients ignorieren Dark-Mode-CSS */
  }
</style>
</head>
<body style="margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;">
  <span style="display:none !important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;font-size:1px;line-height:1px;max-height:0;max-width:0;overflow:hidden;">${escapeHtml(preheader)}</span>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f5f5f7;">
    <tr>
      <td align="center" style="padding:28px 16px;">

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="container" style="width:600px;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 0 rgba(0,0,0,0.04);">

          <tr>
            <td class="px" align="left" style="padding:28px 36px 8px;border-bottom:1px solid #ececf0;">
              <a href="${escapeHtml(SITE_URL)}" style="display:inline-block;text-decoration:none;">
                <img src="${escapeHtml(LOGO_URL)}" alt="${escapeHtml(brand.name)}" width="180" class="logo-img" style="display:block;border:0;outline:none;text-decoration:none;width:180px;max-width:180px;height:auto;" />
              </a>
            </td>
          </tr>

          ${
            eyebrow
              ? `<tr><td class="px" align="left" style="padding:18px 36px 0;">
                  <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#0066cc;">${escapeHtml(eyebrow)}</p>
                </td></tr>`
              : ""
          }

          <tr>
            <td class="px" style="padding:18px 36px 32px;font-size:15px;line-height:1.55;color:#1a1a1a;">
              ${opts.contentHtml}
            </td>
          </tr>

          <tr>
            <td class="px" style="padding:22px 36px;background:#fafafb;border-top:1px solid #ececf0;font-size:12px;line-height:1.55;color:#636366;">
              <p style="margin:0 0 6px;font-weight:600;color:#1a1a1a;">${escapeHtml(brand.name)}</p>
              <p style="margin:0 0 4px;">${escapeHtml(brand.legalName)}</p>
              <p style="margin:0 0 4px;">${escapeHtml(brand.addressLine1)}, ${escapeHtml(brand.zip)} ${escapeHtml(brand.city)}, ${escapeHtml(brand.country)}</p>
              <p style="margin:0 0 10px;">
                <a href="${escapeHtml(SITE_URL)}" style="color:#0066cc;">${escapeHtml(brand.domainDisplay)}</a>
                &nbsp;&nbsp;
                <a href="mailto:${escapeHtml(brand.email)}" style="color:#0066cc;">${escapeHtml(brand.email)}</a>
              </p>
              <p style="margin:0;font-size:11px;color:#8e8e93;">
                Research-Use-Only (RUO). Nur für professionelle Labor und in vitro Forschung. Nicht zur Anwendung am Menschen oder Tier.
              </p>
            </td>
          </tr>

        </table>

        <p style="margin:14px 0 0;font-size:11px;color:#8e8e93;">
          Diese Nachricht wurde automatisch von ${escapeHtml(SITE_URL.replace(/^https?:\/\//, ""))} erzeugt.
        </p>

      </td>
    </tr>
  </table>
</body>
</html>`;
}
