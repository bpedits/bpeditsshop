"use client";

import { formatReferenceEur } from "@/lib/reference-price";

type Props = {
  /** Referenz € pro Vial (Staffel), ohne Wechselkurs-Umrechnung */
  perVialEur: number;
  qty: number;
  className?: string;
};

/**
 * Zeigt Preis + Positions-Summe; kurze Animation bei Änderung (Apple-nah, dezent).
 */
export function AnimatedReferencePrice({ perVialEur, qty, className = "" }: Props) {
  const per = formatReferenceEur(perVialEur);
  const line = Math.round(perVialEur * qty * 100) / 100;
  const lineStr = formatReferenceEur(line);

  return (
    <div className={className}>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
        <span
          key={`${per}-${qty}`}
          className="text-[clamp(1.85rem,6vw,2.5rem)] font-semibold tabular-nums tracking-[-0.02em] text-foreground motion-safe:animate-[bp-price-tick_0.4s_cubic-bezier(0.25,0.1,0.25,1)_both] motion-reduce:animate-none"
        >
          {per}
        </span>
        <span className="text-[15px] font-semibold text-muted sm:text-[16px]">pro Vial · Referenz</span>
      </div>
      <p className="mt-3 text-[14px] font-medium tabular-nums text-muted sm:text-[15px]">
        <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">Positions-Summe</span>
        <span className="mx-2 text-black/[0.12]">·</span>
        <span
          key={lineStr}
          className="text-[16px] font-semibold text-foreground sm:text-[17px] motion-safe:animate-[bp-price-tick_0.38s_cubic-bezier(0.25,0.1,0.25,1)_both] motion-reduce:animate-none"
        >
          {lineStr}
        </span>
        <span className="font-normal text-muted"> bei {qty} Vial{qty === 1 ? "" : "s"}</span>
      </p>
    </div>
  );
}
