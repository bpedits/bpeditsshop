"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ProductVariant } from "@/lib/product-types";
import { formatReferenceEur } from "@/lib/reference-price";
import {
  activeTierForQty,
  getVolumeTiersForVariant,
  nextCheaperTier,
  unitsUntilNextTier,
} from "@/lib/volume-price-tiers";

type Props = { variant: ProductVariant; qty: number };

/** Fortschritt 0–100: Strecke von aktueller Staffel-Untergrenze bis zur nächsten Schwelle (dann erneut ab 0 %). */
function progressTowardNextTier(
  safeQty: number,
  activeMinQty: number,
  nextMinQty: number | null,
): number {
  if (nextMinQty == null) return 100;
  const span = nextMinQty - activeMinQty;
  if (span <= 0) return 100;
  const raw = (safeQty - activeMinQty) / span;
  return Math.min(100, Math.max(0, raw * 100));
}

/**
 * Institutionelle Mengen-Referenzstaffel + Fortschritt bis nächste günstigere Stufe (Apple-nah: ruhige Animation).
 */
export function VolumeInstitutionBulk({ variant, qty }: Props) {
  const tiers = useMemo(() => getVolumeTiersForVariant(variant), [variant]);
  const safeQty = Math.min(999, Math.max(1, Math.floor(qty)));
  const active = useMemo(() => activeTierForQty(safeQty, tiers), [safeQty, tiers]);
  const next = useMemo(() => nextCheaperTier(safeQty, tiers), [safeQty, tiers]);
  const left = useMemo(() => unitsUntilNextTier(safeQty, tiers), [safeQty, tiers]);

  const progressPct = useMemo(
    () => progressTowardNextTier(safeQty, active.minQty, next?.minQty ?? null),
    [safeQty, active.minQty, next],
  );

  const prevListRef = useRef<number | null>(null);
  /** Erhöht sich nur bei günstigerer Staffel → remount + einmalige „Erfüllt“-Animation. */
  const [fulfilledKey, setFulfilledKey] = useState(0);

  useEffect(() => {
    prevListRef.current = null;
    setFulfilledKey(0);
  }, [variant.sku]);

  useEffect(() => {
    const prev = prevListRef.current;
    prevListRef.current = active.listPriceEur;
    if (prev === null) return;
    if (active.listPriceEur < prev - 0.0001) {
      setFulfilledKey((k) => k + 1);
    }
  }, [active.listPriceEur]);

  const fulfilledClass =
    fulfilledKey > 0
      ? "motion-safe:animate-[bp-tier-fulfilled_0.85s_cubic-bezier(0.25,0.1,0.25,1)_both] motion-reduce:animate-none"
      : "";

  return (
    <div className="rounded-2xl border border-black/[0.06] bg-gradient-to-b from-white via-surface-pearl/30 to-surface-pearl/70 px-3.5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] ring-1 ring-black/[0.03] sm:px-4 sm:py-4.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
        Forschungsbezogene Mengenstaffel
      </p>
      <p className="mt-1 text-[11px] leading-snug text-muted sm:text-[12px]">
        Referenz EUR / Vial ab Schwellenmenge — skaliert mit Laborbedarf; verbindliche Konditionen nach Prüfung.
      </p>
      <ul className="mt-3.5 flex flex-wrap gap-2 text-[11px] tabular-nums text-muted sm:gap-2.5 sm:text-[12px]">
        {tiers.map((t) => {
          const on = t.minQty === active.minQty;
          return (
            <li
              key={t.minQty}
              className={`rounded-full px-2.5 py-1 transition-[background-color,box-shadow,color,transform] motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                on
                  ? "scale-[1.02] bg-tint/12 font-semibold text-foreground shadow-[0_4px_14px_-8px_rgba(0,102,204,0.45)] ring-1 ring-tint/22 motion-reduce:scale-100"
                  : "bg-black/[0.035] ring-1 ring-transparent hover:bg-black/[0.05]"
              }`}
            >
              {t.minQty}+ · {formatReferenceEur(t.listPriceEur)}
            </li>
          );
        })}
      </ul>
      <div className="mt-3.5 h-1.5 overflow-hidden rounded-full bg-black/[0.07] shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-tint via-tint/85 to-tint/70 motion-safe:transition-[width] motion-safe:duration-[520ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <p className="mt-3 text-[12px] leading-relaxed text-muted motion-safe:transition-opacity motion-safe:duration-200 sm:text-[13px]">
        Bei <strong className="font-medium text-foreground">{safeQty}</strong> Vials in dieser Auswahl:{" "}
        <strong
          key={fulfilledKey}
          className={`inline-block font-medium text-foreground will-change-transform ${fulfilledClass}`}
        >
          {formatReferenceEur(active.listPriceEur)}
        </strong>{" "}
        Referenz / Vial.
        {next != null && left != null ? (
          <>
            {" "}
            Noch <strong className="font-medium text-foreground">{left}</strong> Vial
            {left === 1 ? "" : "s"} bis Stufe <strong className="font-medium text-foreground">{next.minQty}+</strong>{" "}
            ({formatReferenceEur(next.listPriceEur)} / Vial).
          </>
        ) : (
          <> Höchste hinterlegte Referenzstaffel in dieser Vorschau.</>
        )}
      </p>
    </div>
  );
}
