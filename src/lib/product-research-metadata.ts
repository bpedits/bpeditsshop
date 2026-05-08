/**
 * Chemische Referenzdaten (Summenformel, Molekulargewicht, CAS, Lagerhinweis) — Abgleich mit
 * internem Dokument „Datenstruktur und Preismodelle“ (Forschungs-/RUO-Kontext).
 * Keine stillschweigende Garantie gegenüber Chargen-CoA; CoA bleibt maßgeblich.
 */

export type ResearchMetadata = {
  casNumber: string | null;
  molecularFormula: string | null;
  molecularWeight: string | null;
  /** Wenn gesetzt: überschreibt die generische Kategorie-Lagerung für dieses Produkt. */
  storageConditions?: string;
};

/** Normalisierung für Lookup (Preislisten-`name` → Schlüssel). */
export function normalizeProductNameKey(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[+/]/g, " ")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Mehrere Schreibweisen aus Katalog / PDF → ein Datensatz. */
const ALIASES_TO_CANONICAL: readonly { aliases: readonly string[]; key: string }[] = [
  { aliases: ["igf-1 lr3", "igf 1 lr3"], key: "igf-1 lr3" },
  { aliases: ["mots-c", "mots c"], key: "mots-c" },
  { aliases: ["mt-2", "mt 2", "melanotan ii"], key: "mt-2" },
  { aliases: ["epithalon"], key: "epithalon" },
  { aliases: ["pt141", "pt-141", "bremelanotide"], key: "pt-141" },
  { aliases: ["selank"], key: "selank" },
  { aliases: ["semax"], key: "semax" },
  { aliases: ["tesamorelin"], key: "tesamorelin" },
  { aliases: ["ipamorelin"], key: "ipamorelin" },
  { aliases: ["mazdutide"], key: "mazdutide" },
  { aliases: ["survodutide"], key: "survodutide" },
  { aliases: ["adipotide"], key: "adipotide" },
  { aliases: ["ll37", "ll-37"], key: "ll-37" },
  { aliases: ["ara-290", "ara 290", "cibinetide"], key: "ara-290" },
  { aliases: ["snap-8", "snap 8"], key: "snap-8" },
  { aliases: ["5-amino-1mq", "5 amino 1mq"], key: "5-amino-1mq" },
  { aliases: ["aicar"], key: "aicar" },
  { aliases: ["bpc", "bpc-157"], key: "bpc-157" },
  { aliases: ["tb", "tb-500", "thymosin beta-4", "thymosin b4"], key: "tb-500" },
  { aliases: ["nad", "nad+"], key: "nad+" },
  { aliases: ["ghk-cu", "ghk cu"], key: "ghk-cu" },
  { aliases: ["kisspeptin-10", "kisspeptin 10"], key: "kisspeptin-10" },
  { aliases: ["glutathione", "gsh"], key: "glutathione" },
  { aliases: ["dsip"], key: "dsip" },
  { aliases: ["kpv"], key: "kpv" },
  { aliases: ["ss-31", "ss 31"], key: "ss-31" },
  { aliases: ["cjc no dac", "cjc no dac 5mg", "cjc-1295 no dac"], key: "cjc-1295 no dac" },
  { aliases: ["cjc dac", "cjc dac", "cjc+ dac"], key: "cjc-1295 dac" },
  { aliases: ["aod", "aod-9604"], key: "aod-9604" },
  { aliases: ["semaglutide"], key: "semaglutide" },
  { aliases: ["tirzepatide"], key: "tirzepatide" },
  { aliases: ["retatrutide"], key: "retatrutide" },
  { aliases: ["cagrilintide"], key: "cagrilintide" },
];

const BY_CANONICAL: Readonly<Record<string, ResearchMetadata>> = {
  "igf-1 lr3": {
    casNumber: "946870-92-4",
    molecularFormula: "C400H625N111O115S9",
    molecularWeight: "9117.60 g/mol",
    storageConditions: "−20 °C, trocken, lichtgeschützt (Lyophilisat — maßgeblich CoA).",
  },
  "mots-c": {
    casNumber: "1627580-64-6",
    molecularFormula: "C101H152N28O22S2",
    molecularWeight: "2174.62 g/mol",
  },
  "mt-2": {
    casNumber: "121062-08-6",
    molecularFormula: "C50H69N15O9",
    molecularWeight: "1024.2 g/mol",
  },
  epithalon: {
    casNumber: "307297-39-8",
    molecularFormula: "C14H22N4O9",
    molecularWeight: "390.35 g/mol",
  },
  "pt-141": {
    casNumber: "189691-06-3",
    molecularFormula: "C50H68N14O10",
    molecularWeight: "1025.18 g/mol",
  },
  selank: {
    casNumber: "129954-34-3",
    molecularFormula: "C33H57N11O9",
    molecularWeight: "751.87 g/mol",
  },
  semax: {
    casNumber: "80714-61-0",
    molecularFormula: "C37H51N9O10S",
    molecularWeight: "813.93 g/mol",
  },
  tesamorelin: {
    casNumber: "218949-48-5",
    molecularFormula: "C221H366N72O67S",
    molecularWeight: "5135.9 g/mol",
  },
  ipamorelin: {
    casNumber: "170851-70-4",
    molecularFormula: "C38H49N9O5",
    molecularWeight: "711.87 g/mol",
  },
  mazdutide: {
    casNumber: "2259884-03-0",
    molecularFormula: "C210H322N46O67",
    molecularWeight: "4563.06 g/mol",
  },
  survodutide: {
    casNumber: "2805997-46-8",
    molecularFormula: "C192H289N47O61",
    molecularWeight: "4231.69 g/mol",
  },
  adipotide: {
    casNumber: "1378632-77-1",
    molecularFormula: "C111H206N36O28S2",
    molecularWeight: "2557.16 g/mol",
  },
  "ll-37": {
    casNumber: "154947-66-7",
    molecularFormula: "C205H340N60O53",
    molecularWeight: "4493.37 g/mol",
  },
  "ara-290": {
    casNumber: "1208243-50-8",
    molecularFormula: "C51H84N16O21",
    molecularWeight: "1257.32 g/mol",
  },
  "snap-8": {
    casNumber: "868844-74-0",
    molecularFormula: "C41H70N16O6S",
    molecularWeight: "1075.16 g/mol",
  },
  "5-amino-1mq": {
    casNumber: "685079-15-6",
    molecularFormula: "C10H11N2+ (Kation)",
    molecularWeight: "159.21 g/mol",
    storageConditions: "Raumtemperatur, trocken — gemäß Datenblatt / CoA.",
  },
  aicar: {
    casNumber: "2627-69-2",
    molecularFormula: "C9H15N4O8P",
    molecularWeight: "338.21 g/mol",
  },
  "bpc-157": {
    casNumber: "137525-51-0",
    molecularFormula: "C62H98N16O22",
    molecularWeight: "1419.56 g/mol",
  },
  "tb-500": {
    casNumber: "77591-33-4",
    molecularFormula: "C204H318N56O61S (Thymosin β4-Fragment)",
    molecularWeight: "4514.04 g/mol",
    storageConditions: "Gefrier/trocken: typ. ≤ −18 °C bzw. −20 °C — verbindlich CoA / Etikett.",
  },
  "nad+": {
    casNumber: "53-84-9",
    molecularFormula: "C21H28N7O14P2 (oxid.)",
    molecularWeight: "664.4 g/mol",
    storageConditions: "Trocken und dunkel; Lösungen typ. 2–8 °C — CoA beachten.",
  },
  "ghk-cu": {
    casNumber: "49557-75-7",
    molecularFormula: "C14H24N6O4Cu",
    molecularWeight: "403.9 g/mol",
    storageConditions: "Lichtgeschützt, luftdicht verschlossen.",
  },
  "kisspeptin-10": {
    casNumber: "374675-21-5",
    molecularFormula: "C63H83N17O14",
    molecularWeight: "1302.51 g/mol",
  },
  glutathione: {
    casNumber: "70-18-8",
    molecularFormula: "C10H17N3O6S",
    molecularWeight: "307.32 g/mol",
  },
  dsip: {
    casNumber: "62568-57-4",
    molecularFormula: "C47H48N12O6",
    molecularWeight: "848 g/mol",
  },
  kpv: {
    casNumber: "67727-97-3",
    molecularFormula: "C16H30N4O4",
    molecularWeight: "342.43 g/mol",
  },
  "ss-31": {
    casNumber: "736992-21-5",
    molecularFormula: "C32H49N9O5",
    molecularWeight: "≈ 639.8 g/mol",
  },
  "cjc-1295 no dac": {
    casNumber: "863288-34-0",
    molecularFormula: "C152H252N44O42",
    molecularWeight: "3367.9 g/mol",
  },
  "cjc-1295 dac": {
    casNumber: "446262-90-4",
    molecularFormula: "C165H269N47O46",
    molecularWeight: "3647.19 g/mol",
  },
  "aod-9604": {
    casNumber: "221231-10-3",
    molecularFormula: "C78H123N23O23S2",
    molecularWeight: "1815.1 g/mol",
  },
  semaglutide: {
    casNumber: "910463-68-2",
    molecularFormula: "C187H291N45O59",
    molecularWeight: "4113.64 g/mol",
  },
  tirzepatide: {
    casNumber: "2023788-19-2",
    molecularFormula: "C225H348N48O68",
    molecularWeight: "4813.53 g/mol",
  },
  retatrutide: {
    casNumber: "2381089-83-2",
    molecularFormula: "C221H342N46O68",
    molecularWeight: "4731.33 g/mol",
  },
  cagrilintide: {
    casNumber: "1415456-99-3",
    molecularFormula: "C194H312N54O59S2",
    molecularWeight: "4409.01 g/mol",
  },
};

function buildAliasMap(): Map<string, ResearchMetadata> {
  const m = new Map<string, ResearchMetadata>();
  for (const { aliases, key } of ALIASES_TO_CANONICAL) {
    const data = BY_CANONICAL[key];
    if (!data) continue;
    for (const a of aliases) {
      m.set(normalizeProductNameKey(a), data);
    }
    m.set(normalizeProductNameKey(key), data);
  }
  return m;
}

const LOOKUP = buildAliasMap();

export function researchMetadataForProductName(name: string): ResearchMetadata | null {
  const k = normalizeProductNameKey(name);
  return LOOKUP.get(k) ?? null;
}
