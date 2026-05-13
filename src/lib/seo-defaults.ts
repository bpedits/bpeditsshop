import { brand } from "@/lib/brand";

/** Primäre Claim-Zeile für Startseite / globale OG-Fallbacks */
export const seoSiteTagline =
  "Peptide und Forschungsmaterialien für Labor & Institution — RUO / B2B, dokumentationsorientiert.";

export const seoHomeDescription = `${brand.name} (${brand.city}, ${brand.country}): Öffentlicher Forschungskatalog mit Referenzpreisen (EUR), CAS-Stammdaten wo hinterlegt, Qualitäts- und Versandrahmen für Einkauf & QA. Nur professionelle Forschung — kein Verbraucherschutz-Arzneimittelvertrieb.`;

export const seoGlobalKeywords = [
  "Peptide Forschung",
  "Peptide kaufen Labor",
  "RUO",
  "Research Use Only",
  "in vitro",
  "Labor",
  "B2B",
  "Forschungsmaterialien",
  "Lyophilisat",
  "Institutionelle Beschaffung",
  "Wissenschaftliche Einrichtung",
  "QA",
  "Qualitätssicherung",
  "CoA",
  "Zertifikat of Analysis",
  "Chargenrückverfolgung",
  "CAS-Nummer",
  "Summenformel",
  brand.city,
  brand.country,
  "EU",
  "Europa",
  "Deutschland",
  "Bayern",
  "Ingolstadt Forschung",
] as const;

/** Kurztext für maschinenlesbare Übersichten (z. B. llms.txt). */
export const seoAiSiteSummary = `${brand.name} (${brand.city}): Öffentlicher RUO-Forschungskatalog (Peptide & Referenzmaterialien), institutionelle Anfragen, Checkout per Banküberweisung, Lieferung in Europa; keine Verbraucher-Arzneimittel — nur professionelle Labor-/in-vitro-Forschung.`;
