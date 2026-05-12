/**
 * Server-only: persistente Speicherung von Bank-Bestellungen in Supabase.
 *
 * Schema: `shop.orders` + `shop.order_lines`.
 * Die API dieses Moduls (saveOrder, readOrder) ist identisch zur vorherigen
 * Datei-Implementierung, damit aufrufende Routen / Pages nichts wissen müssen.
 */
import { getSupabaseAdmin } from "@/lib/supabase-server";

const REF_RX = /^BP-[A-Z0-9]{1,20}-[A-Z0-9]{1,20}$/i;

export type StoredOrderLine = {
  sku: string;
  productSlug: string;
  productName: string;
  packLabel: string;
  qty: number;
  listPriceEur: number;
};

export type StoredShipping = {
  countryCode: "DE";
  bundeslandCode: string;
  bundeslandLabel: string;
  streetLine1: string;
  streetLine2?: string;
  postalCode: string;
  city: string;
};

export type StoredOrder = {
  orderRef: string;
  createdAtIso: string;
  email: string;
  name: string;
  company?: string;
  note?: string;
  promoCode?: string;
  shipping: StoredShipping;
  lines: StoredOrderLine[];
  totalEur: number;
  bankSnapshot: {
    accountHolder: string;
    iban: string;
    bic: string;
    institution?: string;
  };
};

type OrderRow = {
  order_ref: string;
  created_at: string;
  email: string;
  name: string;
  company: string | null;
  note: string | null;
  promo_code: string | null;
  shipping_country: string;
  shipping_bundesland_code: string;
  shipping_bundesland_label: string;
  shipping_street_line1: string;
  shipping_street_line2: string | null;
  shipping_postal_code: string;
  shipping_city: string;
  total_eur: number | string;
  bank_account_holder: string;
  bank_iban: string;
  bank_bic: string;
  bank_institution: string | null;
};

type LineRow = {
  sku: string;
  product_slug: string;
  product_name: string;
  pack_label: string;
  qty: number;
  list_price_eur: number | string;
};

function toStored(row: OrderRow, lines: LineRow[]): StoredOrder {
  return {
    orderRef: row.order_ref,
    createdAtIso: row.created_at,
    email: row.email,
    name: row.name,
    company: row.company || undefined,
    note: row.note || undefined,
    promoCode: row.promo_code || undefined,
    shipping: {
      countryCode: "DE",
      bundeslandCode: row.shipping_bundesland_code,
      bundeslandLabel: row.shipping_bundesland_label,
      streetLine1: row.shipping_street_line1,
      streetLine2: row.shipping_street_line2 || undefined,
      postalCode: row.shipping_postal_code,
      city: row.shipping_city,
    },
    lines: lines.map((l) => ({
      sku: l.sku,
      productSlug: l.product_slug,
      productName: l.product_name,
      packLabel: l.pack_label,
      qty: Number(l.qty),
      listPriceEur: Number(l.list_price_eur),
    })),
    totalEur: Number(row.total_eur),
    bankSnapshot: {
      accountHolder: row.bank_account_holder,
      iban: row.bank_iban,
      bic: row.bank_bic,
      institution: row.bank_institution || undefined,
    },
  };
}

export async function saveOrder(order: StoredOrder): Promise<void> {
  if (!REF_RX.test(order.orderRef)) {
    throw new Error(`Ungültiges OrderRef: ${order.orderRef}`);
  }
  const sb = getSupabaseAdmin();

  const { error: e1 } = await sb.from("orders").upsert(
    {
      order_ref: order.orderRef,
      created_at: order.createdAtIso,
      email: order.email,
      name: order.name,
      company: order.company ?? null,
      note: order.note ?? null,
      promo_code: order.promoCode ?? null,
      shipping_country: order.shipping.countryCode,
      shipping_bundesland_code: order.shipping.bundeslandCode,
      shipping_bundesland_label: order.shipping.bundeslandLabel,
      shipping_street_line1: order.shipping.streetLine1,
      shipping_street_line2: order.shipping.streetLine2 ?? null,
      shipping_postal_code: order.shipping.postalCode,
      shipping_city: order.shipping.city,
      total_eur: order.totalEur,
      bank_account_holder: order.bankSnapshot.accountHolder,
      bank_iban: order.bankSnapshot.iban,
      bank_bic: order.bankSnapshot.bic,
      bank_institution: order.bankSnapshot.institution ?? null,
    },
    { onConflict: "order_ref" },
  );
  if (e1) throw new Error(`orders insert: ${e1.message}`);

  // Bestehende Lines löschen (für den Fall, dass es Re-Save ist) und neu schreiben.
  const { error: eDel } = await sb.from("order_lines").delete().eq("order_ref", order.orderRef);
  if (eDel) throw new Error(`order_lines delete: ${eDel.message}`);

  if (order.lines.length > 0) {
    const { error: e2 } = await sb.from("order_lines").insert(
      order.lines.map((l) => ({
        order_ref: order.orderRef,
        sku: l.sku,
        product_slug: l.productSlug,
        product_name: l.productName,
        pack_label: l.packLabel,
        qty: l.qty,
        list_price_eur: l.listPriceEur,
      })),
    );
    if (e2) throw new Error(`order_lines insert: ${e2.message}`);
  }
}

export async function readOrder(orderRef: string): Promise<StoredOrder | null> {
  if (!REF_RX.test(orderRef)) return null;
  const sb = getSupabaseAdmin();
  const { data: row, error: e1 } = await sb
    .from("orders")
    .select("*")
    .eq("order_ref", orderRef)
    .maybeSingle();
  if (e1) throw new Error(`orders select: ${e1.message}`);
  if (!row) return null;
  const { data: lines, error: e2 } = await sb
    .from("order_lines")
    .select("sku,product_slug,product_name,pack_label,qty,list_price_eur")
    .eq("order_ref", orderRef)
    .order("id", { ascending: true });
  if (e2) throw new Error(`order_lines select: ${e2.message}`);
  return toStored(row as OrderRow, (lines ?? []) as LineRow[]);
}

/**
 * Bequeme Variante: alle Bestellungen mit Lines auf einmal abrufen,
 * sortiert nach `created_at` desc — vor allem für /admin-Listenseiten gedacht.
 */
export async function listAllOrders(): Promise<StoredOrder[]> {
  const sb = getSupabaseAdmin();
  const { data: rows, error: e1 } = await sb
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (e1) throw new Error(`orders list: ${e1.message}`);
  if (!rows || rows.length === 0) return [];

  const refs = rows.map((r) => (r as OrderRow).order_ref);
  const { data: lineRows, error: e2 } = await sb
    .from("order_lines")
    .select("order_ref,sku,product_slug,product_name,pack_label,qty,list_price_eur,id")
    .in("order_ref", refs)
    .order("id", { ascending: true });
  if (e2) throw new Error(`order_lines list: ${e2.message}`);

  const byRef = new Map<string, LineRow[]>();
  for (const l of (lineRows ?? []) as (LineRow & { order_ref: string })[]) {
    const arr = byRef.get(l.order_ref) ?? [];
    arr.push(l);
    byRef.set(l.order_ref, arr);
  }
  return (rows as OrderRow[]).map((r) => toStored(r, byRef.get(r.order_ref) ?? []));
}
