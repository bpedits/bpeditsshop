/** Referenzpreisanzeige (EUR, ohne Wechselkurs — gleiche Zahlen wie früher in USD). */

export function formatReferenceEur(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: Number.isInteger(rounded) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(rounded);
}
