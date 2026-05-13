import { escapeHtml } from "@/lib/escape-html";
import { EUROPE_SHIPPING_CODES, europeShippingCountryLabel } from "@/lib/europe-shipping-countries";

/** Deutsche Bundesländer (amtlich übliche Kürzel). */
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

/** In der DB: kein deutsches Bundesland, stattdessen Region/Kanton Freitext (optional). */
export const SHIPPING_NON_DE_REGION_CODE = "--";

const MAX = {
  street1: 200,
  street2: 200,
  postal: 16,
  city: 120,
  region: 120,
};

export type ShippingAddress = {
  countryCode: string;
  countryLabel: string;
  bundeslandCode: string;
  bundeslandLabel: string;
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

function normalizePostal(raw: string, countryCode: string): string {
  const t = raw.trim();
  if (countryCode === "DE") {
    return t.replace(/\D/g, "").slice(0, 5);
  }
  return clip(t.replace(/\s+/g, " "), MAX.postal);
}

/**
 * Lieferadresse für **Europa** (Whitelist): Pflichtfelder; in DE zusätzlich Bundesland.
 */
export function parseShippingAddress(
  input: unknown,
): { ok: true; address: ShippingAddress } | { ok: false; error: string } {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Lieferadresse fehlt. Bitte alle Pflichtfelder ausfüllen." };
  }
  const o = input as Record<string, unknown>;
  let countryCode = String(o.countryCode ?? o.country ?? "DE")
    .trim()
    .toUpperCase();
  if (countryCode === "UK") countryCode = "GB";
  if (!countryCode || !EUROPE_SHIPPING_CODES.has(countryCode)) {
    return {
      ok: false,
      error: "Bitte ein gültiges Lieferland aus Europa auswählen.",
    };
  }

  const countryLabel = europeShippingCountryLabel(countryCode);
  const postalCode = normalizePostal(String(o.postalCode ?? o.zip ?? ""), countryCode);
  const city = clip(String(o.city ?? ""), MAX.city);
  const streetLine1 = clip(String(o.streetLine1 ?? o.street ?? o.address1 ?? ""), MAX.street1);
  const streetLine2 = clip(String(o.streetLine2 ?? o.address2 ?? ""), MAX.street2);

  let bundeslandCode: string;
  let bundeslandLabel: string;

  if (countryCode === "DE") {
    bundeslandCode = String(o.bundeslandCode ?? o.bundesland ?? "").trim().toUpperCase();
    if (!bundeslandCode || !BUNDESLAND_CODES.has(bundeslandCode)) {
      return { ok: false, error: "Bitte ein Bundesland auswählen." };
    }
    bundeslandLabel =
      DE_BUNDESLAND_OPTIONS.find((x) => x.code === bundeslandCode)?.label ?? bundeslandCode;
    if (!postalCode || postalCode.length !== 5) {
      return { ok: false, error: "Bitte eine gültige deutsche Postleitzahl (5 Ziffern) angeben." };
    }
  } else {
    bundeslandCode = SHIPPING_NON_DE_REGION_CODE;
    bundeslandLabel = clip(
      String(o.region ?? o.bundeslandLabel ?? o.state ?? ""),
      MAX.region,
    );
    if (!postalCode || postalCode.length < 2) {
      return { ok: false, error: "Bitte die Postleitzahl bzw. Postcode angeben." };
    }
  }

  if (!streetLine1 || streetLine1.length < 2) {
    return { ok: false, error: "Bitte Straße und Hausnummer angeben." };
  }
  if (!city || city.length < 2) {
    return { ok: false, error: "Bitte den Ort angeben." };
  }

  return {
    ok: true,
    address: {
      countryCode,
      countryLabel,
      bundeslandCode,
      bundeslandLabel,
      postalCode,
      city,
      streetLine1,
      streetLine2,
    },
  };
}

export function formatShippingBlockHtml(address: ShippingAddress): string {
  const line2 = address.streetLine2
    ? `<p style="margin:6px 0 0;">${escapeHtml(address.streetLine2)}</p>`
    : "";

  const regionLine =
    address.countryCode === "DE"
      ? `${escapeHtml(address.bundeslandLabel)} · ${escapeHtml(address.countryLabel)}`
      : address.bundeslandLabel
        ? `${escapeHtml(address.bundeslandLabel)} · ${escapeHtml(address.countryLabel)}`
        : escapeHtml(address.countryLabel);

  return `
    <div style="margin:18px 0;padding:14px 16px;background:#fafafa;border-radius:10px;border:1px solid #e8e8ed;font-size:14px;line-height:1.5;">
      <p style="margin:0 0 8px;font-weight:600;">Lieferadresse</p>
      <p style="margin:0;">${escapeHtml(address.streetLine1)}</p>
      ${line2}
      <p style="margin:8px 0 0;">${escapeHtml(address.postalCode)} ${escapeHtml(address.city)}</p>
      <p style="margin:6px 0 0;">${regionLine}</p>
    </div>
  `;
}

export { EUROPE_SHIPPING_COUNTRY_OPTIONS } from "@/lib/europe-shipping-countries";
