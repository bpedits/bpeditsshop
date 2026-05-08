/** Lokaler Warenkorb (localStorage) — Referenzpreise; Zahlung optional über Stripe-Checkout. */

import { formatReferenceEur } from "@/lib/reference-price";
import { effectiveReferencePerVialForSku } from "@/lib/volume-price-tiers";

export const CART_STORAGE_KEY = "bp-shop-cart-v1";
const PROMO_CODE_KEY = "bp-shop-promo-code-v1";

const CART_EVENT = "bp-cart-change";

export type CartLine = {
  sku: string;
  productName: string;
  productSlug: string;
  packLabel: string;
  listPriceEur: number;
  qty: number;
};

function emitCartChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CART_EVENT));
}

export function subscribeCart(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CART_EVENT, callback);
  return () => window.removeEventListener(CART_EVENT, callback);
}

export function readCartLines(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const out: CartLine[] = [];
    for (const row of parsed) {
      if (!row || typeof row !== "object") continue;
      const o = row as Record<string, unknown>;
      const sku = String(o.sku ?? "").trim();
      if (!sku) continue;
      const qty = Math.min(999, Math.max(1, Math.floor(Number(o.qty)) || 1));
      const legacyUsd = o.listPriceUsd;
      const rawEur = o.listPriceEur ?? legacyUsd;
      const listPriceEur =
        typeof rawEur === "number" && Number.isFinite(rawEur) ? rawEur : 0;
      out.push({
        sku,
        productName: String(o.productName ?? "").trim() || sku,
        productSlug: String(o.productSlug ?? "").trim(),
        packLabel: String(o.packLabel ?? "").trim(),
        listPriceEur,
        qty,
      });
    }
    return out;
  } catch {
    return [];
  }
}

function resolvedListPriceEur(sku: string, qty: number, fallback: number): number {
  return effectiveReferencePerVialForSku(sku, qty) ?? fallback;
}

function persist(lines: CartLine[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
  emitCartChange();
}

export function writeCartLines(lines: CartLine[]) {
  persist(lines);
}

export function readPromoCode(): string {
  if (typeof window === "undefined") return "";
  try {
    return String(window.localStorage.getItem(PROMO_CODE_KEY) ?? "").trim();
  } catch {
    return "";
  }
}

export function writePromoCode(code: string) {
  if (typeof window === "undefined") return;
  const trimmed = code.trim().slice(0, 64);
  try {
    if (!trimmed) window.localStorage.removeItem(PROMO_CODE_KEY);
    else window.localStorage.setItem(PROMO_CODE_KEY, trimmed);
  } finally {
    emitCartChange();
  }
}

export function addToCart(line: Omit<CartLine, "qty"> & { qty?: number }) {
  const qty = Math.min(999, Math.max(1, line.qty ?? 1));
  const lines = readCartLines();
  const i = lines.findIndex((x) => x.sku.toUpperCase() === line.sku.toUpperCase());
  if (i >= 0) {
    const cur = lines[i]!;
    const newQty = Math.min(999, cur.qty + qty);
    const listPriceEur = resolvedListPriceEur(cur.sku, newQty, cur.listPriceEur);
    lines[i] = { ...cur, qty: newQty, listPriceEur };
  } else {
    const listPriceEur = resolvedListPriceEur(line.sku.trim(), qty, line.listPriceEur);
    lines.push({
      sku: line.sku.trim(),
      productName: line.productName.trim(),
      productSlug: line.productSlug.trim(),
      packLabel: line.packLabel.trim(),
      listPriceEur,
      qty,
    });
  }
  persist(lines);
}

export function setCartLineQty(sku: string, qty: number) {
  const q = Math.min(999, Math.max(1, Math.floor(qty)));
  const lines = readCartLines().map((x) => {
    if (x.sku.toUpperCase() !== sku.toUpperCase()) return x;
    const listPriceEur = resolvedListPriceEur(x.sku, q, x.listPriceEur);
    return { ...x, qty: q, listPriceEur };
  });
  persist(lines);
}

export function removeCartLine(sku: string) {
  const lines = readCartLines().filter((x) => x.sku.toUpperCase() !== sku.toUpperCase());
  persist(lines);
}

export function clearCart() {
  persist([]);
}

export function cartLineCount(lines: CartLine[]): number {
  return lines.reduce((s, l) => s + l.qty, 0);
}

export function cartReferenceSubtotal(lines: CartLine[]): number {
  return lines.reduce((s, l) => s + l.listPriceEur * l.qty, 0);
}

export function formatCartForInquiry(lines: CartLine[]): string {
  if (lines.length === 0) return "";
  return lines
    .map(
      (l) =>
        `${l.sku} — ${l.productName} (${l.packLabel}) · Menge ${l.qty} · Referenz ${formatReferenceEur(l.listPriceEur)}/Vial`,
    )
    .join("\n");
}
