"use client";

type Props = {
  qty: number;
  onQty: (n: number) => void;
  min?: number;
  max?: number;
  /** `cart`: eine Zeile, kleinere Buttons — für Warenkorbzeilen. */
  variant?: "default" | "cart";
  /** Nur bei `variant="cart"`: `aria-label` für die Gruppe (z. B. SKU). */
  ariaLabel?: string;
  /** Kurzzeile über dem Stepper */
  label?: string;
  /** Erklärung unter der Überschrift */
  hint?: string;
};

const stepBtnDefault =
  "group flex size-[44px] shrink-0 touch-manipulation items-center justify-center rounded-xl border border-black/[0.07] bg-white/95 text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_12px_-6px_rgba(0,0,0,0.12)] transition-[transform,background-color,border-color,box-shadow] motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:border-black/[0.11] hover:bg-white hover:shadow-[0_2px_6px_rgba(0,0,0,0.06)] active:scale-[0.94] disabled:pointer-events-none disabled:border-black/[0.05] disabled:bg-black/[0.03] disabled:text-muted disabled:opacity-45 disabled:shadow-none motion-reduce:transition-none motion-reduce:active:scale-100";

const stepBtnCart =
  "group flex size-9 shrink-0 touch-manipulation items-center justify-center rounded-lg border border-black/[0.08] bg-white/95 text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[transform,background-color,border-color,box-shadow] motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:border-black/[0.12] hover:bg-white active:scale-[0.94] disabled:pointer-events-none disabled:opacity-40 disabled:shadow-none motion-reduce:active:scale-100";

function IconMinus({ compact }: { compact?: boolean }) {
  return (
    <svg className={compact ? "size-[17px]" : "size-[19px]"} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        className="transition-[stroke-width] group-hover:stroke-[2.75]"
        d="M6 12h12"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconPlus({ compact }: { compact?: boolean }) {
  return (
    <svg className={compact ? "size-[17px]" : "size-[19px]"} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        className="transition-[stroke-width] group-hover:stroke-[2.75]"
        d="M12 6v12M6 12h12"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function QuantityStepper({
  qty,
  onQty,
  min = 1,
  max = 999,
  variant = "default",
  ariaLabel,
  label = "Menge",
  hint = "Vials — Referenzstaffel passt sich an",
}: Props) {
  const atMin = qty <= min;
  const atMax = qty >= max;
  const isCart = variant === "cart";
  const stepBtn = isCart ? stepBtnCart : stepBtnDefault;
  const groupLabel = isCart ? (ariaLabel ?? `Menge: ${qty} Vials`) : `${label}: ${qty} Vials`;

  const pill = (
    <div
      className={
        isCart
          ? "inline-flex items-center justify-center gap-0.5 rounded-[13px] border border-black/[0.08] bg-gradient-to-b from-white via-surface-pearl/35 to-surface-pearl/65 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_4px_16px_-12px_rgba(0,0,0,0.1)] ring-1 ring-black/[0.04]"
          : "inline-flex w-full items-center justify-between gap-2 rounded-[16px] border border-black/[0.08] bg-gradient-to-b from-white via-surface-pearl/40 to-surface-pearl/70 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_8px_28px_-18px_rgba(0,0,0,0.14)] ring-1 ring-black/[0.04] sm:w-auto sm:min-w-[200px] sm:justify-center sm:gap-1"
      }
    >
      <button
        type="button"
        aria-label="Eine Vial weniger"
        disabled={atMin}
        onClick={() => onQty(Math.max(min, qty - 1))}
        className={stepBtn}
      >
        <IconMinus compact={isCart} />
      </button>

      <div
        className={
          isCart
            ? "flex min-w-[2.5rem] flex-col items-center justify-center px-1"
            : "relative flex min-w-[4.5rem] flex-1 flex-col items-center justify-center px-2 sm:flex-initial sm:min-w-[4.75rem]"
        }
      >
        <span
          key={qty}
          className={
            isCart
              ? "text-[16px] font-semibold tabular-nums tracking-tight text-foreground motion-safe:animate-[bp-qty-pop_0.38s_cubic-bezier(0.34,1.2,0.64,1)_both] motion-reduce:animate-none"
              : "text-[22px] font-semibold tabular-nums tracking-tight text-foreground motion-safe:animate-[bp-qty-pop_0.42s_cubic-bezier(0.34,1.2,0.64,1)_both] motion-reduce:animate-none"
          }
        >
          {qty}
        </span>
        {isCart ? (
          <span className="sr-only">Vials</span>
        ) : (
          <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted">Vials</span>
        )}
      </div>

      <button
        type="button"
        aria-label="Eine Vial mehr"
        disabled={atMax}
        onClick={() => onQty(Math.min(max, qty + 1))}
        className={stepBtn}
      >
        <IconPlus compact={isCart} />
      </button>
    </div>
  );

  if (isCart) {
    return (
      <div className="flex items-center gap-2" role="group" aria-label={groupLabel}>
        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">Menge</span>
        {pill}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3.5 sm:flex-row sm:items-stretch sm:justify-between sm:gap-6">
      <div className="min-w-0 sm:pt-0.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
        <p className="mt-1 text-[12px] leading-snug text-muted sm:text-[13px]">{hint}</p>
      </div>

      <div className="motion-safe:animate-[bp-fade-up_0.45s_ease-out_both]" role="group" aria-label={groupLabel}>
        {pill}
      </div>
    </div>
  );
}
