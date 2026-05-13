/**
 * Lieferländer (Europa) — ISO 3166-1 alpha-2, Anzeigenamen Deutsch.
 * Kein Versand nach Russland / Belarus (Whitelist).
 */
const EUROPE_NAMES: Record<string, string> = {
  AD: "Andorra",
  AL: "Albanien",
  AT: "Österreich",
  BA: "Bosnien und Herzegowina",
  BE: "Belgien",
  BG: "Bulgarien",
  CH: "Schweiz",
  CY: "Zypern",
  CZ: "Tschechien",
  DE: "Deutschland",
  DK: "Dänemark",
  EE: "Estland",
  ES: "Spanien",
  FI: "Finnland",
  FR: "Frankreich",
  GB: "Vereinigtes Königreich",
  GR: "Griechenland",
  HR: "Kroatien",
  HU: "Ungarn",
  IE: "Irland",
  IS: "Island",
  IT: "Italien",
  LI: "Liechtenstein",
  LT: "Litauen",
  LU: "Luxemburg",
  LV: "Lettland",
  MC: "Monaco",
  MD: "Moldau",
  ME: "Montenegro",
  MK: "Nordmazedonien",
  MT: "Malta",
  NL: "Niederlande",
  NO: "Norwegen",
  PL: "Polen",
  PT: "Portugal",
  RO: "Rumänien",
  RS: "Serbien",
  SE: "Schweden",
  SI: "Slowenien",
  SK: "Slowakei",
  SM: "San Marino",
  UA: "Ukraine",
  VA: "Vatikanstadt",
  XK: "Kosovo",
};

export const EUROPE_SHIPPING_CODES = new Set(Object.keys(EUROPE_NAMES));

/** Deutschland zuerst, danach alphabetisch nach deutschem Namen. */
export const EUROPE_SHIPPING_COUNTRY_OPTIONS: ReadonlyArray<{ code: string; label: string }> = [
  { code: "DE", label: "Deutschland" },
  ...Object.entries(EUROPE_NAMES)
    .filter(([c]) => c !== "DE")
    .map(([code, label]) => ({ code, label }))
    .sort((a, b) => a.label.localeCompare(b.label, "de")),
];

export function europeShippingCountryLabel(code: string): string {
  const c = code.trim().toUpperCase();
  return EUROPE_NAMES[c] ?? c;
}
