import type { Product } from "@/lib/product-types";
import { getDoseStripMeta, parseDoseFromPack } from "@/lib/product-dose";
import { formatReferenceEur } from "@/lib/reference-price";

/**
 * Zeigt mg/ml-Stufen + Referenz-EUR direkt auf dem Produktbild (Karte & Detail).
 * Preise sind als „pro Vial“ beschriftet.
 */
export function ProductImageDoseStrip({ product }: { product: Product }) {
  if (product.variants.length === 1) {
    const v = product.variants[0]!;
    const d = parseDoseFromPack(v.pack);
    const label = d?.doseLabel ?? v.sku;
    return (
      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="bg-gradient-to-t from-black/55 via-black/20 to-transparent px-3 pb-3 pt-10">
          <div className="flex justify-center">
            <span className="inline-flex max-w-[95%] items-center gap-2 rounded-full bg-white/93 px-3 py-2 text-[11px] font-semibold shadow-lg backdrop-blur-sm ring-1 ring-white/50">
              <span className="truncate text-foreground">{label}</span>
              <span className="shrink-0 tabular-nums text-muted">{formatReferenceEur(v.listPriceEur)}</span>
              <span className="sr-only">pro Vial, Referenz</span>
            </span>
          </div>
          <p className="mt-2 text-center text-[10px] font-medium tracking-wide text-white/90">pro Vial · Referenz</p>
        </div>
      </div>
    );
  }

  const { visible, more } = getDoseStripMeta(product, 6);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0">
      <div className="bg-gradient-to-t from-black/58 via-black/22 to-transparent px-2 pb-2.5 pt-12">
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {visible.map((item, i) => (
            <span
              key={`${item.label}-${item.eur}-${i}`}
              className="inline-flex items-center gap-1 rounded-full bg-white/92 px-2 py-1 text-[10px] font-semibold shadow-md backdrop-blur-sm ring-1 ring-white/45 sm:text-[11px]"
            >
              <span className="text-foreground">{item.label}</span>
              <span className="tabular-nums text-muted">{formatReferenceEur(item.eur)}</span>
            </span>
          ))}
          {more > 0 ? (
            <span className="rounded-full bg-white/25 px-2 py-1 text-[10px] font-bold text-white ring-1 ring-white/30">
              +{more}
            </span>
          ) : null}
        </div>
        <p className="mt-2 px-1 text-center text-[9px] font-medium leading-tight tracking-wide text-white/88 sm:text-[10px]">
          Auf der Produktseite Stufe wählen · Listenpreis EUR / Vial
        </p>
      </div>
    </div>
  );
}
