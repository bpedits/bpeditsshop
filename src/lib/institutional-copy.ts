/**
 * Kurze B2B-/RUO-Texte: sachlich, ohne Marketing-Siegel oder erfundene Kennzahlen.
 * Anpassen, sobald reale SLAs, Zertifikate oder Prozesse fixiert sind.
 */

export const institutionalPillars = [
  {
    title: "Prüfung vor Angebot",
    body: "Warenkorb dient der Zusammenstellung — ohne automatische Zahlung. Anfragen aus Instituten und Unternehmen prüfen wir, bevor es zu Verfügbarkeit, Konditionen und Dokumentation geht.",
  },
  {
    title: "Technische Transparenz",
    body: "SKU, Spezifikation und Speicherungshinweise im Katalog — damit Einkauf und QA dieselbe fachliche Basis nutzen.",
  },
  {
    title: "Nachvollziehbare nächste Schritte",
    body: "Sie erhalten eine strukturierte Rückmeldung zu Ihrer Anfrage — mit den nächsten fachlichen und administrativen Schritten.",
  },
] as const;

export const preFooterCta = {
  title: "Angebot für Ihre Organisation",
  body: "Mit SKU, ungefährer Menge und Lieferkontext der Einrichtung starten — wir antworten sachlich mit den nächsten Schritten.",
  label: "Institutionelle Anfrage",
  href: "/anfrage",
} as const;

export const shopTrustBullets = [
  "Nur B2B und RUO — keine Verbraucherbestellung über diesen Katalog.",
  "Preise und Lieferkonditionen erhalten Sie nach Prüfung Ihrer Anfrage.",
  "CoA/SDS und chargenbezogene Unterlagen dort, wo Sie sie fachlich und rechtlich absichern.",
] as const;

export const anfrageReassuranceBullets = [
  "Keine automatische Rechnung oder Zahlung über diese Website.",
  "Angaben zu Organisation und Verwendungszweck (RUO) sind Teil der Prüfung.",
  "Rückfragen klären wir schriftlich — ohne Callcenter-Druck.",
] as const;
