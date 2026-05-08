/**
 * Marken-Stammdaten (UI + Pflichtangaben Impressum/Kontakt).
 */
export const brand = {
  name: "Bavaria Peptides",
  /** Vollständiger Impressums-Name (TMG): Betriebsbezeichnung + Inhaber */
  legalName: "Bavaria Peptides, Inhaber Matthew Curtis",
  /** Für Kurzzeilen / gleich lautende Formulierung in Fließtexten */
  legalFormDisplay: "Einzelunternehmen",
  /** Kanonische Domain (Kleinbuchstaben) */
  domain: "bavaria-peptides.com",
  /** Für Anzeige in Fließtext */
  domainDisplay: "Bavaria-Peptides.com",
  origin: "https://bavaria-peptides.com",
  /** Öffentliche Kontakt-E-Mail (Impressum, Datenschutz, Antworten, strukturierte Daten) */
  email: "info@bavaria-peptides.com",
  /** Nur Eingang Kontaktformular (/api/contact) — nicht zwangsläufig im Impressum */
  contactFormInboxEmail: "update.acht@gmail.com",
  /** Leer lassen = keine Telefonzeile (Impressum, Kontakt, strukturierte Daten). */
  phoneDisplay: "",
  addressLine1: "Annette-Kolb-Straße 39",
  zip: "85055",
  city: "Ingolstadt",
  country: "Deutschland",
  managingDirector: "Matthew Curtis",
  /**
   * Handelsregister: typisch kein Eintrag bei reinem Einzelunternehmen ohne Kaufmannseigenschaft.
   */
  registerNote:
    "Für dieses Einzelunternehmen besteht kein Eintrag im Handelsregister. Gewerbeanmeldung nach GewO.",
  /**
   * Umsatzsteuer im Impressum — bei Erlangung einer USt-IdNr. Text mit Steuerberater ersetzen.
   */
  vatNotice:
    "Gemäß § 19 UStG wird als Kleinunternehmer keine Umsatzsteuer berechnet und folglich nicht ausgewiesen.",
} as const;

export function brandPhoneHref(): string | null {
  const raw = brand.phoneDisplay.trim();
  if (!raw) return null;
  const digits = raw.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : null;
}

export const researchDisclaimerShort =
  "Nur für professionelle Forschungszwecke (in vitro / Labor). Kein Arzneimittel. Nicht zur Anwendung am Menschen oder Tier bestimmt.";
