import { escapeHtml } from "@/lib/escape-html";

/** Deutsche Bundesländer (amtlich übliche Kürzel) — für Lieferadresse innerhalb Deutschlands. */
export const DE_BUNDESLAND_OPTIONS: ReadonlyArray<{ code: string; label: string }> = [
  { code: "BW", label: "Baden-Württemberg" },
  { code: "BY", label: "Bayern" },
  { code: "BE", label: "Berlin" },
  { code: "BB", label: "Brandenburg" },
  { code: "HB", label: "Bremen" },
  { code: "HH", label: "Hamburg" },
  { code: "HE", label: "Hessen" },
  { code: "MV", label: "Mecklenburg-Vorpommern" },
  { code: "NI", label: "Niedersachsen" },
  { code: "NW", label: "Nordrhein-Westfalen" },
  { code: "RP", label: "Rheinland-Pfalz" },
  { code: "SL", label: "Saarland" },
  { code: "SN", label: "Sachsen" },
  { code: "ST", label: "Sachsen-Anhalt" },
  { code: "SH", label: "Schleswig-Holstein" },
  { code: "TH", label: "Thüringen" },
];

const BUNDESLAND_CODES = new Set(DE_BUNDESLAND_OPTIONS.map((b) => b.code));

const MAX = {
  street1: 200,
  street2: 200,
  postal: 12,
  city: 120,
};

export type ShippingAddress = {
  /** Im Shop nur Lieferung nach DE — immer `DE`. */
  countryCode: "DE";
  bundeslandCode: string;
  postalCode: string;
  city: string;
  streetLine1: string;
  streetLine2: string;
};

function clip(s: string, max: number): string {
  const t = s.trim();
  return t.length > max ? t.slice(0, max) : t;
}

export function bundeslandLabel(code: string): string {
  const c = code.trim().toUpperCase();
  return DE_BUNDESLAND_OPTIONS.find((x) => x.code === c)?.label ?? c;
}

/**
 * Lieferadresse nur für **Deutschland**: Pflichtfelder inkl. Bundesland.
 */
export function parseShippingAddress(input: unknown): { ok: true; address: ShippingAddress } | { ok: false; error: string } {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Lieferadresse fehlt. Bitte alle Pflichtfelder ausfüllen." };
  }
  const o = input as Record<string, unknown>;
  const rawCountry = String(o.countryCode ?? o.country ?? "DE").trim().toUpperCase();
  if (rawCountry && rawCountry !== "DE") {
    return { ok: false, error: "Lieferung erfolgt nur innerhalb Deutschlands." };
  }

  const bundeslandCode = String(o.bundeslandCode ?? o.bundesland ?? "").trim().toUpperCase();
  const postalCode = clip(String(o.postalCode ?? o.zip ?? ""), MAX.postal);
  const city = clip(String(o.city ?? ""), MAX.city);
  const streetLine1 = clip(String(o.streetLine1 ?? o.street ?? o.address1 ?? ""), MAX.street1);
  const streetLine2 = clip(String(o.streetLine2 ?? o.address2 ?? ""), MAX.street2);

  if (!bundeslandCode || !BUNDESLAND_CODES.has(bundeslandCode)) {
    return { ok: false, error: "Bitte ein Bundesland auswählen." };
  }
  if (!streetLine1 || streetLine1.length < 2) {
    return { ok: false, error: "Bitte Straße und Hausnummer angeben." };
  }
  if (!postalCode || postalCode.length < 2) {
    return { ok: false, error: "Bitte die Postleitzahl angeben." };
  }
  if (!city || city.length < 2) {
    return { ok: false, error: "Bitte den Ort angeben." };
  }

  return {
    ok: true,
    address: {
      countryCode: "DE",
      bundeslandCode,
      postalCode,
      city,
      streetLine1,
      streetLine2,
    },
  };
}

export function formatShippingBlockHtml(address: ShippingAddress): string {
  const bl = bundeslandLabel(address.bundeslandCode);
  const line2 = address.streetLine2
    ? `<p style="margin:6px 0 0;">${escapeHtml(address.streetLine2)}</p>`
    : "";
  return `
    <div style="margin:18px 0;padding:14px 16px;background:#fafafa;border-radius:10px;border:1px solid #e8e8ed;font-size:14px;line-height:1.5;">
      <p style="margin:0 0 8px;font-weight:600;">Lieferadresse (Deutschland)</p>
      <p style="margin:0;">${escapeHtml(address.streetLine1)}</p>
      ${line2}
      <p style="margin:8px 0 0;">${escapeHtml(address.postalCode)} ${escapeHtml(address.city)}</p>
      <p style="margin:6px 0 0;">${escapeHtml(bl)} · Deutschland</p>
    </div>
  `;
}
