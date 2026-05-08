import { brand } from "@/lib/brand";

/** Primäre Claim-Zeile für Startseite / globale OG-Fallbacks */
export const seoSiteTagline =
  "Peptide und Forschungsmaterialien für Labor & Institution — RUO / B2B, dokumentationsorientiert.";

export const seoHomeDescription = `${brand.name} (${brand.city}, ${brand.country}): Öffentlicher Forschungskatalog mit Referenzpreisen (EUR), CAS-Stammdaten wo hinterlegt, Qualitäts- und Versandrahmen für Einkauf & QA. Nur professionelle Forschung — kein Verbraucherschutz-Arzneimittelvertrieb.`;

export const seoGlobalKeywords = [
  "Peptide Forschung",
  "RUO",
  "Research Use Only",
  "Labor",
  "B2B",
  "Forschungsmaterialien",
  "Lyophilisat",
  "Institutionelle Beschaffung",
  "QA",
  "CoA",
  "CAS-Nummer",
  brand.city,
  brand.country,
  "EU",
  "Deutschland",
] as const;
