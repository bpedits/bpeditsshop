/** Mengenstaffel — Referenz € / Vial ab minQty (institutionelle Forschungsbestellungen). */
export type VolumePriceTier = {
  minQty: number;
  listPriceEur: number;
};

/**
 * B2B-Forschungskatalog: technische Angaben, keine Verbraucherpreise,
 * keine Checkout-relevanten Felder.
 */
export type ProductVariant = {
  sku: string;
  pack: string;
  /** Referenz-EUR pro Vial (Preisliste, ohne Umrechnung) */
  listPriceEur: number;
  /** Optional: eigene Staffel; sonst Standard-Forschungsstaffel aus `volume-price-tiers`. */
  volumeTiers?: VolumePriceTier[];
};

export type Product = {
  id: string;
  slug: string;
  /** Eine Katalognummer pro Produkt (alle Varianten z. B. 5 mg / 10 mg teilen dieselbe Nummer). */
  catalogNo: string;
  /** Standard-SKU (erste Variante nach Sortierung) — für Meta, Kurztext */
  sku: string;
  name: string;
  /** Kurzbeschreibung, technisch-neutral */
  shortDescription: string;
  /** Langtext in vitro / Labor, ohne Anwendungsversprechen */
  description: string;
  category: string;
  /** Platzhalter-Grafik */
  accent: string;
  casNumber: string | null;
  molecularFormula: string | null;
  molecularWeight: string | null;
  /** z. B. HPLC-Reinheit, spezifikationsbezogen */
  purity: string;
  /** SKU + angezeigte Ausführung (bereinigter Listenstring) */
  format: string;
  storageConditions: string;
  documentation: {
    coa: boolean;
    sds: boolean;
  };
  /** Dosierungen / SKUs — gleiche Produktbezeichnung, verschiedene Packungen */
  variants: ProductVariant[];
  /** Mindestpreis / Vial unter allen Varianten (Karten, Sortierung „ab …“) */
  listPriceEur?: number;
  /** Startseite „Bestseller“ — gesetzt per Slug-Liste in `bestseller-config` */
  bestseller?: boolean;
};
