/** Zentrale Navigations- und Footer-Struktur */

export const headerNav = [
  { href: "/shop", label: "Katalog" },
  { href: "/versand", label: "Versand" },
  { href: "/qualitaet-labor", label: "Qualität" },
  { href: "/affiliate", label: "Partner" },
  { href: "/hilfe", label: "Hilfe" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

/** Zusätzliche Einträge nur im Mobilmenü (kompakt, ohne komplette Footer-Liste). */
export const mobileMenuSecondary = [
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/sicherheit-vertraulichkeit", label: "Sicherheit & Vertraulichkeit" },
  { href: "/forschungsbedingungen-b2b", label: "Forschungsbedingungen (B2B)" },
  { href: "/rechtliches", label: "Rechtliches" },
] as const;

export const footerService = [
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/checkout", label: "Warenkorb" },
  { href: "/anfrage", label: "Institutionelle Anfrage" },
  { href: "/hilfe", label: "Hilfe & FAQ" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/sicherheit-vertraulichkeit", label: "Sicherheit & Vertraulichkeit" },
  { href: "/qualitaet-labor", label: "Qualität & Labor" },
  { href: "/versand", label: "Versand & Lieferung" },
  { href: "/affiliate", label: "Partnerprogramm" },
] as const;

export const footerLegal = [
  { href: "/forschungsbedingungen-b2b", label: "B2B-Forschungsbedingungen" },
  { href: "/agb", label: "AGB" },
  { href: "/widerruf", label: "Widerruf" },
  { href: "/zahlung-versand", label: "Lieferung & Konditionen" },
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
  { href: "/cookies", label: "Cookie-Hinweis" },
  { href: "/barrierefreiheit", label: "Barrierefreiheit" },
] as const;
